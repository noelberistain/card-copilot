import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const cards = sqliteTable("cards", {
  id: text("id").primaryKey(),

  alias: text("alias").notNull(),
  bank: text("bank").notNull(),

  creditLimit: real("credit_limit").notNull(),

  cutoffDay: integer("cutoff_day").notNull(),
  paymentDueDay: integer("payment_due_day").notNull(),

  network: text("network"),
  color: text("color"),

  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const cardSnapshots = sqliteTable("card_snapshots", {
  id: text("id").primaryKey(),

  cardId: text("card_id")
    .notNull()
    .references(() => cards.id, { onDelete: "cascade" }),

  capturedAt: text("captured_at").notNull(),

  currentBalance: real("current_balance").notNull(),
  statementBalance: real("statement_balance").notNull(),
  minimumPayment: real("minimum_payment").notNull(),
  paymentToAvoidInterest: real("payment_to_avoid_interest").notNull(),

  reportedAvailableCredit: real("reported_available_credit"),

  lastCutoffDate: text("last_cutoff_date").notNull(),
  paymentDueDate: text("payment_due_date").notNull(),

  notes: text("notes"),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type CardRow = typeof cards.$inferSelect;
export type NewCardRow = typeof cards.$inferInsert;

export type CardSnapshotRow = typeof cardSnapshots.$inferSelect;
export type NewCardSnapshotRow = typeof cardSnapshots.$inferInsert;
