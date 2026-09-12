import { ParametricTemplate } from "../types";

/**
 * Template: Capitale Circolante Netto (CCN)
 * Formula: CCN = Attivo Circolante - Passivo Circolante
 * Syllabus Block: IV & V (Bilancio e Stato Patrimoniale Finanziario)
 */
export const workingCapitalTemplate: ParametricTemplate = {
  id: "B4-STATO-PATR-CCN",
  block: 4,
  topic: "riclassificazione-finanziaria",
  tags: ["CCN", "capitale-circolante-netto", "stato-patrimoniale", "liquidita", "equilibrio-finanziario"],
  track: "essential",
  difficulty: 2,
  type: "single-choice",
  unit: " €",
  stemTemplate:
    "Dallo Stato Patrimoniale riclassificato secondo il criterio finanziario di un'impresa emergono i seguenti valori: Liquidità immediate = {liq} €, Liquidità differite (crediti v/clienti entro 12 mesi) = {cred} €, Rimanenze di magazzino = {mag} € e Passivo Corrente (debiti esigibili entro l'anno) = {pc} €. A quanto ammonta il Capitale Circolante Netto (CCN)?",
  variables: {
    liq: { min: 20000, max: 120000, step: 10000, decimals: 0 },
    cred: { min: 80000, max: 300000, step: 10000, decimals: 0 },
    mag: { min: 50000, max: 200000, step: 10000, decimals: 0 },
    pc: { min: 100000, max: 350000, step: 10000, decimals: 0 },
  },
  constraints: [
    "liq + cred + mag > pc + 20000",
  ],
  correctFormula: "(liq + cred + mag) - pc",
  distractorFormulas: [
    "(liq + cred) - pc", // forgets inventory (quick margin)
    "(liq + cred + mag) + pc", // sums liabilities instead of subtracting
    "mag - pc", // inventory vs current liabilities
  ],
  formulaKaTeX: "CCN = AC - PC = (Liq.Imm + Liq.Diff + Rimanenze) - Passivo\\,Corrente",
  explanationTemplate: {
    why: "Il CCN misura la capacità dell'impresa di far fronte agli impegni finanziari a breve termine utilizzando le risorse correnti, senza ricorrere a nuovo indebitamento o svendita di immobilizzazioni.",
    what: "Il Capitale Circolante Netto è la differenza tra l'Attivo Circolante (somma di liquidità immediate, differite e rimanenze) e il Passivo Circolante (debiti a breve termine).",
    howTemplate:
      "Attivo Circolante AC = {liq} € + {cred} € + {mag} € = {liq + cred + mag} €. CCN = AC − PC = {liq + cred + mag} € − {pc} € = {correct}.",
    trap: "Non dimenticare le rimanenze di magazzino nel calcolo dell'Attivo Circolante complessivo: escludere le rimanenze significa calcolare il Margine di Tesoreria, non il CCN.",
  },
  sourceRef: "Dispensa BILANCIO / Slide Blocco IV & V - Riclassificazione Finanziaria",
};
