import type { CardSnapshot } from "@/models/cards/card.types";
import {
  getDifferenceBetweenCurrentAndNoInterest,
  getPaymentGap,
  hasPostCutoffBalance,
  isMinimumPaymentLowerThanNoInterest,
} from "@/logic/cards/cardPayment.logic";
import type { PaymentTimingStatus } from "@/logic/cards/cardDates.logic";

export type CardInsightTone = "info" | "warning" | "danger" | "success";

export interface CardInsight {
  id: string;
  tone: CardInsightTone;
  title: string;
  message: string;
}

export type CardVisualStatus =
  | "overdue"
  | "due-today"
  | "urgent"
  | "soon"
  | "ok"
  | "no-snapshot";

interface BuildCardInsightsOptions {
  snapshot: CardSnapshot;
  paymentTimingStatus: PaymentTimingStatus;
  daysUntilPayment: number;
}

export function getCardVisualStatus(
  paymentTimingStatus: PaymentTimingStatus
): CardVisualStatus {
  return paymentTimingStatus;
}

export function buildCardInsights({
  snapshot,
  paymentTimingStatus,
  daysUntilPayment,
}: BuildCardInsightsOptions): CardInsight[] {
  const insights: CardInsight[] = [];

  if (paymentTimingStatus === "overdue") {
    insights.push({
      id: "payment-overdue",
      tone: "danger",
      title: "Tu fecha límite ya pasó",
      message:
        "Esta tarjeta aparece como vencida según la fecha límite capturada. Revisa tu app bancaria y prioriza este pago.",
    });
  }

  if (paymentTimingStatus === "due-today") {
    insights.push({
      id: "payment-due-today",
      tone: "danger",
      title: "Tu pago vence hoy",
      message:
        "Si aún no has pagado, conviene hacerlo hoy para evitar cargos o intereses.",
    });
  }

  if (paymentTimingStatus === "urgent") {
    insights.push({
      id: "payment-urgent",
      tone: "warning",
      title: "Tu pago está cerca",
      message: `Faltan ${daysUntilPayment} día(s) para la fecha límite de pago.`,
    });
  }

  if (paymentTimingStatus === "soon") {
    insights.push({
      id: "payment-soon",
      tone: "info",
      title: "Tu pago viene pronto",
      message: `Faltan ${daysUntilPayment} día(s) para la fecha límite de pago. Aún tienes algo de margen.`,
    });
  }

  if (hasPostCutoffBalance(snapshot)) {
    const difference = getDifferenceBetweenCurrentAndNoInterest(snapshot);

    insights.push({
      id: "post-cutoff-balance",
      tone: "info",
      title: "No todo tu saldo actual toca pagarlo ahora",
      message: `Hay una diferencia entre tu saldo actual y tu pago para no generar intereses. Esa diferencia es de aproximadamente ${difference.toFixed(
        2
      )}. Puede corresponder a compras posteriores al último corte.`,
    });
  }

  if (isMinimumPaymentLowerThanNoInterest(snapshot)) {
    const gap = getPaymentGap(snapshot);

    insights.push({
      id: "minimum-payment-interest",
      tone: "warning",
      title: "Pagar solo el mínimo puede generar intereses",
      message: `El pago mínimo es menor que el pago para no generar intereses. Para evitar intereses, necesitarías pagar aproximadamente ${gap.toFixed(
        2
      )} más que el mínimo.`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "no-critical-insights",
      tone: "success",
      title: "No vemos alertas importantes por ahora",
      message:
        "Con la información capturada, esta tarjeta no parece tener señales urgentes. Aun así, revisa tu app bancaria antes de pagar.",
    });
  }

  return insights;
}
