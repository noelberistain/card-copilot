import { Pressable, Text, View } from "react-native";

interface AppColorInputProps {
  label: string;
  value: string | null | undefined;
  onChangeText: (value: string) => void;
  error?: string | null;
}

const colorOptions = [
  { label: "Azul", value: "#2563eb" },
  { label: "Morado", value: "#7c3aed" },
  { label: "Rosa", value: "#db2777" },
  { label: "Rojo", value: "#dc2626" },
  { label: "Naranja", value: "#ea580c" },
  { label: "Verde", value: "#16a34a" },
  { label: "Negro", value: "#0f172a" },
  { label: "Gris", value: "#64748b" },
];

export function AppColorInput({
  label,
  value,
  onChangeText,
  error,
}: AppColorInputProps) {
  return (
    <View className="w-full gap-2">
      <Text className="text-sm font-medium text-slate-700">{label}</Text>

      <View className="flex-row flex-wrap gap-3">
        {colorOptions.map((color) => {
          const selected = value === color.value;

          return (
            <Pressable
              key={color.value}
              onPress={() => onChangeText(color.value)}
              className={[
                "h-12 w-12 items-center justify-center rounded-full border-2",
                selected ? "border-slate-950" : "border-transparent",
              ].join(" ")}
              accessibilityRole="button"
              accessibilityLabel={`Seleccionar color ${color.label}`}
            >
              <View
                className="h-9 w-9 rounded-full"
                style={{ backgroundColor: color.value }}
              />
            </Pressable>
          );
        })}
      </View>

      {value ? (
        <View className="mt-1 flex-row items-center gap-2">
          <View
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: value }}
          />

          <Text className="text-sm text-slate-500">{value}</Text>
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
