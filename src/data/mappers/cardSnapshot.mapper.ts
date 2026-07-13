import type { CardSnapshotRow, NewCardSnapshotRow } from "@/db/schema/cardSnapshots";
import type {
  CardSnapshot,
  CardSnapshotStatementStatus,
} from "@/models/cards/card.types";

function toStatementStatus(
  value: string | null | undefined
): CardSnapshotStatementStatus {
  if (value === "not-generated") {
    return "not-generated";
  }

  return "generated";
}

export function toCardSnapshot(row: CardSnapshotRow): CardSnapshot {
  return {
    id: row.id,
    cardId: row.cardId,
    capturedAt: row.capturedAt,

    statementStatus: toStatementStatus(row.statementStatus),

    currentBalance: row.currentBalance,
    statementBalance: row.statementBalance,
    minimumPayment: row.minimumPayment,
    paymentToAvoidInterest: row.paymentToAvoidInterest,
    reportedAvailableCredit: row.reportedAvailableCredit ?? null,

    lastCutoffDate: row.lastCutoffDate,
    nextCutoffDate: row.nextCutoffDate ?? null,
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

    createdAt: snapshot.createdAt,
    updatedAt: snapshot.updatedAt,
  };
}
