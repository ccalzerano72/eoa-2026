import { ParametricTemplate } from "../types";

/**
 * Template: Grado di Leva Operativa (GLO / Degree of Operating Leverage)
 * Formula: GLO = Margine di Contribuzione Totale / Reddito Operativo = [Q * (p - cv)] / [Q * (p - cv) - CF]
 * Syllabus Block: VI (Costi e Decisioni)
 */
export const operatingLeverageTemplate: ParametricTemplate = {
  id: "B6-LEVA-OPERATIVA",
  block: 6,
  topic: "leva-operativa",
  tags: ["GLO", "leva-operativa", "rischio-operativo", "costi-fissi", "elasticita-reddito"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "",
  stemTemplate:
    "Un'azienda produce e colloca sul mercato Q = {q} unità al prezzo unitario p = {p} €, con costi variabili unitari cv = {cv} € e costi fissi di gestione CF = {cf} €. A quanto ammonta il Grado di Leva Operativa (GLO)?",
  variables: {
    q: { min: 1000, max: 5000, step: 250, decimals: 0 },
    p: { min: 60, max: 140, step: 10, decimals: 0 },
    cv: { min: 20, max: 60, step: 5, decimals: 0 },
    cf: { min: 30000, max: 120000, step: 5000, decimals: 0 },
  },
  constraints: [
    "p > cv + 15",
    "q * (p - cv) > cf + 10000",
  ],
  correctFormula: "(q * (p - cv)) / (q * (p - cv) - cf)",
  distractorFormulas: [
    "(q * (p - cv) - cf) / (q * (p - cv))", // inverted ratio
    "(q * p) / (q * (p - cv) - cf)", // total revenue instead of total contribution margin
    "(q * (p - cv)) / cf", // contribution margin over fixed costs
  ],
  formulaKaTeX: "GLO = \\frac{MdC_{tot}}{RO} = \\frac{Q \\cdot (p - cv)}{Q \\cdot (p - cv) - CF}",
  explanationTemplate: {
    why: "La leva operativa misura la sensibilità del reddito operativo alle variazioni delle vendite: maggiore è l'incidenza dei costi fissi, maggiore è il rischio ma anche l'effetto moltiplicativo sui profitti.",
    what: "Il Grado di Leva Operativa (GLO) è il rapporto tra il Margine di Contribuzione Totale e il Reddito Operativo (EBIT).",
    howTemplate:
      "MdC tot = Q × (p − cv) = {q} × ({p} € − {cv} €) = {q * (p - cv)} €. Reddito Operativo RO = MdC tot − CF = {q * (p - cv)} € − {cf} € = {q * (p - cv) - cf} €. GLO = {q * (p - cv)} / {q * (p - cv) - cf} = {correct}.",
    trap: "Non usare il fatturato al numeratore: la leva operativa rapporta il margine di contribuzione totale al reddito operativo, non i ricavi totali.",
  },
  sourceRef: "Slide Blocco VI - Struttura dei costi e Leva Operativa",
};
