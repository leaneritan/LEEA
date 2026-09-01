"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import type {
  ScienceBlock,
  ScienceBlockField,
  ScienceBlockGoal,
  ScienceBlockInteractive,
  ScienceBlockIntro,
  ScienceBlockPractice,
  ScienceBlockProcedure,
  ScienceBlockQ,
  ScienceBlockQuickCheck,
  ScienceBlockRecall,
  ScienceBlockReflect,
  ScienceBlockTechnique,
  ScienceBlockTerm,
  ScienceChip
} from "../../../content/subjects/science/types";
import { ClassificationSortWidget } from "./blocks/ClassificationSortWidget";

const CHIP_ICON: Record<ScienceChip["kind"], string> = {
  simulation: "🧪",
  "thinking-tool": "🧩",
  worksheet: "📝",
  video: "▶️",
  reference: "📚",
  practice: "✏️"
};

function Chips({ chips }: { chips?: ScienceChip[] }) {
  if (!chips?.length) return null;
  return (
    <div className="sci-chips">
      {chips.map((chip) => {
        const body = (
          <>
            <span aria-hidden="true">{CHIP_ICON[chip.kind]}</span> {chip.label}
          </>
        );
        const key = `${chip.kind}-${chip.label}`;

        // A chip only becomes a link when a real publisher URL was captured
        // for it; otherwise it stays a plain tag rather than a dead link.
        return chip.url ? (
          <a
            className={`sci-chip sci-chip--${chip.kind} sci-chip--link`}
            href={chip.url}
            key={key}
            rel="noopener noreferrer"
            target="_blank"
            title="教科書のQRコンテンツをひらく"
          >
            {body} ↗
          </a>
        ) : (
          <span className={`sci-chip sci-chip--${chip.kind}`} key={key}>
            {body}
          </span>
        );
      })}
    </div>
  );
}

function IntroBlock({ block }: { block: ScienceBlockIntro }) {
  return (
    <section className="sci-intro">
      <span className="sci-intro-pill">{block.kicker ?? `${block.sectionNumber}`}</span>
      <h1>{block.title}</h1>
      <p className="sci-intro-question">{block.question}</p>
      <div className="sci-intro-meta">
        <span>{block.pageRange}</span>
        <span>{block.topicFlow}</span>
      </div>
    </section>
  );
}

function GoalBlock({ block }: { block: ScienceBlockGoal }) {
  return (
    <section className="sci-card sci-goal">
      <span className="sci-card-label">めあて</span>
      <p>{block.text}</p>
    </section>
  );
}

function QBlock({ block }: { block: ScienceBlockQ }) {
  return (
    <section className="sci-card sci-q">
      <h2>{block.heading}</h2>
      <p>{block.intro}</p>
      <ul>
        {block.prompts.map((prompt) => (
          <li key={prompt}>{prompt}</li>
        ))}
      </ul>
      <Chips chips={block.chips} />
    </section>
  );
}

