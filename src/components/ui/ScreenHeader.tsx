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
          <Text className="text-3xl font-bold text-slate-950">{title}</Text>

          {subtitle ? (
            <Text className="mt-2 text-base text-slate-500">{subtitle}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
