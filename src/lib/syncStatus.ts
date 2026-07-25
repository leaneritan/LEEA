"use client";

import { isSupabaseConfigured } from "./supabase";

export type CloudSyncStatus = "synced" | "not-configured" | "error";

const STATUS_EVENT = "leea-cloud-sync-status";

let lastOutcome: "ok" | "error" | null = null;

export function reportCloudSyncSuccess() {
  if (lastOutcome === "ok") return;
  lastOutcome = "ok";
  if (typeof window !== "undefined") window.dispatchEvent(new Event(STATUS_EVENT));
}

export function reportCloudSyncFailure() {
  if (lastOutcome === "error") return;
  lastOutcome = "error";
  if (typeof window !== "undefined") window.dispatchEvent(new Event(STATUS_EVENT));
}

// Every data/*.ts module already no-ops and falls back to local storage when
// a write can't reach Supabase, so a stuck sync never breaks the app for
// Leo or Neritan — it just silently trails behind the cloud, which is what
// let the book-reading and vocab-1 gaps go unnoticed for days. This reflects
// the most recent read/write outcome so the dashboards can surface it instead.
export function getCloudSyncStatus(): CloudSyncStatus {
  if (!isSupabaseConfigured) return "not-configured";
  if (lastOutcome === "error") return "error";
  return "synced";
}

export function subscribeToCloudSyncStatus(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(STATUS_EVENT, callback);
  return () => window.removeEventListener(STATUS_EVENT, callback);
}
