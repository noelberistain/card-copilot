import { router } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

import { AppButton, AppTextButton, EmptyState, ScreenContainer } from "@/components/ui";
import { HomeCardListItem } from "@/features/cards/components/HomeCardListItem";
import { useHomeCards } from "@/features/cards/hooks/useHomeCards";
import { useInactiveCards } from "@/features/cards/hooks/useInactiveCards";

export default function HomeScreen() {
  const { cards, loading, error, refresh } = useHomeCards();
  const { cards: inactiveCards } = useInactiveCards();

  return (
    <ScreenContainer>
      <View className="gap-6">
        <View>
          <Text className="font-display-extrabold text-3xl text-ink">Card Copilot</Text>

          <Text className="mt-2 text-base text-ink-muted">
            Administra tus tarjetas y entiende mejor tus fechas de corte, pago y saldos.
          </Text>
        </View>

        <View className="gap-3">
          <View className="flex-row flex-wrap gap-3">
            <AppButton
              fullWidth={false}
              size="sm"
              title="Agregar tarjeta"
              onPress={() => router.push("/cards/new")}
            />

            {cards.length > 0 ? (
              <AppButton
                fullWidth={false}
                size="sm"
                title="Simular compra"
                variant="secondary"
                onPress={() =>
                  router.push({
                    pathname: "/simulator",
                  })
                }
              />
            ) : null}
          </View>

          {inactiveCards.length > 0 ? (
            <AppTextButton
              title="Ver tarjetas inactivas"
              variant="secondary"
              onPress={() =>
                router.push({
                  pathname: "/cards/inactive",
                })
              }
            />
          ) : null}
        </View>

        {loading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator />
            <Text className="mt-3 text-sm text-ink-muted">Cargando tarjetas...</Text>
          </View>
        ) : null}

        {!loading && error ? (
          <View className="gap-3 rounded-3xl bg-danger/10 p-5">
            <Text className="font-sans-semibold text-base text-danger">
              Ocurrió un problema
            </Text>

            <Text className="text-sm text-danger">{error}</Text>

            <AppButton title="Reintentar" variant="danger" onPress={refresh} />
          </View>
        ) : null}

        {!loading && !error && cards.length === 0 ? (
          <EmptyState
            message="Agrega tu primera tarjeta para empezar a darle seguimiento. Después podrás simular compras y comparar qué tarjeta te conviene usar."
            title="Aún no tienes tarjetas"
          />
        ) : null}

        {!loading && !error && cards.length > 0 ? (
          <View className="gap-4">
            {cards.map((homeCard) => (
              <HomeCardListItem
                key={homeCard.card.id}
                view={homeCard}
                onPress={() =>
                  router.push({
                    pathname: "/cards/[cardId]",
                    params: { cardId: homeCard.card.id },
                  })
                }
              />
            ))}
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
