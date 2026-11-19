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
      className="rounded-3xl border border-ink-muted/20 bg-surface-muted p-5 shadow-sm"
      onPress={onPress}
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text className="font-display-bold text-lg text-ink">{card.alias}</Text>

          <Text className="mt-1 text-sm text-ink-muted">{card.bank}</Text>
        </View>

        {card.color ? (
          <View
            className="h-5 w-5 rounded-full"
            style={{ backgroundColor: card.color }}
          />
        ) : null}
      </View>

      <View className="mt-4 gap-1">
        <Text className="text-sm text-ink-muted">Línea de crédito</Text>

        <Text className="font-display-bold text-xl tabular-nums text-ink">
          {formatCurrency(card.creditLimit)}
        </Text>
      </View>

      <View className="mt-4 flex-row gap-3">
        <View className="flex-1 rounded-2xl bg-surface p-3">
          <Text className="text-xs text-ink-muted">Corte</Text>
          <Text className="mt-1 font-sans-semibold text-base text-ink">
            Día {card.cutoffDay}
          </Text>
        </View>

        <View className="flex-1 rounded-2xl bg-surface p-3">
          <Text className="text-xs text-ink-muted">Pago</Text>
          <Text className="mt-1 font-sans-semibold text-base text-ink">
            Día {card.paymentDueDay}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
