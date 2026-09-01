"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { scienceSectionIsAuthored, scienceUnits } from "../../../content/subjects/science/curriculum";
import type { ScienceChapterMeta, ScienceSectionMeta } from "../../../content/subjects/science/types";
import {
  readScienceProgress,
  syncScienceProgressWithCloud,
  type ScienceBlockProgressMap
} from "../../data/scienceProgress";
import { ScienceTopbarHome } from "./ScienceTopbarHome";

/**
 * 理科ホーム, built to the shape of the math home: a welcome card with
 * つづきから, three stat blocks, and chapter cards that expand into their 節.
 *
 * Two things differ from math, both because the subject does:
 *
 * - Math switches 中1/中2/中3; 理科 is one book, so the tabs switch 単元
 *   instead. It is the same move — show one part of the book at a time.
 * - Math reads "done" off a hand-set `status` in its curriculum data. 理科 has
 *   real block progress, so a 節 counts as done when every tickable block in it
 *   is ticked. The number on screen is then something Leo earned rather than
 *   something an author typed.
 */
export function CurriculumHome({ blockCounts }: { blockCounts: Record<string, number> }) {
  const [progress, setProgress] = useState<ScienceBlockProgressMap>({});
  const [unitId, setUnitId] = useState(scienceUnits[0].id);
  const unit = scienceUnits.find((entry) => entry.id === unitId) ?? scienceUnits[0];

  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const first = scienceUnits[0].chapters.find((chapter) =>
      chapter.sections.some((section) => scienceSectionIsAuthored(section.id))
    );
    return first ? { [first.id]: true } : {};
  });

  useEffect(() => {
    const local = readScienceProgress();
    setProgress(local);
    void syncScienceProgressWithCloud(local).then(setProgress);
  }, []);

  function pickUnit(nextUnitId: string) {
    setUnitId(nextUnitId);
    const next = scienceUnits.find((entry) => entry.id === nextUnitId);
    const first = next?.chapters.find((chapter) =>
      chapter.sections.some((section) => scienceSectionIsAuthored(section.id))
    );
    setOpen(first ? { [first.id]: true } : {});
  }

  /** Ticked blocks of a section, capped at what the server says it holds. */
  function doneBlocks(sectionId: string) {
    const prefix = `${sectionId}::`;
    const ticked = Object.entries(progress).filter(
      ([key, record]) => key.startsWith(prefix) && record.status === "done"
    ).length;
    return Math.min(ticked, blockCounts[sectionId] ?? 0);
  }

  function isSectionDone(sectionId: string) {
    const total = blockCounts[sectionId] ?? 0;
    return total > 0 && doneBlocks(sectionId) >= total;
  }

  const openSectionsOf = (chapter: ScienceChapterMeta) =>
    chapter.sections.filter((section) => scienceSectionIsAuthored(section.id));

  /** Stats span the whole book, not just the unit on screen. */
  const allOpenSections = useMemo(
    () => scienceUnits.flatMap((u) => u.chapters.flatMap(openSectionsOf)),
    []
  );
  const doneSectionCount = allOpenSections.filter((section) => isSectionDone(section.id)).length;
  const doneBlockCount = useMemo(
    () => Object.values(progress).filter((record) => record.status === "done").length,
    [progress]
  );

  /** The first authored 節 that is not finished — where Leo left off. */
  const resume = useMemo(() => {
    for (const u of scienceUnits) {
      for (const chapter of u.chapters) {
        for (const section of openSectionsOf(chapter)) {
          if (!isSectionDone(section.id)) return { unit: u, chapter, section };
        }
      }
    }
    const first = allOpenSections[0];
    if (!first) return null;
    const chapter = scienceUnits.flatMap((u) => u.chapters).find((c) => c.id === first.chapterId);
    const u = scienceUnits.find((entry) => entry.chapters.some((c) => c.id === first.chapterId));
    return chapter && u ? { unit: u, chapter, section: first } : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, blockCounts]);

  return (
    <div
      className="sci-scope"
      style={
        { "--s-accent": unit.color, "--s-tint": unit.tint, "--s-dark": unit.dark } as React.CSSProperties
      }
    >
      <div className="sci-topbar">
        <div className="sci-home-topbar-inner">
          <ScienceTopbarHome />
          <span className="sci-topbar-brand">理科の学び</span>
          <span className="sci-unit-tabs sci-unit-tabs--home">
            {scienceUnits.map((entry) => (
              <button
                className={`sci-unit-tab sci-unit-tab--home${
                  entry.id === unit.id ? " sci-unit-tab--active" : ""
                }`}
                key={entry.id}
                onClick={() => pickUnit(entry.id)}
                type="button"
              >
                単元{entry.num}
              </button>
            ))}
          </span>
          <span className="sci-home-book-label">新編 新しい科学1</span>
          <span className="sci-home-student">レオ</span>
        </div>
      </div>

      <div className="sci-page sci-home-page">
        <div className="sci-stats-card">
          <div>
            <div className="sci-stats-greeting">おかえり、レオくん！</div>
            {resume ? (
              <div className="sci-stats-resume">
                つづきから：
                <Link href={`/science/${resume.chapter.id}/${resume.section.id}`}>
                  {resume.chapter.num ? `${resume.chapter.num}章 ` : `${resume.chapter.title} `}
                  {resume.section.name}
                </Link>
              </div>
            ) : (
              <div className="sci-stats-resume">教科書のスキャンがとどいたら、ここからはじめよう。</div>
            )}
          </div>
          <div className="sci-stat-block">
            <div className="sci-stat-value" style={{ color: "#4a9d6e" }}>
              {doneSectionCount}
              <span style={{ fontSize: 13 }}>/{allOpenSections.length}</span>
            </div>
            <div className="sci-stat-label">節 完了</div>
          </div>
          <div className="sci-stat-block">
            <div className="sci-stat-value" style={{ color: "#7c9a5e" }}>
              ♥ {doneBlockCount}
            </div>
            <div className="sci-stat-label">できた問題</div>
          </div>
          <div className="sci-stat-block">
            <div className="sci-stat-value" style={{ color: "#d9a441" }}>
              🔥 –
            </div>
            <div className="sci-stat-label">記録はこれから</div>
          </div>
        </div>

        <div className="sci-chapter-list">
          {unit.chapters.map((chapter) => {
            const sections = openSectionsOf(chapter);
            const done = sections.filter((section) => isSectionDone(section.id)).length;
            const pct = sections.length ? Math.round((done / sections.length) * 100) : 0;
            const isOpen = !!open[chapter.id];

            return (
              <div className="sci-chapter-card" key={chapter.id}>
                <button
                  className="sci-chapter-row"
                  disabled={sections.length === 0}
                  onClick={() => setOpen((current) => ({ ...current, [chapter.id]: !current[chapter.id] }))}
                  type="button"
                >
                  <span className="sci-chapter-badge">{chapter.num ?? "–"}</span>
                  <span className="sci-chapter-titles">
                    <span className="sci-chapter-title">
                      {chapter.num ? `第${chapter.num}章 ${chapter.title}` : chapter.title}
                    </span>
                    <span className="sci-chapter-subtitle">{chapter.subtitle}</span>
                  </span>
                  <span className="sci-chapter-end">
                    <span className="sci-chapter-pages">{chapter.pages}</span>
                    {sections.length > 0 ? (
                      <>
                        <span className="sci-progress-track" style={{ width: 110 }}>
                          <span
                            className="sci-progress-fill"
                            style={{ width: `${pct}%`, display: "block" }}
                          />
                        </span>
                        <span className="sci-chapter-progress-label">
                          {done} / {sections.length} 節
                        </span>
                        <span className={`sci-chapter-chevron${isOpen ? " sci-chapter-chevron--open" : ""}`}>
                          ▼
                        </span>
                      </>
                    ) : (
                      <span className="sci-chapter-soon">準備中</span>
                    )}
                  </span>
                </button>

                {isOpen && sections.length > 0 ? (
                  <div className="sci-section-list">
                    {sections.map((section) => (
                      <SectionRow
                        chapterId={chapter.id}
                        done={doneBlocks(section.id)}
                        key={section.id}
                        section={section}
                        total={blockCounts[section.id] ?? 0}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SectionRow({
  chapterId,
  done,
  section,
  total
}: {
  chapterId: string;
  done: number;
  section: ScienceSectionMeta;
  total: number;
}) {
  const complete = total > 0 && done >= total;
  const started = done > 0 && !complete;
  const label = complete ? "完了" : started ? "学習中" : "未学習";

  const dotStyle = complete
    ? { background: "#7c9a5e", color: "#fff", borderColor: "#7c9a5e" }
    : started
      ? { background: "var(--s-tint)", color: "var(--s-dark)", borderColor: "var(--s-accent)" }
      : { background: "#fff", color: "var(--s-dark)", borderColor: "#d6e4dc" };
  const statusStyle = complete
    ? { color: "#4a6b35", background: "#eef5e8" }
    : started
      ? { color: "var(--s-dark)", background: "var(--s-tint)" }
      : { color: "#9fb2a8", background: "#eef3f0" };

  return (
    <div className="sci-section-row-wrap">
      <Link className="sci-section-row" href={`/science/${chapterId}/${section.id}`}>
        <span className="sci-section-dot" style={dotStyle}>
          {complete ? "✓" : started ? "…" : ""}
        </span>
        <span className="sci-section-name">
          {section.kicker ? `${section.kicker} ` : ""}
          {section.name}
        </span>
        <span className="sci-section-pages">{section.pages}</span>
        <span className="sci-section-end">
          {total > 0 ? (
            <span className="sci-section-count">
              {done} / {total}
            </span>
          ) : null}
          <span className="sci-section-status" style={statusStyle}>
            {label}
          </span>
        </span>
      </Link>
      {section.digitalUrl ? (
        <a
          className="sci-companion-link"
          href={section.digitalUrl}
          rel="noopener noreferrer"
          target="_blank"
          title="デジタル教科書でこの節を開く"
        >
          📘 デジタル教科書
        </a>
      ) : null}
    </div>
  );
}
