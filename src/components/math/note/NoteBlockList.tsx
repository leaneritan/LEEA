"use client";

import type {
  MathNoteBlock,
  MathNoteBlockPoint,
  MathNoteBlockTeach
} from "../../../../content/subjects/math/note/types";
import { NoteQuestionSet } from "./NoteQuestionSet";

/** Wraps each phrase the book prints in colour, so the rule reads like the page. */
function highlight(statement: string, phrases: string[] | undefined) {
  if (!phrases?.length) return statement;
  const pattern = new RegExp(`(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return statement.split(pattern).map((piece, index) =>
    phrases.includes(piece) ? (
      <mark className="note-mark-phrase" key={index}>
        {piece}
      </mark>
    ) : (
      <span key={index}>{piece}</span>
    )
  );
}

function NoteTeach({ block }: { block: MathNoteBlockTeach }) {
  return (
    <section className="math-card note-teach">
      <h2 className="note-teach-heading">{block.heading}</h2>
      <p className="note-teach-statement">≫ {highlight(block.statement, block.highlightPhrases)}</p>
      {block.examples?.length ? (
        <div className="note-teach-examples">
          <span className="note-teach-example-label">例</span>
          <ul>
            {block.examples.map((example) => (
              <li key={example}>{example}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {block.aside ? <p className="note-teach-aside">{block.aside}</p> : null}
    </section>
  );
}

function NotePoint({ block }: { block: MathNoteBlockPoint }) {
  return (
    <section className="math-card note-point">
      <div className="note-point-head">
        <span className="note-point-flag">POINT</span>
        <h2>{block.heading}</h2>
      </div>
      <ul>
        {block.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </section>
  );
}

export function NoteBlockList({
  blocks,
  isBlockDone,
  onSetScored
}: {
  blocks: MathNoteBlock[];
  isBlockDone: (blockId: string) => boolean;
  onSetScored: (blockId: string, correct: number, total: number) => void;
}) {
  return (
    <>
      {blocks.map((block) => {
        switch (block.type) {
          case "intro":
            return null;
          case "teach":
            return <NoteTeach block={block} key={block.id} />;
          case "point":
            return <NotePoint block={block} key={block.id} />;
          case "qset":
            return (
              <NoteQuestionSet
                block={block}
                done={isBlockDone(block.id)}
                key={block.id}
                onScored={(correct, total) => onSetScored(block.id, correct, total)}
              />
            );
          case "carry":
            return (
              <p className="note-carry" key={block.id}>
                {block.text}
              </p>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
