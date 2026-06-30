"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";

/* ============================================================
   Unit Reference page — Our World · Level 4 · Unit 8
   Renders inside <AppShell active="reference">. Data is local
   for now; lift `unitSections` / `unitGrammar` into @/data later
   without touching the markup. Styles live in unitreference.css
   (append to globals.css). Word/grammar hrefs are placeholders —
   point them at your real reference routes.
   ============================================================ */

type WordState = "known" | "review" | "new";

type Word = {
  emoji: string;
  word: string;
  pos: "noun" | "verb" | "adjective" | "adverb";
  meaning: string;
  state: WordState;
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

const POS_BG: Record<Word["pos"], string> = {
  noun: "var(--pos-noun-bg)",
  verb: "var(--pos-verb-bg)",
  adjective: "var(--pos-adj-bg)",
  adverb: "var(--pos-adv-bg)"
};
const POS_INK: Record<Word["pos"], string> = {
  noun: "var(--pos-noun)",
  verb: "var(--pos-verb)",
  adjective: "var(--pos-adj)",
  adverb: "var(--pos-adv)"
};

const STATE_LABEL: Record<WordState, string> = {
  known: "Known",
  review: "To review",
  new: "Not started"
};

const unitSections: Section[] = [
  {
    id: "vocab1", title: "Vocabulary 1", sub: "Core unit words", icon: "①",
    accent: "var(--good)", tint: "var(--good-tint)", count: 12,
    words: [
      { emoji: "🧺", word: "collect", pos: "verb", meaning: "to bring things together into one place", state: "known", href: "/reference/word/collect" },
      { emoji: "🔭", word: "explore", pos: "verb", meaning: "to travel through a place to learn about it", state: "known", href: "/reference/word/explore" },
      { emoji: "🪨", word: "fossil", pos: "noun", meaning: "the shape of an ancient animal left in rock", state: "review", href: "/reference/word/fossil" },
      { emoji: "🏜️", word: "desert", pos: "noun", meaning: "a large, dry, sandy area of land", state: "known", href: "/reference/word/desert" }
    ]
  },
  {
    id: "vocab2", title: "Vocabulary 2", sub: "Extension words", icon: "②",
    accent: "#2f9c8e", tint: "#e6f4f1", count: 10,
    words: [
      { emoji: "🌋", word: "erupt", pos: "verb", meaning: "to burst out suddenly, like a volcano", state: "review", href: "/reference/word/erupt" },
      { emoji: "🧭", word: "ancient", pos: "adjective", meaning: "very, very old; from long ago", state: "known", href: "/reference/word/ancient" },
      { emoji: "💎", word: "rare", pos: "adjective", meaning: "not seen or found very often", state: "new", href: "/reference/word/rare" }
    ]
  },
  {
    id: "academic", title: "Academic", sub: "Thinking & study language", icon: "★",
    accent: "var(--amber)", tint: "var(--amber-panel)", count: 6,
    words: [
      { emoji: "⚖️", word: "compare", pos: "verb", meaning: "to look at how things are the same or different", state: "known", academic: true, href: "/reference/academic/compare" },
      { emoji: "🔮", word: "predict", pos: "verb", meaning: "to say what you think will happen next", state: "review", academic: true, href: "/reference/academic/predict" },
      { emoji: "🗂️", word: "describe", pos: "verb", meaning: "to say what something is like", state: "known", academic: true, href: "/reference/academic/describe" }
    ]
  },
  {
    id: "glossary", title: "Glossary", sub: "Reading & topic terms", icon: "📖",
    accent: "var(--muted-2)", tint: "#f0f1ec", count: 8,
    words: [
      { emoji: "🦴", word: "skeleton", pos: "noun", meaning: "all the bones inside a body", state: "new", href: "/reference/word/skeleton" },
      { emoji: "🌍", word: "continent", pos: "noun", meaning: "one of the seven great areas of land on Earth", state: "known", href: "/reference/word/continent" }
    ]
  }
];

const unitGrammar = [
  { n: "1", title: "Relative pronouns", code: "OW4-U8-G1", sample: "The girl who found the fossil is my friend.", href: "/reference/grammar/OW4-U8-G1" },
  { n: "2", title: "Present perfect", code: "OW4-U8-G2", sample: "I have collected over fifty stamps.", href: "/reference/grammar/OW4-U8-G2" }
];

const jumps = [
  { label: "Vocabulary 1", count: 12, dot: "var(--good)", href: "#vocab1" },
  { label: "Vocabulary 2", count: 10, dot: "#2f9c8e", href: "#vocab2" },
  { label: "Academic", count: 6, dot: "var(--amber)", href: "#academic" },
  { label: "Glossary", count: 8, dot: "var(--muted-2)", href: "#glossary" },
  { label: "Grammar", count: 2, dot: "var(--accent)", href: "#grammar" }
];

function dotStyle(state: WordState) {
  if (state === "known") return { background: "var(--good-soft)", border: "0" };
  if (state === "review") return { background: "#e6c36b", border: "0" };
  return { background: "#fff", border: "2px solid #d8dcd2" };
}

export default function UnitReference() {
  return (
    <AppShell active="reference" crumbs={["Reference", "Our World", "Unit 8"]}>
      <div className="unit-ref">
        <Link className="unit-back" href="/reference">← Back to Browse</Link>

        {/* hero */}
        <section className="unit-hero">
          <div className="unit-hero-left">
            <div className="unit-hero-icon"><span /></div>
            <div>
              <div className="unit-hero-eyebrow-row">
                <span className="unit-hero-eyebrow">Our World · Level 4 · Unit 8</span>
                <span className="unit-hero-badge">Active</span>
              </div>
              <h1 className="unit-hero-title">That&apos;s Really Interesting!</h1>
            </div>
          </div>
          <div className="unit-hero-stats">
            <div className="unit-stat"><b>26</b><span>words</span></div>
            <i className="unit-stat-sep" />
            <div className="unit-stat"><b style={{ color: "var(--good)" }}>18</b><span>known</span></div>
            <i className="unit-stat-sep" />
            <div className="unit-stat"><b style={{ color: "var(--amber)" }}>2</b><span>grammar</span></div>
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
              {s.words.map((w) => {
                const d = dotStyle(w.state);
                return (
                  <Link className="unit-word" href={w.href} key={w.word}>
                    <span className="unit-word-emoji" style={{ background: s.tint }}>{w.emoji}</span>
                    <span className="unit-word-main">
                      <span className="unit-word-headline">
                        <span className="unit-word-text">{w.word}</span>
                        <span className="unit-pos" style={{ background: POS_BG[w.pos], color: POS_INK[w.pos] }}>{w.pos}</span>
                        {w.academic && <span className="unit-academic">★ Academic</span>}
                      </span>
                      <span className="unit-word-meaning">{w.meaning}</span>
                    </span>
                    <span className="unit-word-end">
                      <span className="unit-word-dot" title={STATE_LABEL[w.state]} style={{ background: d.background, border: d.border }} />
                      <span className="unit-word-arrow">→</span>
                    </span>
                  </Link>
                );
              })}
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
            <span className="unit-section-count">2 points</span>
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
