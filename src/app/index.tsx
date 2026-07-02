import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-950 px-6">
      <Text className="text-3xl font-bold text-white">Card Copilot</Text>
      <Text className="mt-3 text-center text-base text-slate-300">
        Sprint 1: Gestión de tarjetas
      </Text>
    </View>
  );
}
