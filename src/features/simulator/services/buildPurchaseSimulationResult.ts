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
  notEvaluatedCards: PurchaseSimulationCardResult[];
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

  const eligibleCards = allResults.filter(
    (result) => result.evaluationStatus === "eligible"
  );

  const ineligibleCards = allResults.filter(
    (result) => result.evaluationStatus === "ineligible"
  );

  const notEvaluatedCards = allResults.filter(
    (result) => result.evaluationStatus === "not-evaluated"
  );

  const recommendedCard = eligibleCards[0] ?? null;

  return {
    amount,
    purchaseDate,
    recommendedCard,
    eligibleCards,
    ineligibleCards,
    notEvaluatedCards,
    allResults,
    summary: buildSimulationSummary({
      recommendedCard,
      eligibleCardsCount: eligibleCards.length,
      ineligibleCardsCount: ineligibleCards.length,
      notEvaluatedCardsCount: notEvaluatedCards.length,
    }),
  };
}

interface BuildSimulationSummaryOptions {
  recommendedCard: PurchaseSimulationCardResult | null;
  eligibleCardsCount: number;
  ineligibleCardsCount: number;
  notEvaluatedCardsCount: number;
}

function buildSimulationSummary({
  recommendedCard,
  eligibleCardsCount,
  ineligibleCardsCount,
  notEvaluatedCardsCount,
}: BuildSimulationSummaryOptions) {
  if (!recommendedCard) {
    if (notEvaluatedCardsCount > 0 && ineligibleCardsCount === 0) {
      return "No hay tarjetas evaluadas para esta compra. Captura el estado actual de tus tarjetas para poder simular con datos más confiables.";
    }

    if (notEvaluatedCardsCount > 0) {
      return "Ninguna tarjeta evaluada tiene crédito disponible suficiente para esta compra. Algunas tarjetas no se evaluaron porque no tienen un estado capturado.";
    }

    return "Ninguna tarjeta tiene crédito disponible suficiente para esta compra.";
  }

  const daysToPay = recommendedCard.estimatedDaysToPay;

  const daysText =
    daysToPay === null
      ? "un tiempo estimado no disponible"
      : `${daysToPay} día(s) aproximado(s)`;

  if (eligibleCardsCount === 1) {
    if (notEvaluatedCardsCount > 0) {
      return `${recommendedCard.card.alias} es la única tarjeta elegible entre las tarjetas evaluadas. Tendrías ${daysText} para pagar. Algunas tarjetas no se evaluaron porque no tienen estado capturado.`;
    }

    return `${recommendedCard.card.alias} es la única tarjeta elegible para esta compra. Tendrías ${daysText} para pagar.`;
  }

  if (ineligibleCardsCount > 0 || notEvaluatedCardsCount > 0) {
    return `${recommendedCard.card.alias} parece ser la mejor opción entre las tarjetas evaluadas y elegibles. Tendrías ${daysText} para pagar.`;
  }

  return `${recommendedCard.card.alias} parece ser la mejor opción para esta compra. Tendrías ${daysText} para pagar.`;
}
