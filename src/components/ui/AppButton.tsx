import { Pressable, Text } from 'react-native';

type AppButtonVariant = 'primary' | 'secondary' | 'danger';

interface AppButtonProps {
	title: string;
	onPress: () => void;
	disabled?: boolean;
	variant?: AppButtonVariant;
}

const variantClasses: Record<AppButtonVariant, string> = {
	primary: 'bg-blue-600',
	secondary: 'bg-slate-700',
	danger: 'bg-red-600',
};

export function AppButton({
	title,
	onPress,
	disabled = false,
	variant = 'primary',
}: AppButtonProps) {
	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			className={[
				'w-full rounded-2xl px-4 py-4',
				disabled ? 'bg-slate-400' : variantClasses[variant],
			].join(' ')}>
			<Text className='text-center text-base font-semibold text-white'>
				{title}
			</Text>
		</Pressable>
	);
}
