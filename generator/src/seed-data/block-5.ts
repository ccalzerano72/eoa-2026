import { Question } from "../types";

export const block5Questions: Question[] = [
  {
    id: "B5-DUPONT-001",
    version: 1,
    block: 5,
    topic: "scomposizione-dupont",
    tags: ["DuPont", "ROE", "ROI", "ROS", "asset-turnover", "leva-finanziaria"],
    track: "standard",
    difficulty: 2,
    type: "single-choice",
    stem: "Nella scomposizione piramidale di DuPont, il Return on Equity (ROE) viene analizzato come prodotto di tre determinanti fondamentali della gestione aziendale. Quali sono?",
    options: [
      {
        id: "a",
        text: "Redditività delle vendite (ROS) × Rotazione del Capitale Investito (Asset Turnover) × Leva Finanziaria (Attivo Totale / Mezzi Propri)",
        correct: true,
      },
      {
        id: "b",
        text: "EBITDA × Costo del Personale × Tasso di sconto WACC",
        correct: false,
      },
      {
        id: "c",
        text: "Margine di Contribuzione × Break-Even Point × Rimanenze di magazzino",
        correct: false,
      },
      {
        id: "d",
        text: "Fatturato Netto × Dividendi per Azione × Giorni Crediti Clienti (DSO)",
        correct: false,
      },
    ],
    explanation: {
      why: "La scomposizione di DuPont consente di diagnosticare con precisione la causa di un ROE elevato o depresso: efficienza commerciale (ROS), efficienza nell'uso degli asset (Turnover) o ricorso al debito (Leva).",
      what: "Formula di DuPont: ROE = (Utile Netto / Ricavi) × (Ricavi / Capitale Investito Netto) × (Capitale Investito Netto / Mezzi Propri). Notare che le grandezze intermedie si semplificano algebricamente lasciando Utile Netto / Mezzi Propri.",
      how: "La risposta corretta è (a): ROS (efficienza margini), Turnover (velocità degli impieghi) e Leva (struttura finanziaria).",
      trap: "Dimenticare che un ROE alto ottenuto esclusivamente gonfiando la leva finanziaria (molto debito) maschera un'azienda fragile con margini operativi mediocri.",
    },
    formula: "ROE = \\frac{RN}{V} \\cdot \\frac{V}{CI} \\cdot \\frac{CI}{PN} = ROS \\cdot Turnover \\cdot \\text{Leva}",
    sourceRef: "Slide Blocco V - Analisi per Indici / Sintesi EOA26 [a]",
  },
  {
    id: "B5-PARADOSSO-GEC-002",
    version: 1,
    block: 5,
    topic: "paradosso-growth-eats-cash",
    tags: ["growth-eats-cash", "circolante", "fabbisogno-finanziario", "de-cecco", "crisi-liquidita"],
    track: "advanced",
    difficulty: 3,
    type: "multi-choice",
    stem: "Per quale motivo un'impresa industriale o tecnologica in fase di rapida crescita di fatturato e con utili netti in aumento può andare incontro a una gravissima crisi di cassa (il paradosso 'Growth Eats Cash')?",
    options: [
      {
        id: "a",
        text: "Perché l'espansione dei ricavi richiede investimenti immediati crescenti in scorte di magazzino e dilata il volume assoluto dei crediti commerciali verso clienti non ancora incassati",
        correct: true,
      },
      {
        id: "b",
        text: "Perché il Capitale Circolante Netto Commerciale (CCN) assorbe liquidità molto prima che le vendite fatturate si trasformino in effettivi flussi di cassa monetari in banca",
        correct: true,
      },
      {
        id: "c",
        text: "Perché secondo i principi OIC la crescita delle vendite azzera automaticamente il patrimonio netto dell'impresa",
        correct: false,
      },
      {
        id: "d",
        text: "Perché se il tempo medio di incasso clienti (DSO) supera di gran lunga la dilazione concessa dai fornitori (DPO), ogni nuovo ordine richiede cassa anticipata per finanziare la produzione",
        correct: true,
      },
    ],
    explanation: {
      why: "È il tipico shock per i giovani imprenditori tecnici: credere che l'aumento degli ordini e delle vendite risolva i problemi di liquidità, quando spesso invece li accelera drasticamente.",
      what: "Quando le vendite raddoppiano, raddoppiano anche le materie prime da anticipare e i crediti da concedere ai clienti. Se il ciclo monetario è positivo (incasso a 90 gg e pagamento fornitori a 30 gg), l'impresa deve reperire cassa per finanziare il gap temporale.",
      how: "Le opzioni corrette sono (a), (b) e (d). L'opzione (c) è priva di senso contabile.",
      trap: "Confondere la redditività economica (Conto Economico positivo) con la fattibilità finanziaria (flussi di cassa del Rendiconto Finanziario).",
    },
    caseStudyRef: "De Cecco S.p.A. / Paradosso Growth Eats Cash",
    sourceRef: "VI-15-04-26-Paradosso-grows-eats-cash.md",
  },
  {
    id: "B5-LEVA-NEG-003",
    version: 1,
    block: 5,
    topic: "leva-finanziaria-negativa",
    tags: ["leva-finanziaria", "spread-negativo", "ROI-minore-di-i", "rischio-insolvenza"],
    track: "essential",
    difficulty: 2,
    type: "true-false",
    stem: "Se la redditività operativa del capitale investito (ROI) scende al di sotto del costo medio del debito bancario (i), ovvero quando lo spread (ROI - i) diventa negativo, aumentare l'indebitamento finanziario D/E produce una distruzione accelerata della redditività del capitale proprio (ROE).",
    options: [
      { id: "true", text: "Vero", correct: true },
      { id: "false", text: "Falso", correct: false },
    ],
    explanation: {
      why: "La leva finanziaria è un'arma a doppio taglio: moltiplica i guadagni quando il business rende più del costo del denaro, ma moltiplica le perdite e precipita l'insolvenza quando il ROI crolla sotto i tassi bancari.",
      what: "Dalla formula: ROE = ROI + (ROI - i) * (D/E). Se (ROI - i) < 0, il secondo termine diventa negativo. Maggiore è il debito (D/E), maggiore è la decurtazione subita dal ROE.",
      how: "L'affermazione è Vera: la leva negativa brucia il patrimonio netto degli azionisti.",
      trap: "Pensare che indebitarsi convenga sempre: conviene solo ed esclusivamente se ROI > i.",
    },
    formula: "ROE = ROI + (ROI - i) \\cdot \\frac{D}{E}",
    sourceRef: "Slide Blocco V - Indici di Redditività",
  },
];