function ProcedureBlock({
  block,
  done,
  onToggleDone
}: {
  block: ScienceBlockProcedure;
  done: boolean;
  onToggleDone: () => void;
}) {
  return (
    <section className="sci-card sci-procedure">
      <div className="sci-card-head">
        <span className="sci-card-label sci-card-label--strong">{block.label}</span>
        <h2>{block.heading}</h2>
      </div>
      <p className="sci-procedure-purpose">
        <b>目的</b> {block.purpose}
      </p>
      {block.materials?.length ? (
        <p className="sci-procedure-materials">
          <b>準備する物</b> {block.materials.join(" ／ ")}
        </p>
      ) : null}
      {block.steps.map((step) => (
        <div className="sci-procedure-step" key={step.title}>
          <h3>{step.title}</h3>
          <ol>
            {step.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      ))}
      {block.cautions?.length ? (
        <div className="sci-caution">
          <span className="sci-card-label">注意</span>
          <ul>
            {block.cautions.map((caution) => (
              <li key={caution}>{caution}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {block.observationPoints?.length ? (
        <div className="sci-points">
          <span className="sci-card-label">考察のポイント</span>
          <ul>
            {block.observationPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <Chips chips={block.chips} />
      <button className={`sci-done${done ? " is-done" : ""}`} onClick={onToggleDone} type="button">
        {done ? "✓ やった" : "やったらチェック"}
      </button>
    </section>
  );
}

function TechniqueBlock({ block }: { block: ScienceBlockTechnique }) {
  return (
    <section className="sci-card sci-technique">
      <h2>{block.heading}</h2>
      <ol>
        {block.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      {block.cautions?.length ? (
        <div className="sci-caution">
          <span className="sci-card-label">注意</span>
          <ul>
            {block.cautions.map((caution) => (
              <li key={caution}>{caution}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <Chips chips={block.chips} />
    </section>
  );
}

/** Wraps each highlight phrase in a mark, so the defining clause stands out. */
function highlight(statement: string, phrases: string[]) {
  if (!phrases.length) return statement;
  const escaped = phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = statement.split(new RegExp(`(${escaped.join("|")})`, "g"));
  return parts.map((part, index) =>
    phrases.includes(part) ? <mark key={`${part}-${index}`}>{part}</mark> : part
  );
}

function TermBlock({ block }: { block: ScienceBlockTerm }) {
  return (
    <section className="sci-card sci-term">
      <div className="sci-card-head">
        <span className="sci-card-label sci-card-label--strong">ことば</span>
        <h2>
          {block.term}
          <small>{block.reading}</small>
        </h2>
      </div>
      <p>{highlight(block.statement, block.highlightPhrases)}</p>
    </section>
  );
}

function FieldBlock({ block }: { block: ScienceBlockField }) {
  return (
    <section className="sci-card sci-field">
      <h2>{block.heading}</h2>
      {block.intro ? <p className="sci-field-intro">{block.intro}</p> : null}
      <div className="sci-field-grid">
        {block.entries.map((entry) => (
          <div className="sci-field-entry" key={entry.name}>
            <div className="sci-field-entry-head">
              <b>{entry.name}</b>
              <span>{entry.family}</span>
            </div>
            <span className="sci-field-size">{entry.size}</span>
            <p>{entry.note}</p>
          </div>
        ))}
      </div>
      <Chips chips={block.chips} />
    </section>
  );
}

function RecallBlock({ block }: { block: ScienceBlockRecall }) {
  return (
    <section className="sci-card sci-recall">
      <div className="sci-card-head">
        <span className="sci-card-label">{block.label}</span>
        <h2>{block.heading}</h2>
      </div>
      <p>{block.body}</p>
    </section>
  );
}

function QuickCheckBlock({
  block,
  done,
  onToggleDone
}: {
  block: ScienceBlockQuickCheck;
  done: boolean;
  onToggleDone: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="sci-card sci-quickcheck">
      <h2>{block.heading}</h2>
      <ol className="sci-quickcheck-items">
        {block.items.map((item, index) => (
          <li key={item}>
            <p>{item}</p>
            {revealed ? <p className="sci-answer">{block.answers[index]}</p> : null}
          </li>
        ))}
      </ol>
      <Chips chips={block.chips} />
      <div className="sci-quickcheck-actions">
        <button className="sci-btn" onClick={() => setRevealed((current) => !current)} type="button">
          {revealed ? "答えをかくす" : "答えを見る"}
        </button>
        <button className={`sci-done${done ? " is-done" : ""}`} onClick={onToggleDone} type="button">
          {done ? "✓ やった" : "やったらチェック"}
        </button>
      </div>
    </section>
  );
}

/** One ワーク question, with its own reveal so a set is worked one at a time. */
function PracticeItem({ item }: { item: ScienceBlockPractice["items"][number] }) {
  const [shown, setShown] = useState(false);

  return (
    <li>
      <p>{item.prompt}</p>
      {item.keyword ? <p className="sci-practice-keyword">キーワード → {item.keyword}</p> : null}
      {item.answer ? (
        <>
          <button className="sci-btn sci-btn--tiny" onClick={() => setShown((v) => !v)} type="button">
            {shown ? "答えをかくす" : "答えを見る"}
          </button>
          {shown ? (
            <p className="sci-answer">
              {item.answer}
              {item.source ? <span className="sci-answer-source">{item.source}</span> : null}
            </p>
          ) : null}
        </>
      ) : (
        <p className="sci-practice-paper">ノートでやってみよう（答えは1つではないよ）</p>
      )}
    </li>
  );
}

function PracticeBlock({
  block,
  done,
  onToggleDone
}: {
  block: ScienceBlockPractice;
  done: boolean;
  onToggleDone: () => void;
}) {
  return (
    <section className="sci-card sci-practice">
      <div className="sci-card-head">
        <span className="sci-card-label sci-card-label--strong">{block.label}</span>
        <h2>{block.heading}</h2>
      </div>
      <p className="sci-practice-source">
        ワーク p.{block.workbookPage}
        {block.textbookRef ? <span>／ {block.textbookRef}</span> : null}
      </p>
      <ol className="sci-practice-items">
        {block.items.map((item) => (
          <PracticeItem item={item} key={item.prompt} />
        ))}
      </ol>
      <button className={`sci-done${done ? " is-done" : ""}`} onClick={onToggleDone} type="button">
        {done ? "✓ やった" : "やったらチェック"}
      </button>
    </section>
  );
}

function ReflectBlock({ block }: { block: ScienceBlockReflect }) {
  return (
    <section className="sci-card sci-reflect">
      {block.heading ? <h2>{block.heading}</h2> : null}
      <ul>
        {block.prompts.map((prompt) => (
          <li key={prompt}>{prompt}</li>
        ))}
      </ul>
      {block.keywords?.length ? (
        <p className="sci-keywords">
          使用するキーワード → {block.keywords.join("、")}
        </p>
      ) : null}
      <Chips chips={block.chips} />
    </section>
  );
}

function InteractiveBlock({
  block,
  done,
  onScored
}: {
  block: ScienceBlockInteractive;
  done: boolean;
  onScored: (correct: number, total: number) => void;
}) {
  return (
    <section className="sci-card sci-interactive">
      <div className="sci-card-head">
        <span className="sci-card-label sci-card-label--strong">やってみよう</span>
        <h2>{block.heading}</h2>
        {done ? <span className="sci-done is-done">✓ できた</span> : null}
      </div>
      {block.intro ? <p>{block.intro}</p> : null}
      <Chips chips={block.chips} />
      {block.widget === "classification-sort" ? <ClassificationSortWidget onScored={onScored} /> : null}
    </section>
  );
}

export function SectionBlockList({
  blocks,
  isBlockDone,
  onToggleDone,
  onWidgetScored
}: {
  blocks: ScienceBlock[];
  isBlockDone: (blockId: string) => boolean;
  onToggleDone: (blockId: string) => void;
  onWidgetScored: (blockId: string, correct: number, total: number) => void;
}) {
  return (
    <>
      {blocks.map((block) => {
        if (block.type === "intro") return <IntroBlock block={block} key={block.id} />;

        let rendered: ReactNode;
        switch (block.type) {
          case "goal":
            rendered = <GoalBlock block={block} />;
            break;
          case "q":
            rendered = <QBlock block={block} />;
            break;
          case "procedure":
            rendered = (
              <ProcedureBlock
                block={block}
                done={isBlockDone(block.id)}
                onToggleDone={() => onToggleDone(block.id)}
              />
            );
            break;
          case "technique":
            rendered = <TechniqueBlock block={block} />;
            break;
          case "term":
            rendered = <TermBlock block={block} />;
            break;
          case "field":
            rendered = <FieldBlock block={block} />;
            break;
          case "recall":
            rendered = <RecallBlock block={block} />;
            break;
          case "quickcheck":
            rendered = (
              <QuickCheckBlock
                block={block}
                done={isBlockDone(block.id)}
                onToggleDone={() => onToggleDone(block.id)}
              />
            );
            break;
          case "reflect":
            rendered = <ReflectBlock block={block} />;
            break;
          case "practice":
            rendered = (
              <PracticeBlock
                block={block}
                done={isBlockDone(block.id)}
                onToggleDone={() => onToggleDone(block.id)}
              />
            );
            break;
          case "interactive":
            rendered = (
              <InteractiveBlock
                block={block}
                done={isBlockDone(block.id)}
                onScored={(correct, total) => onWidgetScored(block.id, correct, total)}
              />
            );
            break;
          default:
            rendered = null;
        }

        // Only blocks sourced from the textbook carry `page`, and it always
        // means a textbook page. A practice block has none: its pages are
        // ワーク pages, which it prints itself.
        const textbookPage = "page" in block ? block.page : undefined;

        return (
          <div className="sci-block-wrap" key={block.id}>
            {textbookPage ? <span className="sci-block-page">教科書 p.{textbookPage}</span> : null}
            {rendered}
          </div>
        );
      })}
    </>
  );
}
