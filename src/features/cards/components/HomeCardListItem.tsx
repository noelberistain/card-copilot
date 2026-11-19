import { Text, View } from "react-native";

import { AppPressable } from "@/components/ui";
import type {
  HomeCardPaymentTone,
  HomeCardView,
} from "@/features/cards/services/buildHomeCardView";

interface HomeCardListItemProps {
  view: HomeCardView;
  onPress?: () => void;
}

function getPaymentToneClasses(tone: HomeCardPaymentTone) {
  switch (tone) {
    case "danger":
      return "text-danger";
    case "warning":
      return "text-warning";
    case "success":
      return "text-success";
    case "default":
    default:
      return "text-ink-muted";
  }
}

export function HomeCardListItem({ view, onPress }: HomeCardListItemProps) {
  const { card } = view;

  return (
    <AppPressable
      accessibilityRole="button"
      className="rounded-3xl bg-surface-muted p-5"
      disabled={!onPress}
      feedback={onPress ? "scale" : "none"}
      onPress={onPress}
    >
      <View className="flex-row items-start gap-3">
        <View
          className="mt-1 h-4 w-4 rounded-full"
          style={{ backgroundColor: card.color ?? "#0D9488" }}
        />

        <View className="flex-1">
          <Text className="font-display-bold text-lg text-ink" numberOfLines={1}>
            {card.alias}
          </Text>

          <View className="mt-4 flex-row gap-4">
            <View className="flex-1">
              <Text className="text-xs text-ink-muted">{view.balanceLabel}</Text>

              <Text
                className="mt-1 font-display-bold text-base tabular-nums text-ink"
                numberOfLines={1}
              >
                {view.balanceValue}
              </Text>
            </View>

            <View className="flex-1">
              <Text
                className={`text-xs ${getPaymentToneClasses(view.paymentTone)}`}
                numberOfLines={1}
              >
                {view.paymentLabel}
              </Text>

              <Text
                className="mt-1 font-display-bold text-base tabular-nums text-ink"
                numberOfLines={1}
              >
                {view.paymentValue}
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row gap-4 border-t border-ink-muted/15 pt-3">
            <Text className="flex-1 text-xs text-ink-muted" numberOfLines={1}>
              {view.cutoffText}
            </Text>

            <Text className="flex-1 text-xs text-ink-muted" numberOfLines={1}>
              {view.dueText}
            </Text>
          </View>
        </View>
      </View>
    </AppPressable>
  );
}
