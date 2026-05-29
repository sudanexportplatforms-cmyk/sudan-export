import { Router } from "express";
import { db } from "@workspace/db";
import {
  rfqsTable,
  rfqItemsTable,
  quotationsTable,
  usersTable,
  companiesTable,
  productsTable,
} from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth";

const router = Router();

function generateRefNumber(): string {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `RFQ-${stamp}-${rand}`;
}

async function enrichRfq(rfq: typeof rfqsTable.$inferSelect) {
  const buyer = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, rfq.buyerId),
  });
  const buyerCompany = buyer?.companyId
    ? await db.query.companiesTable.findFirst({
        where: eq(companiesTable.id, buyer.companyId),
      })
    : null;
  const quotationRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(quotationsTable)
    .where(eq(quotationsTable.rfqId, rfq.id));
  const quotationCount = quotationRows[0]?.count ?? 0;

  return {
    ...rfq,
    buyerName: buyer
      ? `${buyer.firstName ?? ""} ${buyer.lastName ?? ""}`.trim() || null
      : null,
    buyerCompanyName: buyerCompany?.name ?? null,
    quotationCount,
    createdAt: rfq.createdAt.toISOString(),
    updatedAt: rfq.updatedAt.toISOString(),
  };
}

// GET /api/rfqs
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const me = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, req.userId!),
  });
  if (!me) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { status, buyerId } = req.query as { status?: string; buyerId?: string };
  let rows = await db.select().from(rfqsTable);

  // Role-based filtering
  if (me.role === "buyer") {
    rows = rows.filter((r) => r.buyerId === req.userId);
  }
  if (status) rows = rows.filter((r) => r.status === status);
  if (buyerId) rows = rows.filter((r) => r.buyerId === buyerId);

  const enriched = await Promise.all(rows.map(enrichRfq));
  res.json(enriched);
});

// POST /api/rfqs
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { title, destinationCountry, deliveryPort, paymentTerms, incoterms,
    deliveryDeadline, validUntil, notes, items } = req.body;

  const [rfq] = await db
    .insert(rfqsTable)
    .values({
      referenceNumber: generateRefNumber(),
      title,
      status: "submitted",
      buyerId: req.userId!,
      destinationCountry,
      deliveryPort,
      paymentTerms,
      incoterms,
      deliveryDeadline,
      validUntil,
      notes,
    })
    .returning();

  if (items && items.length > 0) {
    await db.insert(rfqItemsTable).values(
      items.map((item: { productId: number; quantity: number; unit: string; targetPrice?: number; specifications?: string }) => ({
        rfqId: rfq.id,
        productId: item.productId,
        quantity: String(item.quantity),
        unit: item.unit,
        targetPrice: item.targetPrice ? String(item.targetPrice) : null,
        specifications: item.specifications ?? null,
      })),
    );
  }

  const enriched = await enrichRfq(rfq);
  res.status(201).json(enriched);
});

// GET /api/rfqs/:rfqId
router.get("/:rfqId", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.rfqId as string);
  const rfq = await db.query.rfqsTable.findFirst({
    where: eq(rfqsTable.id, id),
  });
  if (!rfq) {
    res.status(404).json({ error: "RFQ not found" });
    return;
  }

  const rawItems = await db
    .select({
      id: rfqItemsTable.id,
      productId: rfqItemsTable.productId,
      productName: productsTable.name,
      quantity: rfqItemsTable.quantity,
      unit: rfqItemsTable.unit,
      targetPrice: rfqItemsTable.targetPrice,
      specifications: rfqItemsTable.specifications,
    })
    .from(rfqItemsTable)
    .leftJoin(productsTable, eq(rfqItemsTable.productId, productsTable.id))
    .where(eq(rfqItemsTable.rfqId, id));

  const enriched = await enrichRfq(rfq);
  res.json({
    ...enriched,
    items: rawItems.map((i) => ({
      ...i,
      productName: i.productName ?? "Unknown",
      quantity: Number(i.quantity),
      targetPrice: i.targetPrice ? Number(i.targetPrice) : null,
    })),
  });
});

// PATCH /api/rfqs/:rfqId
router.patch("/:rfqId", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.rfqId as string);
  const rfq = await db.query.rfqsTable.findFirst({ where: eq(rfqsTable.id, id) });
  if (!rfq) { res.status(404).json({ error: "RFQ not found" }); return; }
  const me = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkId, req.userId!) });
  if (!me || (rfq.buyerId !== req.userId && me.role !== "admin")) {
    res.status(403).json({ error: "Forbidden" }); return;
  }
  const { title, destinationCountry, deliveryPort, paymentTerms, incoterms, deliveryDeadline, validUntil, notes } = req.body;
  const [updated] = await db.update(rfqsTable).set({ title, destinationCountry, deliveryPort, paymentTerms, incoterms, deliveryDeadline, validUntil, notes }).where(eq(rfqsTable.id, id)).returning();
  res.json(await enrichRfq(updated));
});

// PATCH /api/rfqs/:rfqId/status
router.patch("/:rfqId/status", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.rfqId as string);
  const { status } = req.body;
  const [updated] = await db.update(rfqsTable).set({ status }).where(eq(rfqsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "RFQ not found" }); return; }
  res.json(await enrichRfq(updated));
});

// GET /api/rfqs/:rfqId/quotations
router.get("/:rfqId/quotations", requireAuth, async (req: AuthRequest, res) => {
  const rfqId = parseInt(req.params.rfqId as string);
  const rows = await db.select().from(quotationsTable).where(eq(quotationsTable.rfqId, rfqId));
  const enriched = await Promise.all(
    rows.map(async (q) => {
      const supplier = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkId, q.supplierId) });
      const company = supplier?.companyId ? await db.query.companiesTable.findFirst({ where: eq(companiesTable.id, supplier.companyId) }) : null;
      const rfq = await db.query.rfqsTable.findFirst({ where: eq(rfqsTable.id, q.rfqId) });
      return {
        ...q,
        rfqTitle: rfq?.title ?? null,
        supplierName: supplier ? `${supplier.firstName ?? ""} ${supplier.lastName ?? ""}`.trim() || null : null,
        supplierCompanyName: company?.name ?? null,
        totalAmount: q.totalAmount ? Number(q.totalAmount) : null,
        createdAt: q.createdAt.toISOString(),
        updatedAt: q.updatedAt.toISOString(),
      };
    }),
  );
  res.json(enriched);
});

export default router;
