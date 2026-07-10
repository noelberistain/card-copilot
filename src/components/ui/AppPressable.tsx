import { useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type AppPressableFeedback = "scale" | "opacity" | "none";

interface AppPressableProps extends Omit<PressableProps, "style"> {
  feedback?: AppPressableFeedback;
  style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppPressable({
  feedback = "scale",
  disabled = false,
  onPressIn,
  onPressOut,
  style,
  ...props
}: AppPressableProps) {
  const [pressValue] = useState(() => new Animated.Value(0));

  function animatePress(toValue: number) {
    Animated.timing(pressValue, {
      toValue,
      duration: toValue === 1 ? 70 : 100,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }

  function handlePressIn(event: GestureResponderEvent) {
    if (!disabled && feedback !== "none") {
      animatePress(1);
    }

    onPressIn?.(event);
  }

  function handlePressOut(event: GestureResponderEvent) {
    if (!disabled && feedback !== "none") {
      animatePress(0);
    }

    onPressOut?.(event);
  }

  const animatedStyle =
    feedback === "none"
      ? undefined
      : {
          opacity: pressValue.interpolate({
            inputRange: [0, 1],
            outputRange: feedback === "opacity" ? [1, 0.7] : [1, 0.86],
          }),
          transform: [
            {
              scale: pressValue.interpolate({
                inputRange: [0, 1],
                outputRange: feedback === "scale" ? [1, 0.98] : [1, 1],
              }),
            },
          ],
        };

  return (
    <AnimatedPressable
      {...props}
      disabled={disabled}
      style={[animatedStyle, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    />
  );
}
