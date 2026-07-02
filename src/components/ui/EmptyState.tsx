import { Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View className="items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10">
      <Text className="text-center text-lg font-semibold text-slate-900">
        {title}
      </Text>

      {message ? (
        <Text className="mt-2 text-center text-sm text-slate-500">
          {message}
        </Text>
      ) : null}
    </View>
  );
}
