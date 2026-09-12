import type { SyllabusBlock } from "../types/question";

/**
 * Maps generator-side topic slugs (questions + formulas) to StudyBlock
 * theory topic ids (`topic-{id}` anchors in StudyBlockViewer).
 *
 * Background: question/formula topics use generator slugs
 * (e.g. "break-even-analysis") while theory pages use didactic ids
 * (e.g. "break-even-point-analisi-pareggio"), so naive pass-through
 * scrolls nowhere. `resolveStudyTopic` bridges the two worlds.
 *
 * Convention:
 * - Exact id match wins (seed questions already use theory ids).
 * - Otherwise the explicit override table below applies.
 * - Otherwise `undefined` → caller opens the block landing page
 *   (honest fallback, never a dead anchor).
 */

export const THEORY_TOPICS: Record<SyllabusBlock, string[]> = {
  1: [
    "fondamenti-economia-e-paradigma",
    "definizione-impresa-azienda-flussi",
    "soggetti-aziendali-governance-stakeholder",
    "management-funzioni-imprenditore-vs-manager",
    "complicato-vs-complesso",
    "tradeoff-e-costo-opportunita",
    "economia-comportamentale-e-bias-cognitivi",
    "casi-studio-blocco-1",
  ],
  2: [
    "autonomia-patrimoniale-e-personalita-giuridica",
    "impresa-individuale",
    "societa-di-persone",
    "societa-di-capitali",
    "startup-innovativa-e-societa-benefit",
    "spettro-degli-scopi-ed-economia-civile",
  ],
  3: [
    "strumenti-finanziari-equity-vs-debito",
    "modelli-governance",
    "conflitto-di-agenzia-e-parmalat",
    "filiera-finanziamento-startup-e-venture-capital",
    "clausole-term-sheet-e-patti-parasociali",
    "operazioni-straordinarie",
    "caso-cyberpeak-startup-scaleup",
  ],
  4: [
    "modello-valore-vs-contabile-e-metafora-diga",
    "i-4-documenti-civilistici-e-clausola-generale",
    "principi-di-redazione-del-bilancio",
    "ratei-risconti-ammortamento-e-magazzino",
    "schemi-civilistici-e-struttura-scalare-ce",
  ],
  5: [
    "riclassificazione-finanziaria-e-margini-sp",
    "indici-liquidita-e-solvibilita",
    "indici-redditivita-du-pont-e-leva-finanziaria",
    "dinamica-finanziaria-e-paradosso-growth-eats-cash",
  ],
  6: [
    "classificazione-costi-e-comportamento",
    "costi-prodotto-vs-periodo-e-inventariabilita",
    "matrice-speciali-comuni-diretti-indiretti",
    "direct-costing-vs-full-costing-e-mdc",
    "break-even-point-analisi-pareggio",
    "leva-operativa-e-margine-sicurezza",
    "decisioni-di-breve-termine-costi-rilevanti",
    "configurazioni-di-costo",
    "activity-based-costing",
  ],
  7: [
    "definizione-modello-di-business",
    "i-9-blocchi-del-canvas",
    "strategie-competitive-di-porter",
    "modelli-digitali-revenue-e-piattaforme",
    "modelli-di-business-aperti",
  ],
};

