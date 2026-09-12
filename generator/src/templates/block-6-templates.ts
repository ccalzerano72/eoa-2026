import { ParametricTemplate, Question } from "../types";

/**
 * Template 1: Make or Buy - Break-even Indifference Point
 * CF_indotto + cv_int * Q = p_forn * Q
 * Q_indiff = CF_indotto / (p_forn - cv_int)
 */
export const makeOrBuyTemplate: ParametricTemplate = {
  id: "B6-DEC-MAKE-OR-BUY",
  block: 6,
  topic: "decisioni-breve-periodo",
  tags: [
    "make-or-buy",
    "punto-indifferenza",
    "costi-differenziali",
    "esternalizzazione",
  ],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "unità",
  stemTemplate:
    "Un'azienda manifatturiera deve decidere se continuare a produrre internamente un componente elettronico (Make) o esternalizzarlo acquistandolo da un fornitore (Buy). Produrre internamente comporta costi fissi specifici dedicati pari a {cfSpecifici} €/anno e un costo variabile unitario pari a {cvInt} €/pezzo. Il fornitore esterno offre il componente a un prezzo di fornitura di {pForn} €/pezzo. Al di sopra di quale volume annuo di produzione (quantità di indifferenza) la produzione interna (Make) risulta economicamente più conveniente?",
  variables: {
    cfSpecifici: {
      min: 30000,
      max: 120000,
      step: 10000,
      unit: "€",
      decimals: 0,
    },
    cvInt: { min: 10, max: 35, step: 5, unit: "€", decimals: 0 },
    pForn: { min: 40, max: 70, step: 5, unit: "€", decimals: 0 },
  },
  constraints: ["pForn > cvInt"],
  correctFormula: "cfSpecifici / (pForn - cvInt)",
  distractorFormulas: [
    "cfSpecifici / pForn", // forgot variable costs
    "cfSpecifici / cvInt", // forgot supplier price
    "cfSpecifici / (pForn + cvInt)", // added instead of subtracted
  ],
  formulaKaTeX:
    "Q_{\\text{indifferenza}} = \\frac{\\text{CF}_{\\text{specifici}}}{p_{\\text{fornitore}} - cv_{\\text{interno}}}",
  explanationTemplate: {
    why: "La decisione Make or Buy richiede di confrontare i costi rilevanti differenziali: esternalizzare elimina i costi fissi specifici ed evita investimenti dedicati, ma comporta un costo variabile unitario di acquisto più elevato.",
    what: "Il punto di indifferenza è il volume in cui il Costo Totale del Make eguaglia il Costo Totale del Buy. Oltre tale soglia, il risparmio sui costi variabili interni ammortizza i costi fissi dedicati rendendo conveniente il Make.",
    howTemplate:
      "Risparmio unitario interno = {pForn} € − {cvInt} € = {pForn_raw - cvInt_raw} €/unità. Q* = {cfSpecifici} € / {pForn_raw - cvInt_raw} € = {correct} unità.",
    trap: "Nelle decisioni di make or buy vanno considerati solo i costi fissi ELIMINABILI (specifici) e non le quote di costi fissi generali comuni che l'azienda continuerebbe a sostenere in ogni caso.",
  },
  sourceRef: "Slide Blocco VI - Decisioni di Breve Periodo: Make or Buy",
};

/**
 * Template 2: Special Order Acceptance with Spare Capacity (Ordine Speciale)
 * Margine Differenziale = (p_speciale - cv) * Q_speciale
 */
