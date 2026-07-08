import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Text, View } from "react-native";

import {
  AppButton,
  AppDateInput,
  AppTextInput,
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
    formState: { errors },
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
          title="Simulador de compra"
          subtitle="Ingresa una compra y te ayudamos a estimar con cuál tarjeta podrías tener más tiempo para pagar."
          showBackButton
          onBackPress={() =>
            router.replace({
              pathname: "/",
            })
          }
        />
        <View className="rounded-3xl bg-white p-5">
          <Text className="text-base font-semibold text-slate-900">
            Datos de la compra
          </Text>

          <View className="mt-5 gap-4">
            <Controller
              control={control}
              name="amount"
              render={({ field: { value, onChange, onBlur } }) => (
                <AppTextInput
                  label="Monto de compra"
                  placeholder="Ej. 3500"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.amount?.message}
                  keyboardType="decimal-pad"
                />
              )}
            />

            <Controller
              control={control}
              name="purchaseDate"
              render={({ field: { value, onChange } }) => (
                <AppDateInput
                  label="Fecha de compra"
                  value={value}
                  onChangeText={onChange}
                  error={errors.purchaseDate?.message}
                />
              )}
            />
          </View>
          <View className="mt-6 gap-3">
            <AppButton
              title={simulating ? "Simulando..." : "Simular compra"}
              onPress={handleSubmit(handleSimulation)}
              disabled={simulating}
            />

            {result ? (
              <AppButton
                title="Limpiar resultado"
                variant="secondary"
                onPress={handleClear}
                disabled={simulating}
              />
            ) : null}
          </View>
        </View>

        {simulating ? (
          <View className="items-center justify-center rounded-3xl bg-white p-6">
            <ActivityIndicator />

            <Text className="mt-3 text-sm text-slate-500">
              Calculando mejor tarjeta...
            </Text>
          </View>
        ) : null}

        {error ? (
          <View className="rounded-3xl bg-red-50 p-5">
            <Text className="text-base font-semibold text-red-700">
              No se pudo simular la compra
            </Text>

            <Text className="mt-1 text-sm text-red-600">{error}</Text>
          </View>
        ) : null}

        {result ? (
          <View className="gap-5">
            <View className="rounded-3xl bg-white p-5">
              <Text className="text-base font-semibold text-slate-900">Resultado</Text>

              <Text className="mt-2 text-sm text-slate-500">
                Compra simulada por {formatCurrency(result.amount)} el{" "}
                {result.purchaseDate}.
              </Text>

              <Text className="mt-4 text-base text-slate-700">{result.summary}</Text>
            </View>

            {result.recommendedCard ? (
              <RecommendedCardCard result={result.recommendedCard} />
            ) : (
              <View className="rounded-3xl bg-amber-50 p-5">
                <Text className="text-base font-semibold text-amber-800">
                  Sin tarjeta recomendada
                </Text>

                <Text className="mt-1 text-sm text-amber-700">
                  Ninguna tarjeta evaluada tiene crédito disponible suficiente para esta
                  compra.
                </Text>
              </View>
            )}

            {otherEligibleCards.length > 0 ? (
              <View className="gap-3">
                <Text className="text-lg font-bold text-slate-950">
                  Otras tarjetas elegibles
                </Text>

                {otherEligibleCards.map((cardResult) => (
                  <SimulationCardResult key={cardResult.card.id} result={cardResult} />
                ))}
              </View>
            ) : null}

            {result.ineligibleCards.length > 0 ? (
              <View className="gap-3">
                <Text className="text-lg font-bold text-slate-950">
                  Tarjetas no elegibles
                </Text>

                {result.ineligibleCards.map((cardResult) => (
                  <SimulationCardResult key={cardResult.card.id} result={cardResult} />
                ))}
              </View>
            ) : null}

            {result.notEvaluatedCards.length > 0 ? (
              <View className="gap-3">
                <Text className="text-lg font-bold text-slate-950">
                  Tarjetas no evaluadas
                </Text>

                <Text className="text-sm text-slate-500">
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
    <View className="rounded-3xl bg-blue-600 p-5">
      <Text className="text-sm font-medium text-blue-100">Tarjeta recomendada</Text>

      <Text className="mt-1 text-2xl font-bold text-white">{result.card.alias}</Text>

      <Text className="mt-1 text-sm text-blue-100">{result.card.bank}</Text>

      <View className="mt-5 gap-3">
        <View className="rounded-2xl bg-blue-500 p-4">
          <Text className="text-xs text-blue-100">Tiempo estimado para pagar</Text>

          <Text className="mt-1 text-xl font-bold text-white">
            {result.estimatedDaysToPay ?? "-"} día(s)
          </Text>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-blue-500 p-4">
            <Text className="text-xs text-blue-100">Corte estimado</Text>

            <Text className="mt-1 text-sm font-semibold text-white">
              {result.estimatedCutoffDate ?? "-"}
            </Text>
          </View>

          <View className="flex-1 rounded-2xl bg-blue-500 p-4">
            <Text className="text-xs text-blue-100">Pago estimado</Text>

            <Text className="mt-1 text-sm font-semibold text-white">
              {result.estimatedPaymentDueDate ?? "-"}
            </Text>
          </View>
        </View>

        <Text className="text-sm text-blue-100">{result.reason}</Text>
      </View>
    </View>
  );
}

function SimulationCardResult({ result }: SimulationCardResultProps) {
  const isNotEvaluated = result.evaluationStatus === "not-evaluated";

  const containerClass = result.eligible
    ? "rounded-3xl bg-white p-5"
    : isNotEvaluated
      ? "rounded-3xl bg-amber-50 p-5"
      : "rounded-3xl bg-slate-200 p-5";

  return (
    <View className={containerClass}>
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-slate-950">
            {result.card.alias}
          </Text>

          <Text className="mt-1 text-sm text-slate-500">{result.card.bank}</Text>
        </View>

        <StatusBadge result={result} />
      </View>

      <View className="mt-4 gap-3">
        {!isNotEvaluated ? (
          <View className="rounded-2xl bg-slate-100 p-4">
            <Text className="text-xs text-slate-500">Crédito disponible</Text>

            <Text className="mt-1 text-base font-semibold text-slate-950">
              {formatCurrency(result.availableCredit)}
            </Text>
          </View>
        ) : null}

        <View className="flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-slate-100 p-4">
            <Text className="text-xs text-slate-500">Corte estimado</Text>

            <Text className="mt-1 text-sm font-semibold text-slate-950">
              {result.estimatedCutoffDate ?? "-"}
            </Text>
          </View>

          <View className="flex-1 rounded-2xl bg-slate-100 p-4">
            <Text className="text-xs text-slate-500">Pago estimado</Text>

            <Text className="mt-1 text-sm font-semibold text-slate-950">
              {result.estimatedPaymentDueDate ?? "-"}
            </Text>
          </View>
        </View>

        <Text className="text-sm text-slate-600">{result.reason}</Text>

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
      <View className="rounded-full bg-amber-100 px-3 py-1">
        <Text className="text-xs font-semibold text-amber-700">No evaluada</Text>
      </View>
    );
  }

  if (result.eligible) {
    return (
      <View className="rounded-full bg-emerald-50 px-3 py-1">
        <Text className="text-xs font-semibold text-emerald-700">Elegible</Text>
      </View>
    );
  }

  return (
    <View className="rounded-full bg-red-50 px-3 py-1">
      <Text className="text-xs font-semibold text-red-700">No elegible</Text>
    </View>
  );
}
