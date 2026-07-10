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
      return "text-red-700";
    case "warning":
      return "text-amber-700";
    case "success":
      return "text-emerald-700";
    case "default":
    default:
      return "text-slate-600";
  }
}

export function HomeCardListItem({ view, onPress }: HomeCardListItemProps) {
  const { card } = view;

  return (
    <AppPressable
      accessibilityRole="button"
      className="rounded-3xl bg-white p-5"
      disabled={!onPress}
      feedback={onPress ? "scale" : "none"}
      onPress={onPress}
    >
      <View className="flex-row items-start gap-3">
        <View
          className="mt-1 h-4 w-4 rounded-full"
          style={{ backgroundColor: card.color ?? "#2563eb" }}
        />

        <View className="flex-1">
          <Text className="text-lg font-bold text-slate-950" numberOfLines={1}>
            {card.alias}
          </Text>

          <View className="mt-4 flex-row gap-4">
            <View className="flex-1">
              <Text className="text-xs text-slate-500">{view.balanceLabel}</Text>

              <Text
                className="mt-1 text-base font-semibold text-slate-950"
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
                className="mt-1 text-base font-semibold text-slate-950"
                numberOfLines={1}
              >
                {view.paymentValue}
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row gap-4 border-t border-slate-100 pt-3">
            <Text className="flex-1 text-xs text-slate-500" numberOfLines={1}>
              {view.cutoffText}
            </Text>

            <Text className="flex-1 text-xs text-slate-500" numberOfLines={1}>
              {view.dueText}
            </Text>
          </View>
        </View>
      </View>
    </AppPressable>
  );
}
