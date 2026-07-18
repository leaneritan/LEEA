import type { MathBlockReflect } from "../../../../content/subjects/math/types";

export function ReflectBlock({ block }: { block: MathBlockReflect }) {
  return (
    <div className="math-block-reflect">
      <span className="math-reflect-pill">ふり返る</span>
      <div className="math-reflect-body">
        <p>学びをふり返ろう</p>
        {block.prompts.map((prompt, index) => (
          <p key={index}>{prompt}</p>
        ))}
      </div>
    </div>
  );
}
