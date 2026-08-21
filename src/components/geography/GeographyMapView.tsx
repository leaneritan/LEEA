"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { GeographyMap } from "../../../content/subjects/geography/maps";
import { getGeographyPlacementByMapId } from "../../../content/subjects/geography/curriculum";
import {
  createGeographyMapProgressRecord,
  getGeographyMapRecord,
  readGeographyProgress,
  saveGeographyMapProgress,
  syncGeographyProgressWithCloud,
  type GeographyMapProgressRecord,
  type GeographyMapProgressStatus
} from "@/data/geographyProgress";

/**
 * What an embedded map posts up as Leo works. Maps never touch localStorage
 * themselves — they report, and this view is the only thing that saves, so
 * progress always goes through the same merge + Supabase path.
 */
type GeographyMapMessage = {
  type: "LEEA_GEO_PROGRESS";
  mapId?: string;
  /** How many distinct markers Leo has opened. */
  explored?: number;
  /** How many markers the map has in total. */
  exploredTotal?: number;
  quiz?: { correct: number; total: number };
};

export function GeographyMapView({ map }: { map: GeographyMap }) {
  const placement = getGeographyPlacementByMapId(map.id);
  const sectionId = placement?.section.id ?? "unfiled";
  const [record, setRecord] = useState<GeographyMapProgressRecord | null>(null);

  useEffect(() => {
    const local = readGeographyProgress();
    setRecord(getGeographyMapRecord(sectionId, map.id, local));
    void syncGeographyProgressWithCloud(local).then((merged) => {
      setRecord(getGeographyMapRecord(sectionId, map.id, merged));
    });
  }, [map.id, sectionId]);

  const handleMessage = useCallback(
    async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const message = event.data as GeographyMapMessage | undefined;
      if (!message || message.type !== "LEEA_GEO_PROGRESS") return;
      if (message.mapId && message.mapId !== map.id) return;

      const explored = Number.isFinite(message.explored) ? Number(message.explored) : 0;
      const exploredTotal = Number.isFinite(message.exploredTotal) ? Number(message.exploredTotal) : 0;

      let status: GeographyMapProgressStatus = "not-done";
      if (message.quiz) status = "done";
      else if (exploredTotal > 0 && explored >= exploredTotal) status = "explored";

      const saved = await saveGeographyMapProgress(
        createGeographyMapProgressRecord(sectionId, map.id, status, message.quiz ?? null, explored)
      );
      setRecord(saved);
    },
    [map.id, sectionId]
  );

  useEffect(() => {
    function listener(event: MessageEvent) {
      void handleMessage(event);
    }
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [handleMessage]);

  const statusLabel =
    record?.status === "done" ? "Finished" : record?.status === "explored" ? "Explored" : "Not started";

  return (
    <section className="geo-map-page">
      <header className="geo-map-bar">
        <div>
          <span className="eyebrow">
            {placement
              ? `${placement.chapter.num} ${placement.chapter.title} - ${placement.section.name}`
              : map.sourceLabel}
          </span>
          <h1>{map.title}</h1>
          <p className="geo-map-jp-title">{map.jpTitle}</p>
        </div>
        <nav aria-label="Map actions">
          {placement ? (
            <Link className="ghost-button" href={`/geography/${placement.chapter.id}`}>
              {placement.chapter.num}
            </Link>
          ) : null}
          <Link className="ghost-button" href="/geography">
            All Maps
          </Link>
          {map.embedPath ? (
            <a className="ghost-button" href={map.embedPath} rel="noreferrer" target="_blank">
              Open Fullscreen
              <ExternalLink size={16} />
            </a>
          ) : null}
        </nav>
      </header>

      <div className="geo-progress-strip">
        <span className={`geo-progress-pill geo-progress-pill--${record?.status ?? "not-done"}`}>{statusLabel}</span>
        <small>
          {record?.exploredCount
            ? `${record.exploredCount} place${record.exploredCount === 1 ? "" : "s"} opened`
            : "Open every marker, then try the quiz."}
        </small>
        {record?.quizScore ? (
          <strong>
            Best quiz {record.quizScore.correct}/{record.quizScore.total}
          </strong>
        ) : map.quizTotal ? (
          <strong className="geo-progress-muted">Quiz: {map.quizTotal} questions</strong>
        ) : null}
      </div>

      {map.embedPath ? (
        <iframe className="geo-map-frame" src={map.embedPath} title={map.title} />
      ) : (
        <div className="geo-map-missing">
          <h2>Map file needed</h2>
          <p>
            Add the standalone HTML at <code>public/geography/{map.id}.html</code>, then set{" "}
            <code>embedPath</code> and <code>buildStatus: &quot;live&quot;</code> on this map.
          </p>
        </div>
      )}
    </section>
  );
}
