"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { GeographyChapterMeta } from "../../../content/subjects/geography/types";
import { getGeographyMapById, isGeographyMapReady } from "../../../content/subjects/geography/maps";
import {
  getChapterCompletionPercent,
  getGeographyMapRecord,
  readGeographyProgress,
  syncGeographyProgressWithCloud,
  type GeographyProgressMap
} from "@/data/geographyProgress";

function mapIsReady(mapId: string) {
  const map = getGeographyMapById(mapId);
  return Boolean(map && isGeographyMapReady(map));
}

const STATUS_LABEL = { done: "Finished", explored: "Explored", "not-done": "Not started" } as const;

export function GeographyChapterView({ chapter }: { chapter: GeographyChapterMeta }) {
  const [progress, setProgress] = useState<GeographyProgressMap>({});

  useEffect(() => {
    const local = readGeographyProgress();
    setProgress(local);
    void syncGeographyProgressWithCloud(local).then(setProgress);
  }, []);

  const completion = getChapterCompletionPercent(chapter.sections, progress, mapIsReady);

  return (
    <section className="geo-hub">
      <header className="geo-chapter-hero" style={{ background: chapter.dark }}>
        <span>{chapter.num}</span>
        <h1>{chapter.title}</h1>
        <p>{chapter.subtitle}</p>
        <div className="geo-chapter-hero-meter" aria-label={`${completion.percent}% complete`}>
          <i style={{ width: `${completion.percent}%`, background: chapter.color }} />
        </div>
        <small>
          {completion.total === 0
            ? "No map built for this chapter yet."
            : `${completion.done} of ${completion.total} maps finished`}
        </small>
      </header>

      <div className="geo-section-list">
        {chapter.sections.map((section) => {
          const maps = section.mapIds
            .map((mapId) => getGeographyMapById(mapId))
            .filter((map): map is NonNullable<typeof map> => Boolean(map));

          return (
            <div className="geo-section" key={section.id}>
              <div className="geo-section-head">
                <span className="geo-section-dot" style={{ background: chapter.color }} />
                <h2>{section.name}</h2>
                {section.status === "now" ? <span className="geo-section-now">Now</span> : null}
              </div>

              {maps.length === 0 ? (
                <p className="geo-section-none">No map for this 節 yet.</p>
              ) : (
                <div className="geo-map-grid">
                  {maps.map((map) => {
                    const ready = isGeographyMapReady(map);
                    const record = getGeographyMapRecord(section.id, map.id, progress);
                    const status = record?.status ?? "not-done";

                    const card = (
                      <>
                        <div className="geo-map-visual" style={{ background: chapter.dark }}>
                          <span>{map.sourceLabel}</span>
                          <strong>{map.jpShortTitle}</strong>
                          <small>{map.kind}</small>
                        </div>
                        <div className="geo-map-copy">
                          <span
                            className="geo-map-status"
                            style={{ background: chapter.tint, color: chapter.dark }}
                          >
                            {ready ? STATUS_LABEL[status] : "Coming soon"}
                          </span>
                          <h3>{map.title}</h3>
                          <p className="geo-map-jp-title">{map.jpTitle}</p>
                          <p>{map.summary}</p>
                          <p className="geo-map-jp">{map.jpSummary}</p>
                          <div className="geo-map-layers">
                            {map.layers.map((layer) => (
                              <span key={layer}>{layer}</span>
                            ))}
                          </div>
                          <div className="geo-map-foot">
                            <small>
                              {record?.quizScore
                                ? `Best quiz ${record.quizScore.correct}/${record.quizScore.total}`
                                : map.meta}
                            </small>
                            <b>{ready ? "Open map →" : "In progress"}</b>
                          </div>
                        </div>
                      </>
                    );

                    return ready ? (
                      <Link className="geo-map-card" href={`/geography/map/${map.id}`} key={map.id}>
                        {card}
                      </Link>
                    ) : (
                      <article className="geo-map-card geo-map-card--planned" key={map.id}>
                        {card}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Link className="ghost-button geo-back" href="/geography">
        ← All chapters
      </Link>
    </section>
  );
}
