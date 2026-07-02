import { z } from 'zod';

const cardNetworkEnum = z.enum(['visa', 'mastercard', 'amex', 'other']);

function parsePositiveMoney(value: string) {
	const normalized = value.replace(/,/g, '').trim();

	if (!normalized) return value;

	const num = Number(normalized);

	if (Number.isNaN(num)) return value;

	return num;
}

function parseDayOfMonth(value: string) {
	const trimmed = value.trim();

	if (!trimmed) return value;

	const num = Number(trimmed);

	if (Number.isNaN(num)) return value;

	return num;
}

export const cardFormSchema = z.object({
	alias: z
		.string()
		.trim()
		.min(1, 'El alias de la tarjeta es obligatorio.')
		.max(50, 'El alias no debe exceder 50 caracteres.'),

	bank: z
		.string()
		.trim()
		.min(1, 'El banco es obligatorio.')
		.max(50, 'El nombre del banco no debe exceder 50 caracteres.'),

	creditLimit: z
		.string()
		.transform(parsePositiveMoney)
		.pipe(z.number().positive('La línea de crédito debe ser mayor a 0.')),

	cutoffDay: z
		.string()
		.transform(parseDayOfMonth)
		.pipe(
			z
				.number()
				.int('El día de corte debe ser un número entero.')
				.min(1, 'El día de corte debe estar entre 1 y 31.')
				.max(31, 'El día de corte debe estar entre 1 y 31.'),
		),

	paymentDueDay: z
		.string()
		.transform(parseDayOfMonth)
		.pipe(
			z
				.number()
				.int('El día de pago debe ser un número entero.')
				.min(1, 'El día de pago debe estar entre 1 y 31.')
				.max(31, 'El día de pago debe estar entre 1 y 31.'),
		),

	network: z
		.string()
		.trim()
		.optional()
		.transform(value => {
			if (!value) return null;
			return value;
		})
		.pipe(cardNetworkEnum.nullable()),

	color: z
		.string()
		.trim()
		.optional()
		.transform(value => {
			if (!value) return null;
			return value;
		}),
});

export type CardFormInput = z.input<typeof cardFormSchema>;
export type CardFormValues = z.output<typeof cardFormSchema>;
