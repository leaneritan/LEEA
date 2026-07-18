import type { MathBlockRecall } from "../../../../content/subjects/math/types";

export function RecallBlock({ block }: { block: MathBlockRecall }) {
  return (
    <div className="math-block-recall">
      <span className="math-recall-pill">{block.label}</span>
      <div className="math-recall-body">
        <p>{block.heading}</p>
        <p>{block.body}</p>
      </div>
    </div>
  );
}
