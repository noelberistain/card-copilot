import { Text, View } from "react-native";

import type { CardDetailMetrics } from "@/features/cards/services/buildCardDetailView";
import { formatHumanDateTime } from "@/lib/date/formatHumanDateTime";
import { formatCurrency } from "@/lib/money/formatCurrency";
import type { CardSnapshot } from "@/models/cards/card.types";

interface CardSnapshotSummaryProps {
  snapshot: CardSnapshot;
  metrics: CardDetailMetrics;
}

export function CardSnapshotSummary({ snapshot, metrics }: CardSnapshotSummaryProps) {
  return (
    <View className="rounded-3xl bg-surface-muted p-5">
      <Text className="font-display text-base text-ink">Resumen actual</Text>

      <Text className="mt-1 text-sm text-ink-muted">
        Capturado: {formatHumanDateTime(snapshot.capturedAt)}
      </Text>

      <View className="mt-5 gap-3">
        <View className="rounded-2xl bg-surface p-4">
          <Text className="text-xs text-ink-muted">Saldo actual</Text>
          <Text className="mt-1 font-display-bold text-2xl tabular-nums text-ink">
            {formatCurrency(snapshot.currentBalance)}
          </Text>
        </View>

        <View className="rounded-2xl bg-surface p-4">
          <Text className="text-xs text-ink-muted">Pago para no generar intereses</Text>
          <Text className="mt-1 font-display-bold text-2xl tabular-nums text-ink">
            {formatCurrency(snapshot.paymentToAvoidInterest)}
          </Text>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-surface p-4">
            <Text className="text-xs text-ink-muted">Pago mínimo</Text>
            <Text className="mt-1 font-display-bold text-base tabular-nums text-ink">
              {formatCurrency(snapshot.minimumPayment)}
            </Text>
          </View>

          <View className="flex-1 rounded-2xl bg-surface p-4">
            <Text className="text-xs text-ink-muted">Crédito disponible</Text>
            <Text className="mt-1 font-display-bold text-base tabular-nums text-ink">
              {formatCurrency(metrics.availableCredit)}
            </Text>
          </View>
        </View>

        <View className="rounded-2xl bg-surface p-4">
          <Text className="text-xs text-ink-muted">Uso de línea</Text>
          <Text className="mt-1 font-display-bold text-base tabular-nums text-ink">
            {metrics.creditUsagePercentage.toFixed(1)}%
          </Text>
        </View>

        {metrics.currentVsNoInterestDifference > 0 ? (
          <View className="rounded-2xl bg-primary-muted p-4">
            <Text className="text-xs text-primary">
              Diferencia entre saldo actual y pago sin intereses
            </Text>
            <Text className="mt-1 font-display-bold text-base tabular-nums text-primary">
              {formatCurrency(metrics.currentVsNoInterestDifference)}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
