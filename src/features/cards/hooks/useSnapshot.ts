import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { SqliteCardSnapshotsPersistence } from "@/data/persistence/cardSnapshots.persistence";
import type { CardSnapshot } from "@/models/cards/card.types";

interface UseSnapshotOptions {
  snapshotId?: string;
}

export function useSnapshot({ snapshotId }: UseSnapshotOptions) {
  const [snapshot, setSnapshot] = useState<CardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const persistence = useMemo(() => new SqliteCardSnapshotsPersistence(), []);

  const loadSnapshot = useCallback(async () => {
    if (!snapshotId) {
      setSnapshot(null);
      setLoading(false);
      setError("No se encontró el identificador del snapshot.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const foundSnapshot = await persistence.findById(snapshotId);

      if (!foundSnapshot) {
        setSnapshot(null);
        setError("No se encontró el estado capturado.");
        return;
      }

      setSnapshot(foundSnapshot);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el estado capturado.");
    } finally {
      setLoading(false);
    }
  }, [snapshotId, persistence]);

  useFocusEffect(
    useCallback(() => {
      loadSnapshot();
    }, [loadSnapshot])
  );

  return {
    snapshot,
    loading,
    error,
    refresh: loadSnapshot,
  };
}
