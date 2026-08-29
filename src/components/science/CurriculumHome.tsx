"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { scienceSectionIsAuthored, scienceUnits } from "../../../content/subjects/science/curriculum";
import {
  readScienceProgress,
  syncScienceProgressWithCloud,
  type ScienceBlockProgressMap
} from "../../data/scienceProgress";
import { ScienceTopbarHome } from "./ScienceTopbarHome";

/**
 * 理科ホーム — the whole book's spine, with only the authored sections opening.
 * Leo-solo, per AGENTS.md: no teacher decks, no assign/review loop, just a way
 * to get to the thing and see how far through it he is.
 */
export function CurriculumHome({ blockCounts }: { blockCounts: Record<string, number> }) {
  const [progress, setProgress] = useState<ScienceBlockProgressMap>({});

  useEffect(() => {
    const local = readScienceProgress();
    setProgress(local);
    void syncScienceProgressWithCloud(local).then(setProgress);
  }, []);

  return (
    <div className="sci-scope">
      <div className="sci-topbar">
        <div className="sci-topbar-inner">
          <ScienceTopbarHome />
          <span className="sci-topbar-brand">理科の学び</span>
        </div>
      </div>

      <div className="sci-home">
      <header className="sci-home-head">
        <span className="sci-home-eyebrow">理科</span>
        <h1>新編 新しい科学1</h1>
        <p>
          東京書籍・中1。4単元13章のうち、いま開けるのは 単元1 第1章「生物の観察と分類のしかた」。
          ほかの章は教科書のスキャンが入ったら順に開いていくよ。
        </p>
      </header>

      {scienceUnits.map((unit) => (
        <section
          className="sci-unit"
          key={unit.id}
          style={
            { "--s-accent": unit.color, "--s-tint": unit.tint, "--s-dark": unit.dark } as React.CSSProperties
          }
        >
          <header className="sci-unit-head">
            <span className="sci-unit-num">単元 {unit.num}</span>
            <h2>{unit.title}</h2>
          </header>

          <div className="sci-chapter-grid">
            {unit.chapters.map((chapter) => {
              const openSections = chapter.sections.filter((section) =>
                scienceSectionIsAuthored(section.id)
              );

              return (
                <article
                  className={`sci-chapter${openSections.length ? " is-open" : " is-planned"}`}
                  key={chapter.id}
                >
                  <header>
                    <span className="sci-chapter-num">
                      {chapter.num ? `第${chapter.num}章` : chapter.title}
                    </span>
                    <h3>{chapter.num ? chapter.title : chapter.subtitle}</h3>
                    <span className="sci-chapter-pages">{chapter.pages}</span>
                  </header>

                  {openSections.length ? (
                    <ul className="sci-section-list">
                      {openSections.map((section) => {
                        // Block ids only exist on the server, but the progress
                        // map is keyed `<sectionId>::<blockId>` — so counting
                        // this section's done keys against the server's total
                        // is enough to draw the bar.
                        const total = blockCounts[section.id] ?? 0;
                        const doneCount = Math.min(countDone(section.id, progress), total);
                        const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

                        return (
                          <li key={section.id}>
                            <Link href={`/science/${chapter.id}/${section.id}`}>
                              <span className="sci-section-name">
                                {section.kicker ? `${section.kicker} ` : `${section.number} `}
                                {section.name}
                              </span>
                              <span className="sci-section-pages">{section.pages}</span>
                              {total > 0 ? (
                                <span className="sci-section-count">
                                  {doneCount} / {total}
                                </span>
                              ) : null}
                            </Link>
                            {total > 0 ? (
                              <div className="sci-progress-track sci-progress-track--thin">
                                <div
                                  className="sci-progress-fill"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="sci-chapter-planned">
                      教科書のスキャンが入ったら作ります。
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
      </div>
    </div>
  );
}

/** How many blocks of a section are ticked, whatever their ids are. */
function countDone(sectionId: string, progress: ScienceBlockProgressMap) {
  const prefix = `${sectionId}::`;
  return Object.entries(progress).filter(
    ([key, record]) => key.startsWith(prefix) && record.status === "done"
  ).length;
}
