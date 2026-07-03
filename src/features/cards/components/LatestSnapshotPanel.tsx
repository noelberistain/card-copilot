import { ActivityIndicator, Text, View } from "react-native";

import type { CardSnapshot } from "@/models/cards/card.types";
import { formatCurrency } from "@/lib/money/formatCurrency";

interface LatestSnapshotPanelProps {
  snapshot: CardSnapshot | null;
  loading?: boolean;
  error?: string | null;
}

export function LatestSnapshotPanel({
  snapshot,
  loading = false,
  error,
}: LatestSnapshotPanelProps) {
  if (loading) {
    return (
      <View className="rounded-3xl bg-white p-5">
        <View className="flex-row items-center gap-3">
          <ActivityIndicator />
          <Text className="text-sm text-slate-500">
            Cargando último estado...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="rounded-3xl bg-red-50 p-5">
        <Text className="text-base font-semibold text-red-700">
          No se pudo cargar el último estado
        </Text>

        <Text className="mt-1 text-sm text-red-600">{error}</Text>
      </View>
    );
  }

  if (!snapshot) {
    return (
      <View className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <Text className="text-base font-semibold text-slate-900">
          Sin estado capturado
        </Text>

        <Text className="mt-1 text-sm text-slate-500">
          Captura el estado actual de esta tarjeta para empezar a ver saldos,
          pagos y fechas importantes.
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-3xl bg-white p-5">
      <Text className="text-base font-semibold text-slate-900">
        Último estado capturado
      </Text>

      <Text className="mt-1 text-sm text-slate-500">
        Capturado: {snapshot.capturedAt}
      </Text>

      <View className="mt-4 gap-3">
        <View className="rounded-2xl bg-slate-100 p-4">
          <Text className="text-xs text-slate-500">Saldo actual</Text>
          <Text className="mt-1 text-xl font-bold text-slate-950">
            {formatCurrency(snapshot.currentBalance)}
          </Text>
        </View>

        <View className="rounded-2xl bg-slate-100 p-4">
          <Text className="text-xs text-slate-500">
            Pago para no generar intereses
          </Text>
          <Text className="mt-1 text-xl font-bold text-slate-950">
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
            <Text className="text-xs text-slate-500">Fecha límite</Text>
            <Text className="mt-1 text-base font-semibold text-slate-950">
              {snapshot.paymentDueDate}
            </Text>
          </View>
        </View>

        {snapshot.notes ? (
          <View className="rounded-2xl bg-slate-100 p-4">
            <Text className="text-xs text-slate-500">Notas</Text>
            <Text className="mt-1 text-sm text-slate-700">
              {snapshot.notes}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
