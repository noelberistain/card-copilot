import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { cardSnapshots } from "@/db/schema/cardSnapshots";
import { toCardSnapshot, toNewCardSnapshotRow } from "@/data/mappers/cardSnapshot.mapper";
import type { CardSnapshot } from "@/models/cards/card.types";

export class SqliteCardSnapshotsPersistence {
  async create(snapshot: CardSnapshot): Promise<void> {
    await db.insert(cardSnapshots).values(toNewCardSnapshotRow(snapshot));
  }

  async update(snapshot: CardSnapshot): Promise<void> {
    await db
      .update(cardSnapshots)
      .set({
        capturedAt: snapshot.capturedAt,
        statementStatus: snapshot.statementStatus,

        currentBalance: snapshot.currentBalance,
        statementBalance: snapshot.statementBalance,
        minimumPayment: snapshot.minimumPayment,
        paymentToAvoidInterest: snapshot.paymentToAvoidInterest,
        reportedAvailableCredit: snapshot.reportedAvailableCredit ?? null,

        lastCutoffDate: snapshot.lastCutoffDate,
        nextCutoffDate: snapshot.nextCutoffDate ?? null,
        paymentDueDate: snapshot.paymentDueDate,

        notes: snapshot.notes ?? null,

        updatedAt: snapshot.updatedAt,
      })
      .where(eq(cardSnapshots.id, snapshot.id));
  }

  async findLatestByCardId(cardId: string): Promise<CardSnapshot | null> {
    const rows = await db
      .select()
      .from(cardSnapshots)
      .where(eq(cardSnapshots.cardId, cardId))
      .orderBy(desc(cardSnapshots.capturedAt))
      .limit(1);

    const row = rows[0];

    return row ? toCardSnapshot(row) : null;
  }

  async findById(snapshotId: string): Promise<CardSnapshot | null> {
    const rows = await db
      .select()
      .from(cardSnapshots)
      .where(eq(cardSnapshots.id, snapshotId))
      .limit(1);

    const row = rows[0];

    return row ? toCardSnapshot(row) : null;
  }
}
