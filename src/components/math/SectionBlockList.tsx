"use client";

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
        switch (block.type) {
          case "intro":
            return <IntroBlock block={block} key={block.id} />;
          case "goal":
            return <GoalBlock block={block} key={block.id} />;
          case "q":
            return <QBlock block={block} key={block.id} />;
          case "example":
            return <ExampleBlock block={block} key={block.id} />;
          case "rule":
            return <RuleBlock block={block} key={block.id} />;
          case "practice":
            return (
              <PracticeBlock
                block={block}
                done={isBlockDone(block.id)}
                key={block.id}
                onToggleDone={() => onTogglePracticeDone(block.id)}
              />
            );
          case "recall":
            return <RecallBlock block={block} key={block.id} />;
          case "quickcheck":
            return <QuickCheckBlock block={block} key={block.id} />;
          case "window":
            return <WindowBlock block={block} key={block.id} />;
          case "reflect":
            return <ReflectBlock block={block} key={block.id} />;
          default:
            return null;
        }
      })}
    </>
  );
}
