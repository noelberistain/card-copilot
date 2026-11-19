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
  primary: "text-primary",
  secondary: "text-ink-muted",
  danger: "text-danger",
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
      className={["self-start py-2", disabled ? "opacity-50" : ""].join(" ")}
      disabled={disabled}
      feedback="opacity"
      onPress={onPress}
    >
      <Text
        className={["font-sans-semibold text-sm", textVariantClasses[variant]].join(" ")}
      >
        {title}
      </Text>
    </AppPressable>
  );
}
