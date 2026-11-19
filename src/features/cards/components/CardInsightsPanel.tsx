import { Text, View } from "react-native";

import type { CardInsight, CardInsightTone } from "@/logic/cards/cardStatus.logic";

interface CardInsightsPanelProps {
  insights: CardInsight[];
}

function getInsightClasses(tone: CardInsightTone) {
  switch (tone) {
    case "danger":
      return "border-danger/20 bg-danger/10";
    case "warning":
      return "border-warning/20 bg-warning/10";
    case "success":
      return "border-success/20 bg-success/10";
    case "info":
    default:
      return "border-primary/20 bg-primary-muted";
  }
}

function getTitleClasses(tone: CardInsightTone) {
  switch (tone) {
    case "danger":
      return "text-danger";
    case "warning":
      return "text-warning";
    case "success":
      return "text-success";
    case "info":
    default:
      return "text-primary";
  }
}

function getMessageClasses(tone: CardInsightTone) {
  switch (tone) {
    case "danger":
      return "text-danger";
    case "warning":
      return "text-warning";
    case "success":
      return "text-success";
    case "info":
    default:
      return "text-primary";
  }
}

export function CardInsightsPanel({ insights }: CardInsightsPanelProps) {
  return (
    <View className="rounded-3xl bg-surface-muted p-5">
      <Text className="font-display text-base text-ink">Insights</Text>

      <Text className="mt-1 text-sm text-ink-muted">
        Explicaciones basadas en el último estado capturado.
      </Text>

      <View className="mt-5 gap-3">
        {insights.map((insight) => (
          <View
            key={insight.id}
            className={`rounded-2xl border p-4 ${getInsightClasses(insight.tone)}`}
          >
            <Text
              className={`font-sans-semibold text-base ${getTitleClasses(insight.tone)}`}
            >
              {insight.title}
            </Text>

            <Text className={`mt-1 text-sm ${getMessageClasses(insight.tone)}`}>
              {insight.message}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
