import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Text, View } from 'react-native';

import { AppButton, AppTextInput, ScreenContainer } from '@/components/ui';
import { useSaveCard } from '@/features/cards/hooks/useSaveCard';
import {
	cardFormSchema,
	type CardFormInput,
	type CardFormValues,
} from '@/features/cards/schemas/cardForm.schema';

export default function NewCardScreen() {
	const { save, saving, error } = useSaveCard();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<CardFormInput, unknown, CardFormValues>({
		resolver: zodResolver(cardFormSchema),
		defaultValues: {
			alias: '',
			bank: '',
			creditLimit: '',
			cutoffDay: '',
			paymentDueDay: '',
			network: '',
			color: '',
		},
	});

	async function onSubmit(values: CardFormValues) {
		try {
			await save(values);

			Alert.alert(
				'Tarjeta guardada',
				'La tarjeta se guardó correctamente.',
				[
					{
						text: 'OK',
						onPress: () => router.back(),
					},
				],
			);
		} catch {
			// El hook ya registra el error en estado.
		}
	}

	return (
		<ScreenContainer>
			<View className='gap-6'>
				<View>
					<Text className='text-3xl font-bold text-slate-950'>
						Agregar tarjeta
					</Text>

					<Text className='mt-2 text-base text-slate-500'>
						Captura la información base de tu tarjeta para empezar a
						darle seguimiento.
					</Text>
				</View>

				<View className='gap-4'>
					<Controller
						control={control}
						name='alias'
						render={({ field: { value, onChange, onBlur } }) => (
							<AppTextInput
								label='Alias'
								placeholder='Ej. BBVA Azul'
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								error={errors.alias?.message}
								autoCapitalize='words'
							/>
						)}
					/>

					<Controller
						control={control}
						name='bank'
						render={({ field: { value, onChange, onBlur } }) => (
							<AppTextInput
								label='Banco'
								placeholder='Ej. BBVA'
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								error={errors.bank?.message}
								autoCapitalize='words'
							/>
						)}
					/>

					<Controller
						control={control}
						name='creditLimit'
						render={({ field: { value, onChange, onBlur } }) => (
							<AppTextInput
								label='Línea de crédito'
								placeholder='Ej. 25000'
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								error={errors.creditLimit?.message}
								keyboardType='decimal-pad'
							/>
						)}
					/>

					<Controller
						control={control}
						name='cutoffDay'
						render={({ field: { value, onChange, onBlur } }) => (
							<AppTextInput
								label='Día de corte'
								placeholder='Ej. 20'
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								error={errors.cutoffDay?.message}
								keyboardType='number-pad'
							/>
						)}
					/>

					<Controller
						control={control}
						name='paymentDueDay'
						render={({ field: { value, onChange, onBlur } }) => (
							<AppTextInput
								label='Día de pago'
								placeholder='Ej. 10'
								value={value}
								onChangeText={onChange}
								onBlur={onBlur}
								error={errors.paymentDueDay?.message}
								keyboardType='number-pad'
							/>
						)}
					/>

					<Controller
						control={control}
						name='network'
						render={({ field: { value, onChange, onBlur } }) => (
							<AppTextInput
								label='Red de tarjeta'
								placeholder='visa, mastercard, amex u other'
								value={value ?? ''}
								onChangeText={onChange}
								onBlur={onBlur}
								error={errors.network?.message}
								autoCapitalize='none'
							/>
						)}
					/>

					<Controller
						control={control}
						name='color'
						render={({ field: { value, onChange, onBlur } }) => (
							<AppTextInput
								label='Color'
								placeholder='Ej. #2563eb'
								value={value ?? ''}
								onChangeText={onChange}
								onBlur={onBlur}
								error={errors.color?.message}
								autoCapitalize='none'
							/>
						)}
					/>
				</View>

				{error ? (
					<Text className='text-sm font-medium text-red-600'>
						{error}
					</Text>
				) : null}

				<AppButton
					title={saving ? 'Guardando...' : 'Guardar tarjeta'}
					onPress={handleSubmit(onSubmit)}
					disabled={saving}
				/>

				<AppButton
					title='Cancelar'
					variant='secondary'
					onPress={() => router.back()}
					disabled={saving}
				/>
			</View>
		</ScreenContainer>
	);
}
