import { Router } from "express";
import { db } from "@workspace/db";
import { notificationsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth";
import { sql } from "drizzle-orm";

const router = Router();

// GET /api/notifications
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const rows = await db
    .select()
    .from(notificationsTable)
    .where(eq(notificationsTable.userId, req.userId!));
  res.json(
    rows.map((n) => ({ ...n, createdAt: n.createdAt.toISOString() })),
  );
});

// PATCH /api/notifications/:notificationId/read
router.patch("/:notificationId/read", requireAuth, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.notificationId as string);
  const [updated] = await db
    .update(notificationsTable)
    .set({ isRead: true })
    .where(
      and(
        eq(notificationsTable.id, id),
        eq(notificationsTable.userId, req.userId!),
      ),
    )
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Notification not found" });
    return;
  }
  res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
});

// PATCH /api/notifications/read-all
router.patch("/read-all", requireAuth, async (req: AuthRequest, res) => {
  const result = await db
    .update(notificationsTable)
    .set({ isRead: true })
    .where(eq(notificationsTable.userId, req.userId!))
    .returning();
  res.json({ updated: result.length });
});

export default router;
