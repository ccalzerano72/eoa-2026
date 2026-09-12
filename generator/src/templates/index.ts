import { ParametricTemplate } from "../types";
import { leverageRoeTemplate } from "./leverage-roe";
import { bepQuantityTemplate } from "./bep-quantity";
import { bepRevenueTemplate } from "./bep-revenue";
import { operatingLeverageTemplate } from "./operating-leverage";
import { safetyMarginTemplate } from "./safety-margin";
import { workingCapitalTemplate } from "./working-capital";
import { liquidityRatiosTemplate } from "./liquidity-ratios";
import { turnoverWorkingCapitalTemplate } from "./turnover-working-capital";

export const allParametricTemplates: ParametricTemplate[] = [
  leverageRoeTemplate,
  bepQuantityTemplate,
  bepRevenueTemplate,
  operatingLeverageTemplate,
  safetyMarginTemplate,
  workingCapitalTemplate,
  liquidityRatiosTemplate,
  turnoverWorkingCapitalTemplate,
];

export {
  leverageRoeTemplate,
  bepQuantityTemplate,
  bepRevenueTemplate,
  operatingLeverageTemplate,
  safetyMarginTemplate,
  workingCapitalTemplate,
  liquidityRatiosTemplate,
  turnoverWorkingCapitalTemplate,
};
