"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdjacentSections } from "../../../content/subjects/math/curriculum";
import type { MathChapterMeta, MathSection } from "../../../content/subjects/math/types";
import {
  createMathBlockProgressRecord,
  getSectionCompletionPercent,
  isBlockDone,
  readMathProgress,
  saveMathBlockProgress,
  syncMathProgressWithCloud,
  type MathBlockProgressMap
} from "../../data/mathProgress";
import { ChatPanel } from "./ChatPanel";
import { SectionBlockList } from "./SectionBlockList";

export function SectionView({ chapter, section }: { chapter: MathChapterMeta; section: MathSection }) {
  const [progress, setProgress] = useState<MathBlockProgressMap>({});
  const practiceBlockIds = section.blocks.filter((block) => block.type === "practice" || block.type === "quickcheck").map((block) => block.id);

  useEffect(() => {
    const local = readMathProgress();
    setProgress(local);
    void syncMathProgressWithCloud(local).then(setProgress);
  }, []);

  function toggleDone(blockId: string) {
    const nextDone = !isBlockDone(section.id, blockId, progress);
    const record = createMathBlockProgressRecord(section.id, blockId, nextDone);
    setProgress((current) => ({ ...current, [`${section.id}::${blockId}`]: record }));
    void saveMathBlockProgress(record);
  }

  const percent = getSectionCompletionPercent(section.id, practiceBlockIds, progress);
  const { prev, next } = getAdjacentSections(chapter.id, section.id);

  return (
    <div className="math-scope" style={{ "--m-accent": chapter.color, "--m-tint": chapter.tint, "--m-dark": chapter.dark } as React.CSSProperties}>
      <div className="math-topbar">
        <div className="math-topbar-inner">
          <Link className="math-topbar-brand" href="/">
            ← 数学の学び
          </Link>
          <span className="math-topbar-sep">｜</span>
          <span className="math-topbar-chapter">
            <span className="math-topbar-dot" />
            {chapter.num}章 {chapter.title}
          </span>
          <span className="math-topbar-chevron">›</span>
          <span className="math-topbar-section">
            {section.kicker ?? `${section.number}節 ${section.title}`}
          </span>
          <div className="math-topbar-progress">
            <div className="math-progress-track">
              <div className="math-progress-fill" style={{ width: `${percent}%` }} />
            </div>
            <span className="math-progress-label">{percent}%</span>
          </div>
        </div>
      </div>

      <div className="math-page">
        <SectionBlockList
          blocks={section.blocks}
          isBlockDone={(blockId) => isBlockDone(section.id, blockId, progress)}
          onTogglePracticeDone={toggleDone}
        />

        <div className="math-section-nav">
          {prev ? (
            <Link className="math-nav-link math-nav-link--prev" href={`/math/${chapter.id}/${prev.id}`}>
              ← {prev.name}
            </Link>
          ) : (
            <Link className="math-nav-link math-nav-link--prev" href="/math">
              ← 数学ホーム
            </Link>
          )}
          {next ? (
            <Link className="math-nav-link math-nav-link--next" href={`/math/${chapter.id}/${next.id}`}>
              {next.name} →
            </Link>
          ) : null}
        </div>
      </div>

      <ChatPanel chapterTitle={`${chapter.num}章 ${chapter.title}`} sectionTitle={`${section.number}節 ${section.title}`} blocks={section.blocks} />
    </div>
  );
}
