"use client";

import Link from "next/link";
import { useState } from "react";
import type { GrammarPoint } from "@/data/types";

export function GrammarCardPage({ grammar }: { grammar: GrammarPoint }) {
  const [showJapanese, setShowJapanese] = useState(false);

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
            Our World · Level {grammar.level} · Unit {grammar.unit} · {grammar.component}
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

          <div className="example-list">
            {grammar.examples.map((example) => (
              <div key={example.sentence}>{highlight(example.sentence, example.highlight)}</div>
            ))}
          </div>

          {grammar.japanese ? (
            <>
              <button className="jp-content-button" onClick={() => setShowJapanese((current) => !current)} type="button">
                {showJapanese ? "Hide Japanese" : "Show Japanese"}
              </button>
              {showJapanese ? (
                <div className="japanese-box">
                  <strong>{grammar.japanese.title}</strong>
                  <p>{grammar.japanese.rule}</p>
                  <p>{grammar.japanese.pattern}</p>
                </div>
              ) : null}
            </>
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

function highlight(sentence: string, phrase: string) {
  const index = sentence.indexOf(phrase);
  if (index === -1) return sentence;
  return (
    <>
      {sentence.slice(0, index)}
      <mark>{phrase}</mark>
      {sentence.slice(index + phrase.length)}
    </>
  );
}

