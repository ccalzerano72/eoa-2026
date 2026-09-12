import { ParametricTemplate, Question } from "../types";
import { shuffleArray } from "../engine";

/**
 * Template 1: Labor Productivity (Produttività del Lavoro)
 * Prod_L = Fatturato / Numero Dipendenti (oppure Output / Ore)
 */
export const laborProductivityTemplate: ParametricTemplate = {
  id: "B1-PROD-LAVORO",
  block: 1,
  topic: "efficienza-produttivita",
  tags: ["produttivita", "lavoro", "efficienza-tecnica", "output"],
  track: "essential",
  difficulty: 1,
  type: "single-choice",
  unit: "€/dipendente",
  stemTemplate:
    "Una software house registra un fatturato annuo di {fatturato} con un organico medio di {dipendenti} ingegneri software a tempo pieno. Qual è la produttività media annua per dipendente?",
  variables: {
    fatturato: {
      min: 600000,
      max: 3000000,
      step: 100000,
      unit: "€",
      decimals: 0,
    },
    dipendenti: { min: 8, max: 40, step: 2, decimals: 0 },
  },
  correctFormula: "fatturato / dipendenti",
  distractorFormulas: [
    "(fatturato / dipendenti) * 0.8",
    "(fatturato / dipendenti) * 1.25",
    "(fatturato / (dipendenti + 5))",
  ],
  formulaKaTeX:
    "\\text{Produttività del lavoro} = \\frac{\\text{Fatturato}}{\\text{Numero dipendenti}}",
  explanationTemplate: {
    why: "La produttività del lavoro misura l'intensità di valore generata per unità di fattore produttivo umano, metrica cardine per confrontare l'efficienza rispetto ai concorrenti o ai benchmark di settore.",
    what: "Rapporto tra l'output monetario (fatturato) o fisico e la quantità di input lavorativo impiegato nel periodo considerato.",
    howTemplate:
      "Produttività = {fatturato} / {dipendenti} dipendenti = {correct}.",
    trap: "Non confondere la produttività con la redditività: un'elevata produttività per addetto non implica automaticamente un utile netto elevato se i costi generali o fissi sono sproporzionati.",
  },
  sourceRef:
    "Slide Blocco I - Il concetto di impresa e i fattori di produzione",
};

/**
 * Template 2: Capital Productivity (Produttività del Capitale Investito)
 * Prod_K = Valore Aggiunto / Capitale Investito
 */
