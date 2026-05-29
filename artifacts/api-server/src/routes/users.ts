import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, companiesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth";

const router = Router();

// GET /api/users/me
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const clerkId = req.userId!;
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, clerkId),
  });
  if (!user) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  const company = user.companyId
    ? await db.query.companiesTable.findFirst({
        where: eq(companiesTable.id, user.companyId),
      })
    : null;
  res.json({
    ...user,
    companyName: company?.name ?? null,
    createdAt: user.createdAt.toISOString(),
  });
});

// POST /api/users/me
router.post("/me", requireAuth, async (req: AuthRequest, res) => {
  const clerkId = req.userId!;
  const { firstName, lastName, role, phone, country } = req.body;

  const existing = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, clerkId),
  });

  let user;
  if (existing) {
    const [updated] = await db
      .update(usersTable)
      .set({ firstName, lastName, phone, country })
      .where(eq(usersTable.clerkId, clerkId))
      .returning();
    user = updated;
  } else {
    const [created] = await db
      .insert(usersTable)
      .values({
        clerkId,
        email: req.body.email ?? "",
        firstName,
        lastName,
        role: role ?? "buyer",
        phone,
        country,
      })
      .returning();
    user = created;
  }

  const company = user.companyId
    ? await db.query.companiesTable.findFirst({
        where: eq(companiesTable.id, user.companyId),
      })
    : null;

  res.json({
    ...user,
    companyName: company?.name ?? null,
    createdAt: user.createdAt.toISOString(),
  });
});

// GET /api/users
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const clerkId = req.userId!;
  const me = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, clerkId),
  });
  if (!me || me.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const { role, status } = req.query as { role?: string; status?: string };
  let rows = await db.select().from(usersTable);
  if (role) rows = rows.filter((r) => r.role === role);
  if (status) rows = rows.filter((r) => r.status === status);

  const companies = await db.select().from(companiesTable);
  const companyMap = new Map(companies.map((c) => [c.id, c.name]));

  res.json(
    rows.map((u) => ({
      ...u,
      companyName: u.companyId ? (companyMap.get(u.companyId) ?? null) : null,
      createdAt: u.createdAt.toISOString(),
    })),
  );
});

// GET /api/users/:userId
router.get("/:userId", requireAuth, async (req: AuthRequest, res) => {
  const clerkId = req.userId!;
  const me = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, clerkId),
  });
  if (!me || me.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const userId = req.params.userId as string;
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, userId),
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const company = user.companyId
    ? await db.query.companiesTable.findFirst({
        where: eq(companiesTable.id, user.companyId),
      })
    : null;
  res.json({
    ...user,
    companyName: company?.name ?? null,
    createdAt: user.createdAt.toISOString(),
  });
});

export default router;
