import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";

import { SqliteCardsPersistence } from "@/data/persistence/cards.persistence";
import { SqliteCardSnapshotsPersistence } from "@/data/persistence/cardSnapshots.persistence";
import {
  buildCardDetailView,
  type CardDetailView,
} from "@/features/cards/services/buildCardDetailView";

interface UseCardDetailOptions {
  cardId?: string;
}

export function useCardDetail({ cardId }: UseCardDetailOptions) {
  const [detail, setDetail] = useState<CardDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardsPersistence = useMemo(() => new SqliteCardsPersistence(), []);
  const snapshotsPersistence = useMemo(
    () => new SqliteCardSnapshotsPersistence(),
    []
  );

  const loadDetail = useCallback(async () => {
    if (!cardId) {
      setDetail(null);
      setLoading(false);
      setError("No se encontró el identificador de la tarjeta.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const card = await cardsPersistence.findById(cardId);

      if (!card) {
        setDetail(null);
        setError("No se encontró la tarjeta.");
        return;
      }

      const latestSnapshot =
        await snapshotsPersistence.findLatestByCardId(cardId);

      const cardDetail = buildCardDetailView({
        card,
        latestSnapshot,
      });

      setDetail(cardDetail);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el detalle de la tarjeta.");
    } finally {
      setLoading(false);
    }
  }, [cardId, cardsPersistence, snapshotsPersistence]);

  useFocusEffect(
    useCallback(() => {
      loadDetail();
    }, [loadDetail])
  );

  return {
    detail,
    loading,
    error,
    refresh: loadDetail,
  };
}
