import type { TextInputProps } from 'react-native';
import { Text, TextInput, View } from 'react-native';

interface AppTextInputProps extends TextInputProps {
	label: string;
	error?: string | null;
}

export function AppTextInput({
	label,
	error,
	className,
	...props
}: AppTextInputProps) {
	return (
		<View className='w-full gap-2'>
			<Text className='text-sm font-medium text-slate-700'>{label}</Text>

			<TextInput
				className={[
					'rounded-2xl border bg-white px-4 py-3 text-base text-slate-900',
					error ? 'border-red-500' : 'border-slate-300',
					className ?? '',
				].join(' ')}
				placeholderTextColor='#94a3b8'
				{...props}
			/>

			{error ? (
				<Text className='text-sm text-red-600'>{error}</Text>
			) : null}
		</View>
	);
}
