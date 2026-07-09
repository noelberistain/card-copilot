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
      <Text className="text-sm font-medium text-slate-700">
        {label}
        {required ? <Text className="text-red-600"> *</Text> : null}
        {!required && optional ? <Text className="text-slate-400"> opcional</Text> : null}
      </Text>

      <TextInput
        className={[
          "rounded-2xl border bg-white px-4 py-4 text-base text-slate-900",
          error ? "border-red-500" : "border-slate-300",
        ].join(" ")}
        placeholderTextColor="#94a3b8"
        {...props}
      />

      {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
    </View>
  );
}
