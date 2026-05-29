import { db } from "@workspace/db";
import { emailLogsTable, usersTable, rfqsTable, rfqItemsTable, quotationsTable, companiesTable, productsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { sendEmail } from "./emailSender";
import {
  buildRfqOpenedEmail,
  buildQuotationSubmittedEmail,
  buildQuotationAwardedEmail,
  buildRfqClosedEmail,
  buildRfqCancelledEmail,
  buildCompanyVerifiedEmail,
  type EmailTemplateData,
} from "./emailTemplates";
import { logger } from "./logger";

export type EmailEventType = typeof emailLogsTable.$inferSelect["eventType"];
export type EmailEntityType = typeof emailLogsTable.$inferSelect["entityType"];

// ─── Deduplication ─────────────────────────────────────────────────────────
async function isDuplicate(
  eventType: EmailEventType,
  entityId: number,
  recipientEmail: string,
): Promise<boolean> {
  const existing = await db
    .select({ id: emailLogsTable.id })
    .from(emailLogsTable)
    .where(
      and(
        eq(emailLogsTable.eventType, eventType),
        eq(emailLogsTable.entityId, entityId),
        eq(emailLogsTable.recipientEmail, recipientEmail),
      ),
    )
    .limit(1);
  return existing.length > 0;
}

// ─── Queue entry + fire-and-forget ─────────────────────────────────────────
export async function queueEmail(opts: {
  eventType: EmailEventType;
  entityType: EmailEntityType;
  entityId: number;
  recipientEmail: string;
  templateData: EmailTemplateData;
}) {
  if (await isDuplicate(opts.eventType, opts.entityId, opts.recipientEmail)) {
    logger.info(
      { eventType: opts.eventType, entityId: opts.entityId, to: opts.recipientEmail },
      "Email duplicate — skipped",
    );
    return;
  }

  const [log] = await db
    .insert(emailLogsTable)
    .values({
      recipientEmail: opts.recipientEmail,
      eventType: opts.eventType,
      entityType: opts.entityType,
      entityId: opts.entityId,
      status: "pending",
    })
    .returning();

  // Fire and forget — do NOT await this
  void sendEmailLog(log.id, opts.eventType, opts.templateData);
}

// ─── Actual send logic ──────────────────────────────────────────────────────
async function sendEmailLog(
  logId: number,
  eventType: EmailEventType,
  data: EmailTemplateData,
) {
  try {
    const emailLog = await db.query.emailLogsTable.findFirst({
      where: eq(emailLogsTable.id, logId),
    });
    if (!emailLog || emailLog.status !== "pending") return;

    let built: { subject: string; html: string };
    switch (eventType) {
      case "rfq_opened":
        built = buildRfqOpenedEmail(data);
        break;
      case "quotation_submitted":
        built = buildQuotationSubmittedEmail(data);
        break;
      case "quotation_awarded":
        built = buildQuotationAwardedEmail(data);
        break;
      case "rfq_closed":
        built = buildRfqClosedEmail(data, "supplier");
        break;
      case "rfq_cancelled":
        built = buildRfqCancelledEmail(data, "supplier");
        break;
      case "company_approved":
        built = buildCompanyVerifiedEmail(data, true);
        break;
      case "company_rejected":
        built = buildCompanyVerifiedEmail(data, false);
        break;
      default:
        return;
    }

    const result = await sendEmail({
      to: emailLog.recipientEmail,
      subject: built.subject,
      html: built.html,
    });

    if (result.ok) {
      await db
        .update(emailLogsTable)
        .set({ status: "sent", sentAt: new Date() })
        .where(eq(emailLogsTable.id, logId));
    } else if (result.error === "RESEND_API_KEY not configured") {
      await db
        .update(emailLogsTable)
        .set({ status: "skipped", errorMessage: result.error })
        .where(eq(emailLogsTable.id, logId));
    } else {
      await db
        .update(emailLogsTable)
        .set({ status: "failed", errorMessage: result.error ?? "Unknown error" })
        .where(eq(emailLogsTable.id, logId));
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error({ logId, err: msg }, "sendEmailLog exception");
    await db
      .update(emailLogsTable)
      .set({ status: "failed", errorMessage: msg })
      .where(eq(emailLogsTable.id, logId))
      .catch(() => {});
  }
}

// ─── Background worker for stuck pending logs ───────────────────────────────
export function startEmailWorker() {
  // Retry any emails stuck in pending for more than 60 seconds
  setInterval(async () => {
    try {
      const cutoff = new Date(Date.now() - 60_000);
      const stuck = await db
        .select()
        .from(emailLogsTable)
        .where(
          and(
            eq(emailLogsTable.status, "pending"),
            sql`${emailLogsTable.createdAt} < ${cutoff}`,
          ),
        )
        .limit(20);

      for (const log of stuck) {
        const data = await buildTemplateDataFromLog(log);
        void sendEmailLog(log.id, log.eventType, data);
      }
    } catch (err) {
      logger.error({ err }, "Email worker error");
    }
  }, 30_000); // run every 30 seconds

  logger.info("Email background worker started");
}

// ─── Template data reconstruction from log (for retries) ───────────────────
async function buildTemplateDataFromLog(
  log: typeof emailLogsTable.$inferSelect,
): Promise<EmailTemplateData> {
  try {
    if (log.entityType === "rfq") {
      const rfq = await db.query.rfqsTable.findFirst({ where: eq(rfqsTable.id, log.entityId) });
      if (!rfq) return {};
      const items = await db
        .select({ productName: productsTable.name, quantity: rfqItemsTable.quantity, unit: rfqItemsTable.unit })
        .from(rfqItemsTable)
        .leftJoin(productsTable, eq(rfqItemsTable.productId, productsTable.id))
        .where(eq(rfqItemsTable.rfqId, rfq.id));
      return {
        rfqReferenceNumber: rfq.referenceNumber,
        rfqTitle: rfq.title,
        rfqProducts: items.map((i) => i.productName ?? "Unknown").join(", "),
        rfqQuantity: items.map((i) => `${i.quantity} ${i.unit}`).join(", "),
        rfqDeadline: rfq.validUntil ?? undefined,
        rfqDestination: rfq.destinationCountry ?? undefined,
      };
    }
    if (log.entityType === "quotation") {
      const q = await db.query.quotationsTable.findFirst({ where: eq(quotationsTable.id, log.entityId) });
      if (!q) return {};
      const rfq = await db.query.rfqsTable.findFirst({ where: eq(rfqsTable.id, q.rfqId) });
      return {
        rfqReferenceNumber: rfq?.referenceNumber,
        rfqTitle: rfq?.title,
        quotationAmount: q.totalAmount ? Number(q.totalAmount).toLocaleString() : undefined,
        quotationCurrency: q.currency,
      };
    }
    if (log.entityType === "company") {
      const co = await db.query.companiesTable.findFirst({ where: eq(companiesTable.id, log.entityId) });
      return { companyName: co?.name };
    }
  } catch { /* ignore */ }
  return {};
}

// ─── High-level trigger helpers ─────────────────────────────────────────────

/** Called after a new RFQ is created — notify all approved suppliers */
export async function notifyRfqOpened(rfqId: number) {
  const rfq = await db.query.rfqsTable.findFirst({ where: eq(rfqsTable.id, rfqId) });
  if (!rfq) return;

  const items = await db
    .select({ productName: productsTable.name, quantity: rfqItemsTable.quantity, unit: rfqItemsTable.unit })
    .from(rfqItemsTable)
    .leftJoin(productsTable, eq(rfqItemsTable.productId, productsTable.id))
    .where(eq(rfqItemsTable.rfqId, rfqId));

  const templateData: EmailTemplateData = {
    rfqReferenceNumber: rfq.referenceNumber,
    rfqTitle: rfq.title,
    rfqProducts: items.map((i) => i.productName ?? "Unknown").join(", "),
    rfqQuantity: items.map((i) => `${i.quantity} ${i.unit}`).join(", "),
    rfqDeadline: rfq.validUntil ?? undefined,
    rfqDestination: rfq.destinationCountry ?? undefined,
  };

  // Find all approved suppliers (company verificationStatus = approved, user role = supplier)
  const approvedSuppliers = await db
    .select({ email: usersTable.email, firstName: usersTable.firstName })
    .from(usersTable)
    .innerJoin(companiesTable, eq(usersTable.companyId, companiesTable.id))
    .where(
      and(
        eq(usersTable.role, "supplier"),
        eq(usersTable.status, "active"),
        eq(companiesTable.verificationStatus, "approved"),
      ),
    );

  for (const supplier of approvedSuppliers) {
    await queueEmail({
      eventType: "rfq_opened",
      entityType: "rfq",
      entityId: rfqId,
      recipientEmail: supplier.email,
      templateData: { ...templateData, recipientName: supplier.firstName ?? undefined },
    });
  }
}

/** Called after a quotation is submitted — notify the RFQ buyer */
export async function notifyQuotationSubmitted(quotationId: number) {
  const q = await db.query.quotationsTable.findFirst({ where: eq(quotationsTable.id, quotationId) });
  if (!q) return;

  const rfq = await db.query.rfqsTable.findFirst({ where: eq(rfqsTable.id, q.rfqId) });
  if (!rfq) return;

  const buyer = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkId, rfq.buyerId) });
  if (!buyer) return;

  const supplier = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkId, q.supplierId) });
  const supplierCompany = supplier?.companyId
    ? await db.query.companiesTable.findFirst({ where: eq(companiesTable.id, supplier.companyId) })
    : null;

  await queueEmail({
    eventType: "quotation_submitted",
    entityType: "quotation",
    entityId: quotationId,
    recipientEmail: buyer.email,
    templateData: {
      recipientName: buyer.firstName ?? undefined,
      rfqReferenceNumber: rfq.referenceNumber,
      rfqTitle: rfq.title,
      supplierName: supplierCompany?.name ?? (supplier ? `${supplier.firstName ?? ""} ${supplier.lastName ?? ""}`.trim() : "Unknown"),
      quotationAmount: q.totalAmount ? Number(q.totalAmount).toLocaleString() : undefined,
      quotationCurrency: q.currency,
    },
  });
}

