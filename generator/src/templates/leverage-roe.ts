import { ParametricTemplate } from "../types";

/**
 * Template for Financial Leverage (Leva Finanziaria) - ROE formula.
 * ROE = ROI + (ROI - i) * (D / E)
 * Syllabus Block: V (Analisi per Indici)
 */
export const leverageRoeTemplate: ParametricTemplate = {
  id: "B5-IND-LEVA-ROE",
  block: 5,
  topic: "indici-redditivita",
  tags: ["ROE", "ROI", "leva-finanziaria", "struttura-finanziaria"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "%",
  stemTemplate:
    "Un'impresa manifatturiera presenta una redditività del capitale investito (ROI) pari al {roi}, un costo medio dell'indebitamento finanziario (i) pari al {i} e un rapporto di indebitamento (D/E) pari a {de}. Trascurando l'effetto delle imposte, qual è il valore del Return on Equity (ROE)?",
  variables: {
    roi: { min: 8, max: 20, step: 0.5, unit: "%", decimals: 1 },
    i: { min: 3, max: 9, step: 0.5, unit: "%", decimals: 1 },
    de: { min: 0.5, max: 3.0, step: 0.1, decimals: 1 },
  },
  constraints: ["roi > i"], // ensures positive financial leverage
  correctFormula: "roi + (roi - i) * de",
  distractorFormulas: [
    "roi * de", // common mistake: forgetting base ROI and interest
    "roi + (roi - i)", // common mistake: forgetting D/E weighting
    "roi + (i - roi) * de", // inverted spread (ROI - i)
  ],
  formulaKaTeX: "ROE = ROI + (ROI - i) \\cdot \\frac{D}{E}",
  explanationTemplate: {
    why: "L'effetto di leva finanziaria consente a un'impresa di incrementare la redditività dei mezzi propri (ROE) indebitandosi, purché il rendimento della gestione operativa (ROI) superi il costo del debito (i).",
    what: "La relazione fondamentale lega il rendimento del capitale netto al rendimento operativo, maggiorato dello spread (ROI - i) moltiplicato per l'intensità dell'indebitamento D/E.",
    howTemplate:
      "Applicando la formula: ROE = {roi} + ({roi} − {i}) × {de} = {roi} + ({roi_raw - i_raw}% × {de}) = {correct}.",
    trap: "Attenzione a non confondere il ROE con il semplice ROI: quando ROI > i, il debito genera un effetto moltiplicativo positivo a favore degli azionisti.",
  },
};
