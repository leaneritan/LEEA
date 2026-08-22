"use client";

import { CloudOff } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getCloudSyncFailures,
  getCloudSyncStatus,
  subscribeToCloudSyncStatus,
  type CloudSyncFailure,
  type CloudSyncStatus
} from "@/lib/syncStatus";

// Every cloud save already falls back to local storage on failure, so a
// broken sync never blocks Leo or Neritan from using the app — it just goes
// unnoticed, which is exactly how the book-reading and vocab-1 completions
// went missing for days. Surface it instead of staying silent.
//
// It has to name what is failing. A bare "Not synced" read the same whether
// Supabase was unconfigured or a single table was missing, and that is how
// Math and Geography wrote to tables that did not exist for months without
// anyone noticing while English synced fine beside them.
export function CloudSyncBadge() {
  const [status, setStatus] = useState<CloudSyncStatus>("synced");
  const [failures, setFailures] = useState<CloudSyncFailure[]>([]);

  useEffect(() => {
    function refresh() {
      setStatus(getCloudSyncStatus());
      setFailures(getCloudSyncFailures());
    }
    refresh();
    return subscribeToCloudSyncStatus(refresh);
  }, []);

  if (status === "synced") return null;

  if (status === "not-configured") {
    return (
      <span
        className="cloud-sync-badge"
        role="status"
        title="Cloud sync isn't set up — progress is only saved on this device."
      >
        <CloudOff size={14} strokeWidth={2.5} />
        Sync not set up
      </span>
    );
  }

  const names = failures.map((failure) => failure.label).join(", ");
  // The underlying message is the actually diagnostic part — Supabase says
  // `relation "public.x" does not exist` for a table that was never applied.
  const detail = failures
    .map((failure) => (failure.detail ? `${failure.label}: ${failure.detail}` : failure.label))
    .join("\n");

  return (
    <span
      className="cloud-sync-badge"
      role="status"
      title={`Not saved to the cloud — these are only on this device:\n${detail}`}
    >
      <CloudOff size={14} strokeWidth={2.5} />
      {names ? `Not synced: ${names}` : "Not synced"}
    </span>
  );
}
