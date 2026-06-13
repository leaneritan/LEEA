"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { useJapanesePreference } from "@/components/AppShell";
import { useKnownWordIds } from "@/components/useKnownWordIds";
import {
  getNextVocabularyId,
  getPreviousVocabularyId,
  getVocabularyById,
  getVocabularyIndex,
  referenceWordOrder
} from "@/data/reference";
import type { VocabularyItem } from "@/data/types";

export function VocabularyCardPage({ initialWordId }: { initialWordId: string }) {
  const { knownWordSet, setWordKnown } = useKnownWordIds();
  const word = getVocabularyById(initialWordId);
  const showJapanese = useJapanesePreference();

  const displayKnown = useMemo(() => {
    if (!word) return false;
    return knownWordSet.has(word.id) || Boolean(word.knows);
  }, [knownWordSet, word]);

  if (!word) return null;

  const previousId = getPreviousVocabularyId(word.id);
  const nextId = getNextVocabularyId(word.id);
  const position = getVocabularyIndex(word.id) + 1;
  const liveSource = word.sources.find((source) => source.lessonStatus === "live" && source.lessonId);
  const cardNav = (
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
  );

  if (word.type === "academic") {
    return (
      <section className="word-page">
        {cardNav}
        <AcademicCard
          displayKnown={displayKnown}
          liveSource={Boolean(liveSource)}
          onToggleKnown={() => setWordKnown(word.id, !displayKnown)}
          showJapanese={showJapanese}
          word={word}
        />
      </section>
    );
  }

  return (
    <section className="word-page">
      {cardNav}

      <article className="word-card">
        <div className="visual-panel">
          <span>{word.emoji}</span>
        </div>
        <div className="word-content">
          <div className="word-title-row">
            <h1>{word.word}</h1>
            <SourceTags word={word} />
            <button className="sound-button" aria-label="Play pronunciation" type="button">
              <Volume2 size={26} />
            </button>
          </div>

          <div className="word-meta">
            {word.ipa ? <MetaChip label="IPA" value={word.ipa} /> : null}
            {word.syllables ? <MetaChip label="Syllables" value={word.syllables} /> : null}
            {word.partOfSpeech ? <MetaChip kind={word.partOfSpeech} value={word.partOfSpeech} /> : null}
            {word.countability ? <MetaChip value={word.countability} /> : null}
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
              onClick={() => setWordKnown(word.id, !displayKnown)}
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

function AcademicCard({
  displayKnown,
  liveSource,
  onToggleKnown,
  showJapanese,
  word
}: {
  displayKnown: boolean;
  liveSource: boolean;
  onToggleKnown: () => void;
  showJapanese: boolean;
  word: VocabularyItem;
}) {
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const hasJapaneseMeaning = Boolean(word.jp_word || word.japanese?.word || word.jp_reading || word.japanese?.reading || word.jp_meaning || word.japanese?.meaning);
  const hasJapaneseHowToUse = Boolean(word.jp_how_to_use?.structure || word.jp_how_to_use?.patterns?.length);
  const hasJapanesePractice = Boolean(word.jp_practice_prompt || word.jp_note);

  return (
    <article className="word-card academic-card">
      <div className="visual-panel academic-visual">
        <span>{word.emoji}</span>
      </div>
      <div className="word-content academic-content">
        <div className="word-title-row">
          <h1>{word.word}</h1>
          <SourceTags word={word} />
          <button className="sound-button" aria-label="Play pronunciation" type="button">
            <Volume2 size={26} />
          </button>
        </div>

        <div className="word-meta">
          {word.ipa ? <MetaChip label="IPA" value={word.ipa} /> : null}
          {word.syllables ? <MetaChip label="Syllables" value={word.syllables} /> : null}
          {word.pos || word.partOfSpeech ? <MetaChip kind={word.pos ?? word.partOfSpeech} value={word.pos ?? word.partOfSpeech ?? ""} /> : null}
          {word.category ? <MetaChip value={word.category} /> : null}
        </div>

        <section className="academic-section">
          <h2>Meaning</h2>
          <p className="meaning">{word.meaning}</p>
          <div className="sample">{word.sample ?? word.example}</div>
          {showJapanese && hasJapaneseMeaning ? (
            <div className="japanese-box">
              <strong>{word.jp_word ?? word.japanese?.word}</strong>
              {word.jp_reading ?? word.japanese?.reading ? <span>{word.jp_reading ?? word.japanese?.reading}</span> : null}
              <p>{word.jp_meaning ?? word.japanese?.meaning}</p>
            </div>
          ) : null}
        </section>

        {word.when_to_use?.length ? (
          <section className="academic-section">
            <h2>When To Use</h2>
            <div className="academic-grid">
              {word.when_to_use.map((item) => (
                <div className="academic-mini" key={item.context}>
                  <strong>{item.context}</strong>
                  <p>{item.text}</p>
                  {showJapanese && word.jp_when_to_use?.find((jp) => jp.context === item.context)?.text ? (
                    <span>{word.jp_when_to_use.find((jp) => jp.context === item.context)?.text}</span>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {word.how_to_use ? (
          <section className="academic-section">
            <h2>How To Use</h2>
            <div className="sample">{word.how_to_use.structure}</div>
            <div className="source-tags academic-tags">
              {word.how_to_use.patterns.map((pattern) => (
                <span key={pattern}>{pattern}</span>
              ))}
            </div>
            {showJapanese && hasJapaneseHowToUse ? (
              <div className="japanese-box">
                {word.jp_how_to_use?.structure ? <p>{word.jp_how_to_use.structure}</p> : null}
              </div>
            ) : null}
          </section>
        ) : null}

        {word.examples?.length ? (
          <section className="academic-section">
            <h2>Examples</h2>
            <div className="academic-list">
              {word.examples.map((item) => (
                <div className="academic-row" key={`${item.context}-${item.en}`}>
                  <span>{item.context}</span>
                  <p>{item.en}</p>
                  {showJapanese && item.jp ? <small>{item.jp}</small> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {word.collocations?.length ? (
          <section className="academic-section">
            <h2>Collocations</h2>
            <div className="source-tags academic-tags">
              {word.collocations.map((collocation) => (
                <span key={collocation}>{collocation}</span>
              ))}
            </div>
          </section>
        ) : null}

        {word.nonExamples?.length ? (
          <section className="academic-section">
            <h2>Non-Examples</h2>
            <div className="academic-list">
              {word.nonExamples.map((item) => (
                <div className="academic-row" key={item.en}>
                  <span>Non-example</span>
                  <p>{item.en}</p>
                  {showJapanese && item.jp ? <small>{item.jp}</small> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="academic-section">
          <h2>Practice</h2>
          <div className="sample">{word.practice_prompt}</div>
          {showJapanese && hasJapanesePractice ? (
            <div className="japanese-box">
              {word.jp_practice_prompt ? <p>{word.jp_practice_prompt}</p> : null}
              {word.jp_note ? <p>{word.jp_note}</p> : null}
            </div>
          ) : null}
          {word.miniQuiz?.map((quiz, quizIndex) => {
            const selected = quizAnswers[quizIndex];
            const hasAnswered = selected !== undefined;

            return (
            <div className="academic-quiz" key={quiz.prompt}>
              <strong>{quiz.prompt}</strong>
              <div className="quiz-options">
                {quiz.options.map((option, index) => (
                  <button
                    className={
                      hasAnswered && index === selected
                        ? index === quiz.correct
                          ? "quiz-option correct-answer"
                          : "quiz-option wrong-answer"
                        : "quiz-option"
                    }
                    key={option}
                    onClick={() => setQuizAnswers((current) => ({ ...current, [quizIndex]: index }))}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
              {hasAnswered ? (
                <>
                  <p>{quiz.explanation}</p>
                  {showJapanese ? <small>{quiz.jp}</small> : null}
                </>
              ) : null}
            </div>
            );
          })}
        </section>

        <div className="card-actions">
          <button className={displayKnown ? "know-button known" : "know-button"} onClick={onToggleKnown} type="button">
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
  );
}

function SourceTags({ word }: { word: VocabularyItem }) {
  return (
    <div className="source-tags title-tags" aria-label="Source tags">
      {word.type === "academic" ? <span className="source-tag-academic">ACADEMIC</span> : null}
      {word.sources.map((source) => (
        <span key={source.tag}>{source.tag}</span>
      ))}
    </div>
  );
}

function MetaChip({ kind, label, value }: { kind?: string; label?: string; value: string }) {
  const chipKind = kind?.toLowerCase().replace(/[^a-z]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <span className={chipKind ? `meta-chip meta-${chipKind}` : "meta-chip"}>
      {label ? <strong>{label}</strong> : null}
      {value}
    </span>
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

