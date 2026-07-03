import { Text, View } from "react-native";

import type {
  CardInsight,
  CardInsightTone,
} from "@/logic/cards/cardStatus.logic";

interface CardInsightsPanelProps {
  insights: CardInsight[];
}

function getInsightClasses(tone: CardInsightTone) {
  switch (tone) {
    case "danger":
      return "border-red-200 bg-red-50";
    case "warning":
      return "border-amber-200 bg-amber-50";
    case "success":
      return "border-emerald-200 bg-emerald-50";
    case "info":
    default:
      return "border-blue-200 bg-blue-50";
  }
}

function getTitleClasses(tone: CardInsightTone) {
  switch (tone) {
    case "danger":
      return "text-red-800";
    case "warning":
      return "text-amber-800";
    case "success":
      return "text-emerald-800";
    case "info":
    default:
      return "text-blue-800";
  }
}

function getMessageClasses(tone: CardInsightTone) {
  switch (tone) {
    case "danger":
      return "text-red-700";
    case "warning":
      return "text-amber-700";
    case "success":
      return "text-emerald-700";
    case "info":
    default:
      return "text-blue-700";
  }
}

export function CardInsightsPanel({ insights }: CardInsightsPanelProps) {
  return (
    <View className="rounded-3xl bg-white p-5">
      <Text className="text-base font-semibold text-slate-900">
        Insights
      </Text>

      <Text className="mt-1 text-sm text-slate-500">
        Explicaciones basadas en el último estado capturado.
      </Text>

      <View className="mt-5 gap-3">
        {insights.map((insight) => (
          <View
            key={insight.id}
            className={`rounded-2xl border p-4 ${getInsightClasses(
              insight.tone
            )}`}
          >
            <Text
              className={`text-base font-semibold ${getTitleClasses(
                insight.tone
              )}`}
            >
              {insight.title}
            </Text>

            <Text
              className={`mt-1 text-sm ${getMessageClasses(insight.tone)}`}
            >
              {insight.message}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
