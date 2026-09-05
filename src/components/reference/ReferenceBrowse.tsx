"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, Dumbbell, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useJapanesePreference } from "@/components/AppShell";
import { useCurrentUnit } from "@/components/useCurrentUnit";
import { useKnownWordIds } from "@/components/useKnownWordIds";
import { LEVEL_COLORS, LEVEL_TINTS, OUR_WORLD_LEVELS, OUR_WORLD_TOTAL_UNITS, OUR_WORLD_UNIT_TOTALS } from "@/data/reference-units";
import type { GrammarEntry, WordEntry } from "@/data/reference-shapes";
import { allGrammar, allWords, groupByCourse, groupByLevel, sourceTree, type TreeLevel, type TreeUnit } from "./ref-data";
import { posPillClass } from "./pos-pill";

type TabKey = "browse" | "vocabulary" | "grammar";
type ScopeCourse = "all" | "our-world" | "joyful-work" | "junior-high" | "training-ground";
type ScopeLevel = "all" | number;

const COURSES: Array<{ key: ScopeCourse; label: string }> = [
  { key: "all", label: "All courses" },
  { key: "our-world", label: "Our World" },
  { key: "joyful-work", label: "Joyful Work" },
  { key: "junior-high", label: "Junior High" },
  { key: "training-ground", label: "Training Ground" }
];

const POS_LABELS: Record<string, string> = {
  verb: "verb",
  noun: "noun",
  adjective: "adjective",
  adverb: "adverb",
  "adj/adv": "adj/adv",
  phrase: "phrase",
  other: "other"
};

function courseColor(course: ScopeCourse | "our-world" | "joyful-work" | "junior-high") {
  if (course === "joyful-work") return "var(--ref-course-jw)";
  if (course === "junior-high") return "var(--ref-course-jh)";
  if (course === "training-ground") return "var(--ref-course-tg)";
  return "var(--ref-course-ow)";
}

function courseLabel(course: ScopeCourse | "our-world" | "joyful-work" | "junior-high") {
  const found = COURSES.find((c) => c.key === course);
  return found?.label ?? "Our World";
}

/* Every word/grammar's inclusion in scope is derived from this single
   predicate — Browse, Vocabulary and Grammar all call the same function so
   they can never disagree about what "in scope" means. */
function wordInScope(word: WordEntry, course: ScopeCourse, level: ScopeLevel): boolean {
  if (course === "all") return true;
  if (course === "training-ground") return false;
  return word.sources.some((source) => source.course === course && (level === "all" || source.level === level));
}

function grammarInScope(grammar: GrammarEntry, course: ScopeCourse, level: ScopeLevel): boolean {
  if (course === "all") return true;
  if (course === "training-ground") return false;
  return grammar.course === course && (level === "all" || grammar.level === level);
}

/* A word can carry sources from several units/levels/courses (one card,
   many sources). Rows must show the source that actually put the word in
   the CURRENT scope, not just sources[0] — otherwise a Level 4 row could
   show an OW2-U9 tag, contradicting the scope bar above it. */
function pickScopedSource(word: WordEntry, course: ScopeCourse, level: ScopeLevel) {
  if (course !== "all" && course !== "training-ground") {
    const match = word.sources.find((source) => source.course === course && (level === "all" || source.level === level));
    if (match) return match;
  }
  return word.sources[0];
}

const owCourseTree = sourceTree.find((c) => c.course === "our-world");
function importedUnitsForLevel(level: number) {
  return owCourseTree?.levels.find((l) => l.level === level)?.units.length ?? 0;
}
const owImportedTotal = OUR_WORLD_LEVELS.reduce((sum, level) => sum + importedUnitsForLevel(level), 0);

function courseMeta(key: ScopeCourse): string {
  if (key === "all") return `${allWords.length} words · ${allGrammar.length} grammar`;
  if (key === "our-world") {
    return `${OUR_WORLD_LEVELS.length} levels · ${owImportedTotal} of ${OUR_WORLD_TOTAL_UNITS} units imported`;
  }
  const wordCount = allWords.filter((word) => word.sources.some((source) => source.course === key)).length;
  const grammarCount = allGrammar.filter((grammar) => grammar.course === key).length;
  const total = wordCount + grammarCount;
  return total ? `${total} imported` : "not imported yet";
}

