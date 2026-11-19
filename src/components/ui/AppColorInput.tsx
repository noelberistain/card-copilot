import { Pressable, Text, View } from "react-native";

import { CARD_COLOR_OPTIONS } from "@/constants/cardColors";

interface AppColorInputProps {
  label: string;
  value: string | null | undefined;
  error?: string | null;
  required?: boolean;
  optional?: boolean;
  onChangeText: (value: string) => void;
}

export function AppColorInput({
  label,
  value: selectedColor,
  onChangeText,
  error,
  required = false,
  optional = false,
}: AppColorInputProps) {
  return (
    <View className="w-full gap-2">
      <Text className="font-sans-medium text-sm text-ink">
        {label}
        {required ? <Text className="text-danger"> *</Text> : null}
        {!required && optional ? <Text className="text-ink-muted"> opcional</Text> : null}
      </Text>

      <View className="flex-row flex-wrap gap-3">
        {CARD_COLOR_OPTIONS.map((colorOption) => {
          const colorValue = colorOption.value;
          const selected = selectedColor === colorValue;

          return (
            <Pressable
              key={colorValue}
              accessibilityLabel={`Seleccionar color ${colorOption.label}`}
              accessibilityRole="button"
              className={[
                "h-12 w-12 items-center justify-center rounded-full border-2",
                selected ? "border-primary" : "border-transparent",
              ].join(" ")}
              onPress={() => onChangeText(colorValue)}
            >
              <View
                className="h-9 w-9 rounded-full"
                style={{ backgroundColor: colorValue }}
              />
            </Pressable>
          );
        })}
      </View>

      {selectedColor ? null : (
        <Text className="text-sm text-ink-muted">
          Selecciona un color para identificar la tarjeta.
        </Text>
      )}

      {error ? <Text className="text-sm text-danger">{error}</Text> : null}
    </View>
  );
}
