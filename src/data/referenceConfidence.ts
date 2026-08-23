import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { reportCloudSyncFailure, reportCloudSyncSuccess } from "@/lib/syncStatus";

// Leo's per-word memory: whether he says he knows a word, plus how he has
// actually done when asked. Local-first and Supabase-shaped like the other
// data modules.
//
// The `reference_confidence` table shipped in the very first schema and then
// sat empty for months: `useKnownWordIds` wrote to localStorage and nothing
// ever pushed those records to the cloud. This module is the writer that was
// missing, so every "I Know" survives a new device.

export type ReferenceConfidence = "new" | "learning" | "known" | "needs-review";

export type ReferenceConfidenceRecord = {
  id: string;
  studentId: "leo";
  wordId: string;
  knows: boolean;
  confidence: ReferenceConfidence;
  sourceContext: string | null;
  markedKnownAt: string | null;
  /** How many times this word has come up in practice. */
  asked: number;
  /** How many of those he got right. */
  correct: number;
  /** Whether the most recent answer was right — a fresh miss outranks old accuracy. */
  lastCorrect: boolean | null;
  lastPracticedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReferenceConfidenceMap = Record<string, ReferenceConfidenceRecord>;

export const referenceConfidenceStorageKey = "leea.referenceConfidence.v1";
const legacyKnownWordStorageKey = "leea.reference.knownWords.v1";
const defaultStudentId = "leo";

type ReferenceConfidenceRow = {
  id: string;
  student_id: "leo";
  word_id: string;
  knows: boolean;
  confidence: ReferenceConfidence;
  source_context: string | null;
  marked_known_at: string | null;
  asked: number | null;
  correct: number | null;
  last_correct: boolean | null;
  last_practiced_at: string | null;
  created_at: string;
  updated_at: string;
};

export function createReferenceConfidenceRecord(
  wordId: string,
  knows: boolean,
  current?: ReferenceConfidenceRecord
): ReferenceConfidenceRecord {
  const now = new Date().toISOString();

  return {
    id: current?.id ?? `reference-confidence-${defaultStudentId}-${wordId}`,
    studentId: defaultStudentId,
    wordId,
    knows,
    confidence: knows ? "known" : "learning",
    sourceContext: current?.sourceContext ?? null,
    markedKnownAt: knows ? current?.markedKnownAt ?? now : null,
    asked: current?.asked ?? 0,
    correct: current?.correct ?? 0,
    lastCorrect: current?.lastCorrect ?? null,
    lastPracticedAt: current?.lastPracticedAt ?? null,
    createdAt: current?.createdAt ?? now,
    updatedAt: now
  };
}

/**
 * Folds one practice answer into a word's record. Counts accumulate, and a
 * wrong answer drops a word out of "known" — if he just missed it, the tab
 * that claims he knows it is lying.
 */
export function applyPracticeResult(
  wordId: string,
  correct: boolean,
  current?: ReferenceConfidenceRecord
): ReferenceConfidenceRecord {
  const now = new Date().toISOString();
  const base = current ?? createReferenceConfidenceRecord(wordId, false);

  return {
    ...base,
    knows: correct ? base.knows : false,
    confidence: correct ? base.confidence : "needs-review",
    asked: base.asked + 1,
    correct: base.correct + (correct ? 1 : 0),
    lastCorrect: correct,
    lastPracticedAt: now,
    updatedAt: now
  };
}

/**
 * How much a word deserves to come up in practice. Identical ranking to the
 * Geography maps' picker in public/components/geo-progress.js — that one lives
 * in a plain script for the iframe maps and cannot import this.
 */
export function practiceWeight(record: ReferenceConfidenceRecord | undefined): number {
  if (!record || !record.asked) return record?.knows ? 1 : 3;
  if (record.lastCorrect === false) return 6;
  const accuracy = record.correct / record.asked;
  if (accuracy >= 0.8) return 1;
  if (accuracy >= 0.5) return 2;
  return 4;
}

/** Weighted sample without replacement, so a session is varied but leans on the misses. */
export function pickPracticeWords(
  wordIds: string[],
  count: number,
  records: ReferenceConfidenceMap
): string[] {
  const pool = wordIds.slice();
  const chosen: string[] = [];
  const wanted = Math.min(count, pool.length);

  while (chosen.length < wanted && pool.length) {
    const weights = pool.map((wordId) => practiceWeight(records[wordId]));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let roll = Math.random() * total;
    let index = 0;
    for (let i = 0; i < pool.length; i++) {
      roll -= weights[i];
      index = i;
      if (roll <= 0) break;
    }
    chosen.push(pool[index]);
    pool.splice(index, 1);
  }

  return chosen;
}

/** Words Leo has been asked and is not reliably getting right. */
export function getWeakWordIds(records: ReferenceConfidenceMap): string[] {
  return Object.values(records)
    .filter((record) => record.asked > 0 && (record.lastCorrect === false || record.correct / record.asked < 0.5))
    .sort((a, b) => (b.lastPracticedAt ?? "").localeCompare(a.lastPracticedAt ?? ""))
    .map((record) => record.wordId);
}

export function normalizeReferenceConfidenceMap(value: unknown): ReferenceConfidenceMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.entries(value).reduce<ReferenceConfidenceMap>((next, [wordId, record]) => {
    if (!record || typeof record !== "object" || Array.isArray(record)) return next;
    const maybeRecord = record as Partial<ReferenceConfidenceRecord>;
    const resolvedWordId = typeof maybeRecord.wordId === "string" ? maybeRecord.wordId : wordId;
    const knows = Boolean(maybeRecord.knows || maybeRecord.confidence === "known");

    next[resolvedWordId] = {
      id:
        typeof maybeRecord.id === "string"
          ? maybeRecord.id
          : `reference-confidence-${defaultStudentId}-${resolvedWordId}`,
      studentId: maybeRecord.studentId === "leo" ? maybeRecord.studentId : defaultStudentId,
      wordId: resolvedWordId,
      knows,
      confidence: isReferenceConfidence(maybeRecord.confidence)
        ? maybeRecord.confidence
        : knows
          ? "known"
          : "learning",
      sourceContext: typeof maybeRecord.sourceContext === "string" ? maybeRecord.sourceContext : null,
      markedKnownAt: typeof maybeRecord.markedKnownAt === "string" ? maybeRecord.markedKnownAt : null,
      // Records written before practice existed carry no counts.
      asked: typeof maybeRecord.asked === "number" ? maybeRecord.asked : 0,
      correct: typeof maybeRecord.correct === "number" ? maybeRecord.correct : 0,
      lastCorrect: typeof maybeRecord.lastCorrect === "boolean" ? maybeRecord.lastCorrect : null,
      lastPracticedAt: typeof maybeRecord.lastPracticedAt === "string" ? maybeRecord.lastPracticedAt : null,
      createdAt: typeof maybeRecord.createdAt === "string" ? maybeRecord.createdAt : new Date().toISOString(),
      updatedAt: typeof maybeRecord.updatedAt === "string" ? maybeRecord.updatedAt : new Date().toISOString()
    };
    return next;
  }, {});
}

