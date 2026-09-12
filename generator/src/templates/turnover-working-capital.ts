import { ParametricTemplate } from "../types";

/**
 * Template: Ciclo del Circolante / Cash Conversion Cycle (CCC)
 * Formula: CCC = DIO (giorni scorte) + DSO (giorni clienti) - DPO (giorni fornitori)
 * Syllabus Block: V (Analisi per Indici / Gestione del Circolante e Liquidità)
 */
export const turnoverWorkingCapitalTemplate: ParametricTemplate = {
  id: "B5-IND-CICLO-CIRCOLANTE",
  block: 5,
  topic: "ciclo-circolante",
  tags: ["ciclo-circolante", "cash-conversion-cycle", "DSO", "DPO", "DIO", "growth-eats-cash"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: " giorni",
  stemTemplate:
    "Un'azienda manifatturiera presenta una giacenza media delle scorte di magazzino DIO = {dio} giorni, un tempo medio di incasso dei crediti commerciali dai clienti DSO = {dso} giorni e un tempo medio di pagamento dei debiti commerciali ai fornitori DPO = {dpo} giorni. A quanto ammonta la durata del Ciclo Commerciale del Capitale Circolante (Cash Conversion Cycle)?",
  variables: {
    dio: { min: 30, max: 90, step: 5, decimals: 0 },
    dso: { min: 45, max: 120, step: 5, decimals: 0 },
    dpo: { min: 30, max: 90, step: 5, decimals: 0 },
  },
  constraints: [
    "dio + dso > dpo + 10",
  ],
  correctFormula: "dio + dso - dpo",
  distractorFormulas: [
    "dio + dso + dpo", // sums supplier delay instead of subtracting
    "dso - dpo", // forgets inventory period
    "dio + dpo - dso", // inverts customer and supplier timing
  ],
  formulaKaTeX: "\\text{Ciclo Circolante (CCC)} = \\text{DIO} + \\text{DSO} - \\text{DPO}",
  explanationTemplate: {
    why: "Il ciclo monetario del capitale circolante misura l'intervallo temporale tra l'uscita di cassa per l'acquisto dei fattori produttivi e l'entrata monetaria dalla vendita: più è lungo, maggiore è il fabbisogno di cassa che assorbe la crescita aziendale (paradosso 'growth eats cash').",
    what: "Il ciclo si calcola sommando i giorni di permanenza delle scorte (DIO) ai tempi di incasso dai clienti (DSO), e sottraendo la dilazione concessa dai fornitori (DPO).",
    howTemplate:
      "CCC = DIO + DSO − DPO = {dio} gg + {dso} gg − {dpo} gg = {dio + dso} gg − {dpo} gg = {correct}.",
    trap: "I giorni fornitori (DPO) rappresentano una fonte spontanea di finanziamento e vanno sottratti, mai sommati: pagare più tardi i fornitori riduce la durata del fabbisogno di cassa.",
  },
  sourceRef: "Slide Blocco V & VI - Gestione del Capitale Circolante / Dispensa BILANCIO",
};
