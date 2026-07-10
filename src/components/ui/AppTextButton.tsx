import { Text } from "react-native";

import { AppPressable } from "@/components/ui/AppPressable";

type AppTextButtonVariant = "primary" | "secondary" | "danger";

interface AppTextButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: AppTextButtonVariant;
}

const textVariantClasses: Record<AppTextButtonVariant, string> = {
  primary: "text-blue-700",
  secondary: "text-slate-600",
  danger: "text-red-700",
};

export function AppTextButton({
  title,
  onPress,
  disabled = false,
  variant = "primary",
}: AppTextButtonProps) {
  return (
    <AppPressable
      accessibilityRole="button"
      feedback="opacity"
      disabled={disabled}
      onPress={onPress}
      className={["self-start py-2", disabled ? "opacity-50" : ""].join(" ")}
    >
      <Text className={["text-sm font-semibold", textVariantClasses[variant]].join(" ")}>
        {title}
      </Text>
    </AppPressable>
  );
}
