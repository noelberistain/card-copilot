import { ActivityIndicator, Alert, Text, View } from "react-native";
import { router } from "expo-router";

import {
  AppButton,
  AppTextButton,
  EmptyState,
  ScreenContainer,
  ScreenHeader,
} from "@/components/ui";
import { CardListItem } from "@/features/cards/components/CardListItem";
import { useDeleteCard } from "@/features/cards/hooks/useDeleteCard";
import { useInactiveCards } from "@/features/cards/hooks/useInactiveCards";
import { useReactivateCard } from "@/features/cards/hooks/useReactivateCard";

export default function InactiveCardsScreen() {
  const { cards, loading, error, refresh } = useInactiveCards();

  const {
    reactivate,
    reactivating,
    error: reactivateError,
  } = useReactivateCard();

  const {
    deleteCard,
    deleting,
    error: deleteError,
  } = useDeleteCard();

  function handleReactivate(cardId: string, cardAlias: string) {
    Alert.alert(
      "Reactivar tarjeta",
      `¿Quieres volver a activar "${cardAlias}"? Volverá a aparecer en Home y conservará su historial.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Reactivar",
          onPress: async () => {
            try {
              await reactivate(cardId);

              Alert.alert(
                "Tarjeta reactivada",
                "La tarjeta volvió a estar activa.",
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

  function handleDelete(cardId: string, cardAlias: string) {
    Alert.alert(
      "Eliminar tarjeta definitivamente",
      `¿Seguro que quieres eliminar "${cardAlias}"? Esta acción borrará la tarjeta y sus estados capturados. No se puede deshacer.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCard(cardId);

              Alert.alert(
                "Tarjeta eliminada",
                "La tarjeta se eliminó correctamente.",
                [
                  {
                    text: "OK",
                    onPress: refresh,
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

  return (
    <ScreenContainer>
      <View className="gap-6">
        <ScreenHeader
          title="Tarjetas inactivas"
          subtitle="Aquí puedes ver tarjetas que desactivaste y reactivarlas si quieres volver a usarlas sin perder su historial."
          showBackButton
          onBackPress={() =>
            router.replace({
              pathname: "/",
            })
          }
        />

        {loading ? (
          <View className="items-center justify-center rounded-3xl bg-white p-6">
            <ActivityIndicator />

            <Text className="mt-3 text-sm text-slate-500">
              Cargando tarjetas inactivas...
            </Text>
          </View>
        ) : null}

        {!loading && error ? (
          <View className="gap-3 rounded-3xl bg-red-50 p-5">
            <Text className="text-base font-semibold text-red-700">
              No se pudieron cargar
            </Text>

            <Text className="text-sm text-red-600">{error}</Text>

            <AppButton title="Reintentar" onPress={refresh} variant="danger" />
          </View>
        ) : null}

        {!loading && !error && cards.length === 0 ? (
          <EmptyState
            title="No tienes tarjetas inactivas"
            message="Cuando desactives una tarjeta, aparecerá aquí para que puedas consultarla o reactivarla después."
          />
        ) : null}

        {reactivateError ? (
          <Text className="text-sm font-medium text-red-600">
            {reactivateError}
          </Text>
        ) : null}

        {deleteError ? (
          <Text className="text-sm font-medium text-red-600">
            {deleteError}
          </Text>
        ) : null}

        {!loading && !error && cards.length > 0 ? (
          <View className="gap-4">
            {cards.map((card) => (
              <View key={card.id} className="gap-2">
                <CardListItem card={card} />

                <View className="flex-row items-center justify-between">
                  <AppButton
                    title={reactivating ? "Reactivando..." : "Reactivar"}
                    size="sm"
                    fullWidth={false}
                    variant="secondary"
                    onPress={() => handleReactivate(card.id, card.alias)}
                    disabled={reactivating || deleting}
                  />

                  <AppTextButton
                    title={deleting ? "Eliminando..." : "Eliminar"}
                    variant="danger"
                    onPress={() => handleDelete(card.id, card.alias)}
                    disabled={deleting || reactivating}
                  />
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
