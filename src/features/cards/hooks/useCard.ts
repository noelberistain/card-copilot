import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { SqliteCardsPersistence } from "@/data/persistence/cards.persistence";
import type { Card } from "@/models/cards/card.types";

interface UseCardOptions {
  cardId?: string;
}

export function useCard({ cardId }: UseCardOptions) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardsPersistence = useMemo(() => new SqliteCardsPersistence(), []);

  const loadCard = useCallback(async () => {
    if (!cardId) {
      setCard(null);
      setLoading(false);
      setError("No se encontró el identificador de la tarjeta.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const foundCard = await cardsPersistence.findById(cardId);

      if (!foundCard) {
        setCard(null);
        setError("No se encontró la tarjeta.");
        return;
      }

      setCard(foundCard);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la tarjeta.");
    } finally {
      setLoading(false);
    }
  }, [cardId, cardsPersistence]);

  useFocusEffect(
    useCallback(() => {
      loadCard();
    }, [loadCard])
  );

  return {
    card,
    loading,
    error,
    refresh: loadCard,
  };
}
