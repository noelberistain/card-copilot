import type { CardSnapshotRow, NewCardSnapshotRow } from "@/db/schema/cardSnapshots";
import type { CardSnapshot } from "@/models/cards/card.types";

export function toCardSnapshot(row: CardSnapshotRow): CardSnapshot {
  return {
    id: row.id,
    cardId: row.cardId,
    capturedAt: row.capturedAt,

    currentBalance: row.currentBalance,
    statementBalance: row.statementBalance,
    minimumPayment: row.minimumPayment,
    paymentToAvoidInterest: row.paymentToAvoidInterest,
    reportedAvailableCredit: row.reportedAvailableCredit ?? null,

    lastCutoffDate: row.lastCutoffDate,
    paymentDueDate: row.paymentDueDate,

    notes: row.notes ?? null,

    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toNewCardSnapshotRow(snapshot: CardSnapshot): NewCardSnapshotRow {
  return {
    id: snapshot.id,
    cardId: snapshot.cardId,
    capturedAt: snapshot.capturedAt,

    currentBalance: snapshot.currentBalance,
    statementBalance: snapshot.statementBalance,
    minimumPayment: snapshot.minimumPayment,
    paymentToAvoidInterest: snapshot.paymentToAvoidInterest,
    reportedAvailableCredit: snapshot.reportedAvailableCredit ?? null,

    lastCutoffDate: snapshot.lastCutoffDate,
    paymentDueDate: snapshot.paymentDueDate,

    notes: snapshot.notes ?? null,

    createdAt: snapshot.createdAt,
    updatedAt: snapshot.updatedAt,
  };
}
