import type { MathBlockLessonLink } from "../../../../content/subjects/math/types";

export function LessonLinkBlock({ block }: { block: MathBlockLessonLink }) {
  return (
    <div className="math-block-lessonlink">
      <div className="math-lessonlink-text">
        <h2 className="math-lessonlink-heading">{block.heading}</h2>
        <p className="math-lessonlink-body">{block.body}</p>
      </div>
      <a className="math-lessonlink-btn" href={block.href} rel="noopener noreferrer" target="_blank">
        {block.label}
      </a>
    </div>
  );
}
