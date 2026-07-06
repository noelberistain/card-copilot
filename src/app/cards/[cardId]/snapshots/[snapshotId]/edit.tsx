import { ActivityIndicator, Alert, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { AppButton, ScreenContainer } from "@/components/ui";
import { SnapshotForm } from "@/features/cards/components/SnapshotForm";
import { useSaveSnapshot } from "@/features/cards/hooks/useSaveSnapshot";
import { useSnapshot } from "@/features/cards/hooks/useSnapshot";
import type {
  SnapshotFormInput,
  SnapshotFormValues,
} from "@/features/cards/schemas/snapshotForm.schema";

export default function EditSnapshotScreen() {
  const params = useLocalSearchParams<{
    cardId?: string;
    snapshotId?: string;
  }>();

  const cardId = Array.isArray(params.cardId)
    ? params.cardId[0]
    : params.cardId;

  const snapshotId = Array.isArray(params.snapshotId)
    ? params.snapshotId[0]
    : params.snapshotId;

  const {
    snapshot,
    loading,
    error: loadError,
    refresh,
  } = useSnapshot({ snapshotId });

  const {
    save,
    saving,
    error: saveError,
  } = useSaveSnapshot({
    cardId: cardId ?? "",
    initialSnapshot: snapshot ?? undefined,
  });

  async function handleSave(values: SnapshotFormValues) {
    if (!cardId || !snapshot) return;

    try {
      await save(values);

      Alert.alert(
        "Estado actualizado",
        "Los cambios del estado capturado se guardaron correctamente.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch {
      // El hook ya registra el error.
    }
  }

  if (loading) {
    return (
      <ScreenContainer scroll={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />

          <Text className="mt-3 text-sm text-slate-500">
            Cargando estado capturado...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (loadError || !snapshot || !cardId) {
    return (
      <ScreenContainer>
        <View className="gap-4">
          <Text className="text-3xl font-bold text-slate-950">
            No se pudo cargar
          </Text>

          <Text className="text-base text-slate-500">
            {loadError ?? "No se encontró el estado capturado solicitado."}
          </Text>

          <AppButton title="Reintentar" onPress={refresh} />

          <AppButton
            title="Volver"
            variant="secondary"
            onPress={() => router.back()}
          />
        </View>
      </ScreenContainer>
    );
  }

  const defaultValues: Partial<SnapshotFormInput> = {
    currentBalance: String(snapshot.currentBalance),
    statementBalance: String(snapshot.statementBalance),
    minimumPayment: String(snapshot.minimumPayment),
    paymentToAvoidInterest: String(snapshot.paymentToAvoidInterest),
    lastCutoffDate: snapshot.lastCutoffDate,
    paymentDueDate: snapshot.paymentDueDate,
    notes: snapshot.notes ?? "",
  };

  return (
    <ScreenContainer>
      <View className="gap-6">
        <View>
          <Text className="text-3xl font-bold text-slate-950">
            Editar estado
          </Text>

          <Text className="mt-2 text-base text-slate-500">
            Corrige los datos capturados si cometiste un error al registrar el
            estado de la tarjeta.
          </Text>

          <Text className="mt-2 text-sm text-slate-400">
            Capturado originalmente: {snapshot.capturedAt}
          </Text>
        </View>

        <SnapshotForm
          defaultValues={defaultValues}
          submitLabel="Guardar cambios"
          saving={saving}
          error={saveError}
          onSubmit={handleSave}
          onCancel={() => router.back()}
        />
      </View>
    </ScreenContainer>
  );
}
