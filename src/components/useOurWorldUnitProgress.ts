"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  courseLearnerLessons,
  emptyRollup,
  nextUnfinishedApp,
  readCourseLearnerStats,
  rollupLearner,
  unitLearnerLessons,
  unitPercent,
  type LearnerRollup,
  type LearnerStatMap
} from "@/data/ourWorldProgress";
import { syncLearnerProgressWithCloud } from "@/data/learnerProgress";
import { unitTitle } from "@/data/curriculum";
import type { Lesson } from "@/data/types";
import { useCurrentUnit } from "./useCurrentUnit";

export type CurrentUnitProgress = {
  level: number;
  unit: number;
  title: string;
  rollup: LearnerRollup;
  percent: number;
  nextLesson: Lesson | null;
};

/**
 * Leo's progress through the unit Neritan is teaching right now.
 *
 * `enabled` exists because this lives in the app shell: the sidebar card only
 * shows it on English pages, and a Supabase read on every page load of every
 * subject would be paid for nothing.
 */
export function useOurWorldUnitProgress(enabled = true): CurrentUnitProgress {
  const currentUnit = useCurrentUnit();
  const [stats, setStats] = useState<LearnerStatMap>({});

  // localStorage is read here rather than during render — see
  // readCourseLearnerStats on why that matters for hydration.
  const refresh = useCallback(() => {
    if (!enabled) return;
    setStats(readCourseLearnerStats());
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    refresh();
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, refresh]);

  // Leo works in his own browser. Without this pull, a card in Neritan's
  // browser only ever reports what that device happens to hold locally.
  useEffect(() => {
    if (!enabled) return;
    void syncLearnerProgressWithCloud(courseLearnerLessons).then((changed) => {
      if (changed) setStats(readCourseLearnerStats());
    });
  }, [enabled]);

  return useMemo(() => {
    const rollup = enabled
      ? rollupLearner(unitLearnerLessons(currentUnit.level, currentUnit.unit), stats)
      : emptyRollup;
    return {
      level: currentUnit.level,
      unit: currentUnit.unit,
      title: unitTitle(currentUnit.level, currentUnit.unit),
      rollup,
      percent: unitPercent(rollup),
      nextLesson: enabled ? nextUnfinishedApp(currentUnit.level, currentUnit.unit, stats) : null
    };
  }, [enabled, currentUnit, stats]);
}
