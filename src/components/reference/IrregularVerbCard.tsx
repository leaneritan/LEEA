"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useKnownWordIds } from "@/components/useKnownWordIds";
import { getIrregularVerbNav, type IrregularVerbEntry } from "@/data/irregularVerbs";

/* Bolds whichever of infinitive/past/past-participle actually appears in a
   given example sentence — same idea as WordCard's highlightWord, just
   without the multi-word-phrase / underscore handling that light-card verbs
   don't need. */
function highlight(text: string, forms: string[]) {
  const candidates = forms.filter(Boolean).flatMap((form) => form.split("/"));
  const pattern = candidates.map((form) => form.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const re = new RegExp(`(${pattern})`, "ig");
  const parts = text.split(re);
  return parts.map((part, i) =>
    candidates.some((form) => form.toLowerCase() === part.toLowerCase()) ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

export function IrregularVerbCard({ entry }: { entry: IrregularVerbEntry }) {
  const { knownWordSet, setWordKnown } = useKnownWordIds();
  const known = knownWordSet.has(entry.id);
  const [playing, setPlaying] = useState(false);
  const nav = useMemo(() => getIrregularVerbNav(entry.id), [entry.id]);
  const forms = [entry.infinitive, entry.past, entry.pastParticiple];

  if (!entry.light) return null;

  function playAudio() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    setPlaying(true);
    const utterance = new SpeechSynthesisUtterance(entry.infinitive);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.onend = () => setPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    window.setTimeout(() => setPlaying(false), 1800);
  }

  return (
    <div className="rcardv2-shell rcardv2-shell--word">
      <Link href="/reference/irregular-verbs" className="rcardv2-back">
        ← Back to Irregular Verbs
      </Link>

      <section className="rcardv2-hero">
        <div className="rcardv2-hero-main">
          <div className="rcardv2-emoji" aria-hidden>
            {entry.light.emoji}
          </div>

          <div className="rcardv2-hero-text">
            <div className="rcardv2-hero-title">
              <h1>{entry.infinitive}</h1>
              <span className="rcardv2-pos-tag">verb</span>
            </div>

            <div className="rcardv2-hero-pron">
              <button
                type="button"
                className={`rcardv2-audio${playing ? " is-playing" : ""}`}
                onClick={playAudio}
                title="Listen"
                aria-label={`Pronounce ${entry.infinitive}`}
              >
                {playing ? <span className="rcardv2-eq" aria-hidden /> : "▶"}
              </button>
            </div>
          </div>
        </div>

        <div className="rcardv2-hero-aside">
          <span className={`rcardv2-status-pill${known ? " is-known" : ""}`}>
            <span className="rcardv2-status-dot" />
            {known ? "Known" : "To review"}
          </span>
          <div className="rcardv2-seg" aria-label="Word confidence">
            <button type="button" className={`rcardv2-seg-btn${known ? " is-active" : ""}`} onClick={() => setWordKnown(entry.id, true)}>
              I know it
            </button>
            <button type="button" className={`rcardv2-seg-btn${!known ? " is-active" : ""}`} onClick={() => setWordKnown(entry.id, false)}>
              Review later
            </button>
          </div>
        </div>
      </section>

      <nav className="rcardv2-prevnext" aria-label="Irregular verb navigation">
        {nav.prev ? (
          <Link href={nav.prev.href} className="rcardv2-prevnext-btn">
            <span className="rcardv2-prevnext-arrow">←</span>
            {nav.prev.infinitive}
          </Link>
        ) : (
          <button type="button" className="rcardv2-prevnext-btn is-disabled" disabled>
            <span className="rcardv2-prevnext-arrow">←</span> Start
          </button>
        )}

        <div className="rcardv2-prevnext-pos">
          <div className="rcardv2-prevnext-count">
            Verb {nav.index} of {nav.total}
          </div>
        </div>

        {nav.next ? (
          <Link href={nav.next.href} className="rcardv2-prevnext-btn">
            {nav.next.infinitive}
            <span className="rcardv2-prevnext-arrow">→</span>
          </Link>
        ) : (
          <button type="button" className="rcardv2-prevnext-btn is-disabled" disabled>
            Next <span className="rcardv2-prevnext-arrow">→</span>
          </button>
        )}
      </nav>

      <div className="rcardv2-grid rcardv2-grid--single">
        <div className="rcardv2-col-left">
          <section className="rcardv2-section">
            <div className="rcardv2-eyebrow">Forms</div>
            <div className="rcardv2-forms">
              <div className="rcardv2-form">
                <span className="rcardv2-form-label">Infinitive</span>
                <span className="rcardv2-form-value">{entry.infinitive}</span>
              </div>
              <div className="rcardv2-form">
                <span className="rcardv2-form-label">Past</span>
                <span className="rcardv2-form-value">{entry.past}</span>
              </div>
              <div className="rcardv2-form">
                <span className="rcardv2-form-label">Past participle</span>
                <span className="rcardv2-form-value">{entry.pastParticiple}</span>
              </div>
            </div>
          </section>

          <section className="rcardv2-section">
            <div className="rcardv2-eyebrow">In context</div>
            <div className="rcardv2-examples">
              {entry.light.examples.map((example, idx) => (
                <div key={idx} className="rcardv2-example">
                  <p>{highlight(example, forms)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
