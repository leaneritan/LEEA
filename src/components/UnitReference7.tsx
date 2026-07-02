"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { allGrammar } from "@/components/reference/ref-data";

/* ============================================================
   Unit Reference page — Our World · Level 4 · Unit 7
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

/* Source: content/subjects/english/courses/our-world/level-4/unit-7/vocabulary.json
   (vocab1WordIds / vocab2WordIds / academicWordIds / contentWordIds + relatedWordIds) */
const unitSections: Section[] = [
  {
    id: "vocab1", title: "Vocabulary 1", sub: "Core unit words", icon: "①",
    accent: "var(--good)", tint: "var(--good-tint)", count: 14,
    words: [
      word("🔋", "a battery", "noun", "an object that stores electricity to power devices", "/reference/word/global_battery"),
      word("🎨", "creativity", "noun", "the ability to make or think of new ideas", "/reference/word/global_creativity"),
      word("⚡", "electricity", "noun", "a kind of energy that powers lights and machines", "/reference/word/global_electricity"),
      word("❌", "fail", "verb", "to not succeed at something", "/reference/word/global_fail"),
      word("💡", "an idea", "noun", "a thought or plan that you make up in your mind", "/reference/word/global_idea"),
      word("💭", "imagination", "noun", "the ability to picture things in your mind", "/reference/word/global_imagination"),
      word("🔬", "invent", "verb", "to make something new for the first time", "/reference/word/global_invent"),
      word("💡", "an invention", "noun", "a new thing that someone has made for the first time", "/reference/word/global_invention"),
      word("❓", "a problem", "noun", "something that is wrong and needs to be fixed", "/reference/word/global_problem"),
      word("✅", "a solution", "noun", "a way to fix a problem", "/reference/word/global_solution"),
      word("🏆", "succeed", "verb", "to do something well, the way you wanted", "/reference/word/global_succeed"),
      word("💪", "try", "verb", "to do your best to do something", "/reference/word/global_try"),
      word("🛠️", "useful", "adjective", "helpful for doing something", "/reference/word/global_useful"),
      word("🎡", "a wheel", "noun", "a round object that turns and helps things move", "/reference/word/global_wheel")
    ]
  },
  {
    id: "vocab2", title: "Vocabulary 2", sub: "Extension words", icon: "②",
    accent: "#2f9c8e", tint: "#e6f4f1", count: 5,
    words: [
      word("🏋️", "lift", "verb", "to pick something up and move it higher", "/reference/word/global_lift"),
      word("🚶", "move", "verb", "to change place or position", "/reference/word/global_move"),
      word("📥", "put", "verb", "to place something somewhere", "/reference/word/global_put"),
      word("🔄", "turn", "verb", "to move in a circle around a center", "/reference/word/global_turn"),
      word("🖐️", "use", "verb", "to do something with an object", "/reference/word/global_use")
    ]
  },
  {
    id: "academic", title: "Academic", sub: "Thinking & study language", icon: "★",
    accent: "var(--amber)", tint: "var(--amber-panel)", count: 7,
    words: [
      word("🌐", "generalize", "verb", "to make a statement about a whole group, not just one person or thing", "/reference/academic/global_generalize", true),
      word("🎯", "specific", "adjective", "about one particular person, thing, or detail — not general", "/reference/academic/global_specific", true),
      word("📊", "chart", "noun", "a picture or table that shows information in rows, columns, or boxes", "/reference/academic/global_chart", true),
      word("📈", "graph", "noun", "a drawing with lines, bars, or dots that compares numbers", "/reference/academic/global_graph", true),
      word("💬", "opinion", "noun", "what one person thinks or believes, not something everyone agrees is true", "/reference/academic/global_opinion", true),
      word("📋", "fact", "noun", "a piece of true information that can be checked", "/reference/academic/global_fact", true),
      word("🤝", "support", "verb", "to give reasons or facts that show your opinion is reasonable", "/reference/academic/global_support", true)
    ]
  },
  {
    id: "glossary", title: "Glossary", sub: "Reading & topic terms", icon: "📖",
    accent: "var(--muted-2)", tint: "#f0f1ec", count: 20,
    words: [
      word("💭", "imagine", "verb", "to picture something in your mind", "/reference/word/global_imagine"),
      word("👥", "public", "adjective", "for everyone to use or see", "/reference/word/global_public"),
      word("🌱", "ground", "noun", "the surface of the earth that you stand on", "/reference/word/global_ground"),
      word("🌀", "hula hoop", "noun phrase", "a big ring you turn around your waist for fun", "/reference/word/global_hula_hoop"),
      word("👖", "waist", "noun", "the part of your body between your chest and hips", "/reference/word/global_waist"),
      word("🎒", "backpack", "noun", "a bag you carry on your back", "/reference/word/global_backpack"),
      word("🔪", "knife", "noun", "a tool with a sharp blade for cutting", "/reference/word/global_knife"),
      word("🦯", "blind", "adjective", "not able to see", "/reference/word/global_blind"),
      word("✏️", "design", "noun/verb", "the plan or shape of something you make", "/reference/word/global_design"),
      word("🔢", "millions", "noun", "very large numbers (1,000,000 each)", "/reference/word/global_millions"),
      word("📜", "patent", "noun", "an official paper that protects an inventor’s idea", "/reference/word/global_patent"),
      word("🔍", "curiosity", "noun", "the wish to learn or know about something", "/reference/word/global_curiosity"),
      word("🔁", "typical", "adjective", "happening often; usual", "/reference/word/global_typical"),
      word("👌", "simple", "adjective", "easy to do or understand", "/reference/word/global_simple"),
      word("📦", "materials", "noun", "the things you use to make something", "/reference/word/global_materials"),
      word("♻️", "recycle", "verb", "to use something again instead of throwing it away", "/reference/word/global_recycle"),
      word("👻", "ghost", "noun", "the spirit of a dead person that some people believe in", "/reference/word/global_ghost"),
      word("🌪️", "vacuum", "noun", "a machine that cleans floors by pulling in dirt", "/reference/word/global_vacuum"),
      word("🍰", "dessert", "noun", "a sweet food you eat after a meal", "/reference/word/global_dessert"),
      word("📅", "habit", "noun", "something you do often, almost without thinking", "/reference/word/global_habit")
    ]
  }
];

