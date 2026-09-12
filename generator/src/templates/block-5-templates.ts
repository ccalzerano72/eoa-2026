import { ParametricTemplate, Question } from "../types";

/**
 * Template 1: Du Pont Analysis (Scomposizione del ROI in ROS x Turnover)
 * ROI = ROS * Turnover
 * ROI = (RO / Ricavi) * (Ricavi / CI)
 */
export const dupontAnalysisTemplate: ParametricTemplate = {
  id: "B5-IND-DUPONT-ANALYSIS",
  block: 5,
  topic: "indici-redditivita",
  tags: ["DuPont", "ROI", "ROS", "turnover", "redditivita-operativa"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "%",
  stemTemplate:
    "Un'impresa commerciale consegue un Return on Sales (ROS) pari al {ros}% su un volume di vendite annue pari a {ricavi} M€. Il Capitale Investito operativo netto (CI) necessario per generare tale fatturato è pari a {ci} M€. Qual è il Return on Investment (ROI) dell'impresa?",
  variables: {
    ros: { min: 4, max: 12, step: 0.5, unit: "%", decimals: 1 },
    ricavi: { min: 20, max: 80, step: 5, unit: "M€", decimals: 0 },
    ci: { min: 10, max: 50, step: 2, unit: "M€", decimals: 0 },
  },
  correctFormula: "ros * (ricavi / ci)",
  distractorFormulas: [
    "ros * (ci / ricavi)", // inverted turnover
    "ros + (ricavi / ci)", // added instead of multiplied
    "(ros / 100) * ricavi", // gives RO in M€, not ROI %
  ],
  formulaKaTeX:
    "ROI = ROS \\cdot \\text{Turnover} = \\frac{RO}{\\text{Ricavi}} \\cdot \\frac{\\text{Ricavi}}{CI} = \\frac{RO}{CI}",
  explanationTemplate: {
    why: "La formula di Du Pont dimostra che il rendimento della gestione operativa dipende sia dalla marginalità commerciale sulle vendite (ROS) sia dalla velocità di rotazione del capitale investito (Turnover).",
    what: "Un'impresa può ottenere un elevato ROI con margini alti e rotazione lenta (alta gamma/lusso) oppure con margini ridotti e rotazione rapidissima (grande distribuzione/GDO).",
    howTemplate:
      "Tasso di rotazione del CI (Turnover) = {ricavi} M€ / {ci} M€ = {(ricavi_raw / ci_raw).toFixed(2)}. ROI = {ros}% × {(ricavi_raw / ci_raw).toFixed(2)} = {correct}%.",
    trap: "Attenzione a non sommare ROS e Turnover: la relazione Du Pont è strettamente moltiplicativa.",
  },
  sourceRef: "Slide Blocco V - Analisi della Redditività: Modello Du Pont",
};

/**
 * Template 2: Times Interest Earned / Debt Coverage (Copertura degli Oneri Finanziari)
 * TIE = RO / Oneri Finanziari
 */
export const debtCoverageTemplate: ParametricTemplate = {
  id: "B5-IND-COPERTURA-ONERI",
  block: 5,
  topic: "struttura-finanziaria",
  tags: ["solidita", "oneri-finanziari", "TIE", "rischio-default"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "volte",
  stemTemplate:
    "Un'azienda presenta un Conto Economico con Ricavi di vendita pari a {ricavi} M€, un Reddito Operativo (EBIT) pari a {ro} M€ e sostiene Oneri Finanziari annui sul debito bancario pari a {of} M€. Qual è il grado di copertura degli oneri finanziari (Times Interest Earned - TIE)?",
  variables: {
    ricavi: { min: 15, max: 60, step: 5, unit: "M€", decimals: 0 },
    ro: { min: 2, max: 10, step: 0.5, unit: "M€", decimals: 1 },
    of: { min: 0.4, max: 2.0, step: 0.2, unit: "M€", decimals: 1 },
  },
  constraints: ["ro > of"],
  correctFormula: "ro / of",
  distractorFormulas: ["ricavi / of", "ro / (ro + of)", "(ro - of) / of"],
  formulaKaTeX:
    "\\text{TIE} = \\frac{\\text{Reddito Operativo (RO)}}{\\text{Oneri Finanziari (OF)}}",
  explanationTemplate: {
    why: "Il TIE misura la sostenibilità del debito: indica quante volte il reddito operativo dell'azienda è in grado di coprire gli interessi passivi dovuti agli istituti di credito.",
    what: "Un indice TIE > 3-4 volte è generalmente considerato di sicurezza dalle banche. Se TIE < 1, la gestione caratteristica non genera nemmeno le risorse per pagare gli interessi.",
    howTemplate: "TIE = {ro} M€ / {of} M€ = {correct} volte.",
    trap: "Utilizzare il Reddito Operativo (RO / EBIT) e non i Ricavi totali o l'Utile Netto (che è già al netto degli interessi e delle tasse).",
  },
  sourceRef: "Slide Blocco V - Indici di Solidità e Rischio Finanziario",
};

/**
 * Template 3: Structure Margin and Fixed Asset Coverage (Margine di Struttura)
 * Margine di Struttura = PN - Attivo Fisso Netto (AFN)
 * Quoziente = PN / AFN
 */
export const structureMarginTemplate: ParametricTemplate = {
  id: "B5-IND-MARGINE-STRUTTURA",
  block: 5,
  topic: "struttura-finanziaria",
  tags: [
    "margine-struttura",
    "solidita",
    "patrimonio-netto",
    "immobilizzazioni",
  ],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "k€",
  stemTemplate:
    "Dallo Stato Patrimoniale riclassificato di una software company si rilevano: Patrimonio Netto pari a {pn} k€, Debiti a medio-lungo termine pari a {pml} k€ e Immobilizzazioni Nette (Attivo Fisso Netto) pari a {afn} k€. Qual è il Margine di Struttura Primario dell'impresa?",
  variables: {
    pn: { min: 400, max: 1200, step: 50, unit: "k€", decimals: 0 },
    pml: { min: 200, max: 600, step: 50, unit: "k€", decimals: 0 },
    afn: { min: 300, max: 900, step: 50, unit: "k€", decimals: 0 },
  },
  correctFormula: "pn - afn",
  distractorFormulas: [
    "pn + pml - afn", // Margine di struttura secondario (copertura globale)
    "afn - pn", // inverted sign
    "pn - pml",
  ],
  formulaKaTeX:
    "\\text{Margine di Struttura Primario} = \\text{Patrimonio Netto (PN)} - \\text{Attivo Fisso Netto (AFN)}",
  explanationTemplate: {
    why: "Verificare l'equilibrio strutturale tra fonti a lungo termine e impieghi durevoli: le immobilizzazioni devono essere coperte da risorse finanziarie che non scadono nel breve periodo.",
    what: "Il Margine di Struttura Primario confronta il PN con l'AFN. Se positivo, il capitale proprio copre interamente le immobilizzazioni e finanzia anche parte del circolante.",
    howTemplate: "Margine di Struttura = {pn} k€ − {afn} k€ = {correct} k€.",
    trap: "Non confondere il Margine Primario (solo PN - AFN) con il Margine Secondario o Globale ((PN + Passività Consolidate) - AFN).",
  },
  sourceRef: "Slide Blocco V - Equilibrio Strutturale e Margini Patrimoniali",
};

export const block5Templates = [
  dupontAnalysisTemplate,
  debtCoverageTemplate,
  structureMarginTemplate,
];

/**
 * Combinatorial question generator for Blocco 5
 */
export function generateBlock5CombinatorialQuestions(): Question[] {
  const questions: Question[] = [];

  const ratioConcepts = [
    {
      concept: "Effetto Leva Finanziaria e Spread (ROI - i)",
      trueStatement:
        "La leva finanziaria ha effetto positivo sul ROE solo se la redditività del capitale investito (ROI) supera il costo medio del debito (i); se ROI < i, aumentare l'indebitamento distrugge redditività e riduce drasticamente il ROE.",
      falseStatement:
        "Indebitarsi conviene sempre e comunque, poiché gli interessi passivi possono essere dedotti dalle tasse garantendo un ROE infinito a costo zero.",
      why: "Evitare decisioni finanziarie rovinose basate sull'illusione che più debito significhi sempre più ricchezza.",
      what: "Formula: ROE = ROI + (ROI - i) * (D/E). Lo spread (ROI - i) è il motore della leva.",
      how: "Se ROI > i la leva è moltiplicativa positiva; se ROI < i la leva diventa una pericolosa trappola moltiplicativa negativa.",
      trap: "Un ROE elevato conseguito con D/E molto alto nasconde un rischio di fallimento elevatissimo al minimo calo congiunturale del ROI.",
    },
    {
      concept: "Current Ratio vs Quick Ratio (Acid Test)",
      trueStatement:
        "Il Quick Ratio esclude le rimanenze di magazzino dalle attività correnti, misurando la capacità dell'impresa di far fronte ai debiti a breve termine unicamente con le disponibilità liquide immediate e differite.",
      falseStatement:
        "Il Quick Ratio include le rimanenze di magazzino e le immobilizzazioni materiali tra le attività a pronta liquidità.",
      why: "Valutare la qualità effettiva della solvibilità a breve termine senza contare su scorte che potrebbero essere invendute o obsolete.",
      what: "Current Ratio = AC / PC; Quick Ratio = (Liquidità Immediate + Differite) / PC.",
      how: "Rimanenze = componente più incerta e lenta da convertire in moneta sonante.",
      trap: "Un'azienda con un Current Ratio elevato (es. 2.5) può comunque fallire se il 90% dell'attivo corrente è costituito da magazzino invenduto.",
    },
    {
      concept: "Ciclo di Conversione del Circolante (CCC)",
      trueStatement:
        "Il Cash Conversion Cycle misura il tempo che intercorre tra l'esborso monetario per l'acquisto dei fattori produttivi e l'incasso dei crediti dai clienti (CCC = DIO + DSO - DPO); un CCC negativo significa che l'impresa si autofinanzia grazie ai propri fornitori.",
      falseStatement:
        "Avere un ciclo di conversione del circolante di 180 giorni è il segno infallibile di un'eccellente efficienza finanziaria e di abbondanza di cassa.",
      why: "Ottimizzare la gestione operativa della tesoreria e del capitale circolante commerciale.",
      what: "DIO = giorni scorte; DSO = giorni incasso clienti; DPO = giorni pagamento fornitori.",
      how: "Ridurre DSO e DIO aumentando DPO riduce il fabbisogno di finanziamento bancario.",
      trap: "Modelli come Amazon o Dell operano con CCC negativo (incassano subito online dai clienti prima di pagare i fornitori a 60-90 giorni).",
    },
    {
      concept:
        "ROE vs ROI (Redditività dei Mezzi Propri vs Gestione Operativa)",
      trueStatement:
        "Il ROI misura l'efficienza economica della gestione operativa e industriale prescindendo dalla struttura finanziaria e dalle imposte; il ROE misura il rendimento netto spettante agli azionisti per il capitale di rischio conferito.",
      falseStatement:
        "Il ROI e il ROE sono lo stesso identico indice, calcolati entrambi dividendo l'utile netto per il capitale sociale.",
      why: "Distinguere l'efficacia del business industriale dalle scelte di finanziamento e fiscali.",
      what: "ROI = RO / CI (investimento totale); ROE = Utile Netto / Patrimonio Netto (capitale proprio).",
      how: "Un manager di stabilimento viene valutato sul ROI; l'assemblea degli azionisti valuta il top management sul ROE.",
      trap: "Un'impresa con ottimo ROI può avere ROE misero per colpa di un debito bancario insostenibile o tassazione straordinaria.",
    },
    {
      concept: "Rotazione del Capitale Investito (Capital Turnover)",
      trueStatement:
        "Il Capital Turnover (Ricavi / Capitale Investito) esprime quanti euro di fatturato l'impresa riesce a generare per ogni euro di capitale impiegato negli asset aziendali.",
      falseStatement:
        "Il Turnover del capitale investito indica il numero di volte in cui i dipendenti cambiano mansione durante l'anno.",
      why: "Comprendere che la produttività degli impieghi è fondamentale tanto quanto il margine percentuale sui ricavi.",
      what: "Metrica di efficienza nell'utilizzo delle risorse patrimoniali d'impresa.",
      how: "A parità di margine percentuale (ROS), raddoppiare il Turnover raddoppia il ROI.",
      trap: "Spesso gli ingegneri guardano solo al margine unitario sul prodotto, trascurando la quantità di capitale immobilizzato necessaria per produrlo.",
    },
  ];

  let counter = 1;
  for (let round = 1; round <= 25; round++) {
    for (const r of ratioConcepts) {
      const isTrueQ = (round + counter) % 2 === 0;
      // 1. True/False
      questions.push({
        id: `B5-COMB-TF-${String(counter).padStart(4, "0")}`,
        version: 1,
        block: 5,
        topic: "indici-bilancio-equilibri",
        tags: [
          "indici",
          "redditivita",
          "liquidita",
          "solidita",
          "leva-finanziaria",
        ],
        track: "essential",
        difficulty: 1,
        type: "true-false",
        stem: `Valuta la seguente affermazione su "${r.concept}":\n\n«${isTrueQ ? r.trueStatement : r.falseStatement}»`,
        options: [
          { id: "a", text: "Vero", correct: isTrueQ },
          { id: "b", text: "Falso", correct: !isTrueQ },
        ],
        explanation: {
          why: r.why,
          what: r.what,
          how: isTrueQ
            ? `VERO. ${r.how}`
            : `FALSO. Versione corretta: ${r.trueStatement}`,
          trap: r.trap,
        },
        sourceRef: "Slide Blocco V - Analisi di Bilancio per Indici",
      });
      counter++;

      // 2. Single-choice
      questions.push({
        id: `B5-COMB-SC-${String(counter).padStart(4, "0")}`,
        version: 1,
        block: 5,
        topic: "diagnosi-indici",
        tags: ["indici", "analisi-finanziaria", "benchmark"],
        track: "standard",
        difficulty: 2,
        type: "single-choice",
        stem: `In sede di analisi finanziaria e patrimoniale, quale principio governa correttamente "${r.concept}"? (Variante #${round})`,
        options: [
          { id: "a", text: r.trueStatement, correct: true },
          { id: "b", text: r.falseStatement, correct: false },
          {
            id: "c",
            text: "Il livello dei tassi d'interesse bancari è del tutto irrilevante per la convenienza dell'indebitamento.",
            correct: false,
          },
          {
            id: "d",
            text: "Tutti gli indici di liquidità devono essere calcolati escludendo sempre i debiti verso fornitori.",
            correct: false,
          },
        ].sort(() => Math.random() - 0.5),
        explanation: {
          why: r.why,
          what: r.what,
          how: `Risposta corretta: ${r.trueStatement}`,
          trap: r.trap,
        },
        sourceRef: "EOA 2026 - Analisi per Indici",
      });
      counter++;

      // 3. Multi-True-False
      if (round % 2 === 0) {
        questions.push({
          id: `B5-COMB-MTF-${String(counter).padStart(4, "0")}`,
          version: 1,
          block: 5,
          topic: "diagnosi-finanziaria-avanzata",
          tags: ["multi-tf", "indici", "redditivita-solidita"],
          track: "advanced",
          difficulty: 3,
          type: "multi-true-false",
          stem: `In merito a "${r.concept}" e alla valutazione dell'equilibrio aziendale (Scenario #${round}), indica se ciascuna affermazione è Vera o Falsa:`,
          multiTrueFalseItems: [
            { id: "item-1", statement: r.trueStatement, isTrue: true },
            { id: "item-2", statement: r.falseStatement, isTrue: false },
            {
              id: "item-3",
              statement:
                "Un CCN positivo (AC > PC) è generalmente condizione necessaria per garantire l'equilibrio finanziario a breve termine.",
              isTrue: true,
            },
            {
              id: "item-4",
              statement:
                "Il ROS (Return on Sales) aumenta necessariamente all'aumentare dei debiti finanziari a lungo termine.",
              isTrue: false,
            },
          ],
          explanation: {
            why: r.why,
            what: r.what,
            how: "Item 1: VERO. Item 2: FALSO. Item 3: VERO (attivo corrente superiore alle passività a breve). Item 4: FALSO (il ROS riguarda il reddito operativo prima degli interessi del debito).",
            trap: r.trap,
          },
          sourceRef: "Guida EOA 2026 / Slide Blocco V",
        });
        counter++;
      }
    }
  }

  return questions;
}
