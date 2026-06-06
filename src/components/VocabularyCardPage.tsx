"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { useJapanesePreference } from "@/components/AppShell";
import {
  getNextVocabularyId,
  getPreviousVocabularyId,
  getVocabularyById,
  getVocabularyIndex,
  referenceWordOrder
} from "@/data/reference";

export function VocabularyCardPage({ initialWordId }: { initialWordId: string }) {
  const [knownOverride, setKnownOverride] = useState<Record<string, boolean>>({});
  const word = getVocabularyById(initialWordId);
  const showJapanese = useJapanesePreference();

  const displayKnown = useMemo(() => {
    if (!word) return false;
    return knownOverride[word.id] ?? Boolean(word.knows);
  }, [knownOverride, word]);

  if (!word) return null;

  const previousId = getPreviousVocabularyId(word.id);
  const nextId = getNextVocabularyId(word.id);
  const position = getVocabularyIndex(word.id) + 1;
  const liveSource = word.sources.find((source) => source.lessonStatus === "live" && source.lessonId);

  return (
    <section className="word-page">
      <div className="card-nav">
        <Link className="ghost-button" href="/reference">
          Back to Reference
        </Link>
        <span className="position-pill">
          {position} / {referenceWordOrder.length}
        </span>
        <div className="nav-pair">
          <Link className="ghost-button" href={`/reference/vocabulary/${previousId}`}>
            <ChevronLeft size={18} />
            Previous
          </Link>
          <Link className="ghost-button" href={`/reference/vocabulary/${nextId}`}>
            Next
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      <article className="word-card">
        <div className="visual-panel">
          <span>{word.emoji}</span>
        </div>
        <div className="word-content">
          <div className="source-tags">
            {word.sources.map((source) => (
              <span key={source.tag}>{source.tag}</span>
            ))}
          </div>

          <div className="word-title-row">
            <h1>{word.word}</h1>
            <button className="sound-button" aria-label="Play pronunciation" type="button">
              <Volume2 size={26} />
            </button>
          </div>

          <div className="word-meta">
            {word.ipa ? <span>IPA {word.ipa}</span> : null}
            {word.syllables ? <span>Syllables {word.syllables}</span> : null}
            {word.partOfSpeech ? <span>{word.partOfSpeech}</span> : null}
            {word.countability ? <span>{word.countability}</span> : null}
          </div>

          <p className="meaning">{word.meaning}</p>
          <div className="sample">{highlightWord(word.example, word.word)}</div>

          {showJapanese && word.japanese ? (
            <div className="japanese-box">
              <strong>{word.japanese.word}</strong>
              {word.japanese.reading ? <span>{word.japanese.reading}</span> : null}
              <p>{word.japanese.meaning}</p>
            </div>
          ) : null}

          <div className="card-actions">
            <button
              className={displayKnown ? "know-button known" : "know-button"}
              onClick={() => setKnownOverride((current) => ({ ...current, [word.id]: !displayKnown }))}
              type="button"
            >
              {displayKnown ? "I Know" : "Mark I Know"}
            </button>
            {liveSource ? (
              <button className="lesson-button" type="button">
                Open related lesson
              </button>
            ) : (
              <button className="lesson-button" disabled type="button">
                Lesson not live yet
              </button>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}

function highlightWord(sentence: string, word: string) {
  const index = sentence.toLowerCase().indexOf(word.toLowerCase());
  if (index === -1) return sentence;

  return (
    <>
      {sentence.slice(0, index)}
      <mark>{sentence.slice(index, index + word.length)}</mark>
      {sentence.slice(index + word.length)}
    </>
  );
}

