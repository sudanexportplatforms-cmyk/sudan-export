import { Router } from "express";
import { db } from "@workspace/db";
import { emailLogsTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth";

const router = Router();

const fmt = (l: typeof emailLogsTable.$inferSelect) => ({
  ...l,
  sentAt: l.sentAt ? l.sentAt.toISOString() : null,
  createdAt: l.createdAt.toISOString(),
});

// GET /api/email-logs  (admin only)
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const me = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, req.userId!),
  });
  if (!me || me.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const { status, eventType, limit: limitStr } = req.query as {
    status?: string;
    eventType?: string;
    limit?: string;
  };
  const limit = Math.min(parseInt(limitStr ?? "200", 10) || 200, 500);

  let rows = await db
    .select()
    .from(emailLogsTable)
    .orderBy(desc(emailLogsTable.createdAt))
    .limit(limit);

  if (status) rows = rows.filter((r) => r.status === status);
  if (eventType) rows = rows.filter((r) => r.eventType === eventType);

  res.json(rows.map(fmt));
});

// GET /api/email-logs/stats  (admin only)
router.get("/stats", requireAuth, async (req: AuthRequest, res) => {
  const me = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, req.userId!),
  });
  if (!me || me.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const all = await db.select().from(emailLogsTable);
  const byStatus = all.reduce(
    (acc, r) => { acc[r.status] = (acc[r.status] ?? 0) + 1; return acc; },
    {} as Record<string, number>,
  );
  const byEvent = all.reduce(
    (acc, r) => { acc[r.eventType] = (acc[r.eventType] ?? 0) + 1; return acc; },
    {} as Record<string, number>,
  );

  res.json({
    total: all.length,
    byStatus,
    byEvent,
  });
});

// POST /api/email-logs/:logId/retry  (admin only)
router.post("/:logId/retry", requireAuth, async (req: AuthRequest, res) => {
  const me = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, req.userId!),
  });
  if (!me || me.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const id = parseInt(req.params.logId as string);
  const log = await db.query.emailLogsTable.findFirst({
    where: eq(emailLogsTable.id, id),
  });
  if (!log) {
    res.status(404).json({ error: "Email log not found" });
    return;
  }

  // Reset to pending so the worker picks it up
  const [updated] = await db
    .update(emailLogsTable)
    .set({ status: "pending", errorMessage: null, sentAt: null })
    .where(eq(emailLogsTable.id, id))
    .returning();

  res.json(fmt(updated));
});

export default router;