export const specialOrderTemplate: ParametricTemplate = {
  id: "B6-DEC-ORDINE-SPECIALE",
  block: 6,
  topic: "decisioni-breve-periodo",
  tags: [
    "ordine-speciale",
    "capacita-residua",
    "costi-rilevanti",
    "prezzo-differenziale",
  ],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "€",
  stemTemplate:
    "Un'azienda informatica che produce schede elettroniche ha una capacità produttiva residua inutilizzata di 5.000 unità. Riceve una proposta di ordine speciale da un nuovo cliente per {qSpeciale} unità a un prezzo di offerta eccezionale di {pOfferto} €/unità (inferiore al prezzo di listino normale di 150 €). I costi dell'azienda per unità sono: costi variabili di produzione {cv} €/unità, costi fissi aziendali allocati 40 €/unità. Qual è l'impatto economico complessivo sul Reddito Operativo derivante dall'accettazione dell'ordine speciale?",
  variables: {
    qSpeciale: { min: 1000, max: 4000, step: 500, unit: "unità", decimals: 0 },
    pOfferto: { min: 85, max: 120, step: 5, unit: "€", decimals: 0 },
    cv: { min: 50, max: 75, step: 5, unit: "€", decimals: 0 },
  },
  constraints: ["pOfferto > cv"],
  correctFormula: "(pOfferto - cv) * qSpeciale",
  distractorFormulas: [
    "(pOfferto - cv - 40) * qSpeciale", // common mistake: including allocated fixed costs
    "(150 - pOfferto) * qSpeciale", // lost revenue vs list price
    "(pOfferto - cv) * 5000", // using full spare capacity
  ],
  formulaKaTeX:
    "\\Delta RO = (p_{\\text{speciale}} - cv) \\cdot Q_{\\text{speciale}}",
  explanationTemplate: {
    why: "In presenza di capacità produttiva inutilizzata e senza effetti di cannibalizzazione sul mercato ordinario, accettare un ordine a prezzo ridotto conviene purché il prezzo copra i costi variabili incrementali (MdC unitario > 0).",
    what: "I costi fissi allocati non variano e sono irrilevanti per la decisione incrementale di breve termine.",
    howTemplate:
      "Margine di contribuzione unitario = {pOfferto} € − {cv} € = {pOfferto_raw - cv_raw} €/pezzo. Incremento Reddito Operativo = {pOfferto_raw - cv_raw} €/pezzo × {qSpeciale} pezzi = +{correct} €.",
    trap: "TRAPPOLA DEGLI INGEGNERI: Dedurre i 40 € di costi fissi unitari allocati e rifiutare l'ordine credendo di vendere 'sottocosto'. I costi fissi esistono già e rimangono invariati!",
  },
  sourceRef: "Slide Blocco VI - Decisioni di Breve Termine: Ordini Speciali",
};

/**
 * Template 3: Optimal Product Mix with Bottleneck Resource (Mix con Risorsa Scarsa)
 * MdC per unità di risorsa scarsa = (p - cv) / ore_macchina
 */
