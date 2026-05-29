import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const emailLogsTable = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  recipientEmail: text("recipient_email").notNull(),
  eventType: text("event_type", {
    enum: [
      "rfq_opened",
      "quotation_submitted",
      "quotation_awarded",
      "rfq_closed",
      "rfq_cancelled",
      "company_approved",
      "company_rejected",
    ],
  }).notNull(),
  entityType: text("entity_type", {
    enum: ["rfq", "quotation", "company"],
  }).notNull(),
  entityId: integer("entity_id").notNull(),
  status: text("status", {
    enum: ["pending", "sent", "failed", "skipped"],
  })
    .notNull()
    .default("pending"),
  errorMessage: text("error_message"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertEmailLogSchema = createInsertSchema(emailLogsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertEmailLog = z.infer<typeof insertEmailLogSchema>;
export type EmailLog = typeof emailLogsTable.$inferSelect;
