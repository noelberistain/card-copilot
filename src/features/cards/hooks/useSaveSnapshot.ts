import { useCallback, useMemo, useState } from "react";

import { SqliteCardSnapshotsPersistence } from "@/data/persistence/cardSnapshots.persistence";
import type { CardSnapshot } from "@/models/cards/card.types";
import type { SnapshotFormValues } from "@/features/cards/schemas/snapshotForm.schema";
import { createId } from "@/lib/ids/createId";
import { nowIso } from "@/lib/date/nowIso";

interface UseSaveSnapshotOptions {
  cardId: string;
}

export function useSaveSnapshot({ cardId }: UseSaveSnapshotOptions) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistence = useMemo(() => new SqliteCardSnapshotsPersistence(), []);

  const save = useCallback(
    async (values: SnapshotFormValues): Promise<CardSnapshot> => {
      try {
        setSaving(true);
        setError(null);

        const timestamp = nowIso();

        const snapshot: CardSnapshot = {
          id: createId(),
          cardId,
          capturedAt: timestamp,

          currentBalance: values.currentBalance,
          statementBalance: values.statementBalance,
          minimumPayment: values.minimumPayment,
          paymentToAvoidInterest: values.paymentToAvoidInterest,

          lastCutoffDate: values.lastCutoffDate,
          paymentDueDate: values.paymentDueDate,

          notes: values.notes,

          createdAt: timestamp,
          updatedAt: timestamp,
        };

        await persistence.create(snapshot);

        return snapshot;
      } catch (err) {
        console.error(err);
        setError("No se pudo guardar el estado de la tarjeta.");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [cardId, persistence]
  );

  return {
    save,
    saving,
    error,
  };
}
