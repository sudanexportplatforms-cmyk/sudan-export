import { Router } from "express";
import { db } from "@workspace/db";
import { documentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth";

const router = Router();

// GET /api/documents
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const { companyId, type } = req.query as { companyId?: string; type?: string };
  let rows = await db.select().from(documentsTable);
  rows = rows.filter(
    (d) => d.uploadedBy === req.userId ||
      (companyId ? d.companyId === parseInt(companyId) : false),
  );
  if (type) rows = rows.filter((d) => d.type === type);
  res.json(rows.map((d) => ({ ...d, createdAt: d.createdAt.toISOString() })));
});

// POST /api/documents
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { companyId, type, name, url, mimeType, sizeBytes } = req.body;
  const [doc] = await db
    .insert(documentsTable)
    .values({
      companyId: companyId ?? null,
      uploadedBy: req.userId!,
      type,
      name,
      url,
      mimeType,
      sizeBytes,
    })
    .returning();
  res.status(201).json({ ...doc, createdAt: doc.createdAt.toISOString() });
});

export default router;
