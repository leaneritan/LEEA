import type { Lesson } from "./types";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { reportCloudSyncFailure, reportCloudSyncSuccess } from "@/lib/syncStatus";
import { markAssignmentCompleted } from "./assignments";
import { teacherLessons } from "./lessons";
import { createLessonProgressRecord, saveLessonProgressRecord } from "./lessonProgress";

export type LearnerAppProgress = {
  completedModules: number;
  moduleCount: number;
  modules: Array<{
    id: string;
    label: string;
    done: boolean;
  }>;
  score: number | null;
  done: boolean;
  caption: string;
};

export type LearnerProgressStorageRow = {
  storage_key: string;
  value: unknown;
};

type LearnerProgressCloudRow = {
  homework_id: string;
  lesson_id?: string | null;
  completed_modules?: number | null;
  updated_at?: string | null;
  completed_at?: string | null;
  raw_progress: Record<string, unknown> | null;
};

export type AssessmentResult = {
  score: number;
  total: number;
  percent: number;
  done: boolean;
  /** Open responses still waiting on Neritan's marking. */
  pending: number;
  timeTakenSec: number | null;
};

/**
 * A test's marks as marks, not as a percent — /tests shows "66 / 80", and how
 * many answers are still waiting on Neritan. Reads the same record
 * `getLearnerAppProgress` does, through the same keys the lesson JSON declares.
 */
export function getAssessmentResult(source: Lesson["source"]): AssessmentResult | null {
  const storagePrefix = source.storagePrefix ?? "";
  if (typeof window === "undefined" || !storagePrefix) return null;
  const record = loadLocalValue<{
    score?: number; total?: number; pct?: number; percent?: number;
    done?: boolean; pending?: number; timeTakenSec?: number;
  } | null>(`${storagePrefix}${source.scoreKey ?? "score"}`, null);
  if (!record || typeof record.score !== "number" || typeof record.total !== "number") return null;
  const percent = typeof record.percent === "number"
    ? record.percent
    : typeof record.pct === "number"
      ? record.pct
      : record.total > 0 ? Math.round((record.score / record.total) * 100) : 0;
  return {
    score: record.score,
    total: record.total,
    percent,
    done: Boolean(record.done),
    pending: typeof record.pending === "number" ? record.pending : 0,
    timeTakenSec: typeof record.timeTakenSec === "number" ? record.timeTakenSec : null
  };
}

export function getLearnerAppProgress(source: Lesson["source"]): LearnerAppProgress {
  const moduleCount = source.moduleCount ?? 0;
  const storagePrefix = source.storagePrefix ?? "";

  if (typeof window === "undefined" || !storagePrefix || !moduleCount) {
    return { completedModules: 0, moduleCount: moduleCount || 1, modules: [], score: null, done: false, caption: "" };
  }

  const keyFormat = source.moduleKeyFormat ?? "m{n}-done";
  const explicitKeys = source.moduleKeys;
  const modules = Array.from({ length: moduleCount }, (_, index) => {
    const doneKey = explicitKeys?.[index]
      ?? keyFormat.replace("{n}", String(index + 1)).replace("{i}", String(index));
    // Apps may store either a raw boolean or a {done, timestamp} object — both are truthy when complete.
    return {
      id: `m${index + 1}`,
      label: source.moduleLabels?.[index] ?? `Module ${index + 1}`,
      done: Boolean(loadLocalValue<unknown>(`${storagePrefix}${doneKey}`, null))
    };
  });
  const completedModules = modules.filter((module) => module.done).length;
  const scoreKeyPath = source.scoreKey ?? "score";
  const scoreData = loadLocalValue<{ score?: number; total?: number; percent?: number; done?: boolean } | null>(
    `${storagePrefix}${scoreKeyPath}`,
    null
  );
  const homeworkDone = source.homeworkId ? loadLocalValue(`leea-${source.homeworkId}-done`, false) : false;
  // A finished quiz used to count as a finished lesson, through scoreData.done.
  // But that flag is the quiz saying the quiz is over, not the app saying the
  // work is: Unit 9 Reading has eleven modules and its Student Book quiz is the
  // sixth, so passing it marked the whole lesson complete with the entire
  // Workbook half untouched — and auto-ticked the teacher's Reading lesson on
  // the way past. Completion is now only what the app itself declares (its
  // all-modules key, or the homework flag) or every module actually being done.
  const everyModuleDone = moduleCount > 0 && completedModules === moduleCount;
  const done = Boolean(loadLocalValue(`${storagePrefix}done`, false) || homeworkDone || everyModuleDone);
  const caption = source.captionKey ? loadLocalValue(`${storagePrefix}${source.captionKey}`, "") : "";

  // Score is displayed as a percent. Apps may store it as `percent` (canonical)
  // or as `score` (raw correct count) with `total`. Prefer percent; fall back to
  // computing it; fall back to treating raw score as percent for legacy apps.
  let scorePercent: number | null = null;
  if (typeof scoreData?.percent === "number") {
    scorePercent = scoreData.percent;
  } else if (typeof scoreData?.score === "number" && typeof scoreData?.total === "number" && scoreData.total > 0) {
    scorePercent = Math.round((scoreData.score / scoreData.total) * 100);
  } else if (typeof scoreData?.score === "number") {
    scorePercent = scoreData.score;
  }

  return {
    completedModules,
    moduleCount,
    modules,
    score: scorePercent,
    done,
    caption
  };
}

