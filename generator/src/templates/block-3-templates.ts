import { ParametricTemplate, Question } from "../types";

/**
 * Template 1: Startup Valuation and Dilution (Valutazione Pre/Post Money e Diluizione)
 * V_post = V_pre + Investimento
 * Quota % = Investimento / V_post * 100
 */
export const startupValuationTemplate: ParametricTemplate = {
  id: "B3-ORG-VALUTAZIONE-DILUIZIONE",
  block: 3,
  topic: "governance-startup-funding",
  tags: [
    "startup",
    "equity",
    "pre-money",
    "post-money",
    "diluizione",
    "venture-capital",
  ],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "%",
  stemTemplate:
    "I fondatori di una startup informatica concordano con un fondo di Venture Capital una valutazione pre-money di {preMoney} milioni di euro. L'investitore decide di iniettare un aumento di capitale pari a {investimento} milioni di euro. Quale percentuale del capitale sociale (equity post-money) spetterà all'investitore?",
  variables: {
    preMoney: { min: 2, max: 10, step: 1, unit: "M€", decimals: 0 },
    investimento: { min: 1, max: 4, step: 0.5, unit: "M€", decimals: 1 },
  },
  correctFormula: "(investimento / (preMoney + investimento)) * 100",
  distractorFormulas: [
    "(investimento / preMoney) * 100", // common trap: dividing by pre-money
    "((preMoney - investimento) / preMoney) * 100",
    "(investimento / (preMoney + (investimento * 2))) * 100",
  ],
  formulaKaTeX:
    "\\%_{\\text{investitore}} = \\frac{\\text{Investimento}}{V_{\\text{pre-money}} + \\text{Investimento}} \\cdot 100",
  explanationTemplate: {
    why: "Nei round di investimento in equity (seed, Series A), la quota di proprietà ceduta dipende dalla valutazione post-money, determinando il controllo societario e la diluizione dei founder.",
    what: "La valutazione post-money è la somma della valutazione pre-money e del nuovo capitale iniettato. La quota dell'investitore è il rapporto tra il capitale versato e il totale post-money.",
    howTemplate:
      "Valutazione post-money = {preMoney} M€ + {investimento} M€ = {preMoney_raw + investimento_raw} M€. Quota investitore = ({investimento} M€ / {preMoney_raw + investimento_raw} M€) × 100 = {correct}%.",
    trap: "ERRORE TIPICO: Dividere l'investimento per la valutazione pre-money anziché per quella post-money, sovrastimando la percentuale ceduta.",
  },
  sourceRef:
    "Slide Blocco III - Finanziamento dell'Innovazione e Venture Capital",
};

/**
 * Template 2: Span of Control and Hierarchy Levels
 * N_dipendenti = (Span)^Livelli
 */
