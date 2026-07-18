import type { MathBlockExample } from "../../../../content/subjects/math/types";

export function ExampleBlock({ block }: { block: MathBlockExample }) {
  return (
    <div className="math-card">
      <div className="math-card-head">
        <span className="math-example-label">{block.label}</span>
        <h2>{block.heading}</h2>
      </div>
      <div className="math-example-body">
        <div>
          <p className="math-example-problem">{block.problem}</p>
          <div className="math-example-steps">
            {block.steps.map((step, index) => (
              <div key={index}>{step}</div>
            ))}
          </div>
        </div>
        {block.note ? <div className="math-example-note">{block.note}</div> : null}
      </div>
    </div>
  );
}
