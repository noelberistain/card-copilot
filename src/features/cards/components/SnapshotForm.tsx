import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { AppButton, AppDateInput, AppTextInput } from "@/components/ui";
import {
  snapshotFormSchema,
  type SnapshotFormInput,
  type SnapshotFormValues,
} from "@/features/cards/schemas/snapshotForm.schema";

interface SnapshotFormProps {
  defaultValues?: Partial<SnapshotFormInput>;
  disableSubmitUntilDirty?: boolean;
  error?: string | null;
  saving?: boolean;
  submitLabel: string;
  onSubmit: (values: SnapshotFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

const emptyDefaultValues: SnapshotFormInput = {
  currentBalance: "",
  lastCutoffDate: "",
  minimumPayment: "",
  notes: "",
  paymentDueDate: "",
  paymentToAvoidInterest: "",
  reportedAvailableCredit: "",
  statementBalance: "",
};

export function SnapshotForm({
  defaultValues,
  disableSubmitUntilDirty = false,
  error,
  saving = false,
  submitLabel,
  onSubmit,
  onCancel,
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
    <View className="gap-6">
      <View className="gap-4">
        <Controller
          control={control}
          name="currentBalance"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              error={errors.currentBalance?.message}
              keyboardType="decimal-pad"
              label="Saldo actual"
              placeholder="Ej. 9648.03"
              required
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="statementBalance"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              error={errors.statementBalance?.message}
              keyboardType="decimal-pad"
              label="Saldo al corte"
              placeholder="Ej. 8862.63"
              required
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="minimumPayment"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              error={errors.minimumPayment?.message}
              keyboardType="decimal-pad"
              label="Pago mínimo"
              placeholder="Ej. 450"
              required
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="paymentToAvoidInterest"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              error={errors.paymentToAvoidInterest?.message}
              keyboardType="decimal-pad"
              label="Pago para no generar intereses"
              placeholder="Ej. 8862.63"
              required
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="lastCutoffDate"
          render={({ field: { value, onChange } }) => (
            <AppDateInput
              error={errors.lastCutoffDate?.message}
              label="Fecha del último corte"
              required
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="paymentDueDate"
          render={({ field: { value, onChange } }) => (
            <AppDateInput
              error={errors.paymentDueDate?.message}
              label="Fecha límite de pago"
              required
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              error={errors.notes?.message}
              label="Notas"
              multiline
              optional
              placeholder="Opcional"
              value={value ?? ""}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      {error ? <Text className="text-sm font-medium text-red-600">{error}</Text> : null}

      <AppButton
        disabled={saving || (disableSubmitUntilDirty && !isDirty)}
        title={saving ? "Guardando..." : submitLabel}
        onPress={handleSubmit(onSubmit)}
      />

      {onCancel ? (
        <AppButton
          disabled={saving}
          title="Cancelar"
          variant="secondary"
          onPress={onCancel}
        />
      ) : null}
    </View>
  );
}
