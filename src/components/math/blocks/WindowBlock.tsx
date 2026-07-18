import type { MathBlockWindow } from "../../../../content/subjects/math/types";
import { ChipRow } from "./ChipRow";

export function WindowBlock({ block }: { block: MathBlockWindow }) {
  return (
    <div className="math-block-window">
      <div className="math-window-dots" />
      <div className="math-window-content">
        <span className="math-window-pill">数学のまど ★</span>
        <h2 className="math-window-title">{block.heading}</h2>
        <p className="math-window-body">{block.body}</p>
        <ChipRow chips={block.chips} />
      </div>
    </div>
  );
}
