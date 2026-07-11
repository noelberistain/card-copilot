import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, Text, View } from "react-native";

import { AppButton, ScreenContainer, ScreenHeader } from "@/components/ui";
import { SnapshotForm } from "@/features/cards/components/SnapshotForm";
import { useCard } from "@/features/cards/hooks/useCard";
import { useSaveSnapshot } from "@/features/cards/hooks/useSaveSnapshot";
import type { SnapshotFormValues } from "@/features/cards/schemas/snapshotForm.schema";

export default function SnapshotScreen() {
  const params = useLocalSearchParams<{ cardId?: string }>();
  const cardId = Array.isArray(params.cardId) ? params.cardId[0] : params.cardId;

  const { card, loading, error: cardError, refresh } = useCard({ cardId });

  const {
    save,
    saving,
    error: saveError,
  } = useSaveSnapshot({
    cardId: cardId ?? "",
  });

  async function handleSave(values: SnapshotFormValues) {
    if (!cardId || !card) return;

    try {
      await save(values);

      Alert.alert("Estado guardado", "El estado de la tarjeta se guardó correctamente.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch {
      // El hook ya registra el error.
    }
  }

  if (loading) {
    return (
      <ScreenContainer scroll={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />

          <Text className="mt-3 text-sm text-slate-500">Cargando tarjeta...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (cardError || !card || !cardId) {
    return (
      <ScreenContainer>
        <View className="gap-4">
          <ScreenHeader
            showBackButton
            subtitle={cardError ?? "No se encontró la tarjeta solicitada."}
            title="No se pudo cargar"
          />

          <AppButton title="Reintentar" onPress={refresh} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View className="gap-6">
        <ScreenHeader
          showBackButton
          subtitle={
            <Text className="mt-2 text-base text-slate-500">
              Registra el estado actual de{" "}
              <Text className="font-bold text-slate-950">{card.alias}</Text> para calcular
              pagos, saldos e insights más adelante.
            </Text>
          }

          title="Capturar estado"
        />

        <SnapshotForm
          disableSubmitUntilDirty
          error={saveError}
          saving={saving}
          submitLabel="Guardar estado"
          onSubmit={handleSave}
        />
      </View>
    </ScreenContainer>
  );
}
