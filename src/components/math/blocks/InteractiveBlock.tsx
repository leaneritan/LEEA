import type { MathBlockInteractive } from "../../../../content/subjects/math/types";
import { KukuTableWidget } from "./KukuTableWidget";
import { PrimeSieveWidget } from "./PrimeSieveWidget";

export function InteractiveBlock({ block }: { block: MathBlockInteractive }) {
  return (
    <div className="math-card math-block-interactive">
      <div className="math-card-head">
        <span className="math-interactive-badge">やってみよう</span>
        <h2>{block.heading}</h2>
      </div>
      {block.intro ? <p className="math-interactive-intro">{block.intro}</p> : null}
      {block.widget === "kuku-table" ? <KukuTableWidget /> : null}
      {block.widget === "prime-sieve" ? <PrimeSieveWidget /> : null}
    </div>
  );
}