function isReferenceConfidence(value: unknown): value is ReferenceConfidence {
  return value === "new" || value === "learning" || value === "known" || value === "needs-review";
}

export function readReferenceConfidence(): ReferenceConfidenceMap {
  if (typeof window === "undefined") return {};

  try {
    const saved = window.localStorage.getItem(referenceConfidenceStorageKey);
    if (saved) return normalizeReferenceConfidenceMap(JSON.parse(saved));

    // Migration-only: the original shape was a bare array of known word IDs.
    const legacySaved = window.localStorage.getItem(legacyKnownWordStorageKey);
    const legacyParsed = legacySaved ? JSON.parse(legacySaved) : [];
    if (!Array.isArray(legacyParsed)) return {};

    const migrated = legacyParsed
      .filter((id): id is string => typeof id === "string")
      .reduce<ReferenceConfidenceMap>((next, wordId) => {
        next[wordId] = createReferenceConfidenceRecord(wordId, true);
        return next;
      }, {});

    if (Object.keys(migrated).length) writeReferenceConfidence(migrated);
    return migrated;
  } catch {
    return {};
  }
}

export function writeReferenceConfidence(records: ReferenceConfidenceMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(referenceConfidenceStorageKey, JSON.stringify(records));
}

export async function syncReferenceConfidenceWithCloud(
  current: ReferenceConfidenceMap
): Promise<ReferenceConfidenceMap> {
  if (!isSupabaseConfigured || !supabase || typeof window === "undefined") return current;

  try {
    const { data, error } = await supabase
      .from("reference_confidence")
      .select(
        "id, student_id, word_id, knows, confidence, source_context, marked_known_at, asked, correct, last_correct, last_practiced_at, created_at, updated_at"
      )
      .eq("student_id", defaultStudentId);

    if (error) throw error;
    reportCloudSyncSuccess("reference");

    const cloud = ((data ?? []) as ReferenceConfidenceRow[]).reduce<ReferenceConfidenceMap>((next, row) => {
      next[row.word_id] = fromReferenceConfidenceRow(row);
      return next;
    }, {});

    const merged = { ...current };
    const toPush: ReferenceConfidenceRecord[] = [];

    for (const [wordId, localRecord] of Object.entries(current)) {
      const cloudRecord = cloud[wordId];
      if (!cloudRecord || isNewer(localRecord.updatedAt, cloudRecord.updatedAt)) toPush.push(localRecord);
    }

    for (const [wordId, cloudRecord] of Object.entries(cloud)) {
      const localRecord = current[wordId];
      if (!localRecord || isNewer(cloudRecord.updatedAt, localRecord.updatedAt)) merged[wordId] = cloudRecord;
    }

    if (toPush.length) await upsertReferenceConfidence(toPush);

    writeReferenceConfidence(merged);
    return merged;
  } catch (error) {
    console.warn("LEEA Supabase reference confidence sync failed", error);
    reportCloudSyncFailure("reference", error);
    return current;
  }
}

