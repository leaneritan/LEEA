import type { Lesson } from "./types";

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
  const done = Boolean(loadLocalValue(`${storagePrefix}done`, false) || scoreData?.done || homeworkDone);
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

export function loadLocalValue<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : (JSON.parse(value) as T);
  } catch {
    return fallback;
  }
}
