import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, Text, View } from "react-native";

import { AppButton, EmptyState, ScreenContainer, ScreenHeader } from "@/components/ui";
import { CardDatesPanel } from "@/features/cards/components/CardDatesPanel";
import { CardInsightsPanel } from "@/features/cards/components/CardInsightsPanel";
import { CardSnapshotSummary } from "@/features/cards/components/CardSnapshotSummary";
import { useCardDetail } from "@/features/cards/hooks/useCardDetail";
import { useDeactivateCard } from "@/features/cards/hooks/useDeactivateCard";
import { useReactivateCard } from "@/features/cards/hooks/useReactivateCard";

export default function CardDetailScreen() {
  const params = useLocalSearchParams<{ cardId?: string }>();
  const cardId = Array.isArray(params.cardId) ? params.cardId[0] : params.cardId;

  const { detail, loading, error, refresh } = useCardDetail({ cardId });
  const { reactivate, reactivating, error: reactivateError } = useReactivateCard();
  const { deactivate, deactivating, error: deactivateError } = useDeactivateCard();

  async function handleReactivate() {
    if (!detail) return;

    Alert.alert(
      "Reactivar tarjeta",
      `¿Quieres volver a activar "${detail.card.alias}"? Volverá a aparecer en Home y conservará su historial.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Reactivar",
          onPress: async () => {
            try {
              await reactivate(detail.card.id);

              Alert.alert("Tarjeta reactivada", "La tarjeta volvió a estar activa.", [
                {
                  text: "OK",
                  onPress: () =>
                    router.replace({
                      pathname: "/",
                    }),
                },
              ]);
            } catch {
              // El hook ya registra el error.
            }
          },
        },
      ]
    );
  }

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

          <Text className="mt-3 text-sm text-slate-500">Cargando detalle...</Text>
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

        {!card.isActive ? (
          <View className="rounded-3xl bg-amber-50 p-5">
            <Text className="text-base font-semibold text-amber-800">
              Tarjeta inactiva
            </Text>

            <Text className="mt-1 text-sm text-amber-700">
              Esta tarjeta está desactivada. Puedes reactivarla para que vuelva a aparecer
              en Home y siga usando su historial.
            </Text>

            {reactivateError ? (
              <Text className="mt-3 text-sm font-medium text-red-600">
                {reactivateError}
              </Text>
            ) : null}

            <View className="mt-4">
              <AppButton
                title={reactivating ? "Reactivando..." : "Reactivar tarjeta"}
                onPress={handleReactivate}
                disabled={reactivating}
              />
            </View>
          </View>
        ) : null}

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

        {card.isActive ? (
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
            (deactivateError ? (
            <Text className="text-sm font-medium text-red-600">{deactivateError}</Text>
            ) : null)
            <AppButton
              title={deactivating ? "Desactivando..." : "Desactivar tarjeta"}
              variant="danger"
              onPress={handleDeactivate}
              disabled={deactivating}
            />
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
