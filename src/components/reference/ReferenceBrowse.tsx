"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useJapanesePreference } from "@/components/AppShell";
import { useKnownWordIds } from "@/components/useKnownWordIds";
import type { GrammarEntry, WordEntry } from "@/data/reference-shapes";
import { allGrammar, allWords, groupByCourse, sourceTree, splitKnown } from "./ref-data";
import { posPillClass } from "./pos-pill";

type TabKey = "browse" | "vocabulary" | "grammar" | "know" | "dontknow";

export function ReferenceBrowse() {
  const [tab, setTab] = useState<TabKey>("browse");
  const { knownWordSet } = useKnownWordIds();
  const jp = useJapanesePreference();
  const { known, unknown } = useMemo(() => splitKnown(allWords, knownWordSet), [knownWordSet]);

  const tabs: Array<{ key: TabKey; label: string; badge?: number; badgeKind?: "known" | "review" }> = [
    { key: "browse", label: "Browse" },
    { key: "vocabulary", label: "Vocabulary" },
    { key: "grammar", label: "Grammar" },
    { key: "know", label: "I Know", badge: known.length, badgeKind: "known" },
    { key: "dontknow", label: "I Don't Know", badge: unknown.length, badgeKind: "review" }
  ];
  const tabLabel = tabs.find((item) => item.key === tab)?.label ?? "Browse";

  return (
    <div className="refv2-shell ref-browse-design">
      <div className="refv2-head">
        <div className="refv2-eyebrow">Reference Library</div>
        <h1 className="refv2-h1">{tabLabel}</h1>
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
            {item.badge != null ? <span className={`refv2-tab-badge refv2-tab-badge--${item.badgeKind}`}>{item.badge}</span> : null}
          </button>
        ))}
      </div>

      {tab === "browse" ? <SourceTreePane /> : null}
      {tab === "vocabulary" ? <VocabularyPane words={allWords} knownSet={knownWordSet} jp={jp} /> : null}
      {tab === "grammar" ? <GrammarPane /> : null}
      {tab === "know" ? <KnownPane words={known} jp={jp} cut="known" /> : null}
      {tab === "dontknow" ? <KnownPane words={unknown} jp={jp} cut="review" /> : null}
    </div>
  );
}

function SourceTreePane() {
  return (
    <div className="refv2-card ref-browse-card">
      {sourceTree.map((course) => <CourseNode key={course.course} course={course} />)}
      <div className="refv2-tree-divider" />
      <CoursePlaceholderRow course="joyful-work" label="Joyful Work" hint="3 years · planned" />
      <CoursePlaceholderRow course="junior-high" label="Training Ground" hint="drills · by topic" />
    </div>
  );
}

function CourseNode({ course }: { course: (typeof sourceTree)[number] }) {
  const [open, setOpen] = useState(true);
  const totalWords = course.levels.reduce(
    (sum, level) => sum + level.units.reduce((unitSum, unit) => unitSum + unit.vocabGroups.reduce((groupSum, group) => groupSum + group.words.length, 0), 0),
    0
  );

  return (
    <>
      <button type="button" className="refv2-tree-row refv2-tree-course" onClick={() => setOpen((value) => !value)}>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span className="refv2-course-mark refv2-course-mark--ow" aria-hidden><span className="refv2-course-mark-inner" /></span>
        <span className="refv2-tree-label">{course.label}</span>
        <span className="refv2-tree-meta">{course.levels.length} levels · {totalWords.toLocaleString()} words</span>
      </button>
      {open ? (
        <div className="refv2-tree-children">
          {course.levels.map((level) => <LevelNode key={level.level} level={level} />)}
        </div>
      ) : null}
    </>
  );
}

/* Units that have a built Unit Reference page. Add an entry here once
   /reference/our-world/level-N/unit-M/page.tsx exists for that unit. */
