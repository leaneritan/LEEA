import { useState } from "react";
import type { MathBlockPractice } from "../../../../content/subjects/math/types";
import { ChipList } from "./ChipRow";

export function PracticeBlock({
  block,
  done,
  onToggleDone
}: {
  block: MathBlockPractice;
  done: boolean;
  onToggleDone: () => void;
}) {
  const [showAnswers, setShowAnswers] = useState(false);
  const hasAnswers = Array.isArray(block.answers) && block.answers.length > 0;

  return (
    <div className="math-card">
      <div className="math-card-head">
        <span className="math-practice-pill">✓ {block.label}</span>
        <h2>{block.heading}</h2>
        {block.mustMaster ? (
          <span className="math-must-master" title="かならず解けるようになりたい問題">
            ♥
          </span>
        ) : null}
        {block.tag ? <span className="math-practice-tag">{block.tag}</span> : null}
      </div>
      <div className="math-practice-items">
        {block.items.map((item, index) => (
          <div key={index}>
            <span className="math-practice-item-num">({index + 1})</span>
            {item}
          </div>
        ))}
      </div>
      {hasAnswers ? (
        <button
          className={`math-reveal-toggle${showAnswers ? " math-reveal-toggle--open" : ""}`}
          onClick={() => setShowAnswers((value) => !value)}
          type="button"
        >
          {showAnswers ? "答えをかくす" : "答えを見る"}
        </button>
      ) : null}
      {hasAnswers && showAnswers ? (
        <div className="math-practice-answers">
          {block.answers!.map((answer, index) => (
            <div key={index}>
              <span className="math-practice-item-num">({index + 1})</span>
              {answer}
            </div>
          ))}
        </div>
      ) : null}
      <div className="math-chip-row">
        <ChipList chips={block.chips} />
        <button
          className={`math-done-toggle${done ? " math-done-toggle--done" : ""}`}
          onClick={onToggleDone}
          type="button"
        >
          {done ? "できた ✓" : "できたら チェック"}
        </button>
      </div>
    </div>
  );
}
