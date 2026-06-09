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

  const modules = Array.from({ length: moduleCount }, (_, index) => {
    const moduleNumber = index + 1;
    return {
      id: `m${moduleNumber}`,
      label: getModuleLabel(moduleNumber),
      done: loadLocalValue(`${storagePrefix}m${moduleNumber}-done`, false)
    };
  });
  const completedModules = modules.filter((module) => module.done).length;
  const scoreData = loadLocalValue<{ score?: number; done?: boolean } | null>(`${storagePrefix}score`, null);
  const done = Boolean(loadLocalValue(`${storagePrefix}done`, false) || scoreData?.done);
  const caption = loadLocalValue(`${storagePrefix}m5-caption`, "");

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

function getModuleLabel(moduleNumber: number) {
  const labels = [
    "In This Unit I Will",
    "What Is a Hobby?",
    "Photo Explorer",
    "Look and Check",
    "Write Your Caption",
    "Hobby or Not?",
    "Final Quiz"
  ];

  return labels[moduleNumber - 1] ?? `Module ${moduleNumber}`;
}
