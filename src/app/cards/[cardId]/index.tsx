import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

import { AppButton, EmptyState, ScreenContainer } from "@/components/ui";
import { CardDatesPanel } from "@/features/cards/components/CardDatesPanel";
import { CardInsightsPanel } from "@/features/cards/components/CardInsightsPanel";
import { CardSnapshotSummary } from "@/features/cards/components/CardSnapshotSummary";
import { useCardDetail } from "@/features/cards/hooks/useCardDetail";

export default function CardDetailScreen() {
  const params = useLocalSearchParams<{ cardId?: string }>();
  const cardId = Array.isArray(params.cardId) ? params.cardId[0] : params.cardId;

  const { detail, loading, error, refresh } = useCardDetail({ cardId });

  if (loading) {
    return (
      <ScreenContainer scroll={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />

          <Text className="mt-3 text-sm text-slate-500">Cargando detalle...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error || !detail || !cardId) {
    return (
      <ScreenContainer>
        <View className="gap-4">
          <Text className="text-3xl font-bold text-slate-950">No se pudo cargar</Text>

          <Text className="text-base text-slate-500">
            {error ?? "No se encontró la tarjeta solicitada."}
          </Text>

          <AppButton title="Reintentar" onPress={refresh} />

          <AppButton title="Volver" variant="secondary" onPress={() => router.back()} />
        </View>
      </ScreenContainer>
    );
  }

  const { card, latestSnapshot, metrics, insights, status } = detail;

  return (
    <ScreenContainer>
      <View className="gap-6">
        <View>
          <Text className="text-3xl font-bold text-slate-950">{card.alias}</Text>

          <Text className="mt-2 text-base text-slate-500">{card.bank}</Text>
        </View>

        {!latestSnapshot || !metrics ? (
          <EmptyState
            title="Sin estado capturado"
            message="Captura el estado actual de esta tarjeta para ver saldos, fechas e insights."
          />
        ) : (
          <>
            <CardSnapshotSummary snapshot={latestSnapshot} metrics={metrics} />

            <CardDatesPanel metrics={metrics} status={status} />

            <CardInsightsPanel insights={insights} />
          </>
        )}

        <View className="gap-3">
          <AppButton
            title="Capturar estado actual"
            onPress={() =>
              router.push({
                pathname: "/cards/[cardId]/snapshot",
                params: {
                  cardId: card.id,
                },
              })
            }
          />

          <AppButton
            title="Editar tarjeta"
            variant="secondary"
            onPress={() =>
              router.push({
                pathname: "/cards/[cardId]/edit",
                params: {
                  cardId: card.id,
                },
              })
            }
          />

          <AppButton title="Volver" variant="secondary" onPress={() => router.back()} />
        </View>
      </View>
    </ScreenContainer>
  );
}
