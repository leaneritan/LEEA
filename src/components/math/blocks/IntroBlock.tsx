import type { MathBlockIntro } from "../../../../content/subjects/math/types";

export function IntroBlock({ block }: { block: MathBlockIntro }) {
  return (
    <div className="math-block-intro">
      <div className="math-block-intro-top">
        <div className="math-block-intro-titles">
          <div className="math-block-intro-heading">
            {block.kicker ? (
              <span className="math-block-intro-number math-block-intro-number--kicker">{block.kicker}</span>
            ) : (
              <span className="math-block-intro-number">
                {block.sectionNumber}
                <span>節</span>
              </span>
            )}
            <h1 className="math-block-intro-title">{block.title}</h1>
          </div>
          <p className="math-block-intro-question">{block.question}</p>
        </div>
        <div className="math-block-intro-art">とびらイラスト</div>
      </div>
      <div className="math-block-intro-footer">
        <span>{block.pageRange}</span>
        <span>{block.topicFlow}</span>
      </div>
    </div>
  );
}
