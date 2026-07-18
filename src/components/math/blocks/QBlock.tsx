import type { MathBlockQ } from "../../../../content/subjects/math/types";
import { ChipRow } from "./ChipRow";
import { NumberLine } from "./NumberLine";

export function QBlock({ block }: { block: MathBlockQ }) {
  return (
    <div className="math-card">
      <div className="math-card-head">
        <span className="math-q-badge">Q</span>
        <h2>{block.heading}</h2>
      </div>
      <p className="math-q-intro">{block.intro}</p>
      <div className="math-q-prompts">
        {block.prompts.map((prompt, index) => (
          <div className="math-q-prompt" key={index}>
            <span className="math-q-prompt-num">{index + 1}</span>
            <p>{prompt}</p>
          </div>
        ))}
      </div>
      {block.diagram ? (
        <div className="math-diagram-panel">
          <NumberLine diagram={block.diagram} />
        </div>
      ) : null}
      <ChipRow chips={block.chips} />
    </div>
  );
}
