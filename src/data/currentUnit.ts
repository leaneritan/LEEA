// Which level/unit is being actively taught right now.
//
// This used to be the hardcoded LIVE_LEVEL / LIVE_UNIT pair in curriculum.ts,
// which meant moving on to a new unit needed a code change. It is one concept
// with two jobs: it decides where the teacher menu and Leo's library open, and
// it is the cursor that derives taught / to-teach status on placeholder
// rosters and done / current / locked on levels.
//
// Stored like teacher lesson progress — localStorage first so the UI is
// instant, then synced to Supabase so the setting follows Neritan across
// devices. The constants in curriculum.ts remain the fallback for a browser
// that has never set one.
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { reportCloudSyncFailure, reportCloudSyncSuccess } from "@/lib/syncStatus";
import { LIVE_LEVEL, LIVE_UNIT } from "./curriculum";

export type CurrentUnit = {
  level: number;
  unit: number;
  updatedAt: string;
};

export const currentUnitStorageKey = "leea.currentUnit.v1";

const SETTING_ID = "neritan:current-unit";

type CurrentUnitRow = {
  id: string;
  teacher_id: string;
  level: number;
  unit: number;
  updated_at: string;
};

export const fallbackCurrentUnit: CurrentUnit = {
  level: LIVE_LEVEL,
  unit: LIVE_UNIT,
  updatedAt: new Date(0).toISOString()
};

export function createCurrentUnit(level: number, unit: number): CurrentUnit {
  return { level, unit, updatedAt: new Date().toISOString() };
}

export function readCurrentUnit(): CurrentUnit {
  if (typeof window === "undefined") return fallbackCurrentUnit;

  try {
    const saved = window.localStorage.getItem(currentUnitStorageKey);
    if (!saved) return fallbackCurrentUnit;
    const parsed = JSON.parse(saved) as Partial<CurrentUnit>;
    if (typeof parsed.level !== "number" || typeof parsed.unit !== "number") return fallbackCurrentUnit;
    return {
      level: parsed.level,
      unit: parsed.unit,
      updatedAt: parsed.updatedAt ?? new Date(0).toISOString()
    };
  } catch {
    return fallbackCurrentUnit;
  }
}

export function writeCurrentUnit(value: CurrentUnit) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(currentUnitStorageKey, JSON.stringify(value));
}

export async function saveCurrentUnit(value: CurrentUnit) {
  writeCurrentUnit(value);
  if (!isSupabaseConfigured || !supabase) return;

  try {
    const { error } = await supabase
      .from("teacher_settings")
      .upsert(
        [{ id: SETTING_ID, teacher_id: "neritan", level: value.level, unit: value.unit, updated_at: value.updatedAt }],
        { onConflict: "id" }
      );
    if (error) throw error;
    reportCloudSyncSuccess("current-unit");
  } catch (error) {
    console.warn("LEEA Supabase current unit save failed", error);
    reportCloudSyncFailure("current-unit", error);
  }
}

export async function syncCurrentUnitWithCloud(current: CurrentUnit): Promise<CurrentUnit> {
  if (!isSupabaseConfigured || !supabase || typeof window === "undefined") return current;

  try {
    const { data, error } = await supabase
      .from("teacher_settings")
      .select("id, teacher_id, level, unit, updated_at")
      .eq("id", SETTING_ID)
      .maybeSingle();

    if (error) throw error;
    reportCloudSyncSuccess("current-unit");

    const row = data as CurrentUnitRow | null;
    if (!row) {
      // Nothing in the cloud yet. Only push if this browser has actually set
      // one, so an untouched device doesn't write the fallback as a choice.
      if (current.updatedAt !== fallbackCurrentUnit.updatedAt) await saveCurrentUnit(current);
      return current;
    }

    const cloud: CurrentUnit = { level: row.level, unit: row.unit, updatedAt: row.updated_at };
    if (new Date(cloud.updatedAt).getTime() > new Date(current.updatedAt).getTime()) {
      writeCurrentUnit(cloud);
      return cloud;
    }

    if (new Date(current.updatedAt).getTime() > new Date(cloud.updatedAt).getTime()) {
      await saveCurrentUnit(current);
    }
    return current;
  } catch (error) {
    console.warn("LEEA Supabase current unit sync failed", error);
    reportCloudSyncFailure("current-unit", error);
    return current;
  }
}

export type LevelStatus = "done" | "current" | "locked";

export function levelStatusFor(level: number, currentUnit: CurrentUnit): LevelStatus {
  if (level < currentUnit.level) return "done";
  if (level > currentUnit.level) return "locked";
  return "current";
}
