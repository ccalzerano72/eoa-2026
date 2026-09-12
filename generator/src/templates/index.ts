import { ParametricTemplate } from "../types";

// Existing templates (Blocks 4, 5, 6)
import { leverageRoeTemplate } from "./leverage-roe";
import { bepQuantityTemplate } from "./bep-quantity";
import { bepRevenueTemplate } from "./bep-revenue";
import { operatingLeverageTemplate } from "./operating-leverage";
import { safetyMarginTemplate } from "./safety-margin";
import { workingCapitalTemplate } from "./working-capital";
import { liquidityRatiosTemplate } from "./liquidity-ratios";
import { turnoverWorkingCapitalTemplate } from "./turnover-working-capital";

// Block 1 templates & combinatorics
import {
  laborProductivityTemplate,
  capitalProductivityTemplate,
  opportunityCostTemplate,
  block1Templates,
  generateBlock1CombinatorialQuestions,
} from "./block-1-templates";

// Block 2 templates & combinatorics
import {
  relativeMarketShareTemplate,
  learningCurveTemplate,
  priceElasticityTemplate,
  block2Templates,
  generateBlock2CombinatorialQuestions,
} from "./block-2-templates";

// Block 3 templates & combinatorics
import {
  startupValuationTemplate,
  spanOfControlTemplate,
  block3Templates,
  generateBlock3CombinatorialQuestions,
} from "./block-3-templates";

// Block 4 templates & combinatorics
import {
  valueAddedEbitdaTemplate,
  straightLineDepreciationTemplate,
  accrualsDeferralsTemplate,
  block4Templates,
  generateBlock4CombinatorialQuestions,
} from "./block-4-templates";

// Block 5 templates & combinatorics
import {
  dupontAnalysisTemplate,
  debtCoverageTemplate,
  structureMarginTemplate,
  block5Templates,
  generateBlock5CombinatorialQuestions,
} from "./block-5-templates";

// Block 6 templates & combinatorics
import {
  makeOrBuyTemplate,
  specialOrderTemplate,
  scarceResourceMixTemplate,
  block6Templates,
  generateBlock6CombinatorialQuestions,
} from "./block-6-templates";

// Block 7 templates & combinatorics
import {
  clvCacTemplate,
  paybackPeriodTemplate,
  waccTemplate,
  block7Templates,
  generateBlock7CombinatorialQuestions,
} from "./block-7-templates";

export const allParametricTemplates: ParametricTemplate[] = [
  // Block 1
  laborProductivityTemplate,
  capitalProductivityTemplate,
  opportunityCostTemplate,

  // Block 2
  relativeMarketShareTemplate,
  learningCurveTemplate,
  priceElasticityTemplate,

  // Block 3
  startupValuationTemplate,
  spanOfControlTemplate,

  // Block 4
  workingCapitalTemplate,
  valueAddedEbitdaTemplate,
  straightLineDepreciationTemplate,
  accrualsDeferralsTemplate,

  // Block 5
  leverageRoeTemplate,
  liquidityRatiosTemplate,
  turnoverWorkingCapitalTemplate,
  dupontAnalysisTemplate,
  debtCoverageTemplate,
  structureMarginTemplate,

  // Block 6
  bepQuantityTemplate,
  bepRevenueTemplate,
  operatingLeverageTemplate,
  safetyMarginTemplate,
  makeOrBuyTemplate,
  specialOrderTemplate,
  scarceResourceMixTemplate,

  // Block 7
  clvCacTemplate,
  paybackPeriodTemplate,
  waccTemplate,
];

export const allCombinatorialGenerators = [
  generateBlock1CombinatorialQuestions,
  generateBlock2CombinatorialQuestions,
  generateBlock3CombinatorialQuestions,
  generateBlock4CombinatorialQuestions,
  generateBlock5CombinatorialQuestions,
  generateBlock6CombinatorialQuestions,
  generateBlock7CombinatorialQuestions,
];

export {
  // B1
  laborProductivityTemplate,
  capitalProductivityTemplate,
  opportunityCostTemplate,
  generateBlock1CombinatorialQuestions,
  // B2
  relativeMarketShareTemplate,
  learningCurveTemplate,
  priceElasticityTemplate,
  generateBlock2CombinatorialQuestions,
  // B3
  startupValuationTemplate,
  spanOfControlTemplate,
  generateBlock3CombinatorialQuestions,
  // B4
  workingCapitalTemplate,
  valueAddedEbitdaTemplate,
  straightLineDepreciationTemplate,
  accrualsDeferralsTemplate,
  generateBlock4CombinatorialQuestions,
  // B5
  leverageRoeTemplate,
  liquidityRatiosTemplate,
  turnoverWorkingCapitalTemplate,
  dupontAnalysisTemplate,
  debtCoverageTemplate,
  structureMarginTemplate,
  generateBlock5CombinatorialQuestions,
  // B6
  bepQuantityTemplate,
  bepRevenueTemplate,
  operatingLeverageTemplate,
  safetyMarginTemplate,
  makeOrBuyTemplate,
  specialOrderTemplate,
  scarceResourceMixTemplate,
  generateBlock6CombinatorialQuestions,
  // B7
  clvCacTemplate,
  paybackPeriodTemplate,
  waccTemplate,
  generateBlock7CombinatorialQuestions,
};