/* ── one sitting, everywhere it lives ───────────────────────────────────── */

/**
 * Every localStorage key one sitting of a learner app owns.
 *
 * There are two homes, and the second is easy to miss: the app's own keys all
 * start with its `storagePrefix`, but the homework flags sit OUTSIDE it, in two
 * spellings. The app writes `<homeworkId>-done`; the cloud bridge in
 * LessonPage mirrors every write through `normalizeLearnerStorageKey`, so it
 * also lands as `leea-<homeworkId>-done` — and that is the one
 * `getLearnerAppProgress` reads as "this homework is finished".
 *
 * The test app's own retake only knew about the prefix, so a reset left the
 * done flag standing and the app still read as finished afterwards. That only
 * happened with Supabase configured, because the mirrored spelling is written
 * by `saveLearnerProgressValue`, which returns early when it is not.
 */
export function sittingStorageKeys(source: Lesson["source"]): string[] {
  if (typeof window === "undefined") return [];
  const keys: string[] = [];
  const prefix = source.storagePrefix;
  if (prefix) {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key && key.startsWith(prefix)) keys.push(key);
    }
  }
  const homeworkId = source.homeworkId;
  if (homeworkId) {
    keys.push(`${homeworkId}-done`, `${homeworkId}-score`, `leea-${homeworkId}-done`, `leea-${homeworkId}-score`);
  }
  return keys;
}

export function wipeSittingLocally(source: Lesson["source"]) {
  if (typeof window === "undefined") return;
  for (const key of sittingStorageKeys(source)) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}

/**
 * A clear is an intent, and intent has to beat volume.
 *
 * `syncLearnerProgressWithCloud` pushes local state up whenever this browser
 * has more of it than the cloud — right for progress, wrong for a reset. Clear
 * a sitting on one device and the device Leo actually sat it on still holds
 * every answer, so its next visit uploads the lot and every device hydrates it
 * back. The clear is therefore recorded IN the row as a timestamp, and each
 * device wipes its own copy the first time it sees a marker it has not applied.
 *
 * It lives inside `raw_progress` rather than in a column of its own because
 * golden rule 11a: a schema change is not done until it is applied, and this
 * session cannot reach Supabase to apply one.
 */
const CLEAR_MARKER_KEY = "leea-__sitting-cleared-at";
const APPLIED_CLEARS_KEY = "leea.clearedSittings.v1";