const UNIT_REFERENCE_PAGES: Record<string, string> = {
  "5-1": "/reference/our-world/level-5/unit-1",
  "4-1": "/reference/our-world/level-4/unit-1",
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

function LevelNode({ level }: { level: (typeof sourceTree)[number]["levels"][number] }) {
  const [open, setOpen] = useState(level.active);
  return (
    <>
      <button type="button" className={`refv2-tree-row refv2-tree-level${level.active ? " is-active" : ""}`} onClick={() => setOpen((value) => !value)}>
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <span className="refv2-level-dot" data-level={level.level} aria-hidden />
        <span className="refv2-tree-label">Level {level.level}</span>
        {level.active ? <span className="refv2-pill refv2-pill--active">Active</span> : null}
        <span className="refv2-tree-meta">{level.level === 1 ? "8 units" : "9 units"}</span>
      </button>
      {open ? (
        <div className="refv2-tree-children">
          {getDisplayUnits(level).map((unit) => unit.real ? <UnitNode key={unit.unit} level={level.level} unit={unit.real} /> : <UnitPlaceholder key={unit.unit} unit={unit.unit} title={unit.title} />)}
          {level.level === 4 ? <CheckpointPlaceholder /> : null}
        </div>
      ) : null}
    </>
  );
}

/* Every Our World level has 9 units (level 1 has 8). Show the full run for
   every level — scanned units render as real UnitNodes, unscanned ones show
   as "planned" placeholders — so the tree looks the same shape whether a
   level has 1 unit scanned or all 9. */
function getDisplayUnits(level: (typeof sourceTree)[number]["levels"][number]) {
  const unitCount = level.level === 1 ? 8 : 9;
  const byUnit = new Map(level.units.map((unit) => [unit.unit, unit]));
  return Array.from({ length: unitCount }, (_, index) => {
    const unitNumber = index + 1;
    const real = byUnit.get(unitNumber);
    return { unit: unitNumber, title: real?.unitTitle ?? `Unit ${unitNumber}`, real };
  });
}

function UnitNode({ level, unit }: { level: number; unit: (typeof sourceTree)[number]["levels"][number]["units"][number] }) {
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
      <span className="refv2-tree-meta">planned</span>
    </div>
  );
}

function CheckpointPlaceholder() {
  return (
    <div className="refv2-tree-row refv2-tree-unit refv2-tree-checkpoint is-placeholder">
      <ChevronRight size={12} />
      <span className="refv2-pill refv2-pill--checkpoint">Checkpoint</span>
      <span className="refv2-tree-unit-name">Units 7–9</span>
      <span className="refv2-tree-unit-title">· Review & Extra Reading</span>
    </div>
  );
}

function CoursePlaceholderRow({ course, label, hint }: { course: "joyful-work" | "junior-high"; label: string; hint: string }) {
  return (
    <div className={`refv2-tree-row refv2-tree-course is-placeholder refv2-course-${course}`}>
      <ChevronRight size={14} />
      <span className={`refv2-course-mark refv2-course-mark--${course}`} aria-hidden><span className="refv2-course-mark-inner" /></span>
      <span className="refv2-tree-label">{label}</span>
      <span className="refv2-tree-meta">{hint}</span>
    </div>
  );
}

type CourseKey = "our-world" | "joyful-work" | "junior-high";
type VocabSort = "unit" | "az";

