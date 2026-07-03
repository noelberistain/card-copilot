import { router } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

import { AppButton, EmptyState, ScreenContainer } from "@/components/ui";
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

        <AppButton title="Agregar tarjeta" onPress={() => router.push("/cards/new")} />

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

            <AppButton title="Reintentar" onPress={refresh} variant="danger" />
          </View>
        ) : null}

        {!loading && !error && cards.length === 0 ? (
          <EmptyState
            title="Aún no tienes tarjetas"
            message="Agrega tu primera tarjeta para empezar a darle seguimiento."
          />
        ) : null}

        {!loading && !error && cards.length > 0 ? (
          <View className="gap-4">
            {cards.map((card) => (
              <CardListItem
                key={card.id}
                card={card}
                onPress={() => router.push(`/cards/${card.id}/edit`)}
              />
            ))}
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
