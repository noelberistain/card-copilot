import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { SqliteCardSnapshotsPersistence } from "@/data/persistence/cardSnapshots.persistence";
import type { CardSnapshot } from "@/models/cards/card.types";

interface UseLatestSnapshotOptions {
  cardId?: string;
}

export function useLatestSnapshot({ cardId }: UseLatestSnapshotOptions) {
  const [snapshot, setSnapshot] = useState<CardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const persistence = useMemo(() => new SqliteCardSnapshotsPersistence(), []);

  const loadLatestSnapshot = useCallback(async () => {
    if (!cardId) {
      setSnapshot(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const latestSnapshot = await persistence.findLatestByCardId(cardId);

      setSnapshot(latestSnapshot);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el último estado.");
    } finally {
      setLoading(false);
    }
  }, [cardId, persistence]);

  useFocusEffect(
    useCallback(() => {
      loadLatestSnapshot();
    }, [loadLatestSnapshot])
  );

  return {
    snapshot,
    loading,
    error,
    refresh: loadLatestSnapshot,
  };
}