/* Source: content/subjects/english/courses/our-world/level-4/unit-7/grammar.json —
   derived from allGrammar (reference-shapes.ts) so this list can never drift
   out of sync with the real grammar.json content (see the U7G2 bug this
   replaced: a hand-maintained array silently missed newly added points). */
const unitGrammarEntries = allGrammar
  .filter((g) => g.course === "our-world" && g.level === 4 && g.unit === 7)
  .sort((a, b) => a.tag.localeCompare(b.tag));
const unitGrammar = unitGrammarEntries.map((g, idx) => ({
  n: String(idx + 1),
  title: g.title,
  code: g.tag,
  sample: g.chartAndSamples.samples[0]?.en ?? "",
  href: `/reference/grammar/${g.grammarId}`
}));

const jumps = [
  { label: "Vocabulary 1", count: 14, dot: "var(--good)", href: "#vocab1" },
  { label: "Vocabulary 2", count: 5, dot: "#2f9c8e", href: "#vocab2" },
  { label: "Academic", count: 7, dot: "var(--amber)", href: "#academic" },
  { label: "Glossary", count: 20, dot: "var(--muted-2)", href: "#glossary" },
  { label: "Grammar", count: unitGrammar.length, dot: "var(--accent)", href: "#grammar" }
];

function dotStyle(state: WordState) {
  if (state === "known") return { background: "var(--good-soft)", border: "0" };
  if (state === "review") return { background: "#e6c36b", border: "0" };
  return { background: "#fff", border: "2px solid #d8dcd2" };
}

export default function UnitReference7() {
  return (
    <AppShell active="reference" crumbs={["Reference", "Our World", "Unit 7"]}>
      <div className="unit-ref">
        <Link className="unit-back" href="/reference">← Back to Browse</Link>

        {/* hero */}
        <section className="unit-hero">
          <div className="unit-hero-left">
            <div className="unit-hero-icon"><span /></div>
            <div>
              <div className="unit-hero-eyebrow-row">
                <span className="unit-hero-eyebrow">Our World · Level 4 · Unit 7</span>
              </div>
              <h1 className="unit-hero-title">Good Idea!</h1>
            </div>
          </div>
          <div className="unit-hero-stats">
            <div className="unit-stat"><b>46</b><span>words</span></div>
            <i className="unit-stat-sep" />
            <div className="unit-stat"><b style={{ color: "var(--amber)" }}>7</b><span>academic</span></div>
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
