import { Text } from "react-native";

import { AppPressable } from "@/components/ui/AppPressable";

type AppButtonVariant = "primary" | "secondary" | "danger";
type AppButtonSize = "sm" | "md" | "lg";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  fullWidth?: boolean;
}

const variantClasses: Record<AppButtonVariant, string> = {
  primary: "bg-blue-600",
  secondary: "bg-slate-700",
  danger: "bg-red-600",
};

const sizeContainerClasses: Record<AppButtonSize, string> = {
  sm: "rounded-xl px-3 py-2",
  md: "rounded-2xl px-4 py-3",
  lg: "rounded-2xl px-4 py-4",
};

const sizeTextClasses: Record<AppButtonSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-base",
};

export function AppButton({
  title,
  onPress,
  disabled = false,
  variant = "primary",
  size = "lg",
  fullWidth = true,
}: AppButtonProps) {
  return (
    <AppPressable
      accessibilityRole="button"
      feedback="scale"
      onPress={onPress}
      disabled={disabled}
      className={[
        fullWidth ? "w-full" : "self-start",
        sizeContainerClasses[size],
        disabled ? "bg-slate-400" : variantClasses[variant],
      ].join(" ")}
    >
      <Text
        className={["text-center font-semibold text-white", sizeTextClasses[size]].join(
          " "
        )}
      >
        {title}
      </Text>
    </AppPressable>
  );
}
