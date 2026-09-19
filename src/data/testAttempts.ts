import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { reportCloudSyncFailure, reportCloudSyncSuccess } from "@/lib/syncStatus";

// Every sitting of a test, kept as its own dated record.
//
// A test used to store one score, so retaking it overwrote what came before and
// a paper test had nowhere to live at all. An attempt is the unit instead: one
// per sitting, whether Leo took it in the app or on paper, so the same test can
// be sat in March and again in June and both survive.
//
// Local-first and synced, in the `test_attempts` table — the columns are the
// fields below in snake_case, with `questions` as jsonb. There is no unique
// constraint on (student_id, test_id) on purpose: the sitting is the unit, so
// the same test sat twice is two rows.
//
// The test app writes its own attempts directly (it is the only thing that
// knows what Leo answered); this module owns everything else — reading them
// back, syncing them, recording a paper test by hand, and turning the misses
// into practice.

/**
 * `pending` is an open response Neritan has not marked yet. It is recorded so
 * an attempt reflects the whole paper, but it is never a mistake — an unmarked
 * answer says nothing about whether he got it right. Marking it later rewrites
 * the attempt, and it becomes a mistake then if it deserves to be.
 */
export type AttemptQuestionState = "right" | "partial" | "wrong" | "pending";

/**
 * One question inside one sitting. Self-contained on purpose: the practice
 * drill rebuilds the question from this record alone, so a mistake outlives
 * the test it came from and a paper-entered one works the same way as an
 * app-marked one.
 */
export type TestAttemptQuestion = {
  /** The paper's own number — "24", or "1 · 3" for an item inside a question. */
  n: string;
  /** The section it sat in, e.g. "Rewrite". */
  part: string;
  state: AttemptQuestionState;
  got: number;
  max: number;
  /** What was asked. */
  question: string;
  /** What Leo wrote or picked. */
  given: string;
  /** What it should have been. */
  answer: string;
  /** Present when the question offered a choice, so the drill can offer it too. */
  options?: string[];
};

export type TestAttempt = {
  id: string;
  studentId: "leo";
  /** The learner lesson id, e.g. "ow-l4-t7-9-test-app". */
  testId: string;
  /** What the test was called when it was sat — paper tests have no lesson. */
  testTitle: string;
  /** How it was taken. A paper test is entered by hand and has no answers. */
  medium: "app" | "paper";
  /** The date of the sitting, which is what these are ordered and named by. */
  takenAt: string;
  score: number;
  total: number;
  percent: number;
  durationSec: number | null;
  /** Empty for a paper test whose questions were not itemised. */
  questions: TestAttemptQuestion[];
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type TestAttemptMap = Record<string, TestAttempt>;

type TestAttemptRow = {
  id: string;
  student_id: string;
  test_id: string;
  test_title: string;
  medium: "app" | "paper";
  taken_at: string;
  score: number;
  total: number;
  percent: number;
  duration_sec: number | null;
  questions: TestAttemptQuestion[] | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

function toRow(attempt: TestAttempt): TestAttemptRow {
  return {
    id: attempt.id,
    student_id: attempt.studentId,
    test_id: attempt.testId,
    test_title: attempt.testTitle,
    medium: attempt.medium,
    taken_at: attempt.takenAt,
    score: attempt.score,
    total: attempt.total,
    percent: attempt.percent,
    duration_sec: attempt.durationSec,
    questions: attempt.questions,
    note: attempt.note,
    created_at: attempt.createdAt,
    updated_at: attempt.updatedAt
  };
}

function fromRow(row: TestAttemptRow): TestAttempt {
  return {
    id: row.id,
    studentId: "leo",
    testId: row.test_id,
    testTitle: row.test_title,
    medium: row.medium,
    takenAt: row.taken_at,
    score: row.score,
    total: row.total,
    percent: row.percent,
    durationSec: row.duration_sec,
    questions: Array.isArray(row.questions) ? row.questions : [],
    note: row.note ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export const testAttemptsStorageKey = "leea.testAttempts.v1";

export function readTestAttempts(): TestAttemptMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(testAttemptsStorageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as TestAttemptMap;
  } catch {
    return {};
  }
}

export function writeTestAttempts(attempts: TestAttemptMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(testAttemptsStorageKey, JSON.stringify(attempts));
  } catch {
    /* storage full or blocked — the attempt stays in memory for this session */
  }
}

export function saveTestAttempt(attempt: TestAttempt) {
  const all = readTestAttempts();
  const saved = { ...attempt, updatedAt: new Date().toISOString() };
  all[attempt.id] = saved;
  writeTestAttempts(all);
  void pushTestAttempt(saved);
  return all;
}

export function deleteTestAttempt(id: string) {
  const all = readTestAttempts();
  delete all[id];
  writeTestAttempts(all);
  void removeTestAttempt(id);
  return all;
}

/* ── the cloud copy ───────────────────────────────────────────────────── */

/** One sitting up. Called on every write, so a result is never only local. */
export async function pushTestAttempt(attempt: TestAttempt) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from("test_attempts").upsert(toRow(attempt), { onConflict: "id" });
    if (error) throw error;
    reportCloudSyncSuccess("test-attempts");
  } catch (error) {
    console.warn("LEEA Supabase test attempt save failed", error);
    reportCloudSyncFailure("test-attempts", error);
  }
}