export function ReferenceBrowse() {
  const [tab, setTab] = useState<TabKey>("browse");
  const [course, setCourse] = useState<ScopeCourse>("our-world");
  // Opens on, and marks as active, the level Neritan is teaching. This used
  // to read data/registry.ts, where the level was a hand-typed 4 sitting
  // beside a hand-typed unit 8 and a set of invented word counts.
  const currentUnit = useCurrentUnit();
  const [level, setLevel] = useState<ScopeLevel>(currentUnit.level);
  const [scopeOpen, setScopeOpen] = useState(true);
  // The hook answers with the local value first and the cloud value a moment
  // later, so the opening level has to be able to move — but only until Leo
  // picks a level himself, after which his choice stands.
  const levelPicked = useRef(false);
  useEffect(() => {
    if (!levelPicked.current) setLevel(currentUnit.level);
  }, [currentUnit.level]);

  const { knownWordSet, weakWordIds } = useKnownWordIds();
  const jp = useJapanesePreference();

  const hasLevels = course === "our-world";
  const scopeLabel = hasLevels ? `${courseLabel(course)} · ${level === "all" ? "all levels" : `Level ${level}`}` : courseLabel(course);
  const scopeColor = hasLevels && level !== "all" ? LEVEL_COLORS[level as number] : "var(--ref-body)";
  const scopeKey = `${course}-${level}`;

  const scopedWords = useMemo(() => allWords.filter((word) => wordInScope(word, course, level)), [course, level]);
  const scopedGrammar = useMemo(() => allGrammar.filter((grammar) => grammarInScope(grammar, course, level)), [course, level]);
  const scopedReviewCount = scopedWords.filter((word) => !knownWordSet.has(word.id)).length;

  function pickCourse(next: ScopeCourse) {
    setCourse(next);
    if (next !== "our-world") {
      levelPicked.current = true;
      setLevel("all");
    }
  }

  function pickLevel(next: ScopeLevel) {
    levelPicked.current = true;
    setLevel(next);
  }

  const tabs: Array<{ key: TabKey; label: string; badge?: number }> = [
    { key: "browse", label: "Browse" },
    { key: "vocabulary", label: "Vocabulary", badge: scopedReviewCount > 0 ? scopedReviewCount : undefined },
    { key: "grammar", label: "Grammar" }
  ];
  const tabLabel = tabs.find((item) => item.key === tab)?.label ?? "Browse";

  const levelEntries = hasLevels
    ? [
        {
          key: "all" as ScopeLevel,
          label: "All levels",
          color: "var(--ref-muted-2)",
          tint: "var(--ref-nav-hover)",
          isActiveLevel: false,
          meta: `${owImportedTotal} of ${OUR_WORLD_TOTAL_UNITS} units imported`
        },
        ...OUR_WORLD_LEVELS.map((lvl) => {
          const imported = importedUnitsForLevel(lvl);
          return {
            key: lvl as ScopeLevel,
            label: `Level ${lvl}`,
            color: LEVEL_COLORS[lvl],
            tint: LEVEL_TINTS[lvl],
            isActiveLevel: lvl === currentUnit.level,
            meta: imported > 0 ? `${imported} of ${OUR_WORLD_UNIT_TOTALS[lvl]} units imported` : `${OUR_WORLD_UNIT_TOTALS[lvl]} units · not imported`
          };
        })
      ]
    : [];

  return (
    <div className="refv2-shell ref-browse-design">
      <div className="refv2-head">
        <div>
          <div className="refv2-eyebrow">Reference Library</div>
          <h1 className="refv2-h1">{tabLabel}</h1>
        </div>
        {/* Practice leans on the words Leo keeps missing — see
            src/data/referenceConfidence.ts for the weighting. */}
        <Link className="refv2-practice-link" href="/reference/practice">
          <Dumbbell size={15} strokeWidth={2.6} />
          Practice
          {weakWordIds.length ? <b>{weakWordIds.length}</b> : null}
        </Link>
      </div>

      <div className="refv2-scope">
        <div className="refv2-scope-row1">
          <span className="refv2-scope-showing">Showing</span>
          <span className="refv2-scope-label" style={{ color: scopeColor }}>
            {scopeLabel}
          </span>
          <button type="button" className="refv2-scope-toggle" onClick={() => setScopeOpen((value) => !value)}>
            {scopeOpen ? "Hide ▴" : "Change ▾"}
          </button>
        </div>

        {scopeOpen ? (
          <>
            <div className="refv2-scope-courses">
              {COURSES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className={`refv2-course-pill${course === c.key ? " is-active" : ""}`}
                  onClick={() => pickCourse(c.key)}
                >
                  <span className={`refv2-course-mark refv2-course-mark--sm refv2-course-mark--${c.key}`} aria-hidden>
                    <span className="refv2-course-mark-inner" />
                  </span>
                  {c.label}
                  <span className="refv2-course-pill-meta">{courseMeta(c.key)}</span>
                </button>
              ))}
            </div>

            {hasLevels ? (
              <div className="refv2-scope-levels">
                {levelEntries.map((entry) => (
                  <button
                    key={String(entry.key)}
                    type="button"
                    className={`refv2-level-btn${level === entry.key ? " is-active" : ""}`}
                    style={level === entry.key ? { background: entry.tint, borderColor: entry.color, color: entry.color } : undefined}
                    onClick={() => pickLevel(entry.key)}
                  >
                    <span className="refv2-level-btn-top">
                      <span className="refv2-level-btn-dot" style={{ background: entry.color }} />
                      <span className="refv2-level-btn-label">{entry.label}</span>
                      {entry.isActiveLevel ? <span className="refv2-pill refv2-pill--active">Active</span> : null}
                    </span>
                    <span className="refv2-level-btn-meta">{entry.meta}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="refv2-tabbar ref-browse-tabs" role="tablist">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            className={`refv2-tab${tab === item.key ? " is-active" : ""}`}
            onClick={() => setTab(item.key)}
          >
            <span>{item.label}</span>
            {item.badge != null ? <span className="refv2-tab-badge refv2-tab-badge--review">{item.badge}</span> : null}
          </button>
        ))}
      </div>

      {tab === "browse" ? <SourceTreePane key={scopeKey} course={course} level={level} /> : null}
      {tab === "vocabulary" ? (
        <VocabularyPane key={scopeKey} words={scopedWords} knownSet={knownWordSet} jp={jp} course={course} level={level} scopeLabel={scopeLabel} />
      ) : null}
      {tab === "grammar" ? <GrammarPane key={scopeKey} grammar={scopedGrammar} scopeLabel={scopeLabel} /> : null}
    </div>
  );
}

/* ============ BROWSE (unit tree, scoped) ============ */

function SourceTreePane({ course, level }: { course: ScopeCourse; level: ScopeLevel }) {
  if (course === "joyful-work" || course === "junior-high" || course === "training-ground") {
    return (
      <div className="refv2-fbar-empty-card">
        <div className="refv2-fbar-empty-title">{courseLabel(course)} isn&rsquo;t browsable yet</div>
        <div className="refv2-fbar-empty-note">Its unit tree hasn&rsquo;t been imported into Reference. Try Search instead.</div>
      </div>
    );
  }

  const showAllLevels = course === "all" || level === "all";
  const levelsToShow = showAllLevels ? OUR_WORLD_LEVELS : [level as number];
  const unitsHeading = showAllLevels ? "All units" : `Level ${level} units`;
  const totalUnitsShown = levelsToShow.reduce((sum, l) => sum + OUR_WORLD_UNIT_TOTALS[l], 0);
  const importedUnitsShown = levelsToShow.reduce((sum, l) => sum + importedUnitsForLevel(l), 0);
  const unitsMeta = `${importedUnitsShown} of ${totalUnitsShown} units imported`;

  const treeLevels = owCourseTree?.levels ?? [];

  return (
    <div className="refv2-card ref-browse-card">
      <div className="refv2-units-head">
        <span className="refv2-units-heading">{unitsHeading}</span>
        <span className="refv2-tree-meta">{unitsMeta}</span>
      </div>
      <div className="refv2-tree-children refv2-tree-children--root">
        {levelsToShow.map((lvl) => {
          const levelData = treeLevels.find((l) => l.level === lvl);
          return (
            <div key={lvl}>
              {showAllLevels ? (
                <div className="refv2-level-header-row">
                  <span className="refv2-level-dot" data-level={lvl} aria-hidden />
                  <span className="refv2-level-header-label" style={{ color: LEVEL_COLORS[lvl] }}>
                    LEVEL {lvl}
                  </span>
                  <span className="refv2-tree-meta">
                    {importedUnitsForLevel(lvl) > 0
                      ? `${importedUnitsForLevel(lvl)} of ${OUR_WORLD_UNIT_TOTALS[lvl]} units imported`
                      : `${OUR_WORLD_UNIT_TOTALS[lvl]} units · not imported`}
                  </span>
                </div>
              ) : null}
              {getDisplayUnits(lvl, levelData).map((unit) =>
                unit.real ? (
                  <UnitNode key={unit.unit} level={lvl} unit={unit.real} />
                ) : (
                  <UnitPlaceholder key={unit.unit} unit={unit.unit} title={unit.title} />
                )
              )}
              {lvl === 4 ? <CheckpointPlaceholder /> : null}
            </div>
          );
        })}
      </div>
      {course === "all" ? (
        <>
          <div className="refv2-tree-divider" />
          <CoursePlaceholderRow course="joyful-work" label="Joyful Work" hint={courseMeta("joyful-work")} />
          <CoursePlaceholderRow course="junior-high" label="Junior High" hint={courseMeta("junior-high")} />
          <CoursePlaceholderRow course="training-ground" label="Training Ground" hint={courseMeta("training-ground")} />
        </>
      ) : null}
    </div>
  );
}

/* Every Our World level has 9 units (level 1 has 8) — see reference-units.ts.
   Show the full run for every level: scanned units render as real
   UnitNodes, unscanned ones show as "planned" placeholders. */
function getDisplayUnits(level: number, levelData: TreeLevel | undefined) {
  const unitCount = OUR_WORLD_UNIT_TOTALS[level] ?? 9;
  const byUnit = new Map((levelData?.units ?? []).map((unit) => [unit.unit, unit]));
  return Array.from({ length: unitCount }, (_, index) => {
    const unitNumber = index + 1;
    const real = byUnit.get(unitNumber);
    return { unit: unitNumber, title: real?.unitTitle ?? `Unit ${unitNumber}`, real };
  });
}

/* Units that have a built Unit Reference page. Add an entry here once
   /reference/our-world/level-N/unit-M/page.tsx exists for that unit. */
const UNIT_REFERENCE_PAGES: Record<string, string> = {
  "1-1": "/reference/our-world/level-1/unit-1",
  "1-2": "/reference/our-world/level-1/unit-2",
  "1-3": "/reference/our-world/level-1/unit-3",
  "1-4": "/reference/our-world/level-1/unit-4",
  "1-5": "/reference/our-world/level-1/unit-5",
  "2-1": "/reference/our-world/level-2/unit-1",
  "2-2": "/reference/our-world/level-2/unit-2",
  "2-3": "/reference/our-world/level-2/unit-3",
  "2-4": "/reference/our-world/level-2/unit-4",
  "2-5": "/reference/our-world/level-2/unit-5",
  "2-6": "/reference/our-world/level-2/unit-6",
  "2-7": "/reference/our-world/level-2/unit-7",
  "2-8": "/reference/our-world/level-2/unit-8",
  "2-9": "/reference/our-world/level-2/unit-9",
  "5-1": "/reference/our-world/level-5/unit-1",
  "4-1": "/reference/our-world/level-4/unit-1",
  "3-1": "/reference/our-world/level-3/unit-1",
  "3-2": "/reference/our-world/level-3/unit-2",
  "3-3": "/reference/our-world/level-3/unit-3",
  "3-4": "/reference/our-world/level-3/unit-4",
  "3-5": "/reference/our-world/level-3/unit-5",
  "3-6": "/reference/our-world/level-3/unit-6",
  "3-7": "/reference/our-world/level-3/unit-7",
  "3-8": "/reference/our-world/level-3/unit-8",
  "3-9": "/reference/our-world/level-3/unit-9",
  "4-2": "/reference/our-world/level-4/unit-2",
  "4-3": "/reference/our-world/level-4/unit-3",
  "4-4": "/reference/our-world/level-4/unit-4",
  "4-5": "/reference/our-world/level-4/unit-5",
  "4-6": "/reference/our-world/level-4/unit-6",
  "4-7": "/reference/our-world/level-4/unit-7",
  "4-8": "/reference/our-world/level-4/unit-8",
  "4-9": "/reference/our-world/level-4/unit-9"
};

const GROUP_ANCHOR: Record<string, string> = {
  "Vocabulary 1": "vocab1",
  "Vocabulary 2": "vocab2",
  Academic: "academic",
  Glossary: "glossary"
};

function UnitNode({ level, unit }: { level: number; unit: TreeUnit }) {
  const [open, setOpen] = useState(false);
  const totalWords = unit.vocabGroups.reduce((sum, group) => sum + group.words.length, 0);
  const unitHref = UNIT_REFERENCE_PAGES[`${level}-${unit.unit}`];
  return (
    <>
      <button type="button" className={`refv2-tree-row refv2-tree-unit${open ? " is-open" : ""}`} onClick={() => setOpen((value) => !value)}>
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <span className="refv2-tree-unit-name">Unit {unit.unit}</span>
        <span className="refv2-tree-unit-title">· {unit.unitTitle}</span>
        <span className="refv2-tree-meta">{totalWords} words</span>
      </button>
      {open ? (
        <div className="refv2-tree-children">
          {unitHref ? (
            <Link className="refv2-tree-leaf refv2-tree-leaf--unit-ref" href={unitHref}>
              <span className="refv2-group-dot" data-group="unit-ref" aria-hidden />
              <span className="refv2-tree-leaf-label">Open Unit Reference</span>
              <span className="refv2-tree-arrow refv2-tree-arrow--right">→</span>
            </Link>
          ) : null}
          {unit.vocabGroups.length ? (
            <>
              <div className="refv2-tree-section">Vocabulary</div>
              {unit.vocabGroups.map((group) => (
                <VocabGroupLeaf
                  group={group}
                  key={group.label}
                  href={unitHref ? `${unitHref}#${GROUP_ANCHOR[group.label] ?? ""}` : undefined}
                />
              ))}
            </>
          ) : null}
          {unit.grammar.length ? (
            <>
              <div className="refv2-tree-section">Grammar</div>
              {unit.grammar.map((grammar) => (
                <Link key={grammar.grammarId} className="refv2-tree-leaf" href={unitHref ? `${unitHref}#grammar` : `/reference/grammar/${grammar.grammarId}`}>
                  <span className="refv2-group-dot" data-group="grammar" aria-hidden />
                  <span className="refv2-tree-leaf-label">{grammar.title}</span>
                  <span className="refv2-tag-chip">{grammar.tag}</span>
                  <span className="refv2-tree-arrow refv2-tree-arrow--right">→</span>
                </Link>
              ))}
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function VocabGroupLeaf({ group, href: hrefOverride }: { group: { label: string; words: WordEntry[] }; href?: string }) {
  const firstWord = group.words[0];
  const fallbackHref = group.label === "Academic" ? `/reference/academic/${firstWord?.id ?? ""}` : `/reference/word/${firstWord?.id ?? ""}`;
  const href = hrefOverride ?? fallbackHref;
  return (
    <Link className="refv2-tree-leaf" href={href}>
      <span className="refv2-group-dot" data-group={group.label === "Academic" ? "academic" : group.label === "Glossary" ? "glossary" : "vocab"} aria-hidden />
      <span className="refv2-tree-leaf-label">{group.label}</span>
      <span className="refv2-tree-meta">{group.words.length} words</span>
      <span className="refv2-tree-arrow">→</span>
    </Link>
  );
}

function UnitPlaceholder({ unit, title }: { unit: number; title: string }) {
  return (
    <div className="refv2-tree-row refv2-tree-unit is-placeholder">
      <ChevronRight size={12} />
      <span className="refv2-tree-unit-name">Unit {unit}</span>
      <span className="refv2-tree-unit-title">· {title}</span>
      <span className="refv2-tree-meta">not imported yet</span>
    </div>
  );
}

function CheckpointPlaceholder() {
  return (
    <div className="refv2-tree-row refv2-tree-unit refv2-tree-checkpoint is-placeholder">
      <ChevronRight size={12} />
      <span className="refv2-pill refv2-pill--checkpoint">Checkpoint</span>
      <span className="refv2-tree-unit-name">Units 7–9</span>
      <span className="refv2-tree-unit-title">· Review &amp; Extra Reading</span>
    </div>
  );
}

function CoursePlaceholderRow({ course, label, hint }: { course: "joyful-work" | "junior-high" | "training-ground"; label: string; hint: string }) {
  return (
    <div className={`refv2-tree-row refv2-tree-course is-placeholder refv2-course-${course}`}>
      <ChevronRight size={14} />
      <span className={`refv2-course-mark refv2-course-mark--${course}`} aria-hidden><span className="refv2-course-mark-inner" /></span>
      <span className="refv2-tree-label">{label}</span>
      <span className="refv2-tree-meta">{hint}</span>
    </div>
  );
}

/* ============ VOCABULARY (All / Known / To review) ============ */

type VStatus = "all" | "known" | "review";
type VocabSort = "unit" | "az";

function VocabularyPane({
  words,
  knownSet,
  jp,
  course,
  level,
  scopeLabel
}: {
  words: WordEntry[];
  knownSet: Set<string>;
  jp: boolean;
  course: ScopeCourse;
  level: ScopeLevel;
  scopeLabel: string;
}) {
  const [status, setStatus] = useState<VStatus>("all");
  const [query, setQuery] = useState("");
  const [posType, setPosType] = useState<string>("all");
  const [sort, setSort] = useState<VocabSort>("unit");

  const known = useMemo(() => words.filter((word) => knownSet.has(word.id)), [words, knownSet]);
  const review = useMemo(() => words.filter((word) => !knownSet.has(word.id)), [words, knownSet]);

  const posPresent = useMemo(() => {
    const set = new Set<string>();
    for (const word of words) set.add(word.pos);
    return Array.from(set);
  }, [words]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    const list = words.filter((word) => {
      const matchesType = posType === "all" || word.pos === posType;
      const matchesQuery = !q || word.word.toLowerCase().includes(q) || word.definition.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
    if (sort === "az") return [...list].sort((a, b) => a.word.localeCompare(b.word));
    return list;
  }, [words, posType, q, sort]);

  function clearFilters() {
    setPosType("all");
    setQuery("");
  }

  return (
    <div className="refv2-pane-stack">
      <div className="refv2-vstatus" role="tablist" aria-label="Word status">
        <button type="button" className={`refv2-vstatus-btn${status === "all" ? " is-active" : ""}`} onClick={() => setStatus("all")}>
          All <span className="refv2-vstatus-count">{words.length}</span>
        </button>
        <button type="button" className={`refv2-vstatus-btn${status === "known" ? " is-active" : ""}`} onClick={() => setStatus("known")}>
          <span className="refv2-vstatus-dot refv2-vstatus-dot--known" />
          Known <span className="refv2-vstatus-count">{known.length}</span>
        </button>
        <button type="button" className={`refv2-vstatus-btn${status === "review" ? " is-active" : ""}`} onClick={() => setStatus("review")}>
          <span className="refv2-vstatus-dot refv2-vstatus-dot--review" />
          To review <span className="refv2-vstatus-count">{review.length}</span>
        </button>
      </div>

      {status === "all" ? (
        <>
          <div className="refv2-fbar">
            <div className="refv2-fbar-field">
              <Search size={14} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter words…" />
            </div>
            <div className="refv2-fbar-chips">
              <button type="button" className={`refv2-filter${posType === "all" ? " is-active" : ""}`} onClick={() => setPosType("all")}>
                <span>All types</span>
              </button>
              {posPresent.map((pos) => (
                <button key={pos} type="button" className={`refv2-filter${posType === pos ? " is-active" : ""}`} onClick={() => setPosType(pos)}>
                  <span>{POS_LABELS[pos] ?? pos}</span>
                </button>
              ))}
              <button
                type="button"
                className={`refv2-fbar-sort${sort === "az" ? " is-active" : ""}`}
                onClick={() => setSort((current) => (current === "az" ? "unit" : "az"))}
              >
                A–Z
              </button>
            </div>
            <span className="refv2-fbar-count">
              Showing {filtered.length} of {words.length} words in {scopeLabel}
            </span>
          </div>

          <div className="refv2-card refv2-vocab-card">
            <div className="refv2-vocab-head">
              <span />
              <span className="refv2-th">Word</span>
              <span className="refv2-th">Meaning</span>
              <span className="refv2-th">Source</span>
            </div>
            {filtered.map((word) => <VocabularyRow key={word.id} word={word} knownSet={knownSet} jp={jp} course={course} level={level} />)}
            {filtered.length === 0 ? (
              <div className="refv2-fbar-empty-row">
                No words match —{" "}
                <button type="button" className="refv2-fbar-empty-action" onClick={clearFilters}>
                  clear filters
                </button>
              </div>
            ) : null}
          </div>
        </>
      ) : null}

      {status === "known" ? <KnownVocabPane words={known} jp={jp} course={course} level={level} scopeLabel={scopeLabel} /> : null}
      {status === "review" ? <ReviewVocabPane words={review} jp={jp} course={course} level={level} scopeLabel={scopeLabel} /> : null}
    </div>
  );
}

function VocabularyRow({ word, knownSet, jp, course, level }: { word: WordEntry; knownSet: Set<string>; jp: boolean; course: ScopeCourse; level: ScopeLevel }) {
  const isKnown = knownSet.has(word.id);
  const route = word.type === "academic" ? `/reference/academic/${word.id}` : `/reference/word/${word.id}`;
  const primary = pickScopedSource(word, course, level);
  return (
    <Link className="refv2-vocab-row" href={route}>
      <span className={`refv2-known-dot${isKnown ? " is-known" : ""}`} />
      <span className="refv2-word-cell"><span className="refv2-word-text">{word.word}</span><span className={`refv2-pos-pill ${posPillClass(word.pos)}`}>{word.pos}</span></span>
      <span className="refv2-meaning-cell"><span className="refv2-meaning-text">{word.definition}</span>{jp && word.jp.gloss ? <span className="refv2-jp">{word.jp.gloss}</span> : null}</span>
      <span className="refv2-source-cell"><span className="refv2-course-dot" style={{ background: courseColor(primary?.course ?? "our-world") }} /><span className="refv2-course-label">{courseLabel(primary?.course ?? "our-world")}</span><span className="refv2-source-code">{primary?.tag}</span></span>
    </Link>
  );
}

function KnownVocabPane({ words, jp, course, level, scopeLabel }: { words: WordEntry[]; jp: boolean; course: ScopeCourse; level: ScopeLevel; scopeLabel: string }) {
  const groups = course === "our-world" && level === "all" ? groupByLevel(words) : course === "all" ? groupByCourse(words) : words.length ? [{ key: "scope", label: null as string | null, color: null as string | null, words }] : [];

  return (
    <div>
      <div className="refv2-know-banner">
        <div>
          <div className="refv2-know-headline">{words.length} words mastered</div>
          <div className="refv2-know-note">In {scopeLabel}. Quiz yourself now and then so they stay sharp.</div>
        </div>
        <button type="button" className="refv2-know-quiz-btn">
          Quiz me →
        </button>
      </div>

      {groups.length ? (
        <div className="refv2-cut-groups">
          {groups.map((group) => (
            <section key={group.key}>
              {group.label ? (
                <div className="refv2-cut-group-head">
                  <span className="refv2-course-dot" style={{ background: group.color ?? "var(--ref-muted)" }} />
                  <strong>{group.label}</strong>
                  <span className="refv2-cut-group-count">{group.words.length}</span>
                </div>
              ) : null}
              <div className="refv2-chips">
                {group.words.map((word) => (
                  <Link className="refv2-chip" href={word.type === "academic" ? `/reference/academic/${word.id}` : `/reference/word/${word.id}`} key={word.id}>
                    <span className="refv2-chip-word">{word.word}</span>
                    {jp && word.jp.gloss ? <span className="refv2-chip-jp">{word.jp.gloss}</span> : null}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="refv2-fbar-empty-card">
          <div className="refv2-fbar-empty-title">No mastered words in {scopeLabel} yet.</div>
        </div>
      )}
    </div>
  );
}

type ReviewFilter = "all" | "flagged" | "untested";

function ReviewVocabPane({
  words,
  jp,
  course,
  level,
  scopeLabel
}: {
  words: WordEntry[];
  jp: boolean;
  course: ScopeCourse;
  level: ScopeLevel;
  scopeLabel: string;
}) {
  const { confidenceRecords, setWordKnown } = useKnownWordIds();
  const [quick, setQuick] = useState<ReviewFilter>("all");

  const flagged = words.filter((word) => confidenceRecords[word.id]);
  const untested = words.filter((word) => !confidenceRecords[word.id]);
  const shown = quick === "flagged" ? flagged : quick === "untested" ? untested : words;

  return (
    <div>
      <div className="refv2-review-banner">
        <div>
          <div className="refv2-review-eyebrow">To review</div>
          <div className="refv2-review-headline">{words.length} words to review</div>
          <div className="refv2-review-note">In {scopeLabel} — a 5-minute session keeps them from slipping away.</div>
        </div>
        <button type="button" className="refv2-review-start-btn">
          Start review →
        </button>
      </div>

      <div className="refv2-review-chips">
        <button type="button" className={`refv2-review-chip${quick === "all" ? " is-active" : ""}`} onClick={() => setQuick("all")}>
          All {words.length}
        </button>
        <button type="button" className={`refv2-review-chip refv2-review-chip--outline${quick === "flagged" ? " is-active" : ""}`} onClick={() => setQuick("flagged")}>
          Marked to review {flagged.length}
        </button>
        <button type="button" className={`refv2-review-chip refv2-review-chip--outline${quick === "untested" ? " is-active" : ""}`} onClick={() => setQuick("untested")}>
          Never tested {untested.length}
        </button>
      </div>

      {shown.length ? (
        <div className="refv2-review-cards">
          {shown.map((word) => (
            <ReviewCard
              key={word.id}
              word={word}
              jp={jp}
              course={course}
              level={level}
              hasRecord={Boolean(confidenceRecords[word.id])}
              onKnow={() => setWordKnown(word.id, true)}
            />
          ))}
        </div>
      ) : (
        <div className="refv2-fbar-empty-card">
          <div className="refv2-fbar-empty-title">Nothing to review in {scopeLabel} — nice work.</div>
        </div>
      )}
    </div>
  );
}

function ReviewCard({
  word,
  jp,
  course,
  level,
  hasRecord,
  onKnow
}: {
  word: WordEntry;
  jp: boolean;
  course: ScopeCourse;
  level: ScopeLevel;
  hasRecord: boolean;
  onKnow: () => void;
}) {
  const primary = pickScopedSource(word, course, level);
  return (
    <article className="refv2-review-card">
      <div className="refv2-review-card-body">
        <div className="refv2-review-card-head">
          <h3 className="refv2-review-card-word">{word.word}</h3>
          <span className={`refv2-pos-pill ${posPillClass(word.pos)}`}>{POS_LABELS[word.pos] ?? word.pos}</span>
          <span className="refv2-source-chip refv2-source-chip--flat">
            <span className="refv2-course-dot" style={{ background: courseColor(primary?.course ?? "our-world") }} />
            {courseLabel(primary?.course ?? "our-world")}
          </span>
        </div>
        <p className="refv2-review-card-meaning">{word.definition}</p>
        {jp && word.jp.gloss ? <p className="refv2-review-card-jp" lang="ja">{word.jp.gloss}</p> : null}
      </div>
      <div className="refv2-review-card-aside">
        <span className="refv2-review-card-note">{hasRecord ? "Marked to review" : "Never tested"}</span>
        <button type="button" className="refv2-review-know-btn" onClick={onKnow}>
          ✓ I know it
        </button>
      </div>
    </article>
  );
}

/* ============ GRAMMAR (rule cards, scoped) ============ */

function GrammarPane({ grammar, scopeLabel }: { grammar: GrammarEntry[]; scopeLabel: string }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("all");

  const topicsPresent = useMemo(() => Array.from(new Set(grammar.map((g) => g.topic))), [grammar]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    return grammar.filter((g) => {
      const matchesTopic = topic === "all" || g.topic === topic;
      const matchesQuery =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.subtitle.toLowerCase().includes(q) ||
        g.tag.toLowerCase().includes(q) ||
        g.chartAndSamples.samples.some((sample) => sample.en.toLowerCase().includes(q));
      return matchesTopic && matchesQuery;
    });
  }, [grammar, topic, q]);

  function clearFilters() {
    setTopic("all");
    setQuery("");
  }

  if (grammar.length === 0) {
    return (
      <div className="refv2-pane-stack">
        <div className="refv2-fbar-empty-card">
          <div className="refv2-fbar-empty-title">No grammar points in {scopeLabel} yet.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="refv2-pane-stack">
      <div className="refv2-fbar">
        <div className="refv2-fbar-field refv2-fbar-field--wide">
          <Search size={14} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter grammar points…" />
        </div>
        <span className="refv2-fbar-count">
          {filtered.length} of {grammar.length} points in {scopeLabel}
        </span>
      </div>

      <div className="refv2-fbar-row">
        <span className="refv2-fbar-row-label">Topic</span>
        <button type="button" className={`refv2-filter${topic === "all" ? " is-active" : ""}`} onClick={() => setTopic("all")}>
          <span>All topics</span>
        </button>
        {topicsPresent.map((t) => (
          <button key={t} type="button" className={`refv2-filter${topic === t ? " is-active" : ""}`} onClick={() => setTopic(t)}>
            <span>{t}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="refv2-fbar-empty-card">
          <div className="refv2-fbar-empty-title">No grammar points match</div>
          <button type="button" className="refv2-fbar-clear-btn" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="refv2-grammar-grid">
          {filtered.map((g) => (
            <Link className="refv2-grammar-card" href={`/reference/grammar/${g.grammarId}`} key={g.grammarId}>
              <div className="refv2-grammar-head">
                <div>
                  <div className="refv2-grammar-title-wrap"><h3 className="refv2-grammar-title">{g.title}</h3><span className="refv2-grammar-cat-pill">{g.topic}</span><span className="refv2-grammar-tag">{g.tag}</span></div>
                  <p className="refv2-grammar-rule">{g.subtitle}</p>
                </div>
                <span className="refv2-result-arrow">→</span>
              </div>
              {g.chartAndSamples.samples[0] ? <div className="refv2-grammar-example"><span className="refv2-eyebrow-mini">Sample</span><p className="refv2-grammar-example-en">{g.chartAndSamples.samples[0].en}</p></div> : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
