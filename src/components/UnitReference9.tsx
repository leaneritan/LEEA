"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";

/* ============================================================
   Unit Reference page — Our World · Level 4 · Unit 9
   Renders inside <AppShell active="reference">. Data is local
   for now, sourced from the unit's own vocabulary.json (see the
   header comment on each section below). No Grammar section yet —
   grammar.json for Unit 9 has not been scanned, so the Grammar
   jump/section is omitted (matches UnitReference7.tsx's pattern
   for units without a grammar.json).
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

function word(emoji: string, text: string, pos: string, meaning: string, href: string, academic = false): Word {
  return { emoji, word: text, pos: normalizePos(pos), meaning, academic: academic || undefined, href };
}

/* Source: content/subjects/english/courses/our-world/level-4/unit-9/vocabulary.json
   (vocab1WordIds / vocab2WordIds / academicWordIds / contentWordIds + relatedWordIds) */
const unitSections: Section[] = [
  {
    id: "vocab1", title: "Vocabulary 1", sub: "Core unit words", icon: "①",
    accent: "var(--good)", tint: "var(--good-tint)", count: 15,
    words: [
      word("💪⚡", "a force", "noun", "a push or a pull that can move something", "/reference/word/global_force"),
      word("❓➡️", "happen", "verb", "to take place; to occur", "/reference/word/global_happen"),
      word("👉💥", "push", "verb", "to press something away from you to make it move", "/reference/word/global_push"),
      word("🤚⬅️", "pull", "verb", "to move something toward you using force", "/reference/word/global_pull"),
      word("🛝", "a swing", "noun", "a seat that hangs from ropes or chains and moves back and forth", "/reference/word/global_swing_toy"),
      word("⛸️", "a skater", "noun", "a person who moves on skates", "/reference/word/global_skater"),
      word("⏩", "forward", "adverb", "toward the front; in the direction ahead of you", "/reference/word/global_forward"),
      word("⏪", "backward", "adverb", "toward the back; in the direction behind you", "/reference/word/global_backward"),
      word("🌀", "spin", "verb", "to turn around and around quickly in a circle", "/reference/word/global_spin"),
      word("💥⬇️", "fall over", "verb", "to lose your balance and drop down", "/reference/word/global_fall_over"),
      word("⚖️", "balance", "noun/verb", "the ability to stay steady and not fall over", "/reference/word/global_balance"),
      word("⬇️", "down", "adverb", "toward a lower place; from a higher position to a lower one", "/reference/word/global_down"),
      word("🔗", "connect", "verb", "to join two things together", "/reference/word/global_connect"),
      word("🤲💫", "rub", "verb", "to move one thing back and forth against another", "/reference/word/global_rub"),
      word("🤚🔥", "friction", "noun", "the force created when two things rub together", "/reference/word/global_friction")
    ]
  },
  {
    id: "vocab2", title: "Vocabulary 2", sub: "Direction & force words", icon: "②",
    accent: "#2f9c8e", tint: "#e6f4f1", count: 5,
    words: [
      word("🚶‍♂️↗️", "away from", "preposition", "moving in the opposite direction from something or someone", "/reference/word/global_away_from"),
      word("🧭", "direction", "noun", "the way something moves or points", "/reference/word/global_direction"),
      word("🚶‍♂️↘️", "toward", "preposition", "moving in the direction of something or someone", "/reference/word/global_toward"),
      word("🚵", "lean", "verb", "to bend your body to one side", "/reference/word/global_lean"),
      word("🌍⬇️", "gravity", "noun", "the force that pulls things down toward the Earth", "/reference/word/global_gravity")
    ]
  },
  {
    id: "academic", title: "Academic", sub: "Thinking & study language", icon: "★",
    accent: "var(--amber)", tint: "var(--amber-panel)", count: 5,
    words: [
      word("🗣️📝", "describe", "verb", "to say or write what a person, place, or thing is like", "/reference/academic/global_describe", true),
      word("🧩✅", "match", "verb", "to find two things that go together or are the same", "/reference/academic/global_match", true),
      word("📖🔎", "definitions", "noun", "sentences that explain what a word means", "/reference/academic/global_definitions", true),
      word("📋➡️", "instructions", "noun", "steps that tell you how to do something", "/reference/academic/global_instructions", true),
      word("📋", "description", "noun", "words that tell what something is like", "/reference/academic/global_description", true)
    ]
  },
  {
    id: "glossary", title: "Glossary", sub: "Reading & topic terms", icon: "📖",
    accent: "var(--muted-2)", tint: "#f0f1ec", count: 22,
    words: [
      word("🏃", "an athlete", "noun", "a person who is skilled at sports and physical activities", "/reference/word/global_athlete"),
      word("🤸‍♀️⬆️", "jump", "verb", "to push yourself off the ground into the air", "/reference/word/global_jump"),
      word("⛷️", "a skier", "noun", "a person who moves on skis over snow", "/reference/word/global_skier"),
      word("🎠", "merry-go-round", "noun", "a round platform with seats that turns around and around for fun", "/reference/word/global_merry_go_round"),
      word("⬆️⬇️", "seesaw", "noun", "a long board that goes up and down when two people sit on each end", "/reference/word/global_seesaw"),
      word("🛹", "skateboarder", "noun", "a person who rides a skateboard", "/reference/word/global_skateboarder"),
      word("🎾🔗", "tetherball", "noun", "a game where you hit a ball tied to a pole with a rope", "/reference/word/global_tetherball"),
      word("🔒🎢", "safety bar", "noun", "a bar you hold and pull down to stay safe in a moving ride", "/reference/word/global_safety_bar"),
      word("⛰️", "steep", "adjective", "rising or falling very sharply, like a hill", "/reference/word/global_steep"),
      word("🎡🔄", "centripetal force", "noun", "the force that keeps something moving in a circle", "/reference/word/global_centripetal_force"),
      word("➡️🛑", "inertia", "noun", "the tendency of something moving to keep moving", "/reference/word/global_inertia"),
      word("🙌🎢", "experience", "verb", "something that happens to you that you feel or notice", "/reference/word/global_experience"),
      word("⛸️✨", "figure skating", "noun", "a sport where skaters move and spin on ice in patterns", "/reference/word/global_figure_skating"),
      word("⛷️🕺", "freestyle skiing", "noun", "a sport where skiers do jumps and tricks in the air", "/reference/word/global_freestyle_skiing"),
      word("🧊⛸️", "ice rink", "noun", "a flat, icy surface where people skate", "/reference/word/global_ice_rink"),
      word("🌀↩️", "twist", "verb", "to turn your body or an object around quickly", "/reference/word/global_twist"),
      word("🌐🔄", "gyroscope", "noun", "a spinning device with rings that can move in many directions", "/reference/word/global_gyroscope"),
      word("🧍‍♂️✔️", "independently", "adverb", "without help from anyone or anything else", "/reference/word/global_independently"),
      word("🤢🎢", "motion sickness", "noun", "a feeling of sickness caused by spinning or moving quickly", "/reference/word/global_motion_sickness"),
      word("🏗️", "structure", "noun", "something that is built with connected parts", "/reference/word/global_structure"),
      word("🏃‍♂️💨", "motion", "noun", "the act of moving or changing position", "/reference/word/global_motion"),
      word("🎢🎡", "theme park", "noun", "a large park with rides and games for fun", "/reference/word/global_theme_park")
    ]
  }
];

const jumps = [
  { label: "Vocabulary 1", count: 15, dot: "var(--good)", href: "#vocab1" },
  { label: "Vocabulary 2", count: 5, dot: "#2f9c8e", href: "#vocab2" },
  { label: "Academic", count: 5, dot: "var(--amber)", href: "#academic" },
  { label: "Glossary", count: 22, dot: "var(--muted-2)", href: "#glossary" }
];

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
            <div className="unit-stat"><b>47</b><span>words</span></div>
            <i className="unit-stat-sep" />
            <div className="unit-stat"><b style={{ color: "var(--amber)" }}>5</b><span>academic</span></div>
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
                    <span className="unit-word-dot" title="Not started" style={{ background: "#fff", border: "2px solid #d8dcd2" }} />
                    <span className="unit-word-arrow">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
