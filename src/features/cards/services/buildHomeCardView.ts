import type { Card, CardSnapshot } from "@/models/cards/card.types";
import { getDaysUntilPayment } from "@/logic/cards/cardDates.logic";
import { hasNoPaymentDue } from "@/logic/cards/cardPayment.logic";
import { formatShortDate } from "@/lib/date/formatShortDate";
import { formatCurrency } from "@/lib/money/formatCurrency";

export type HomeCardPaymentTone =
  | "default"
  | "danger"
  | "warning"
  | "success";

export interface HomeCardView {
  card: Card;
  latestSnapshot: CardSnapshot | null;
  balanceLabel: string;
  balanceValue: string;
  paymentLabel: string;
  paymentValue: string;
  cutoffText: string;
  dueText: string;
  paymentTone: HomeCardPaymentTone;
}

interface BuildHomeCardViewOptions {
  card: Card;
  latestSnapshot: CardSnapshot | null;
  todayIso?: string;
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function buildPaymentDisplay(snapshot: CardSnapshot, todayIso: string) {
  if (hasNoPaymentDue(snapshot)) {
    return {
      paymentLabel: "Sin pago requerido",
      paymentValue: "Por ahora",
      paymentTone: "success" as const,
    };
  }

  const daysUntilPayment = getDaysUntilPayment(
    todayIso,
    snapshot.paymentDueDate
  );

  const paymentAmount = formatCurrency(snapshot.paymentToAvoidInterest);

  if (daysUntilPayment < 0) {
    return {
      paymentLabel: "Pago vencido",
      paymentValue: `${paymentAmount} · hace ${Math.abs(
        daysUntilPayment
      )} día(s)`,
      paymentTone: "danger" as const,
    };
  }

  if (daysUntilPayment === 0) {
    return {
      paymentLabel: "Pago vence hoy",
      paymentValue: paymentAmount,
      paymentTone: "danger" as const,
    };
  }

  if (daysUntilPayment <= 3) {
    return {
      paymentLabel: "Pago vence pronto",
      paymentValue: `${paymentAmount} · en ${daysUntilPayment} día(s)`,
      paymentTone: "warning" as const,
    };
  }

  return {
    paymentLabel: "Próximo pago",
    paymentValue: paymentAmount,
    paymentTone: "default" as const,
  };
}

export function buildHomeCardView({
  card,
  latestSnapshot,
  todayIso = getTodayIsoDate(),
}: BuildHomeCardViewOptions): HomeCardView {
  if (!latestSnapshot) {
    return {
      card,
      latestSnapshot: null,
      balanceLabel: "Saldo actual",
      balanceValue: "-",
      paymentLabel: "Sin estado",
      paymentValue: "Captura estado",
      cutoffText: "Corte -",
      dueText: "Límite -",
      paymentTone: "default",
    };
  }

  const paymentDisplay = buildPaymentDisplay(latestSnapshot, todayIso);

  const daysUntilPayment = getDaysUntilPayment(
    todayIso,
    latestSnapshot.paymentDueDate
  );

  const dueText =
    daysUntilPayment === 0
      ? "Límite hoy"
      : `Límite ${formatShortDate(latestSnapshot.paymentDueDate)}`;

  return {
    card,
    latestSnapshot,
    balanceLabel: "Saldo actual",
    balanceValue: formatCurrency(latestSnapshot.currentBalance),
    paymentLabel: paymentDisplay.paymentLabel,
    paymentValue: paymentDisplay.paymentValue,
    cutoffText: `Corte ${formatShortDate(latestSnapshot.lastCutoffDate)}`,
    dueText,
    paymentTone: paymentDisplay.paymentTone,
  };
}
