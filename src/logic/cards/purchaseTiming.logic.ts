import {
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  format,
  parseISO,
} from "date-fns";

import { getAvailableCredit } from "@/logic/cards/cardPayment.logic";
import type { Card, CardSnapshot } from "@/models/cards/card.types";

export type PurchaseSimulationEvaluationStatus =
  "eligible" | "ineligible" | "not-evaluated";

export interface PurchaseSimulationCardInput {
  card: Card;
  latestSnapshot: CardSnapshot | null;
}

export interface PurchaseSimulationCardResult {
  card: Card;
  latestSnapshot: CardSnapshot | null;
  eligible: boolean;
  evaluationStatus: PurchaseSimulationEvaluationStatus;
  reason: string;
  availableCredit: number;
  estimatedCutoffDate: string | null;
  estimatedPaymentDueDate: string | null;
  estimatedDaysToPay: number | null;
  score: number;
}

interface EstimatePurchaseTimingOptions {
  card: Card;
  purchaseDate: string;
}

interface RankCardsForPurchaseOptions {
  cards: PurchaseSimulationCardInput[];
  amount: number;
  purchaseDate: string;
}

function createDateWithClampedDay(year: number, monthIndex: number, day: number) {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDay = endOfMonth(firstDayOfMonth).getDate();
  const safeDay = Math.min(day, lastDay);

  return new Date(year, monthIndex, safeDay);
}

export function estimatePurchaseCutoffDate({
  card,
  purchaseDate,
}: EstimatePurchaseTimingOptions) {
  const purchase = parseISO(purchaseDate);

  const currentMonthCutoff = createDateWithClampedDay(
    purchase.getFullYear(),
    purchase.getMonth(),
    card.cutoffDay
  );

  if (purchase <= currentMonthCutoff) {
    return format(currentMonthCutoff, "yyyy-MM-dd");
  }

  const nextMonth = addMonths(purchase, 1);

  const nextMonthCutoff = createDateWithClampedDay(
    nextMonth.getFullYear(),
    nextMonth.getMonth(),
    card.cutoffDay
  );

  return format(nextMonthCutoff, "yyyy-MM-dd");
}

export function estimatePaymentDueDateFromCutoff(card: Card, cutoffDate: string) {
  const cutoff = parseISO(cutoffDate);

  const sameMonthDueDate = createDateWithClampedDay(
    cutoff.getFullYear(),
    cutoff.getMonth(),
    card.paymentDueDay
  );

  if (sameMonthDueDate > cutoff) {
    return format(sameMonthDueDate, "yyyy-MM-dd");
  }

  const nextMonth = addMonths(cutoff, 1);

  const nextMonthDueDate = createDateWithClampedDay(
    nextMonth.getFullYear(),
    nextMonth.getMonth(),
    card.paymentDueDay
  );

  return format(nextMonthDueDate, "yyyy-MM-dd");
}

export function estimatePurchasePaymentDueDate({
  card,
  purchaseDate,
}: EstimatePurchaseTimingOptions) {
  const cutoffDate = estimatePurchaseCutoffDate({
    card,
    purchaseDate,
  });

  return estimatePaymentDueDateFromCutoff(card, cutoffDate);
}

export function estimatePurchaseDaysToPay({
  card,
  purchaseDate,
}: EstimatePurchaseTimingOptions) {
  const paymentDueDate = estimatePurchasePaymentDueDate({
    card,
    purchaseDate,
  });

  return differenceInCalendarDays(parseISO(paymentDueDate), parseISO(purchaseDate));
}

export function isCardEligibleForPurchase(amount: number, availableCredit: number) {
  return amount > 0 && availableCredit >= amount;
}

export function buildPurchaseSimulationCardResult({
  card,
  latestSnapshot,
  amount,
  purchaseDate,
}: PurchaseSimulationCardInput & {
  amount: number;
  purchaseDate: string;
}): PurchaseSimulationCardResult {
  const estimatedCutoffDate = estimatePurchaseCutoffDate({
    card,
    purchaseDate,
  });

  const estimatedPaymentDueDate = estimatePurchasePaymentDueDate({
    card,
    purchaseDate,
  });

  const estimatedDaysToPay = estimatePurchaseDaysToPay({
    card,
    purchaseDate,
  });

  if (!latestSnapshot) {
    return {
      card,
      latestSnapshot,
      eligible: false,
      evaluationStatus: "not-evaluated",
      reason:
        "Falta capturar el estado actual de esta tarjeta. Sin un snapshot no podemos saber su crédito disponible real.",
      availableCredit: 0,
      estimatedCutoffDate,
      estimatedPaymentDueDate,
      estimatedDaysToPay,
      score: -1,
    };
  }

  const availableCredit = getAvailableCredit(card, latestSnapshot);
  const eligible = isCardEligibleForPurchase(amount, availableCredit);

  if (!eligible) {
    return {
      card,
      latestSnapshot,
      eligible: false,
      evaluationStatus: "ineligible",
      reason: "No tiene crédito disponible suficiente para esta compra.",
      availableCredit,
      estimatedCutoffDate,
      estimatedPaymentDueDate,
      estimatedDaysToPay,
      score: -1,
    };
  }

  return {
    card,
    latestSnapshot,
    eligible: true,
    evaluationStatus: "eligible",
    reason: `Tendrías aproximadamente ${estimatedDaysToPay} día(s) para pagar esta compra.`,
    availableCredit,
    estimatedCutoffDate,
    estimatedPaymentDueDate,
    estimatedDaysToPay,
    score: estimatedDaysToPay,
  };
}

export function rankCardsForPurchase({
  cards,
  amount,
  purchaseDate,
}: RankCardsForPurchaseOptions) {
  const results = cards.map(({ card, latestSnapshot }) =>
    buildPurchaseSimulationCardResult({
      card,
      latestSnapshot,
      amount,
      purchaseDate,
    })
  );

  return results.sort((a, b) => {
    if (a.evaluationStatus === "eligible" && b.evaluationStatus !== "eligible") {
      return -1;
    }

    if (a.evaluationStatus !== "eligible" && b.evaluationStatus === "eligible") {
      return 1;
    }

    if (a.evaluationStatus === "ineligible" && b.evaluationStatus === "not-evaluated") {
      return -1;
    }

    if (a.evaluationStatus === "not-evaluated" && b.evaluationStatus === "ineligible") {
      return 1;
    }

    return b.score - a.score;
  });
}
