"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { isMultiEmoji } from "@/components/reference/emoji-utils";
import { allGrammar } from "@/components/reference/ref-data";
import {
  unit9AcademicCards,
  unit9GlossaryCards,
  unit9Vocab1Cards,
  unit9Vocab2Cards
} from "@/data/reference";
import type { VocabularyItem } from "@/data/types";

/* ============================================================
   Unit Reference page — Our World · Level 4 · Unit 9
   Renders inside <AppShell active="reference">. Word sets and
   grammar are both derived from the unit's own vocabulary.json /
   grammar.json, so this page cannot drift from the cards it links to.
   ============================================================ */

type Pos = "noun" | "verb" | "adjective" | "adverb";

type Word = {
  emoji: string;
  word: string;
  pos: Pos;
  meaning: string;
  academic?: boolean;
  href: string;
};

type Section = {
  id: string;
  title: string;
  sub: string;
  icon: string;
  accent: string;
  tint: string;
  count: number;
  words: Word[];
};

const POS_BG: Record<Pos, string> = {
  noun: "var(--pos-noun-bg)",
  verb: "var(--pos-verb-bg)",
  adjective: "var(--pos-adj-bg)",
  adverb: "var(--pos-adv-bg)"
};
const POS_INK: Record<Pos, string> = {
  noun: "var(--pos-noun)",
  verb: "var(--pos-verb)",
  adjective: "var(--pos-adj)",
  adverb: "var(--pos-adv)"
};

/* Normalize the raw vocabulary.json partOfSpeech strings (e.g. "noun/verb",
   "preposition") down to the four POS tags this page styles. */
function normalizePos(raw: string): Pos {
  const lower = raw.toLowerCase();
  if (lower.startsWith("verb")) return "verb";
  if (lower.startsWith("adjective")) return "adjective";
  if (lower.startsWith("adverb")) return "adverb";
  return "noun";
}

/* Word sets are derived from the unit's own vocabulary.json (via reference.ts),
   the same way the grammar list below is derived from grammar.json. They used to
   be hand-copied arrays, which had already drifted: the six Reading-workbook
   words were missing, and every new word had to be typed out twice. Deriving
   them means the emoji, part of speech and meaning shown here always match the
   card the link opens. Section titles/colors stay local — those are page design,
   not content. */
function toWords(items: VocabularyItem[], academic = false): Word[] {
  return items.map((item) => ({
    // reference.ts already maps the JSON's displayEmoji onto emoji.
    emoji: item.emoji,
    word: item.word,
    pos: normalizePos(item.partOfSpeech ?? item.pos ?? "noun"),
    meaning: item.meaning,
    academic: academic || undefined,
    href: academic ? `/reference/academic/${item.id}` : `/reference/word/${item.id}`
  }));
}

const unitSections: Section[] = [
  {
    id: "vocab1", title: "Vocabulary 1", sub: "Core unit words", icon: "①",
    accent: "var(--good)", tint: "var(--good-tint)",
    words: toWords(unit9Vocab1Cards)
  },
  {
    id: "vocab2", title: "Vocabulary 2", sub: "Direction & force words", icon: "②",
    accent: "#2f9c8e", tint: "#e6f4f1",
    words: toWords(unit9Vocab2Cards)
  },
  {
    id: "academic", title: "Academic", sub: "Thinking & study language", icon: "★",
    accent: "var(--amber)", tint: "var(--amber-panel)",
    words: toWords(unit9AcademicCards, true)
  },
  {
    id: "glossary", title: "Glossary", sub: "Reading & topic terms", icon: "📖",
    accent: "var(--muted-2)", tint: "#f0f1ec",
    words: toWords(unit9GlossaryCards)
  }
].map((section) => ({ ...section, count: section.words.length }));

/* Source: content/subjects/english/courses/our-world/level-4/unit-9/grammar.json —
   derived from allGrammar (reference-shapes.ts) so this list can never drift
   out of sync with the real grammar.json content. */
const unitGrammarEntries = allGrammar
  .filter((g) => g.course === "our-world" && g.level === 4 && g.unit === 9)
  .sort((a, b) => a.tag.localeCompare(b.tag));
const unitGrammar = unitGrammarEntries.map((g, idx) => ({
  n: String(idx + 1),
  title: g.title,
  code: g.tag,
  sample: g.chartAndSamples.samples[0]?.en ?? "",
  href: `/reference/grammar/${g.grammarId}`
}));

