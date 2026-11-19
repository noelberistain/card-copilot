import { Text, TextInput, View, type TextInputProps } from "react-native";

interface AppTextInputProps extends TextInputProps {
  label: string;
  error?: string | null;
  required?: boolean;
  optional?: boolean;
}

export function AppTextInput({
  label,
  error,
  required = false,
  optional = false,
  ...props
}: AppTextInputProps) {
  return (
    <View className="w-full gap-2">
      <Text className="font-sans-medium text-sm text-ink">
        {label}
        {required ? <Text className="text-danger"> *</Text> : null}
        {!required && optional ? <Text className="text-ink-muted"> opcional</Text> : null}
      </Text>

      <TextInput
        className={[
          "rounded-2xl border bg-surface-muted px-4 py-4 text-base text-ink",
          error ? "border-danger" : "border-ink-muted/30",
        ].join(" ")}
        placeholderTextColor="#64748B"
        {...props}
      />

      {error ? <Text className="text-sm text-danger">{error}</Text> : null}
    </View>
  );
}
