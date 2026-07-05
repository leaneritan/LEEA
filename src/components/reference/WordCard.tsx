"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useJapanesePreference } from "@/components/AppShell";
import { useKnownWordIds } from "@/components/useKnownWordIds";
import type { WordEntry } from "@/data/reference-shapes";
import { getVerbForms, type VerbForms } from "@/data/verbForms";
import sanseidoIndex from "../../../content/subjects/english/junior-high/sanseido-index.json";
import { allWords } from "./ref-data";
import { isMultiEmoji } from "./emoji-utils";

type SanseidoEntry = { w: string; u: string };
const sanseidoByWord = new Map(
  (sanseidoIndex as SanseidoEntry[]).map((entry) => [entry.w.toLowerCase(), entry.u])
);

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

  const sanseidoUrl = useMemo(() => sanseidoByWord.get(entry.word.toLowerCase()), [entry]);
  const family = useMemo(() => getWordFamily(entry), [entry]);
  const similar = useMemo(() => getSimilarWords(entry, family), [entry, family]);
  const verbForms = useMemo(
    /* Use the normalized form for conjugation. The display word may include
       an article ("a cut"), which would make the forms engine conjugate "a"
       and produce nonsense like "aed cut". */
    () => (entry.pos === "verb" ? getVerbForms(entry.normalizedWord || entry.word) : null),
    [entry.normalizedWord, entry.pos, entry.word]
  );

  function playAudio() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    setPlaying(true);
    const utterance = new SpeechSynthesisUtterance(entry.word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.onend = () => setPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    window.setTimeout(() => setPlaying(false), 1800);
  }

  return (
    <div className="rcardv2-shell rcardv2-shell--word">
      <Link href="/reference" className="rcardv2-back">
        ← Back to Vocabulary
      </Link>

      <section className="rcardv2-hero">
        <div className="rcardv2-hero-main">
          <div className={`rcardv2-emoji${isMultiEmoji(entry.emoji) ? " rcardv2-emoji--multi" : ""}`} aria-hidden>
            {entry.emoji}
          </div>

          <div className="rcardv2-hero-text">
            <div className="rcardv2-hero-title">
              <h1>{entry.word}</h1>
              <span className="rcardv2-pos-tag">{POS_LABEL[entry.pos] ?? entry.pos}</span>
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
                  <span className="rcardv2-ipa">/{entry.pronUS}/</span>
                  <span className="rcardv2-dot-sep">·</span>
                  <span className="rcardv2-ipa-mark">US</span>
                </>
              )}
            </div>

            {entry.syllables && (
              <div className="rcardv2-hero-syll">
                <span className="rcardv2-syll-label">Syllables</span>
                <span className="rcardv2-syll-chips">
                  {entry.syllables.split("-").map((part, idx) => (
                    <span key={idx} className="rcardv2-syll-chip">
                      {part}
                    </span>
                  ))}
                </span>
                <span className="rcardv2-syll-count">
                  {entry.syllables.split("-").length} syllables
                </span>
              </div>
            )}

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
          <div className="rcardv2-seg" aria-label="Word confidence">
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
              {entry.senses.map((sense, idx) => (
                <div className="rcardv2-sense" key={idx}>
                  <span className="rcardv2-sense-num">{idx + 1}</span>
                  <div className="rcardv2-sense-body">
                    <p>
                      {sense.text}
                      {sense.context && <span className="rcardv2-sense-context">{sense.context}</span>}
                    </p>
                    {jp && sense.jp && (
                      <p className="rcardv2-sense-jp" lang="ja">
                        {sense.jp}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {jp && entry.jp.sentence && (
                <div className="rcardv2-sense">
                  <span className="rcardv2-sense-num">日</span>
                  <p lang="ja">{entry.jp.sentence}</p>
                </div>
              )}
            </div>
          </section>

          {verbForms && (
            <section className="rcardv2-section">
              <div className="rcardv2-eyebrow">Forms</div>
              <div className="rcardv2-forms">
                <div className="rcardv2-form">
                  <span className="rcardv2-form-label">Infinitive{jp && <span lang="ja"> · 原形</span>}</span>
                  <span className="rcardv2-form-value">{verbForms.infinitive}</span>
                </div>
                <div className="rcardv2-form">
                  <span className="rcardv2-form-label">Past{jp && <span lang="ja"> · 過去形</span>}</span>
                  <span className="rcardv2-form-value">{verbForms.past}</span>
                </div>
                <div className="rcardv2-form">
                  <span className="rcardv2-form-label">Past participle{jp && <span lang="ja"> · 過去分詞</span>}</span>
                  <span className="rcardv2-form-value">{verbForms.pastParticiple}</span>
                </div>
              </div>
            </section>
          )}

          {entry.examples.length > 0 && (
            <section className="rcardv2-section">
              <div className="rcardv2-eyebrow">In context</div>
              <div className="rcardv2-examples">
                {entry.examples.map((example, idx) => (
                  <div key={idx} className="rcardv2-example">
                    <p>{highlightWord(example, entry.normalizedWord || entry.word, verbForms)}</p>
                    {jp && entry.examplesJp[idx] && (
                      <p className="rcardv2-example-jp" lang="ja">
                        {entry.examplesJp[idx]}
                      </p>
                    )}
                    <div className="rcardv2-example-src">
                      {sourceLabel(entry.sources[idx] ?? entry.sources[0])}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="rcardv2-col-right">
          <section className="rcardv2-section rcardv2-section--rail">
            <div className="rcardv2-eyebrow">Where it&rsquo;s taught</div>
            <div className="rcardv2-sources">
              {entry.sources.map((source, idx) => (
                <SourceRow key={`${source.tag}-${idx}`} source={source} />
              ))}
              {sanseidoUrl && (
                <a
                  href={sanseidoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rcardv2-source-row"
                >
                  <span className="rcardv2-source-tile rcardv2-source-tile--junior-high" aria-hidden>
                    S
                  </span>
                  <span className="rcardv2-source-info">
                    <span className="rcardv2-source-label">Sanseido</span>
                    <span className="rcardv2-source-tag">Dictionary · external</span>
                  </span>
                  <span className="rcardv2-source-arrow" aria-hidden>
                    ↗
                  </span>
                </a>
              )}
            </div>
          </section>

          {family.length > 0 && (
            <section className="rcardv2-section rcardv2-section--rail">
              <div className="rcardv2-eyebrow">Word family</div>
              <div className="rcardv2-chips-wrap">
                {family.map((member) => (
                  <WordChip key={member.id} word={member} />
                ))}
              </div>
            </section>
          )}

          {similar.length > 0 && (
            <section className="rcardv2-section rcardv2-section--rail">
              <div className="rcardv2-eyebrow">Similar words</div>
              <div className="rcardv2-chips-wrap">
                {similar.map((word) => (
                  <WordChip key={word.id} word={word} subtle />
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function SourceRow({ source }: { source: WordEntry["sources"][number] }) {
  const liveLessonHref =
    source.lessonId && source.lessonStatus === "live" ? `/lessons/${source.lessonId}` : null;
  const content = (
    <>
      <span className={`rcardv2-source-tile rcardv2-source-tile--${source.course}`} aria-hidden>
        {source.course === "our-world" ? "OW" : source.course === "joyful-work" ? "J" : "S"}
      </span>
      <span className="rcardv2-source-info">
        <span className="rcardv2-source-label">{courseLabel(source.course)}</span>
        <span className="rcardv2-source-tag">{sourceMeta(source)}</span>
      </span>
      <span className="rcardv2-source-arrow" aria-hidden>
        {liveLessonHref ? "↗" : "→"}
      </span>
    </>
  );

  if (liveLessonHref) {
    return (
      <Link href={liveLessonHref} className="rcardv2-source-row">
        {content}
      </Link>
    );
  }

  return <div className="rcardv2-source-row">{content}</div>;
}

function WordChip({ word, subtle = false }: { word: WordEntry; subtle?: boolean }) {
  return (
    <Link
      href={`/reference/word/${word.id}`}
      className={`rcardv2-family-chip${subtle ? " rcardv2-family-chip--subtle" : ""}`}
    >
      {subtle && <span className="rcardv2-chip-dot" aria-hidden />}
      {word.word}
      <span>{POS_LABEL[word.pos] ?? word.pos}</span>
    </Link>
  );
}

function courseLabel(course: string) {
  if (course === "joyful-work") return "Joyful Work";
  if (course === "junior-high") return "Sanseido";
  return "Our World";
}

function sourceMeta(source: WordEntry["sources"][number]) {
  if (source.course === "junior-high") return "Dictionary · external";
  const parts: string[] = [];
  if (source.level != null) parts.push(source.course === "joyful-work" ? `Year ${source.level}` : `Level ${source.level}`);
  if (source.unit != null) parts.push(`Unit ${source.unit}`);
  parts.push(source.tag);
  return parts.join(" · ");
}

function sourceLabel(source: WordEntry["sources"][number] | undefined) {
  if (!source) return "Reference";
  return sourceMeta(source);
}

function getWordFamily(entry: WordEntry) {
  if (entry.family.length > 0) {
    return allWords.filter((word) => entry.family.includes(word.word) && word.id !== entry.id);
  }

  const root = getFamilyRoot(entry.word);
  if (!root || root.length < 4) return [];

  return allWords
    .filter((word) => word.id !== entry.id && getFamilyRoot(word.word) === root)
    .slice(0, 4);
}

function getSimilarWords(entry: WordEntry, family: WordEntry[]) {
  const familyIds = new Set(family.map((word) => word.id));
  const sourceCourses = new Set(entry.sources.map((source) => source.course));
  const tokens = new Set(tokenize(entry.definition).filter((token) => token.length > 4));

  return allWords
    .filter((word) => word.id !== entry.id && !familyIds.has(word.id))
    .filter((word) => word.sources.some((source) => sourceCourses.has(source.course)))
    .map((word) => ({
      word,
      score: tokenize(word.definition).filter((token) => tokens.has(token)).length
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.word.word.localeCompare(b.word.word))
    .slice(0, 3)
    .map((item) => item.word);
}

function getFamilyRoot(word: string) {
  return word
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .replace(/(ing|ed|er|or|ion|ible|able|s)$/u, "");
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z]+/u)
    .filter(Boolean);
}

function highlightWord(text: string, word: string, verbForms?: VerbForms | null) {
  /* normalizedWord joins multi-word phrases with "_" (e.g. "pop_top",
     "sea_sponges"); match that as either a space or a hyphen in the actual
     sentence, since either is valid English spelling. */
  const toPattern = (candidate: string) => candidate.split(/[_\s]+/).map(escapeRegex).join("[-\\s]");

  /* Verb example sentences legitimately use the past or past-participle
     form ("fell over", "spun", "took photos"), which for irregular verbs
     shares no substring with the base word — so the base-word-only pattern
     would never bold anything in those sentences. Try the base word first,
     then each verb form, and highlight whichever one actually appears. */
  const candidates = [word, verbForms?.past, verbForms?.pastParticiple].filter(
    (value): value is string => Boolean(value)
  );
  /* The \w* suffix must sit outside the alternation group, not inside it —
     `(a|b\w*)` only lets \w* extend the LAST alternative, so matching "leaned"
     against `(lean|leaned\w*)` stops at "lean" (the first, shorter alternative
     wins and the trailing "ed" is left un-bolded). `(?:a|b)\w*` lets \w*
     extend whichever alternative actually matched. */
  const pattern = candidates.map(toPattern).join("|");
  const re = new RegExp(`((?:${pattern})\\w*)`, "ig");
  const parts = text.split(re);
  return parts.map((part, i) =>
    part && new RegExp(`^(?:${pattern})\\w*$`, "i").test(part) ? (
      <strong key={i}>{part}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
