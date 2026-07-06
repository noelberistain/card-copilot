import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";

import { SqliteCardsPersistence } from "@/data/persistence/cards.persistence";
import type { Card } from "@/models/cards/card.types";

export function useInactiveCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardsPersistence = useMemo(() => new SqliteCardsPersistence(), []);

  const loadCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const inactiveCards = await cardsPersistence.findInactive();

      setCards(inactiveCards);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las tarjetas inactivas.");
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
