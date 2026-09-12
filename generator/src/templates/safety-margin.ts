import { ParametricTemplate } from "../types";

/**
 * Template: Margine di Sicurezza (MS%)
 * Formula: MS = (Q_eff - Q*) / Q_eff * 100
 * Syllabus Block: VI (Costi e Decisioni)
 */
export const safetyMarginTemplate: ParametricTemplate = {
  id: "B6-MARGINE-SICUREZZA",
  block: 6,
  topic: "margine-sicurezza",
  tags: ["margine-sicurezza", "rischio-operativo", "BEP", "assorbimento-costi"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "%",
  stemTemplate:
    "Un'impresa prevede un volume di vendite Q = {q} pezzi con prezzo unitario p = {p} €, costi variabili unitari cv = {cv} € e costi fissi CF = {cf} €. Di quanto possono ridursi in percentuale le vendite prima che l'impresa entri nell'area delle perdite operative (Margine di Sicurezza MS)?",
  variables: {
    q: { min: 2000, max: 8000, step: 500, decimals: 0 },
    p: { min: 50, max: 150, step: 10, decimals: 0 },
    cv: { min: 20, max: 70, step: 5, decimals: 0 },
    cf: { min: 40000, max: 140000, step: 10000, decimals: 0 },
  },
  constraints: [
    "p > cv + 15",
    "q > (cf / (p - cv)) * 1.25",
  ],
  correctFormula: "((q - (cf / (p - cv))) / q) * 100",
  distractorFormulas: [
    "((q - (cf / (p - cv))) / (cf / (p - cv))) * 100", // divides by Q* instead of Q_eff
    "((q - (cf / p)) / q) * 100", // calculates Q* by dividing by price only
    "(cf / (q * (p - cv))) * 100", // inverted capacity absorption
  ],
  formulaKaTeX: "MS = \\frac{Q_{eff} - Q^*}{Q_{eff}} \\cdot 100 = \\frac{R_{eff} - R^*}{R_{eff}} \\cdot 100",
  explanationTemplate: {
    why: "Il margine di sicurezza indica la massima contrazione percentuale di fatturato che l'impresa può sopportare prima di iniziare a produrre perdite operative.",
    what: "Rappresenta la distanza percentuale tra il volume di vendite attuale o previsto (Q) e il volume di pareggio (Q*), calcolata rispetto al volume attuale.",
    howTemplate:
      "Q* = CF / (p − cv) = {cf} € / ({p} € − {cv} €) = {cf / (p - cv)} pezzi. MS = (Q − Q*) / Q = ({q} − {cf / (p - cv)}) / {q} = {correct}.",
    trap: "Ricorda di dividere la differenza (Q − Q*) per il volume effettivo Q e non per la quantità di pareggio Q*.",
  },
  sourceRef: "Slide Blocco VI - Margine di Sicurezza",
};
