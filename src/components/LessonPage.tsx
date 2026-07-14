"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
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
      if (event.origin !== window.location.origin) return;
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
        (event.source as Window | null)?.postMessage(
          { type: "LEEA_CLOUD_FETCH_RESULT", requestId: message.requestId, rows },
          event.origin
        );
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isLearnerApp, lesson]);

  return (
    <section className={isLearnerApp ? "deck-lesson-page learner-lesson-page" : "deck-lesson-page"}>
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
            <a className="ghost-button" href={lesson.source.embedPath} rel="noreferrer" target="_blank">
              {isLearnerApp ? "Open App Fullscreen" : "Open Fullscreen"}
              <ExternalLink size={16} />
            </a>
          ) : null}
        </nav>
      </header>

      {lesson.source.embedPath ? (
        <iframe
          className="deck-lesson-frame"
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
  const bridge = `
<script>
(function(){
  const HOMEWORK_ID = ${JSON.stringify(homeworkId ?? "")};
  const INITIAL_ROWS = ${safeScriptJson(rows)};
  const CLOUD_ENABLED = ${JSON.stringify(isSupabaseConfigured)};

  function send(type, payload) {
    try { parent.postMessage(Object.assign({ type }, payload || {}), location.origin); } catch (error) {}
  }

  function requestRows(homeworkId) {
    return new Promise(function(resolve) {
      const requestId = 'lp-' + Date.now() + '-' + Math.random().toString(16).slice(2);
      function handle(event) {
        if (event.origin !== location.origin) return;
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

  const base = `<base href="${typeof window === "undefined" ? "/" : window.location.origin}/">`;
  if (/<head[^>]*>/i.test(html)) return html.replace(/<head([^>]*)>/i, `<head$1>${base}${bridge}`);
  return `${base}${bridge}${html}`;
}

function safeScriptJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