export const scarceResourceMixTemplate: ParametricTemplate = {
  id: "B6-DEC-RISORSA-SCARSA",
  block: 6,
  topic: "decisioni-breve-periodo",
  tags: ["mix-produttivo", "risorsa-scarsa", "collo-bottiglia", "MdC-orario"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "€/ora",
  stemTemplate:
    "Un'azienda produce due modelli di server: Modello A con prezzo {pA} € e costo variabile {cvA} € che richiede {hA} ore di collaudo specialistico; Modello B con prezzo {pB} € e costo variabile {cvB} € che richiede {hB} ore di collaudo. Se la disponibilità di ore del banco collaudo è il fattore scarso vincolante, qual è il Margine di Contribuzione orario per unità di risorsa scarsa del Modello A?",
  variables: {
    pA: { min: 400, max: 800, step: 50, unit: "€", decimals: 0 },
    cvA: { min: 200, max: 500, step: 50, unit: "€", decimals: 0 },
    hA: { min: 2, max: 5, step: 1, unit: "ore", decimals: 0 },
    pB: { min: 600, max: 1200, step: 50, unit: "€", decimals: 0 },
    cvB: { min: 300, max: 800, step: 50, unit: "€", decimals: 0 },
    hB: { min: 3, max: 6, step: 1, unit: "ore", decimals: 0 },
  },
  constraints: ["pA > cvA", "pB > cvB"],
  correctFormula: "(pA - cvA) / hA",
  distractorFormulas: [
    "pA - cvA", // absolute MdC, not per hour
    "(pB - cvB) / hB", // Model B ratio
    "pA / hA", // forgot variable costs
  ],
  formulaKaTeX:
    "\\text{MdC}_{\\text{risorsa scarsa}} = \\frac{p - cv}{\\text{Ore macchina o lavoro richieste}}",
  explanationTemplate: {
    why: "Quando la capacità produttiva è limitata da un collo di bottiglia, non si deve privilegiare il prodotto con il margine unitario assoluto più alto, bensì quello che massimizza il margine generato per ogni ora di risorsa scarsa consumata.",
    what: "Il criterio di ottimo economico massimizza il Rendimento Orario del fattore scarso: MdC_unitario / fabbisogno_fattore.",
    howTemplate:
      "MdC unitario A = {pA} € − {cvA} € = {pA_raw - cvA_raw} €. MdC per ora di collaudo = {pA_raw - cvA_raw} € / {hA} ore = {correct} €/ora.",
    trap: "Privilegiare il prodotto con prezzo o MdC assoluto più alto porta a saturare il collo di bottiglia con prodotti lenti, distruggendo il profitto orario complessivo.",
  },
  sourceRef:
    "Slide Blocco VI - Ottimizzazione del Mix di Produzione con Vincoli",
};

export const block6Templates = [
  makeOrBuyTemplate,
  specialOrderTemplate,
  scarceResourceMixTemplate,
];

/**
 * Combinatorial question generator for Blocco 6
 */
export function generateBlock6CombinatorialQuestions(): Question[] {
  const questions: Question[] = [];

  const costConcepts = [
    {
      concept: "Comportamento dei Costi Fissi al variare dei volumi",
      trueStatement:
        "All'aumentare dei volumi di produzione, i costi fissi totali rimangono costanti entro l'area di rilevanza, mentre il costo fisso unitario decresce iperbolicamente, determinando economie di assorbimento dei costi fissi.",
      falseStatement:
        "All'aumentare della produzione il costo fisso unitario rimane perfettamente immutato e il costo fisso totale cresce linearmente con la quantità prodotta.",
      why: "Comprendere le economie di scala a breve termine derivanti dalla saturazione della capacità produttiva.",
      what: "CF_totale = costante; CF_unitario = CF / Q. Più produci, meno pesa il costo fisso su ogni singola unità.",
      how: "Graficamente: CF_unitario è un'iperbole equilatera asintotica all'asse dei volumi.",
      trap: "CONFUSIONE CLASSICA: Confondere il comportamento del costo fisso TOTALE (costante) con quello del costo fisso UNITARIO (decrescente).",
    },
    {
      concept: "Costi Sommersi (Sunk Costs) e Decisioni Razionali",
      trueStatement:
        "I costi sommersi sono costi già sostenuti nel passato che non possono essere recuperati con alcuna decisione futura; l'analisi economica razionale impone di ignorarli completamente nelle decisioni di proseguimento o abbandono di un progetto.",
      falseStatement:
        "Un progetto software in grave perdita deve essere sempre completato a ogni costo per onorare i 2 milioni di euro già spesi negli anni precedenti.",
      why: "Evitare la fallacia del costo sommerso (sunk cost fallacy), trappola cognitiva diffusissima tra ingegneri e manager.",
      what: "Nelle decisioni conta solo il delta futuro: Ricavi incrementali futuri vs Costi incrementali futuri da sostenere da oggi in avanti.",
      how: "Se il costo per finire il progetto supera il valore atteso sul mercato, la decisione ottima è cancellare immediatamente il progetto.",
      trap: "Non perseverare in un errore solo perché 'ormai ci abbiamo investito tanto'. Il passato non si cambia.",
    },
    {
      concept: "Margine di Sicurezza (MS) e Rischio Operativo",
      trueStatement:
        "Il Margine di Sicurezza misura la percentuale massima di contrazione del fatturato o dei volumi che l'azienda può sopportare prima di entrare nell'area delle perdite operative (MS = (Q - Q*) / Q * 100).",
      falseStatement:
        "Un Margine di Sicurezza del 5% indica che l'azienda opera in condizioni di estrema tranquillità e lontananza dal punto di pareggio.",
      why: "Valutare la vulnerabilità dell'impresa a shock di mercato o a cali imprevisti della domanda.",
      what: "Distanza percentuale tra il livello effettivo di vendite e il Break-Even Point (Q*).",
      how: "Più alto è il MS, più l'azienda è resiliente a flessioni congiunturali delle vendite.",
      trap: "Un'azienda con costi fissi altissimi ha un BEP elevato e un MS ridotto: basta un piccolo calo di vendite per andare in perdita profonda.",
    },
    {
      concept: "Eliminazione di una linea di prodotto in perdita apparente",
      trueStatement:
        "Una linea di prodotto che chiude il proprio conto economico con una perdita netta contabile non deve essere eliminata se genera un Margine di Contribuzione positivo e i suoi costi fissi sono prevalentemente comuni e non eliminabili.",
      falseStatement:
        "Ogni prodotto che mostra una perdita dopo l'allocazione dei costi generali deve essere tassativamente soppresso all'istante.",
      why: "Evitare la distruzione di utile aziendale causata dall'applicazione miope dei costi pieni (Full Costing).",
      what: "Se sopprimo una linea che ha MdC = +30.000 €, perdo 30.000 € di contribuzione alla copertura dei costi fissi comuni dell'azienda.",
      how: "Criterio di convenienza: eliminare solo se MdC perso < Costi Fissi specifici effettivamente eliminabili.",
      trap: "Eliminare una linea con MdC positivo fa peggiorare il reddito operativo dell'intera azienda!",
    },
    {
      concept: "Grado di Leva Operativa (GLO)",
      trueStatement:
        "Il Grado di Leva Operativa (GLO = MdC_totale / RO) amplifica la variazione percentuale del Reddito Operativo a fronte di una data variazione percentuale delle vendite; strutture a elevati costi fissi presentano un GLO più alto e maggiore rischiosità operativa.",
      falseStatement:
        "Il Grado di Leva Operativa dipende dall'ammontare dei debiti finanziari bancari contratti dall'azienda.",
      why: "Comprendere il trade-off tra flessibilità dei costi (aziende a costi variabili) e rigidità/scalabilità (aziende ad alta intensità di capitale fisso).",
      what: "GLO = elasticità del Reddito Operativo rispetto ai ricavi di vendita.",
      how: "% delta RO = GLO * % delta Vendite. Se GLO = 4, un aumento del 10% del fatturato genera un aumento del 40% del RO.",
      trap: "Non confondere la Leva Operativa (costi fissi industriali vs variabili) con la Leva Finanziaria (debiti finanziari vs capitale proprio).",
    },
  ];

  let counter = 1;
  for (let round = 1; round <= 25; round++) {
    for (const c of costConcepts) {
      const isTrueQ = (round + counter) % 2 === 0;
      // 1. True/False
      questions.push({
        id: `B6-COMB-TF-${String(counter).padStart(4, "0")}`,
        version: 1,
        block: 6,
        topic: "controllo-gestione-decisioni",
        tags: [
          "costi",
          "bep",
          "controllo-gestione",
          "decisioni-breve-termine",
          "glo",
        ],
        track: "essential",
        difficulty: 1,
        type: "true-false",
        stem: `Valuta la seguente affermazione in materia di "${c.concept}":\n\n«${isTrueQ ? c.trueStatement : c.falseStatement}»`,
        options: [
          { id: "a", text: "Vero", correct: isTrueQ },
          { id: "b", text: "Falso", correct: !isTrueQ },
        ],
        explanation: {
          why: c.why,
          what: c.what,
          how: isTrueQ
            ? `VERO. ${c.how}`
            : `FALSO. Affermazione corretta: ${c.trueStatement}`,
          trap: c.trap,
        },
        sourceRef:
          "Slide Blocco VI - Break-Even Analysis e Controllo di Gestione",
      });
      counter++;

      // 2. Single-choice
      questions.push({
        id: `B6-COMB-SC-${String(counter).padStart(4, "0")}`,
        version: 1,
        block: 6,
        topic: "decisioni-costi-margini",
        tags: ["decisioni-operative", "bep", "analisi-costi"],
        track: "standard",
        difficulty: 2,
        type: "single-choice",
        stem: `Quale delle seguenti affermazioni descrive in modo rigoroso "${c.concept}" per il controllo di gestione? (Variante #${round})`,
        options: [
          { id: "a", text: c.trueStatement, correct: true },
          { id: "b", text: c.falseStatement, correct: false },
          {
            id: "c",
            text: "I costi fissi variano proporzionalmente a ogni singola unità addizionale venduta.",
            correct: false,
          },
          {
            id: "d",
            text: "Il Margine di Contribuzione coincide sempre con l'Utile Netto dopo le imposte.",
            correct: false,
          },
        ].sort(() => Math.random() - 0.5),
        explanation: {
          why: c.why,
          what: c.what,
          how: `Risposta corretta: ${c.trueStatement}`,
          trap: c.trap,
        },
        sourceRef: "EOA 2026 - Analisi Costi-Volumi-Profitti",
      });
      counter++;

      // 3. Multi-True-False
      if (round % 2 === 0) {
        questions.push({
          id: `B6-COMB-MTF-${String(counter).padStart(4, "0")}`,
          version: 1,
          block: 6,
          topic: "valutazione-costi-decisioni-avanzate",
          tags: ["multi-tf", "bep", "decisioni-differenziali"],
          track: "advanced",
          difficulty: 3,
          type: "multi-true-false",
          stem: `In tema di "${c.concept}" e analisi decisionale differenziale (Scenario #${round}), indica se ciascuna proposizione è Vera o Falsa:`,
          multiTrueFalseItems: [
            { id: "item-1", statement: c.trueStatement, isTrue: true },
            { id: "item-2", statement: c.falseStatement, isTrue: false },
            {
              id: "item-3",
              statement:
                "Nel punto di pareggio (Break-Even Point) il Margine di Contribuzione totale eguaglia esattamente i Costi Fissi totali, azzerando il Reddito Operativo.",
              isTrue: true,
            },
            {
              id: "item-4",
              statement:
                "Il costo variabile unitario diminuisce linearmente all'aumentare dei volumi prodotti nell'area di rilevanza ordinaria.",
              isTrue: false,
            },
          ],
          explanation: {
            why: c.why,
            what: c.what,
            how: "Item 1: VERO. Item 2: FALSO. Item 3: VERO (definizione stessa di BEP: RO = MdC_tot - CF = 0). Item 4: FALSO (il costo variabile unitario si assume costante nell'area di rilevanza; è il totale dei costi variabili a crescere proporzionalmente).",
            trap: c.trap,
          },
          sourceRef: "Guida EOA 2026 / Slide Blocco VI",
        });
        counter++;
      }
    }
  }

  return questions;
}
