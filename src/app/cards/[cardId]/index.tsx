import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, Text, View } from "react-native";

import {
  AppButton,
  AppTextButton,
  EmptyState,
  ScreenContainer,
  ScreenHeader,
} from "@/components/ui";
import { CardDatesPanel } from "@/features/cards/components/CardDatesPanel";
import { CardInsightsPanel } from "@/features/cards/components/CardInsightsPanel";
import { CardSnapshotSummary } from "@/features/cards/components/CardSnapshotSummary";
import { useCardDetail } from "@/features/cards/hooks/useCardDetail";
import { useDeactivateCard } from "@/features/cards/hooks/useDeactivateCard";
import { isToday } from "@/lib/date/isToday";

export default function CardDetailScreen() {
  const params = useLocalSearchParams<{ cardId?: string }>();
  const cardId = Array.isArray(params.cardId) ? params.cardId[0] : params.cardId;

  const { detail, loading, error, refresh } = useCardDetail({ cardId });

  const { deactivate, deactivating, error: deactivateError } = useDeactivateCard();

  function handleEditSnapshot() {
    if (!detail || !detail.latestSnapshot) return;

    const snapshot = detail.latestSnapshot;

    if (isToday(snapshot.capturedAt)) {
      router.push({
        pathname: "/cards/[cardId]/snapshots/[snapshotId]/edit",
        params: {
          cardId: detail.card.id,
          snapshotId: snapshot.id,
        },
      });

      return;
    }

    Alert.alert(
      "¿Corregir o capturar nuevo estado?",
      "Este estado fue capturado otro día. Si los datos actuales de tu tarjeta cambiaron, es mejor capturar un nuevo estado para conservar el historial. Usa “Corregir este estado” solo si capturaste mal un dato y quieres arreglar ese registro.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Capturar nuevo estado",
          onPress: () =>
            router.push({
              pathname: "/cards/[cardId]/snapshot",
              params: {
                cardId: detail.card.id,
              },
            }),
        },
        {
          text: "Corregir este estado",
          onPress: () =>
            router.push({
              pathname: "/cards/[cardId]/snapshots/[snapshotId]/edit",
              params: {
                cardId: detail.card.id,
                snapshotId: snapshot.id,
              },
            }),
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
            showBackButton
            subtitle={error ?? "No se encontró la tarjeta solicitada."}
            title="No se pudo cargar"
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
        <ScreenHeader showBackButton subtitle={card.bank} title={card.alias} />

        <View className="gap-3 rounded-3xl bg-white p-4">
          <AppButton
            fullWidth={false}
            size="sm"
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

          <View className="flex-row flex-wrap items-center gap-4">
            <AppTextButton
              title="Editar"
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

            {latestSnapshot ? (
              <AppTextButton
                title="Editar estado"
                variant="secondary"
                onPress={handleEditSnapshot}
              />
            ) : null}

            <AppTextButton
              disabled={deactivating}
              title={deactivating ? "Desactivando..." : "Desactivar"}
              variant="danger"
              onPress={handleDeactivate}
            />
          </View>

          {deactivateError ? (
            <Text className="text-sm font-medium text-red-600">{deactivateError}</Text>
          ) : null}
        </View>

        {!latestSnapshot || !metrics ? (
          <EmptyState
            message="Captura el estado actual de esta tarjeta para ver saldos, fechas e insights."
            title="Sin estado capturado"
          />
        ) : (
          <>
            <CardSnapshotSummary metrics={metrics} snapshot={latestSnapshot} />

            <CardDatesPanel metrics={metrics} status={status} />

            <CardInsightsPanel insights={insights} />
          </>
        )}
      </View>
    </ScreenContainer>
  );
}
