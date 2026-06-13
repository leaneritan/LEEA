"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type ReferenceConfidence = "new" | "learning" | "known" | "needs-review";

export type ReferenceConfidenceRecord = {
  id: string;
  studentId: "leo";
  wordId: string;
  knows: boolean;
  confidence: ReferenceConfidence;
  sourceContext: string | null;
  markedKnownAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReferenceConfidenceMap = Record<string, ReferenceConfidenceRecord>;

export const referenceConfidenceStorageKey = "leea.referenceConfidence.v1";
const legacyKnownWordStorageKey = "leea.reference.knownWords.v1";
const defaultStudentId = "leo";

function createReferenceConfidenceRecord(wordId: string, knows: boolean, current?: ReferenceConfidenceRecord): ReferenceConfidenceRecord {
  const now = new Date().toISOString();

  return {
    id: current?.id ?? `reference-confidence-${defaultStudentId}-${wordId}`,
    studentId: defaultStudentId,
    wordId,
    knows,
    confidence: knows ? "known" : "learning",
    sourceContext: current?.sourceContext ?? null,
    markedKnownAt: knows ? current?.markedKnownAt ?? now : null,
    createdAt: current?.createdAt ?? now,
    updatedAt: now
  };
}

function normalizeReferenceConfidenceMap(value: unknown): ReferenceConfidenceMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.entries(value).reduce<ReferenceConfidenceMap>((next, [wordId, record]) => {
    if (!record || typeof record !== "object" || Array.isArray(record)) return next;
    const maybeRecord = record as Partial<ReferenceConfidenceRecord>;
    const resolvedWordId = typeof maybeRecord.wordId === "string" ? maybeRecord.wordId : wordId;
    const knows = Boolean(maybeRecord.knows || maybeRecord.confidence === "known");
    next[resolvedWordId] = {
      id: typeof maybeRecord.id === "string" ? maybeRecord.id : `reference-confidence-${defaultStudentId}-${resolvedWordId}`,
      studentId: maybeRecord.studentId === "leo" ? maybeRecord.studentId : defaultStudentId,
      wordId: resolvedWordId,
      knows,
      confidence: isReferenceConfidence(maybeRecord.confidence) ? maybeRecord.confidence : knows ? "known" : "learning",
      sourceContext: typeof maybeRecord.sourceContext === "string" ? maybeRecord.sourceContext : null,
      markedKnownAt: typeof maybeRecord.markedKnownAt === "string" ? maybeRecord.markedKnownAt : null,
      createdAt: typeof maybeRecord.createdAt === "string" ? maybeRecord.createdAt : new Date().toISOString(),
      updatedAt: typeof maybeRecord.updatedAt === "string" ? maybeRecord.updatedAt : new Date().toISOString()
    };
    return next;
  }, {});
}

function isReferenceConfidence(value: unknown): value is ReferenceConfidence {
  return value === "new" || value === "learning" || value === "known" || value === "needs-review";
}

function readReferenceConfidenceMap() {
  if (typeof window === "undefined") return {};

  try {
    const saved = window.localStorage.getItem(referenceConfidenceStorageKey);
    if (saved) return normalizeReferenceConfidenceMap(JSON.parse(saved));

    const legacySaved = window.localStorage.getItem(legacyKnownWordStorageKey);
    const legacyParsed = legacySaved ? JSON.parse(legacySaved) : [];
    if (!Array.isArray(legacyParsed)) return {};

    const migrated = legacyParsed
      .filter((id): id is string => typeof id === "string")
      .reduce<ReferenceConfidenceMap>((next, wordId) => {
        next[wordId] = createReferenceConfidenceRecord(wordId, true);
        return next;
      }, {});

    if (Object.keys(migrated).length) writeReferenceConfidenceMap(migrated);
    return migrated;
  } catch {
    return {};
  }
}

function writeReferenceConfidenceMap(records: ReferenceConfidenceMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(referenceConfidenceStorageKey, JSON.stringify(records));
}

export function useKnownWordIds() {
  const [confidenceRecords, setConfidenceRecords] = useState<ReferenceConfidenceMap>({});

  useEffect(() => {
    setConfidenceRecords(readReferenceConfidenceMap());

    const handleStorage = (event: StorageEvent) => {
      if (event.key === referenceConfidenceStorageKey || event.key === legacyKnownWordStorageKey) {
        setConfidenceRecords(readReferenceConfidenceMap());
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

  const setWordKnown = useCallback((wordId: string, known: boolean) => {
    setConfidenceRecords((current) => {
      const next = {
        ...current,
        [wordId]: createReferenceConfidenceRecord(wordId, known, current[wordId])
      };
      writeReferenceConfidenceMap(next);
      return next;
    });
  }, []);

  return { confidenceRecords, knownWordIds, knownWordSet, setWordKnown };
}
