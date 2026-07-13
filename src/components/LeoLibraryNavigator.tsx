"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AssignmentMap } from "@/data/assignments";
import { getLevelStatus, LEVELS, LIVE_LEVEL, LIVE_UNIT, UNIT_TITLES } from "@/data/curriculum";
import { getLearnerAppProgress, type LearnerAppProgress } from "@/data/learnerProgress";
import type { LessonGroup } from "@/data/lessons";
import { getComponentMeta, type ComponentTone } from "./componentMeta";

const UNIT_NUMBERS = UNIT_TITLES.map((_, index) => index + 1);

// Canonical 8-lesson spine used whenever a level/unit has no authored lesson
// content yet (levels 5-6, and every unit outside the live Level 4 · Units
// 7-9 window). Every app in these units renders "Not assigned" instead of
// fabricating fake progress/quiz scores, and instead of crashing on missing data.
const PLACEHOLDER_SPINE: Array<{ key: string; title: string }> = [
  { key: "opener", title: "Opener" },
  { key: "vocab-1", title: "Vocabulary 1" },
  { key: "song", title: "Song" },
  { key: "grammar-1", title: "Grammar 1" },
  { key: "vocab-2", title: "Vocabulary 2" },
  { key: "grammar-2", title: "Grammar 2" },
  { key: "reading", title: "Reading" },
  { key: "writing", title: "Writing" }
];

const CATEGORY_TINTS: Record<ComponentTone, string> = {
  opener: "#f7efdd",
  vocab: "#eef4ea",
  song: "#f9ecf2",
  grammar: "#eaf1f8",
  reading: "#f6ecd9",
  writing: "#fdf0e6",
  activity: "#eef5fb",
  review: "#eef4ea"
};

type RowStatus = "done" | "redo" | "todo" | "na";

type LibraryRow = {
  id: string;
  lessonId?: string;
  tone: ComponentTone;
  emoji: string;
  title: string;
  description: string;
  caption?: string;
  completedModules: number;
  moduleCount: number;
  score: number | null;
  status: RowStatus;
};

