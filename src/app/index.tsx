import { router } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

import { AppButton, AppTextButton, EmptyState, ScreenContainer } from "@/components/ui";
import { CardListItem } from "@/features/cards/components/CardListItem";
import { useCards } from "@/features/cards/hooks/useCards";

export default function HomeScreen() {
  const { cards, loading, error, refresh } = useCards();

  return (
    <ScreenContainer>
      <View className="gap-6">
        <View>
          <Text className="text-3xl font-bold text-slate-950">Card Copilot</Text>

          <Text className="mt-2 text-base text-slate-500">
            Administra tus tarjetas y entiende mejor tus fechas de corte, pago y saldos.
          </Text>
        </View>

        <View className="gap-3">
          <View className="flex-row flex-wrap gap-3">
            <AppButton
              title="Agregar tarjeta"
              size="sm"
              fullWidth={false}
              onPress={() => router.push("/cards/new")}
            />
        
            {cards.length > 0 ? (
              <AppButton
                title="Simular compra"
                variant="secondary"
                size="sm"
                fullWidth={false}
                onPress={() =>
                  router.push({
                    pathname: "/simulator",
                  })
                }
              />
            ) : null}
          </View>
        
          <AppTextButton
            title="Ver tarjetas inactivas"
            variant="secondary"
            onPress={() =>
              router.push({
                pathname: "/cards/inactive",
              })
            }
          />
        </View>

        {loading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator />
            <Text className="mt-3 text-sm text-slate-500">Cargando tarjetas...</Text>
          </View>
        ) : null}

        {!loading && error ? (
          <View className="gap-3 rounded-3xl bg-red-50 p-5">
            <Text className="text-base font-semibold text-red-700">
              Ocurrió un problema
            </Text>

            <Text className="text-sm text-red-600">{error}</Text>

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
            {cards.map((card) => (
              <CardListItem
                key={card.id}
                card={card}
                onPress={() =>
                  router.push({
                    pathname: "/cards/[cardId]",
                    params: { cardId: card.id },
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
