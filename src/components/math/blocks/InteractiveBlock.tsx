import type { MathBlockInteractive } from "../../../../content/subjects/math/types";
import { AverageBaselineWidget } from "./AverageBaselineWidget";
import { CardGameWidget } from "./CardGameWidget";
import { CatchUpRaceWidget } from "./CatchUpRaceWidget";
import { CubeRodsWidget } from "./CubeRodsWidget";
import { EquationBalanceWidget } from "./EquationBalanceWidget";
import { EquivalentExpressionsWidget } from "./EquivalentExpressionsWidget";
import { KukuTableWidget } from "./KukuTableWidget";
import { MatchstickSquaresWidget } from "./MatchstickSquaresWidget";
import { NumberLinePlotWidget } from "./NumberLinePlotWidget";
import { NumberLineWalkWidget } from "./NumberLineWalkWidget";
import { NumberRangeGridWidget } from "./NumberRangeGridWidget";
import { PlanterSpacingWidget } from "./PlanterSpacingWidget";
import { PrimeSieveWidget } from "./PrimeSieveWidget";
import { SignedProductWidget } from "./SignedProductWidget";
import { SubstitutionWidget } from "./SubstitutionWidget";
import { WalkRateWidget } from "./WalkRateWidget";

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
      {block.widget === "number-line-walk" ? <NumberLineWalkWidget /> : null}
      {block.widget === "card-game" ? <CardGameWidget /> : null}
      {block.widget === "number-line-plot" ? <NumberLinePlotWidget /> : null}
      {block.widget === "signed-product" ? <SignedProductWidget tileCount={block.tileCount} /> : null}
      {block.widget === "walk-rate" ? <WalkRateWidget /> : null}
      {block.widget === "number-range-grid" ? <NumberRangeGridWidget /> : null}
      {block.widget === "average-baseline" ? <AverageBaselineWidget /> : null}
      {block.widget === "matchstick-squares" ? <MatchstickSquaresWidget /> : null}
      {block.widget === "substitution" ? <SubstitutionWidget /> : null}
      {block.widget === "equivalent-expressions" ? <EquivalentExpressionsWidget /> : null}
      {block.widget === "cube-rods" ? <CubeRodsWidget /> : null}
      {block.widget === "equation-balance" ? <EquationBalanceWidget /> : null}
      {block.widget === "planter-spacing" ? <PlanterSpacingWidget /> : null}
      {block.widget === "catch-up-race" ? <CatchUpRaceWidget /> : null}
    </div>
  );
}
