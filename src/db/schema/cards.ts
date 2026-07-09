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

export type CardRow = typeof cards.$inferSelect;
export type NewCardRow = typeof cards.$inferInsert;