export async function removeTestAttempt(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from("test_attempts").delete().eq("id", id).eq("student_id", "leo");
    if (error) throw error;
    reportCloudSyncSuccess("test-attempts");
  } catch (error) {
    console.warn("LEEA Supabase test attempt delete failed", error);
    reportCloudSyncFailure("test-attempts", error);
  }
}

/**
 * Which attempts this browser has seen in the cloud, so a delete can be told
 * apart from something that has simply never been uploaded.
 *
 * Without it the two look identical from here — an attempt present locally and
 * absent from the table — and the sync below would push a deleted sitting
 * straight back up, from whichever device still had a copy. That is the reset
 * bug again: one device deletes, another resurrects. Ids only, and they cost
 * nothing to keep.
 */
const seenInCloudKey = "leea.testAttempts.synced.v1";

function readSeenInCloud(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(seenInCloudKey);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return new Set(Array.isArray(parsed) ? (parsed as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeSeenInCloud(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(seenInCloudKey, JSON.stringify([...ids]));
  } catch {
    /* storage full or blocked — the worst case is a delete that needs one more sync */
  }
}

/**
 * Both ways, by id, newest write wins.
 *
 * A sitting is a record of something that happened, so an attempt the cloud has
 * and this browser does not is pulled down. Leo sits a test on his device and
 * the parent sees the marked paper on the laptop — which is the whole reason
 * this table exists.
 *
 * A local attempt the cloud does *not* have is one of two things, and they are
 * handled differently: one this browser has never managed to upload goes up,
 * and one it has seen there before was deleted somewhere else, so it goes from
 * here too. There is no tombstone column to read, so that memory is the seen
 * set above.
 */
export async function syncTestAttemptsWithCloud(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || typeof window === "undefined") return false;
  try {
    const { data, error } = await supabase
      .from("test_attempts")
      .select("*")
      .eq("student_id", "leo");
    if (error) throw error;
    reportCloudSyncSuccess("test-attempts");

    const local = readTestAttempts();
    const merged: TestAttemptMap = { ...local };
    const toPush: TestAttempt[] = [];
    const seen = readSeenInCloud();

    const rows = (data ?? []) as TestAttemptRow[];
    for (const row of rows) {
      const remote = fromRow(row);
      const mine = merged[remote.id];
      if (!mine || mine.updatedAt < remote.updatedAt) merged[remote.id] = remote;
      else if (mine.updatedAt > remote.updatedAt) toPush.push(mine);
    }

    const remoteIds = new Set(rows.map((row) => row.id));
    for (const attempt of Object.values(local)) {
      if (remoteIds.has(attempt.id)) continue;
      if (seen.has(attempt.id)) delete merged[attempt.id];
      else toPush.push(attempt);
    }

    const changed = JSON.stringify(merged) !== JSON.stringify(local);
    if (changed) writeTestAttempts(merged);
    if (toPush.length) {
      const { error: pushError } = await supabase
        .from("test_attempts")
        .upsert(toPush.map(toRow), { onConflict: "id" });
      if (pushError) throw pushError;
    }
    // Everything that is in the table right now — what was already there, and
    // what this pass just put there — is a delete worth honouring next time.
    writeSeenInCloud(new Set([...remoteIds, ...toPush.map((attempt) => attempt.id)]));
    return changed || toPush.length > 0;
  } catch (error) {
    console.warn("LEEA Supabase test attempts sync failed", error);
    reportCloudSyncFailure("test-attempts", error);
    return false;
  }
}

/** Newest first — the order these are read in. */
export function sortAttempts(attempts: TestAttempt[]) {
  return [...attempts].sort((a, b) => (a.takenAt < b.takenAt ? 1 : a.takenAt > b.takenAt ? -1 : 0));
}

export function attemptsForTest(testId: string, all: TestAttemptMap) {
  return sortAttempts(Object.values(all).filter((attempt) => attempt.testId === testId));
}

export function allAttempts(all: TestAttemptMap) {
  return sortAttempts(Object.values(all));
}

export function latestAttempt(testId: string, all: TestAttemptMap): TestAttempt | null {
  return attemptsForTest(testId, all)[0] ?? null;
}

export function createPaperAttempt(input: {
  testId: string;
  testTitle: string;
  takenAt: string;
  score: number;
  total: number;
  note?: string;
  questions?: TestAttemptQuestion[];
}): TestAttempt {
  const now = new Date().toISOString();
  return {
    id: `paper-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    studentId: "leo",
    testId: input.testId,
    testTitle: input.testTitle,
    medium: "paper",
    takenAt: input.takenAt,
    score: input.score,
    total: input.total,
    percent: input.total > 0 ? Math.round((input.score / input.total) * 100) : 0,
    durationSec: null,
    questions: input.questions ?? [],
    note: input.note ?? "",
    createdAt: now,
    updatedAt: now
  };
}

/* ── mistakes ─────────────────────────────────────────────────────────── */

/**
 * One thing Leo has got wrong, gathered across every sitting it appears in.
 *
 * Keyed by test + question number rather than by attempt, so sitting the same
 * test twice and missing question 24 both times is one item he keeps missing
 * — which is the thing worth practising — not two unrelated mistakes.
 */
export type MistakeItem = {
  key: string;
  testId: string;
  testTitle: string;
  n: string;
  part: string;
  question: string;
  answer: string;
  options?: string[];
  /** How many sittings asked it, and how many he got right. */
  asked: number;
  correct: number;
  /** Whether the most recent sitting was wrong — a fresh miss outranks old accuracy. */
  lastWrong: boolean;
  /** What he wrote the last time he got it wrong. */
  lastGiven: string;
  lastSeenAt: string;
};

function mistakeKey(testId: string, n: string) {
  return `${testId}::${n}`;
}

/**
 * Every question Leo has ever got wrong, with how it has gone since.
 *
 * A question he later got right still appears, because "he fixed it" is worth
 * seeing — `correct` vs `asked` says which. Callers that want only the live
 * problems filter on `lastWrong`.
 */
export function collectMistakes(all: TestAttemptMap): MistakeItem[] {
  const byKey = new Map<string, MistakeItem>();
  // Oldest first, so the last write for a key is genuinely the most recent.
  const ordered = sortAttempts(Object.values(all)).reverse();

  for (const attempt of ordered) {
    for (const q of attempt.questions) {
      if (q.state === "pending") continue;   // unmarked, so it says nothing yet
      const key = mistakeKey(attempt.testId, q.n);
      const wrong = q.state !== "right";
      const existing = byKey.get(key);
      if (existing) {
        existing.asked += 1;
        if (!wrong) existing.correct += 1;
        existing.lastWrong = wrong;
        existing.lastSeenAt = attempt.takenAt;
        if (wrong) existing.lastGiven = q.given;
        // A later sitting is the better copy of the wording and the key.
        existing.question = q.question;
        existing.answer = q.answer;
        if (q.options) existing.options = q.options;
      } else {
        byKey.set(key, {
          key,
          testId: attempt.testId,
          testTitle: attempt.testTitle,
          n: q.n,
          part: q.part,
          question: q.question,
          answer: q.answer,
          options: q.options,
          asked: 1,
          correct: wrong ? 0 : 1,
          lastWrong: wrong,
          lastGiven: wrong ? q.given : "",
          lastSeenAt: attempt.takenAt
        });
      }
    }
  }

  // Only things he has actually got wrong at some point are mistakes.
  return [...byKey.values()].filter((item) => item.correct < item.asked);
}

/**
 * How badly a mistake wants practising. Same idea as Reference's
 * `practiceWeight` and Geography's `pickQuiz`: a fresh miss outranks an old
 * one, and something missed repeatedly outranks something missed once.
 */
export function mistakeWeight(item: MistakeItem) {
  const missRate = (item.asked - item.correct) / Math.max(1, item.asked);
  return (item.lastWrong ? 4 : 1) + missRate * 2;
}

/** Weighted draw without replacement, heaviest bias toward the freshest misses. */
export function pickMistakes(items: MistakeItem[], count: number) {
  const pool = [...items];
  const picked: MistakeItem[] = [];
  while (pool.length > 0 && picked.length < count) {
    const total = pool.reduce((sum, item) => sum + mistakeWeight(item), 0);
    let roll = Math.random() * total;
    let index = pool.length - 1;
    for (let i = 0; i < pool.length; i += 1) {
      roll -= mistakeWeight(pool[i]);
      if (roll <= 0) {
        index = i;
        break;
      }
    }
    picked.push(pool[index]);
    pool.splice(index, 1);
  }
  return picked;
}

/* ── practice history ─────────────────────────────────────────────────── */

export type MistakePractice = { key: string; asked: number; correct: number; lastCorrect: boolean; updatedAt: string };
export type MistakePracticeMap = Record<string, MistakePractice>;

export const mistakePracticeStorageKey = "leea.testMistakePractice.v1";

export function readMistakePractice(): MistakePracticeMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(mistakePracticeStorageKey);
    return raw ? (JSON.parse(raw) as MistakePracticeMap) : {};
  } catch {
    return {};
  }
}

/**
 * Records one drill answer. Practice is kept apart from the attempts
 * themselves: getting a question right in practice is not the same as getting
 * it right in a test, and it must never quietly rewrite what he scored.
 */
export function recordMistakePractice(key: string, correct: boolean) {
  const all = readMistakePractice();
  const prev = all[key];
  all[key] = {
    key,
    asked: (prev?.asked ?? 0) + 1,
    correct: (prev?.correct ?? 0) + (correct ? 1 : 0),
    lastCorrect: correct,
    updatedAt: new Date().toISOString()
  };
  try {
    window.localStorage.setItem(mistakePracticeStorageKey, JSON.stringify(all));
  } catch {
    /* ignore */
  }
  return all;
}
