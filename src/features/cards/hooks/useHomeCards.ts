import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";

import { SqliteCardsPersistence } from "@/data/persistence/cards.persistence";
import { SqliteCardSnapshotsPersistence } from "@/data/persistence/cardSnapshots.persistence";
import {
  buildHomeCardView,
  type HomeCardView,
} from "@/features/cards/services/buildHomeCardView";

export function useHomeCards() {
  const [cards, setCards] = useState<HomeCardView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardsPersistence = useMemo(() => new SqliteCardsPersistence(), []);
  const snapshotsPersistence = useMemo(
    () => new SqliteCardSnapshotsPersistence(),
    []
  );

  const loadCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const activeCards = await cardsPersistence.findActive();

      const homeCards = await Promise.all(
        activeCards.map(async (card) => {
          const latestSnapshot =
            await snapshotsPersistence.findLatestByCardId(card.id);

          return buildHomeCardView({
            card,
            latestSnapshot,
          });
        })
      );

      setCards(homeCards);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las tarjetas.");
    } finally {
      setLoading(false);
    }
  }, [cardsPersistence, snapshotsPersistence]);

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