/** Called after a quotation is awarded — notify the winning supplier */
export async function notifyQuotationAwarded(quotationId: number) {
  const q = await db.query.quotationsTable.findFirst({ where: eq(quotationsTable.id, quotationId) });
  if (!q) return;

  const rfq = await db.query.rfqsTable.findFirst({ where: eq(rfqsTable.id, q.rfqId) });
  const supplier = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkId, q.supplierId) });
  if (!supplier) return;

  await queueEmail({
    eventType: "quotation_awarded",
    entityType: "quotation",
    entityId: quotationId,
    recipientEmail: supplier.email,
    templateData: {
      recipientName: supplier.firstName ?? undefined,
      rfqReferenceNumber: rfq?.referenceNumber,
      rfqTitle: rfq?.title,
      quotationAmount: q.totalAmount ? Number(q.totalAmount).toLocaleString() : undefined,
      quotationCurrency: q.currency,
    },
  });
}

/** Called when an RFQ is closed or cancelled */
export async function notifyRfqStatusChange(rfqId: number, newStatus: "closed" | "cancelled") {
  const rfq = await db.query.rfqsTable.findFirst({ where: eq(rfqsTable.id, rfqId) });
  if (!rfq) return;

  const eventType: EmailEventType = newStatus === "closed" ? "rfq_closed" : "rfq_cancelled";
  const templateData: EmailTemplateData = {
    rfqReferenceNumber: rfq.referenceNumber,
    rfqTitle: rfq.title,
  };

  // Notify the buyer
  const buyer = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkId, rfq.buyerId) });
  if (buyer) {
    await queueEmail({
      eventType,
      entityType: "rfq",
      entityId: rfqId,
      recipientEmail: buyer.email,
      templateData: { ...templateData, recipientName: buyer.firstName ?? undefined },
    });
  }

  // Notify suppliers who submitted quotations
  const quoters = await db
    .select({ email: usersTable.email, firstName: usersTable.firstName })
    .from(quotationsTable)
    .innerJoin(usersTable, eq(quotationsTable.supplierId, usersTable.clerkId))
    .where(eq(quotationsTable.rfqId, rfqId));

  for (const supplier of quoters) {
    await queueEmail({
      eventType,
      entityType: "rfq",
      entityId: rfqId,
      recipientEmail: supplier.email,
      templateData: { ...templateData, recipientName: supplier.firstName ?? undefined },
    });
  }
}

/** Called when a company is approved or rejected */
export async function notifyCompanyVerified(companyId: number, approved: boolean) {
  const company = await db.query.companiesTable.findFirst({ where: eq(companiesTable.id, companyId) });
  if (!company) return;

  const owner = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkId, company.ownerId) });
  if (!owner) return;

  await queueEmail({
    eventType: approved ? "company_approved" : "company_rejected",
    entityType: "company",
    entityId: companyId,
    recipientEmail: owner.email,
    templateData: {
      recipientName: owner.firstName ?? undefined,
      companyName: company.name,
    },
  });
}
