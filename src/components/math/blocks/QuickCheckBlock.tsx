import { useState } from "react";
import type { MathBlockQuickCheck } from "../../../../content/subjects/math/types";

export function QuickCheckBlock({ block }: { block: MathBlockQuickCheck }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="math-card math-block-quickcheck">
      <div className="math-card-head">
        <span className="math-quickcheck-star">★</span>
        <h2 style={{ fontFamily: "var(--font-jp-display)", fontWeight: 900, fontSize: 17 }}>{block.heading}</h2>
        <span className="math-quickcheck-hint">かならず身につけたい問題</span>
      </div>
      <div className="math-quickcheck-items">
        {block.items.map((item, index) => (
          <div key={index}>
            <span className="math-practice-item-num">({index + 1})</span>
            {item}
          </div>
        ))}
      </div>
      <button
        className={`math-reveal-toggle${open ? " math-reveal-toggle--open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? "解答をかくす" : "解答を見る"}
      </button>
      {open ? (
        <div className="math-quickcheck-answers">
          {block.answers.map((answer, index) => (
            <div key={index}>
              ({index + 1}) {answer}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
