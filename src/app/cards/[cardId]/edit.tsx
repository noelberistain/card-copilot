import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, Text, View } from "react-native";

import { AppButton, ScreenContainer, ScreenHeader } from "@/components/ui";
import { CardForm } from "@/features/cards/components/CardForm";
import { useCard } from "@/features/cards/hooks/useCard";
import { useSaveCard } from "@/features/cards/hooks/useSaveCard";
import type {
  CardFormInput,
  CardFormValues,
} from "@/features/cards/schemas/cardForm.schema";

export default function EditCardScreen() {
  const params = useLocalSearchParams<{ cardId?: string }>();
  const cardId = Array.isArray(params.cardId) ? params.cardId[0] : params.cardId;

  const { card, loading, error: loadError, refresh } = useCard({ cardId });

  const {
    save,
    saving,
    error: saveError,
  } = useSaveCard({
    initialCard: card ?? undefined,
  });

  async function handleSave(values: CardFormValues) {
    if (!card) return;

    try {
      await save(values);

      Alert.alert("Tarjeta actualizada", "Los cambios se guardaron correctamente.", [
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

  if (loadError || !card || !cardId) {
    return (
      <ScreenContainer>
        <View className="gap-4">
          <ScreenHeader
            showBackButton
            subtitle={loadError ?? "No se encontró la tarjeta solicitada."}
            title="No se pudo cargar"
          />

          <AppButton title="Reintentar" onPress={refresh} />
        </View>
      </ScreenContainer>
    );
  }

  const defaultValues: Partial<CardFormInput> = {
    alias: card.alias,
    bank: card.bank,
    creditLimit: String(card.creditLimit),
    cutoffDay: String(card.cutoffDay),
    paymentDueDay: String(card.paymentDueDay),
    network: card.network ?? "",
    color: card.color ?? "",
  };

  return (
    <ScreenContainer>
      <View className="gap-6">
        <ScreenHeader
          showBackButton
          subtitle="Actualiza la información base de esta tarjeta."
          title="Editar tarjeta"
        />

        <CardForm
          defaultValues={defaultValues}
          disableSubmitUntilDirty
          error={saveError}
          saving={saving}
          submitLabel="Guardar cambios"
          onSubmit={handleSave}
        />
      </View>
    </ScreenContainer>
  );
}
