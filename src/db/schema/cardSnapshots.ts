import { index, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { cards } from './cards';

export const cardSnapshots = sqliteTable(
	'card_snapshots',
	{
		id: text('id').primaryKey(),

		cardId: text('card_id')
			.notNull()
			.references(() => cards.id, { onDelete: 'cascade' }),

		capturedAt: text('captured_at').notNull(),

		currentBalance: real('current_balance').notNull(),
		statementBalance: real('statement_balance').notNull(),
		minimumPayment: real('minimum_payment').notNull(),
		paymentToAvoidInterest: real('payment_to_avoid_interest').notNull(),

		lastCutoffDate: text('last_cutoff_date').notNull(),
		paymentDueDate: text('payment_due_date').notNull(),

		notes: text('notes'),

		createdAt: text('created_at').notNull(),
		updatedAt: text('updated_at').notNull(),
	},
	table => [
		index('idx_card_snapshots_card_id').on(table.cardId),
		index('idx_card_snapshots_captured_at').on(table.capturedAt),
	],
);

export type CardSnapshotRow = typeof cardSnapshots.$inferSelect;
export type NewCardSnapshotRow = typeof cardSnapshots.$inferInsert;
