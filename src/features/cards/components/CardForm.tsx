import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { AppButton, AppColorInput, AppMoneyInput, AppTextInput } from "@/components/ui";
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
              autoCapitalize="words"
              error={errors.alias?.message}
              label="Alias"
              placeholder="Ej. BBVA Azul"
              required
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="bank"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              autoCapitalize="words"
              error={errors.bank?.message}
              label="Banco"
              placeholder="Ej. BBVA"
              required
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="creditLimit"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppMoneyInput
              error={errors.creditLimit?.message}
              label="Línea de crédito"
              placeholder="Ej. 25,000"
              required
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="cutoffDay"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              error={errors.cutoffDay?.message}
              keyboardType="number-pad"
              label="Día de corte"
              placeholder="Ej. 20"
              required
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="paymentDueDay"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              error={errors.paymentDueDay?.message}
              keyboardType="number-pad"
              label="Día de pago"
              placeholder="Ej. 10"
              required
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="network"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppTextInput
              autoCapitalize="none"
              error={errors.network?.message}
              label="Red de tarjeta"
              optional
              placeholder="visa, mastercard, amex u other"
              value={value ?? ""}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="color"
          render={({ field: { value, onChange } }) => (
            <AppColorInput
              error={errors.color?.message}
              label="Color"
              optional
              value={value}
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