function readAppliedClears(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(APPLIED_CLEARS_KEY) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

function rememberAppliedClear(homeworkId: string, marker: string) {
  if (typeof window === "undefined") return;
  const applied = readAppliedClears();
  applied[homeworkId] = marker;
  try {
    window.localStorage.setItem(APPLIED_CLEARS_KEY, JSON.stringify(applied));
  } catch {
    /* ignore */
  }
}

/**
 * Wipes this device's copy if the cloud says the sitting was cleared elsewhere.
 *
 * It also bumps the write generation, which is the half that makes a clear hold
 * across tabs and devices. The generation counter alone only silences writes
 * queued in the same page — the tab Leo actually sat the test in has its own
 * queue and its own counter, and goes on pushing answer after answer into a row
 * that was cleared on the laptop. Seeing an unapplied marker is how that tab
 * learns the sitting is gone: it drops what it was about to send.
 */
function applyClearedSitting(lesson: Lesson, rawProgress: Record<string, unknown> | null | undefined): boolean {
  const homeworkId = lesson.source.homeworkId;
  const marker = rawProgress?.[CLEAR_MARKER_KEY];
  if (!homeworkId || typeof marker !== "string") return false;
  if (readAppliedClears()[homeworkId] === marker) return false;
  wipeSittingLocally(lesson.source);
  rememberAppliedClear(homeworkId, marker);
  cloudGenerations.set(homeworkId, (cloudGenerations.get(homeworkId) ?? 0) + 1);
  return true;
}

export async function fetchLearnerProgressRows(homeworkId: string | undefined): Promise<LearnerProgressStorageRow[]> {
  if (!homeworkId || !isSupabaseConfigured || !supabase) return [];

  try {
    const { data, error } = await supabase
      .from("learner_progress")
      .select("raw_progress")
      .eq("homework_id", homeworkId)
      .eq("student_id", "leo")
      .maybeSingle();

    if (error) throw error;
    reportCloudSyncSuccess("learner-progress");

    return Object.entries((data?.raw_progress ?? {}) as Record<string, unknown>)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([storage_key, value]) => ({ storage_key, value }));
  } catch (error) {
    console.warn("LEEA Supabase learner progress read failed", error);
    reportCloudSyncFailure("learner-progress", error);
    return [];
  }
}

/* Returns { [learnerLessonId]: completedAtISOString } for every lesson that
   has actually finished, sourced from Supabase's learner_progress.completed_at
   — the only reliable "when did Leo finish this" signal that exists. Local
   done-flags carry no timestamp, which is what let the teacher dashboard's
   "Leo finished X" callout show a stale lesson (picked by array order)
   instead of whichever one he most recently completed. */
export async function fetchLearnerCompletionTimestamps(lessons: Lesson[]): Promise<Record<string, string>> {
  const homeworkIds = lessons.map((lesson) => lesson.source.homeworkId).filter((id): id is string => Boolean(id));
  if (!homeworkIds.length || !isSupabaseConfigured || !supabase) return {};

  try {
    const { data, error } = await supabase
      .from("learner_progress")
      .select("lesson_id, homework_id, completed_at")
      .eq("student_id", "leo")
      .eq("done", true)
      .in("homework_id", homeworkIds);

    if (error) throw error;
    reportCloudSyncSuccess("learner-progress");

    const byLessonId: Record<string, string> = {};
    for (const row of (data ?? []) as LearnerProgressCloudRow[]) {
      if (row.lesson_id && row.completed_at) byLessonId[row.lesson_id] = row.completed_at;
    }
    return byLessonId;
  } catch (error) {
    console.warn("LEEA Supabase learner completion timestamp fetch failed", error);
    reportCloudSyncFailure("learner-progress", error);
    return {};
  }
}

export async function hydrateLearnerProgressFromCloud(lessons: Lesson[]): Promise<boolean> {
  const homeworkIds = lessons.map((lesson) => lesson.source.homeworkId).filter((id): id is string => Boolean(id));
  if (!homeworkIds.length || !isSupabaseConfigured || !supabase || typeof window === "undefined") return false;

  try {
    const { data, error } = await supabase
      .from("learner_progress")
      .select("homework_id, raw_progress")
      .eq("student_id", "leo")
      .in("homework_id", homeworkIds);

    if (error) throw error;
    reportCloudSyncSuccess("learner-progress");

    const byHomeworkId = new Map(lessons.map((lesson) => [lesson.source.homeworkId, lesson]));
    for (const row of (data ?? []) as LearnerProgressCloudRow[]) {
      const lesson = byHomeworkId.get(row.homework_id);
      // A sitting cleared on another device is cleared here too, once.
      if (lesson) applyClearedSitting(lesson, row.raw_progress);
      for (const [storageKey, value] of Object.entries(row.raw_progress ?? {})) {
        if (storageKey === CLEAR_MARKER_KEY) continue;      // bookkeeping, not progress
        if (value === null || value === undefined) {
          window.localStorage.removeItem(storageKey);
        } else {
          window.localStorage.setItem(storageKey, JSON.stringify(value));
        }
      }
    }

    return Boolean(data?.length);
  } catch (error) {
    console.warn("LEEA Supabase learner progress hydrate failed", error);
    reportCloudSyncFailure("learner-progress", error);
    return false;
  }
}

