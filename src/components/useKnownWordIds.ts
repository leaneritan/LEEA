"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export const knownWordStorageKey = "leea.reference.knownWords.v1";

function readKnownWordIds() {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(knownWordStorageKey);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeKnownWordIds(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(knownWordStorageKey, JSON.stringify(ids));
}

export function useKnownWordIds() {
  const [knownWordIds, setKnownWordIds] = useState<string[]>([]);

  useEffect(() => {
    setKnownWordIds(readKnownWordIds());

    const handleStorage = (event: StorageEvent) => {
      if (event.key === knownWordStorageKey) setKnownWordIds(readKnownWordIds());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const knownWordSet = useMemo(() => new Set(knownWordIds), [knownWordIds]);

  const setWordKnown = useCallback((wordId: string, known: boolean) => {
    setKnownWordIds((current) => {
      const nextSet = new Set(current);
      if (known) nextSet.add(wordId);
      else nextSet.delete(wordId);
      const next = Array.from(nextSet);
      writeKnownWordIds(next);
      return next;
    });
  }, []);

  return { knownWordIds, knownWordSet, setWordKnown };
}
