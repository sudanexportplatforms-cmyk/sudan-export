import { Router } from "express";
import { db } from "@workspace/db";
import {
  quotationsTable,
  quotationItemsTable,
  rfqsTable,
  rfqItemsTable,
  usersTable,
  companiesTable,
  productsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth";

const router = Router();

async function enrichQuotation(q: typeof quotationsTable.$inferSelect) {
  const supplier = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, q.supplierId),
  });
  const company = supplier?.companyId
    ? await db.query.companiesTable.findFirst({
        where: eq(companiesTable.id, supplier.companyId),
      })
    : null;
  const rfq = await db.query.rfqsTable.findFirst({
    where: eq(rfqsTable.id, q.rfqId),
  });
  return {
    ...q,
    rfqTitle: rfq?.title ?? null,
    supplierName: supplier
      ? `${supplier.firstName ?? ""} ${supplier.lastName ?? ""}`.trim() || null
      : null,
    supplierCompanyName: company?.name ?? null,
    totalAmount: q.totalAmount ? Number(q.totalAmount) : null,
    createdAt: q.createdAt.toISOString(),
    updatedAt: q.updatedAt.toISOString(),
  };
}

// POST /api/rfqs/:rfqId/quotations
router.post("/rfqs/:rfqId/quotations", requireAuth, async (req: AuthRequest, res) => {
  const rfqId = parseInt(req.params.rfqId as string);
  const { currency, validUntil, deliveryTime, paymentTerms, notes, items } = req.body;

  let total = 0;
  const itemValues = (items ?? []).map((item: {
    rfqItemId: number; quantity: number; unit: string;
    unitPrice: number; currency?: string; specifications?: string;
  }) => {
    const lineTotal = Number(item.quantity) * Number(item.unitPrice);
    total += lineTotal;
    return {
      rfqItemId: item.rfqItemId,
      quantity: String(item.quantity),
      unit: item.unit,
      unitPrice: String(item.unitPrice),
      totalPrice: String(lineTotal),
      currency: item.currency ?? currency ?? "USD",
      specifications: item.specifications ?? null,
    };
  });

  const [quotation] = await db
    .insert(quotationsTable)
    .values({
      rfqId,
      supplierId: req.userId!,
      status: "submitted",
      totalAmount: String(total),
      currency: currency ?? "USD",
      validUntil,
      deliveryTime,
      paymentTerms,
      notes,
    })
    .returning();

  if (itemValues.length > 0) {
    await db.insert(quotationItemsTable).values(
      itemValues.map((iv: typeof itemValues[0]) => ({
        ...iv,
        quotationId: quotation.id,
      })),
    );
  }

  // Update RFQ status to "quoting"
  await db
    .update(rfqsTable)
    .set({ status: "quoting" })
    .where(eq(rfqsTable.id, rfqId));

  res.status(201).json(await enrichQuotation(quotation));
});

// GET /api/quotations
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const me = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, req.userId!),
  });
  if (!me) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { status, supplierId } = req.query as { status?: string; supplierId?: string };
  let rows = await db.select().from(quotationsTable);

  if (me.role === "supplier") {
    rows = rows.filter((q) => q.supplierId === req.userId);
  }
  if (status) rows = rows.filter((q) => q.status === status);
  if (supplierId) rows = rows.filter((q) => q.supplierId === supplierId);

  const enriched = await Promise.all(rows.map(enrichQuotation));
  res.json(enriched);
});

// GET /api/quotations/:quotationId
router.get("/:quotationId", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.quotationId as string);
  const quotation = await db.query.quotationsTable.findFirst({
    where: eq(quotationsTable.id, id),
  });
  if (!quotation) { res.status(404).json({ error: "Quotation not found" }); return; }

  const items = await db
    .select({
      id: quotationItemsTable.id,
      rfqItemId: quotationItemsTable.rfqItemId,
      productName: productsTable.name,
      quantity: quotationItemsTable.quantity,
      unit: quotationItemsTable.unit,
      unitPrice: quotationItemsTable.unitPrice,
      totalPrice: quotationItemsTable.totalPrice,
      currency: quotationItemsTable.currency,
      specifications: quotationItemsTable.specifications,
    })
    .from(quotationItemsTable)
    .leftJoin(rfqItemsTable, eq(quotationItemsTable.rfqItemId, rfqItemsTable.id))
    .leftJoin(productsTable, eq(rfqItemsTable.productId, productsTable.id))
    .where(eq(quotationItemsTable.quotationId, id));

  const enriched = await enrichQuotation(quotation);
  res.json({
    ...enriched,
    items: items.map((i) => ({
      ...i,
      productName: i.productName ?? "Unknown",
      quantity: Number(i.quantity),
      unitPrice: Number(i.unitPrice),
      totalPrice: Number(i.totalPrice),
    })),
  });
});

// PATCH /api/quotations/:quotationId/status
router.patch("/:quotationId/status", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.quotationId as string);
  const { status } = req.body;
  const [updated] = await db
    .update(quotationsTable)
    .set({ status })
    .where(eq(quotationsTable.id, id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Quotation not found" }); return; }

  // If awarded, update RFQ to awarded
  if (status === "awarded") {
    await db.update(rfqsTable).set({ status: "awarded" }).where(eq(rfqsTable.id, updated.rfqId));
  }
  res.json(await enrichQuotation(updated));
});

export default router;
