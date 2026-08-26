"use client";

import { CloudOff, RotateCw } from "lucide-react";
import type { CloudSyncSource } from "@/lib/syncStatus";
import { useCloudSync } from "./useCloudSync";

/**
 * Says out loud that a page's numbers are missing rather than zero.
 *
 * Every read in data/*.ts falls back to local storage and returns an empty
 * result when Supabase cannot be reached, so a browser that has never held
 * Leo's work renders the whole academy as zeros — 0 words known, 0 lessons
 * done, every app "Not assigned" — which is indistinguishable from an account
 * where nothing has happened yet. That is how a Unit 9 reading app that Leo had
 * finished showed 0 / 11 and looked like lost work.
 *
 * Only shown for sources that have never loaded in this session. A source that
 * loaded and later failed to save still has real data behind it; the topbar
 * badge covers that quieter case, and repeating it here would train the eye to
 * skip the banner that matters.
 */
// Every source except this one backs a figure somewhere. "Current unit" is a
// setting, not data: when it fails the page opens on the fallback unit rather
// than counting anything as zero, so it would make the sentence below untrue.
// The topbar badge still names it.
const NOT_A_COUNT: CloudSyncSource[] = ["current-unit"];

export function CloudSyncNotice() {
  const { failures, unknown } = useCloudSync();

  const names = failures
    .filter((failure) => unknown.includes(failure.source) && !NOT_A_COUNT.includes(failure.source))
    .map((failure) => failure.label);
  if (!names.length) return null;

  return (
    <aside className="cloud-sync-notice" role="alert">
      <span className="cloud-sync-notice-icon" aria-hidden="true">
        <CloudOff size={18} strokeWidth={2.5} />
      </span>
      <div>
        <strong>Can&apos;t reach the cloud right now</strong>
        <p>
          {listNames(names)} didn&apos;t load on this device, so anything counted from{" "}
          {names.length > 1 ? "them" : "it"} is showing as <b>0</b> — that is not the real number.
          Nothing has been lost; this browser just can&apos;t see it.
        </p>
      </div>
      <button className="cloud-sync-notice-retry" onClick={() => window.location.reload()} type="button">
        <RotateCw size={14} strokeWidth={2.6} />
        Try again
      </button>
    </aside>
  );
}

function listNames(names: string[]) {
  if (names.length <= 1) return names[0] ?? "Some of Leo's data";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}
