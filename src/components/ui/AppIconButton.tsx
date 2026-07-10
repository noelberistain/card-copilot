import { Pressable, Text } from "react-native";

interface AppIconButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function AppIconButton({ label, onPress, disabled = false }: AppIconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed && !disabled ? 0.75 : 1,
        transform: [{ scale: pressed && !disabled ? 0.95 : 1 }],
      })}
      className={[
        "h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm",
        disabled ? "opacity-50" : "",
      ].join(" ")}
    >
      <Text className="text-xl font-semibold text-slate-900">{label}</Text>
    </Pressable>
  );
}
