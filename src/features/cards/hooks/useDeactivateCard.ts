import { useCallback, useMemo, useState } from "react";

import { SqliteCardsPersistence } from "@/data/persistence/cards.persistence";

export function useDeactivateCard() {
  const [deactivating, setDeactivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardsPersistence = useMemo(() => new SqliteCardsPersistence(), []);

  const deactivate = useCallback(
    async (cardId: string): Promise<void> => {
      try {
        setDeactivating(true);
        setError(null);

        await cardsPersistence.deactivate(cardId);
      } catch (err) {
        console.error(err);
        setError("No se pudo desactivar la tarjeta.");
        throw err;
      } finally {
        setDeactivating(false);
      }
    },
    [cardsPersistence]
  );

  return {
    deactivate,
    deactivating,
    error,
  };
}
