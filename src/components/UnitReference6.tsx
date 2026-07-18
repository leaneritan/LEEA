"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { allGrammar } from "@/components/reference/ref-data";

/* ============================================================
   Unit Reference page — Our World · Level 3 · Unit 6
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

const unitSections: Section[] = [
  {
    id: "vocab1", title: "Vocabulary 1", sub: "Core unit words", icon: "①",
    accent: "var(--good)", tint: "var(--good-tint)", count: 10,
    words: [
      word("\ud83d\udecd\ufe0f", "a bag of rice", "noun phrase", "a plastic or paper container full of rice grains", "/reference/word/global_bag_of_rice"),
      word("\ud83c\udf7e", "a bottle of oil", "noun phrase", "a glass or plastic container full of liquid oil for cooking", "/reference/word/global_bottle_of_oil"),
      word("\ud83e\udd63", "a bowl of sugar", "noun phrase", "a round open container filled with sweet white sugar", "/reference/word/global_bowl_of_sugar"),
      word("\ud83e\udd63\ud83d\udce6", "a box of cereal", "noun phrase", "a cardboard container filled with breakfast grains", "/reference/word/global_box_of_cereal"),
      word("\ud83c\udf4c", "a bunch of bananas", "noun phrase", "a group of bananas growing together on one stem", "/reference/word/global_bunch_of_bananas"),
      word("\ud83e\udd64", "a can of soda", "noun phrase", "a metal container filled with sweet fizzy drink", "/reference/word/global_can_of_soda"),
      word("\ud83e\udd5b", "a glass of juice", "noun phrase", "a glass container filled with fruit juice to drink", "/reference/word/global_glass_of_juice"),
      word("\ud83e\uded2", "a jar of olives", "noun phrase", "a glass container with a lid full of small round green or black olives", "/reference/word/global_jar_of_olives"),
      word("\ud83c\udf5e", "a loaf of bread", "noun phrase", "bread shaped and baked in one single piece", "/reference/word/global_loaf_of_bread"),
      word("\ud83c\udf70", "a piece of cake", "noun phrase", "a single slice cut from a whole sweet cake", "/reference/word/global_piece_of_cake")
    ]
  },
  {
    id: "vocab2", title: "Vocabulary 2", sub: "Extension words", icon: "②",
    accent: "#2f9c8e", tint: "#e6f4f1", count: 5,
    words: [
      word("\u2696\ufe0f", "compare", "verb", "to look at two or more things and say how they are the same or different", "/reference/academic/global_compare", true),
      word("\ud83d\uded2", "buy", "verb", "to get something by paying money for it", "/reference/word/global_buy"),
      word("\ud83d\udcb5", "money", "noun", "coins or paper notes used to buy things", "/reference/word/global_money"),
      word("\ud83c\udff7\ufe0f", "price", "noun", "the amount of money you must pay to buy something", "/reference/word/global_price"),
      word("\ud83d\udce6", "put away", "verb phrase", "to place something where it belongs when not in use", "/reference/word/global_put_away")
    ]
  },
  {
    id: "academic", title: "Academic", sub: "Thinking & study language", icon: "★",
    accent: "var(--amber)", tint: "var(--amber-panel)", count: 11,
    words: [
      word("\ud83d\udd0e", "details", "noun", "small pieces of information that help explain an idea", "/reference/academic/global_details", true),
      word("\ud83d\udcdd", "topic sentence", "noun", "a sentence that tells the main idea of a paragraph", "/reference/academic/global_topic_sentence", true),
      word("\ud83d\udcca", "chart", "noun", "a picture or table that shows information in rows, columns, or boxes", "/reference/academic/global_chart", true),
      word("\ud83d\uddc4\ufe0f", "column", "noun", "a vertical section of text or numbers on a page or chart, reading from top to bottom", "/reference/academic/global_column", true),
      word("\ud83d\udcd6", "part", "noun", "a piece or section of a whole thing", "/reference/academic/global_part", true),
      word("\ud83d\udcd6", "piece", "noun", "a single object or portion of a larger whole", "/reference/academic/global_piece", true),
      word("\ud83d\udcd6", "row", "noun", "a line of things or people arranged side by side horizontally", "/reference/academic/global_row", true),
      word("\ud83d\udcd6", "amount", "noun", "how much of something there is, especially non-countable things", "/reference/academic/global_amount", true),
      word("\ud83d\udcd6", "count", "verb", "to calculate the total number of things or people", "/reference/academic/global_count", true),
      word("\ud83d\udcd6", "guess", "verb", "to give an answer or opinion without being sure of all the facts", "/reference/academic/global_guess", true),
      word("\ud83d\udcd6", "body", "noun", "the main physical structure of a person/animal, or the main part of a written paragraph", "/reference/academic/global_body", true)
    ]
  },
  {
    id: "glossary", title: "Glossary", sub: "Reading & topic terms", icon: "📖",
    accent: "var(--muted-2)", tint: "#f0f1ec", count: 18,
    words: [
      word("\ud83c\udf0e\ud83e\udd67", "whole", "adjective", "all of; entire.", "/reference/word/global_whole"),
      word("\ud83d\udecd\ufe0f", "shopping", "noun/verb", "the activity of buying things from stores", "/reference/word/global_shopping"),
      word("\ud83e\uddca", "fridge", "noun", "a large cold box where we store food to keep it fresh", "/reference/word/global_fridge"),
      word("\ud83e\udd57", "beets", "noun", "dark red round root vegetables that grow underground", "/reference/word/global_beets"),
      word("\ud83e\udd63", "borscht", "noun", "a traditional sour soup made primarily with beets", "/reference/word/global_borscht"),
      word("\ud83c\udf5c", "noodles", "noun", "long, thin strips of pasta made from flour and water", "/reference/word/global_noodles"),
      word("\ud83c\udf2d", "sausages", "noun", "minced meat stuffed into cylindrical casings", "/reference/word/global_sausages"),
      word("\ud83d\ude48", "blindfold", "noun/verb", "a piece of cloth tied over the eyes to prevent someone from seeing", "/reference/word/global_blindfold"),
      word("\ud83c\udfa4", "interview", "noun/verb", "to ask someone questions about their experiences or opinions", "/reference/word/global_interview"),
      word("\ud83d\udcdd", "descriptions", "noun", "written or spoken details that explain what something or someone is like", "/reference/word/global_descriptions"),
      word("\ud83e\udeb8", "coral", "noun", "a hard substance formed by the skeletons of tiny marine animals", "/reference/word/global_coral"),
      word("\ud83c\udfa3", "fishing", "noun", "the activity of catching fish for food or sport", "/reference/word/global_fishing"),
      word("\ud83d\udde1\ufe0f", "spear", "noun/verb", "a long weapon with a sharp point, used for fishing or hunting", "/reference/word/global_spear"),
      word("\ud83e\uddfa", "basket", "noun", "a container made of woven strips of wood, plastic, or straw", "/reference/word/global_basket"),
      word("\ud83d\udcb5", "bills", "noun", "pieces of paper money", "/reference/word/global_bills"),
      word("\ud83e\ude99", "coins", "noun", "round pieces of metal used as money", "/reference/word/global_coins"),
      word("\ud83c\udf73", "breakfast", "noun/verb", "the first meal of the day, eaten in the morning", "/reference/word/global_breakfast"),
      word("\ud83c\udf7d\ufe0f", "dinner", "noun/verb", "the main meal of the day, eaten in the evening", "/reference/word/global_dinner")
    ]
  }
];

const unitGrammarEntries = allGrammar
  .filter((g) => g.course === "our-world" && g.level === 3 && g.unit === 6)
  .sort((a, b) => a.tag.localeCompare(b.tag));
const unitGrammar = unitGrammarEntries.map((g, idx) => ({
  n: String(idx + 1),
  title: g.title,
  code: g.tag,
  sample: g.chartAndSamples.samples[0]?.en ?? "",
  href: `/reference/grammar/${g.grammarId}`
}));

const jumps = [
  { label: "Vocabulary 1", count: 10, dot: "var(--good)", href: "#vocab1" },
  { label: "Vocabulary 2", count: 5, dot: "#2f9c8e", href: "#vocab2" },
  { label: "Academic", count: 11, dot: "var(--amber)", href: "#academic" },
  { label: "Glossary", count: 18, dot: "var(--muted-2)", href: "#glossary" },
  { label: "Grammar", count: 0, dot: "var(--accent)", href: "#grammar" }
];

function dotStyle(state: WordState) {
  if (state === "known") return { background: "var(--good-soft)", border: "0" };
  if (state === "review") return { background: "#e6c36b", border: "0" };
  return { background: "#fff", border: "2px solid #d8dcd2" };
}

export default function UnitReference6() {
  const grammarCount = unitGrammar.length;
  jumps[4].count = grammarCount;

  return (
    <AppShell active="reference" crumbs={["Reference", "Our World", "Unit 6"]}>
      <div className="unit-ref">
        <Link className="unit-back" href="/reference">← Back to Browse</Link>

        {/* hero */}
        <section className="unit-hero">
          <div className="unit-hero-left">
            <div className="unit-hero-icon"><span /></div>
            <div>
              <div className="unit-hero-eyebrow-row">
                <span className="unit-hero-eyebrow">Our World · Level 3 · Unit 6</span>
              </div>
              <h1 className="unit-hero-title">What’s for Dinner?</h1>
            </div>
          </div>
          <div className="unit-hero-stats">
            <div className="unit-stat"><b>44</b><span>words</span></div>
            <i className="unit-stat-sep" />
            <div className="unit-stat"><b style={{ color: "var(--amber)" }}>11</b><span>academic</span></div>
            <i className="unit-stat-sep" />
            <div className="unit-stat"><b style={{ color: "var(--accent)" }}>{grammarCount}</b><span>grammar</span></div>
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
            <span className="unit-section-count">{grammarCount} point{grammarCount === 1 ? "" : "s"}</span>
          </div>
          {grammarCount > 0 ? (
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
          ) : (
            <div className="unit-ref-empty">
              <p>Grammar points for this unit are coming soon!</p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
