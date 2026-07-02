import { useCallback, useMemo, useState } from 'react';

import { SqliteCardsPersistence } from '@/data/persistence/cards.persistence';
import type { CardFormValues } from '@/features/cards/schemas/cardForm.schema';
import { nowIso } from '@/lib/date/nowIso';
import { createId } from '@/lib/ids/createId';
import type { Card } from '@/models/cards/card.types';

interface UseSaveCardOptions {
	initialCard?: Card;
}

export function useSaveCard(options?: UseSaveCardOptions) {
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const cardsPersistence = useMemo(() => new SqliteCardsPersistence(), []);

	const save = useCallback(
		async (values: CardFormValues): Promise<Card> => {
			try {
				setSaving(true);
				setError(null);

				const timestamp = nowIso();

				const card: Card = options?.initialCard
					? {
							...options.initialCard,
							alias: values.alias,
							bank: values.bank,
							creditLimit: values.creditLimit,
							cutoffDay: values.cutoffDay,
							paymentDueDay: values.paymentDueDay,
							network: values.network,
							color: values.color,
							updatedAt: timestamp,
						}
					: {
							id: createId(),
							alias: values.alias,
							bank: values.bank,
							creditLimit: values.creditLimit,
							cutoffDay: values.cutoffDay,
							paymentDueDay: values.paymentDueDay,
							network: values.network,
							color: values.color,
							isActive: true,
							createdAt: timestamp,
							updatedAt: timestamp,
						};

				if (options?.initialCard) {
					await cardsPersistence.update(card);
				} else {
					await cardsPersistence.create(card);
				}

				return card;
			} catch (err) {
				console.error(err);
				setError('No se pudo guardar la tarjeta.');
				throw err;
			} finally {
				setSaving(false);
			}
		},
		[cardsPersistence, options?.initialCard],
	);

	return {
		save,
		saving,
		error,
	};
}
