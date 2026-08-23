"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  applyPracticeResult,
  createReferenceConfidenceRecord,
  getWeakWordIds,
  readReferenceConfidence,
  referenceConfidenceStorageKey,
  saveReferenceConfidence,
  saveReferenceConfidenceBatch,
  syncReferenceConfidenceWithCloud,
  type ReferenceConfidenceMap,
  type ReferenceConfidenceRecord
} from "@/data/referenceConfidence";

export type { ReferenceConfidence, ReferenceConfidenceMap, ReferenceConfidenceRecord } from "@/data/referenceConfidence";
export { referenceConfidenceStorageKey } from "@/data/referenceConfidence";

const legacyKnownWordStorageKey = "leea.reference.knownWords.v1";

/**
 * Leo's per-word memory. Reads and writes go through src/data/referenceConfidence.ts,
 * which is also what finally pushes these records to Supabase — for a long time
 * they only ever existed in one browser's localStorage.
 */
export function useKnownWordIds() {
  const [confidenceRecords, setConfidenceRecords] = useState<ReferenceConfidenceMap>({});

  useEffect(() => {
    const local = readReferenceConfidence();
    setConfidenceRecords(local);
    void syncReferenceConfidenceWithCloud(local).then(setConfidenceRecords);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === referenceConfidenceStorageKey || event.key === legacyKnownWordStorageKey) {
        setConfidenceRecords(readReferenceConfidence());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const knownWordIds = useMemo(
    () =>
      Object.values(confidenceRecords)
        .filter((record) => record.knows || record.confidence === "known")
        .map((record) => record.wordId),
    [confidenceRecords]
  );
  const knownWordSet = useMemo(() => new Set(knownWordIds), [knownWordIds]);
  const weakWordIds = useMemo(() => getWeakWordIds(confidenceRecords), [confidenceRecords]);

  const setWordKnown = useCallback((wordId: string, known: boolean) => {
    setConfidenceRecords((current) => {
      const record = createReferenceConfidenceRecord(wordId, known, current[wordId]);
      void saveReferenceConfidence(record);
      return { ...current, [wordId]: record };
    });
  }, []);

  /** Records a finished practice session in one write rather than one per answer. */
  const recordPracticeResults = useCallback((results: Array<{ wordId: string; correct: boolean }>) => {
    if (!results.length) return;

    setConfidenceRecords((current) => {
      const next = { ...current };
      const saved: ReferenceConfidenceRecord[] = [];

      for (const result of results) {
        const record = applyPracticeResult(result.wordId, result.correct, next[result.wordId]);
        next[result.wordId] = record;
        saved.push(record);
      }

      void saveReferenceConfidenceBatch(saved);
      return next;
    });
  }, []);

  return { confidenceRecords, knownWordIds, knownWordSet, weakWordIds, setWordKnown, recordPracticeResults };
}
