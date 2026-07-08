import { ActivityIndicator, Alert, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import {
  AppButton,
  EmptyState,
  ScreenContainer,
  ScreenHeader,
} from "@/components/ui";
import { CardDatesPanel } from "@/features/cards/components/CardDatesPanel";
import { CardInsightsPanel } from "@/features/cards/components/CardInsightsPanel";
import { CardSnapshotSummary } from "@/features/cards/components/CardSnapshotSummary";
import { useCardDetail } from "@/features/cards/hooks/useCardDetail";
import { useDeactivateCard } from "@/features/cards/hooks/useDeactivateCard";

export default function CardDetailScreen() {
  const params = useLocalSearchParams<{ cardId?: string }>();
  const cardId = Array.isArray(params.cardId) ? params.cardId[0] : params.cardId;

  const { detail, loading, error, refresh } = useCardDetail({ cardId });

  const {
    deactivate,
    deactivating,
    error: deactivateError,
  } = useDeactivateCard();

  function handleDeactivate() {
    if (!detail) return;

    Alert.alert(
      "Desactivar tarjeta",
      `¿Quieres desactivar "${detail.card.alias}"? La tarjeta dejará de aparecer en Home, pero conservará su historial.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Desactivar",
          style: "destructive",
          onPress: async () => {
            try {
              await deactivate(detail.card.id);

              Alert.alert(
                "Tarjeta desactivada",
                "La tarjeta se desactivó correctamente.",
                [
                  {
                    text: "OK",
                    onPress: () =>
                      router.replace({
                        pathname: "/",
                      }),
                  },
                ]
              );
            } catch {
              // El hook ya registra el error.
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <ScreenContainer scroll={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />

          <Text className="mt-3 text-sm text-slate-500">
            Cargando detalle...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error || !detail || !cardId) {
    return (
      <ScreenContainer>
        <View className="gap-4">
          <ScreenHeader
            title="No se pudo cargar"
            subtitle={error ?? "No se encontró la tarjeta solicitada."}
            showBackButton
          />

          <AppButton title="Reintentar" onPress={refresh} />
        </View>
      </ScreenContainer>
    );
  }

  const { card, latestSnapshot, metrics, insights, status } = detail;

  return (
    <ScreenContainer>
      <View className="gap-6">
        <ScreenHeader title={card.alias} subtitle={card.bank} showBackButton />

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

          {deactivateError ? (
            <Text className="text-sm font-medium text-red-600">
              {deactivateError}
            </Text>
          ) : null}

          <AppButton
            title={deactivating ? "Desactivando..." : "Desactivar tarjeta"}
            variant="danger"
            onPress={handleDeactivate}
            disabled={deactivating}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
