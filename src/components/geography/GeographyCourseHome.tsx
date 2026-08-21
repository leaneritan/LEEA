"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  geographyChapters,
  geographyFields,
  getGeographyChaptersByField
} from "../../../content/subjects/geography/curriculum";
import type { GeographyField } from "../../../content/subjects/geography/types";
import {
  geographyMaps,
  getGeographyMapById,
  getUnplacedGeographyMaps,
  isGeographyMapReady
} from "../../../content/subjects/geography/maps";
import {
  getChapterCompletionPercent,
  readGeographyProgress,
  syncGeographyProgressWithCloud,
  type GeographyProgressMap
} from "@/data/geographyProgress";

function mapIsReady(mapId: string) {
  const map = getGeographyMapById(mapId);
  return Boolean(map && isGeographyMapReady(map));
}

// Resolved once at module scope: which 節 Leo should be pointed at, and the
// 分野 it belongs to. Both derive from the spine, so neither is hardcoded.
const RESUME = findResumeTarget();

export function GeographyCourseHome() {
  const [progress, setProgress] = useState<GeographyProgressMap>({});
  // Open on the 分野 the Continue card points at, so the tab and the banner
  // never disagree about where Leo left off.
  const [field, setField] = useState<GeographyField>(RESUME?.chapter.field ?? "geography");
  const chapters = getGeographyChaptersByField(field);
  const unplaced = getUnplacedGeographyMaps();

  useEffect(() => {
    const local = readGeographyProgress();
    setProgress(local);
    void syncGeographyProgressWithCloud(local).then(setProgress);
  }, []);

  const readyCount = geographyMaps.filter(isGeographyMapReady).length;

  const doneCount = useMemo(
    () => Object.values(progress).filter((record) => record.status === "done").length,
    [progress]
  );

  const resume = RESUME;

  return (
    <section className="geo-hub">
      <header className="screen-heading">
        <span>Subject</span>
        <h1>Geography</h1>
        <p>
          Leo&apos;s 社会 course, taught through maps he can move. Every chapter below is a real place in the
          curriculum; the ones with a built map open straight into it.
        </p>
      </header>

      {resume ? (
        <Link className="geo-resume" href={`/geography/map/${resume.map.id}`}>
          <span className="geo-resume-label">Continue</span>
          <div>
            <strong>{resume.map.title}</strong>
            <small>
              {resume.chapter.num} {resume.chapter.title} · {resume.section.name}
            </small>
          </div>
          <b>→</b>
        </Link>
      ) : null}

      <div className="geo-stats">
        <div className="geo-stat"><span>Maps ready</span><strong>{readyCount}</strong><small>open and explorable</small></div>
        <div className="geo-stat"><span>Maps finished</span><strong>{doneCount}</strong><small>quiz completed</small></div>
        <div className="geo-stat"><span>Chapters</span><strong>{geographyChapters.length}</strong><small>across both 分野</small></div>
      </div>

      <div className="geo-field-switch" role="tablist" aria-label="Field">
        {geographyFields.map((entry) => (
          <button
            aria-selected={field === entry.key}
            className={field === entry.key ? "geo-field-btn geo-field-btn--active" : "geo-field-btn"}
            key={entry.key}
            onClick={() => setField(entry.key)}
            role="tab"
            type="button"
          >
            {entry.englishLabel}
            <small>{entry.label}</small>
          </button>
        ))}
      </div>

      <p className="geo-field-blurb">{geographyFields.find((entry) => entry.key === field)?.blurb}</p>

      <div className="geo-chapter-grid">
        {chapters.map((chapter) => {
          const completion = getChapterCompletionPercent(chapter.sections, progress, mapIsReady);
          const readyInChapter = chapter.sections.flatMap((section) => section.mapIds.filter(mapIsReady)).length;

          return (
            <Link className="geo-chapter-card" href={`/geography/${chapter.id}`} key={chapter.id}>
              <div className="geo-chapter-band" style={{ background: chapter.color }}>
                <span>{chapter.num}</span>
                <strong>{chapter.title}</strong>
              </div>
              <div className="geo-chapter-body">
                <p className="geo-chapter-subtitle">{chapter.subtitle}</p>
                <div className="geo-chapter-meter" aria-label={`${completion.percent}% complete`}>
                  <i style={{ width: `${completion.percent}%`, background: chapter.color }} />
                </div>
                <div className="geo-chapter-foot">
                  <small>
                    {chapter.sections.length} 節 ·{" "}
                    {readyInChapter === 0 ? "no map yet" : `${completion.done}/${completion.total} finished`}
                  </small>
                  <b style={{ color: chapter.dark }}>{readyInChapter === 0 ? "Planned" : "Open →"}</b>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {unplaced.length ? (
        <div className="geo-empty">
          <strong>{unplaced.length} map{unplaced.length === 1 ? "" : "s"} not filed in a 節</strong>
          <span>
            {unplaced.map((map) => map.id).join(", ")} — add the id to the owning 節&apos;s <code>mapIds</code> in{" "}
            <code>content/subjects/geography/curriculum.ts</code>.
          </span>
        </div>
      ) : null}
    </section>
  );
}

/**
 * The first 節 marked "now" that actually has a built map, falling back to the
 * first built map anywhere — so Continue never lands Leo on a placeholder.
 */
function findResumeTarget() {
  for (const pass of ["now", "any"] as const) {
    for (const chapter of geographyChapters) {
      for (const section of chapter.sections) {
        if (pass === "now" && section.status !== "now") continue;
        const mapId = section.mapIds.find(mapIsReady);
        if (mapId) return { chapter, section, map: getGeographyMapById(mapId)! };
      }
    }
  }
  return null;
}
