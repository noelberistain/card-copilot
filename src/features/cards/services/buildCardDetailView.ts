import {
  getDaysUntilPayment,
  getPaymentTimingStatus,
  getTodayIsoDate,
} from "@/logic/cards/cardDates.logic";
import {
  getAvailableCredit,
  getCreditUsagePercentage,
  getDifferenceBetweenCurrentAndNoInterest,
} from "@/logic/cards/cardPayment.logic";
import {
  buildCardInsights,
  getCardVisualStatus,
  type CardInsight,
  type CardVisualStatus,
} from "@/logic/cards/cardStatus.logic";
import type { Card, CardSnapshot } from "@/models/cards/card.types";

export interface CardDetailView {
  card: Card;
  latestSnapshot: CardSnapshot | null;
  status: CardVisualStatus;
  insights: CardInsight[];
  metrics: CardDetailMetrics | null;
}

export interface CardDetailMetrics {
  availableCredit: number;
  creditUsagePercentage: number;
  currentVsNoInterestDifference: number;
  daysUntilPayment: number;
  paymentDueDate: string;
  lastCutoffDate: string;
}

interface BuildCardDetailViewOptions {
  card: Card;
  latestSnapshot: CardSnapshot | null;
  todayIso?: string;
}

export function buildCardDetailView({
  card,
  latestSnapshot,
  todayIso = getTodayIsoDate(),
}: BuildCardDetailViewOptions): CardDetailView {
  if (!latestSnapshot) {
    return {
      card,
      latestSnapshot: null,
      status: "no-snapshot",
      insights: [
        {
          id: "no-snapshot",
          tone: "info",
          title: "Aún no hay estado capturado",
          message:
            "Captura el estado actual de esta tarjeta para ver saldos, fechas e insights.",
        },
      ],
      metrics: null,
    };
  }

  const daysUntilPayment = getDaysUntilPayment(todayIso, latestSnapshot.paymentDueDate);

  const paymentTimingStatus = getPaymentTimingStatus(daysUntilPayment);

  const status = getCardVisualStatus(paymentTimingStatus, latestSnapshot);

  const metrics: CardDetailMetrics = {
    availableCredit: getAvailableCredit(card, latestSnapshot),
    creditUsagePercentage: getCreditUsagePercentage(card, latestSnapshot),
    currentVsNoInterestDifference:
      getDifferenceBetweenCurrentAndNoInterest(latestSnapshot),
    daysUntilPayment,
    paymentDueDate: latestSnapshot.paymentDueDate,
    lastCutoffDate: latestSnapshot.lastCutoffDate,
  };

  const insights = buildCardInsights({
    snapshot: latestSnapshot,
    paymentTimingStatus,
    daysUntilPayment,
  });

  return {
    card,
    latestSnapshot,
    status,
    insights,
    metrics,
  };
}
