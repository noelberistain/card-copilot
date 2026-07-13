import type { CardSnapshot } from "@/models/cards/card.types";

export function hasGeneratedStatement(snapshot: CardSnapshot) {
  return snapshot.statementStatus === "generated";
}

export function hasPartialStatement(snapshot: CardSnapshot) {
  return snapshot.statementStatus === "not-generated";
}
