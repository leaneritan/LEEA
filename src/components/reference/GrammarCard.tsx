"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useJapanesePreference } from "@/components/AppShell";
import type {
  GrammarEntry,
  GrammarMasterDisplay,
  GrammarQuizDisplay,
  GrammarSampleDisplay
} from "@/data/reference-shapes";
import { getGrammarNav } from "./ref-data";

type TabKey = "chart" | "levelup" | "quiz" | "master";
type QuizAnswer = { kind: "mcq"; pick: number } | { kind: "build"; order: string[]; checked: boolean };
type QuestionWithKind = (GrammarQuizDisplay & { kind: "mcq" }) | GrammarMasterDisplay;

export function GrammarCard({ entry }: { entry: GrammarEntry }) {
  const jp = useJapanesePreference();
  const [tab, setTab] = useState<TabKey>("chart");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, QuizAnswer>>({});
  const nav = useMemo(() => getGrammarNav(entry.grammarId), [entry.grammarId]);

  const tabs: Array<{ key: TabKey; label: string; badge?: number }> = [
    { key: "chart", label: "Chart & Samples" },
    { key: "levelup", label: "Level Up" },
    { key: "quiz", label: "Quiz", badge: entry.quiz.length || undefined },
    { key: "master", label: "Master Quiz", badge: entry.masterQuiz.length || undefined }
  ];

  function answerMcq(quizKey: string, qi: number, pick: number) {
    setQuizAnswers((prev) => ({ ...prev, [`${quizKey}:${qi}`]: { kind: "mcq", pick } }));
  }

  function tapWord(quizKey: string, qi: number, token: string) {
    setQuizAnswers((prev) => {
      const existing = prev[`${quizKey}:${qi}`];
      const current =
        existing && existing.kind === "build"
          ? existing
          : { kind: "build" as const, order: [] as string[], checked: false };
      if (current.checked) return prev;
      return { ...prev, [`${quizKey}:${qi}`]: { ...current, order: [...current.order, token] } };
    });
  }

  function untapWord(quizKey: string, qi: number, position: number) {
    setQuizAnswers((prev) => {
      const existing = prev[`${quizKey}:${qi}`];
      if (!existing || existing.kind !== "build" || existing.checked) return prev;
      return {
        ...prev,
        [`${quizKey}:${qi}`]: { ...existing, order: existing.order.filter((_, i) => i !== position) }
      };
    });
  }

  function checkBuild(quizKey: string, qi: number) {
    setQuizAnswers((prev) => {
      const existing = prev[`${quizKey}:${qi}`];
      if (!existing || existing.kind !== "build") return prev;
      return { ...prev, [`${quizKey}:${qi}`]: { ...existing, checked: true } };
    });
  }

  function resetQuiz(quizKey: string) {
    setQuizAnswers((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (key.startsWith(`${quizKey}:`)) delete next[key];
      }
      return next;
    });
  }

  return (
    <div className="rcardv2-shell rcardv2-shell--wide">
      <Link href="/reference" className="rcardv2-back">
        ← Back to Grammar
      </Link>

      <section className="gcardv2-header">
        <div className="gcardv2-header-text">
          <div className="gcardv2-header-tags">
            <span className="gcardv2-cat-pill">Sentence structure</span>
            <span className="gcardv2-code-pill">{entry.tag}</span>
          </div>
          <h1 className="gcardv2-title">{entry.title}</h1>
          {entry.subtitle && <p className="gcardv2-subtitle">{entry.subtitle}</p>}
          {jp && entry.jpRule && (
            <p className="gcardv2-rule-jp" lang="ja">
              {entry.jpRule}
            </p>
          )}
        </div>

        {entry.relatedLessonId && entry.lessonStatus === "live" ? (
          <Link className="rcardv2-related-live" href={`/lessons/${entry.relatedLessonId}`}>
            Open lesson →
          </Link>
        ) : (
          <button type="button" className="rcardv2-locked" disabled title="Lesson not published yet">
            <span className="rcardv2-locked-icon" aria-hidden>
              🔒
            </span>
            <span className="rcardv2-locked-text">
              Open lesson<span>Available when live</span>
            </span>
          </button>
        )}
      </section>

      <nav className="rcardv2-prevnext" aria-label="Grammar navigation">
        {nav.prev ? (
          <Link href={`/reference/grammar/${nav.prev.grammarId}`} className="rcardv2-prevnext-btn">
            <span className="rcardv2-prevnext-arrow">←</span>
            {nav.prev.title}
          </Link>
        ) : (
          <button type="button" className="rcardv2-prevnext-btn is-disabled" disabled>
            <span className="rcardv2-prevnext-arrow">←</span> Start
          </button>
        )}

        <div className="rcardv2-prevnext-pos">
          <div className="rcardv2-prevnext-count">
            Grammar {nav.index} of {nav.total} · Unit {entry.unit}
          </div>
          <div className="rcardv2-prevnext-dots" aria-hidden>
            {Array.from({ length: nav.total }, (_, i) => (
              <span key={i} className={`rcardv2-prevnext-dot${i + 1 === nav.index ? " is-active" : ""}`} />
            ))}
          </div>
        </div>

        {nav.next ? (
          <Link href={`/reference/grammar/${nav.next.grammarId}`} className="rcardv2-prevnext-btn">
            {nav.next.title}
            <span className="rcardv2-prevnext-arrow">→</span>
          </Link>
        ) : (
          <button type="button" className="rcardv2-prevnext-btn is-disabled" disabled>
            Next <span className="rcardv2-prevnext-arrow">→</span>
          </button>
        )}
      </nav>

      <PatternChart entry={entry} jp={jp} />

      <div className="gcardv2-tabs" role="tablist" aria-label="Grammar card tabs">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            className={`gcardv2-tab${tab === item.key ? " is-active" : ""}`}
            onClick={() => setTab(item.key)}
          >
            <span>{item.label}</span>
            {item.badge != null && <span className="gcardv2-tab-badge">{item.badge}</span>}
          </button>
        ))}
      </div>

      {tab === "chart" && (
        <>
          <RuleList
            eyebrow="How it works"
            rules={entry.chartAndSamples.rule ? [{ heading: "Rule", body: entry.chartAndSamples.rule }] : []}
            jp={jp}
          />
          <SamplesList
            eyebrow={`${entry.chartAndSamples.samples.length} sample sentences`}
            samples={entry.chartAndSamples.samples}
            entry={entry}
            sourcePrefix="S"
            jp={jp}
          />
        </>
      )}

      {tab === "levelup" && (
        <>
          <RuleList eyebrow="Deeper rules" rules={entry.levelUp.rules} jp={jp} />
          <SamplesList
            eyebrow={`${entry.levelUp.samples.length} sample sentences`}
            samples={entry.levelUp.samples}
            entry={entry}
            sourcePrefix="L"
            jp={jp}
          />
        </>
      )}

      {tab === "quiz" && (
        <QuizPane
          quizKey="quiz"
          title="Practice Quiz"
          subtitle={`${entry.quiz.length} questions with instant feedback.`}
          questions={entry.quiz.map((question) => ({ kind: "mcq" as const, ...question }))}
          jp={jp}
          showJpAfterAnswer={false}
          quizAnswers={quizAnswers}
          onAnswerMcq={answerMcq}
          onTapWord={tapWord}
          onUntapWord={untapWord}
          onCheckBuild={checkBuild}
          onReset={() => resetQuiz("quiz")}
        />
      )}

      {tab === "master" && (
        <QuizPane
          quizKey="master"
          title="Master Quiz"
          subtitle={`${entry.masterQuiz.length} mixed challenges, including sentence building.`}
          questions={entry.masterQuiz}
          jp={jp}
          showJpAfterAnswer
          quizAnswers={quizAnswers}
          onAnswerMcq={answerMcq}
          onTapWord={tapWord}
          onUntapWord={untapWord}
          onCheckBuild={checkBuild}
          onReset={() => resetQuiz("master")}
        />
      )}
    </div>
  );
}

