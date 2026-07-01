"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";

/* ============================================================
   Unit Reference page — Our World · Level 4 · Unit 6
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

/* Source: content/subjects/english/courses/our-world/level-4/unit-6/vocabulary.json
   (vocab1WordIds / vocab2WordIds / academicWordIds / contentWordIds + relatedWordIds) */
const unitSections: Section[] = [
  {
    id: "vocab1", title: "Vocabulary 1", sub: "Core unit words", icon: "①",
    accent: "var(--good)", tint: "var(--good-tint)", count: 16,
    words: [
      word("🐙", "a creature", "noun", "a living animal, especially a strange or interesting one", "/reference/word/global_creature"),
      word("❌", "disappear", "verb", "to go away so it cannot be seen", "/reference/word/global_disappear"),
      word("🐬", "a dolphin", "noun", "a smart sea animal that lives in groups and breathes air", "/reference/word/global_dolphin"),
      word("🐟", "fish", "noun", "an animal with fins and gills that lives in water", "/reference/word/global_fish"),
      word("🌊", "a layer", "noun", "one level of something — like the top, middle, or bottom of the ocean", "/reference/word/global_layer"),
      word("🌌", "midnight", "noun", "the middle of the night — also the name for the deepest, darkest ocean zone", "/reference/word/global_midnight"),
      word("🐙", "an octopus", "noun", "a sea creature with eight arms", "/reference/word/global_octopus"),
      word("🛢️", "pollution", "noun", "trash or harmful things that make air, water, or land dirty", "/reference/word/global_pollution"),
      word("♻️", "a resource", "noun", "something useful in nature, like water, fish, or trees", "/reference/word/global_resource"),
      word("🧽", "sea sponges", "noun", "soft sea animals that live on the ocean floor", "/reference/word/global_sea_sponges"),
      word("🐢", "a sea turtle", "noun", "a turtle that lives in the ocean and swims with flippers", "/reference/word/global_sea_turtle"),
      word("🦈", "a shark", "noun", "a large fish with sharp teeth that lives in the ocean", "/reference/word/global_shark"),
      word("🦑", "a squid", "noun", "a sea animal with a long body and many arms", "/reference/word/global_squid"),
      word("☀️", "sunlight", "noun", "the light that comes from the sun", "/reference/word/global_sunlight"),
      word("🐋", "a whale", "noun", "a very large sea animal that breathes air", "/reference/word/global_whale"),
      word("🌍", "a zone", "noun", "a part or area, like one section of the ocean", "/reference/word/global_zone")
    ]
  },
  {
    id: "vocab2", title: "Vocabulary 2", sub: "Extension words", icon: "②",
    accent: "#2f9c8e", tint: "#e6f4f1", count: 5,
    words: [
      word("🌱", "biodegradable", "adjective", "able to break down naturally over time without harming the planet", "/reference/word/global_biodegradable"),
      word("🗑️", "garbage", "noun", "things people throw away — trash", "/reference/word/global_garbage"),
      word("🛢️", "oil spill", "noun", "when oil escapes from a ship or pipe into the ocean", "/reference/word/global_oil_spill"),
      word("🎣", "overfishing", "noun", "catching too many fish so there aren’t enough left to reproduce", "/reference/word/global_overfishing"),
      word("🛍️", "plastic", "noun", "a man-made material that does not break down easily", "/reference/word/global_plastic")
    ]
  },
  {
    id: "academic", title: "Academic", sub: "Thinking & study language", icon: "★",
    accent: "var(--amber)", tint: "var(--amber-panel)", count: 8,
    words: [
      word("⚖️", "obligation", "noun", "something you must or have to do — a duty or rule", "/reference/academic/global_obligation", true),
      word("🚫", "prohibition", "noun", "something you can’t or must not do — a rule against doing something", "/reference/academic/global_prohibition", true),
      word("🏷️", "definition", "noun", "a statement that tells what a word or idea means", "/reference/academic/global_definition", true),
      word("📐", "diagram", "noun", "a simple drawing with labels that shows how something works or what its parts are", "/reference/academic/global_diagram", true),
      word("🏷️", "label", "noun / verb", "a word that names a part — or to write that word on a part", "/reference/academic/global_label", true),
      word("⚖️", "contrast", "noun / verb", "to show how two things are different — or the difference itself", "/reference/academic/global_contrast", true),
      word("🔀", "differences", "noun (plural)", "the ways in which two or more things are not the same", "/reference/academic/global_differences", true),
      word("💬", "expressions", "noun (plural)", "words or short phrases that people often use to say a particular thing", "/reference/academic/global_expressions", true)
    ]
  },
  {
    id: "glossary", title: "Glossary", sub: "Reading & topic terms", icon: "📖",
    accent: "var(--muted-2)", tint: "#f0f1ec", count: 30,
    words: [
      word("🌫️", "mysterious", "adjective", "hard to understand or explain — full of mystery", "/reference/word/global_mysterious"),
      word("🚗", "transportation", "noun", "the act of moving people or things from one place to another", "/reference/word/global_transportation"),
      word("🌅", "twilight", "noun", "the dim light just before sunrise or after sunset — also the middle, dim layer of the ocean", "/reference/word/global_twilight"),
      word("🏞️", "habitats", "noun (plural)", "the natural places where animals or plants live", "/reference/word/global_habitats"),
      word("🌿", "natural", "adjective", "made by nature, not by people", "/reference/word/global_natural"),
      word("🎣", "fishermen", "noun (plural)", "people whose job is to catch fish", "/reference/word/global_fishermen"),
      word("🐠", "reproduce", "verb", "to have babies — to make new living things of the same kind", "/reference/word/global_reproduce"),
      word("🚢", "tankers", "noun (plural)", "very big ships that carry oil or other liquids", "/reference/word/global_tankers"),
      word("🚛", "transport", "verb", "to carry people or things from one place to another", "/reference/word/global_transport"),
      word("🔮", "future", "noun", "time that has not happened yet", "/reference/word/global_future"),
      word("🫧", "oxygen", "noun", "a gas in the air and water that animals need to breathe", "/reference/word/global_oxygen"),
      word("🌿", "algae", "noun (plural)", "tiny plant-like living things that grow in water", "/reference/word/global_algae"),
      word("🐜", "colonies", "noun (plural)", "large groups of the same kind of animal living together", "/reference/word/global_colonies"),
      word("🧬", "organisms", "noun (plural)", "living things — animals, plants, or other kinds of living things", "/reference/word/global_organisms"),
      word("🦐", "plankton", "noun", "tiny sea creatures that float in water and are food for many animals", "/reference/word/global_plankton"),
      word("🪸", "polyps", "noun (plural)", "tiny sea animals that make up corals", "/reference/word/global_polyps"),
      word("🐙", "tentacles", "noun (plural)", "long, thin arms that some sea animals use to catch food", "/reference/word/global_tentacles"),
      word("💎", "transparent", "adjective", "clear — you can see through it", "/reference/word/global_transparent"),
      word("🐊", "swamps", "noun (plural)", "wet, soft areas of land — like a marsh", "/reference/word/global_swamps"),
      word("🌳", "woods", "noun (plural)", "a small forest — an area with many trees", "/reference/word/global_woods"),
      word("🏘️", "community", "noun", "a group of people who live in the same area or share something", "/reference/word/global_community"),
      word("🦭", "flippers", "noun (plural)", "flat arms or legs sea animals use to swim", "/reference/word/global_flippers"),
      word("🌿", "kelp", "noun", "a large, tall kind of seaweed that grows like a forest underwater", "/reference/word/global_kelp"),
      word("🦭", "seal", "noun", "a sea mammal with flippers that lives in coastal waters", "/reference/word/global_seal"),
      word("🌿", "seaweed", "noun", "plant-like growth that lives in the sea", "/reference/word/global_seaweed"),
      word("🐠", "underwater", "adjective / adverb", "below the surface of water", "/reference/word/global_underwater"),
      word("〰️", "whiskers", "noun (plural)", "long stiff hairs growing on the face of some animals (like a cat or seal)", "/reference/word/global_whiskers"),
      word("🥫", "pop-top", "noun", "the metal ring on a soda or beer can that you pull to open it", "/reference/word/global_pop_top"),
      word("🏖️", "sand", "noun", "tiny grains of rock that cover beaches and ocean floors", "/reference/word/global_sand"),
      word("🐚", "shells", "noun (plural)", "the hard outer covers of sea animals like clams and snails", "/reference/word/global_shells")
    ]
  }
];

const jumps = [
  { label: "Vocabulary 1", count: 16, dot: "var(--good)", href: "#vocab1" },
  { label: "Vocabulary 2", count: 5, dot: "#2f9c8e", href: "#vocab2" },
  { label: "Academic", count: 8, dot: "var(--amber)", href: "#academic" },
  { label: "Glossary", count: 30, dot: "var(--muted-2)", href: "#glossary" }
];

function dotStyle(state: WordState) {
  if (state === "known") return { background: "var(--good-soft)", border: "0" };
  if (state === "review") return { background: "#e6c36b", border: "0" };
  return { background: "#fff", border: "2px solid #d8dcd2" };
}

export default function UnitReference6() {
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
                <span className="unit-hero-eyebrow">Our World · Level 4 · Unit 6</span>
              </div>
              <h1 className="unit-hero-title">Wonders of the Sea</h1>
            </div>
          </div>
          <div className="unit-hero-stats">
            <div className="unit-stat"><b>59</b><span>words</span></div>
            <i className="unit-stat-sep" />
            <div className="unit-stat"><b style={{ color: "var(--amber)" }}>8</b><span>academic</span></div>
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
      </div>
    </AppShell>
  );
}
