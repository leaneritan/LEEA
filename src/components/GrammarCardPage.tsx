"use client";

import Link from "next/link";
import { useState } from "react";
import { useJapanesePreference } from "@/components/AppShell";
import type { GrammarPoint } from "@/data/types";

export function GrammarCardPage({ grammar }: { grammar: GrammarPoint }) {
  const showJapanese = useJapanesePreference();
  const [activeTabId, setActiveTabId] = useState(grammar.chart?.tabs[0]?.id ?? "examples");
  const activeTab = grammar.chart?.tabs.find((tab) => tab.id === activeTabId);

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

          {grammar.chart ? (
            <div className="grammar-tabs">
              <div className="grammar-tab-list" role="tablist" aria-label={`${grammar.shortName} chart tabs`}>
                {grammar.chart.tabs.map((tab) => (
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

              {activeTab ? (
                <div className="grammar-tab-panel" role="tabpanel">
                  <h2>{activeTab.title}</h2>
                  <div className="grammar-blocks">
                    {activeTab.blocks.map((block, index) => renderGrammarBlock(block, index))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="example-list">
            {grammar.examples.map((example) => (
              <div key={example.sentence}>{highlight(example.sentence, example.highlight)}</div>
            ))}
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

function renderGrammarBlock(block: Record<string, unknown>, index: number) {
  if (block.type === "sentencePair") {
    return (
      <div className="grammar-block" key={index}>
        {(block.before as string[]).map((sentence) => (
          <p key={sentence}>{sentence}</p>
        ))}
        <strong>{block.after as string}</strong>
      </div>
    );
  }

  if (block.type === "equivalentSentences") {
    return (
      <div className="grammar-block" key={index}>
        {(block.sentences as string[]).map((sentence) => (
          <p key={sentence}>{sentence}</p>
        ))}
      </div>
    );
  }

  if (block.type === "pattern") {
    return (
      <div className="pattern-row compact" key={index}>
        {(block.parts as string[]).map((part) => (
          <span key={part}>{part}</span>
        ))}
      </div>
    );
  }

  if (block.type === "pronounList") {
    return (
      <div className="grammar-block" key={index}>
        <strong>{block.label as string}</strong>
        <p>{(block.items as string[]).join(", ")}</p>
      </div>
    );
  }

  if (block.type === "example") {
    return (
      <div className="grammar-block" key={index}>
        {highlight(block.sentence as string, block.highlight as string)}
      </div>
    );
  }

  if (block.type === "combineSentences") {
    return (
      <div className="grammar-block" key={index}>
        {(block.prompt as string[]).map((sentence) => (
          <p key={sentence}>{sentence}</p>
        ))}
        <strong>{block.answer as string}</strong>
      </div>
    );
  }

  if (block.type === "completeSentence" || block.type === "rewrite") {
    return (
      <div className="grammar-block" key={index}>
        <p>{block.prompt as string}</p>
        <strong>{block.answer as string}</strong>
      </div>
    );
  }

  return (
    <div className="grammar-block" key={index}>
      <p>{(block.text as string) ?? ""}</p>
    </div>
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
