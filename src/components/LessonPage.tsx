"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  clearLearnerProgressCloud,
  clearLearnerProgressValues,
  fetchLearnerProgressRows,
  saveLearnerProgressValue,
  type LearnerProgressStorageRow
} from "@/data/learnerProgress";
import { getCourseLabel } from "@/data/lessons";
import { pushTestAttempt, type TestAttempt } from "@/data/testAttempts";
import type { Lesson } from "@/data/types";
import { isSupabaseConfigured } from "@/lib/supabase";

export function LessonPage({ lesson }: { lesson: Lesson }) {
  const isLearnerApp = lesson.mode === "learner";
  const [learnerSrcDoc, setLearnerSrcDoc] = useState<string | null>(null);
  /* Only true once the srcdoc attempt has actually failed. Until then a learner
     app renders no iframe at all — see the frame below. */
  const [learnerFailed, setLearnerFailed] = useState(false);
  // The bridge below runs inside a srcDoc iframe, whose document URL is
  // about:srcdoc — so both its `location.origin` and the `event.origin` of
  // anything it posts are the string "null", never this page's origin. An
  // origin equality check therefore drops every message the app sends, which
  // is what stopped a lesson in progress from reaching Supabase until some
  // later dashboard visit happened to re-scan local storage. Identify the
  // sender by its window instead: only this iframe can be that window.
  const learnerFrameRef = useRef<HTMLIFrameElement>(null);
  const searchParams = useSearchParams();
  // Fullscreen still routes through this page (not the raw static file) so the
  // Supabase cloud-sync bridge below still runs — opening the raw HTML file
  // directly writes progress to localStorage only, with nothing to push it to Supabase.
  const isFullscreen = isLearnerApp && searchParams.get("fullscreen") === "1";

  useEffect(() => {
    if (!isLearnerApp || !lesson.source.embedPath) return;

    let cancelled = false;

    async function loadLearnerApp() {
      const html = await fetch(withBuildId(lesson.source.embedPath as string)).then((response) =>
        response.text()
      );
      const rows = await fetchLearnerProgressRows(lesson.source.homeworkId);
      if (!cancelled) setLearnerSrcDoc(injectLearnerCloudBridge(html, lesson.source.homeworkId, rows));
    }

    void loadLearnerApp().catch((error) => {
      console.warn("LEEA learner app preload failed; falling back to direct iframe", error);
      if (!cancelled) {
        setLearnerSrcDoc(null);
        setLearnerFailed(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isLearnerApp, lesson.source.embedPath, lesson.source.homeworkId]);

  useEffect(() => {
    if (!isLearnerApp) return;

    async function handleMessage(event: MessageEvent) {
      const frameWindow = learnerFrameRef.current?.contentWindow;
      if (!frameWindow || event.source !== frameWindow) return;
      const message = event.data as
        | { type: "LEEA_CLOUD_SAVE"; homeworkId?: string; key?: string; value?: unknown }
        | { type: "LEEA_CLOUD_CLEAR"; homeworkId?: string; keys?: string[]; all?: boolean }
        | { type: "LEEA_CLOUD_FETCH"; homeworkId?: string; requestId?: string }
        | { type: "LEEA_TEST_ATTEMPT"; attempt?: TestAttempt }
        | undefined;

      if (!message || typeof message !== "object") return;

      if (message.type === "LEEA_CLOUD_SAVE" && message.key) {
        await saveLearnerProgressValue(lesson, message.key, message.value);
      }

      // A clear or a retake drops many keys at once. It arrives as one message
      // so it becomes one write, rather than a dozen racing ones that put each
      // other's deletions back. `all` is a retake: the whole sitting goes and
      // the clear is recorded, so a device still holding the old answers wipes
      // its own copy instead of uploading them again.
      if (message.type === "LEEA_CLOUD_CLEAR" && Array.isArray(message.keys)) {
        if (message.all) await clearLearnerProgressCloud(lesson);
        else await clearLearnerProgressValues(lesson, message.keys);
      }

      // A sitting of a test. It lives in its own table rather than in this
      // homework's raw_progress, because a result is a dated record of its own
      // and a retake must leave the last one standing.
      if (message.type === "LEEA_TEST_ATTEMPT" && message.attempt?.id) {
        await pushTestAttempt(message.attempt);
      }

      if (message.type === "LEEA_CLOUD_FETCH" && message.requestId) {
        const rows = await fetchLearnerProgressRows(message.homeworkId ?? lesson.source.homeworkId);
        // event.origin is "null" for a srcDoc frame, so it cannot be used as a
        // target; the recipient is pinned to this iframe's window instead.
        frameWindow.postMessage(
          { type: "LEEA_CLOUD_FETCH_RESULT", requestId: message.requestId, rows },
          "*"
        );
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isLearnerApp, lesson]);

  const sectionClassName = [
    "deck-lesson-page",
    isLearnerApp ? "learner-lesson-page" : null,
    isFullscreen ? "deck-lesson-page--fullscreen" : null
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={sectionClassName}>
      {isFullscreen ? (
        <Link className="ghost-button deck-lesson-exit" href={`/lessons/${lesson.id}`}>
          Exit Fullscreen
        </Link>
      ) : (
        <header className="deck-lesson-bar">
          <div>
            <span className="eyebrow">
              {[
                getCourseLabel(lesson.course),
                lesson.level ? `Level ${lesson.level}` : null,
                lesson.unit ? `Unit ${lesson.unit}` : null,
                lesson.component
              ]
                .filter(Boolean)
                .join(" - ")}
            </span>
            <h1>{lesson.title}</h1>
          </div>
          <nav aria-label="Lesson actions">
            <Link className="ghost-button" href={isLearnerApp ? "/leo" : "/lessons"}>
              {isLearnerApp ? "My Assignments" : "All Lessons"}
            </Link>
            <Link className="ghost-button" href="/reference">
              Reference
            </Link>
            {lesson.source.embedPath ? (
              // Learner apps must stay on this route (not the raw static file) when
              // opened fullscreen so the Supabase cloud-sync bridge below keeps running.
              <a
                className="ghost-button"
                href={isLearnerApp ? `/lessons/${lesson.id}?fullscreen=1` : lesson.source.embedPath}
                rel="noreferrer"
                target="_blank"
              >
                {isLearnerApp ? "Open App Fullscreen" : "Open Fullscreen"}
                <ExternalLink size={16} />
              </a>
            ) : null}
          </nav>
        </header>
      )}

      {lesson.source.embedPath && isLearnerApp && !learnerSrcDoc && !learnerFailed ? (
        /* Deliberately no iframe yet.
           Pointing it at the raw file while the srcdoc is still being fetched
           loads that file as a real document, and that document pulls
           /components/*.js for itself — unversioned, straight into the cache,
           a moment before the versioned srcdoc asks for the same thing. The
           frame then runs whatever the cache already had, which is how a
           shipped engine fix could keep looking like it never landed. */
        <div className="deck-lesson-frame deck-lesson-loading">Opening the lesson…</div>
      ) : lesson.source.embedPath ? (
        <iframe
          ref={isLearnerApp ? learnerFrameRef : undefined}
          className={isFullscreen ? "deck-lesson-frame deck-lesson-frame--fullscreen" : "deck-lesson-frame"}
          src={isLearnerApp && learnerSrcDoc ? undefined : withBuildId(lesson.source.embedPath)}
          srcDoc={isLearnerApp && learnerSrcDoc ? learnerSrcDoc : undefined}
          title={lesson.title}
        />
      ) : (
        <div className="deck-lesson-missing">
          <h2>Lesson file needed</h2>
          <p>{lesson.source.file}</p>
        </div>
      )}
    </section>
  );
}

function injectLearnerCloudBridge(html: string, homeworkId: string | undefined, rows: LearnerProgressStorageRow[]) {
  const parentOrigin = typeof window === "undefined" ? "/" : window.location.origin;
  const bridge = `
<script>
(function(){
  const HOMEWORK_ID = ${JSON.stringify(homeworkId ?? "")};
  // Baked in because this document is about:srcdoc: its own location.origin is
  // "null", which matches no real origin and silently drops every postMessage.
  const PARENT_ORIGIN = ${JSON.stringify(parentOrigin)};
  const INITIAL_ROWS = ${safeScriptJson(rows)};
  const CLOUD_ENABLED = ${JSON.stringify(isSupabaseConfigured)};
  // So a lesson can say which deployment it came from — see ENGINE_REV in
  // test-engine.js. A frame has no other way to tell you it is stale.
  window.LEEA_BUILD = ${JSON.stringify(process.env.NEXT_PUBLIC_BUILD_ID ?? "")};

  function send(type, payload) {
    try { parent.postMessage(Object.assign({ type }, payload || {}), PARENT_ORIGIN); } catch (error) {}
  }

  function requestRows(homeworkId) {
    return new Promise(function(resolve) {
      const requestId = 'lp-' + Date.now() + '-' + Math.random().toString(16).slice(2);
      function handle(event) {
        if (event.origin !== PARENT_ORIGIN) return;
        const message = event.data || {};
        if (message.type !== 'LEEA_CLOUD_FETCH_RESULT' || message.requestId !== requestId) return;
        window.removeEventListener('message', handle);
        resolve(Array.isArray(message.rows) ? message.rows : []);
      }
      window.addEventListener('message', handle);
      send('LEEA_CLOUD_FETCH', { homeworkId: homeworkId || HOMEWORK_ID, requestId });
      window.setTimeout(function(){ window.removeEventListener('message', handle); resolve([]); }, 3000);
    });
  }

  function writeRow(row) {
    if (!row || !row.storage_key) return;
    try {
      if (row.value === null || row.value === undefined) localStorage.removeItem(row.storage_key);
      else localStorage.setItem(row.storage_key, JSON.stringify(row.value));
    } catch (error) {}
  }

  INITIAL_ROWS.forEach(writeRow);

  const originalSetItem = localStorage.setItem.bind(localStorage);
  const originalRemoveItem = localStorage.removeItem.bind(localStorage);

  window.LEEA_CLOUD = {
    enabled: CLOUD_ENABLED,
    saveProgress: function(homeworkId, key, value) {
      send('LEEA_CLOUD_SAVE', { homeworkId: homeworkId || HOMEWORK_ID, key, value });
    },
    /**
     * Drop many keys as ONE operation — what a "clear this page" or a retake
     * actually is. It removes them locally through the unpatched removeItem on
     * purpose, so this does not also fire one save message per key: a dozen
     * concurrent read-modify-writes of the same cloud row put each other's
     * deletions back, and the cleared answers returned on the next sync.
     */
    clearProgress: function(keys, wholeSitting) {
      if (!Array.isArray(keys) || !keys.length) return;
      keys.forEach(function(key) { try { originalRemoveItem(key); } catch (error) {} });
      send('LEEA_CLOUD_CLEAR', { homeworkId: HOMEWORK_ID, keys: keys, all: !!wholeSitting });
    },
    fetchProgress: requestRows
  };

  localStorage.setItem = function(key, value) {
    originalSetItem(key, value);
    try {
      window.LEEA_CLOUD.saveProgress(HOMEWORK_ID, key, JSON.parse(value));
    } catch (error) {
      window.LEEA_CLOUD.saveProgress(HOMEWORK_ID, key, value);
    }
  };
  localStorage.removeItem = function(key) {
    originalRemoveItem(key);
    window.LEEA_CLOUD.saveProgress(HOMEWORK_ID, key, null);
  };
})();
</script>`;

  const base = `<base href="${parentOrigin}/">`;
  const page = versionLessonAssets(html);
  if (/<head[^>]*>/i.test(page)) return page.replace(/<head([^>]*)>/i, `<head$1>${base}${bridge}`);
  return `${base}${bridge}${page}`;
}

/**
 * The deploy the app is running, as a cache-busting query.
 *
 * `next.config.mjs` inlines the commit sha at build time, so this string
 * changes on every deploy and on every local restart.
 */
function withBuildId(path: string) {
  const buildId = process.env.NEXT_PUBLIC_BUILD_ID;
  if (!buildId || !path.startsWith("/")) return path;
  return `${path}${path.includes("?") ? "&" : "?"}v=${encodeURIComponent(buildId)}`;
}

/**
 * Stamp the deploy onto everything a lesson loads for itself.
 *
 * `NewVersionPrompt` covers the app's own bundle, but a lesson is not part of
 * it: the shell under `/learn` or `/lessons` pulls in `/components/*.js` and a
 * test names its questions file, and those are ordinary static files the
 * browser is free to serve from its cache. So a deploy could land, the app
 * could be up to date, and the lesson inside the frame could still be running
 * last week's code — which is exactly what happened to the test engine three
 * times over, each time looking like a fix that never shipped.
 *
 * Versioning the URL makes it a different file to the cache, so it cannot.
 * Pictures are left alone: they are written once and never edited, and
 * busting them would re-download every test image on every deploy.
 */
function versionLessonAssets(html: string) {
  return html
    .replace(/(<script[^>]*\ssrc=")(\/[^"?]+\.js)(")/gi, (_m, a, path, b) => a + withBuildId(path) + b)
    .replace(
      /(<link[^>]*\shref=")(\/[^"?]+\.css)(")/gi,
      (_m, a, path, b) => a + withBuildId(path) + b
    )
    // A test names its own questions file, which changes with the test.
    .replace(
      /(window\.LEEA_TEST\s*=\s*['"])(\/[^'"?]+\.json)(['"])/gi,
      (_m, a, path, b) => a + withBuildId(path) + b
    );
}

function safeScriptJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
