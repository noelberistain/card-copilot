import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, Text, View } from "react-native";

import { AppButton, ScreenContainer } from "@/components/ui";
import { CardForm } from "@/features/cards/components/CardForm";
import { LatestSnapshotPanel } from "@/features/cards/components/LatestSnapshotPanel";
import { useCard } from "@/features/cards/hooks/useCard";
import { useDeactivateCard } from "@/features/cards/hooks/useDeactivateCard";
import { useLatestSnapshot } from "@/features/cards/hooks/useLatestSnapshot";
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
    snapshot: latestSnapshot,
    loading: latestSnapshotLoading,
    error: latestSnapshotError,
  } = useLatestSnapshot({ cardId });

  const {
    save,
    saving,
    error: saveError,
  } = useSaveCard({
    initialCard: card ?? undefined,
  });

  const { deactivate, deactivating, error: deactivateError } = useDeactivateCard();

  function handleDeactivate() {
    if (!card) return;

    Alert.alert(
      "Desactivar tarjeta",
      "La tarjeta dejará de aparecer en Home, pero sus datos no se borrarán.",
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
              await deactivate(card.id);

              Alert.alert(
                "Tarjeta desactivada",
                "La tarjeta se desactivó correctamente.",
                [
                  {
                    text: "OK",
                    onPress: () => router.replace({ pathname: "/" }),
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

  if (loadError || !card) {
    return (
      <ScreenContainer>
        <View className="gap-4">
          <Text className="text-3xl font-bold text-slate-950">No se pudo cargar</Text>

          <Text className="text-base text-slate-500">
            {loadError ?? "No se encontró la tarjeta solicitada."}
          </Text>

          <AppButton title="Reintentar" onPress={refresh} />

          <AppButton title="Volver" variant="secondary" onPress={() => router.back()} />
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
        <View>
          <Text className="text-3xl font-bold text-slate-950">Editar tarjeta</Text>

          <Text className="mt-2 text-base text-slate-500">
            Actualiza la información base de esta tarjeta.
          </Text>
        </View>

        <LatestSnapshotPanel
          snapshot={latestSnapshot}
          loading={latestSnapshotLoading}
          error={latestSnapshotError}
          onEditSnapshot={
            latestSnapshot
              ? () =>
                  router.push({
                    pathname: "/cards/[cardId]/snapshots/[snapshotId]/edit",
                    params: {
                      cardId: card.id,
                      snapshotId: latestSnapshot.id,
                    },
                  })
              : undefined
          }
        />

        <CardForm
          defaultValues={defaultValues}
          submitLabel="Guardar cambios"
          saving={saving}
          error={saveError}
          onSubmit={handleSave}
          onCancel={() => router.back()}
        />

        <AppButton
          title="Capturar estado actual"
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: "/cards/[cardId]/snapshot",
              params: {
                cardId: card.id,
              },
            })
          }
          disabled={saving || deactivating}
        />

        {deactivateError ? (
          <Text className="text-sm font-medium text-red-600">{deactivateError}</Text>
        ) : null}

        <AppButton
          title={deactivating ? "Desactivando..." : "Desactivar tarjeta"}
          variant="danger"
          onPress={handleDeactivate}
          disabled={saving || deactivating}
        />
      </View>
    </ScreenContainer>
  );
}
