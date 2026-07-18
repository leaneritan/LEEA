import type { MathBlockRule } from "../../../../content/subjects/math/types";

function renderHighlighted(statement: string, phrases: string[]) {
  if (phrases.length === 0) return statement;

  const pattern = new RegExp(`(${phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  const parts = statement.split(pattern);

  return parts.map((part, index) =>
    phrases.includes(part) ? (
      <span className="math-rule-highlight" key={index}>
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}

export function RuleBlock({ block }: { block: MathBlockRule }) {
  return (
    <div className="math-block-rule">
      <div className="math-rule-band">
        <span className="math-rule-band-label">きまり</span>
        <span className="math-rule-band-title">{block.label}</span>
      </div>
      <div className="math-rule-body">
        <p className="math-rule-statement">{renderHighlighted(block.statement, block.highlightPhrases)}</p>
        <div className="math-rule-examples">
          {block.examples.map((example) => (
            <span key={example}>{example}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
