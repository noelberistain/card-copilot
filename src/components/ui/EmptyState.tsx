import { Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View className="items-center justify-center rounded-3xl border border-dashed border-ink-muted/30 bg-surface-muted px-6 py-10">
      <Text className="text-center font-display text-lg text-ink">{title}</Text>

      {message ? (
        <Text className="mt-2 text-center text-sm text-ink-muted">{message}</Text>
      ) : null}
    </View>
  );
}
