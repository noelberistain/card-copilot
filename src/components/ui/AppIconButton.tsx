import { Text } from "react-native";

import { AppPressable } from "@/components/ui/AppPressable";

interface AppIconButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function AppIconButton({
  label,
  onPress,
  disabled = false,
}: AppIconButtonProps) {
  return (
    <AppPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      feedback="scale"
      disabled={disabled}
      onPress={onPress}
      className={[
        "h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm",
        disabled ? "opacity-50" : "",
      ].join(" ")}
    >
      <Text className="text-xl font-semibold text-slate-900">{label}</Text>
    </AppPressable>
  );
}
