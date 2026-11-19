import { router } from "expo-router";
import { Text, View } from "react-native";

import { AppIconButton } from "@/components/ui/AppIconButton";

interface ScreenHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export function ScreenHeader({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
}: ScreenHeaderProps) {
  function handleBackPress() {
    if (onBackPress) {
      onBackPress();
      return;
    }

    router.back();
  }

  return (
    <View className="gap-3">
      <View className="flex-row items-start gap-3">
        {showBackButton ? <AppIconButton label="←" onPress={handleBackPress} /> : null}

        <View className="flex-1">
          <Text className="font-display-bold text-3xl text-ink">{title}</Text>

          {subtitle ? (
            <Text className="mt-2 text-base text-ink-muted">{subtitle}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
