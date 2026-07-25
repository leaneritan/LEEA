"use client";

import { CloudOff } from "lucide-react";
import { useEffect, useState } from "react";
import { getCloudSyncStatus, subscribeToCloudSyncStatus, type CloudSyncStatus } from "@/lib/syncStatus";

// Every cloud save already falls back to local storage on failure, so a
// broken sync never blocks Leo or Neritan from using the app — it just goes
// unnoticed, which is exactly how the book-reading and vocab-1 completions
// went missing for days. Surface it instead of staying silent.
export function CloudSyncBadge() {
  const [status, setStatus] = useState<CloudSyncStatus>("synced");

  useEffect(() => {
    setStatus(getCloudSyncStatus());
    return subscribeToCloudSyncStatus(() => setStatus(getCloudSyncStatus()));
  }, []);

  if (status === "synced") return null;

  const message =
    status === "not-configured"
      ? "Cloud sync isn't set up — progress is only saved on this device."
      : "Couldn't reach the cloud just now — progress is only saved on this device until it reconnects.";

  return (
    <span className="cloud-sync-badge" role="status" title={message}>
      <CloudOff size={14} strokeWidth={2.5} />
      Not synced
    </span>
  );
}
