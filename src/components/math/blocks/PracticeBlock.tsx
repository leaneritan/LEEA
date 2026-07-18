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