export async function syncLearnerProgressWithCloud(lessons: Lesson[]): Promise<boolean> {
  const homeworkIds = lessons.map((lesson) => lesson.source.homeworkId).filter((id): id is string => Boolean(id));
  if (!homeworkIds.length || !isSupabaseConfigured || !supabase || typeof window === "undefined") return false;

  try {
    const { data, error } = await supabase
      .from("learner_progress")
      .select("homework_id, completed_modules, updated_at, raw_progress")
      .eq("student_id", "leo")
      .in("homework_id", homeworkIds);

    if (error) throw error;
    reportCloudSyncSuccess("learner-progress");

    const cloudByHomeworkId = new Map(
      ((data ?? []) as LearnerProgressCloudRow[]).map((row) => [row.homework_id, row])
    );
    let changed = false;

    for (const lesson of lessons) {
      if (!lesson.source.homeworkId) continue;
      const cloudRow = cloudByHomeworkId.get(lesson.source.homeworkId);
      // Take the clear first, so what follows sees an already-empty sitting
      // rather than uploading the copy this browser still happens to hold.
      if (applyClearedSitting(lesson, cloudRow?.raw_progress)) {
        changed = true;
        continue;
      }
      const localRawProgress = collectLocalProgress(lesson);
      if (!Object.keys(localRawProgress).length) continue;

      const localProgress = getLearnerAppProgress(lesson.source);
      // Closing the assignment normally rides along with a save, so a lesson
      // that was already finished before that existed — or finished in a
      // browser whose writes never reached the cloud — would stay open for
      // good. Reconcile it here; the call is a no-op unless it is still open.
      if (localProgress.done) await markAssignmentCompleted(lesson.id);
      const cloudProgress = cloudRow;
      const cloudRawCount = Object.keys(cloudProgress?.raw_progress ?? {}).length;
      const shouldPushLocal =
        !cloudProgress
        || localProgress.completedModules > (cloudProgress.completed_modules ?? 0)
        || (
          localProgress.completedModules === (cloudProgress.completed_modules ?? 0)
          && Object.keys(localRawProgress).length > cloudRawCount
        );

      if (shouldPushLocal) {
        await queueCloudWrite(lesson.source.homeworkId, () =>
          mutateCloudProgress(lesson, (raw) => {
            for (const [key, value] of Object.entries(localRawProgress)) raw[key] = value;
          }, true)
        );
        changed = true;
      }
    }

    const hydrated = await hydrateLearnerProgressFromCloud(lessons);
    return changed || hydrated;
  } catch (error) {
    console.warn("LEEA Supabase learner progress sync failed", error);
    reportCloudSyncFailure("learner-progress", error);
    return false;
  }
}

/**
 * Cloud writes for one homework, run one at a time.
 *
 * Every write is a read-modify-write of the whole `raw_progress` object, so two
 * of them in flight at once both read the same starting state and the second
 * one puts back what the first removed. That never mattered while an app saved
 * one answer at a time — but clearing a page of a test drops a dozen keys in a
 * loop and a retake drops thirty, and most of those deletions were being undone
 * by their own siblings. The cloud kept the answers, the next visit to any page
 * that syncs hydrated them back into localStorage, and the cleared work
 * reappeared with the old clock still on it.
 *
 * Chaining per homework id keeps each read seeing the previous write's result.
 */
const cloudWriteQueues = new Map<string, Promise<void>>();

/**
 * A clear supersedes everything queued before it.
 *
 * Every answer Leo types is mirrored to the cloud as its own read-modify-write,
 * so one sitting of a test is well over a thousand of them. Tapping "Take the
 * test again" lands the clear at the BACK of that queue — behind hundreds of
 * writes that each carry an old value and put their key back. The sitting kept
 * reappearing for as long as the queue took to drain, which over a real network
 * is a long time, and that is what "the reset does not work" looked like.
 *
 * Bumping a generation makes those stale writes no-ops: they describe a sitting
 * that no longer exists, so there is nothing to send.
 */
const cloudGenerations = new Map<string, number>();

function queueCloudWrite(homeworkId: string, run: () => Promise<void>, supersedes = false) {
  if (supersedes) cloudGenerations.set(homeworkId, (cloudGenerations.get(homeworkId) ?? 0) + 1);
  const generation = cloudGenerations.get(homeworkId) ?? 0;
  const task = async () => {
    if ((cloudGenerations.get(homeworkId) ?? 0) !== generation) return;
    await run();
  };
  const queued = (cloudWriteQueues.get(homeworkId) ?? Promise.resolve())
    .then(task, task)
    .catch(() => {});
  cloudWriteQueues.set(homeworkId, queued);
  return queued;
}

