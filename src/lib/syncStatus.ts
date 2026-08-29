"use client";

import { isSupabaseConfigured } from "./supabase";

export type CloudSyncStatus = "synced" | "not-configured" | "error";

/**
 * Which part of the app a sync outcome came from. Every data/*.ts module owns
 * one, so a failure can be named instead of reported as a bare "not synced".
 */
export type CloudSyncSource =
  | "assignments"
  | "learner-progress"
  | "teacher-lessons"
  | "current-unit"
  | "math"
  | "geography"
  | "science"
  | "reference";

export const cloudSyncSourceLabels: Record<CloudSyncSource, string> = {
  assignments: "Assignments",
  "learner-progress": "Leo's progress",
  "teacher-lessons": "Teacher checklist",
  "current-unit": "Current unit",
  math: "Math",
  geography: "Geography",
  science: "Science",
  reference: "Reference words"
};

export type CloudSyncFailure = {
  source: CloudSyncSource;
  label: string;
  /** The underlying message, when the caller had one — e.g. a missing table. */
  detail?: string;
};

const STATUS_EVENT = "leea-cloud-sync-status";

// Outcomes are tracked per source, not as one global flag. They used to share
// a single lastOutcome, which meant any working table immediately erased a
// broken one: Math and Geography wrote to tables that did not exist for months
// while English synced fine, and the badge stayed quiet the whole time because
// English reported success last. One failing source must not be maskable.
const outcomes = new Map<CloudSyncSource, CloudSyncFailure | null>();

// Which sources have answered successfully at least once in this session.
// A failure alone cannot tell you whether the numbers on screen are real: a
// source that loaded and then failed to save still has Leo's data behind it,
// while one that has never answered has nothing — and every count derived from
// it renders 0, which reads exactly like a finished-nothing account. Those two
// have to be tellable apart before a page can decide whether to show a number.
const loaded = new Set<CloudSyncSource>();

function notify() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(STATUS_EVENT));
}

export function reportCloudSyncSuccess(source: CloudSyncSource) {
  loaded.add(source);
  if (outcomes.get(source) === null) return;
  outcomes.set(source, null);
  notify();
}

export function reportCloudSyncFailure(source: CloudSyncSource, detail?: unknown) {
  const message = toDetailMessage(detail);
  const previous = outcomes.get(source);
  if (previous && previous.detail === message) return;

  outcomes.set(source, { source, label: cloudSyncSourceLabels[source], detail: message });
  notify();
}

// Every data/*.ts module already no-ops and falls back to local storage when a
// write can't reach Supabase, so a stuck sync never breaks the app for Leo or
// Neritan — it just silently trails behind the cloud, which is what let the
// book-reading and vocab-1 gaps go unnoticed for days. This reflects the most
// recent outcome per source so the dashboards can surface it instead.
export function getCloudSyncStatus(): CloudSyncStatus {
  if (!isSupabaseConfigured) return "not-configured";
  return getCloudSyncFailures().length ? "error" : "synced";
}

/** Every source currently failing, so the UI can say which rather than "something". */
export function getCloudSyncFailures(): CloudSyncFailure[] {
  const failures: CloudSyncFailure[] = [];
  for (const failure of outcomes.values()) {
    if (failure) failures.push(failure);
  }
  return failures;
}

/**
 * True when a source is failing and has never loaded, so anything derived from
 * it is unknown rather than zero. Surfaces should show a dash, not a number.
 */
export function isCloudSourceUnknown(source: CloudSyncSource): boolean {
  if (!isSupabaseConfigured) return false;
  return Boolean(outcomes.get(source)) && !loaded.has(source);
}

/** Every source currently unknown, for a page that wants to say so once. */
export function getUnknownCloudSources(): CloudSyncSource[] {
  return getCloudSyncFailures()
    .map((failure) => failure.source)
    .filter((source) => !loaded.has(source));
}

export function subscribeToCloudSyncStatus(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(STATUS_EVENT, callback);
  return () => window.removeEventListener(STATUS_EVENT, callback);
}

/**
 * Supabase reports a missing table as `relation "public.x" does not exist`,
 * which is the single most useful thing to see — keep it if it's there.
 */
function toDetailMessage(detail: unknown): string | undefined {
  if (!detail) return undefined;
  if (typeof detail === "string") return detail;
  if (typeof detail === "object" && "message" in detail) {
    const message = (detail as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return undefined;
}