function cleanLibraryTitle(title: string) {
  return title.replace(/^Unit \d+ /, "").replace(/ App$/, "").replace(/ Leo's Test App$/, "");
}

function buildRows(
  group: LessonGroup | undefined,
  assignments: AssignmentMap,
  appProgress: Record<string, LearnerAppProgress>
): LibraryRow[] {
  if (group && group.lessons.length) {
    return group.lessons.map((lesson) => {
      const meta = getComponentMeta(lesson.component);
      const assignment = assignments[lesson.id];
      const progress = appProgress[lesson.id] ?? getLearnerAppProgress(lesson.source);
      const status: RowStatus = progress.done
        ? "done"
        : assignment?.status === "needs-redo"
          ? "redo"
          : assignment
            ? "todo"
            : "na";
      return {
        id: lesson.id,
        lessonId: lesson.id,
        tone: meta.tone,
        emoji: meta.emoji,
        title: cleanLibraryTitle(lesson.title),
        description: lesson.subtitle,
        caption: progress.caption || undefined,
        completedModules: progress.completedModules,
        moduleCount: progress.moduleCount,
        score: progress.score,
        status
      };
    });
  }

  return PLACEHOLDER_SPINE.map((item) => {
    const meta = getComponentMeta(item.key);
    return {
      id: item.key,
      tone: meta.tone,
      emoji: meta.emoji,
      title: item.title,
      description: "Dad hasn't built this app yet — check back once this unit is ready.",
      completedModules: 0,
      moduleCount: 0,
      score: null,
      status: "na"
    };
  });
}

export function LeoLibraryNavigator({
  groups,
  assignments,
  appProgress
}: {
  groups: LessonGroup[];
  assignments: AssignmentMap;
  appProgress: Record<string, LearnerAppProgress>;
}) {
  const [selectedLevel, setSelectedLevel] = useState(LIVE_LEVEL);
  const [selectedUnit, setSelectedUnit] = useState(LIVE_UNIT);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const levelGroups = useMemo(() => groups.filter((group) => group.level === selectedLevel), [groups, selectedLevel]);
  const findGroup = (unit: number) => levelGroups.find((group) => group.unit === unit);

  const unitSummaries = useMemo(
    () =>
      UNIT_NUMBERS.map((unit) => {
        const rows = buildRows(findGroup(unit), assignments, appProgress);
        const doneCount = rows.filter((row) => row.status === "done").length;
        const hasRedo = rows.some((row) => row.status === "redo");
        return { unit, isFullyDone: rows.length > 0 && doneCount === rows.length, hasRedo };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [levelGroups, assignments, appProgress]
  );

  const selectedRows = useMemo(
    () => buildRows(findGroup(selectedUnit), assignments, appProgress),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [levelGroups, selectedUnit, assignments, appProgress]
  );
  const selectedDone = selectedRows.filter((row) => row.status === "done").length;
  const selectedRedo = selectedRows.filter((row) => row.status === "redo").length;
  const selectedPercent = selectedRows.length ? Math.round((selectedDone / selectedRows.length) * 100) : 0;

  function selectLevel(level: number) {
    setSelectedLevel(level);
    setSelectedUnit(level === LIVE_LEVEL ? LIVE_UNIT : 1);
  }

  function toggleRow(rowId: string) {
    setExpandedRows((current) => ({ ...current, [rowId]: !current[rowId] }));
  }

  return (
    <>
      <div className="leo-lib-navigator">
        <div>
          <span className="leo-lib-label">Level</span>
          <div className="leo-lib-level-tabs" role="tablist" aria-label="Level">
            {LEVELS.map((level) => {
              const status = getLevelStatus(level);
              const isSelected = level === selectedLevel;
              return (
                <button
                  aria-selected={isSelected}
                  className={`leo-lib-level-tab level-${level}${isSelected ? " is-selected" : ""}${
                    status === "locked" && !isSelected ? " is-locked" : ""
                  }`}
                  key={level}
                  onClick={() => selectLevel(level)}
                  role="tab"
                  type="button"
                >
                  <i aria-hidden="true" className="leo-lib-level-dot" />
                  Level {level}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="leo-lib-label leo-lib-unit-label">
            <i aria-hidden="true" className={`leo-lib-unit-dot level-${selectedLevel}`} />
            Choose a unit
          </span>
          <div aria-label="Unit" className="leo-lib-unit-chips" role="tablist">
            {UNIT_TITLES.map((title, index) => {
              const unitNumber = index + 1;
              const isSelected = unitNumber === selectedUnit;
              const summary = unitSummaries[index];
              const mark = summary.isFullyDone ? " · ✓" : summary.hasRedo ? " · redo" : "";
              return (
                <button
                  aria-selected={isSelected}
                  className={`leo-lib-unit-chip level-${selectedLevel}${isSelected ? " is-selected" : ""}`}
                  key={unitNumber}
                  onClick={() => setSelectedUnit(unitNumber)}
                  role="tab"
                  type="button"
                >
                  <span>
                    UNIT {unitNumber}
                    {mark}
                  </span>
                  <strong>{title}</strong>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`leo-lib-roster level-${selectedLevel}`}>
        <div className="leo-lib-roster-header">
          <span>Our World</span>
          <div className="leo-lib-roster-heading">
            <i aria-hidden="true" className={`leo-lib-unit-dot level-${selectedLevel}`} />
            <b>Level {selectedLevel}</b>
            <span>· Unit {selectedUnit}</span>
          </div>
          {selectedRedo > 0 ? <span className="leo-lib-redo-chip">{selectedRedo} needs redo</span> : null}
          <div className="leo-lib-roster-progress">
            <i>
              <b style={{ width: `${selectedPercent}%` }} />
            </i>
            <span>
              {selectedDone} / {selectedRows.length} done
            </span>
          </div>
        </div>

        <div>
          {selectedRows.map((row) => (
            <LibraryRowView expanded={!!expandedRows[row.id]} key={row.id} onToggle={() => toggleRow(row.id)} row={row} />
          ))}
        </div>
      </div>
    </>
  );
}

function LibraryRowView({ row, expanded, onToggle }: { row: LibraryRow; expanded: boolean; onToggle: () => void }) {
  const iconBg = CATEGORY_TINTS[row.tone];
  const pct = row.moduleCount ? Math.round((row.completedModules / row.moduleCount) * 100) : 0;
  const barColor = row.status === "done" ? "#9cb98c" : row.status === "redo" ? "#d96b52" : "#d8dcd2";
  const quizText = row.score != null ? `Quiz ${row.score}%` : row.status === "na" ? "Not assigned" : "Quiz not started";
  const quizColor = row.status === "redo" ? "#c0492f" : "#94a08c";
  const btnLabel = row.status === "redo" ? "Try again" : row.status === "done" ? "Replay" : "Open";
  const btnClass = row.status === "redo" ? "leo-lib-btn-redo" : row.status === "done" ? "leo-lib-btn-done" : "leo-lib-btn-open";

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  }

  return (
    <div className="leo-lib-row-wrap">
      <div
        aria-expanded={expanded}
        className="leo-lib-row"
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <span className="leo-lib-row-icon" style={{ background: iconBg }}>
          {row.emoji}
        </span>
        <span className="leo-lib-row-title">{row.title}</span>
        <div className="leo-lib-row-meter">
          <i>
            <b style={{ width: `${pct}%`, background: barColor }} />
          </i>
          <span>
            {row.completedModules}/{row.moduleCount}
          </span>
        </div>
        <span className="leo-lib-row-quiz" style={{ color: quizColor }}>
          {quizText}
        </span>
        {row.lessonId ? (
          <Link className={`leo-lib-row-action ${btnClass}`} href={`/lessons/${row.lessonId}`} onClick={(event) => event.stopPropagation()}>
            {btnLabel}
          </Link>
        ) : (
          <span className={`leo-lib-row-action ${btnClass}`}>{btnLabel}</span>
        )}
        <span className="leo-lib-row-chevron">{expanded ? "▾" : "▸"}</span>
      </div>
      {expanded ? (
        <div className="leo-lib-row-detail">
          <p>{row.description}</p>
          {row.caption ? (
            <div className="leo-lib-caption">
              <span>Leo&apos;s caption</span>
              <p>{row.caption}</p>
            </div>
          ) : null}
          <div>
            <Link className="leo-lib-ref-link" href="/reference">
              Reference
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