/**
 * Applies one change to the stored `raw_progress` and writes it back.
 *
 * `guardCleared` makes the write stand down when the row says the sitting was
 * cleared and this browser has not caught up yet — otherwise the tab that holds
 * the old answers quietly puts them back one by one.
 */
async function mutateCloudProgress(
  lesson: Lesson,
  apply: (raw: Record<string, unknown>) => void,
  guardCleared = false
) {
  if (!lesson.source.homeworkId || !supabase) return;
  try {
    const { data, error } = await supabase
      .from("learner_progress")
      .select("raw_progress")
      .eq("homework_id", lesson.source.homeworkId)
      .eq("student_id", "leo")
      .maybeSingle();

    if (error) throw error;

    if (guardCleared && applyClearedSitting(lesson, data?.raw_progress as Record<string, unknown> | null)) return;

    const rawProgress = { ...((data?.raw_progress ?? {}) as Record<string, unknown>) };
    apply(rawProgress);
    await upsertLearnerProgressSummary(lesson, rawProgress);
  } catch (error) {
    console.warn("LEEA Supabase learner progress save failed", error);
    reportCloudSyncFailure("learner-progress", error);
  }
}

/**
 * Writes waiting to be sent, coalesced per homework.
 *
 * Every keystroke in a test used to be its own read-modify-write of the whole
 * row: one sitting of the Unit 9 quiz made over 1,500 round trips. The parent's
 * view then ran minutes behind Leo's, and — worse — a reset landed at the back
 * of that queue, which is most of why it never seemed to take. Collecting the
 * changes and sending them together makes it tens of writes instead.
 */
type PendingWrite = { lesson: Lesson; values: Map<string, unknown>; timer: ReturnType<typeof setTimeout> | null };
const pendingWrites = new Map<string, PendingWrite>();
const FLUSH_AFTER_MS = 400;

function flushPending(homeworkId: string) {
  const pending = pendingWrites.get(homeworkId);
  if (!pending) return Promise.resolve();
  pendingWrites.delete(homeworkId);
  if (pending.timer) clearTimeout(pending.timer);
  return queueCloudWrite(homeworkId, () =>
    mutateCloudProgress(
      pending.lesson,
      (raw) => {
        for (const [storageKey, value] of pending.values) {
          if (value === null || value === undefined) delete raw[storageKey];
          else raw[storageKey] = value;
        }
      },
      true
    )
  );
}

/** Nothing in flight may be lost because the tab went away. */
if (typeof window !== "undefined") {
  const flushAll = () => {
    for (const homeworkId of [...pendingWrites.keys()]) void flushPending(homeworkId);
  };
  window.addEventListener("pagehide", flushAll);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) flushAll();
  });
}

export async function saveLearnerProgressValue(lesson: Lesson, key: string, value: unknown) {
  if (!lesson.source.homeworkId || !isSupabaseConfigured || !supabase || typeof window === "undefined") return;

  const storageKey = normalizeLearnerStorageKey(key);
  if (value === null || value === undefined) {
    window.localStorage.removeItem(storageKey);
  } else {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }

  const homeworkId = lesson.source.homeworkId;
  const pending = pendingWrites.get(homeworkId) ?? { lesson, values: new Map(), timer: null };
  pending.values.set(storageKey, value);
  if (pending.timer) clearTimeout(pending.timer);
  pending.timer = setTimeout(() => void flushPending(homeworkId), FLUSH_AFTER_MS);
  pendingWrites.set(homeworkId, pending);
}

/**
 * Removes many keys in one write.
 *
 * What a clear or a retake actually is: one decision, not twelve. Sending it as
 * one read-modify-write also means it cannot half-apply, so a cleared page is
 * cleared in the cloud too and does not come back on the next sync.
 */
export async function clearLearnerProgressValues(lesson: Lesson, keys: string[]) {
  if (!lesson.source.homeworkId || typeof window === "undefined") return;

  const storageKeys = keys.map(normalizeLearnerStorageKey);
  for (const storageKey of storageKeys) window.localStorage.removeItem(storageKey);
  if (!isSupabaseConfigured || !supabase) return;
  await flushPending(lesson.source.homeworkId);   // send what is buffered, then delete

  await queueCloudWrite(lesson.source.homeworkId, () =>
    mutateCloudProgress(
      lesson,
      (raw) => {
        for (const storageKey of storageKeys) delete raw[storageKey];
      },
      true
    )
  );
}

