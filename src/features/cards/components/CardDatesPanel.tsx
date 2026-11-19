import { Text, View } from "react-native";

import type { CardDetailMetrics } from "@/features/cards/services/buildCardDetailView";
import type { CardVisualStatus } from "@/logic/cards/cardStatus.logic";

interface CardDatesPanelProps {
  metrics: CardDetailMetrics;
  status: CardVisualStatus;
}

function getStatusLabel(status: CardVisualStatus) {
  switch (status) {
    case "overdue":
      return "Pago vencido";
    case "due-today":
      return "Vence hoy";
    case "urgent":
      return "Pago urgente";
    case "soon":
      return "Pago próximo";
    case "ok":
      return "Pago en tiempo";
    case "no-snapshot":
      return "Sin estado";
    case "no-payment-due":
      return "Sin pago requerido";
    default:
      return "Estado desconocido";
  }
}

function getStatusClasses(status: CardVisualStatus) {
  switch (status) {
    case "overdue":
    case "due-today":
      return "bg-danger/10 text-danger";
    case "urgent":
      return "bg-warning/10 text-warning";
    case "soon":
      return "bg-primary-muted text-primary";
    case "ok":
      return "bg-success/10 text-success";
    case "no-payment-due":
      return "bg-success/10 text-success";
    case "no-snapshot":
    default:
      return "bg-ink-muted/10 text-ink-muted";
  }
}

export function CardDatesPanel({ metrics, status }: CardDatesPanelProps) {
  return (
    <View className="rounded-3xl bg-surface-muted p-5">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="font-display text-base text-ink">Fechas importantes</Text>

          <Text className="mt-1 text-sm text-ink-muted">
            Basado en el último estado capturado.
          </Text>
        </View>

        <View className={`rounded-full px-3 py-1 ${getStatusClasses(status)}`}>
          <Text className="font-sans-semibold text-xs">{getStatusLabel(status)}</Text>
        </View>
      </View>

      <View className="mt-5 gap-3">
        <View className="rounded-2xl bg-surface p-4">
          <Text className="text-xs text-ink-muted">Fecha límite de pago</Text>
          <Text className="mt-1 font-display-bold text-lg tabular-nums text-ink">
            {metrics.paymentDueDate}
          </Text>

          <Text className="mt-1 text-sm text-ink-muted">
            {metrics.daysUntilPayment < 0
              ? `Venció hace ${Math.abs(metrics.daysUntilPayment)} día(s).`
              : metrics.daysUntilPayment === 0
                ? "Vence hoy."
                : `Faltan ${metrics.daysUntilPayment} día(s).`}
          </Text>
        </View>

        <View className="rounded-2xl bg-surface p-4">
          <Text className="text-xs text-ink-muted">Último corte</Text>
          <Text className="mt-1 font-display-bold text-lg tabular-nums text-ink">
            {metrics.lastCutoffDate}
          </Text>
        </View>
      </View>
    </View>
  );
}
