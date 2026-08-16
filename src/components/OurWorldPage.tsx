"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readLessonProgress, syncLessonProgressWithCloud, type LessonProgressMap } from "@/data/lessonProgress";
import { isCheckpointComponent, teacherLessons } from "@/data/lessons";
import { LEVELS, UNITS_PER_LEVEL, unitTitle } from "@/data/curriculum";
import {
  fallbackCurrentUnit,
  readCurrentUnit,
  syncCurrentUnitWithCloud,
  type CurrentUnit
} from "@/data/currentUnit";

type SequenceItem = {
  kind: "unit" | "review" | "reading" | "level-test";
  number?: number;
  title: string;
  subtitle: string;
  state: "planned" | "active" | "locked";
  lessonCount: number;
  taught: number;
  /** Set on a built checkpoint row so it opens its deck directly — checkpoints
      have no unit page of their own to land on. */
  lessonId?: string;
};

// The sequence used to be a hardcoded Level 4 list, so the level buttons had
// nothing to switch between and every level showed Level 4's units under the
// wrong titles. It is now derived: unit titles come from the shared per-level
// map, lesson counts from the authored lessons, and planned/active/locked from
// the current-unit cursor.
function buildSequence(level: number, cursor: CurrentUnit, progress: LessonProgressMap): SequenceItem[] {
  const items: SequenceItem[] = [];

  for (let unit = 1; unit <= UNITS_PER_LEVEL; unit++) {
    const unitLessons = teacherLessons.filter(
      (lesson) => lesson.level === level && lesson.unit === unit && !isCheckpointComponent(lesson.component)
    );
    const taught = unitLessons.filter((lesson) => progress[lesson.id]?.status === "done").length;

    const state: SequenceItem["state"] = unitLessons.length
      ? "active"
      : level > cursor.level || (level === cursor.level && unit > cursor.unit)
        ? "locked"
        : "planned";

    items.push({
      kind: "unit",
      number: unit,
      title: unitTitle(level, unit),
      subtitle: unitLessons.length ? `${unitLessons.length} teaching components` : "Not built yet",
      state,
      lessonCount: unitLessons.length,
      taught
    });

    // Checkpoints land after each three-unit band. Their lesson records carry
    // the band's last unit number, so they are found from this unit but counted
    // separately from it.
    if (unit % 3 === 0) {
      const band = `${unit - 2}–${unit}`;
      const bandLocked = level > cursor.level || (level === cursor.level && unit > cursor.unit);
      const checkpointItem = (kind: "review" | "reading", component: string, title: string, subtitle: string) => {
        const built = teacherLessons.filter(
          (lesson) => lesson.level === level && lesson.unit === unit && lesson.component === component
        );
        const taughtCount = built.filter((lesson) => progress[lesson.id]?.status === "done").length;
        return {
          kind,
          title,
          subtitle: built.length ? built[0].title : subtitle,
          state: built.length ? ("active" as const) : bandLocked ? ("locked" as const) : ("planned" as const),
          lessonCount: built.length,
          taught: taughtCount,
          lessonId: built[0]?.id
        };
      };

      items.push(
        checkpointItem("review", "review", `Review · Units ${band}`, "Mixed quiz, grammar and reading from this band.")
      );
      items.push(
        checkpointItem(
          "reading",
          "extra-reading",
          `Extra Reading ${unit / 3}`,
          "Extra reading to stretch a little further."
        )
      );
    }
  }

  items.push({
    kind: "level-test",
    title: `Review · Units 1–${UNITS_PER_LEVEL} · Level test`,
    subtitle: "Level-wide review and checkpoint.",
    state: level < cursor.level ? "planned" : "locked",
    lessonCount: 0,
    taught: 0
  });

  return items;
}

