import { ParametricTemplate } from "../types";

/**
 * Template: Break-Even Point in Fatturato (R*)
 * Formula: R* = CF / (1 - cv / p) = CF / (MdCu / p) = CF / m
 * Syllabus Block: VI (Costi e Decisioni / Break-Even Analysis)
 */
export const bepRevenueTemplate: ParametricTemplate = {
  id: "B6-BEP-FATTURATO",
  block: 6,
  topic: "break-even-analysis",
  tags: ["BEP", "fatturato-pareggio", "margine-contribuzione-percentuale", "costi-fissi"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: " €",
  stemTemplate:
    "Una società di servizi software vende un pacchetto applicativo a un prezzo unitario di {p} €, con costi variabili unitari pari a {cv} €. I costi fissi totali di gestione ammontano a {cf} €. Qual è il fatturato di pareggio (Break-Even Point in valore R*) necessario per azzerare le perdite?",
  variables: {
    p: { min: 50, max: 250, step: 10, decimals: 0 },
    cv: { min: 20, max: 150, step: 5, decimals: 0 },
    cf: { min: 50000, max: 200000, step: 10000, decimals: 0 },
  },
  constraints: ["p >= cv + 20"],
  correctFormula: "cf / ((p - cv) / p)",
  distractorFormulas: [
    "cf / (p - cv)", // confuses quantity with revenue
    "cf + (cf * (cv / p))", // incorrect markup
    "cf / (1 - (p - cv) / p)", // inverts margin ratio
  ],
  formulaKaTeX: "R^* = \\frac{CF}{1 - \\frac{cv}{p}} = \\frac{CF}{\\frac{MdC_u}{p}}",
  explanationTemplate: {
    why: "Nelle aziende multi-prodotto o nei servizi in cui è difficile contare le unità fisiche, il pareggio si calcola direttamente in termini di fatturato monetario minimo.",
    what: "Il fatturato di pareggio R* si ottiene dividendo i costi fissi totali per il margine di contribuzione percentuale m = (p - cv) / p.",
    howTemplate:
      "Margine di contribuzione unitario MdCu = {p} € − {cv} € = {p - cv} €. Rapporto di contribuzione m = ({p - cv} / {p}) = {(p - cv) / p}. R* = CF / m = {cf} € / {(p - cv) / p} = {correct}.",
    trap: "Non confondere la quantità di pareggio Q* (in pezzi) con il fatturato di pareggio R* (in euro): R* = Q* × p.",
  },
  sourceRef: "Slide Blocco VI - Break-Even in valore",
};
