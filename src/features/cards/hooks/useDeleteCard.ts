import { useCallback, useMemo, useState } from "react";

import { SqliteCardsPersistence } from "@/data/persistence/cards.persistence";

export function useDeleteCard() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardsPersistence = useMemo(() => new SqliteCardsPersistence(), []);

  const deleteCard = useCallback(
    async (cardId: string): Promise<void> => {
      try {
        setDeleting(true);
        setError(null);

        await cardsPersistence.remove(cardId);
      } catch (err) {
        console.error(err);
        setError("No se pudo eliminar la tarjeta.");
        throw err;
      } finally {
        setDeleting(false);
      }
    },
    [cardsPersistence]
  );

  return {
    deleteCard,
    deleting,
    error,
  };
}
