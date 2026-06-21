"use client";

/**
 * ReferenceBrowse — the redesigned `/reference` browse surface.
 *
 * Tabs: Browse (source tree) · Vocabulary (compact rows) · Grammar (rule cards)
 *       · I Know · I Don't Know (grouped chips).
 * Per design_handoff_leea_reference/Reference Browse.dc.html.
 */

import Link from "next/link";
import { ChevronDown, ChevronRight, Search as SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useJapanesePreference } from "@/components/AppShell";
import { useKnownWordIds } from "@/components/useKnownWordIds";
import { allGrammar, allWords, groupByCourse, sourceTree, splitKnown } from "./ref-data";
import { posPillClass } from "./pos-pill";
import type { WordEntry } from "@/data/reference-shapes";

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

  const tabLabel = tabs.find((t) => t.key === tab)?.label ?? "Browse";

  return (
    <div className="refv2-shell">
      <div className="refv2-head">
        <div className="refv2-eyebrow">Reference Library</div>
        <h1 className="refv2-h1">{tabLabel}</h1>
      </div>

      <div className="refv2-tabbar" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className={`refv2-tab${tab === t.key ? " is-active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            <span>{t.label}</span>
            {t.badge != null && (
              <span className={`refv2-tab-badge refv2-tab-badge--${t.badgeKind}`}>{t.badge}</span>
            )}
          </button>
        ))}
        <Link className="refv2-tab-search" href="/reference/search" title="Search words & grammar">
          <SearchIcon size={14} />
          <span>Search…</span>
          <kbd>⌘K</kbd>
        </Link>
      </div>

      {tab === "browse" && <SourceTreePane />}
      {tab === "vocabulary" && <VocabularyPane words={allWords} knownSet={knownWordSet} jp={jp} />}
      {tab === "grammar" && <GrammarPane />}
      {tab === "know" && <KnownPane words={known} jp={jp} cut="known" />}
      {tab === "dontknow" && <KnownPane words={unknown} jp={jp} cut="review" />}
    </div>
  );
}

/* ─── BROWSE: SOURCE TREE ─── */
function SourceTreePane() {
  return (
    <div className="refv2-card">
      {sourceTree.map((course) => (
        <CourseNode key={course.course} course={course} />
      ))}
      <div className="refv2-tree-divider" />
      <CoursePlaceholderRow course="joyful-work" label="Joyful Work" hint="3 years · planned" />
      <CoursePlaceholderRow course="junior-high" label="Junior High · Training Ground" hint="drills · by topic" />
    </div>
  );
}

function CourseNode({ course }: { course: (typeof sourceTree)[number] }) {
  const [open, setOpen] = useState(true);
  const totalWords = course.levels.reduce(
    (sum, level) => sum + level.units.reduce((s, u) => s + u.vocabGroups.reduce((g, vg) => g + vg.words.length, 0), 0),
    0
  );
  return (
    <>
      <button type="button" className="refv2-tree-row refv2-tree-course" onClick={() => setOpen((v) => !v)}>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span className="refv2-course-mark refv2-course-mark--ow" aria-hidden>
          <span className="refv2-course-mark-inner" />
        </span>
        <span className="refv2-tree-label">{course.label}</span>
        <span className="refv2-tree-meta">
          {course.levels.length} levels · {totalWords.toLocaleString()} words
        </span>
      </button>
      {open && (
        <div className="refv2-tree-children">
          {course.levels.map((level) => (
            <LevelNode key={level.level} level={level} />
          ))}
        </div>
      )}
    </>
  );
}

function LevelNode({ level }: { level: (typeof sourceTree)[number]["levels"][number] }) {
  const [open, setOpen] = useState(level.active);
  return (
    <>
      <button
        type="button"
        className={`refv2-tree-row refv2-tree-level${level.active ? " is-active" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <span className="refv2-level-dot" data-level={level.level} aria-hidden />
        <span className="refv2-tree-label">Level {level.level}</span>
        {level.active && <span className="refv2-pill refv2-pill--active">Active</span>}
        <span className="refv2-tree-meta">{level.units.length} units</span>
      </button>
      {open && (
        <div className="refv2-tree-children">
          {level.units.map((unit) => (
            <UnitNode key={unit.unit} unit={unit} />
          ))}
        </div>
      )}
    </>
  );
}

function UnitNode({ unit }: { unit: (typeof sourceTree)[number]["levels"][number]["units"][number] }) {
  const [open, setOpen] = useState(unit.unit === 8);
  const totalWords = unit.vocabGroups.reduce((s, vg) => s + vg.words.length, 0);
  return (
    <>
      <button type="button" className={`refv2-tree-row refv2-tree-unit${open ? " is-open" : ""}`} onClick={() => setOpen((v) => !v)}>
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <span className="refv2-tree-unit-name">Unit {unit.unit}</span>
        <span className="refv2-tree-unit-title">· {unit.unitTitle}</span>
        <span className="refv2-tree-meta">{totalWords} words</span>
      </button>
      {open && (
        <div className="refv2-tree-children">
          {unit.vocabGroups.length > 0 && (
            <>
              <div className="refv2-tree-section">Vocabulary</div>
              {unit.vocabGroups.map((group) => (
                <Link
                  key={group.label}
                  className="refv2-tree-leaf"
                  href={`/reference/word/${group.words[0]?.id ?? ""}`}
                >
                  <span
                    className="refv2-group-dot"
                    data-group={group.label === "Academic" ? "academic" : "vocab"}
                    aria-hidden
                  />
                  <span className="refv2-tree-leaf-label">{group.label}</span>
                  <span className="refv2-tree-meta">{group.words.length} words</span>
                  <span className="refv2-tree-arrow">→</span>
                </Link>
              ))}
            </>
          )}
          {unit.grammar.length > 0 && (
            <>
              <div className="refv2-tree-section">Grammar</div>
              {unit.grammar.map((g) => (
                <Link key={g.grammarId} className="refv2-tree-leaf" href={`/reference/grammar/${g.grammarId}`}>
                  <span className="refv2-group-dot" data-group="grammar" aria-hidden />
                  <span className="refv2-tree-leaf-label">{g.title}</span>
                  <span className="refv2-tag-chip">{g.tag}</span>
                  <span className="refv2-tree-arrow refv2-tree-arrow--right">→</span>
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
}

function CoursePlaceholderRow({
  course,
  label,
  hint
}: {
  course: "joyful-work" | "junior-high";
  label: string;
  hint: string;
}) {
  return (
    <div className={`refv2-tree-row refv2-tree-course is-placeholder refv2-course-${course}`}>
      <ChevronRight size={14} />
      <span className={`refv2-course-mark refv2-course-mark--${course}`} aria-hidden>
        <span className="refv2-course-mark-inner" />
      </span>
      <span className="refv2-tree-label">{label}</span>
      <span className="refv2-tree-meta">{hint}</span>
    </div>
  );
}

/* ─── VOCABULARY: compact rows ─── */
function VocabularyPane({
  words,
  knownSet,
  jp
}: {
  words: WordEntry[];
  knownSet: Set<string>;
  jp: boolean;
}) {
  return (
    <div>
      <div className="refv2-card refv2-vocab-card">
        <div className="refv2-vocab-head">
          <span />
          <span className="refv2-th">Word</span>
          <span className="refv2-th">Meaning</span>
          <span className="refv2-th">Source</span>
        </div>
        {words.map((word) => (
          <VocabularyRow key={word.id} word={word} knownSet={knownSet} jp={jp} />
        ))}
      </div>
    </div>
  );
}

function VocabularyRow({ word, knownSet, jp }: { word: WordEntry; knownSet: Set<string>; jp: boolean }) {
  const isKnown = knownSet.has(word.id);
  const route = word.type === "academic" ? `/reference/academic/${word.id}` : `/reference/word/${word.id}`;
  const primary = word.sources[0];
  const courseColor =
    primary?.course === "joyful-work"
      ? "var(--ref-course-jw)"
      : primary?.course === "junior-high"
        ? "var(--ref-course-jh)"
        : "var(--ref-course-ow)";
  const courseLabel =
    primary?.course === "joyful-work" ? "Joyful Work" : primary?.course === "junior-high" ? "Junior High" : "Our World";
  return (
    <Link href={route} className="refv2-vocab-row">
      <span
        className="refv2-known-dot"
        style={{
          background: isKnown ? "var(--ref-known)" : "transparent",
          borderColor: isKnown ? "var(--ref-known)" : "var(--ref-faint-2)"
        }}
        title={isKnown ? "Known" : "Not yet"}
      />
      <span className="refv2-word-cell">
        <span className="refv2-word-text">{word.word}</span>
        <span className={`refv2-pos-pill ${posPillClass(word.pos)}`}>{word.pos}</span>
      </span>
      <span className="refv2-meaning-cell">
        <span className="refv2-meaning-text">{word.definition}</span>
        {jp && word.jp.gloss ? (
          <span className="refv2-jp" lang="ja">
            {word.jp.gloss}
          </span>
        ) : null}
      </span>
      <span className="refv2-source-cell">
        <span className="refv2-course-dot" style={{ background: courseColor }} />
        <span className="refv2-course-label">{courseLabel}</span>
        {primary?.tag && <span className="refv2-source-code">{primary.tag}</span>}
      </span>
    </Link>
  );
}

/* ─── GRAMMAR: rule cards ─── */
function GrammarPane() {
  const jp = useJapanesePreference();
  return (
    <div className="refv2-grammar-grid">
      {allGrammar.map((g) => {
        const sample = g.chartAndSamples.samples[0] ?? g.levelUp.samples[0];
        return (
          <Link key={g.grammarId} href={`/reference/grammar/${g.grammarId}`} className="refv2-grammar-card">
            <div className="refv2-grammar-head">
              <div className="refv2-grammar-title-wrap">
                <h3 className="refv2-grammar-title">{g.title}</h3>
                <span className="refv2-grammar-cat-pill">Grammar</span>
              </div>
              <span className="refv2-grammar-tag">
                <span className="refv2-course-dot" style={{ background: "var(--ref-course-ow)" }} />
                {g.tag}
              </span>
            </div>
            <p className="refv2-grammar-rule">{g.subtitle}</p>
            {sample && (
              <div className="refv2-grammar-example">
                <div className="refv2-eyebrow-mini">Example</div>
                <p className="refv2-grammar-example-en">{sample.en}</p>
                {jp && sample.jp ? (
                  <p className="refv2-grammar-example-jp" lang="ja">
                    {sample.jp}
                  </p>
                ) : null}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}

/* ─── I KNOW / I DON'T KNOW: grouped chips ─── */
function KnownPane({ words, jp, cut }: { words: WordEntry[]; jp: boolean; cut: "known" | "review" }) {
  const grouped = useMemo(() => groupByCourse(words), [words]);
  const total = words.length;
  const summary =
    cut === "known"
      ? { count: `${total} words mastered`, sub: "Quiz yourself now and then so they stay sharp." }
      : { count: `${total} words to review`, sub: "Open each and mark known when you're sure." };
  return (
    <div>
      <div className={`refv2-cut-banner refv2-cut-banner--${cut}`}>
        <div>
          <div className="refv2-cut-count">{summary.count}</div>
          <div className="refv2-cut-sub">{summary.sub}</div>
        </div>
      </div>
      {grouped.length === 0 ? (
        <div className="refv2-empty">No words here yet.</div>
      ) : (
        <div className="refv2-cut-groups">
          {grouped.map((group) => (
            <div key={group.key}>
              <div className="refv2-cut-group-head">
                <span className="refv2-course-dot" style={{ background: group.color }} />
                <span className="refv2-eyebrow-mini">{group.label}</span>
                <span className="refv2-cut-group-count">{group.words.length}</span>
              </div>
              <div className="refv2-chips">
                {group.words.map((word) => {
                  const route = word.type === "academic" ? `/reference/academic/${word.id}` : `/reference/word/${word.id}`;
                  return (
                    <Link key={word.id} href={route} className="refv2-chip">
                      <span className="refv2-chip-word">{word.word}</span>
                      {jp && word.jp.gloss && (
                        <span className="refv2-chip-jp" lang="ja">
                          {word.jp.gloss}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
