export type CardNetwork = "visa" | "mastercard" | "amex" | "other";

export type CardSnapshotStatementStatus = "generated" | "not-generated";

export interface Card {
  alias: string;
  bank: string;
  color: string | null;
  createdAt: string;
  creditLimit: number;
  cutoffDay: number;
  id: string;
  isActive: boolean;
  network: CardNetwork | null;
  paymentDueDay: number;
  updatedAt: string;
}
export interface CardSnapshot {
  capturedAt: string;
  cardId: string;
  id: string;

  statementStatus: CardSnapshotStatementStatus;

  currentBalance: number;
  minimumPayment: number;
  paymentToAvoidInterest: number;
  reportedAvailableCredit?: number | null;
  statementBalance: number;

  lastCutoffDate: string;
  nextCutoffDate?: string | null;
  paymentDueDate: string;

  notes?: string | null;

  createdAt: string;
  updatedAt: string;
}
