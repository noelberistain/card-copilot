import { Text, View } from "react-native";

import type { CardDetailMetrics } from "@/features/cards/services/buildCardDetailView";
import { formatCurrency } from "@/lib/money/formatCurrency";
import type { CardSnapshot } from "@/models/cards/card.types";

interface CardSnapshotSummaryProps {
  snapshot: CardSnapshot;
  metrics: CardDetailMetrics;
}

export function CardSnapshotSummary({ snapshot, metrics }: CardSnapshotSummaryProps) {
  return (
    <View className="rounded-3xl bg-white p-5">
      <Text className="text-base font-semibold text-slate-900">Resumen actual</Text>

      <Text className="mt-1 text-sm text-slate-500">
        Capturado: {snapshot.capturedAt}
      </Text>

      <View className="mt-5 gap-3">
        <View className="rounded-2xl bg-slate-100 p-4">
          <Text className="text-xs text-slate-500">Saldo actual</Text>
          <Text className="mt-1 text-2xl font-bold text-slate-950">
            {formatCurrency(snapshot.currentBalance)}
          </Text>
        </View>

        <View className="rounded-2xl bg-slate-100 p-4">
          <Text className="text-xs text-slate-500">Pago para no generar intereses</Text>
          <Text className="mt-1 text-2xl font-bold text-slate-950">
            {formatCurrency(snapshot.paymentToAvoidInterest)}
          </Text>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-slate-100 p-4">
            <Text className="text-xs text-slate-500">Pago mínimo</Text>
            <Text className="mt-1 text-base font-semibold text-slate-950">
              {formatCurrency(snapshot.minimumPayment)}
            </Text>
          </View>

          <View className="flex-1 rounded-2xl bg-slate-100 p-4">
            <Text className="text-xs text-slate-500">Crédito disponible</Text>
            <Text className="mt-1 text-base font-semibold text-slate-950">
              {formatCurrency(metrics.availableCredit)}
            </Text>
          </View>
        </View>

        <View className="rounded-2xl bg-slate-100 p-4">
          <Text className="text-xs text-slate-500">Uso de línea</Text>
          <Text className="mt-1 text-base font-semibold text-slate-950">
            {metrics.creditUsagePercentage.toFixed(1)}%
          </Text>
        </View>

        {metrics.currentVsNoInterestDifference > 0 ? (
          <View className="rounded-2xl bg-blue-50 p-4">
            <Text className="text-xs text-blue-600">
              Diferencia entre saldo actual y pago sin intereses
            </Text>
            <Text className="mt-1 text-base font-semibold text-blue-900">
              {formatCurrency(metrics.currentVsNoInterestDifference)}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
