import { Pressable, type PressableProps } from "react-native";

type AppPressableFeedback = "scale" | "opacity" | "none";

interface AppPressableProps extends PressableProps {
  feedback?: AppPressableFeedback;
}

export function AppPressable({
  feedback = "scale",
  disabled,
  style,
  ...props
}: AppPressableProps) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => {
        const feedbackStyle =
          pressed && !disabled
            ? feedback === "scale"
              ? {
                  opacity: 0.72,
                  transform: [{ scale: 0.96 }],
                }
              : feedback === "opacity"
                ? {
                    opacity: 0.55,
                  }
                : {}
            : {
                opacity: 1,
                transform: [{ scale: 1 }],
              };

        const resolvedStyle =
          typeof style === "function" ? style({ pressed }) : style;

        return [feedbackStyle, resolvedStyle];
      }}
      {...props}
    />
  );
}
