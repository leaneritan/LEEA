"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  // A mirror of the records, so a save can read the current ones without doing
  // its work inside a state updater. Practice now saves on every answer rather
  // than once per session, and a updater React is free to call more than once is
  // the wrong place to be firing writes from.
  const recordsRef = useRef<ReferenceConfidenceMap>({});
  const applyRecords = useCallback((records: ReferenceConfidenceMap) => {
    recordsRef.current = records;
    setConfidenceRecords(records);
  }, []);

  useEffect(() => {
    const local = readReferenceConfidence();
    applyRecords(local);
    void syncReferenceConfidenceWithCloud(local).then(applyRecords);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === referenceConfidenceStorageKey || event.key === legacyKnownWordStorageKey) {
        applyRecords(readReferenceConfidence());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [applyRecords]);

  const knownWordIds = useMemo(
    () =>
      Object.values(confidenceRecords)
        .filter((record) => record.knows || record.confidence === "known")
        .map((record) => record.wordId),
    [confidenceRecords]
  );
  const knownWordSet = useMemo(() => new Set(knownWordIds), [knownWordIds]);
  const weakWordIds = useMemo(() => getWeakWordIds(confidenceRecords), [confidenceRecords]);

  const setWordKnown = useCallback(
    (wordId: string, known: boolean) => {
      const record = createReferenceConfidenceRecord(wordId, known, recordsRef.current[wordId]);
      applyRecords({ ...recordsRef.current, [wordId]: record });
      void saveReferenceConfidence(record);
    },
    [applyRecords]
  );

  /** Records practice answers — one per answer as they are given, so an abandoned round still counts. */
  const recordPracticeResults = useCallback(
    (results: Array<{ wordId: string; correct: boolean }>) => {
      if (!results.length) return;

      const next = { ...recordsRef.current };
      const saved: ReferenceConfidenceRecord[] = [];

      for (const result of results) {
        const record = applyPracticeResult(result.wordId, result.correct, next[result.wordId]);
        next[result.wordId] = record;
        saved.push(record);
      }

      applyRecords(next);
      void saveReferenceConfidenceBatch(saved);
    },
    [applyRecords]
  );

  return { confidenceRecords, knownWordIds, knownWordSet, weakWordIds, setWordKnown, recordPracticeResults };
}
