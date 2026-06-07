"use client";

import Link from "next/link";
import { useState } from "react";
import { useJapanesePreference } from "@/components/AppShell";
import type { GrammarMasterQuestion, GrammarPoint, GrammarQuizQuestion, GrammarWorkbookChart } from "@/data/types";

const tabs = [
  { id: "chart", label: "Chart & Samples" },
  { id: "level-up", label: "Level Up" },
  { id: "quiz", label: "Quiz" },
  { id: "master", label: "Master Quiz" }
] as const;

type TabId = (typeof tabs)[number]["id"];

export function GrammarCardPage({ grammar }: { grammar: GrammarPoint }) {
  const showJapanese = useJapanesePreference();
  const [activeTabId, setActiveTabId] = useState<TabId>("chart");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [masterAnswers, setMasterAnswers] = useState<Record<number, number>>({});
  const [buildAnswers, setBuildAnswers] = useState<Record<number, string[]>>({});
  const [checkedBuilds, setCheckedBuilds] = useState<Record<number, boolean>>({});

  return (
    <section className="word-page">
      <div className="card-nav">
        <Link className="ghost-button" href="/reference">
          Back to Reference
        </Link>
        <span className="position-pill">Grammar Reference</span>
      </div>

      <article className="grammar-card">
        <div className="grammar-top">
          <span className="eyebrow">
            Our World - Level {grammar.level} - Unit {grammar.unit} - {grammar.component}
          </span>
          <h1>{grammar.title}</h1>
        </div>
        <div className="grammar-body">
          <div className="source-tags">
            <span>{grammar.tag}</span>
            <span>GRAMMAR POINT</span>
            <span>{grammar.lessonStatus === "live" ? "LIVE LESSON" : "DRAFT LESSON"}</span>
          </div>

          <div className="rule-box">{grammar.rule}</div>

          <div className="pattern-row">
            {grammar.pattern.split("+").map((part) => (
              <span key={part.trim()}>{part.trim()}</span>
            ))}
          </div>

          <div className="grammar-tabs">
            <div className="grammar-tab-list" role="tablist" aria-label={`${grammar.shortName} chart tabs`}>
              {tabs.map((tab) => (
                <button
                  aria-selected={activeTabId === tab.id}
                  className={activeTabId === tab.id ? "active" : ""}
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  role="tab"
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grammar-tab-panel" role="tabpanel">
              {activeTabId === "chart" ? <ChartAndSamples grammar={grammar} showJapanese={showJapanese} /> : null}
              {activeTabId === "level-up" ? <LevelUp grammar={grammar} showJapanese={showJapanese} /> : null}
              {activeTabId === "quiz" ? (
                <Quiz
                  answers={quizAnswers}
                  questions={grammar.tab3_quiz}
                  revealJapanese={showJapanese}
                  setAnswer={(questionIndex, answerIndex) =>
                    setQuizAnswers((current) => ({ ...current, [questionIndex]: answerIndex }))
                  }
                />
              ) : null}
              {activeTabId === "master" ? (
                <MasterQuiz
                  answers={masterAnswers}
                  buildAnswers={buildAnswers}
                  checkedBuilds={checkedBuilds}
                  questions={grammar.tab4_master}
                  setAnswer={(questionIndex, answerIndex) =>
                    setMasterAnswers((current) => ({ ...current, [questionIndex]: answerIndex }))
                  }
                  setBuildAnswer={(questionIndex, tokens) =>
                    setBuildAnswers((current) => ({ ...current, [questionIndex]: tokens }))
                  }
                  setCheckedBuild={(questionIndex) =>
                    setCheckedBuilds((current) => ({ ...current, [questionIndex]: true }))
                  }
                />
              ) : null}
            </div>
          </div>

          {showJapanese && grammar.japanese ? (
            <div className="japanese-box">
              <strong>{grammar.japanese.title}</strong>
              <p>{grammar.japanese.rule}</p>
              <p>{grammar.japanese.pattern}</p>
            </div>
          ) : null}

          <div className="card-actions">
            {grammar.lessonStatus === "live" ? (
              <button className="lesson-button" type="button">
                Open {grammar.component} lesson
              </button>
            ) : (
              <button className="lesson-button" disabled type="button">
                Lesson not live yet
              </button>
            )}
            <button className="lesson-button" type="button">
              Practice this grammar
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}

function ChartAndSamples({ grammar, showJapanese }: { grammar: GrammarPoint; showJapanese: boolean }) {
  return (
    <div className="grammar-panel-stack">
      <section className="grammar-section">
        {grammar.chart.workbookChart ? (
          <WorkbookGrammarChart chart={grammar.chart.workbookChart} />
        ) : (
          <>
            <h2>{grammar.chart.title}</h2>
            <div className="grammar-intro-grid">
              {grammar.chart.intro_examples.map((example) => (
                <div className="grammar-example-card" key={example.text}>
                  <p>{example.text}</p>
                  {showJapanese && example.jp ? <small>{example.jp}</small> : null}
                </div>
              ))}
            </div>
            <div className="grammar-table-wrap">
              <table className="grammar-table">
                <thead>
                  <tr>
                    <th>Form</th>
                    <th>Pattern</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {grammar.chart.rows.map((row) => (
                    <tr key={`${row.form}-${row.example}`}>
                      <td>{row.form}</td>
                      <td>{row.pattern}</td>
                      <td>
                        {row.example}
                        {showJapanese && row.jp ? <small>{row.jp}</small> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grammar-notes">
              {grammar.chart.note_rule ? <p>{grammar.chart.note_rule}</p> : null}
              {grammar.chart.note_exception ? <p>{grammar.chart.note_exception}</p> : null}
              {grammar.chart.note_exception_detail ? <p>{grammar.chart.note_exception_detail}</p> : null}
            </div>
          </>
        )}
      </section>

      <section className="grammar-section">
        <h2>Samples</h2>
        <div className="grammar-sample-list">
          {grammar.tab1_samples.map((sample) => (
            <div className="grammar-sample" key={sample.text}>
              <p>{sample.text}</p>
              {showJapanese && sample.jp ? <small>{sample.jp}</small> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function WorkbookGrammarChart({ chart }: { chart: GrammarWorkbookChart }) {
  return (
    <div className="workbook-chart">
      <div className="workbook-chart-title-row">
        <div className="workbook-chart-label">
          <span aria-hidden="true" />
          {chart.label}
        </div>
        <strong>{chart.title}</strong>
      </div>
      <div className="workbook-chart-demo">
        <h3>See how it works</h3>
        <p>
          {chart.seeHowItWorks.beforeWho}
          <mark>{chart.seeHowItWorks.who}</mark>
          {chart.seeHowItWorks.afterWho}
          <span aria-hidden="true"> -- </span>
          {chart.seeHowItWorks.explanation}
        </p>
      </div>
      <div className="workbook-chart-table-wrap">
        <table className="workbook-chart-table">
          <thead>
            <tr>
              {chart.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row) => (
              <tr key={`${row.person}-${row.description}`}>
                <td>{row.person}</td>
                <td>{row.who}</td>
                <td>{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="workbook-chart-rule">
        <p>
          <strong>Rule</strong> -- {chart.rule}
        </p>
        {chart.but ? (
          <p>
            <strong>But</strong> -- {chart.but}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function LevelUp({ grammar, showJapanese }: { grammar: GrammarPoint; showJapanese: boolean }) {
  return (
    <div className="grammar-panel-stack">
      <section className="grammar-section">
        <h2>Level Up Rules</h2>
        <div className="levelup-grid">
          {grammar.tab2_levelup.rules.map((rule) => (
            <article className="levelup-card" key={rule.title}>
              <h3>{rule.title}</h3>
              {showJapanese && rule.jp_title ? <small>{rule.jp_title}</small> : null}
              <p>{rule.subtitle}</p>
              {showJapanese && rule.jp_subtitle ? <small>{rule.jp_subtitle}</small> : null}
              <div className="transform-list">
                {rule.transforms.map((transform) => (
                  <div className="transform-row" key={`${transform.from}-${transform.to}`}>
                    <span>{transform.from}</span>
                    <strong>{transform.to}</strong>
                  </div>
                ))}
              </div>
              <div className="grammar-sample-list compact">
                {rule.examples.map((example) => (
                  <div className="grammar-sample" key={example.text}>
                    <p>{example.text}</p>
                    {showJapanese && example.jp ? <small>{example.jp}</small> : null}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grammar-section">
        <h2>Mixed Samples</h2>
        <div className="grammar-sample-list">
          {grammar.tab2_levelup.mixed_samples.map((sample) => (
            <div className="grammar-sample" key={sample.text}>
              <span className="kind-pill">{sample.kind}</span>
              <p>{sample.text}</p>
              {showJapanese && sample.jp ? <small>{sample.jp}</small> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Quiz({
  answers,
  questions,
  revealJapanese,
  setAnswer
}: {
  answers: Record<number, number>;
  questions: GrammarQuizQuestion[];
  revealJapanese: boolean;
  setAnswer: (questionIndex: number, answerIndex: number) => void;
}) {
  return (
    <div className="grammar-panel-stack">
      <section className="grammar-section">
        <h2>Quiz</h2>
        <div className="quiz-list">
          {questions.map((question, questionIndex) => (
            <QuizQuestion
              answer={answers[questionIndex]}
              key={question.stem.join("|")}
              question={question}
              revealJapanese={revealJapanese}
              setAnswer={(answerIndex) => setAnswer(questionIndex, answerIndex)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function MasterQuiz({
  answers,
  buildAnswers,
  checkedBuilds,
  questions,
  setAnswer,
  setBuildAnswer,
  setCheckedBuild
}: {
  answers: Record<number, number>;
  buildAnswers: Record<number, string[]>;
  checkedBuilds: Record<number, boolean>;
  questions: GrammarMasterQuestion[];
  setAnswer: (questionIndex: number, answerIndex: number) => void;
  setBuildAnswer: (questionIndex: number, tokens: string[]) => void;
  setCheckedBuild: (questionIndex: number) => void;
}) {
  return (
    <div className="grammar-panel-stack">
      <section className="grammar-section">
        <h2>Master Quiz</h2>
        <div className="quiz-list">
          {questions.map((question, questionIndex) =>
            question.type === "mcq" ? (
              <QuizQuestion
                answer={answers[questionIndex]}
                key={question.stem.join("|")}
                question={question}
                revealJapanese={answers[questionIndex] !== undefined}
                setAnswer={(answerIndex) => setAnswer(questionIndex, answerIndex)}
              />
            ) : (
              <BuildQuestion
                checked={checkedBuilds[questionIndex] ?? false}
                key={question.correct.join("|")}
                question={question}
                selectedTokens={buildAnswers[questionIndex] ?? []}
                setChecked={() => setCheckedBuild(questionIndex)}
                setTokens={(tokens) => setBuildAnswer(questionIndex, tokens)}
              />
            )
          )}
        </div>
      </section>
    </div>
  );
}

function QuizQuestion({
  answer,
  question,
  revealJapanese,
  setAnswer
}: {
  answer?: number;
  question: GrammarQuizQuestion;
  revealJapanese: boolean;
  setAnswer: (answerIndex: number) => void;
}) {
  const answered = answer !== undefined;

  return (
    <article className="quiz-card">
      <p className="quiz-stem">{renderStem(question, answer)}</p>
      <div className="answer-grid">
        {question.answers.map((choice, answerIndex) => {
          const isSelected = answer === answerIndex;
          const isCorrect = answered && question.correct === answerIndex;
          const isWrong = answered && isSelected && !isCorrect;
          return (
            <button
              className={[isSelected ? "selected" : "", isCorrect ? "correct" : "", isWrong ? "wrong" : ""]
                .filter(Boolean)
                .join(" ")}
              key={choice}
              onClick={() => setAnswer(answerIndex)}
              type="button"
            >
              {choice}
            </button>
          );
        })}
      </div>
      {answered ? (
        <div className="quiz-explanation">
          <strong>{question.explanation.title}</strong>
          <p>{question.explanation.body}</p>
          {revealJapanese ? <small>{question.jp}</small> : null}
        </div>
      ) : null}
    </article>
  );
}

function BuildQuestion({
  checked,
  question,
  selectedTokens,
  setChecked,
  setTokens
}: {
  checked: boolean;
  question: Extract<GrammarMasterQuestion, { type: "build" }>;
  selectedTokens: string[];
  setChecked: () => void;
  setTokens: (tokens: string[]) => void;
}) {
  const isCorrect = selectedTokens.join(" ") === question.correct.join(" ");

  return (
    <article className="quiz-card">
      <p className="quiz-cue">{question.cue}</p>
      <div className="build-answer" aria-label="Built sentence">
        {selectedTokens.length ? (
          selectedTokens.map((token, index) => (
            <button
              className="tile selected"
              key={`${token}-${index}`}
              onClick={() => setTokens(selectedTokens.filter((_, tokenIndex) => tokenIndex !== index))}
              type="button"
            >
              {token}
            </button>
          ))
        ) : (
          <span>Build the sentence here</span>
        )}
      </div>
      <div className="tile-bank">
        {question.bank.map((token, index) => (
          <button
            className="tile"
            key={`${token}-${index}`}
            onClick={() => setTokens([...selectedTokens, token])}
            type="button"
          >
            {token}
          </button>
        ))}
      </div>
      <div className="card-actions">
        <button className="lesson-button" onClick={setChecked} type="button">
          Check
        </button>
        <button className="lesson-button" onClick={() => setTokens([])} type="button">
          Reset
        </button>
      </div>
      {checked ? (
        <div className={`quiz-explanation ${isCorrect ? "correct" : "wrong"}`}>
          <strong>{isCorrect ? "Correct" : "Try this order"}</strong>
          <p>{question.correct.join(" ")}</p>
          <small>{question.jp}</small>
        </div>
      ) : null}
    </article>
  );
}

function renderStem(question: GrammarQuizQuestion, answer?: number) {
  return question.stem.map((part, index) => (
    <span key={`${part}-${index}`}>
      {part}
      {index === 0 ? <mark>{answer !== undefined ? question.answers[answer] : "____"}</mark> : null}
    </span>
  ));
}
