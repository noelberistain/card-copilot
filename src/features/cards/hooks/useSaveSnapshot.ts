import { useCallback, useMemo, useState } from "react";

import { SqliteCardSnapshotsPersistence } from "@/data/persistence/cardSnapshots.persistence";
import { nowIso } from "@/lib/date/nowIso";
import { createId } from "@/lib/ids/createId";
import type { SnapshotFormValues } from "@/features/cards/schemas/snapshotForm.schema";
import type { CardSnapshot } from "@/models/cards/card.types";

interface UseSaveSnapshotOptions {
  cardId: string;
  initialSnapshot?: CardSnapshot;
}

export function useSaveSnapshot({ cardId, initialSnapshot }: UseSaveSnapshotOptions) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistence = useMemo(() => new SqliteCardSnapshotsPersistence(), []);

  const save = useCallback(
    async (values: SnapshotFormValues): Promise<CardSnapshot> => {
      try {
        setSaving(true);
        setError(null);

        const timestamp = nowIso();

        const snapshot: CardSnapshot = initialSnapshot
          ? {
              ...initialSnapshot,

              statementStatus: values.statementStatus,

              currentBalance: values.currentBalance,
              statementBalance: values.statementBalance,
              minimumPayment: values.minimumPayment,
              paymentToAvoidInterest: values.paymentToAvoidInterest,
              reportedAvailableCredit: values.reportedAvailableCredit,

              lastCutoffDate: values.lastCutoffDate,
              nextCutoffDate: values.nextCutoffDate,
              paymentDueDate: values.paymentDueDate,

              notes: values.notes,

              updatedAt: timestamp,
            }
          : {
              id: createId(),
              cardId,
              capturedAt: timestamp,

              statementStatus: values.statementStatus,

              currentBalance: values.currentBalance,
              statementBalance: values.statementBalance,
              minimumPayment: values.minimumPayment,
              paymentToAvoidInterest: values.paymentToAvoidInterest,
              reportedAvailableCredit: values.reportedAvailableCredit,

              lastCutoffDate: values.lastCutoffDate,
              nextCutoffDate: values.nextCutoffDate,
              paymentDueDate: values.paymentDueDate,

              notes: values.notes,

              createdAt: timestamp,
              updatedAt: timestamp,
            };

        if (initialSnapshot) {
          await persistence.update(snapshot);
        } else {
          await persistence.create(snapshot);
        }

        return snapshot;
      } catch (err) {
        console.error(err);
        setError("No se pudo guardar el estado de la tarjeta.");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [cardId, initialSnapshot, persistence]
  );

  return {
    save,
    saving,
    error,
  };
}
