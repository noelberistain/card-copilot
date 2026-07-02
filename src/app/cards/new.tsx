import { Alert, Text, View } from "react-native";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppButton, AppTextInput, ScreenContainer } from "@/components/ui";
import {
  cardFormSchema,
  type CardFormInput,
  type CardFormValues,
} from "@/features/cards/schemas/cardForm.schema";
import { useSaveCard } from "@/features/cards/hooks/useSaveCard";

export default function NewCardScreen() {
  const { save, saving, error } = useSaveCard();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormInput, unknown, CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      alias: "",
      bank: "",
      creditLimit: "",
      cutoffDay: "",
      paymentDueDay: "",
      network: "",
      color: "",
    },
  });

  async function onSubmit(values: CardFormValues) {
    try {
      await save(values);

      Alert.alert("Tarjeta guardada", "La tarjeta se guardó correctamente.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch {
      // El hook ya setea el error.
    }
  }

  return (
    <ScreenContainer>
      <View className="gap-6">
        <View>
          <Text className="text-3xl font-bold text-slate-950">
            Agregar tarjeta
          </Text>

          <Text className="mt-2 text-base text-slate-500">
            Captura la información base de tu tarjeta para empezar a darle
            seguimiento.
          </Text>
        </View>

        <View className="gap-4">
          <Controller
            control={control}
