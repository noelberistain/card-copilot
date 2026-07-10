import { Pressable, Text } from "react-native";

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
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed && !disabled ? 0.6 : 1,
      })}
      className={["self-start py-2", disabled ? "opacity-50" : ""].join(" ")}
    >
      <Text className={["text-sm font-semibold", textVariantClasses[variant]].join(" ")}>
        {title}
      </Text>
    </Pressable>
  );
}
