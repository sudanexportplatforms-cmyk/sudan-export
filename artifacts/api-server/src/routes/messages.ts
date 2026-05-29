import { Router } from "express";
import { db } from "@workspace/db";
import { messagesTable, usersTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth";

const router = Router();

async function enrichMessage(m: typeof messagesTable.$inferSelect) {
  const sender = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, m.senderId),
  });
  const recipient = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, m.recipientId),
  });
  return {
    ...m,
    senderName: sender
      ? `${sender.firstName ?? ""} ${sender.lastName ?? ""}`.trim() || null
      : null,
    recipientName: recipient
      ? `${recipient.firstName ?? ""} ${recipient.lastName ?? ""}`.trim() || null
      : null,
    createdAt: m.createdAt.toISOString(),
  };
}

// GET /api/messages
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const clerkId = req.userId!;
  const { rfqId } = req.query as { rfqId?: string };
  let rows = await db
    .select()
    .from(messagesTable)
    .where(
      or(
        eq(messagesTable.senderId, clerkId),
        eq(messagesTable.recipientId, clerkId),
      ),
    );
  if (rfqId) rows = rows.filter((m) => m.rfqId === parseInt(rfqId));
  const enriched = await Promise.all(rows.map(enrichMessage));
  res.json(enriched);
});

// POST /api/messages
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { rfqId, recipientId, subject, body } = req.body;
  const [message] = await db
    .insert(messagesTable)
    .values({
      rfqId: rfqId ?? null,
      senderId: req.userId!,
      recipientId,
      subject,
      body,
    })
    .returning();
  res.status(201).json(await enrichMessage(message));
});

export default router;
