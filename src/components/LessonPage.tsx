"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  fetchLearnerProgressRows,
  saveLearnerProgressValue,
  type LearnerProgressStorageRow
} from "@/data/learnerProgress";
import { getCourseLabel } from "@/data/lessons";
import type { Lesson } from "@/data/types";
import { isSupabaseConfigured } from "@/lib/supabase";

export function LessonPage({ lesson }: { lesson: Lesson }) {
  const isLearnerApp = lesson.mode === "learner";
  const [learnerSrcDoc, setLearnerSrcDoc] = useState<string | null>(null);
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
      const html = await fetch(lesson.source.embedPath as string).then((response) => response.text());
      const rows = await fetchLearnerProgressRows(lesson.source.homeworkId);
      if (!cancelled) setLearnerSrcDoc(injectLearnerCloudBridge(html, lesson.source.homeworkId, rows));
    }

    void loadLearnerApp().catch((error) => {
      console.warn("LEEA learner app preload failed; falling back to direct iframe", error);
      if (!cancelled) setLearnerSrcDoc(null);
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
        | { type: "LEEA_CLOUD_FETCH"; homeworkId?: string; requestId?: string }
        | undefined;

      if (!message || typeof message !== "object") return;

      if (message.type === "LEEA_CLOUD_SAVE" && message.key) {
        await saveLearnerProgressValue(lesson, message.key, message.value);
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

      {lesson.source.embedPath ? (
        <iframe
          ref={isLearnerApp ? learnerFrameRef : undefined}
          className={isFullscreen ? "deck-lesson-frame deck-lesson-frame--fullscreen" : "deck-lesson-frame"}
          src={isLearnerApp && learnerSrcDoc ? undefined : lesson.source.embedPath}
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

  window.LEEA_CLOUD = {
    enabled: CLOUD_ENABLED,
    saveProgress: function(homeworkId, key, value) {
      send('LEEA_CLOUD_SAVE', { homeworkId: homeworkId || HOMEWORK_ID, key, value });
    },
    fetchProgress: requestRows
  };

  const originalSetItem = localStorage.setItem.bind(localStorage);
  const originalRemoveItem = localStorage.removeItem.bind(localStorage);
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
  if (/<head[^>]*>/i.test(html)) return html.replace(/<head([^>]*)>/i, `<head$1>${base}${bridge}`);
  return `${base}${bridge}${html}`;
}

function safeScriptJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
