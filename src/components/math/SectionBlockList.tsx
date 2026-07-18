"use client";

import type { ReactNode } from "react";
import type { MathBlock } from "../../../content/subjects/math/types";
import { ExampleBlock } from "./blocks/ExampleBlock";
import { GoalBlock } from "./blocks/GoalBlock";
import { IntroBlock } from "./blocks/IntroBlock";
import { PracticeBlock } from "./blocks/PracticeBlock";
import { QBlock } from "./blocks/QBlock";
import { QuickCheckBlock } from "./blocks/QuickCheckBlock";
import { RecallBlock } from "./blocks/RecallBlock";
import { ReflectBlock } from "./blocks/ReflectBlock";
import { RuleBlock } from "./blocks/RuleBlock";
import { WindowBlock } from "./blocks/WindowBlock";

export function SectionBlockList({
  blocks,
  isBlockDone,
  onTogglePracticeDone
}: {
  blocks: MathBlock[];
  isBlockDone: (blockId: string) => boolean;
  onTogglePracticeDone: (blockId: string) => void;
}) {
  return (
    <>
      {blocks.map((block) => {
        if (block.type === "intro") {
          return <IntroBlock block={block} key={block.id} />;
        }

        let rendered: ReactNode;
        switch (block.type) {
          case "goal":
            rendered = <GoalBlock block={block} />;
            break;
          case "q":
            rendered = <QBlock block={block} />;
            break;
          case "example":
            rendered = <ExampleBlock block={block} />;
            break;
          case "rule":
            rendered = <RuleBlock block={block} />;
            break;
          case "practice":
            rendered = (
              <PracticeBlock block={block} done={isBlockDone(block.id)} onToggleDone={() => onTogglePracticeDone(block.id)} />
            );
            break;
          case "recall":
            rendered = <RecallBlock block={block} />;
            break;
          case "quickcheck":
            rendered = <QuickCheckBlock block={block} />;
            break;
          case "window":
            rendered = <WindowBlock block={block} />;
            break;
          case "reflect":
            rendered = <ReflectBlock block={block} />;
            break;
          default:
            rendered = null;
        }

        return (
          <div className="math-block-wrap" key={block.id}>
            {block.page ? <span className="math-block-page">教科書 p.{block.page}</span> : null}
            {rendered}
          </div>
        );
      })}
    </>
  );
}
