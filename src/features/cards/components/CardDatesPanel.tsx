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
      return "bg-red-50 text-red-700";
    case "urgent":
      return "bg-amber-50 text-amber-700";
    case "soon":
      return "bg-blue-50 text-blue-700";
    case "ok":
      return "bg-emerald-50 text-emerald-700";
    case "no-payment-due":
      return "bg-emerald-50 text-emerald-700";  
    case "no-snapshot":
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export function CardDatesPanel({ metrics, status }: CardDatesPanelProps) {
  return (
    <View className="rounded-3xl bg-white p-5">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-slate-900">
            Fechas importantes
          </Text>

          <Text className="mt-1 text-sm text-slate-500">
            Basado en el último estado capturado.
          </Text>
        </View>

        <View className={`rounded-full px-3 py-1 ${getStatusClasses(status)}`}>
          <Text className="text-xs font-semibold">{getStatusLabel(status)}</Text>
        </View>
      </View>

      <View className="mt-5 gap-3">
        <View className="rounded-2xl bg-slate-100 p-4">
          <Text className="text-xs text-slate-500">Fecha límite de pago</Text>
          <Text className="mt-1 text-lg font-bold text-slate-950">
            {metrics.paymentDueDate}
          </Text>

          <Text className="mt-1 text-sm text-slate-500">
            {metrics.daysUntilPayment < 0
              ? `Venció hace ${Math.abs(metrics.daysUntilPayment)} día(s).`
              : metrics.daysUntilPayment === 0
                ? "Vence hoy."
                : `Faltan ${metrics.daysUntilPayment} día(s).`}
          </Text>
        </View>

        <View className="rounded-2xl bg-slate-100 p-4">
          <Text className="text-xs text-slate-500">Último corte</Text>
          <Text className="mt-1 text-lg font-bold text-slate-950">
            {metrics.lastCutoffDate}
          </Text>
        </View>
      </View>
    </View>
  );
}
