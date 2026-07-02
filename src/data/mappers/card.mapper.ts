import type { Card } from "@/models/cards/card.types";
import type { CardRow, NewCardRow } from "@/db/schema/cards";

export function toCard(row: CardRow): Card {
  return {
    id: row.id,
    alias: row.alias,
    bank: row.bank,
    creditLimit: row.creditLimit,
    cutoffDay: row.cutoffDay,
    paymentDueDay: row.paymentDueDay,
    network: (row.network as Card["network"]) ?? null,
    color: row.color ?? null,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toNewCardRow(card: Card): NewCardRow {
  return {
    id: card.id,
    alias: card.alias,
    bank: card.bank,
    creditLimit: card.creditLimit,
    cutoffDay: card.cutoffDay,
    paymentDueDay: card.paymentDueDay,
    network: card.network,
    color: card.color,
    isActive: card.isActive,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
  };
}
