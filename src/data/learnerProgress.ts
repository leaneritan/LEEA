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
  const modules = Array.from({ length: moduleCount }, (_, index) => {
    const doneKey = keyFormat.replace("{n}", String(index + 1)).replace("{i}", String(index));
    return {
      id: `m${index + 1}`,
      label: source.moduleLabels?.[index] ?? `Module ${index + 1}`,
      done: loadLocalValue(`${storagePrefix}${doneKey}`, false)
    };
  });
  const completedModules = modules.filter((module) => module.done).length;
  const scoreData = loadLocalValue<{ score?: number; done?: boolean } | null>(`${storagePrefix}score`, null);
  const homeworkDone = source.homeworkId ? loadLocalValue(`leea-${source.homeworkId}-done`, false) : false;
  const done = Boolean(loadLocalValue(`${storagePrefix}done`, false) || scoreData?.done || homeworkDone);
  const caption = source.captionKey ? loadLocalValue(`${storagePrefix}${source.captionKey}`, "") : "";

  return {
    completedModules,
    moduleCount,
    modules,
    score: typeof scoreData?.score === "number" ? scoreData.score : null,
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
