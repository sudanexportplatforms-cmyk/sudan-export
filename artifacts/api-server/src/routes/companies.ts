import { Router } from "express";
import { db } from "@workspace/db";
import { companiesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth";
import { notifyCompanyVerified } from "../lib/emailQueue";

const router = Router();

const formatCompany = (c: typeof companiesTable.$inferSelect) => ({
  ...c,
  verifiedAt: c.verifiedAt ? c.verifiedAt.toISOString() : null,
  createdAt: c.createdAt.toISOString(),
});

// GET /api/companies
router.get("/", async (req, res) => {
  const { type, status } = req.query as {
    type?: string;
    status?: string;
  };
  let rows = await db.select().from(companiesTable);
  if (type) rows = rows.filter((c) => c.type === type);
  if (status) rows = rows.filter((c) => c.verificationStatus === status);
  res.json(rows.map(formatCompany));
});

// POST /api/companies
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { name, type, registrationNumber, country, city, address, website, phone, email, description } =
    req.body;
  const [company] = await db
    .insert(companiesTable)
    .values({
      name,
      type,
      registrationNumber,
      country,
      city,
      address,
      website,
      phone,
      email,
      description,
      ownerId: req.userId!,
    })
    .returning();

  // Link company to user
  await db
    .update(usersTable)
    .set({ companyId: company.id })
    .where(eq(usersTable.clerkId, req.userId!));

  res.status(201).json(formatCompany(company));
});

// GET /api/companies/:companyId
router.get("/:companyId", async (req, res) => {
  const id = parseInt(req.params.companyId as string);
  const company = await db.query.companiesTable.findFirst({
    where: eq(companiesTable.id, id),
  });
  if (!company) {
    res.status(404).json({ error: "Company not found" });
    return;
  }
  res.json(formatCompany(company));
});

// PATCH /api/companies/:companyId
router.patch("/:companyId", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.companyId as string);
  const company = await db.query.companiesTable.findFirst({
    where: eq(companiesTable.id, id),
  });
  if (!company) {
    res.status(404).json({ error: "Company not found" });
    return;
  }
  const me = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, req.userId!),
  });
  if (!me || (company.ownerId !== req.userId && me.role !== "admin")) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const { name, registrationNumber, country, city, address, website, phone, email, description, logoUrl } =
    req.body;
  const [updated] = await db
    .update(companiesTable)
    .set({ name, registrationNumber, country, city, address, website, phone, email, description, logoUrl })
    .where(eq(companiesTable.id, id))
    .returning();
  res.json(formatCompany(updated));
});

// PATCH /api/companies/:companyId/verify (admin)
router.patch("/:companyId/verify", requireAuth, async (req: AuthRequest, res) => {
  const me = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, req.userId!),
  });
  if (!me || me.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const id = parseInt(req.params.companyId as string);
  const { action } = req.body as { action: "approve" | "reject" };
  const [updated] = await db
    .update(companiesTable)
    .set({
      verificationStatus: action === "approve" ? "approved" : "rejected",
      verifiedAt: action === "approve" ? new Date() : null,
    })
    .where(eq(companiesTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Company not found" });
    return;
  }
  res.json(formatCompany(updated));

  // Fire-and-forget — notify company owner
  void notifyCompanyVerified(id, action === "approve");
});

export default router;