function VocabularyPane({ words, knownSet, jp }: { words: WordEntry[]; knownSet: Set<string>; jp: boolean }) {
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState<"all" | CourseKey>("all");
  const [sort, setSort] = useState<VocabSort>("unit");

  const coursesPresent = useMemo(() => {
    const set = new Set<CourseKey>();
    for (const word of words) for (const source of word.sources) set.add(source.course);
    return Array.from(set);
  }, [words]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    const list = words.filter((word) => {
      const matchesCourse = course === "all" || word.sources.some((source) => source.course === course);
      const matchesQuery = !q || word.word.toLowerCase().includes(q) || word.definition.toLowerCase().includes(q);
      return matchesCourse && matchesQuery;
    });
    if (sort === "az") return [...list].sort((a, b) => a.word.localeCompare(b.word));
    return list;
  }, [words, course, q, sort]);

  function clearFilters() {
    setCourse("all");
    setQuery("");
  }

  return (
    <div className="refv2-pane-stack">
      <div className="refv2-fbar">
        <div className="refv2-fbar-field">
          <Search size={14} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter words…" />
        </div>
        <div className="refv2-fbar-chips">
          <button type="button" className={`refv2-filter${course === "all" ? " is-active" : ""}`} onClick={() => setCourse("all")}>
            <span>All courses</span>
          </button>
          {coursesPresent.map((c) => (
            <button key={c} type="button" className={`refv2-filter${course === c ? " is-active" : ""}`} onClick={() => setCourse(c)}>
              <span className="refv2-filter-dot" style={{ background: courseColor(c) }} />
              <span>{courseLabel(c)}</span>
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
          Showing {filtered.length} of {words.length} words
        </span>
      </div>

      <div className="refv2-card refv2-vocab-card">
        <div className="refv2-vocab-head">
          <span />
          <span className="refv2-th">Word</span>
          <span className="refv2-th">Meaning</span>
          <span className="refv2-th">Source</span>
        </div>
        {filtered.map((word) => <VocabularyRow key={word.id} word={word} knownSet={knownSet} jp={jp} />)}
        {filtered.length === 0 ? (
          <div className="refv2-fbar-empty-row">
            No words match —{" "}
            <button type="button" className="refv2-fbar-empty-action" onClick={clearFilters}>
              clear filters
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function VocabularyRow({ word, knownSet, jp }: { word: WordEntry; knownSet: Set<string>; jp: boolean }) {
  const isKnown = knownSet.has(word.id);
  const route = word.type === "academic" ? `/reference/academic/${word.id}` : `/reference/word/${word.id}`;
  const primary = word.sources[0];
  return (
    <Link className="refv2-vocab-row" href={route}>
      <span className={`refv2-known-dot${isKnown ? " is-known" : ""}`} />
      <span className="refv2-word-cell"><span className="refv2-word-text">{word.word}</span><span className={`refv2-pos-pill ${posPillClass(word.pos)}`}>{word.pos}</span></span>
      <span className="refv2-meaning-cell"><span className="refv2-meaning-text">{word.definition}</span>{jp && word.jp.gloss ? <span className="refv2-jp">{word.jp.gloss}</span> : null}</span>
      <span className="refv2-source-cell"><span className="refv2-course-dot" style={{ background: courseColor(primary?.course ?? "our-world") }} /><span className="refv2-course-label">{courseLabel(primary?.course ?? "our-world")}</span><span className="refv2-source-code">{primary?.tag}</span></span>
    </Link>
  );
}

function GrammarPane() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<number | "all">("all");
  const [topic, setTopic] = useState<string>("all");

  const levelsPresent = useMemo(
    () => Array.from(new Set(allGrammar.map((g) => g.level))).sort((a, b) => a - b),
    []
  );
  const topicsPresent = useMemo(() => Array.from(new Set(allGrammar.map((g) => g.topic))), []);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    return allGrammar.filter((g) => {
      const matchesLevel = level === "all" || g.level === level;
      const matchesTopic = topic === "all" || g.topic === topic;
      const matchesQuery =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.subtitle.toLowerCase().includes(q) ||
        g.tag.toLowerCase().includes(q) ||
        g.chartAndSamples.samples.some((sample) => sample.en.toLowerCase().includes(q));
      return matchesLevel && matchesTopic && matchesQuery;
    });
  }, [level, topic, q]);

  function clearFilters() {
    setLevel("all");
    setTopic("all");
    setQuery("");
  }

  return (
    <div className="refv2-pane-stack">
      <div className="refv2-fbar">
        <div className="refv2-fbar-field refv2-fbar-field--wide">
          <Search size={14} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter grammar points…" />
        </div>
        <span className="refv2-fbar-count">
          {filtered.length} of {allGrammar.length} points
        </span>
      </div>

      <div className="refv2-fbar-row">
        <span className="refv2-fbar-row-label">Level</span>
        <button type="button" className={`refv2-filter${level === "all" ? " is-active" : ""}`} onClick={() => setLevel("all")}>
          <span>All levels</span>
        </button>
        {levelsPresent.map((l) => (
          <button key={l} type="button" className={`refv2-filter${level === l ? " is-active" : ""}`} onClick={() => setLevel(l)}>
            <span className="refv2-filter-dot--level" data-level={l} />
            <span>Level {l}</span>
          </button>
        ))}
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
          {filtered.map((grammar) => (
            <Link className="refv2-grammar-card" href={`/reference/grammar/${grammar.grammarId}`} key={grammar.grammarId}>
              <div className="refv2-grammar-head">
                <div>
                  <div className="refv2-grammar-title-wrap"><h3 className="refv2-grammar-title">{grammar.title}</h3><span className="refv2-grammar-cat-pill">Grammar</span><span className="refv2-grammar-tag">{grammar.tag}</span></div>
                  <p className="refv2-grammar-rule">{grammar.subtitle}</p>
                </div>
                <span className="refv2-result-arrow">→</span>
              </div>
              {grammar.chartAndSamples.samples[0] ? <div className="refv2-grammar-example"><span className="refv2-eyebrow-mini">Sample</span><p className="refv2-grammar-example-en">{grammar.chartAndSamples.samples[0].en}</p></div> : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function KnownPane({ words, jp, cut }: { words: WordEntry[]; jp: boolean; cut: "known" | "review" }) {
  const groups = groupByCourse(words);
  return (
    <div>
      <div className={`refv2-cut-banner refv2-cut-banner--${cut === "known" ? "known" : "review"}`}>
        <div className="refv2-cut-count">{words.length}</div>
        <div className="refv2-cut-sub">{cut === "known" ? "words Leo knows" : "words to review"}</div>
      </div>
      <div className="refv2-cut-groups">
        {groups.map((group) => (
          <section key={group.key}>
            <div className="refv2-cut-group-head"><span className="refv2-course-dot" style={{ background: group.color }} /><strong>{group.label}</strong><span className="refv2-cut-group-count">{group.words.length}</span></div>
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
    </div>
  );
}

function courseColor(course: "our-world" | "joyful-work" | "junior-high") {
  if (course === "joyful-work") return "var(--ref-course-jw)";
  if (course === "junior-high") return "var(--ref-course-jh)";
  return "var(--ref-course-ow)";
}

function courseLabel(course: "our-world" | "joyful-work" | "junior-high") {
  if (course === "joyful-work") return "Joyful Work";
  if (course === "junior-high") return "Junior High";
  return "Our World";
}
