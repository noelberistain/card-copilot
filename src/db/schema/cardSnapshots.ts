import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { cards } from "@/db/schema/cards";

export const cardSnapshots = sqliteTable("card_snapshots", {
  id: text("id").primaryKey(),

  cardId: text("card_id")
    .notNull()
    .references(() => cards.id, { onDelete: "cascade" }),

  capturedAt: text("captured_at").notNull(),

  statementStatus: text("statement_status").notNull().default("generated"),

  currentBalance: real("current_balance").notNull(),
  statementBalance: real("statement_balance").notNull(),
  minimumPayment: real("minimum_payment").notNull(),
  paymentToAvoidInterest: real("payment_to_avoid_interest").notNull(),

  reportedAvailableCredit: real("reported_available_credit"),

  lastCutoffDate: text("last_cutoff_date").notNull(),
  nextCutoffDate: text("next_cutoff_date"),
  paymentDueDate: text("payment_due_date").notNull(),

  notes: text("notes"),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type CardSnapshotRow = typeof cardSnapshots.$inferSelect;
export type NewCardSnapshotRow = typeof cardSnapshots.$inferInsert;
