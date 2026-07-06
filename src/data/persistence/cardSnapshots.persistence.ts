import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { cardSnapshots } from "@/db/schema/cardSnapshots";
import type { CardSnapshot } from "@/models/cards/card.types";

export class SqliteCardSnapshotsPersistence {

  async update(snapshot: CardSnapshot): Promise<void> {
  await db
    .update(cardSnapshots)
    .set({
      capturedAt: snapshot.capturedAt,
      currentBalance: snapshot.currentBalance,
      statementBalance: snapshot.statementBalance,
      minimumPayment: snapshot.minimumPayment,
      paymentToAvoidInterest: snapshot.paymentToAvoidInterest,
      lastCutoffDate: snapshot.lastCutoffDate,
      paymentDueDate: snapshot.paymentDueDate,
      notes: snapshot.notes,
      updatedAt: snapshot.updatedAt,
    })
    .where(eq(cardSnapshots.id, snapshot.id));
}
  
  async create(snapshot: CardSnapshot): Promise<void> {
    await db.insert(cardSnapshots).values(snapshot);
  }

  async findById(snapshotId: string): Promise<CardSnapshot | null> {
    const rows = await db
      .select()
      .from(cardSnapshots)
      .where(eq(cardSnapshots.id, snapshotId))
      .limit(1);

    return rows[0] ?? null;
  }

  async findAllByCardId(cardId: string): Promise<CardSnapshot[]> {
    return db
      .select()
      .from(cardSnapshots)
      .where(eq(cardSnapshots.cardId, cardId))
      .orderBy(desc(cardSnapshots.capturedAt));
  }

  async findLatestByCardId(cardId: string): Promise<CardSnapshot | null> {
    const rows = await db
      .select()
      .from(cardSnapshots)
      .where(eq(cardSnapshots.cardId, cardId))
      .orderBy(desc(cardSnapshots.capturedAt))
      .limit(1);

    return rows[0] ?? null;
  }
}
