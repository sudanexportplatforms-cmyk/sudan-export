import {
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const companiesTable = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["supplier", "buyer"] }).notNull(),
  registrationNumber: text("registration_number"),
  country: text("country").notNull(),
  city: text("city"),
  address: text("address"),
  website: text("website"),
  phone: text("phone"),
  email: text("email"),
  description: text("description"),
  logoUrl: text("logo_url"),
  verificationStatus: text("verification_status", {
    enum: ["pending", "approved", "rejected"],
  })
    .notNull()
    .default("pending"),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  ownerId: text("owner_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertCompanySchema = createInsertSchema(companiesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companiesTable.$inferSelect;
