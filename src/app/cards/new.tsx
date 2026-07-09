import { router } from "expo-router";
import { Alert, Text, View } from "react-native";

import { ScreenContainer } from "@/components/ui";
import { CardForm } from "@/features/cards/components/CardForm";
import { useSaveCard } from "@/features/cards/hooks/useSaveCard";
import type { CardFormValues } from "@/features/cards/schemas/cardForm.schema";

export default function NewCardScreen() {
  const { save, saving, error } = useSaveCard();

  async function handleSave(values: CardFormValues) {
    try {
      await save(values);

      Alert.alert("Tarjeta guardada", "La tarjeta se guardó correctamente.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch {
      // El hook ya registra el error en estado.
    }
  }

  return (
    <ScreenContainer>
      <View className="gap-6">
        <View>
          <Text className="text-3xl font-bold text-slate-950">Agregar tarjeta</Text>

          <Text className="mt-2 text-base text-slate-500">
            Captura la información base de tu tarjeta para empezar a darle seguimiento.
          </Text>
        </View>

        <CardForm
          submitLabel="Guardar tarjeta"
          saving={saving}
          error={error}
          onSubmit={handleSave}
          onCancel={() => router.back()}
        />
      </View>
    </ScreenContainer>
  );
}