export async function saveReferenceConfidence(record: ReferenceConfidenceRecord) {
  writeReferenceConfidence({ ...readReferenceConfidence(), [record.wordId]: record });
  await upsertReferenceConfidence([record]);
}

/** Saves a whole practice session in one round trip rather than one per answer. */
export async function saveReferenceConfidenceBatch(records: ReferenceConfidenceRecord[]) {
  if (!records.length) return;
  const next = { ...readReferenceConfidence() };
  for (const record of records) next[record.wordId] = record;
  writeReferenceConfidence(next);
  await upsertReferenceConfidence(records);
}

async function upsertReferenceConfidence(records: ReferenceConfidenceRecord[]) {
  if (!isSupabaseConfigured || !supabase || records.length === 0) return;

  try {
    const { error } = await supabase
      .from("reference_confidence")
      .upsert(records.map(toReferenceConfidenceRow), { onConflict: "student_id,word_id" });

    if (error) throw error;
    reportCloudSyncSuccess("reference");
  } catch (error) {
    console.warn("LEEA Supabase reference confidence save failed", error);
    reportCloudSyncFailure("reference", error);
  }
}

function fromReferenceConfidenceRow(row: ReferenceConfidenceRow): ReferenceConfidenceRecord {
  return {
    id: row.id,
    studentId: defaultStudentId,
    wordId: row.word_id,
    knows: row.knows,
    confidence: row.confidence,
    sourceContext: row.source_context,
    markedKnownAt: row.marked_known_at,
    asked: row.asked ?? 0,
    correct: row.correct ?? 0,
    lastCorrect: row.last_correct,
    lastPracticedAt: row.last_practiced_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toReferenceConfidenceRow(record: ReferenceConfidenceRecord): Omit<ReferenceConfidenceRow, "created_at"> {
  return {
    id: record.id,
    student_id: record.studentId,
    word_id: record.wordId,
    knows: record.knows,
    confidence: record.confidence,
    source_context: record.sourceContext,
    marked_known_at: record.markedKnownAt,
    asked: record.asked,
    correct: record.correct,
    last_correct: record.lastCorrect,
    last_practiced_at: record.lastPracticedAt,
    updated_at: record.updatedAt
  };
}

function isNewer(first: string, second: string) {
  const firstTime = Date.parse(first);
  const secondTime = Date.parse(second);
  if (Number.isNaN(firstTime)) return false;
  if (Number.isNaN(secondTime)) return true;
  return firstTime > secondTime;
}