function PatternChart({ entry, jp }: { entry: GrammarEntry; jp: boolean }) {
  return (
    <section className="gcardv2-chart">
      <div className="gcardv2-chart-head">
        <div className="rcardv2-eyebrow">Pattern chart</div>
        <div className="gcardv2-legend">
          {entry.chart.legend.slice(0, 4).map((item) => (
            <span key={item.key} className="gcardv2-legend-item">
              <span className="gcardv2-legend-swatch" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="gcardv2-patterns">
        {entry.chart.patterns.length > 0 ? (
          entry.chart.patterns.map((pattern, pi) => (
            <div key={pi} className="gcardv2-pattern-block">
              <div className="gcardv2-pattern-label">{pattern.title}</div>
              <div className="gcardv2-pattern-row">
                {pattern.chips.map((chip, ci) => (
                  <span key={`${chip.text}-${ci}`} className={`gcardv2-chip gcardv2-chip--${chip.key}`}>
                    {chip.text}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          entry.chartAndSamples.samples.slice(0, 2).map((sample, si) => (
            <div key={si} className="gcardv2-pattern-block">
              <div className="gcardv2-pattern-fallback">{sample.en}</div>
              {jp && sample.jp && (
                <div className="gcardv2-pattern-fallback-jp" lang="ja">
                  {sample.jp}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {entry.chart.patterns.length > 0 && (
        <div className="gcardv2-chart-notes">
          <div>Use both word orders to say the same idea.</div>
          <div>Check whether the person or the thing comes first.</div>
        </div>
      )}
    </section>
  );
}

function RuleList({
  eyebrow,
  rules,
  jp
}: {
  eyebrow: string;
  rules: Array<{ heading: string; body: string; jpHeading?: string; jpBody?: string }>;
  jp: boolean;
}) {
  if (rules.length === 0) return null;

  return (
    <section className="rcardv2-section">
      <div className="rcardv2-eyebrow">{eyebrow}</div>
      <div className="gcardv2-rules">
        {rules.map((rule, idx) => (
          <div key={idx} className="gcardv2-rule">
            <div className="gcardv2-rule-label">{rule.heading}</div>
            <div className="gcardv2-rule-body">
              {rule.body}
              {jp && rule.jpBody && (
                <p className="gcardv2-rule-jp" lang="ja">
                  {rule.jpBody}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SamplesList({
  eyebrow,
  samples,
  entry,
  sourcePrefix,
  jp
}: {
  eyebrow: string;
  samples: GrammarSampleDisplay[];
  entry: GrammarEntry;
  sourcePrefix: "S" | "L";
  jp: boolean;
}) {
  if (samples.length === 0) return null;

  return (
    <section className="rcardv2-section">
      <div className="rcardv2-quiz-head">
        <div className="rcardv2-eyebrow">{eyebrow}</div>
        <span className="rcardv2-quiz-score">Source-backed</span>
      </div>
      <div className="gcardv2-samples">
        {samples.map((sample, idx) => (
          <div key={idx} className="gcardv2-sample">
            <span className="gcardv2-sample-num">{idx + 1}</span>
            <div className="gcardv2-sample-text">
              <div>{sample.en}</div>
              {jp && sample.jp && (
                <p className="gcardv2-sample-jp" lang="ja">
                  {sample.jp}
                </p>
              )}
            </div>
            <span className="gcardv2-sample-code">
              {sample.sourceTag ?? `${entry.tag.replace(/G\d+$/u, "")}${sourcePrefix}${idx + 1}`}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuizPane({
  quizKey,
  title,
  subtitle,
  questions,
  jp,
  showJpAfterAnswer,
  quizAnswers,
  onAnswerMcq,
  onTapWord,
  onUntapWord,
  onCheckBuild,
  onReset
}: {
  quizKey: string;
  title: string;
  subtitle: string;
  questions: QuestionWithKind[];
  jp: boolean;
  showJpAfterAnswer: boolean;
  quizAnswers: Record<string, QuizAnswer>;
  onAnswerMcq: (quizKey: string, qi: number, pick: number) => void;
  onTapWord: (quizKey: string, qi: number, token: string) => void;
  onUntapWord: (quizKey: string, qi: number, position: number) => void;
  onCheckBuild: (quizKey: string, qi: number) => void;
  onReset: () => void;
}) {
  const { score, answered } = useMemo(() => {
    let scoreCount = 0;
    let answeredCount = 0;

    questions.forEach((question, qi) => {
      const answer = quizAnswers[`${quizKey}:${qi}`];
      if (!answer) return;

      if (answer.kind === "mcq" && question.kind === "mcq") {
        answeredCount++;
        if (answer.pick === question.correctIndex) scoreCount++;
      }

      if (answer.kind === "build" && answer.checked && question.kind === "sentence-build") {
        answeredCount++;
        const correct =
          answer.order.length === question.correctOrder.length &&
          answer.order.every((token, idx) => token === question.correctOrder[idx]);
        if (correct) scoreCount++;
      }
    });

    return { score: scoreCount, answered: answeredCount };
  }, [questions, quizAnswers, quizKey]);

  if (questions.length === 0) {
    return (
      <section className="rcardv2-section">
        <p className="rcardv2-empty">No questions yet for {title.toLowerCase()}.</p>
      </section>
    );
  }

  return (
    <>
      <section className={`gcardv2-quiz-banner gcardv2-quiz-banner--${quizKey}`}>
        <div>
          <div className="gcardv2-quiz-title">{title}</div>
          <div className="gcardv2-quiz-sub">{subtitle}</div>
        </div>
        <div className="gcardv2-quiz-score-wrap">
          <div className="gcardv2-quiz-score-text">
            {score} / {questions.length}
          </div>
          <div className="gcardv2-quiz-answered-text">{answered} answered</div>
          <button type="button" className="gcardv2-quiz-reset" onClick={onReset}>
            Reset
          </button>
        </div>
      </section>

      {showJpAfterAnswer && (
        <div className="gcardv2-jp-note">
          <span lang="ja">あ</span>
          Japanese appears automatically after each answer in Master Quiz.
        </div>
      )}

      <div className="gcardv2-quiz-list">
        {questions.map((question, qi) => {
          const answer = quizAnswers[`${quizKey}:${qi}`];
          return (
            <article key={qi} className="gcardv2-quiz-card">
              <div className="gcardv2-quiz-q-head">
                <span className="gcardv2-quiz-q-num">{qi + 1}</span>
                <div className="gcardv2-quiz-q-prompt">{question.prompt}</div>
              </div>

              {question.kind === "mcq" ? (
                <McqQuestion
                  question={question}
                  answer={answer}
                  quizKey={quizKey}
                  qi={qi}
                  onAnswerMcq={onAnswerMcq}
                />
              ) : (
                <SentenceBuild
                  quizKey={quizKey}
                  qi={qi}
                  tokens={question.tokens}
                  answer={answer}
                  onTap={onTapWord}
                  onUntap={onUntapWord}
                  onCheck={onCheckBuild}
                />
              )}

              <QuizFeedback question={question} answer={answer} jp={jp || showJpAfterAnswer} />
            </article>
          );
        })}
      </div>
    </>
  );
}

function McqQuestion({
  question,
  answer,
  quizKey,
  qi,
  onAnswerMcq
}: {
  question: GrammarQuizDisplay & { kind: "mcq" };
  answer: QuizAnswer | undefined;
  quizKey: string;
  qi: number;
  onAnswerMcq: (quizKey: string, qi: number, pick: number) => void;
}) {
  const answered = answer?.kind === "mcq";

  return (
    <div className="gcardv2-quiz-mcq">
      {question.options.map((option, oi) => {
        const isCorrect = oi === question.correctIndex;
        const isPicked = answered && answer.pick === oi;
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
            onClick={() => onAnswerMcq(quizKey, qi, oi)}
          >
            <span>{option}</span>
            {answered && isCorrect && <span className="rcardv2-mark">✓</span>}
            {answered && isPicked && !isCorrect && <span className="rcardv2-mark">×</span>}
          </button>
        );
      })}
    </div>
  );
}

function SentenceBuild({
  quizKey,
  qi,
  tokens,
  answer,
  onTap,
  onUntap,
  onCheck
}: {
  quizKey: string;
  qi: number;
  tokens: string[];
  answer: QuizAnswer | undefined;
  onTap: (quizKey: string, qi: number, token: string) => void;
  onUntap: (quizKey: string, qi: number, position: number) => void;
  onCheck: (quizKey: string, qi: number) => void;
}) {
  const built = answer && answer.kind === "build" ? answer.order : [];
  const checked = answer && answer.kind === "build" ? answer.checked : false;
  const usedCounts = new Map<string, number>();
  for (const token of built) usedCounts.set(token, (usedCounts.get(token) ?? 0) + 1);

  return (
    <div className="gcardv2-build">
      <div className="gcardv2-build-target">
        {built.length === 0 && <span className="gcardv2-build-empty">Tap the words below in order...</span>}
        {built.map((token, position) => (
          <button
            key={`${token}-${position}`}
            type="button"
            className="gcardv2-build-chip is-placed"
            disabled={checked}
            onClick={() => onUntap(quizKey, qi, position)}
          >
            {token}
          </button>
        ))}
      </div>

      <div className="gcardv2-build-bank">
        {tokens.map((token, ti) => {
          const totalForToken = tokens.filter((bankToken) => bankToken === token).length;
          const used = usedCounts.get(token) ?? 0;
          if (totalForToken - used <= 0) return null;

          return (
            <button
              key={`${token}-${ti}`}
              type="button"
              className="gcardv2-build-chip"
              disabled={checked}
              onClick={() => onTap(quizKey, qi, token)}
            >
              {token}
            </button>
          );
        })}
      </div>

      {!checked && built.length > 0 && (
        <button type="button" className="gcardv2-build-check" onClick={() => onCheck(quizKey, qi)}>
          Check sentence
        </button>
      )}
    </div>
  );
}

function QuizFeedback({
  question,
  answer,
  jp
}: {
  question: QuestionWithKind;
  answer: QuizAnswer | undefined;
  jp: boolean;
}) {
  if (!answer) return null;

  let correct = false;
  let explanationEN = "";
  let explanationJP = "";
  let answerLine = "";

  if (question.kind === "mcq" && answer.kind === "mcq") {
    correct = answer.pick === question.correctIndex;
    explanationEN = question.explanationEN;
    explanationJP = question.explanationJP;
    if (!correct) answerLine = `Correct answer: ${question.options[question.correctIndex]}`;
  } else if (question.kind === "sentence-build" && answer.kind === "build") {
    if (!answer.checked) return null;
    correct =
      answer.order.length === question.correctOrder.length &&
      answer.order.every((token, idx) => token === question.correctOrder[idx]);
    explanationEN = question.explanationEN;
    explanationJP = question.explanationJP;
    if (!correct) answerLine = `Correct order: ${question.correctOrder.join(" ")}`;
  } else {
    return null;
  }

  return (
    <div className={`rcardv2-quiz-fb${correct ? " is-correct" : " is-wrong"}`}>
      <div className="rcardv2-quiz-fb-title">{correct ? "✓ Nice — that's right." : "× Not quite."}</div>
      {answerLine && <div className="rcardv2-quiz-fb-answer">{answerLine}</div>}
      {explanationEN && <p>{explanationEN}</p>}
      {jp && explanationJP && (
        <p className="rcardv2-quiz-fb-jp" lang="ja">
          {explanationJP}
        </p>
      )}
    </div>
  );
}