/** Generator slug → theory topic id, keyed as `${block}:${slug}`. */
export const TOPIC_OVERRIDES: Record<string, string> = {
  // ---- Blocco 1 ----
  "1:efficienza-produttivita": "fondamenti-economia-e-paradigma",
  "1:paradigmi-fondanti": "fondamenti-economia-e-paradigma",
  "1:sistemi-complessi-decisioni": "complicato-vs-complesso",
  "1:costo-opportunita": "tradeoff-e-costo-opportunita",
  "1:confronto-paradigmi": "management-funzioni-imprenditore-vs-manager",
  "1:definizione-impresa": "definizione-impresa-azienda-flussi",
  "1:impresa-sistema-complesso": "definizione-impresa-azienda-flussi",
  "1:trade-off-costo-opportunita": "tradeoff-e-costo-opportunita",
  "1:tradeoff-costo-opportunita": "tradeoff-e-costo-opportunita",
  "1:caso-olivetti": "casi-studio-blocco-1",
  "1:stakeholder-theory": "soggetti-aziendali-governance-stakeholder",
  // ---- Blocco 2 (strategy slugs have no theory home → block landing) ----
  "2:forme-giuridiche-autonomia":
    "autonomia-patrimoniale-e-personalita-giuridica",
  "2:societa-accomandita": "societa-di-persone",
  "2:startup-innovativa": "startup-innovativa-e-societa-benefit",
  "2:societa-benefit-bcorp": "startup-innovativa-e-societa-benefit",
  "2:capitale-sociale-minimo": "societa-di-capitali",
  "2:societa-persone-capitali":
    "autonomia-patrimoniale-e-personalita-giuridica",
  "2:sas-accomandante": "societa-di-persone",
  // ---- Blocco 3 ----
  "3:governance-startup-funding":
    "filiera-finanziamento-startup-e-venture-capital",
  "3:teoria-agenzia": "conflitto-di-agenzia-e-parmalat",
  "3:finanziamento-startup":
    "filiera-finanziamento-startup-e-venture-capital",
  "3:equity-vs-debito": "strumenti-finanziari-equity-vs-debito",
  "3:patti-parasociali-clausole": "clausole-term-sheet-e-patti-parasociali",
  "3:venture-capital-carried":
    "filiera-finanziamento-startup-e-venture-capital",
  // ---- Blocco 4 ----
  "4:principio-competenza": "ratei-risconti-ammortamento-e-magazzino",
  "4:principi-redazione-bilancio": "principi-di-redazione-del-bilancio",
  "4:riclassificazione-finanziaria":
    "schemi-civilistici-e-struttura-scalare-ce",
  "4:riclassificazione-conto-economico":
    "schemi-civilistici-e-struttura-scalare-ce",
  "4:principi-bilancio": "principi-di-redazione-del-bilancio",
  "4:interpretazione-bilancio": "modello-valore-vs-contabile-e-metafora-diga",
  "4:riclassificazione-stato-patrimoniale":
    "schemi-civilistici-e-struttura-scalare-ce",
  "4:ebitda-ebit-riclassificazione":
    "schemi-civilistici-e-struttura-scalare-ce",
  "4:ratei-e-risconti": "ratei-risconti-ammortamento-e-magazzino",
  "4:magazzino-fifo-lifo": "ratei-risconti-ammortamento-e-magazzino",
  // ---- Blocco 5 ----
  "5:indici-redditivita": "indici-redditivita-du-pont-e-leva-finanziaria",
  "5:struttura-finanziaria": "riclassificazione-finanziaria-e-margini-sp",
  "5:indici-liquidita": "indici-liquidita-e-solvibilita",
  "5:ciclo-circolante": "dinamica-finanziaria-e-paradosso-growth-eats-cash",
  "5:capitale-circolante":
    "dinamica-finanziaria-e-paradosso-growth-eats-cash",
  "5:indici-bilancio-equilibri": "riclassificazione-finanziaria-e-margini-sp",
  "5:scomposizione-dupont": "indici-redditivita-du-pont-e-leva-finanziaria",
  "5:paradosso-growth-eats-cash":
    "dinamica-finanziaria-e-paradosso-growth-eats-cash",
  "5:leva-finanziaria-negativa":
    "indici-redditivita-du-pont-e-leva-finanziaria",
  "5:leva-finanziaria-spread":
    "indici-redditivita-du-pont-e-leva-finanziaria",
  // ---- Blocco 6 ----
  "6:decisioni-breve-periodo": "decisioni-di-breve-termine-costi-rilevanti",
  "6:break-even-analysis": "break-even-point-analisi-pareggio",
  "6:bep-analisi": "break-even-point-analisi-pareggio",
  "6:bep-formula": "break-even-point-analisi-pareggio",
  "6:leva-operativa": "leva-operativa-e-margine-sicurezza",
  "6:margine-sicurezza": "leva-operativa-e-margine-sicurezza",
  "6:controllo-gestione-decisioni":
    "decisioni-di-breve-termine-costi-rilevanti",
  "6:decisioni-costi-margini": "direct-costing-vs-full-costing-e-mdc",
  "6:make-or-buy": "decisioni-di-breve-termine-costi-rilevanti",
  "6:margine-contribuzione-livelli": "direct-costing-vs-full-costing-e-mdc",
  "6:classificazione-costi": "classificazione-costi-e-comportamento",
  // ---- Blocco 7 ----
  "7:business-model-metrics": "modelli-digitali-revenue-e-piattaforme",
  "7:business-model-canvas": "i-9-blocchi-del-canvas",
  "7:caso-nokia-piattaforma": "modelli-digitali-revenue-e-piattaforme",
  "7:archetipi-business-model": "definizione-modello-di-business",
  "7:caso-antico-vinaio": "definizione-modello-di-business",
  "7:strategie-porter": "strategie-competitive-di-porter",
  "7:modelli-digitali": "modelli-digitali-revenue-e-piattaforme",
};

/**
 * Resolve a generator-side topic slug to a theory topic id for deep-linking.
 * Returns `undefined` when the slug has no theory home — callers must then
 * open the block landing page instead of a dead anchor.
 */
export function resolveStudyTopic(
  block: SyllabusBlock,
  topic: string | undefined,
): string | undefined {
  if (!topic) return undefined;
  if (THEORY_TOPICS[block]?.includes(topic)) return topic;
  const mapped = TOPIC_OVERRIDES[`${block}:${topic}`];
  if (mapped && THEORY_TOPICS[block]?.includes(mapped)) return mapped;
  return undefined;
}