export const spanOfControlTemplate: ParametricTemplate = {
  id: "B3-ORG-SPAN-OF-CONTROL",
  block: 3,
  topic: "strutture-organizzative",
  tags: ["span-of-control", "gerarchia", "coordinamento", "mintzberg"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "dipendenti",
  stemTemplate:
    "Un'azienda con struttura gerarchica piramidale regolare adotta un'ampiezza media del controllo (span of control) pari a {span} collaboratori per ciascun manager. Se l'organizzazione ha {livelli} livelli manageriali intermedi al di sotto del CEO, quanti collaboratori operativi di base possono essere coordinati al livello più basso?",
  variables: {
    span: { min: 4, max: 7, step: 1, decimals: 0 },
    livelli: { min: 2, max: 4, step: 1, decimals: 0 },
  },
  correctFormula: "Math.pow(span, livelli)",
  distractorFormulas: [
    "span * livelli",
    "Math.pow(span, livelli - 1)",
    "span * (livelli + 2)",
  ],
  formulaKaTeX: "N_{\\text{base}} = (\\text{Span})^{\\text{Livelli}}",
  explanationTemplate: {
    why: "Lo span of control determina se la struttura organizzativa è 'alta' (molti livelli gerarchici, span ridotto) o 'piatta' (pochi livelli, span ampio), con impatti diretti su costi fissi di supervisione e rapidità decisionale.",
    what: "In una gerarchia regolare a k livelli con ampiezza costante s, il numero di elementi coordinati alla base cresce esponenzialmente come s^k.",
    howTemplate:
      "Capacità base = {span}^{livelli} = {correct} dipendenti operativi.",
    trap: "Non moltiplicare semplicemente lo span per i livelli: la gerarchia si espande a ogni ramo secondo una progressione geometrica esponenziale.",
  },
  sourceRef: "Slide Blocco III - Progettazione Organizzativa e Mintzberg",
};

export const block3Templates = [
  startupValuationTemplate,
  spanOfControlTemplate,
];

/**
 * Combinatorial question generator for Blocco 3
 */
export function generateBlock3CombinatorialQuestions(): Question[] {
  const questions: Question[] = [];

  const orgConcepts = [
    {
      concept:
        "Società di Capitali (Srl, SpA) vs Società di Persone (Snc, Sas)",
      trueStatement:
        "Nelle società di capitali (come Srl e SpA) vige l'autonomia patrimoniale perfetta: per le obbligazioni sociali risponde esclusivamente la società con il proprio patrimonio, proteggendo il patrimonio personale dei soci.",
      falseStatement:
        "Nelle società di capitali i singoli soci rispondono sempre in solido e illimitatamente con i propri beni personali di tutti i debiti contratti dall'azienda.",
      why: "Comprendere la separazione legale tra patrimonio d'impresa e patrimonio personale, fondamento del rischio d'impresa moderno.",
      what: "Autonomia patrimoniale perfetta (capitali) vs imperfetta (persone): tutela del socio contro il rischio di fallimento personale.",
      how: "Verificare la forma giuridica: SpA/Srl = responsabilità limitata al capitale sottoscritto.",
      trap: "Attenzione: l'amministratore di Srl può rispondere civilmente e penalmente solo in caso di dolo, mala gestio o violazione dei doveri di conservazione del patrimonio.",
    },
    {
      concept: "Struttura Funzionale vs Struttura Divisionale",
      trueStatement:
        "La struttura funzionale massimizza l'efficienza specialistica e le economie di scala all'interno di ciascuna funzione (es. R&D, Marketing, Produzione), ma soffre di scarsa flessibilità e conflitti interfunzionali all'aumentare della varietà di prodotti.",
      falseStatement:
        "La struttura funzionale è ideale per imprese fortemente diversificate con centinaia di linee di prodotto completamente eterogenee su mercati globali.",
      why: "Scegliere l'assetto organizzativo coerente con la complessità e varietà del business.",
      what: "Funzionale = raggruppamento per competenza tecnica/omogeneità di input; Divisionale = raggruppamento per output (prodotto, cliente, area geografica).",
      how: "Confrontare trade-off: efficienza e specializzazione (funzionale) vs reattività e responsabilizzazione sul profitto (divisionale).",
      trap: "La struttura divisionale comporta una duplicazione dei costi fissi delle funzioni di staff (es. un ufficio marketing per ogni divisione).",
    },
    {
      concept: "Struttura a Matrice",
      trueStatement:
        "La struttura a matrice combina contemporaneamente la dimensione funzionale (specializzazione) e la dimensione divisionale/progetto (focus sul risultato), introducendo il principio della doppia dipendenza gerarchica (violazione dell'unità di comando).",
      falseStatement:
        "La struttura a matrice azzera completamente ogni possibilità di conflitto interno tra responsabili di progetto e responsabili di funzione.",
      why: "Governare organizzazioni tecnologiche complesse e orientate a progetti (software house, aerospazio).",
      what: "Doppia gerarchia: il collaboratore risponde sia al Functional Manager sia al Project Manager.",
      how: "Bilanciare il potere negoziale tra eccellenza tecnica verticale e completamento del progetto orizzontale.",
      trap: "La matrice richiede maturità relazionale e chiarezza nei processi, altrimenti genera stallo decisionale e stress da priorità contrastanti.",
    },
    {
      concept: "Meccanismi di coordinamento di Mintzberg",
      trueStatement:
        "Mintzberg individua 5 meccanismi fondamentali di coordinamento: adattamento reciproco, supervisione diretta, standardizzazione dei processi di lavoro, standardizzazione degli output e standardizzazione delle competenze.",
      falseStatement:
        "Secondo Mintzberg l'adattamento reciproco è utilizzabile solo nelle organizzazioni gerarchiche gigantesche ed è del tutto vietato nelle startup snelle.",
      why: "Progettare i flussi informativi e di controllo tra ruoli organizzativi.",
      what: "L'adattamento reciproco si basa sulla comunicazione informale; la supervisione diretta su un capo che ordina; la standardizzazione su norme definite a monte.",
      how: "Mappare la complessità del task al meccanismo di coordinamento più idoneo.",
      trap: "All'aumentare dell'incertezza e dell'innovatività (R&D avanzata), le organizzazioni ritornano all'adattamento reciproco.",
    },
    {
      concept: "Teoria dell'Agenzia e costi di agenzia",
      trueStatement:
        "La teoria dell'agenzia studia i conflitti di interesse e l'asimmetria informativa tra il principale (azionista/proprietario) e l'agente (manager), che possono spingere l'agente a massimizzare i propri benefici privati a scapito del valore azionario.",
      falseStatement:
        "Nella teoria dell'agenzia si assume che manager e azionisti abbiano sempre funzioni di utilità perfettamente identiche e assenza totale di opportunismo.",
      why: "Progettare meccanismi di governance, stock option e monitoraggio per allineare gli incentivi.",
      what: "I costi di agenzia includono: spese di monitoraggio del principale, spese di garanzia dell'agente e perdita residuale di valore.",
      how: "Strutturare contratti di remunerazione legati a performance oggettive (MBO, piani azionari).",
      trap: "Le stock option allineano gli interessi ma possono creare incentivi perversi a gonfiare i corsi azionari a brevissimo termine.",
    },
  ];

  let counter = 1;
  for (let round = 1; round <= 25; round++) {
    for (const o of orgConcepts) {
      const isTrueQ = (round + counter) % 2 === 0;
      // 1. True/False
      questions.push({
        id: `B3-COMB-TF-${String(counter).padStart(4, "0")}`,
        version: 1,
        block: 3,
        topic: "organizzazione-governance",
        tags: ["organizzazione", "governance", "strutture", "forme-giuridiche"],
        track: "essential",
        difficulty: 1,
        type: "true-false",
        stem: `Valuta la veridicità della seguente affermazione riguardante "${o.concept}":\n\n«${isTrueQ ? o.trueStatement : o.falseStatement}»`,
        options: [
          { id: "a", text: "Vero", correct: isTrueQ },
          { id: "b", text: "Falso", correct: !isTrueQ },
        ],
        explanation: {
          why: o.why,
          what: o.what,
          how: isTrueQ
            ? `VERO. ${o.how}`
            : `FALSO. Affermazione corretta: ${o.trueStatement}`,
          trap: o.trap,
        },
        sourceRef: "Slide Blocco III - Organizzazione d'Impresa",
      });
      counter++;

      // 2. Single-choice
      questions.push({
        id: `B3-COMB-SC-${String(counter).padStart(4, "0")}`,
        version: 1,
        block: 3,
        topic: "modelli-organizzativi-governance",
        tags: ["organizzazione", "mintzberg", "governance"],
        track: "standard",
        difficulty: 2,
        type: "single-choice",
        stem: `Quale delle seguenti opzioni descrive con precisione la logica operativa di "${o.concept}"? (Q-Variant #${round})`,
        options: [
          { id: "a", text: o.trueStatement, correct: true },
          { id: "b", text: o.falseStatement, correct: false },
          {
            id: "c",
            text: "La responsabilità patrimoniale dei soci prescinde dalla forma societaria adottata nello statuto costitutivo.",
            correct: false,
          },
          {
            id: "d",
            text: "Tutti i contratti di lavoro manageriale eliminano automaticamente ogni forma di azzardo morale.",
            correct: false,
          },
        ].sort(() => Math.random() - 0.5),
        explanation: {
          why: o.why,
          what: o.what,
          how: `Risposta esatta: ${o.trueStatement}`,
          trap: o.trap,
        },
        sourceRef: "Dispensa Organizzazione e Governance",
      });
      counter++;

      // 3. Multi-True-False
      if (round % 2 === 0) {
        questions.push({
          id: `B3-COMB-MTF-${String(counter).padStart(4, "0")}`,
          version: 1,
          block: 3,
          topic: "diagnosi-organizzativa",
          tags: ["multi-tf", "organizzazione", "governance"],
          track: "advanced",
          difficulty: 3,
          type: "multi-true-false",
          stem: `In tema di "${o.concept}" e progettazione degli assetti aziendali (Scenario #${round}), indica se ciascuna affermazione è Vera o Falsa:`,
          multiTrueFalseItems: [
            { id: "item-1", statement: o.trueStatement, isTrue: true },
            { id: "item-2", statement: o.falseStatement, isTrue: false },
            {
              id: "item-3",
              statement:
                "Nelle SpA la governance tradizionale prevede l'Assemblea dei soci, il Consiglio di Amministrazione e il Collegio Sindacale.",
              isTrue: true,
            },
            {
              id: "item-4",
              statement:
                "La standardizzazione delle competenze è tipica delle burocrazie professionali come ospedali e studi di ingegneria.",
              isTrue: true,
            },
          ],
          explanation: {
            why: o.why,
            what: o.what,
            how: "Item 1: VERO. Item 2: FALSO. Item 3: VERO (sistema di governance ordinario italiano). Item 4: VERO (professionisti con forte formazione esterna e autonomia operativa).",
            trap: o.trap,
          },
          sourceRef: "Slide Blocco III / Guida EOA 2026",
        });
        counter++;
      }
    }
  }

  return questions;
}