const sectionDots: Record<string, string> = {
  vocab1: "var(--good)", vocab2: "#2f9c8e", academic: "var(--amber)", glossary: "var(--muted-2)"
};
const jumps = [
  ...unitSections.map((s) => ({ label: s.title, count: s.count, dot: sectionDots[s.id], href: `#${s.id}` })),
  { label: "Grammar", count: unitGrammar.length, dot: "var(--accent)", href: "#grammar" }
];
const totalWords = unitSections.reduce((sum, s) => sum + s.count, 0);
const academicCount = unitSections.find((s) => s.id === "academic")?.count ?? 0;

export default function UnitReference9() {
  return (
    <AppShell active="reference" crumbs={["Reference", "Our World", "Unit 9"]}>
      <div className="unit-ref">
        <Link className="unit-back" href="/reference">← Back to Browse</Link>

        {/* hero */}
        <section className="unit-hero">
          <div className="unit-hero-left">
            <div className="unit-hero-icon"><span /></div>
            <div>
              <div className="unit-hero-eyebrow-row">
                <span className="unit-hero-eyebrow">Our World · Level 4 · Unit 9</span>
              </div>
              <h1 className="unit-hero-title">The Science of Fun</h1>
            </div>
          </div>
          <div className="unit-hero-stats">
            <div className="unit-stat"><b>{totalWords}</b><span>words</span></div>
            <i className="unit-stat-sep" />
            <div className="unit-stat"><b style={{ color: "var(--amber)" }}>{academicCount}</b><span>academic</span></div>
            <i className="unit-stat-sep" />
            <div className="unit-stat"><b style={{ color: "var(--accent)" }}>{unitGrammar.length}</b><span>grammar</span></div>
          </div>
        </section>

        {/* jump bar */}
        <div className="unit-jumpbar">
          {jumps.map((j) => (
            <a className="unit-jump" href={j.href} key={j.label}>
              <span className="unit-jump-dot" style={{ background: j.dot }} />
              {j.label}
              <span className="unit-jump-count">{j.count}</span>
            </a>
          ))}
        </div>

        {/* word set sections */}
        {unitSections.map((s) => (
          <section className="unit-section" id={s.id} key={s.id}>
            <div className="unit-section-accent" style={{ background: s.accent }} />
            <div className="unit-section-head">
              <div className="unit-section-head-left">
                <span className="unit-section-icon" style={{ background: s.tint, color: s.accent }}>{s.icon}</span>
                <div>
                  <h2 className="unit-section-title">{s.title}</h2>
                  <div className="unit-section-sub">{s.sub}</div>
                </div>
              </div>
              <span className="unit-section-count">{s.count} words</span>
            </div>
            <div className="unit-word-list">
              {s.words.map((w) => (
                <Link className="unit-word" href={w.href} key={w.word}>
                  <span className={`unit-word-emoji${isMultiEmoji(w.emoji) ? " unit-word-emoji--multi" : ""}`} style={{ background: s.tint }}>{w.emoji}</span>
                  <span className="unit-word-main">
                    <span className="unit-word-headline">
                      <span className="unit-word-text">{w.word}</span>
                      <span className="unit-pos" style={{ background: POS_BG[w.pos], color: POS_INK[w.pos] }}>{w.pos}</span>
                      {w.academic && <span className="unit-academic">★ Academic</span>}
                    </span>
                    <span className="unit-word-meaning">{w.meaning}</span>
                  </span>
                  <span className="unit-word-end">
                    <span className="unit-word-dot" title="Not started" style={{ background: "#fff", border: "2px solid #d8dcd2" }} />
                    <span className="unit-word-arrow">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* grammar */}
        <section className="unit-section" id="grammar">
          <div className="unit-section-accent" style={{ background: "var(--accent)" }} />
          <div className="unit-section-head">
            <div className="unit-section-head-left">
              <span className="unit-section-icon" style={{ background: "var(--accent-tint)", color: "var(--accent-ink)" }}>¶</span>
              <div>
                <h2 className="unit-section-title">Grammar</h2>
                <div className="unit-section-sub">Each opens its grammar card</div>
              </div>
            </div>
            <span className="unit-section-count">{unitGrammar.length} point{unitGrammar.length === 1 ? "" : "s"}</span>
          </div>
          <div className="unit-word-list">
            {unitGrammar.map((g) => (
              <Link className="unit-grammar" href={g.href} key={g.code}>
                <span className="unit-grammar-badge">G{g.n}</span>
                <span className="unit-word-main">
                  <span className="unit-word-headline">
                    <span className="unit-word-text">{g.title}</span>
                    <span className="unit-grammar-code">{g.code}</span>
                  </span>
                  <span className="unit-word-meaning">{g.sample}</span>
                </span>
                <span className="unit-word-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