/**
 * Wipes everything stored for one homework, locally and in the cloud.
 *
 * `/tests` clearing a sitting runs in the app, not inside the learner app's
 * frame, so nothing was telling the cloud about it — the row stayed whole and
 * the next page that synced hydrated the whole sitting back. Clearing both ends
 * is what makes "clear the sitting" mean it.
 */
export async function clearLearnerProgressCloud(lesson: Lesson) {
  const homeworkId = lesson.source.homeworkId;
  if (!homeworkId) return;
  const marker = new Date().toISOString();
  // This device has just done the clearing, so it has already applied it.
  rememberAppliedClear(homeworkId, marker);
  // Anything still waiting to be sent describes a sitting that no longer exists.
  const waiting = pendingWrites.get(homeworkId);
  if (waiting?.timer) clearTimeout(waiting.timer);
  pendingWrites.delete(homeworkId);
  if (!isSupabaseConfigured || !supabase) return;
  await queueCloudWrite(
    homeworkId,
    () =>
      mutateCloudProgress(lesson, (raw) => {
        for (const storageKey of Object.keys(raw)) delete raw[storageKey];
        raw[CLEAR_MARKER_KEY] = marker;
      }),
    true                                  // everything queued before this is moot
  );
}

async function upsertLearnerProgressSummary(lesson: Lesson, rawProgress: Record<string, unknown>) {
  if (!lesson.source.homeworkId || !supabase) return;

  const progress = getLearnerAppProgress(lesson.source);
  const scoreKey = lesson.source.scoreKey ?? "score";
  const scoreData = lesson.source.storagePrefix
    ? loadLocalValue<unknown>(`${lesson.source.storagePrefix}${scoreKey}`, null)
    : null;
  const now = new Date().toISOString();

  const { error } = await supabase.from("learner_progress").upsert(
    {
      id: `learner-progress-leo-${lesson.source.homeworkId}`,
      homework_id: lesson.source.homeworkId,
      lesson_id: lesson.id,
      student_id: "leo",
      storage_prefix: lesson.source.storagePrefix ?? null,
      module_count: progress.moduleCount,
      completed_modules: progress.completedModules,
      modules: progress.modules,
      score_percent: progress.score,
      score: scoreData,
      caption: progress.caption || null,
      done: progress.done,
      raw_progress: rawProgress,
      completed_at: progress.done ? now : null
    },
    { onConflict: "homework_id,student_id" }
  );

  if (error) throw error;
  reportCloudSyncSuccess("learner-progress");

  if (progress.done) {
    await markTeacherLessonDone(lesson);
    await markAssignmentCompleted(lesson.id);
  }
}

/* When Leo finishes a learner app, the matching teacher-side lesson (same
   course/level/unit, component with "-app" stripped) should auto-tick as
   done too — the teacher checklist is a separate table and previously
   required a manual click even after Leo had already completed his app. */
async function markTeacherLessonDone(learnerLesson: Lesson) {
  const teacherComponent = learnerLesson.component.endsWith("-app")
    ? learnerLesson.component.slice(0, -"-app".length)
    : learnerLesson.component;

  const teacherLesson = teacherLessons.find(
    (candidate) =>
      candidate.course === learnerLesson.course
      && candidate.level === learnerLesson.level
      && candidate.unit === learnerLesson.unit
      && candidate.component === teacherComponent
  );
  if (!teacherLesson) return;

  await saveLessonProgressRecord(createLessonProgressRecord(teacherLesson.id, true));
}

export function loadLocalValue<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : (JSON.parse(value) as T);
  } catch {
    return fallback;
  }
}

function normalizeLearnerStorageKey(key: string) {
  return key.startsWith("leea-") ? key : `leea-${key}`;
}

function collectLocalProgress(lesson: Lesson) {
  const rawProgress: Record<string, unknown> = {};
  const storagePrefix = lesson.source.storagePrefix;
  if (!storagePrefix || typeof window === "undefined") return rawProgress;

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key) continue;
    if (key.startsWith(storagePrefix) || key === `leea-${lesson.source.homeworkId}-done`) {
      rawProgress[key] = loadLocalValue<unknown>(key, null);
    }
  }

  return rawProgress;
}
