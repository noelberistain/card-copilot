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
      <Text className="text-sm font-medium text-slate-700">
        {label}
        {required ? <Text className="text-red-600"> *</Text> : null}
        {!required && optional ? <Text className="text-slate-400"> opcional</Text> : null}
      </Text>

      <View
        className={[
          "min-h-14 flex-row items-center rounded-2xl border bg-white px-4",
          error ? "border-red-500" : "border-slate-300",
          props.editable === false ? "opacity-60" : "",
        ].join(" ")}
      >
        <Text className="mr-2 text-base font-semibold leading-5 text-slate-500">$</Text>

        <TextInput
          className="h-6 flex-1 p-0 text-base leading-5 text-slate-900"
          keyboardType="decimal-pad"
          placeholderTextColor="#94a3b8"
          style={[{ paddingVertical: 0 }, style]}
          textAlignVertical="center"
          {...props}
        />
      </View>

      {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
    </View>
  );
}
