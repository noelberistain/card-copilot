import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";

import { SqliteCardsPersistence } from "@/data/persistence/cards.persistence";
import type { Card } from "@/models/cards/card.types";

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardsPersistence = useMemo(() => new SqliteCardsPersistence(), []);

  const loadCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const activeCards = await cardsPersistence.findActive();

      setCards(activeCards);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las tarjetas.");
    } finally {
      setLoading(false);
    }
  }, [cardsPersistence]);

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [loadCards])
  );

  return {
    cards,
    loading,
    error,
    refresh: loadCards,
  };
}
