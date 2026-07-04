import { useCallback, useMemo, useState } from "react";

import { SqliteCardsPersistence } from "@/data/persistence/cards.persistence";
import { SqliteCardSnapshotsPersistence } from "@/data/persistence/cardSnapshots.persistence";
import type { PurchaseSimulationFormValues } from "@/features/simulator/schemas/purchaseSimulation.schema";
import {
  buildPurchaseSimulationResult,
  type PurchaseSimulationResult,
} from "@/features/simulator/services/buildPurchaseSimulationResult";

export function usePurchaseSimulation() {
  const [result, setResult] = useState<PurchaseSimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardsPersistence = useMemo(() => new SqliteCardsPersistence(), []);
  const snapshotsPersistence = useMemo(() => new SqliteCardSnapshotsPersistence(), []);

  const simulate = useCallback(
    async (values: PurchaseSimulationFormValues) => {
      try {
        setSimulating(true);
        setError(null);

        const activeCards = await cardsPersistence.findActive();

        const cardsWithSnapshots = await Promise.all(
          activeCards.map(async (card) => {
            const latestSnapshot = await snapshotsPersistence.findLatestByCardId(card.id);

            return {
              card,
              latestSnapshot,
            };
          })
        );

        const simulationResult = buildPurchaseSimulationResult({
          cards: cardsWithSnapshots,
          amount: values.amount,
          purchaseDate: values.purchaseDate,
        });

        setResult(simulationResult);

        return simulationResult;
      } catch (err) {
        console.error(err);
        setError("No se pudo ejecutar la simulación.");
        throw err;
      } finally {
        setSimulating(false);
      }
    },
    [cardsPersistence, snapshotsPersistence]
  );

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    simulating,
    error,
    simulate,
    clear,
  };
}
