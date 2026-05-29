import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/requireAuth";

const router = Router();

// GET /api/products
router.get("/", async (req, res) => {
  const { active } = req.query as { active?: string };
  let rows = await db.select().from(productsTable);
  if (active !== undefined) {
    const isActive = active === "true";
    rows = rows.filter((p) => p.isActive === isActive);
  }
  res.json(
    rows.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() })),
  );
});

// GET /api/products/:productId
router.get("/:productId", async (req, res) => {
  const id = parseInt(req.params.productId as string);
  const product = await db.query.productsTable.findFirst({
    where: eq(productsTable.id, id),
  });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ ...product, createdAt: product.createdAt.toISOString() });
});

// POST /api/products (admin)
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const me = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, req.userId!),
  });
  if (!me || me.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const { name, slug, description, category, unit, imageUrl, isActive } =
    req.body;
  const [product] = await db
    .insert(productsTable)
    .values({ name, slug, description, category, unit, imageUrl, isActive })
    .returning();
  res.status(201).json({ ...product, createdAt: product.createdAt.toISOString() });
});

// PATCH /api/products/:productId (admin)
router.patch("/:productId", requireAuth, async (req: AuthRequest, res) => {
  const me = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, req.userId!),
  });
  if (!me || me.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const id = parseInt(req.params.productId as string);
  const { name, description, category, unit, imageUrl, isActive } = req.body;
  const [product] = await db
    .update(productsTable)
    .set({ name, description, category, unit, imageUrl, isActive })
    .where(eq(productsTable.id, id))
    .returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ ...product, createdAt: product.createdAt.toISOString() });
});

export default router;
