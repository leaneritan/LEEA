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

type Pos = "noun" | "verb" | "adjective" | "adverb";

type Word = {
  emoji: string;
  word: string;
  pos: Pos;
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

const STATE_LABEL: Record<WordState, string> = {
  known: "Known",
  review: "To review",
  new: "Not started"
};

/* Normalize the raw vocabulary.json partOfSpeech strings (e.g. "noun phrase",
   "adjective/adverb", "noun/verb") down to the four POS tags this page styles. */
function normalizePos(raw: string): Pos {
  const lower = raw.toLowerCase();
  if (lower.startsWith("verb")) return "verb";
  if (lower.startsWith("adjective")) return "adjective";
  if (lower.startsWith("adverb")) return "adverb";
  return "noun";
}

function word(emoji: string, text: string, pos: string, meaning: string, href: string, academic = false): Word {
  return { emoji, word: text, pos: normalizePos(pos), meaning, state: "new", academic: academic || undefined, href };
}

/* Source: content/subjects/english/courses/our-world/level-4/unit-8/vocabulary.json
   (vocab1WordIds / vocab2WordIds / academicWordIds / contentWordIds + relatedWordIds) */
const unitSections: Section[] = [
  {
    id: "vocab1", title: "Vocabulary 1", sub: "Core unit words", icon: "①",
    accent: "var(--good)", tint: "var(--good-tint)", count: 14,
    words: [
      word("🧍", "alone", "adjective/adverb", "without other people", "/reference/word/global_alone"),
      word("👤", "avatar", "noun", "a picture or character that represents a person online or in a game", "/reference/word/global_avatar"),
      word("🧺", "collect", "verb", "to get and keep things of the same kind", "/reference/word/global_collect"),
      word("🏁", "compete", "verb", "to try to win against others", "/reference/word/global_compete"),
      word("🎮", "controller", "noun", "a tool used to play a video game", "/reference/word/global_controller"),
      word("🤝", "cooperate", "verb", "to work together with others", "/reference/word/global_cooperate"),
      word("🎨", "creative", "adjective", "good at making new or interesting things", "/reference/word/global_creative"),
      word("😊", "enjoy", "verb", "to like doing something", "/reference/word/global_enjoy"),
      word("🎸", "musical group", "noun phrase", "people who make music together", "/reference/word/global_musical_group"),
      word("⭐", "point", "noun", "one unit in a game or contest score", "/reference/word/global_point"),
      word("🏆", "score", "noun/verb", "the number of points in a game, or to get points", "/reference/word/global_score"),
      word("🖥️", "screen", "noun", "the part of a device that shows pictures or words", "/reference/word/global_screen"),
      word("📸", "take photos", "verb phrase", "to use a camera to make pictures", "/reference/word/global_take_photos"),
      word("👥", "together", "adverb", "with another person or group", "/reference/word/global_together")
    ]
  },
  {
    id: "vocab2", title: "Vocabulary 2", sub: "Extension words", icon: "②",
    accent: "#2f9c8e", tint: "#e6f4f1", count: 5,
    words: [
      word("🐞", "bug", "noun", "a small insect", "/reference/word/global_bug"),
      word("📚", "comic book", "noun phrase", "a book that tells a story with pictures and words", "/reference/word/global_comic_book"),
      word("🦖", "dinosaur", "noun", "a large animal that lived long ago", "/reference/word/global_dinosaur"),
      word("🪨", "fossil", "noun", "the hard remains or mark of a plant or animal from long ago", "/reference/word/global_fossil"),
      word("🧸", "stuffed animal", "noun phrase", "a soft toy animal filled with material", "/reference/word/global_stuffed_animal")
    ]
  },
  {
    id: "academic", title: "Academic", sub: "Thinking & study language", icon: "★",
    accent: "var(--amber)", tint: "var(--amber-panel)", count: 10,
    words: [
      word("🔍", "analyze", "verb", "to study something carefully by looking at its parts", "/reference/academic/global_analyze", true),
      word("📝", "clause", "noun", "a group of words with a subject and a verb", "/reference/academic/global_clause", true),
      word("🔀", "contraction", "noun", "a short form made by putting two words together", "/reference/academic/global_contraction", true),
      word("🎯", "accuracy", "noun", "how correct or exact something is", "/reference/academic/global_accuracy", true),
      word("➡️", "direct object", "noun phrase", "the person or thing that receives the action of the verb", "/reference/academic/global_direct_object", true),
      word("↔️", "indirect object", "noun phrase", "the person or thing that receives the direct object", "/reference/academic/global_indirect_object", true),
      word("🔢", "sequence", "noun", "the order that events or steps happen in", "/reference/academic/global_sequence", true),
      word("🏷️", "definition", "noun", "a statement that tells what a word or idea means", "/reference/academic/global_definition", true),
      word("📋", "description", "noun", "words that tell what something is like", "/reference/academic/global_description", true),
      word("🔎", "details", "noun", "small pieces of information that help explain an idea", "/reference/academic/global_details", true)
    ]
  },
  {
    id: "glossary", title: "Glossary", sub: "Reading & topic terms", icon: "📖",
    accent: "var(--muted-2)", tint: "#f0f1ec", count: 21,
    words: [
      word("🪲", "trilobite", "noun", "an ancient sea animal with a hard shell", "/reference/word/global_trilobite"),
      word("🏕️", "outdoor", "adjective", "done or used outside", "/reference/word/global_outdoor"),
      word("🙈", "hiders", "noun", "people who hide something or hide themselves", "/reference/word/global_hiders"),
      word("🔎", "seekers", "noun", "people who look for something", "/reference/word/global_seekers"),
      word("💎", "treasure", "noun", "something valuable or exciting to find", "/reference/word/global_treasure"),
      word("📱", "app", "noun", "a program used on a phone, tablet, or computer", "/reference/word/global_app"),
      word("🧩", "clues", "noun", "information that helps you find or understand something", "/reference/word/global_clues"),
      word("🧭", "compass", "noun", "a tool that shows direction", "/reference/word/global_compass"),
      word("🎄", "ornament", "noun", "a small object used for decoration", "/reference/word/global_ornament"),
      word("🌊", "sinking", "verb/adjective", "going down below the surface of water or another material", "/reference/word/global_sinking"),
      word("📄", "origami", "noun", "the Japanese art of folding paper into shapes", "/reference/word/global_origami"),
      word("📃", "folding", "noun/verb", "bending something so one part lies over another", "/reference/word/global_folding"),
      word("✏️", "design", "noun/verb", "a plan for how something looks or works", "/reference/word/global_design"),
      word("🐉", "dragon", "noun", "an imaginary animal in stories, often large and powerful", "/reference/word/global_dragon"),
      word("🕊️", "crane", "noun", "a tall bird with long legs and a long neck", "/reference/word/global_crane"),
      word("🕹️", "arcade", "noun", "a place with many video game machines that you pay to play", "/reference/word/global_arcade"),
      word("🎮", "console", "noun", "a small machine you plug into a TV to play video games", "/reference/word/global_console"),
      word("🤲", "portable", "adjective", "small and light enough to carry around easily", "/reference/word/global_portable"),
      word("🥽", "virtual reality", "noun phrase", "a fake (computer-made) world you see and hear with a headset", "/reference/word/global_virtual_reality"),
      word("🎧", "headset", "noun", "a thing you wear on your head with screens or speakers near your ears or eyes", "/reference/word/global_headset"),
      word("🎺", "musical instrument", "noun phrase", "a thing people use to make music", "/reference/word/global_musical_instrument")
    ]
  }
];

/* Source: content/subjects/english/courses/our-world/level-4/unit-8/grammar.json */
const unitGrammar = [
  { n: "1", title: "Describing people with who", code: "OW4-U8-G1", sample: "The boy who gave me this controller lives across the street.", href: "/reference/grammar/ow_l4_u8_g1_who_clauses" },
  { n: "2", title: "Direct and indirect objects", code: "OW4-U8-G2", sample: "Sara gave me the pencil.", href: "/reference/grammar/ow_l4_u8_g2_direct_indirect_objects" }
];

const jumps = [
  { label: "Vocabulary 1", count: 14, dot: "var(--good)", href: "#vocab1" },
  { label: "Vocabulary 2", count: 5, dot: "#2f9c8e", href: "#vocab2" },
  { label: "Academic", count: 10, dot: "var(--amber)", href: "#academic" },
  { label: "Glossary", count: 21, dot: "var(--muted-2)", href: "#glossary" },
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
            <div className="unit-stat"><b>50</b><span>words</span></div>
            <i className="unit-stat-sep" />
            <div className="unit-stat"><b style={{ color: "var(--amber)" }}>10</b><span>academic</span></div>
            <i className="unit-stat-sep" />
            <div className="unit-stat"><b style={{ color: "var(--accent)" }}>2</b><span>grammar</span></div>
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
