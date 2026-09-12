import { ParametricTemplate, Question } from "../types";
import { shuffleArray } from "../engine";

/**
 * Template 1: Relative Market Share and BCG Matrix (Quota di Mercato Relativa)
 * QMR = Vendite Impresa / Vendite Leader
 */
export const relativeMarketShareTemplate: ParametricTemplate = {
  id: "B2-STRAT-BCG-QMR",
  block: 2,
  topic: "vantaggio-competitivo",
  tags: ["BCG", "quota-mercato-relativa", "strategia", "posizionamento"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "",
  stemTemplate:
    "In un settore a elevata crescita ({tassoCrescita} annuo), un'azienda tech realizza un fatturato di {fatturatoImpresa}, mentre il principale concorrente e leader di mercato fattura {fatturatoLeader}. Qual è la quota di mercato relativa (QMR) dell'azienda e in quale quadrante della matrice BCG si posiziona?",
  variables: {
    tassoCrescita: { min: 12, max: 25, step: 1, unit: "%", decimals: 0 },
    fatturatoImpresa: { min: 20, max: 80, step: 5, unit: " M€", decimals: 0 },
    fatturatoLeader: { min: 100, max: 200, step: 10, unit: " M€", decimals: 0 },
  },
  correctFormula: "fatturatoImpresa / fatturatoLeader",
  distractorFormulas: [
    "fatturatoLeader / fatturatoImpresa",
    "(fatturatoImpresa / (fatturatoImpresa + fatturatoLeader))",
    "(fatturatoImpresa / fatturatoLeader) * 1.5",
  ],
  formulaKaTeX:
    "QMR = \\frac{\\text{Fatturato Impresa}}{\\text{Fatturato Leader di Mercato}}",
  explanationTemplate: {
    why: "La matrice BCG correla la generazione di cassa con la posizione competitiva dell'azienda (quota relativa) e l'attrattività del mercato (tasso di crescita).",
    what: "Se QMR < 1 e il tasso di crescita del mercato è elevato (>10%), il business è un 'Question Mark' (dilemma): richiede ingenti investimenti per guadagnare quota ma genera flussi limitati.",
    howTemplate:
      "QMR = {fatturatoImpresa} / {fatturatoLeader} = {correct}. Con tasso di crescita {tassoCrescita} (> 10%) e QMR < 1, si posiziona nel quadrante Question Mark.",
    trap: "Attenzione a non calcolare la quota di mercato assoluta rispetto al totale dell'intero settore: la BCG richiede specificamente il rapporto con il leader.",
  },
  sourceRef: "Slide Blocco II - Modelli di Portfolio e Matrice BCG",
};

/**
 * Template 2: Learning Curve / Experience Curve (Curva di Esperienza)
 * Riduzione del costo unitario al raddoppio della produzione cumulata
 */
export const learningCurveTemplate: ParametricTemplate = {
  id: "B2-STRAT-CURVA-ESPERIENZA",
  block: 2,
  topic: "economie-scala-esperienza",
  tags: [
    "curva-esperienza",
    "costo-unitario",
    "apprendimento",
    "vantaggio-costo",
  ],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "€",
  stemTemplate:
    "Un produttore di hardware IoT produce la prima serie cumulata di 10.000 unità a un costo unitario di {costoIniziale}. Il processo gode di un tasso di apprendimento del {tassoApprendimento} (il che significa che a ogni raddoppio della produzione cumulata il costo unitario scende al {100 - tassoApprendimento_raw}% del valore precedente). Qual è il costo unitario previsto quando la produzione cumulata raggiungerà 40.000 unità (pari a due raddoppi)?",
  variables: {
    costoIniziale: { min: 80, max: 200, step: 10, unit: "€", decimals: 0 },
    tassoApprendimento: { min: 10, max: 25, step: 5, unit: "%", decimals: 0 },
  },
  correctFormula:
    "costoIniziale * Math.pow((100 - tassoApprendimento) / 100, 2)",
  distractorFormulas: [
    "costoIniziale * ((100 - tassoApprendimento) / 100)", // one doubling only
    "costoIniziale * Math.pow((100 - tassoApprendimento) / 100, 3)", // three doublings
    "costoIniziale - (costoIniziale * tassoApprendimento / 100 * 2)", // linear reduction
  ],
  formulaKaTeX:
    "C_{2n} = C_n \\cdot (1 - \\text{tasso}), \\quad C_{40k} = C_{10k} \\cdot (1 - \\lambda)^2",
  explanationTemplate: {
    why: "La curva di esperienza spiega come la produzione cumulata nel tempo consenta di abbattere progressivamente i costi unitari grazie all'apprendimento, alla standardizzazione e al redesign di processo.",
    what: "A ogni raddoppio dei volumi cumulati (da 10k a 20k, poi da 20k a 40k = 2 raddoppi), il costo unitario si contrae secondo la percentuale di progresso.",
    howTemplate:
      "Fattore di costo = (100 − {tassoApprendimento}) = {(100 - tassoApprendimento_raw)/100}. Dopo 2 raddoppi: C = {costoIniziale} × ({(100 - tassoApprendimento_raw)/100})^2 = {correct}.",
    trap: "Non confondere le economie di scala (dimensione istantanea dell'impianto nel breve/medio periodo) con la curva di esperienza (accumulo storico di produzione nel tempo).",
  },
  sourceRef:
    "Slide Blocco II - Vantaggio di Costo ed Economie di Apprendimento",
};

/**
 * Template 3: Price Elasticity of Demand (Elasticità della Domanda)
 * e = |% delta Q / % delta P|
 */
export const priceElasticityTemplate: ParametricTemplate = {
  id: "B2-MKT-ELASTICITA-DOMANDA",
  block: 2,
  topic: "analisi-domanda-prezzo",
  tags: ["elasticita", "prezzo", "domanda", "ricavi-totali"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "",
  stemTemplate:
    "Un'azienda SaaS decide di aumentare il canone mensile del {deltaP} (da 50 € a {50 + (50 * deltaP_raw / 100)} €). In conseguenza di ciò, il numero di abbonati attivi cala del {deltaQ}. Qual è il coefficiente di elasticità della domanda al prezzo (in valore assoluto)?",
  variables: {
    deltaP: { min: 10, max: 30, step: 5, unit: "%", decimals: 0 },
    deltaQ: { min: 5, max: 25, step: 5, unit: "%", decimals: 0 },
  },
  correctFormula: "deltaQ / deltaP",
  distractorFormulas: [
    "deltaP / deltaQ",
    "(deltaP - deltaQ) / 10",
    "(deltaQ * deltaP) / 100",
  ],
  formulaKaTeX:
    "\\varepsilon = \\left| \\frac{\\%\\Delta Q}{\\%\\Delta P} \\right| = \\frac{\\Delta Q / Q}{\\Delta P / P}",
  explanationTemplate: {
    why: "L'elasticità della domanda al prezzo guida la politica di pricing: indica se un aumento di prezzo farà salire o scendere i ricavi complessivi dell'impresa.",
    what: "Rapporto tra la variazione percentuale della quantità domandata e la variazione percentuale del prezzo.",
    howTemplate:
      "Elasticità ε = |-{deltaQ} / +{deltaP}| = {correct}. Se ε < 1 la domanda è anelastica (i ricavi aumentano all'aumentare del prezzo); se ε > 1 la domanda è elastica.",
    trap: "L'elasticità è un numero puro (adimensionale), non una grandezza in euro o percento.",
  },
  sourceRef: "Slide Blocco II - Pricing e Comportamento della Domanda",
};

export const block2Templates = [
  relativeMarketShareTemplate,
  learningCurveTemplate,
  priceElasticityTemplate,
];

/**
 * Combinatorial question generator for Blocco 2
 */
export function generateBlock2CombinatorialQuestions(): Question[] {
  const questions: Question[] = [];

  const strategyConcepts = [
    {
      concept: "Modello delle 5 Forze di Porter",
      trueStatement:
        "Nel modello di Porter, l'intensità della concorrenza e la redditività media di un settore dipendono da 5 forze competitive: rivalità tra concorrenti, minaccia di nuovi entranti, minaccia di prodotti sostitutivi, potere contrattuale dei fornitori e potere contrattuale dei clienti.",
      falseStatement:
        "Il modello delle 5 Forze di Porter afferma che l'unico fattore rilevante per determinare l'attrattività di un settore è il numero assoluto di concorrenti diretti presenti sul mercato.",
      why: "Analizzare la redditività strutturale di un settore prima di decidere l'ingresso o l'allocazione di risorse.",
      what: "La redditività è funzione delle forze concorrenziali allargate che comprimono i margini (prezzi al ribasso o costi dei fattori al rialzo).",
      how: "Mappare l'intensità di ciascuna delle 5 forze per diagnosticare se il settore è attrattivo o iper-competitivo.",
      trap: "I clienti e i fornitori non sono solo partner ma forze concorrenziali che cercano di appropriarsi del valore creato nella filiera.",
    },
    {
      concept: "Strategie competitive di base (Porter)",
      trueStatement:
        "Secondo Porter un'impresa per ottenere un vantaggio competitivo sostenibile deve perseguire una tra tre strategie fondamentali: leadership di costo, differenziazione, o focalizzazione (su costo o differenziazione), evitando la trappola del 'bloccato a metà' (stuck in the middle).",
      falseStatement:
        "La strategia ottimale per qualsiasi impresa consiste nel massimizzare contemporaneamente la personalizzazione del prodotto e offrire sempre il prezzo più basso del mercato globale.",
      why: "Definire con chiarezza la value proposition per evitare trade-off contraddittori.",
      what: "Leadership di costo punta a costi inferiori ai concorrenti; la differenziazione punta a un premium price per un valore unico percepito.",
      how: "Allineare catena del valore, competenze R&D e struttura di costo alla specifica scelta strategica.",
      trap: "Cercare di essere contemporaneamente il più economico e il più lussuoso porta quasi sempre a perdere la redditività.",
    },
    {
      concept: "VRIO Framework e Resource-Based View",
      trueStatement:
        "Secondo la Resource-Based View e il modello VRIO, una risorsa o competenza genera un vantaggio competitivo sostenibile solo se è al tempo stesso di Valore (V), Rara (R), Inimitabile (I) e supportata da un'Organizzazione (O) capace di sfruttarla.",
      falseStatement:
        "Qualsiasi tecnologia software open source o standard disponibile sul mercato costituisce di per sé un vantaggio competitivo difendibile e inimitabile per l'azienda che la adotta.",
      why: "Comprendere che la tecnologia da sola è imitabile; il vero vantaggio risiede nella combinazione organizzativa e nelle competenze interne.",
      what: "Le risorse comuni garantiscono parità competitiva; solo quelle VRIO consentono extra-profitti duraturi.",
      how: "Sottoporre ciascun asset chiave al test delle 4 domande VRIO per determinarne il potenziale strategico.",
      trap: "Confondere una risorsa necessaria per competere (es. avere un sito web o un cloud performante) con una risorsa che conferisce vantaggio competitivo unico.",
    },
    {
      concept: "Economie di scala vs Economie di scopo",
      trueStatement:
        "Le economie di scala si ottengono riducendo il costo medio unitario all'aumentare della scala di produzione di un singolo bene; le economie di scopo (o raggio d'azione) si realizzano quando la produzione congiunta di due o più beni distinti costa meno della loro produzione disgiunta.",
      falseStatement:
        "Le economie di scopo coincidono con le economie di apprendimento legate alla ripetizione temporale dello stesso compito produttivo.",
      why: "Valutare decisioni di diversificazione di prodotto rispetto a decisioni di espansione dimensionale dell'impianto.",
      what: "Scala = dimensione del volume per singolo output; Scopo = condivisione di risorse e sinergie tra output multipli (es. brand, canali di distribuzione, piattaforme software condivise).",
      how: "C(Q1, Q2) < C(Q1, 0) + C(0, Q2) indica la presenza di economie di scopo.",
      trap: "Aumentare la gamma di prodotti senza condividere fattori produttivi rischia di generare diseconomie di varietà e complessità.",
    },
    {
      concept: "Differenziazione vs Diversificazione",
      trueStatement:
        "La differenziazione è una strategia a livello di singola business unit volta a rendere l'offerta unica rispetto ai concorrenti dello stesso settore; la diversificazione è una strategia a livello corporate che comporta l'ingresso in nuovi settori o mercati merceologici.",
      falseStatement:
        "Differenziazione e diversificazione sono sinonimi perfetti che indicano l'aggiunta di nuove funzionalità a un'applicazione esistente.",
      why: "Mantenere precisione lessicale e concettuale nelle analisi strategiche e nelle risposte d'esame.",
      what: "Livello Business (come competere nel settore scelto) vs Livello Corporate (in quali settori competere).",
      how: "Classificare la decisione aziendale in base al perimetro competitivo di mercato.",
      trap: "Attenzione a non usare i due termini in modo intercambiabile nelle domande a scelta multipla.",
    },
  ];

  let counter = 1;
  for (let round = 1; round <= 25; round++) {
    for (const s of strategyConcepts) {
      const isTrueQ = (round + counter) % 2 === 0;
      // 1. True/False
      questions.push({
        id: `B2-COMB-TF-${String(counter).padStart(4, "0")}`,
        version: 1,
        block: 2,
        topic: "strategia-competitiva",
        tags: [
          "strategia",
          "porter",
          "vantaggio-competitivo",
          "posizionamento",
        ],
        track: "essential",
        difficulty: 1,
        type: "true-false",
        stem: `Valuta la seguente affermazione su "${s.concept}":\n\n«${isTrueQ ? s.trueStatement : s.falseStatement}»`,
        options: [
          { id: "a", text: "Vero", correct: isTrueQ },
          { id: "b", text: "Falso", correct: !isTrueQ },
        ],
        explanation: {
          why: s.why,
          what: s.what,
          how: isTrueQ
            ? `VERO. ${s.how}`
            : `FALSO. Affermazione corretta: ${s.trueStatement}`,
          trap: s.trap,
        },
        sourceRef: "Slide Blocco II - Strategia e Vantaggio Competitivo",
      });
      counter++;

      // 2. Single-choice
      questions.push({
        id: `B2-COMB-SC-${String(counter).padStart(4, "0")}`,
        version: 1,
        block: 2,
        topic: "posizionamento-settoriale",
        tags: ["strategia", "mercato", "analisi-competitiva"],
        track: "standard",
        difficulty: 2,
        type: "single-choice",
        stem: `Nel contesto dell'analisi strategica d'impresa, quale proposizione definisce correttamente "${s.concept}"? (Test case #${round})`,
        options: shuffleArray([
          { id: "a", text: s.trueStatement, correct: true },
          { id: "b", text: s.falseStatement, correct: false },
          {
            id: "c",
            text: "Il vantaggio competitivo dipende esclusivamente da barriere doganali e sussidi statali garantiti.",
            correct: false,
          },
          {
            id: "d",
            text: "L'elasticità incrociata tra prodotti complementari elimina ogni forma di rivalità settoriale.",
            correct: false,
          },
        ]),
        explanation: {
          why: s.why,
          what: s.what,
          how: `Opzione corretta: ${s.trueStatement}`,
          trap: s.trap,
        },
        sourceRef: "EOA 2026 - Strategia Competitiva",
      });
      counter++;

      // 3. Multi-True-False
      if (round % 2 === 0) {
        questions.push({
          id: `B2-COMB-MTF-${String(counter).padStart(4, "0")}`,
          version: 1,
          block: 2,
          topic: "valutazione-strategica-completa",
          tags: ["multi-tf", "strategia", "vrio-porter"],
          track: "advanced",
          difficulty: 3,
          type: "multi-true-false",
          stem: `In merito a "${s.concept}" e alle dinamiche di mercato (Analisi scenario #${round}), indica se ciascuna proposizione è Vera o Falsa:`,
          multiTrueFalseItems: [
            { id: "item-1", statement: s.trueStatement, isTrue: true },
            { id: "item-2", statement: s.falseStatement, isTrue: false },
            {
              id: "item-3",
              statement:
                "Le barriere all'entrata elevate proteggono la redditività degli incumbent riducendo la minaccia di nuovi concorrenti.",
              isTrue: true,
            },
            {
              id: "item-4",
              statement:
                "La differenziazione annulla la necessità di controllare i costi operativi aziendali.",
              isTrue: false,
            },
          ],
          explanation: {
            why: s.why,
            what: s.what,
            how: "Item 1: VERO. Item 2: FALSO. Item 3: VERO (barriere all'entrata come brevetti o economie di scala tutelano il settore). Item 4: FALSO (anche chi si differenzia deve mantenere una parità o prossimità di costo sostenibile).",
            trap: s.trap,
          },
          sourceRef: "Guida EOA 2026 / Slide Blocco II",
        });
        counter++;
      }
    }
  }

  return questions;
}