export function OurWorldPage() {
  const [progress, setProgress] = useState<LessonProgressMap>({});
  const [currentUnit, setCurrentUnit] = useState<CurrentUnit>(fallbackCurrentUnit);
  const [selectedLevel, setSelectedLevel] = useState(fallbackCurrentUnit.level);

  useEffect(() => {
    const local = readCurrentUnit();
    setCurrentUnit(local);
    setSelectedLevel(local.level);
    void syncCurrentUnitWithCloud(local).then((synced) => {
      setCurrentUnit(synced);
      setSelectedLevel(synced.level);
    });
  }, []);

  useEffect(() => {
    const refresh = () => {
      const localProgress = readLessonProgress();
      setProgress(localProgress);
      void syncLessonProgressWithCloud(localProgress).then(setProgress);
    };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener("focus", refresh); };
  }, []);

  const sequence = useMemo(
    () => buildSequence(selectedLevel, currentUnit, progress),
    [selectedLevel, currentUnit, progress]
  );
  const levelLessons = useMemo(
    () => teacherLessons.filter((lesson) => lesson.level === selectedLevel),
    [selectedLevel]
  );
  const levelTaught = levelLessons.filter((lesson) => progress[lesson.id]?.status === "done").length;
  // Checkpoint decks are built band by band, so the header can only claim they
  // are all still planned while this level really has none.
  const levelCheckpoints = levelLessons.filter((lesson) => isCheckpointComponent(lesson.component)).length;
  const checkpointNote = levelCheckpoints ? `${levelCheckpoints} checkpoint lessons built` : "checkpoints planned";
  const currentUnitLessons = teacherLessons.filter(
    (lesson) => lesson.level === currentUnit.level && lesson.unit === currentUnit.unit
  );

  return (
    <section className="ow-page ow-page--final">
      <section className="ow-design-hero">
        <div>
          <span>National Geographic</span>
          <h1>Our<br />World</h1>
          <p>6 levels · 9 units each · explore the planet in English.</p>
          <div className="ow-hero-chips">
            <span>{teacherLessons.length} teacher lessons built</span>
            <span>Level {currentUnit.level} of {LEVELS.length}</span>
          </div>
        </div>
        <aside>
          <span>Continue</span>
          <small>Level {currentUnit.level} · Unit {currentUnit.unit}</small>
          <strong>{unitTitle(currentUnit.level, currentUnit.unit)}</strong>
          <Link href={`/english/our-world/level-${currentUnit.level}/unit-${currentUnit.unit}`}>Keep going →</Link>
        </aside>
      </section>

      <div className="ow-level-picker">
        <span>Choose a level</span>
        <div>
          {LEVELS.map((level) => {
            const built = teacherLessons.some((lesson) => lesson.level === level);
            return (
              <button
                aria-pressed={level === selectedLevel}
                className={level === selectedLevel ? "active" : built ? "" : "locked"}
                key={level}
                onClick={() => setSelectedLevel(level)}
                type="button"
              >
                Level {level}
                {built ? "" : " · planned"}
              </button>
            );
          })}
        </div>
      </div>

      <section className="ow-sequence">
        <header>
          <h2>Level {selectedLevel} · {UNITS_PER_LEVEL} units</h2>
          <span>
            {levelLessons.length
              ? `${levelTaught} of ${levelLessons.length} lessons taught · ${checkpointNote}`
              : "No lessons built for this level yet · checkpoints planned"}
          </span>
        </header>
        <div className="ow-sequence-list">
          {sequence.map((item, index) => (
            <SequenceRow item={item} key={`${item.kind}-${item.number ?? index}`} level={selectedLevel} />
          ))}
        </div>
      </section>
    </section>
  );
}

function SequenceRow({ item, level }: { item: SequenceItem; level: number }) {
  const content = (
    <>
      <span className="ow-sequence-icon">{item.kind === "unit" ? item.number : item.kind === "reading" ? "📖" : "▦"}</span>
      <div className="ow-sequence-copy">
        <small>{item.kind === "unit" ? `Unit ${item.number}` : item.kind === "reading" ? "Bonus" : "Checkpoint · Review"}</small>
        <h3>{item.title}</h3>
        <p>{item.subtitle}</p>
      </div>
      <span className={`ow-sequence-status status-${item.state}`}>
        {item.state === "active"
          ? `${item.taught} / ${item.lessonCount} lessons`
          : item.state === "locked"
            ? "🔒 Locked"
            : "Planned"}
      </span>
      <span className="ow-sequence-arrow">›</span>
    </>
  );

  // Only units that actually have authored lessons are navigable; a built
  // checkpoint opens its own deck.
  const href = item.lessonId
    ? `/lessons/${item.lessonId}`
    : item.kind === "unit" && item.number != null && item.lessonCount > 0
      ? `/english/our-world/level-${level}/unit-${item.number}`
      : null;

  return href
    ? <Link className="ow-sequence-row active" href={href}>{content}</Link>
    : <article className={`ow-sequence-row ${item.kind} ${item.state}`}>{content}</article>;
}
