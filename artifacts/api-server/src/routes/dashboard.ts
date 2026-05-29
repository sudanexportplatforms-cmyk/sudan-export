import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  companiesTable,
  productsTable,
  rfqsTable,
  quotationsTable,
  notificationsTable,
} from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth";

const router = Router();

// GET /api/dashboard/admin-stats
router.get("/admin-stats", requireAuth, async (req: AuthRequest, res) => {
  const [
    rfqCount,
    supplierCount,
    buyerCount,
    quotationCount,
    productCount,
    pendingVerifications,
    awardedDeals,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(rfqsTable),
    db.select({ count: sql<number>`count(*)::int` }).from(usersTable).where(eq(usersTable.role, "supplier")),
    db.select({ count: sql<number>`count(*)::int` }).from(usersTable).where(eq(usersTable.role, "buyer")),
    db.select({ count: sql<number>`count(*)::int` }).from(quotationsTable),
    db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(eq(productsTable.isActive, true)),
    db.select({ count: sql<number>`count(*)::int` }).from(companiesTable).where(eq(companiesTable.verificationStatus, "pending")),
    db.select({ count: sql<number>`count(*)::int` }).from(rfqsTable).where(eq(rfqsTable.status, "awarded")),
  ]);

  const rfqs = await db.select().from(rfqsTable);
  const openRfqs = rfqs.filter((r) => ["submitted", "open", "quoting"].includes(r.status)).length;
  const closedRfqs = rfqs.filter((r) => ["awarded", "closed"].includes(r.status)).length;

  res.json({
    totalRfqs: rfqCount[0]?.count ?? 0,
    openRfqs,
    closedRfqs,
    totalSuppliers: supplierCount[0]?.count ?? 0,
    totalBuyers: buyerCount[0]?.count ?? 0,
    totalQuotations: quotationCount[0]?.count ?? 0,
    totalProducts: productCount[0]?.count ?? 0,
    pendingVerifications: pendingVerifications[0]?.count ?? 0,
    awardedDeals: awardedDeals[0]?.count ?? 0,
  });
});

// GET /api/dashboard/buyer-stats
router.get("/buyer-stats", requireAuth, async (req: AuthRequest, res) => {
  const rfqs = await db
    .select()
    .from(rfqsTable)
    .where(eq(rfqsTable.buyerId, req.userId!));

  const rfqIds = rfqs.map((r) => r.id);
  const quotations = rfqIds.length
    ? await db.select().from(quotationsTable)
    : [];
  const myQuotations = quotations.filter((q) => rfqIds.includes(q.rfqId));

  const rfqsByStatus = rfqs.reduce(
    (acc, rfq) => {
      acc[rfq.status] = (acc[rfq.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  res.json({
    totalRfqs: rfqs.length,
    openRfqs: rfqs.filter((r) =>
      ["submitted", "open", "quoting"].includes(r.status),
    ).length,
    awardedRfqs: rfqs.filter((r) => r.status === "awarded").length,
    totalQuotationsReceived: myQuotations.length,
    pendingQuotations: myQuotations.filter((q) => q.status === "submitted").length,
    rfqsByStatus: Object.entries(rfqsByStatus).map(([status, count]) => ({
      status,
      count,
    })),
  });
});

// GET /api/dashboard/supplier-stats
router.get("/supplier-stats", requireAuth, async (req: AuthRequest, res) => {
  const quotations = await db
    .select()
    .from(quotationsTable)
    .where(eq(quotationsTable.supplierId, req.userId!));

  const awarded = quotations.filter((q) => q.status === "awarded").length;
  const successRate =
    quotations.length > 0 ? (awarded / quotations.length) * 100 : 0;

  const rfqs = await db.select().from(rfqsTable);
  const rfqsByStatus = quotations.reduce(
    (acc, q) => {
      acc[q.status] = (acc[q.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  res.json({
    totalRfqsReceived: rfqs.filter(
      (r) => ["quoting", "open", "shortlisted", "awarded"].includes(r.status),
    ).length,
    totalQuotationsSubmitted: quotations.length,
    awardedQuotations: awarded,
    pendingQuotations: quotations.filter((q) => q.status === "submitted").length,
    successRate: Math.round(successRate * 10) / 10,
    quotationsByStatus: Object.entries(rfqsByStatus).map(([status, count]) => ({
      status,
      count,
    })),
  });
});

// GET /api/dashboard/recent-activity
router.get("/recent-activity", requireAuth, async (req: AuthRequest, res) => {
  const [rfqs, quotations] = await Promise.all([
    db.select().from(rfqsTable),
    db.select().from(quotationsTable),
  ]);

  const activities = [
    ...rfqs.slice(-5).map((r) => ({
      id: `rfq-${r.id}`,
      type: "rfq_created",
      title: "RFQ Created",
      description: r.title,
      actorName: null,
      createdAt: r.createdAt.toISOString(),
    })),
    ...quotations.slice(-5).map((q) => ({
      id: `quotation-${q.id}`,
      type: "quotation_submitted",
      title: "Quotation Submitted",
      description: `Quotation for RFQ #${q.rfqId}`,
      actorName: null,
      createdAt: q.createdAt.toISOString(),
    })),
  ];

  activities.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  res.json(activities.slice(0, 10));
});

// GET /api/dashboard/rfq-by-status
router.get("/rfq-by-status", requireAuth, async (req: AuthRequest, res) => {
  const rfqs = await db.select().from(rfqsTable);
  const counts = rfqs.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const allStatuses = ["draft", "submitted", "open", "quoting", "shortlisted", "awarded", "closed", "cancelled"];
  res.json(
    allStatuses.map((status) => ({ status, count: counts[status] ?? 0 })),
  );
});

export default router;
