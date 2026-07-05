import { Pressable, Text, View } from "react-native";

import { CARD_COLOR_OPTIONS } from "@/constants/cardColors";

interface AppColorInputProps {
  label: string;
  value: string | null | undefined;
  onChangeText: (value: string) => void;
  error?: string | null;
}

export function AppColorInput({
  label,
  value: selectedColor,
  onChangeText,
  error,
}: AppColorInputProps) {
  return (
    <View className="w-full gap-2">
      <Text className="text-sm font-medium text-slate-700">{label}</Text>

      <View className="flex-row flex-wrap gap-3">
        {CARD_COLOR_OPTIONS.map((colorOption) => {
          const colorValue = colorOption.value;
          const selected = selectedColor === colorValue;

          return (
            <Pressable
              key={colorValue}
              onPress={() => onChangeText(colorValue)}
              className={[
                "h-12 w-12 items-center justify-center rounded-full border-2",
                selected ? "border-slate-950" : "border-transparent",
              ].join(" ")}
              accessibilityRole="button"
              accessibilityLabel={`Seleccionar color ${colorOption.label}`}
            >
              <View
                className="h-9 w-9 rounded-full"
                style={{ backgroundColor: colorValue }}
              />
            </Pressable>
          );
        })}
      </View>

      {selectedColor ? (
        <View className="mt-1 flex-row items-center gap-2">
          <View
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: selectedColor }}
          />

          <Text className="text-sm text-slate-500">{selectedColor}</Text>
        </View>
      ) : (
        <Text className="text-sm text-slate-400">
          Selecciona un color para identificar la tarjeta.
        </Text>
      )}

      {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
    </View>
  );
}
