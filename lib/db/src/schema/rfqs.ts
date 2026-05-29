import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const rfqsTable = pgTable("rfqs", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull().unique(),
  title: text("title").notNull(),
  status: text("status", {
    enum: [
      "draft",
      "submitted",
      "open",
      "quoting",
      "shortlisted",
      "awarded",
      "closed",
      "cancelled",
    ],
  })
    .notNull()
    .default("draft"),
  buyerId: text("buyer_id").notNull(),
  destinationCountry: text("destination_country"),
  deliveryPort: text("delivery_port"),
  paymentTerms: text("payment_terms"),
  incoterms: text("incoterms"),
  deliveryDeadline: text("delivery_deadline"),
  validUntil: text("valid_until"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const rfqItemsTable = pgTable("rfq_items", {
  id: serial("id").primaryKey(),
  rfqId: integer("rfq_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: numeric("quantity", { precision: 12, scale: 3 }).notNull(),
  unit: text("unit").notNull(),
  targetPrice: numeric("target_price", { precision: 12, scale: 2 }),
  specifications: text("specifications"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertRfqSchema = createInsertSchema(rfqsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertRfqItemSchema = createInsertSchema(rfqItemsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertRfq = z.infer<typeof insertRfqSchema>;
export type InsertRfqItem = z.infer<typeof insertRfqItemSchema>;
export type Rfq = typeof rfqsTable.$inferSelect;
export type RfqItem = typeof rfqItemsTable.$inferSelect;
