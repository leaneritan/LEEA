"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdjacentSections } from "../../../content/subjects/science/curriculum";
import {
  isScienceStatefulBlock,
  type ScienceChapterMeta,
  type ScienceSection,
  type ScienceUnitMeta
} from "../../../content/subjects/science/types";
import {
  createScienceBlockProgressRecord,
  getSectionCompletionPercent,
  isBlockDone,
  mergeScienceRecords,
  readScienceProgress,
  saveScienceBlockProgress,
  syncScienceProgressWithCloud,
  type ScienceBlockProgressMap
} from "../../data/scienceProgress";
import { ScienceTopbarHome } from "./ScienceTopbarHome";
import { SectionBlockList } from "./SectionBlocks";

export function SectionView({
  unit,
  chapter,
  section
}: {
  unit: ScienceUnitMeta;
  chapter: ScienceChapterMeta;
  section: ScienceSection;
}) {
  const [progress, setProgress] = useState<ScienceBlockProgressMap>({});
  const statefulBlockIds = section.blocks.filter(isScienceStatefulBlock).map((block) => block.id);

  useEffect(() => {
    const local = readScienceProgress();
    setProgress(local);
    void syncScienceProgressWithCloud(local).then(setProgress);
  }, []);

  function record(blockId: string, done: boolean, quizScore: { correct: number; total: number } | null) {
    const next = createScienceBlockProgressRecord(section.id, blockId, done, quizScore);
    const key = `${section.id}::${blockId}`;
    // Merge on screen with the same rule the store uses, or a replayed widget
    // would visibly lose its tick until the next reload put it back.
    setProgress((current) => ({ ...current, [key]: mergeScienceRecords(current[key], next) }));
    void saveScienceBlockProgress(next);
  }

  function toggleDone(blockId: string) {
    record(blockId, !isBlockDone(section.id, blockId, progress), null);
  }

  /**
   * A widget run only marks the block done when Leo got everything right —
   * a partial run still saves its score, so the tick means what it says.
   */
  function handleWidgetScored(blockId: string, correct: number, total: number) {
    record(blockId, total > 0 && correct === total, { correct, total });
  }

  const percent = getSectionCompletionPercent(section.id, statefulBlockIds, progress);
  const { prev, next } = getAdjacentSections(section.id);
  const sectionMeta = chapter.sections.find((entry) => entry.id === section.id);

  return (
    <div
      className="sci-scope"
      style={
        { "--s-accent": unit.color, "--s-tint": unit.tint, "--s-dark": unit.dark } as React.CSSProperties
      }
    >
      <div className="sci-topbar">
        <div className="sci-topbar-inner">
          <ScienceTopbarHome />
          <Link className="sci-topbar-brand" href="/science">
            ← 理科の学び
          </Link>
          <span className="sci-topbar-sep">｜</span>
          <span className="sci-topbar-chapter">
            <span className="sci-topbar-dot" />
            単元{unit.num} {chapter.num ? `第${chapter.num}章` : chapter.title}
          </span>
          <span className="sci-topbar-chevron">›</span>
          <span className="sci-topbar-section">
            {section.kicker ?? `${section.number} ${section.title}`}
          </span>
          {sectionMeta?.digitalUrl ? (
            <a
              className="sci-companion-link"
              href={sectionMeta.digitalUrl}
              rel="noopener noreferrer"
              target="_blank"
              title="デジタル教科書でこの節を開く"
            >
              📘 デジタル教科書
            </a>
          ) : null}
          <div className="sci-topbar-progress">
            <div className="sci-progress-track">
              <div className="sci-progress-fill" style={{ width: `${percent}%` }} />
            </div>
            <span className="sci-progress-label">{percent}%</span>
          </div>
        </div>
      </div>

      <div className="sci-page">
        <SectionBlockList
          blocks={section.blocks}
          isBlockDone={(blockId) => isBlockDone(section.id, blockId, progress)}
          onToggleDone={toggleDone}
          onWidgetScored={handleWidgetScored}
        />

        <div className="sci-section-nav">
          {prev ? (
            <Link className="sci-nav-link sci-nav-link--prev" href={`/science/${prev.chapterId}/${prev.id}`}>
              ← {prev.kicker ?? prev.name}
            </Link>
          ) : (
            <Link className="sci-nav-link sci-nav-link--prev" href="/science">
              ← 理科ホーム
            </Link>
          )}
          {next ? (
            <Link className="sci-nav-link sci-nav-link--next" href={`/science/${next.chapterId}/${next.id}`}>
              {next.kicker ?? next.name} →
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
