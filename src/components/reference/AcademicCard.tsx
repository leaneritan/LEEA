"use client";

/**
 * AcademicCard — redesigned `/reference/academic/[id]`.
 *
 * Per design_handoff_leea_reference/Academic Card.dc.html. Distinguished
 * from Word Card by the amber accent strip, the dual EN/JP meaning band,
 * and the richer pedagogy sections (When To Use, How To Use, Examples by
 * context, Non-Examples, Mini-Quiz with feedback, Collocations, JP Note,
 * Practice Prompt).
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import { useJapanesePreference } from "@/components/AppShell";
import { useKnownWordIds } from "@/components/useKnownWordIds";
import type { AcademicEntry } from "@/data/reference-shapes";

const POS_LABEL: Record<string, string> = {
  verb: "verb",
  noun: "noun",
  adjective: "adjective",
  adverb: "adverb",
  "adj/adv": "adj/adv",
  phrase: "phrase",
  other: "word"
};

type QuizState = Record<number, number>;

export function AcademicCard({ entry }: { entry: AcademicEntry }) {
  const jp = useJapanesePreference();
  const { knownWordSet, setWordKnown } = useKnownWordIds();
  const known = knownWordSet.has(entry.id);
  const [picks, setPicks] = useState<QuizState>({});

  const quizScoreLine = useMemo(() => {
    if (entry.academic.quiz.length === 0) return "";
    const answered = Object.keys(picks).length;
    const correct = Object.entries(picks).filter(
      ([qi, opt]) => entry.academic.quiz[Number(qi)]?.correctIndex === opt
    ).length;
    return `${correct} / ${entry.academic.quiz.length} correct · ${answered} answered`;
  }, [picks, entry.academic.quiz]);

  return (
    <div className="rcardv2-shell">
      <Link href="/reference" className="rcardv2-back">
        ← Back to Academic Language
      </Link>

      <section className="rcardv2-hero rcardv2-hero--academic">
        <div className="rcardv2-academic-strip" />
        <div className="rcardv2-hero-inner">
          <div className="rcardv2-hero-main">
            <div className="rcardv2-emoji rcardv2-emoji--academic" aria-hidden>
              {entry.emoji}
            </div>
            <div className="rcardv2-hero-text">
              <span className="rcardv2-academic-flag">★ Academic word</span>
              <div className="rcardv2-hero-title">
                <h1>{entry.word}</h1>
                <span className="rcardv2-pos-tag rcardv2-pos-tag--blue">{POS_LABEL[entry.pos] ?? entry.pos}</span>
                {entry.syllables && <span className="rcardv2-syllables">{entry.syllables}</span>}
                {entry.pronUS && <span className="rcardv2-ipa-soft">/{entry.pronUS.replace(/^\/|\/$/g, "")}/</span>}
              </div>
              <div className="rcardv2-hero-source-tags">
                {entry.sources.map((source, idx) => (
                  <span
                    key={`${source.tag}-${idx}`}
                    className={`rcardv2-source-code-chip${source.course === "our-world" ? " is-ow" : ""}`}
                  >
                    {source.tag}
                  </span>
                ))}
                <span className="rcardv2-source-meta">
                  · one card · {entry.sources.length} source{entry.sources.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>

          <div className="rcardv2-hero-aside">
            <span className={`rcardv2-status-pill${known ? " is-known" : ""}`}>
              <span className="rcardv2-status-dot" />
              {known ? "Known" : "To review"}
            </span>
            <div className="rcardv2-seg">
              <button type="button" className={`rcardv2-seg-btn${known ? " is-active" : ""}`} onClick={() => setWordKnown(entry.id, true)}>
                I know it
              </button>
              <button type="button" className={`rcardv2-seg-btn${!known ? " is-active" : ""}`} onClick={() => setWordKnown(entry.id, false)}>
                Review later
              </button>
            </div>
          </div>
        </div>

        <div className="rcardv2-meaning-band">
          <div className="rcardv2-meaning-cell">
            <div className="rcardv2-eyebrow">Meaning</div>
            <p>{entry.academic.meaningEN || entry.definition}</p>
          </div>
          <div className="rcardv2-meaning-cell rcardv2-meaning-cell--jp">
            <div className="rcardv2-eyebrow rcardv2-eyebrow--blue">意味 · Japanese</div>
            {jp && entry.academic.meaningJP ? (
              <p lang="ja">{entry.academic.meaningJP}</p>
            ) : (
              <p className="rcardv2-meaning-off">Turn on Japanese in the top bar to view.</p>
            )}
          </div>
        </div>
      </section>

      <div className="rcardv2-grid">
        <div className="rcardv2-col-left">
          {entry.academic.whenToUse.length > 0 && (
            <section className="rcardv2-section">
              <div className="rcardv2-eyebrow">
                When to use it <span className="rcardv2-eyebrow-mute">· {entry.academic.whenToUse.length} contexts</span>
              </div>
              <div className="rcardv2-contexts">
                {entry.academic.whenToUse.map((context, idx) => (
                  <div key={idx} className="rcardv2-context">
                    <span className="rcardv2-context-num">{idx + 1}</span>
                    <p>{context}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {entry.academic.howToUse && (
            <section className="rcardv2-section">
              <div className="rcardv2-eyebrow">How to use it</div>
              <PatternChips structure={entry.academic.howToUse} word={entry.word} />
            </section>
          )}

          {(entry.academic.examples.test || entry.academic.examples.school || entry.academic.examples.real) && (
            <section className="rcardv2-section">
              <div className="rcardv2-eyebrow">Examples</div>
              <div className="rcardv2-ex-cards">
                {entry.academic.examples.test && (
                  <ExampleCard label="Test" icon="📝" tone="test" sentence={entry.academic.examples.test} word={entry.word} />
                )}
                {entry.academic.examples.school && (
                  <ExampleCard label="School" icon="🏫" tone="school" sentence={entry.academic.examples.school} word={entry.word} />
                )}
                {entry.academic.examples.real && (
                  <ExampleCard label="Real world" icon="🌍" tone="real" sentence={entry.academic.examples.real} word={entry.word} />
                )}
              </div>
            </section>
          )}

          {entry.academic.nonExamples.length > 0 && (
            <section className="rcardv2-section">
              <div className="rcardv2-eyebrow rcardv2-eyebrow--warn">Watch out — not like this</div>
              <div className="rcardv2-nonex-list">
                {entry.academic.nonExamples.map((wrong, idx) => (
                  <div key={idx} className="rcardv2-nonex">
                    <span className="rcardv2-nonex-x" aria-hidden>✕</span>
                    <p>{wrong}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {entry.academic.quiz.length > 0 && (
            <section className="rcardv2-section">
              <div className="rcardv2-quiz-head">
                <div className="rcardv2-eyebrow">Quick check</div>
                <span className="rcardv2-quiz-score">{quizScoreLine}</span>
              </div>
              <div className="rcardv2-quiz">
                {entry.academic.quiz.map((q, qi) => {
                  const pick = picks[qi];
                  const answered = pick != null;
                  return (
                    <div key={qi} className="rcardv2-quiz-q">
                      <div className="rcardv2-quiz-prompt">
                        {qi + 1}. {q.prompt}
                      </div>
                      <div className="rcardv2-quiz-opts">
                        {q.options.map((opt, oi) => {
                          const isCorrect = oi === q.correctIndex;
                          const isPicked = pick === oi;
                          let stateClass = "";
                          if (answered) {
                            if (isCorrect) stateClass = " is-correct";
                            else if (isPicked) stateClass = " is-wrong";
                            else stateClass = " is-faded";
                          }
                          return (
                            <button
                              key={oi}
                              type="button"
                              className={`rcardv2-quiz-opt${stateClass}`}
                              disabled={answered}
                              onClick={() => setPicks((prev) => ({ ...prev, [qi]: oi }))}
                            >
                              <span>{opt}</span>
                              {answered && isCorrect && <span className="rcardv2-mark">✓</span>}
                              {answered && isPicked && !isCorrect && <span className="rcardv2-mark">✕</span>}
                            </button>
                          );
                        })}
                      </div>
                      {answered && (
                        <div className={`rcardv2-quiz-fb${pick === q.correctIndex ? " is-correct" : " is-wrong"}`}>
                          <div className="rcardv2-quiz-fb-title">
                            {pick === q.correctIndex ? "Nice — that's right." : "Not quite."}
                          </div>
                          <p>{q.explanationEN}</p>
                          {jp && q.explanationJP && (
                            <p className="rcardv2-quiz-fb-jp" lang="ja">
                              {q.explanationJP}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <div className="rcardv2-col-right">
          {entry.academic.collocations.length > 0 && (
            <section className="rcardv2-section rcardv2-section--rail">
              <div className="rcardv2-eyebrow">Common collocations</div>
              <div className="rcardv2-chips-wrap">
                {entry.academic.collocations.map((collocation) => (
                  <span key={collocation} className="rcardv2-coll-chip">
                    {collocation}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="rcardv2-section rcardv2-section--rail rcardv2-section--blue">
            <div className="rcardv2-eyebrow rcardv2-eyebrow--blue">日本語ノート · Japanese note</div>
            {jp && entry.academic.jpNote ? (
              <p lang="ja" className="rcardv2-jp-note">
                {entry.academic.jpNote}
              </p>
            ) : (
              <p className="rcardv2-jp-note-off">Turn on Japanese to view this note.</p>
            )}
          </section>

          {entry.academic.practicePrompt && (
            <section className="rcardv2-section rcardv2-section--practice">
              <div className="rcardv2-eyebrow rcardv2-eyebrow--amber">✎ Practice prompt</div>
              <p className="rcardv2-practice">{entry.academic.practicePrompt}</p>
            </section>
          )}

          <section className="rcardv2-section rcardv2-section--rail">
            <div className="rcardv2-eyebrow">Appears in</div>
            <div className="rcardv2-sources">
              {entry.sources.map((source, idx) => (
                <div key={`${source.tag}-${idx}`} className="rcardv2-source-row">
                  <span className={`rcardv2-source-tile rcardv2-source-tile--${source.course}`} aria-hidden>
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

          <button type="button" className="rcardv2-locked" disabled title="Lesson not published yet">
            <span className="rcardv2-locked-icon" aria-hidden>🔒</span>
            <span className="rcardv2-locked-text">
              Open related lesson
              <span>Academic Language · available when live</span>
            </span>
          </button>
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

function PatternChips({ structure, word }: { structure: string; word: string }) {
  /* Render the structure as colored chips. Best-effort tokenization on
     spaces; the word itself gets the verb color, A/B placeholders get
     amber, prepositions get violet. */
  const parts = structure.split(/\s+/).filter(Boolean);
  return (
    <div className="rcardv2-pattern">
      {parts.map((part, idx) => {
        const lower = part.toLowerCase();
        let cls = "rcardv2-pattern-chip rcardv2-pattern-chip--noun";
        if (lower === word.toLowerCase() || lower.startsWith(word.toLowerCase())) cls = "rcardv2-pattern-chip rcardv2-pattern-chip--verb";
        else if (["a", "b", "x", "y"].includes(lower)) cls = "rcardv2-pattern-chip rcardv2-pattern-chip--ph";
        else if (["to", "for", "with", "of", "from", "by", "in", "on", "and", "or"].includes(lower)) cls = "rcardv2-pattern-chip rcardv2-pattern-chip--prep";
        return (
          <span key={idx} className={cls}>
            {part}
          </span>
        );
      })}
    </div>
  );
}

function ExampleCard({
  label,
  icon,
  tone,
  sentence,
  word
}: {
  label: string;
  icon: string;
  tone: "test" | "school" | "real";
  sentence: string;
  word: string;
}) {
  return (
    <div className="rcardv2-ex-card">
      <span className={`rcardv2-ex-tag rcardv2-ex-tag--${tone}`}>
        {icon} {label}
      </span>
      <p className="rcardv2-ex-text">{highlightWord(sentence, word)}</p>
    </div>
  );
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
