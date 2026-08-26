"use client";

import { useEffect, useState } from "react";
import {
  fallbackCurrentUnit,
  readCurrentUnit,
  syncCurrentUnitWithCloud,
  type CurrentUnit
} from "@/data/currentUnit";

/**
 * The level/unit Neritan is teaching, for any surface that only needs to read
 * it: local storage first so the render is instant, then whatever the cloud
 * says if another device moved the cursor on.
 *
 * Three components already inline this effect, and the two that did not —
 * Leo's "Your worlds" card and Home's English card — instead had "L4 · U8"
 * typed into the markup, so they went on advertising Unit 8 while the rest of
 * the app had moved to Unit 9. A hook makes reading the setting the easy path.
 */
export function useCurrentUnit(): CurrentUnit {
  const [currentUnit, setCurrentUnit] = useState<CurrentUnit>(fallbackCurrentUnit);

  useEffect(() => {
    const local = readCurrentUnit();
    setCurrentUnit(local);
    void syncCurrentUnitWithCloud(local).then(setCurrentUnit);
  }, []);

  return currentUnit;
}
