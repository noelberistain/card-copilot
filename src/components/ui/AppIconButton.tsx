import { Text } from "react-native";

import { AppPressable } from "@/components/ui/AppPressable";

interface AppIconButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function AppIconButton({ label, onPress, disabled = false }: AppIconButtonProps) {
  return (
    <AppPressable
      accessibilityLabel={label}
      accessibilityRole="button"
      className={[
        "h-10 w-10 items-center justify-center rounded-full bg-surface-muted shadow-sm",
        disabled ? "opacity-50" : "",
      ].join(" ")}
      disabled={disabled}
      feedback="scale"
      onPress={onPress}
    >
      <Text className="font-sans-semibold text-xl text-ink">{label}</Text>
    </AppPressable>
  );
}
