import { ActivityIndicator, Text, View } from "react-native";

import { AppButton } from "@/components/ui";
import { formatHumanDateTime } from "@/lib/date/formatHumanDateTime";
import { formatCurrency } from "@/lib/money/formatCurrency";
import type { CardSnapshot } from "@/models/cards/card.types";

interface LatestSnapshotPanelProps {
  snapshot: CardSnapshot | null;
  loading?: boolean;
  error?: string | null;
  onEditSnapshot?: () => void;
}

export function LatestSnapshotPanel({
  snapshot,
  loading = false,
  error,
  onEditSnapshot,
}: LatestSnapshotPanelProps) {
  if (loading) {
    return (
      <View className="rounded-3xl bg-surface-muted p-5">
        <View className="flex-row items-center gap-3">
          <ActivityIndicator />

          <Text className="text-sm text-ink-muted">Cargando último estado...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="rounded-3xl bg-danger/10 p-5">
        <Text className="font-sans-semibold text-base text-danger">
          No se pudo cargar el último estado
        </Text>

        <Text className="mt-1 text-sm text-danger">{error}</Text>
      </View>
    );
  }

  if (!snapshot) {
    return (
      <View className="rounded-3xl border border-dashed border-ink-muted/30 bg-surface-muted p-5">
        <Text className="font-display text-base text-ink">Sin estado capturado</Text>

        <Text className="mt-1 text-sm text-ink-muted">
          Captura el estado actual de esta tarjeta para empezar a ver saldos, pagos y
          fechas importantes.
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-3xl bg-surface-muted p-5">
      <Text className="font-display text-base text-ink">Último estado capturado</Text>

      <Text className="mt-1 text-sm text-ink-muted">
        Capturado: {formatHumanDateTime(snapshot.capturedAt)}
      </Text>

      <View className="mt-4 gap-3">
        <View className="rounded-2xl bg-surface p-4">
          <Text className="text-xs text-ink-muted">Saldo actual</Text>

          <Text className="mt-1 font-display-bold text-xl tabular-nums text-ink">
            {formatCurrency(snapshot.currentBalance)}
          </Text>
        </View>
        <View className="rounded-2xl bg-surface p-4">
          <Text className="text-xs text-ink-muted">Pago para no generar intereses</Text>

          <Text className="mt-1 font-display-bold text-xl tabular-nums text-ink">
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
            <Text className="text-xs text-ink-muted">Fecha límite</Text>

            <Text className="mt-1 font-display-bold text-base tabular-nums text-ink">
              {snapshot.paymentDueDate}
            </Text>
          </View>
        </View>
        {snapshot.notes ? (
          <View className="rounded-2xl bg-surface p-4">
            <Text className="text-xs text-ink-muted">Notas</Text>

            <Text className="mt-1 text-sm text-ink">{snapshot.notes}</Text>
          </View>
        ) : null}
        {onEditSnapshot ? (
          <AppButton
            title="Editar estado capturado"
            variant="secondary"
            onPress={onEditSnapshot}
          />
        ) : null}
      </View>
    </View>
  );
}
