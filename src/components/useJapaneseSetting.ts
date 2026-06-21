"use client";

/**
 * useJapaneseSetting — single source of truth for the global JP ON/OFF toggle.
 *
 * Storage: localStorage key "leea.japaneseOn" today. Cross-tab sync via the
 * `storage` event. Designed so the hook signature stays identical when we
 * swap to Supabase later — just replace the localStorage I/O with a Supabase
 * profile field; every callsite stays the same.
 *
 * Use directly inside any client component:
 *
 *   const [jpOn, setJpOn] = useJapaneseSetting();
 *
 * Or read-only via the AppShell context with `useJapanesePreference()` for
 * components that just need to render based on it.
 */

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "leea.japaneseOn";
const CHANGE_EVENT = "leea:japaneseOn-change";

function readStored(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeStored(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    /* quota exceeded / private mode — ignore */
  }
}

export function useJapaneseSetting(): [boolean, (value: boolean | ((prev: boolean) => boolean)) => void] {
  // SSR-safe initial state: always false on the server, then hydrate from
  // localStorage in the effect below so the first paint matches what was
  // persisted without throwing a hydration mismatch.
  const [value, setValue] = useState<boolean>(false);

  useEffect(() => {
    setValue(readStored());

    function onStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return;
      setValue(event.newValue === "true");
    }
    function onCustom(event: Event) {
      const detail = (event as CustomEvent<boolean>).detail;
      if (typeof detail === "boolean") setValue(detail);
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener(CHANGE_EVENT, onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CHANGE_EVENT, onCustom as EventListener);
    };
  }, []);

  const update = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        writeStored(resolved);
        // Notify other components in the SAME tab. The native `storage` event
        // only fires for OTHER tabs, so we dispatch our own for in-tab sync.
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent<boolean>(CHANGE_EVENT, { detail: resolved }));
        }
        return resolved;
      });
    },
    []
  );

  return [value, update];
}
