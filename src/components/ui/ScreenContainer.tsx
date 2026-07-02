import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenContainerProps {
	children: ReactNode;
	scroll?: boolean;
}

export function ScreenContainer({
	children,
	scroll = true,
}: ScreenContainerProps) {
	if (scroll) {
		return (
			<SafeAreaView className='flex-1 bg-slate-100'>
				<ScrollView
					className='flex-1'
					contentContainerClassName='px-5 py-6'
					keyboardShouldPersistTaps='handled'>
					{children}
				</ScrollView>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className='flex-1 bg-slate-100'>
			<View className='flex-1 px-5 py-6'>{children}</View>
		</SafeAreaView>
	);
}
