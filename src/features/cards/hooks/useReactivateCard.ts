import { SqliteCardsPersistence } from "@/data/persistence/cards.persistence";

import { useCallback, useMemo, useState } from "react";

export function useReactivateCard() {
  const [reactivating, setReactivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardsPersistence = useMemo(() => new SqliteCardsPersistence(), []);

  const reactivate = useCallback(
    async (cardId: string): Promise<void> => {
      try {
        setReactivating(true);
        setError(null);

        await cardsPersistence.reactivate(cardId);
      } catch (err) {
        console.error(err);
        setError("No se pudo reactivar la tarjeta.");
        throw err;
      } finally {
        setReactivating(false);
      }
    },
    [cardsPersistence]
  );

  return {
    reactivate,
    reactivating,
    error,
  };
}
