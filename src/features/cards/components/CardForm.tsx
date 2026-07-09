import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { AppButton, AppColorInput, AppTextInput } from "@/components/ui";
import {
  cardFormSchema,
  type CardFormInput,
  type CardFormValues,
} from "@/features/cards/schemas/cardForm.schema";

interface CardFormProps {
  defaultValues?: Partial<CardFormInput>;
  submitLabel: string;
  saving?: boolean;
  error?: string | null;
  disableSubmitUntilDirty?: boolean;
  onSubmit: (values: CardFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

const emptyDefaultValues: CardFormInput = {
  alias: "",
  bank: "",
  creditLimit: "",
  cutoffDay: "",
  paymentDueDay: "",
  network: "",
  color: "",
};

export function CardForm({
  defaultValues,
  submitLabel,
  saving = false,
  error,
  disableSubmitUntilDirty = false,
  onSubmit,
  onCancel,
}: CardFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CardFormInput, unknown, CardFormValues>({
    resolver: zodResolver(cardFormSchema),
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
          name="alias"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              label="Alias"
              placeholder="Ej. BBVA Azul"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.alias?.message}
              autoCapitalize="words"
            />
          )}
        />

        <Controller
          control={control}
          name="bank"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              label="Banco"
              placeholder="Ej. BBVA"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.bank?.message}
              autoCapitalize="words"
            />
          )}
        />

        <Controller
          control={control}
          name="creditLimit"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              label="Línea de crédito"
              placeholder="Ej. 25000"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.creditLimit?.message}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="cutoffDay"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              label="Día de corte"
              placeholder="Ej. 20"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.cutoffDay?.message}
              keyboardType="number-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="paymentDueDay"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              label="Día de pago"
              placeholder="Ej. 10"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.paymentDueDay?.message}
              keyboardType="number-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="network"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              label="Red de tarjeta"
              placeholder="visa, mastercard, amex u other"
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.network?.message}
              autoCapitalize="none"
            />
          )}
        />

        <Controller
          control={control}
          name="color"
          render={({ field: { value, onChange } }) => (
            <AppColorInput
              label="Color"
              value={value}
              onChangeText={onChange}
              error={errors.color?.message}
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
