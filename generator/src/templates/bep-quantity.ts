import { ParametricTemplate } from "../types";

/**
 * Template: Break-Even Point in Quantità (Q*)
 * Formula: Q* = CF / (p - cv) = CF / MdCu
 * Syllabus Block: VI (Costi e Decisioni / Break-Even Analysis)
 */
export const bepQuantityTemplate: ParametricTemplate = {
  id: "B6-BEP-QUANTITA",
  block: 6,
  topic: "break-even-analysis",
  tags: ["BEP", "costi-fissi", "costi-variabili", "margine-contribuzione", "quantita-pareggio"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: " unità",
  stemTemplate:
    "Un'impresa manifatturiera produce e vende un componente con un prezzo unitario di vendita p = {p} € e sostiene costi variabili unitari cv = {cv} €. I costi fissi totali annui di struttura ammontano a {cf} €. A quanto ammonta il volume di produzione e vendita di pareggio (Break-Even Point Q*)?",
  variables: {
    p: { min: 40, max: 200, step: 10, decimals: 0 },
    cv: { min: 15, max: 120, step: 5, decimals: 0 },
    cf: { min: 30000, max: 180000, step: 5000, decimals: 0 },
  },
  constraints: ["p > cv + 10"],
  correctFormula: "cf / (p - cv)",
  distractorFormulas: [
    "cf / p", // forgets variable costs
    "cf / (p + cv)", // sums variable costs instead of subtracting
    "cf / cv", // divides by variable cost
  ],
  formulaKaTeX: "Q^* = \\frac{CF}{p - cv} = \\frac{CF}{MdC_u}",
  explanationTemplate: {
    why: "Il Break-Even Point in quantità determina il volume minimo di assorbimento dei costi di struttura prima che l'impresa inizi a generare utile operativo.",
    what: "Il punto di pareggio si ottiene dividendo i costi fissi totali per il margine di contribuzione unitario (MdCu = p - cv), che rappresenta la quota di prezzo che residua per coprire i costi fissi dopo aver ripagato i costi variabili.",
    howTemplate:
      "MdCu = p − cv = {p} € − {cv} € = {p - cv} €/unità. Q* = CF / MdCu = {cf} € / {p - cv} € = {correct}.",
    trap: "Non dividere i costi fissi per il prezzo di vendita: ogni unità venduta genera costi variabili che devono essere sottratti dal prezzo.",
  },
  sourceRef: "Slide Blocco VI - Costi e Break-Even Analysis",
};
