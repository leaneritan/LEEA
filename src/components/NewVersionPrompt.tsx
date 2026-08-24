"use client";

import { RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

/**
 * Tells you when the page you are looking at is out of date.
 *
 * A tab keeps the JavaScript it loaded. Navigating inside the app never fetches
 * a new bundle, so after a deploy an open tab goes on running the old code with
 * nothing to say so — which is how a fix can look like it did not land, and how
 * you can spend a while testing a build that is no longer deployed.
 *
 * The build id is inlined at build time (see next.config.mjs). /api/build is
 * served by whichever deployment the alias points at now, so a mismatch means
 * exactly one thing: this tab is behind.
 */

const CHECK_INTERVAL_MS = 15 * 60 * 1000;
/** Never re-check more often than this, however many focus events arrive. */
const MIN_GAP_MS = 60 * 1000;
const DISMISSED_KEY = "leea.dismissedBuild.v1";

const CURRENT_BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID ?? null;

export function NewVersionPrompt() {
  const [deployedId, setDeployedId] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<string | null>(null);

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(DISMISSED_KEY));
    } catch {
      // A browser refusing storage is not a reason to hide the prompt.
    }
  }, []);

  const check = useCallback(async () => {
    try {
      const response = await fetch("/api/build", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { buildId?: string | null };
      if (data.buildId) setDeployedId(data.buildId);
    } catch {
      // Offline, or the deployment is mid-swap. Try again on the next tick.
    }
  }, []);

  useEffect(() => {
    // Local builds get a timestamp id that changes on every restart, which
    // would nag constantly and mean nothing.
    if (!CURRENT_BUILD_ID || CURRENT_BUILD_ID.startsWith("local-")) return;

    let last = 0;
    const maybeCheck = () => {
      const now = Date.now();
      if (now - last < MIN_GAP_MS) return;
      last = now;
      void check();
    };

    maybeCheck();
    const timer = window.setInterval(maybeCheck, CHECK_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") maybeCheck();
    };

    window.addEventListener("focus", maybeCheck);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", maybeCheck);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [check]);

  const stale = Boolean(
    CURRENT_BUILD_ID && deployedId && deployedId !== CURRENT_BUILD_ID && deployedId !== dismissed
  );
  if (!stale) return null;

  return (
    <div className="new-version-prompt" role="status">
      <span className="new-version-text">
        <b>New version available</b>
        <small>This tab is still running the older one.</small>
      </span>
      <button className="new-version-reload" onClick={() => window.location.reload()} type="button">
        <RefreshCw size={14} strokeWidth={2.6} />
        Reload
      </button>
      <button
        aria-label="Dismiss"
        className="new-version-dismiss"
        onClick={() => {
          setDismissed(deployedId);
          try {
            if (deployedId) window.localStorage.setItem(DISMISSED_KEY, deployedId);
          } catch {
            // Dismissal then lasts for this page only, which is good enough.
          }
        }}
        type="button"
      >
        <X size={14} strokeWidth={2.6} />
      </button>
    </div>
  );
}
