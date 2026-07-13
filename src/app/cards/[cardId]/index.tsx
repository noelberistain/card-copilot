import { isSameDay, parseISO } from "date-fns";
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
import { hasGeneratedStatement } from "@/logic/cards/cardSnapshotStatus.logic";

export default function CardDetailScreen() {
  const params = useLocalSearchParams<{ cardId?: string }>();
  const cardId = Array.isArray(params.cardId) ? params.cardId[0] : params.cardId;

  const { detail, error, loading, refresh } = useCardDetail({ cardId });

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
          style: "cancel",
          text: "Cancelar",
        },
        {
          onPress: async () => {
            try {
              await deactivate(detail.card.id);

              Alert.alert(
                "Tarjeta desactivada",
                "La tarjeta se desactivó correctamente.",
                [
                  {
                    onPress: () =>
                      router.replace({
                        pathname: "/",
                      }),
                    text: "OK",
                  },
                ]
              );
            } catch {
              // El hook ya registra el error.
            }
          },
          style: "destructive",
          text: "Desactivar",
        },
      ]
    );
  }

  function handleEditSnapshot() {
    if (!detail?.latestSnapshot) return;

    const snapshot = detail.latestSnapshot;
    const wasCapturedToday = isSameDay(parseISO(snapshot.capturedAt), new Date());

    const goToEditSnapshot = () =>
      router.push({
        params: {
          cardId: detail.card.id,
          snapshotId: snapshot.id,
        },
        pathname: "/cards/[cardId]/snapshots/[snapshotId]/edit",
      });

    if (wasCapturedToday) {
      goToEditSnapshot();
      return;
    }

    Alert.alert(
      "¿Corregir o capturar nuevo estado?",
      "Este estado fue capturado otro día. Si los datos de tu tarjeta cambiaron desde entonces, es mejor capturar un nuevo estado para conservar el historial. Usa “Corregir este estado” solo si capturaste mal un dato.",
      [
        {
          style: "cancel",
          text: "Cancelar",
        },
        {
          onPress: () =>
            router.push({
              params: {
                cardId: detail.card.id,
              },
              pathname: "/cards/[cardId]/snapshot",
            }),
          text: "Capturar nuevo estado",
        },
        {
          onPress: goToEditSnapshot,
          text: "Corregir este estado",
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
            showBackButton
            subtitle={error ?? "No se encontró la tarjeta solicitada."}
            title="No se pudo cargar"
          />

          <AppButton title="Reintentar" onPress={refresh} />
        </View>
      </ScreenContainer>
    );
  }

  const { card, insights, latestSnapshot, metrics, status } = detail;

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
                params: {
                  cardId: card.id,
                },
                pathname: "/cards/[cardId]/snapshot",
              })
            }
          />

          <View className="flex-row flex-wrap items-center gap-4">
            <AppTextButton
              title="Editar"
              variant="secondary"
              onPress={() =>
                router.push({
                  params: {
                    cardId: card.id,
                  },
                  pathname: "/cards/[cardId]/edit",
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
            <Text className="text-sm font-medium text-red-600">
              {deactivateError}
            </Text>
          ) : null}
        </View>

        {!latestSnapshot || !metrics ? (
          <EmptyState
            message="Captura el estado actual de esta tarjeta para ver saldos, fechas e insights."
            title="Sin estado capturado"
          />
        ) : (
          <>
            <CardSnapshotSummary snapshot={latestSnapshot} metrics={metrics} />

            {!hasGeneratedStatement(latestSnapshot) ? (
              <View className="rounded-3xl bg-amber-50 p-5">
                <Text className="text-base font-semibold text-amber-800">
                  Estado parcial
                </Text>

                <Text className="mt-1 text-sm text-amber-700">
                  Esta tarjeta todavía no tiene información completa de estado
                  de cuenta. Por ahora usaremos el saldo actual y el crédito
                  disponible reportado para estimaciones, pero aún no hay pago
                  mínimo, pago para no generar intereses ni fecha límite de pago
                  de este ciclo.
                </Text>
              </View>
            ) : null}

            {hasGeneratedStatement(latestSnapshot) ? (
              <>
                <CardDatesPanel metrics={metrics} status={status} />

                <CardInsightsPanel insights={insights} />
              </>
            ) : null}
          </>
        )}
      </View>
    </ScreenContainer>
  );
}
