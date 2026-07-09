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
  submitLabel: string;
  saving?: boolean;
  error?: string | null;
  disableSubmitUntilDirty?: boolean;
  onSubmit: (values: SnapshotFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

const emptyDefaultValues: SnapshotFormInput = {
  currentBalance: "",
  statementBalance: "",
  minimumPayment: "",
  paymentToAvoidInterest: "",
  lastCutoffDate: "",
  paymentDueDate: "",
  notes: "",
};

export function SnapshotForm({
  defaultValues,
  submitLabel,
  saving = false,
  error,
  disableSubmitUntilDirty = false,
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
              label="Saldo actual"
              required
              placeholder="Ej. 9648.03"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.currentBalance?.message}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="statementBalance"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              label="Saldo al corte"
              required
              placeholder="Ej. 8862.63"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.statementBalance?.message}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="minimumPayment"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              label="Pago mínimo"
              required
              placeholder="Ej. 450"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.minimumPayment?.message}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="paymentToAvoidInterest"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              label="Pago para no generar intereses"
              required
              placeholder="Ej. 8862.63"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.paymentToAvoidInterest?.message}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="lastCutoffDate"
          render={({ field: { value, onChange } }) => (
            <AppDateInput
              label="Fecha del último corte"
              required
              value={value}
              onChangeText={onChange}
              error={errors.lastCutoffDate?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="paymentDueDate"
          render={({ field: { value, onChange } }) => (
            <AppDateInput
              label="Fecha límite de pago"
              required
              value={value}
              onChangeText={onChange}
              error={errors.paymentDueDate?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              label="Notas"
              optional
              placeholder="Opcional"
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.notes?.message}
              multiline
            />
          )}
        />
      </View>

      {error ? <Text className="text-sm font-medium text-red-600">{error}</Text> : null}

      <AppButton
        title={saving ? "Guardando..." : submitLabel}
        onPress={handleSubmit(onSubmit)}
        disabled={saving || (disableSubmitUntilDirty && !isDirty)}
      />

      {onCancel ? (
        <AppButton
          title="Cancelar"
          variant="secondary"
          onPress={onCancel}
          disabled={saving}
        />
      ) : null}
    </View>
  );
}
