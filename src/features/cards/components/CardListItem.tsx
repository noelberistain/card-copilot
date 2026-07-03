import { Pressable, Text, View } from "react-native";

import { formatCurrency } from "@/lib/money/formatCurrency";
import type { Card } from "@/models/cards/card.types";

interface CardListItemProps {
  card: Card;
  onPress?: () => void;
}

export function CardListItem({ card, onPress }: CardListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-slate-900">{card.alias}</Text>

          <Text className="mt-1 text-sm text-slate-500">{card.bank}</Text>
        </View>

        {card.color ? (
          <View
            className="h-5 w-5 rounded-full"
            style={{ backgroundColor: card.color }}
          />
        ) : null}
      </View>

      <View className="mt-4 gap-1">
        <Text className="text-sm text-slate-500">Línea de crédito</Text>

        <Text className="text-xl font-bold text-slate-900">
          {formatCurrency(card.creditLimit)}
        </Text>
      </View>

      <View className="mt-4 flex-row gap-3">
        <View className="flex-1 rounded-2xl bg-slate-100 p-3">
          <Text className="text-xs text-slate-500">Corte</Text>
          <Text className="mt-1 text-base font-semibold text-slate-900">
            Día {card.cutoffDay}
          </Text>
        </View>

        <View className="flex-1 rounded-2xl bg-slate-100 p-3">
          <Text className="text-xs text-slate-500">Pago</Text>
          <Text className="mt-1 text-base font-semibold text-slate-900">
            Día {card.paymentDueDay}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