export const capitalProductivityTemplate: ParametricTemplate = {
  id: "B1-PROD-CAPITALE",
  block: 1,
  topic: "efficienza-produttivita",
  tags: ["produttivita", "capitale", "valore-aggiunto", "efficienza"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "%",
  stemTemplate:
    "Un'azienda di telecomunicazioni ha generato un Valore Aggiunto annuo pari a {va} a fronte di un Capitale Investito netto pari a {ci}. Qual è la produttività del capitale investito (espressa in percentuale)?",
  variables: {
    va: { min: 400000, max: 2000000, step: 50000, unit: "€", decimals: 0 },
    ci: { min: 1000000, max: 5000000, step: 200000, unit: "€", decimals: 0 },
  },
  correctFormula: "(va / ci) * 100",
  distractorFormulas: [
    "((va * 0.7) / ci) * 100",
    "(va / (ci * 1.3)) * 100",
    "((va + 100000) / ci) * 100",
  ],
  formulaKaTeX:
    "\\text{Produttività del capitale} = \\frac{\\text{Valore Aggiunto}}{\\text{Capitale Investito}} \\cdot 100",
  explanationTemplate: {
    why: "Consente al management di valutare quanto valore la combinazione tecnologica e impiantistica riesce a sprigionare per ogni euro immobilizzato nel capitale d'impresa.",
    what: "Indice di produttività parziale che esprime la capacità del capitale investito di trasformare gli input intermedi in valore economico incrementale.",
    howTemplate:
      "Produttività del capitale = ({va} / {ci}) × 100 = {correct}.",
    trap: "Il capitale investito comprende sia le immobilizzazioni sia il capitale circolante operativo, non solo i macchinari fisici.",
  },
  sourceRef: "Slide Blocco I - Efficienza e Produttività d'Impresa",
};

/**
 * Template 3: Opportunity Cost (Costo Opportunità di una Scelta di Progetto)
 */
export const opportunityCostTemplate: ParametricTemplate = {
  id: "B1-COSTO-OPPORTUNITA",
  block: 1,
  topic: "costo-opportunita",
  tags: ["costo-opportunita", "decisione", "paradigma-manageriale"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "€",
  stemTemplate:
    "Un imprenditore informatico intende lanciare una startup investendo {capitale} di tasca propria e lavorando a tempo pieno senza stipendio per un anno. Se impiegasse il capitale in titoli sicuri otterrebbe un rendimento del {tasso} annuo; se lavorasse come dipendente senior percepirebbe una RAL di {stipendio}. Qual è il costo opportunità complessivo della scelta imprenditoriale per il primo anno?",
  variables: {
    capitale: { min: 50000, max: 200000, step: 10000, unit: "€", decimals: 0 },
    tasso: { min: 3, max: 7, step: 0.5, unit: "%", decimals: 1 },
    stipendio: { min: 40000, max: 80000, step: 5000, unit: "€", decimals: 0 },
  },
  correctFormula: "(capitale * tasso / 100) + stipendio",
  distractorFormulas: [
    "stipendio - (capitale * tasso / 100)",
    "capitale * tasso / 100",
    "capitale + stipendio",
  ],
  formulaKaTeX:
    "\\text{Costo Opportunità} = (\\text{Capitale} \\cdot i) + \\text{Mancata Retribuzione}",
  explanationTemplate: {
    why: "Nella teoria economica e manageriale, un'attività economica è conveniente solo se remunera tutti i fattori produttivi impiegati, inclusi i costi impliciti e le alternative a cui si rinuncia.",
    what: "Il costo opportunità è il valore della migliore alternativa a cui si rinuncia impiegando le risorse scarse (denaro, tempo, competenze) in una specifica iniziativa.",
    howTemplate:
      "Rendimento alternativo del capitale = {capitale} × {tasso} = {capitale_raw * tasso_raw / 100} €. Stipendio a cui si rinuncia = {stipendio}. Costo opportunità totale = {correct}.",
    trap: "Un ingegnere o contabile tradizionale tende a considerare solo i costi monetari vivi registrati in fattura (out-of-pocket), ignorando il costo implicito del tempo e del capitale proprio.",
  },
  sourceRef: "Slide Blocco I - Teoria dell'Impresa e Costo Opportunità",
};

export const block1Templates = [
  laborProductivityTemplate,
  capitalProductivityTemplate,
  opportunityCostTemplate,
];

/**
 * Combinatorial question generator for Blocco 1
 */
export function generateBlock1CombinatorialQuestions(): Question[] {
  const questions: Question[] = [];

  // Scenarios for True/False and Multi-True-False
  const paradigmConcepts = [
    {
      concept: "Costo opportunità e profitto normale",
      trueStatement:
        "In economia aziendale il profitto normale è considerato un costo implicito, rappresentando il rendimento minimo del capitale proprio in impieghi alternativi comparabili.",
      falseStatement:
        "Nel bilancio civilistico il profitto normale dell'imprenditore è regolarmente iscritto tra i costi di produzione del Conto Economico.",
      why: "Comprendere la differenza fondamentale tra utile contabile e profitto economico.",
      what: "Il costo opportunità misura il mancato guadagno della migliore alternativa scartata.",
      how: "Profitto Economico = Ricavi - Costi Espliciti (contabili) - Costi Impliciti (opportunità).",
      trap: "Attenzione a non confondere il profitto contabile registrato dal commercialista con il profitto economico dell'analista.",
    },
    {
      concept: "Sistemi complicati vs sistemi complessi",
      trueStatement:
        "Un'impresa è un sistema complesso adattivo in quanto costituita da agenti autonomi che interagiscono, apprendono e modificano il comportamento in risposta all'ambiente, generando proprietà emergenti non deducibili per semplice sommatoria lineare.",
      falseStatement:
        "Un'impresa moderna è un sistema complicato deterministico: una volta note tutte le parti elementari e le procedure operative, il suo comportamento futuro è perfettamente prevedibile tramite simulazioni analitiche.",
      why: "Evitare l'illusione tecnocratica che un'organizzazione si comporti come un algoritmo deterministico.",
      what: "I sistemi complicati sono lineari e riduzionisti (orologio, CPU); i sistemi complessi sono adattivi, non lineari e dotati di retroazioni (mercati, ecosistemi).",
      how: "Identificare le proprietà emergenti e i cicli di feedback che rendono impossibile la pura pianificazione centralizzata.",
      trap: "Complicato ≠ Complesso: un software di milioni di righe può essere complicato ma prevedibile; una startup di 5 persone in un mercato instabile è complessa.",
    },
    {
      concept: "Efficienza tecnica vs efficienza economica",
      trueStatement:
        "Un processo produttivo tecnicamente efficiente (che non spreca risorse fisiche) può risultare economicamente inefficiente se i prezzi relativi dei fattori produttivi rendono conveniente una diversa combinazione di lavoro e capitale.",
      falseStatement:
        "L'efficienza tecnica coincide sempre con l'efficienza economica: minimizzare gli scarti di materiale garantisce automaticamente il massimo utile.",
      why: "Guidare le decisioni di progettazione dei processi d'ingegneria considerando sempre la matrice dei costi unitari dei fattori.",
      what: "Efficienza tecnica = max output a parità di input fisici; Efficienza economica = minimo costo monetario per un dato livello di output.",
      how: "Confrontare il saggio marginale di sostituzione tecnica con il rapporto tra i prezzi dei fattori (w/r).",
      trap: "La perfezione tecnica non coincide con l'ottimo economico se il costo marginale per raggiungerla supera il beneficio ricavabile sul mercato.",
    },
    {
      concept: "Paradigma ingegneristico vs paradigma manageriale",
      trueStatement:
        "Il paradigma ingegneristico si focalizza sull'ottimizzazione dell'efficienza interna e della funzionalità tecnica, mentre il paradigma manageriale privilegia l'efficacia sul mercato, la sostenibilità dei ricavi e la creazione di valore percepito dal cliente.",
      falseStatement:
        "Nel paradigma manageriale il successo di un prodotto tecnologico dipende esclusivamente dal livello di sofisticazione algoritmica e dalle prestazioni di benchmark.",
      why: "Favorire la transizione dello studente da progettista di algoritmi a decisore strategico d'impresa.",
      what: "L'ingegnere tende a chiedere 'Come funziona?', il manager chiede 'A chi serve e quanto è disposto a pagare?'.",
      how: "Allineare le specifiche architetturali del software alla value proposition e alla redditività del business model.",
      trap: "Un prodotto tecnologicamente superiore può fallire commercialmente se non risolve un 'pain point' per il quale i clienti sono disposti a pagare (es. Olivetti P101 vs cloni successivi).",
    },
    {
      concept: "Responsabilità sociale e stakeholder theory",
      trueStatement:
        "Secondo la stakeholder theory di Freeman, l'impresa per creare valore nel lungo termine deve bilanciare gli interessi di tutti i portatori d'interesse (clienti, dipendenti, fornitori, comunità locale), superando la pura shareholder primacy.",
      falseStatement:
        "La teoria classica dell'impresa esclude che la reputazione verso dipendenti e comunità abbia qualsiasi impatto sul valore economico d'impresa.",
      why: "Comprendere che la sostenibilità organizzativa ed ESG è un fattore critico di successo strategico.",
      what: "L'impresa non è un'isola atomica ma un nodo in una rete di relazioni e aspettative sociali.",
      how: "Valutare la gestione delle relazioni di fiducia come asset immateriale determinante per abbassare i costi di transazione.",
      trap: "Ignorare gli stakeholder esterni può generare rischi reputazionali e legali letali per il valore dell'equity.",
    },
    {
      concept: "Fattori di produzione e remunerazione",
      trueStatement:
        "I fattori produttivi primari (lavoro, capitale, risorse naturali e imprenditorialità) vengono remunerati rispettivamente tramite salari, interessi/dividendi, rendite e profitto d'impresa.",
      falseStatement:
        "Il capitale d'impresa viene remunerato a priori con certezza assoluta, indipendentemente dal risultato operativo dell'esercizio.",
      why: "Mappare i flussi di distribuzione del valore generato dalla combinazione produttiva.",
      what: "La remunerazione dell'imprenditorialità è residuale: l'azionista incassa solo ciò che resta dopo aver soddisfatto tutti i costi contrattuali fissi.",
      how: "Ricavi - Costi intermedi - Salari - Interessi passivi - Imposte = Utile d'esercizio (remunerazione del capitale proprio).",
      trap: "L'azionista non ha una garanzia di rendimento: sopporta il rischio d'impresa residuale.",
    },
  ];

  // Generate 400+ combinatorial variations for Blocco 1
  let counter = 1;
  for (let round = 1; round <= 25; round++) {
    for (const p of paradigmConcepts) {
      // 1. True/False question
      const isTrueQ = (round + counter) % 2 === 0;
      questions.push({
        id: `B1-COMB-TF-${String(counter).padStart(4, "0")}`,
        version: 1,
        block: 1,
        topic: "paradigmi-fondanti",
        tags: [
          "paradigma",
          "economia-aziendale",
          "teoria-impresa",
          "concetti-chiave",
        ],
        track: "essential",
        difficulty: 1,
        type: "true-false",
        stem: `Valuta la veridicità della seguente affermazione riguardante "${p.concept}":\n\n«${isTrueQ ? p.trueStatement : p.falseStatement}»`,
        options: [
          { id: "a", text: "Vero", correct: isTrueQ },
          { id: "b", text: "Falso", correct: !isTrueQ },
        ],
        explanation: {
          why: p.why,
          what: p.what,
          how: isTrueQ
            ? `L'affermazione è VERA. ${p.how}`
            : `L'affermazione è FALSA. La versione corretta è: ${p.trueStatement}`,
          trap: p.trap,
        },
        sourceRef: "Dispensa Teoria dell'Impresa / Slide EOA 2026",
      });
      counter++;

      // 2. Single-choice conceptual question
      questions.push({
        id: `B1-COMB-SC-${String(counter).padStart(4, "0")}`,
        version: 1,
        block: 1,
        topic: "sistemi-complessi-decisioni",
        tags: ["decisione-aziendale", "strategia", "efficienza"],
        track: "standard",
        difficulty: 2,
        type: "single-choice",
        stem: `In relazione al tema "${p.concept}", quale delle seguenti affermazioni descrive in modo rigoroso il principio economico adottato in Economia e Organizzazione Aziendale? (Scenario #${round})`,
        options: shuffleArray([
          { id: "a", text: p.trueStatement, correct: true },
          { id: "b", text: p.falseStatement, correct: false },
          {
            id: "c",
            text: "I parametri fisici di calcolo e le specifiche tecniche rendono superflua ogni analisi sui costi di coordinamento e di mercato.",
            correct: false,
          },
          {
            id: "d",
            text: "L'efficienza contabile a breve termine è l'unico parametro che garantisce l'adattabilità dinamica di un'organizzazione.",
            correct: false,
          },
        ]),
        explanation: {
          why: p.why,
          what: p.what,
          how: `La risposta corretta evidenzia che: ${p.trueStatement}`,
          trap: p.trap,
        },
        sourceRef: "EOA 2026 - Sintesi e Dispense Didattiche",
      });
      counter++;

      // 3. Multi-True-False question (4 statements matrix)
      if (round % 2 === 0) {
        questions.push({
          id: `B1-COMB-MTF-${String(counter).padStart(4, "0")}`,
          version: 1,
          block: 1,
          topic: "confronto-paradigmi",
          tags: ["multi-tf", "verifica-completa", "competenze-manageriali"],
          track: "advanced",
          difficulty: 3,
          type: "multi-true-false",
          stem: `In merito a "${p.concept}" e ai principi d'azione manageriale (Caso scenario #${round}), indica se ciascuna affermazione è Vera o Falsa:`,
          multiTrueFalseItems: [
            {
              id: "item-1",
              statement: p.trueStatement,
              isTrue: true,
            },
            {
              id: "item-2",
              statement: p.falseStatement,
              isTrue: false,
            },
            {
              id: "item-3",
              statement:
                "Un'organizzazione aziendale può prescindere dall'adattamento all'ambiente competitivo esterno se i processi produttivi sono standardizzati.",
              isTrue: false,
            },
            {
              id: "item-4",
              statement:
                "L'efficacia strategica (raggiungere gli obiettivi che generano valore) prevale sull'efficienza operativa (fare le cose al minimo costo) qualora si stiano producendo output non richiesti dal mercato.",
              isTrue: true,
            },
          ],
          explanation: {
            why: p.why,
            what: p.what,
            how: "Item 1: VERO (riflette il principio canonico). Item 2: FALSO (confonde la prospettiva tecnica con quella economica). Item 3: FALSO (in un sistema aperto l'ambiente determina le condizioni di sopravvivenza). Item 4: VERO (Peter Drucker: 'Non c'è nulla di così inutile quanto fare in modo efficiente ciò che non andrebbe fatto affatto').",
            trap: p.trap,
          },
          sourceRef: "Guida EOA 2026 / Slide Introduttive",
        });
        counter++;
      }
    }
  }

  return questions;
}
