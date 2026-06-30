"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
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
  "4-8": "/reference/our-world/level-4/unit-8"
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

function getDisplayUnits(level: (typeof sourceTree)[number]["levels"][number]) {
  if (level.level !== 4) return level.units.map((unit) => ({ unit: unit.unit, title: unit.unitTitle, real: unit }));
  const byUnit = new Map(level.units.map((unit) => [unit.unit, unit]));
  return [
    { unit: 7, title: "Let's Explore!", real: byUnit.get(7) },
    { unit: 8, title: "That's Really Interesting!", real: byUnit.get(8) },
    { unit: 9, title: "Looking Back", real: byUnit.get(9) }
  ];
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

function VocabularyPane({ words, knownSet, jp }: { words: WordEntry[]; knownSet: Set<string>; jp: boolean }) {
  return (
    <div className="refv2-card refv2-vocab-card">
      <div className="refv2-vocab-head">
        <span />
        <span className="refv2-th">Word</span>
        <span className="refv2-th">Meaning</span>
        <span className="refv2-th">Source</span>
      </div>
      {words.map((word) => <VocabularyRow key={word.id} word={word} knownSet={knownSet} jp={jp} />)}
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
  return (
    <div className="refv2-grammar-grid">
      {allGrammar.map((grammar) => (
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
