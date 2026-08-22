"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  geographyFieldLabels,
  geographyMaps,
  isGeographyMapReady,
  type GeographyMap
} from "../../../content/subjects/geography/maps";
import {
  applyItemResults,
  createGeographyMapProgressRecord,
  getGeographyMapRecord,
  getWeakItemIds,
  readGeographyProgress,
  saveGeographyMapProgress,
  syncGeographyProgressWithCloud,
  type GeographyItemResult,
  type GeographyMapProgressRecord,
  type GeographyMapProgressStatus,
  type GeographyProgressMap
} from "@/data/geographyProgress";

/**
 * What an embedded map posts up as Leo works. Maps never touch localStorage
 * themselves — they report, and this view is the only thing that saves, so
 * progress always goes through the same merge + Supabase path.
 */
type GeographyMapMessage = {
  type: "LEEA_GEO_PROGRESS" | "LEEA_GEO_READY";
  mapId?: string;
  explored?: number;
  exploredTotal?: number;
  quiz?: { correct: number; total: number };
  /** One entry per answer in a finished quiz run. */
  items?: GeographyItemResult[];
};

const STATUS_LABEL: Record<GeographyMapProgressStatus, string> = {
  "not-done": "Not started",
  explored: "Explored",
  done: "Finished"
};

export function GeographyMapView({ map }: { map: GeographyMap }) {
  const [progress, setProgress] = useState<GeographyProgressMap>({});

  useEffect(() => {
    const local = readGeographyProgress();
    setProgress(local);
    void syncGeographyProgressWithCloud(local).then(setProgress);
  }, []);

  /** Sends what we already know about this map down to the embedded map. */
  const sendState = useCallback(
    (target: MessageEventSource | null) => {
      const stored = getGeographyMapRecord(map.id, readGeographyProgress());
      (target as Window | null)?.postMessage(
        { type: "LEEA_GEO_STATE", mapId: map.id, items: stored?.items ?? {} },
        window.location.origin
      );
    },
    [map.id]
  );

  const handleMessage = useCallback(
    async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const message = event.data as GeographyMapMessage | undefined;
      if (!message) return;
      if (message.mapId && message.mapId !== map.id) return;

      // A map announces itself once it is ready to receive stored stats.
      if (message.type === "LEEA_GEO_READY") {
        sendState(event.source);
        return;
      }

      if (message.type !== "LEEA_GEO_PROGRESS") return;

      const explored = Number.isFinite(message.explored) ? Number(message.explored) : 0;
      const exploredTotal = Number.isFinite(message.exploredTotal) ? Number(message.exploredTotal) : 0;

      let status: GeographyMapProgressStatus = "not-done";
      if (message.quiz) status = "done";
      else if (exploredTotal > 0 && explored >= exploredTotal) status = "explored";

      // Fold this run's answers onto the history rather than replacing it.
      const previous = getGeographyMapRecord(map.id, readGeographyProgress());
      const items = Array.isArray(message.items)
        ? applyItemResults(previous?.items, message.items)
        : previous?.items ?? {};

      const saved = await saveGeographyMapProgress(
        createGeographyMapProgressRecord(map.id, status, message.quiz ?? null, explored, items)
      );
      setProgress((current) => ({ ...current, [saved.mapId]: saved }));
      // The map asked for weighting help; give it the updated picture.
      sendState(event.source);
    },
    [map.id, sendState]
  );

  useEffect(() => {
    function listener(event: MessageEvent) {
      void handleMessage(event);
    }
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [handleMessage]);

  const record: GeographyMapProgressRecord | null = getGeographyMapRecord(map.id, progress);
  const status = record?.status ?? "not-done";
  const weakCount = getWeakItemIds(record?.items).length;

  return (
    <section className="geo-page">
      <div className="geo-bar">
        <div className="geo-bar-title">
          <strong>{map.jpShortTitle}</strong>
          <small>{map.title}{map.sourceLabel ? ` · ${map.sourceLabel}` : ""}</small>
        </div>

        <nav className="geo-switch" aria-label="Maps">
          {geographyMaps.map((entry) => {
            const ready = isGeographyMapReady(entry);
            const entryStatus = getGeographyMapRecord(entry.id, progress)?.status ?? "not-done";
            const className = [
              "geo-switch-btn",
              entry.id === map.id ? "geo-switch-btn--active" : "",
              ready ? "" : "geo-switch-btn--planned",
              entryStatus === "done" ? "geo-switch-btn--done" : ""
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <Link
                aria-current={entry.id === map.id ? "page" : undefined}
                className={className}
                href={`/geography/${entry.id}`}
                key={entry.id}
                title={`${entry.title} — ${geographyFieldLabels[entry.field].jp}`}
              >
                {entry.jpShortTitle}
                {entryStatus === "done" ? <i aria-hidden>✓</i> : null}
              </Link>
            );
          })}
        </nav>

        <div className="geo-bar-end">
          <span className={`geo-pill geo-pill--${status}`}>{STATUS_LABEL[status]}</span>
          {record?.quizScore ? (
            <small>{record.quizScore.correct}/{record.quizScore.total}</small>
          ) : null}
          {weakCount > 0 ? (
            <span className="geo-weak" title="つぎのクイズで出やすくなります">
              苦手 {weakCount}
            </span>
          ) : null}
          {map.embedPath ? (
            <a className="geo-fullscreen" href={map.embedPath} rel="noreferrer" target="_blank" title="Open fullscreen">
              <ExternalLink size={15} />
            </a>
          ) : null}
        </div>
      </div>

      {map.embedPath ? (
        <iframe className="geo-map-frame" src={map.embedPath} title={map.title} />
      ) : (
        <div className="geo-map-missing">
          <h2>{map.jpShortTitle} — map file needed</h2>
          <p>{map.summary}</p>
          <p>
            Add the standalone HTML at <code>public/geography/{map.id}.html</code>, then set{" "}
            <code>embedPath</code> and <code>buildStatus: &quot;live&quot;</code> on this map.
          </p>
        </div>
      )}
    </section>
  );
}
