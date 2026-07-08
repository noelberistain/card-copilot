import { asc, eq } from "drizzle-orm";

import { toCard, toNewCardRow } from "@/data/mappers/card.mapper";
import { db } from "@/db/client";
import { cards } from "@/db/schema/cards";
import type { Card } from "@/models/cards/card.types";

export class SqliteCardsPersistence {
  async create(card: Card): Promise<void> {
    await db.insert(cards).values(toNewCardRow(card));
  }

  async update(card: Card): Promise<void> {
    await db
      .update(cards)
      .set({
        alias: card.alias,
        bank: card.bank,
        creditLimit: card.creditLimit,
        cutoffDay: card.cutoffDay,
        paymentDueDay: card.paymentDueDay,
        network: card.network,
        color: card.color,
        isActive: card.isActive,
        updatedAt: card.updatedAt,
      })
      .where(eq(cards.id, card.id));
  }

  
  async remove(cardId: string): Promise<void> {
    await db.delete(cards).where(eq(cards.id, cardId));
  }

  async reactivate(cardId: string): Promise<void> {
    await db
      .update(cards)
      .set({
        isActive: true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(cards.id, cardId));
  }

  async findInactive(): Promise<Card[]> {
    const rows = await db
      .select()
      .from(cards)
      .where(eq(cards.isActive, false))
      .orderBy(asc(cards.alias));

    return rows.map(toCard);
  }

  async deactivate(cardId: string): Promise<void> {
    await db
      .update(cards)
      .set({
        isActive: false,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(cards.id, cardId));
  }

  async findById(cardId: string): Promise<Card | null> {
    const rows = await db.select().from(cards).where(eq(cards.id, cardId)).limit(1);

    const row = rows[0];

    if (!row) return null;

    return toCard(row);
  }

  async findAll(): Promise<Card[]> {
    const rows = await db.select().from(cards).orderBy(asc(cards.alias));

    return rows.map(toCard);
  }

  async findActive(): Promise<Card[]> {
    const rows = await db
      .select()
      .from(cards)
      .where(eq(cards.isActive, true))
      .orderBy(asc(cards.alias));

    return rows.map(toCard);
  }
}
