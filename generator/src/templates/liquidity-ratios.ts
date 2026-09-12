import { ParametricTemplate } from "../types";

/**
 * Template: Indice di Liquidità Primaria (Quick Ratio / Acid Test)
 * Formula: Quick Ratio = (Liquidità Immediate + Liquidità Differite) / Passivo Circolante
 * Syllabus Block: V (Analisi per Indici di Liquidità)
 */
export const liquidityRatiosTemplate: ParametricTemplate = {
  id: "B5-IND-LIQUIDITA-ACID",
  block: 5,
  topic: "indici-liquidita",
  tags: ["quick-ratio", "acid-test", "liquidita-primaria", "passivo-circolante", "solvibilita"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "",
  stemTemplate:
    "I dati contabili di fine esercizio indicano: Cassa e banche c/c = {liq} €, Crediti verso clienti a breve = {cred} €, Rimanenze di magazzino = {mag} € e Debiti commerciali a breve termine = {pc} €. Qual è il valore dell'Indice di Liquidità Primaria (Quick Ratio o Acid Test)?",
  variables: {
    liq: { min: 30000, max: 150000, step: 10000, decimals: 0 },
    cred: { min: 90000, max: 300000, step: 10000, decimals: 0 },
    mag: { min: 60000, max: 250000, step: 10000, decimals: 0 },
    pc: { min: 100000, max: 350000, step: 10000, decimals: 0 },
  },
  constraints: [
    "(liq + cred) >= pc * 0.6",
    "(liq + cred) <= pc * 2.5",
  ],
  correctFormula: "(liq + cred) / pc",
  distractorFormulas: [
    "(liq + cred + mag) / pc", // Current Ratio (includes inventory)
    "(liq) / pc", // Cash Ratio only
    "(liq + cred) / (pc + mag)",
  ],
  formulaKaTeX: "\\text{Quick Ratio} = \\frac{\\text{Liquidità Immediate} + \\text{Liquidità Differite}}{\\text{Passivo Circolante}}",
  explanationTemplate: {
    why: "L'Acid Test verifica la capacità dell'azienda di estinguere i debiti a vista ed entro 12 mesi senza dover forzare la liquidazione o svendita delle scorte di magazzino.",
    what: "Il Quick Ratio (o Indice di Liquidità Primaria) esclude rigorosamente le Rimanenze di magazzino dal numeratore perché non sono liquidabili istantaneamente senza sconti o incertezze commerciali.",
    howTemplate:
      "Liquidità disponibili e differite = {liq} € + {cred} € = {liq + cred} €. Quick Ratio = ({liq} + {cred}) / {pc} = {liq + cred} / {pc} = {correct}.",
    trap: "Non includere le scorte di magazzino: se includi il magazzino stai calcolando il Current Ratio (liquidità secondaria), non il Quick Ratio (liquidità primaria).",
  },
  sourceRef: "Slide Blocco V - Indici di Liquidità / Dispensa BILANCIO",
};
