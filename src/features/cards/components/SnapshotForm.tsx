import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AppButton,
  AppDateInput,
  AppMoneyInput,
  AppPressable,
  AppTextInput,
} from "@/components/ui";
import {
  snapshotFormSchema,
  type SnapshotFormInput,
  type SnapshotFormValues,
} from "@/features/cards/schemas/snapshotForm.schema";
import type { CardSnapshotStatementStatus } from "@/models/cards/card.types";

const emptyDefaultValues: SnapshotFormInput = {
  statementStatus: "generated",

  currentBalance: "",
  reportedAvailableCredit: "",

  statementBalance: "",
  minimumPayment: "",
  paymentToAvoidInterest: "",

  lastCutoffDate: "",
  nextCutoffDate: "",
  paymentDueDate: "",

  notes: "",
};

interface SnapshotFormProps {
  defaultValues?: Partial<SnapshotFormInput>;
  submitLabel: string;
  saving?: boolean;
  error?: string | null;
  disableSubmitUntilDirty?: boolean;
  onSubmit: (values: SnapshotFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

interface StatementStatusSelectorProps {
  value: CardSnapshotStatementStatus;
  onChange: (value: CardSnapshotStatementStatus) => void;
}

interface StatementStatusOptionProps {
  active: boolean;
  description: string;
  label: string;
  onPress: () => void;
}

function StatementStatusOption({
  active,
  description,
  label,
  onPress,
}: StatementStatusOptionProps) {
  return (
    <AppPressable
      accessibilityRole="button"
      className={[
        "flex-1 rounded-2xl border p-4",
        active ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white",
      ].join(" ")}
      feedback="scale"
      onPress={onPress}
    >
      <Text
        className={[
          "text-sm font-semibold",
          active ? "text-blue-800" : "text-slate-900",
        ].join(" ")}
      >
        {label}
      </Text>

      <Text
        className={["mt-1 text-xs", active ? "text-blue-700" : "text-slate-500"].join(
          " "
        )}
      >
        {description}
      </Text>
    </AppPressable>
  );
}

function StatementStatusSelector({ value, onChange }: StatementStatusSelectorProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-medium text-slate-700">Estado de cuenta *</Text>

      <View className="flex-row gap-3">
        <StatementStatusOption
          active={value === "generated"}
          description="Ya hay saldo al corte, pagos y fecha límite."
          label="Ya generado"
          onPress={() => onChange("generated")}
        />

        <StatementStatusOption
          active={value === "not-generated"}
          description="Aún no hay pago generado para este ciclo."
          label="Aún no ha cortado"
          onPress={() => onChange("not-generated")}
        />
      </View>
    </View>
  );
}

export function SnapshotForm({
  defaultValues,
  disableSubmitUntilDirty = false,
  error,
  onCancel,
  onSubmit,
  saving = false,
  submitLabel,
}: SnapshotFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<SnapshotFormInput, unknown, SnapshotFormValues>({
    resolver: zodResolver(snapshotFormSchema),
    defaultValues: {
      ...emptyDefaultValues,
      ...defaultValues,
    },
  });

  const statementStatus = watch("statementStatus");

  return (
    <View className="gap-5 rounded-3xl bg-white p-5">
      <Controller
        control={control}
        name="statementStatus"
        render={({ field: { onChange, value } }) => (
          <StatementStatusSelector value={value ?? "generated"} onChange={onChange} />
        )}
      />

      {statementStatus === "not-generated" ? (
        <View className="rounded-2xl bg-amber-50 p-4">
          <Text className="text-sm font-semibold text-amber-800">Estado parcial</Text>

          <Text className="mt-1 text-sm text-amber-700">
            Usa esta opción cuando tu tarjeta todavía no ha cortado y aún no existe saldo
            al corte, pago mínimo o pago para no generar intereses.
          </Text>
        </View>
      ) : null}

      <Controller
        control={control}
        name="currentBalance"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppMoneyInput
            error={errors.currentBalance?.message}
            label="Saldo actual"
            placeholder="Ej. 10,000"
            required
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="reportedAvailableCredit"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppMoneyInput
            error={errors.reportedAvailableCredit?.message}
            label="Crédito disponible reportado"
            optional
            placeholder="Ej. 183,894"
            value={value ?? ""}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />

      {statementStatus === "generated" ? (
        <>
          <Controller
            control={control}
            name="statementBalance"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppMoneyInput
                error={errors.statementBalance?.message}
                label="Saldo al corte"
                placeholder="Ej. 8,000"
                required
                value={value ?? ""}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="minimumPayment"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppMoneyInput
                error={errors.minimumPayment?.message}
                label="Pago mínimo"
                placeholder="Ej. 400"
                required
                value={value ?? ""}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="paymentToAvoidInterest"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppMoneyInput
                error={errors.paymentToAvoidInterest?.message}
                label="Pago para no generar intereses"
                placeholder="Ej. 8,000"
                required
                value={value ?? ""}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="lastCutoffDate"
            render={({ field: { onChange, value } }) => (
              <AppDateInput
                error={errors.lastCutoffDate?.message}
                label="Fecha del último corte"
                required
                value={value ?? ""}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="paymentDueDate"
            render={({ field: { onChange, value } }) => (
              <AppDateInput
                error={errors.paymentDueDate?.message}
                label="Fecha límite de pago"
                required
                value={value ?? ""}
                onChangeText={onChange}
              />
            )}
          />
        </>
      ) : (
        <Controller
          control={control}
          name="nextCutoffDate"
          render={({ field: { onChange, value } }) => (
            <AppDateInput
              error={errors.nextCutoffDate?.message}
              label="Próximo corte"
              required
              value={value ?? ""}
              onChangeText={onChange}
            />
          )}
        />
      )}

      <Controller
        control={control}
        name="notes"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppTextInput
            error={errors.notes?.message}
            label="Notas"
            multiline
            optional
            placeholder="Ej. Datos tomados de la app bancaria"
            value={value ?? ""}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />

      {error ? <Text className="text-sm text-red-600">{error}</Text> : null}

      <AppButton
        disabled={saving || (disableSubmitUntilDirty && !isDirty)}
        title={saving ? "Guardando..." : submitLabel}
        onPress={handleSubmit(onSubmit)}
      />

      {onCancel ? (
        <AppButton title="Cancelar" variant="secondary" onPress={onCancel} />
      ) : null}
    </View>
  );
}
