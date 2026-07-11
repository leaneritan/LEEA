"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { isMultiEmoji } from "@/components/reference/emoji-utils";
import {
  unit2AcademicItems,
  unit2GlossaryItems,
  unit2Vocab1Items,
  unit2Vocab2Items
} from "@/data/reference";
import { toWordEntry, type PosTag, type WordEntry } from "@/data/reference-shapes";

type Section = {
  id: string;
  title: string;
  sub: string;
  icon: string;
  accent: string;
  tint: string;
  words: WordEntry[];
};

const POS_BG: Record<PosTag, string> = {
  noun: "var(--pos-noun-bg)",
  verb: "var(--pos-verb-bg)",
  adjective: "var(--pos-adj-bg)",
  adverb: "var(--pos-adv-bg)",
  "adj/adv": "var(--pos-adj-bg)",
  phrase: "var(--pos-noun-bg)",
  other: "var(--pos-noun-bg)"
};

const POS_INK: Record<PosTag, string> = {
  noun: "var(--pos-noun)",
  verb: "var(--pos-verb)",
  adjective: "var(--pos-adj)",
  adverb: "var(--pos-adv)",
  "adj/adv": "var(--pos-adj)",
  phrase: "var(--pos-noun)",
  other: "var(--pos-noun)"
};

const unitSections: Section[] = [
  {
    id: "vocab1",
    title: "Vocabulary 1",
    sub: "Core unit words",
    icon: "①",
    accent: "var(--good)",
    tint: "var(--good-tint)",
    words: unit2Vocab1Items.map(toWordEntry)
  },
  {
    id: "vocab2",
    title: "Vocabulary 2",
    sub: "Frequency & habits",
    icon: "②",
    accent: "#2f9c8e",
    tint: "#e6f4f1",
    words: unit2Vocab2Items.map(toWordEntry)
  },
  {
    id: "academic",
    title: "Academic",
    sub: "Thinking & study language",
    icon: "★",
    accent: "var(--amber)",
    tint: "var(--amber-panel)",
    words: unit2AcademicItems.map(toWordEntry)
  },
  {
    id: "glossary",
    title: "Glossary",
    sub: "Reading & topic terms",
    icon: "📖",
    accent: "var(--muted-2)",
    tint: "#f0f1ec",
    words: unit2GlossaryItems.map(toWordEntry)
  }
].filter(s => s.words.length > 0);

const jumps = [
  ...unitSections.map((section) => ({
    label: section.title,
    count: section.words.length,
    dot: section.accent,
    href: `#${section.id}`
  }))
];

const totalWords = unitSections.reduce((sum, section) => sum + section.words.length, 0);
const academicCount = unitSections.find((section) => section.id === "academic")?.words.length ?? 0;

function hrefForWord(word: WordEntry) {
  return word.type === "academic" ? `/reference/academic/${word.id}` : `/reference/word/${word.id}`;
}

export default function UnitReference2() {
  return (
    <AppShell active="reference" crumbs={["Reference", "Our World", "Unit 2"]}>
      <div className="unit-ref">
        <Link className="unit-back" href="/reference">← Back to Browse</Link>

        <section className="unit-hero">
          <div className="unit-hero-left">
            <div className="unit-hero-icon"><span /></div>
            <div>
              <div className="unit-hero-eyebrow-row">
                <span className="unit-hero-eyebrow">Our World · Level 4 · Unit 2</span>
              </div>
              <h1 className="unit-hero-title">Fresh Food</h1>
            </div>
          </div>
          <div className="unit-hero-stats">
            <div className="unit-stat"><b>{totalWords}</b><span>words</span></div>
            <i className="unit-stat-sep" />
            <div className="unit-stat"><b style={{ color: "var(--amber)" }}>{academicCount}</b><span>academic</span></div>
          </div>
        </section>

        <div className="unit-jumpbar">
          {jumps.map((jump) => (
            <a className="unit-jump" href={jump.href} key={jump.label}>
              <span className="unit-jump-dot" style={{ background: jump.dot }} />
              {jump.label}
              <span className="unit-jump-count">{jump.count}</span>
            </a>
          ))}
        </div>

        {unitSections.map((section) => (
          <section className="unit-section" id={section.id} key={section.id}>
            <div className="unit-section-accent" style={{ background: section.accent }} />
            <div className="unit-section-head">
              <div className="unit-section-head-left">
                <span className="unit-section-icon" style={{ background: section.tint, color: section.accent }}>{section.icon}</span>
                <div>
                  <h2 className="unit-section-title">{section.title}</h2>
                  <div className="unit-section-sub">{section.sub}</div>
                </div>
              </div>
              <span className="unit-section-count">{section.words.length} words</span>
            </div>
            <div className="unit-word-list">
              {section.words.map((word) => (
                <Link className="unit-word" href={hrefForWord(word)} key={word.id}>
                  <span className={`unit-word-emoji${isMultiEmoji(word.emoji) ? " unit-word-emoji--multi" : ""}`} style={{ background: section.tint }}>{word.emoji}</span>
                  <span className="unit-word-main">
                    <span className="unit-word-headline">
                      <span className="unit-word-text">{word.word}</span>
                      <span className="unit-pos" style={{ background: POS_BG[word.pos], color: POS_INK[word.pos] }}>{word.pos}</span>
                      {word.type === "academic" ? <span className="unit-academic">★ Academic</span> : null}
                    </span>
                    <span className="unit-word-meaning">{word.definition}</span>
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
