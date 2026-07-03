import type { Card, CardSnapshot } from "@/models/cards/card.types";

export function getAvailableCredit(card: Card, snapshot: CardSnapshot) {
  return Math.max(card.creditLimit - snapshot.currentBalance, 0);
}

export function getCreditUsagePercentage(card: Card, snapshot: CardSnapshot) {
  if (card.creditLimit <= 0) return 0;

  return Math.min((snapshot.currentBalance / card.creditLimit) * 100, 100);
}

export function getDifferenceBetweenCurrentAndNoInterest(
  snapshot: CardSnapshot
) {
  return Math.max(
    snapshot.currentBalance - snapshot.paymentToAvoidInterest,
    0
  );
}

export function hasPostCutoffBalance(snapshot: CardSnapshot) {
  return snapshot.currentBalance > snapshot.paymentToAvoidInterest;
}

export function isMinimumPaymentLowerThanNoInterest(snapshot: CardSnapshot) {
  return snapshot.minimumPayment < snapshot.paymentToAvoidInterest;
}

export function getPaymentGap(snapshot: CardSnapshot) {
  return Math.max(
    snapshot.paymentToAvoidInterest - snapshot.minimumPayment,
    0
  );
}
