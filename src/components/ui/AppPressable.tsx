import {
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type AppPressableFeedback = "scale" | "opacity" | "none";

interface AppPressableProps extends PressableProps {
  feedback?: AppPressableFeedback;
}

function getFeedbackStyle(
  pressed: boolean,
  disabled: boolean | null | undefined,
  feedback: AppPressableFeedback
): StyleProp<ViewStyle> {
  if (!pressed || disabled || feedback === "none") {
    return {
      opacity: 1,
      transform: [{ scale: 1 }],
    };
  }

  if (feedback === "opacity") {
    return {
      opacity: 0.55,
      transform: [{ scale: 1 }],
    };
  }

  return {
    opacity: 0.72,
    transform: [{ scale: 0.96 }],
  };
}

export function AppPressable({
  feedback = "scale",
  disabled = false,
  style,
  ...props
}: AppPressableProps) {
  function resolveStyle(state: PressableStateCallbackType): StyleProp<ViewStyle> {
    const feedbackStyle = getFeedbackStyle(state.pressed, disabled, feedback);
    const resolvedStyle = typeof style === "function" ? style(state) : style;

    return [feedbackStyle, resolvedStyle];
  }

  return <Pressable disabled={disabled} style={resolveStyle} {...props} />;
}
