import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Text, View } from "react-native";

import {
  AppButton,
  AppDateInput,
  AppMoneyInput,
  ScreenContainer,
  ScreenHeader,
} from "@/components/ui";
import { usePurchaseSimulation } from "@/features/simulator/hooks/usePurchaseSimulation";
import {
  purchaseSimulationSchema,
  type PurchaseSimulationFormInput,
  type PurchaseSimulationFormValues,
} from "@/features/simulator/schemas/purchaseSimulation.schema";
import { formatCurrency } from "@/lib/money/formatCurrency";
import type { PurchaseSimulationCardResult } from "@/logic/cards/purchaseTiming.logic";

const emptyDefaultValues: PurchaseSimulationFormInput = {
  amount: "",
  purchaseDate: "",
};

export default function SimulatorScreen() {
  const { result, simulating, error, simulate, clear } = usePurchaseSimulation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PurchaseSimulationFormInput, unknown, PurchaseSimulationFormValues>({
    resolver: zodResolver(purchaseSimulationSchema),
    defaultValues: emptyDefaultValues,
  });

  const otherEligibleCards = result?.recommendedCard
    ? result.eligibleCards.filter(
        (cardResult) => cardResult.card.id !== result.recommendedCard?.card.id
      )
    : (result?.eligibleCards ?? []);

  async function handleSimulation(values: PurchaseSimulationFormValues) {
    await simulate(values);
  }

  function handleClear() {
    clear();
    reset(emptyDefaultValues);
  }

  return (
    <ScreenContainer>
      <View className="gap-6">
        <ScreenHeader
          showBackButton
          subtitle="Ingresa una compra y te ayudamos a estimar con cuál tarjeta podrías tener más tiempo para pagar."
          title="Simulador de compra"
        />
        <View className="rounded-3xl bg-surface-muted p-5">
          <Text className="font-display text-base text-ink">Datos de la compra</Text>

          <View className="mt-5 gap-4">
            <Controller
              control={control}
              name="amount"
              render={({ field: { onBlur, onChange, value } }) => (
                <AppMoneyInput
                  error={errors.amount?.message}
                  label="Monto de compra"
                  placeholder="Ej. 3,500"
                  required
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="purchaseDate"
              render={({ field: { value, onChange } }) => (
                <AppDateInput
                  error={errors.purchaseDate?.message}
                  label="Fecha de compra"
                  required
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
          <View className="mt-6 gap-3">
            <AppButton
              disabled={simulating || !isDirty}
              title={simulating ? "Simulando..." : "Simular compra"}
              onPress={handleSubmit(handleSimulation)}
            />

            {result ? (
              <AppButton
                disabled={simulating}
                title="Limpiar resultado"
                variant="secondary"
                onPress={handleClear}
              />
            ) : null}
          </View>
        </View>

        {simulating ? (
          <View className="items-center justify-center rounded-3xl bg-surface-muted p-6">
            <ActivityIndicator />

            <Text className="mt-3 text-sm text-ink-muted">
              Calculando mejor tarjeta...
            </Text>
          </View>
        ) : null}

        {error ? (
          <View className="rounded-3xl bg-danger/10 p-5">
            <Text className="font-sans-semibold text-base text-danger">
              No se pudo simular la compra
            </Text>

            <Text className="mt-1 text-sm text-danger">{error}</Text>
          </View>
        ) : null}

        {result ? (
          <View className="gap-5">
            <View className="rounded-3xl bg-surface-muted p-5">
              <Text className="font-display text-base text-ink">Resultado</Text>

              <Text className="mt-2 text-sm text-ink-muted">
                Compra simulada por {formatCurrency(result.amount)} el{" "}
                {result.purchaseDate}.
              </Text>

              <Text className="mt-4 text-base text-ink">{result.summary}</Text>
            </View>

            {result.recommendedCard ? (
              <RecommendedCardCard result={result.recommendedCard} />
            ) : (
              <View className="rounded-3xl bg-warning/10 p-5">
                <Text className="font-sans-semibold text-base text-warning">
                  Sin tarjeta recomendada
                </Text>

                <Text className="mt-1 text-sm text-warning">
                  Ninguna tarjeta evaluada tiene crédito disponible suficiente para esta
                  compra.
                </Text>
              </View>
            )}

            {otherEligibleCards.length > 0 ? (
              <View className="gap-3">
                <Text className="font-display-bold text-lg text-ink">
                  Otras tarjetas elegibles
                </Text>

                {otherEligibleCards.map((cardResult) => (
                  <SimulationCardResult key={cardResult.card.id} result={cardResult} />
                ))}
              </View>
            ) : null}

            {result.ineligibleCards.length > 0 ? (
              <View className="gap-3">
                <Text className="font-display-bold text-lg text-ink">
                  Tarjetas no elegibles
                </Text>

                {result.ineligibleCards.map((cardResult) => (
                  <SimulationCardResult key={cardResult.card.id} result={cardResult} />
                ))}
              </View>
            ) : null}

            {result.notEvaluatedCards.length > 0 ? (
              <View className="gap-3">
                <Text className="font-display-bold text-lg text-ink">
                  Tarjetas no evaluadas
                </Text>

                <Text className="text-sm text-ink-muted">
                  Estas tarjetas no fueron consideradas para la recomendación porque no
                  tienen un estado capturado. Captura un snapshot para conocer su crédito
                  disponible real.
                </Text>

                {result.notEvaluatedCards.map((cardResult) => (
                  <SimulationCardResult key={cardResult.card.id} result={cardResult} />
                ))}
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
}

interface SimulationCardResultProps {
  result: PurchaseSimulationCardResult;
}

function RecommendedCardCard({ result }: SimulationCardResultProps) {
  return (
    <View className="rounded-3xl bg-primary p-5">
      <Text className="font-sans-medium text-sm text-primary-muted">
        Tarjeta recomendada
      </Text>

      <Text className="mt-1 font-display-bold text-2xl text-white">
        {result.card.alias}
      </Text>

      <Text className="mt-1 text-sm text-primary-muted">{result.card.bank}</Text>

      <View className="mt-5 gap-3">
        <View className="rounded-2xl bg-white/10 p-4">
          <Text className="text-xs text-primary-muted">Tiempo estimado para pagar</Text>

          <Text className="mt-1 font-display-bold text-xl tabular-nums text-white">
            {result.estimatedDaysToPay ?? "-"} día(s)
          </Text>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-white/10 p-4">
            <Text className="text-xs text-primary-muted">Corte estimado</Text>

            <Text className="mt-1 font-sans-semibold text-sm tabular-nums text-white">
              {result.estimatedCutoffDate ?? "-"}
            </Text>
          </View>

          <View className="flex-1 rounded-2xl bg-white/10 p-4">
            <Text className="text-xs text-primary-muted">Pago estimado</Text>

            <Text className="mt-1 font-sans-semibold text-sm tabular-nums text-white">
              {result.estimatedPaymentDueDate ?? "-"}
            </Text>
          </View>
        </View>

        <Text className="text-sm text-primary-muted">{result.reason}</Text>
      </View>
    </View>
  );
}

function SimulationCardResult({ result }: SimulationCardResultProps) {
  const isNotEvaluated = result.evaluationStatus === "not-evaluated";

  const containerClass = result.eligible
    ? "rounded-3xl bg-surface-muted p-5"
    : isNotEvaluated
      ? "rounded-3xl bg-warning/10 p-5"
      : "rounded-3xl bg-ink-muted/10 p-5";

  return (
    <View className={containerClass}>
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text className="font-display-bold text-lg text-ink">{result.card.alias}</Text>

          <Text className="mt-1 text-sm text-ink-muted">{result.card.bank}</Text>
        </View>

        <StatusBadge result={result} />
      </View>

      <View className="mt-4 gap-3">
        {!isNotEvaluated ? (
          <View className="rounded-2xl bg-surface p-4">
            <Text className="text-xs text-ink-muted">Crédito disponible</Text>

            <Text className="mt-1 font-display-bold text-base tabular-nums text-ink">
              {formatCurrency(result.availableCredit)}
            </Text>
          </View>
        ) : null}

        <View className="flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-surface p-4">
            <Text className="text-xs text-ink-muted">Corte estimado</Text>

            <Text className="mt-1 font-sans-semibold text-sm tabular-nums text-ink">
              {result.estimatedCutoffDate ?? "-"}
            </Text>
          </View>

          <View className="flex-1 rounded-2xl bg-surface p-4">
            <Text className="text-xs text-ink-muted">Pago estimado</Text>

            <Text className="mt-1 font-sans-semibold text-sm tabular-nums text-ink">
              {result.estimatedPaymentDueDate ?? "-"}
            </Text>
          </View>
        </View>

        <Text className="text-sm text-ink-muted">{result.reason}</Text>

        {isNotEvaluated ? (
          <AppButton
            title="Capturar estado"
            variant="secondary"
            onPress={() =>
              router.push({
                pathname: "/cards/[cardId]/snapshot",
                params: {
                  cardId: result.card.id,
                },
              })
            }
          />
        ) : null}
      </View>
    </View>
  );
}

function StatusBadge({ result }: SimulationCardResultProps) {
  if (result.evaluationStatus === "not-evaluated") {
    return (
      <View className="rounded-full bg-warning/10 px-3 py-1">
        <Text className="font-sans-semibold text-xs text-warning">No evaluada</Text>
      </View>
    );
  }

  if (result.eligible) {
    return (
      <View className="rounded-full bg-success/10 px-3 py-1">
        <Text className="font-sans-semibold text-xs text-success">Elegible</Text>
      </View>
    );
  }

  return (
    <View className="rounded-full bg-danger/10 px-3 py-1">
      <Text className="font-sans-semibold text-xs text-danger">No elegible</Text>
    </View>
  );
}
