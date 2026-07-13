import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppButton, AppDateInput, AppMoneyInput, AppTextInput } from "@/components/ui";
import {
  snapshotFormSchema,
  type SnapshotFormInput,
  type SnapshotFormValues,
} from "@/features/cards/schemas/snapshotForm.schema";

const emptyDefaultValues: SnapshotFormInput = {
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
    formState: { errors, isDirty },
  } = useForm<SnapshotFormInput, unknown, SnapshotFormValues>({
    resolver: zodResolver(snapshotFormSchema),
    defaultValues: {
      ...emptyDefaultValues,
      ...defaultValues,
    },
  });

  return (
    <View className="gap-5 rounded-3xl bg-white p-5">
      <View className="rounded-2xl bg-blue-50 p-4">
        <Text className="text-sm font-semibold text-blue-800">
          Captura lo que veas hoy
        </Text>

        <Text className="mt-1 text-sm text-blue-700">
          Ingresa los datos que aparezcan en tu app bancaria. Si algún dato aún no
          aparece, puedes dejarlo vacío. No inventes montos: mientras más información real
          captures, mejores serán los insights.
        </Text>
      </View>

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

      <View className="rounded-2xl bg-slate-50 p-4">
        <Text className="text-sm font-semibold text-slate-800">
          Datos del estado de cuenta
        </Text>

        <Text className="mt-1 text-sm text-slate-500">
          Si tu app ya muestra saldo al corte, pagos y fecha límite, captúralos. Si
          todavía no aparecen, déjalos vacíos.
        </Text>
      </View>

      <Controller
        control={control}
        name="statementBalance"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppMoneyInput
            error={errors.statementBalance?.message}
            label="Saldo al corte"
            optional
            placeholder="Ej. 8,000"
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
            optional
            placeholder="Ej. 400"
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
            optional
            placeholder="Ej. 8,000"
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
            optional
            value={value ?? ""}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="nextCutoffDate"
        render={({ field: { onChange, value } }) => (
          <AppDateInput
            error={errors.nextCutoffDate?.message}
            label="Próximo corte"
            optional
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
            optional
            value={value ?? ""}
            onChangeText={onChange}
          />
        )}
      />

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
