import {
  rankCardsForPurchase,
  type PurchaseSimulationCardInput,
  type PurchaseSimulationCardResult,
} from "@/logic/cards/purchaseTiming.logic";

export interface PurchaseSimulationResult {
  amount: number;
  purchaseDate: string;
  recommendedCard: PurchaseSimulationCardResult | null;
  eligibleCards: PurchaseSimulationCardResult[];
  ineligibleCards: PurchaseSimulationCardResult[];
  allResults: PurchaseSimulationCardResult[];
  summary: string;
}

interface BuildPurchaseSimulationResultOptions {
  cards: PurchaseSimulationCardInput[];
  amount: number;
  purchaseDate: string;
}

export function buildPurchaseSimulationResult({
  cards,
  amount,
  purchaseDate,
}: BuildPurchaseSimulationResultOptions): PurchaseSimulationResult {
  const allResults = rankCardsForPurchase({
    cards,
    amount,
    purchaseDate,
  });

  const eligibleCards = allResults.filter((result) => result.eligible);
  const ineligibleCards = allResults.filter((result) => !result.eligible);

  const recommendedCard = eligibleCards[0] ?? null;

  return {
    amount,
    purchaseDate,
    recommendedCard,
    eligibleCards,
    ineligibleCards,
    allResults,
    summary: buildSimulationSummary({
      recommendedCard,
      eligibleCardsCount: eligibleCards.length,
      ineligibleCardsCount: ineligibleCards.length,
    }),
  };
}

interface BuildSimulationSummaryOptions {
  recommendedCard: PurchaseSimulationCardResult | null;
  eligibleCardsCount: number;
  ineligibleCardsCount: number;
}

function buildSimulationSummary({
  recommendedCard,
  eligibleCardsCount,
  ineligibleCardsCount,
}: BuildSimulationSummaryOptions) {
  if (!recommendedCard) {
    return "Ninguna tarjeta tiene crédito disponible suficiente para esta compra.";
  }

  const daysToPay = recommendedCard.estimatedDaysToPay;

  const daysText =
    daysToPay === null
      ? "un tiempo estimado no disponible"
      : `${daysToPay} día(s) aproximado(s)`;

  if (eligibleCardsCount === 1) {
    return `${recommendedCard.card.alias} es la única tarjeta elegible para esta compra. Tendrías ${daysText} para pagar.`;
  }

  if (ineligibleCardsCount > 0) {
    return `${recommendedCard.card.alias} parece ser la mejor opción entre las tarjetas elegibles. Tendrías ${daysText} para pagar.`;
  }

  return `${recommendedCard.card.alias} parece ser la mejor opción para esta compra. Tendrías ${daysText} para pagar.`;
}
