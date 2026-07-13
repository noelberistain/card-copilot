export type CardNetwork = "visa" | "mastercard" | "amex" | "other";

export type CardSnapshotStatementStatus = "generated" | "not-generated";

export interface Card {
  id: string;
  alias: string;
  bank: string;
  creditLimit: number;
  cutoffDay: number;
  paymentDueDay: number;
  network: CardNetwork | null;
  color: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CardSnapshot {
  id: string;
  cardId: string;
  capturedAt: string;

  statementStatus: CardSnapshotStatementStatus;

  currentBalance: number;
  statementBalance: number;
  minimumPayment: number;
  paymentToAvoidInterest: number;
  reportedAvailableCredit?: number | null;

  lastCutoffDate: string;
  nextCutoffDate?: string | null;
  paymentDueDate: string;

  notes?: string | null;

  createdAt: string;
  updatedAt: string;
}
