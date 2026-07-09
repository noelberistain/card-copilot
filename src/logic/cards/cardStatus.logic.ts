import type { PaymentTimingStatus } from "@/logic/cards/cardDates.logic";
import {
  getDifferenceBetweenCurrentAndNoInterest,
  getPaymentGap,
  hasCurrentBalanceButNoPaymentDue,
  hasNoPaymentDue,
  hasPostCutoffBalance,
  isMinimumPaymentLowerThanNoInterest,
} from "@/logic/cards/cardPayment.logic";
import type { CardSnapshot } from "@/models/cards/card.types";

export type CardInsightTone = "info" | "warning" | "danger" | "success";

export interface CardInsight {
  id: string;
  tone: CardInsightTone;
  title: string;
  message: string;
}

export type CardVisualStatus =
  "overdue" | "due-today" | "urgent" | "soon" | "ok" | "no-payment-due" | "no-snapshot";

interface BuildCardInsightsOptions {
  snapshot: CardSnapshot;
  paymentTimingStatus: PaymentTimingStatus;
  daysUntilPayment: number;
}

export function getCardVisualStatus(
  paymentTimingStatus: PaymentTimingStatus,
  snapshot?: CardSnapshot
): CardVisualStatus {
  if (snapshot && hasNoPaymentDue(snapshot)) {
    return "no-payment-due";
  }

  return paymentTimingStatus;
}

export function buildCardInsights({
  snapshot,
  paymentTimingStatus,
  daysUntilPayment,
}: BuildCardInsightsOptions): CardInsight[] {
  const insights: CardInsight[] = [];

  if (hasNoPaymentDue(snapshot)) {
    insights.push({
      id: "no-payment-due",
      tone: "success",
      title: "No tienes pago requerido en este ciclo",
      message:
        "El pago mínimo, el pago para no generar intereses y el saldo al corte están en cero. Esto normalmente indica que ya cubriste el saldo requerido del ciclo o no había pago pendiente.",
    });

    if (hasCurrentBalanceButNoPaymentDue(snapshot)) {
      insights.push({
        id: "current-balance-next-cycle",
        tone: "info",
        title: "Tu saldo actual puede pertenecer al siguiente ciclo",
        message:
          "Aunque tienes saldo actual, no parece haber pago requerido para este ciclo. Ese saldo podría corresponder a compras posteriores al corte.",
      });
    }

    return insights;
  }

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
      message: `Tu saldo actual es mayor que el pago para no generar intereses. La diferencia aproximada es de ${difference.toFixed(
        2
      )}. Esto normalmente puede pasar cuando hiciste compras después del último corte: esas compras ya aparecen en tu saldo actual, pero podrían pertenecer al siguiente ciclo. Para este ciclo, el monto clave para evitar intereses suele ser el pago para no generar intereses. Aun así, confirma siempre contra tu app bancaria.`,
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
