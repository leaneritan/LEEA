import type { MathBlockGoal } from "../../../../content/subjects/math/types";

export function GoalBlock({ block }: { block: MathBlockGoal }) {
  return (
    <div className="math-block-goal">
      <span className="math-block-goal-pill">学習課題</span>
      <p className="math-block-goal-text">{block.text}</p>
    </div>
  );
}
