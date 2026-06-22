"use client";

/**
 * WordCard — redesigned `/reference/word/[id]`.
 *
 * Per design_handoff_leea_reference/Word Card.dc.html: hero with large
 * emoji + word + POS + IPA + JP gloss + status pill + Know/Review segmented
 * control; left column with Meaning (numbered senses) and In Context
 * (examples with source); right rail with Where It's Taught, Word Family,
 * Similar Words.
 */

import Link from "next/link";
import { useState } from "react";
import { useJapanesePreference } from "@/components/AppShell";
import { useKnownWordIds } from "@/components/useKnownWordIds";
import type { WordEntry } from "@/data/reference-shapes";

const POS_LABEL: Record<string, string> = {
  verb: "verb",
  noun: "noun",
  adjective: "adjective",
  adverb: "adverb",
  "adj/adv": "adj/adv",
  phrase: "phrase",
  other: "word"
};

export function WordCard({ entry }: { entry: WordEntry }) {
  const jp = useJapanesePreference();
  const { knownWordSet, setWordKnown } = useKnownWordIds();
  const known = knownWordSet.has(entry.id);
  const [playing, setPlaying] = useState(false);

  function playAudio() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    setPlaying(true);
    const utterance = new SpeechSynthesisUtterance(entry.word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.onend = () => setPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    /* Fallback if onend doesn't fire */
    window.setTimeout(() => setPlaying(false), 1800);
  }

  return (
    <div className="rcardv2-shell">
      <Link href="/reference" className="rcardv2-back">
        ← Back to Vocabulary
      </Link>

      <section className="rcardv2-hero">
        <div className="rcardv2-hero-main">
          <div className="rcardv2-emoji" aria-hidden>
            {entry.emoji}
          </div>
          <div className="rcardv2-hero-text">
            <div className="rcardv2-hero-title">
              <h1>{entry.word}</h1>
              <span className="rcardv2-pos-tag">{POS_LABEL[entry.pos] ?? entry.pos}</span>
              {entry.syllables && <span className="rcardv2-syllables">{entry.syllables}</span>}
            </div>
            <div className="rcardv2-hero-pron">
              <button
                type="button"
                className={`rcardv2-audio${playing ? " is-playing" : ""}`}
                onClick={playAudio}
                title="Listen"
                aria-label={`Pronounce ${entry.word}`}
              >
                {playing ? <span className="rcardv2-eq" aria-hidden /> : "▶"}
              </button>
              {entry.pronUS && (
                <>
                  <span className="rcardv2-ipa">{entry.pronUS}</span>
                  <span className="rcardv2-dot-sep">·</span>
                  <span className="rcardv2-ipa-mark">US</span>
                </>
              )}
            </div>
            {jp && entry.jp.gloss && (
              <p className="rcardv2-hero-jp" lang="ja">
                {entry.jp.gloss}
                {entry.jp.needsReview && <span className="rcardv2-needs-badge">needs review</span>}
              </p>
            )}
          </div>
        </div>

        <div className="rcardv2-hero-aside">
          <span className={`rcardv2-status-pill${known ? " is-known" : ""}`}>
            <span className="rcardv2-status-dot" />
            {known ? "Known" : "To review"}
          </span>
          <div className="rcardv2-seg">
            <button
              type="button"
              className={`rcardv2-seg-btn${known ? " is-active" : ""}`}
              onClick={() => setWordKnown(entry.id, true)}
            >
              I know it
            </button>
            <button
              type="button"
              className={`rcardv2-seg-btn${!known ? " is-active" : ""}`}
              onClick={() => setWordKnown(entry.id, false)}
            >
              Review later
            </button>
          </div>
        </div>
      </section>

      <div className="rcardv2-grid">
        <div className="rcardv2-col-left">
          <section className="rcardv2-section">
            <div className="rcardv2-eyebrow">Meaning</div>
            <div className="rcardv2-meaning">
              <div className="rcardv2-sense">
                <span className="rcardv2-sense-num">1</span>
                <p>{entry.definition}</p>
              </div>
            </div>
          </section>

          {entry.examples.length > 0 && (
            <section className="rcardv2-section">
              <div className="rcardv2-eyebrow">In context</div>
              <div className="rcardv2-examples">
                {entry.examples.map((example, idx) => (
                  <div key={idx} className="rcardv2-example">
                    <p>{highlightWord(example, entry.word)}</p>
                    {jp && entry.jp.sentence && idx === 0 && (
                      <p className="rcardv2-example-jp" lang="ja">
                        {entry.jp.sentence}
                      </p>
                    )}
                    {entry.sources[0] && (
                      <div className="rcardv2-example-src">
                        {sourceLabel(entry.sources[0])}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="rcardv2-col-right">
          <section className="rcardv2-section rcardv2-section--rail">
            <div className="rcardv2-eyebrow">Where it&rsquo;s taught</div>
            <div className="rcardv2-sources">
              {entry.sources.map((source, idx) => (
                <div key={`${source.tag}-${idx}`} className="rcardv2-source-row">
                  <span
                    className={`rcardv2-source-tile rcardv2-source-tile--${source.course}`}
                    aria-hidden
                  >
                    {source.course === "our-world" ? <span className="rcardv2-tile-ow-mark" /> : source.course === "joyful-work" ? "J" : "JH"}
                  </span>
                  <div className="rcardv2-source-info">
                    <div className="rcardv2-source-label">
                      {courseLabel(source.course)}
                      {source.level != null && source.unit != null ? ` · L${source.level} U${source.unit}` : ""}
                    </div>
                    <div className="rcardv2-source-tag">{source.tag}</div>
                  </div>
                  <span className="rcardv2-source-arrow">→</span>
                </div>
              ))}
            </div>
          </section>

          {entry.family.length > 0 && (
            <section className="rcardv2-section rcardv2-section--rail">
              <div className="rcardv2-eyebrow">Word family</div>
              <div className="rcardv2-chips-wrap">
                {entry.family.map((member) => (
                  <span key={member} className="rcardv2-family-chip">
                    {member}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function courseLabel(c: string) {
  if (c === "joyful-work") return "Joyful Work";
  if (c === "junior-high") return "Junior High";
  return "Our World";
}

function sourceLabel(s: WordEntry["sources"][number]) {
  const parts: string[] = [courseLabel(s.course)];
  if (s.unit != null) parts.push(`Unit ${s.unit}`);
  parts.push(s.tag);
  return parts.join(" · ");
}

function highlightWord(text: string, word: string) {
  const re = new RegExp(`(${escapeRegex(word)}\\w*)`, "ig");
  const parts = text.split(re);
  return parts.map((part, i) =>
    part && new RegExp(`^${escapeRegex(word)}\\w*$`, "i").test(part) ? (
      <strong key={i}>{part}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
