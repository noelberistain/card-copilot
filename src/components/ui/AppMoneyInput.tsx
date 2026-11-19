import { Text, TextInput, View, type TextInputProps } from "react-native";

interface AppMoneyInputProps extends TextInputProps {
  label: string;
  error?: string | null;
  optional?: boolean;
  required?: boolean;
}

export function AppMoneyInput({
  error,
  label,
  optional = false,
  required = false,
  style,
  ...props
}: AppMoneyInputProps) {
  return (
    <View className="w-full gap-2">
      <Text className="font-sans-medium text-sm text-ink">
        {label}
        {required ? <Text className="text-danger"> *</Text> : null}
        {!required && optional ? <Text className="text-ink-muted"> opcional</Text> : null}
      </Text>

      <View
        className={[
          "min-h-14 flex-row items-center rounded-2xl border bg-surface-muted px-4",
          error ? "border-danger" : "border-ink-muted/30",
          props.editable === false ? "opacity-60" : "",
        ].join(" ")}
      >
        <Text className="mr-2 font-sans-semibold text-base leading-5 text-ink-muted">
          $
        </Text>

        <TextInput
          className="h-6 flex-1 p-0 font-display text-base tabular-nums leading-5 text-ink"
          keyboardType="decimal-pad"
          placeholderTextColor="#64748B"
          style={[{ paddingVertical: 0 }, style]}
          textAlignVertical="center"
          {...props}
        />
      </View>

      {error ? <Text className="text-sm text-danger">{error}</Text> : null}
    </View>
  );
}
