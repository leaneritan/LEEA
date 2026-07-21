import type { MathBlockInteractive } from "../../../../content/subjects/math/types";
import { AlgebraAreaModelWidget } from "./AlgebraAreaModelWidget";
import { AverageBaselineWidget } from "./AverageBaselineWidget";
import { CardGameWidget } from "./CardGameWidget";
import { CatchUpRaceWidget } from "./CatchUpRaceWidget";
import { CubeRodsWidget } from "./CubeRodsWidget";
import { DomainNumberLineWidget } from "./DomainNumberLineWidget";
import { EquationBalanceWidget } from "./EquationBalanceWidget";
import { EquationSolutionTableWidget } from "./EquationSolutionTableWidget";
import { EquivalentExpressionsWidget } from "./EquivalentExpressionsWidget";
import { FunctionCheckWidget } from "./FunctionCheckWidget";
import { InverseGraphChallengeWidget } from "./InverseGraphChallengeWidget";
import { InverseRepresentationLinkWidget } from "./InverseRepresentationLinkWidget";
import { InverseSlopeExplorerWidget } from "./InverseSlopeExplorerWidget";
import { KukuTableWidget } from "./KukuTableWidget";
import { LatticePointCounterWidget } from "./LatticePointCounterWidget";
import { LoopMeetingWidget } from "./LoopMeetingWidget";
import { MarathonPaceCompareWidget } from "./MarathonPaceCompareWidget";
import { MatchstickSquaresWidget } from "./MatchstickSquaresWidget";
import { MovingPointAreaWidget } from "./MovingPointAreaWidget";
import { NumberLinePlotWidget } from "./NumberLinePlotWidget";
import { NumberLineWalkWidget } from "./NumberLineWalkWidget";
import { NumberRangeGridWidget } from "./NumberRangeGridWidget";
import { OralRehydrationMixerWidget } from "./OralRehydrationMixerWidget";
import { PlanterSpacingWidget } from "./PlanterSpacingWidget";
import { PrimeSieveWidget } from "./PrimeSieveWidget";
import { ProportionGraphChallengeWidget } from "./ProportionGraphChallengeWidget";
import { ProportionRepresentationLinkWidget } from "./ProportionRepresentationLinkWidget";
import { ProportionSlopeExplorerWidget } from "./ProportionSlopeExplorerWidget";
import { ProportionVsInverseWidget } from "./ProportionVsInverseWidget";
import { QueueWaitWidget } from "./QueueWaitWidget";
import { RatioMixerWidget } from "./RatioMixerWidget";
import { SignedProductWidget } from "./SignedProductWidget";
import { SlideshowRelationWidget } from "./SlideshowRelationWidget";
import { SubstitutionWidget } from "./SubstitutionWidget";
import { SubtractionWalkWidget } from "./SubtractionWalkWidget";
import { TankCompareWidget } from "./TankCompareWidget";
import { TankFillRateWidget } from "./TankFillRateWidget";
import { TankRatioWidget } from "./TankRatioWidget";
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
      {block.widget === "equation-solution-table" ? <EquationSolutionTableWidget /> : null}
      {block.widget === "ratio-mixer" ? <RatioMixerWidget /> : null}
      {block.widget === "loop-meeting" ? <LoopMeetingWidget /> : null}
      {block.widget === "tank-ratio" ? <TankRatioWidget /> : null}
      {block.widget === "oral-rehydration-mixer" ? <OralRehydrationMixerWidget /> : null}
      {block.widget === "algebra-area-model" ? <AlgebraAreaModelWidget /> : null}
      {block.widget === "subtraction-walk" ? <SubtractionWalkWidget /> : null}
      {block.widget === "tank-fill-rate" ? <TankFillRateWidget /> : null}
      {block.widget === "proportion-vs-inverse" ? <ProportionVsInverseWidget /> : null}
      {block.widget === "function-check" ? <FunctionCheckWidget /> : null}
      {block.widget === "proportion-slope-explorer" ? <ProportionSlopeExplorerWidget /> : null}
      {block.widget === "proportion-representation-link" ? <ProportionRepresentationLinkWidget /> : null}
      {block.widget === "inverse-slope-explorer" ? <InverseSlopeExplorerWidget /> : null}
      {block.widget === "inverse-representation-link" ? <InverseRepresentationLinkWidget /> : null}
      {block.widget === "queue-wait" ? <QueueWaitWidget /> : null}
      {block.widget === "slideshow-relation" ? <SlideshowRelationWidget /> : null}
      {block.widget === "marathon-pace-compare" ? <MarathonPaceCompareWidget /> : null}
      {block.widget === "moving-point-area" ? <MovingPointAreaWidget /> : null}
      {block.widget === "lattice-point-counter" ? <LatticePointCounterWidget /> : null}
      {block.widget === "tank-compare" ? <TankCompareWidget /> : null}
      {block.widget === "domain-number-line" ? <DomainNumberLineWidget /> : null}
      {block.widget === "proportion-graph-challenge" ? <ProportionGraphChallengeWidget /> : null}
      {block.widget === "inverse-graph-challenge" ? <InverseGraphChallengeWidget /> : null}
    </div>
  );
}
