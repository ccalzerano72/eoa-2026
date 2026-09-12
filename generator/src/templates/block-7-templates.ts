import { ParametricTemplate, Question } from "../types";
import { shuffleArray } from "../engine";

/**
 * Template 1: Customer Acquisition Cost and Lifetime Value (CAC and CLV)
 * CAC = Spese Marketing / Nuovi Clienti
 * CLV = Margine Medio Annuo * Vita Media Anni - CAC
 * Rapporto CLV / CAC
 */
export const clvCacTemplate: ParametricTemplate = {
  id: "B7-MKT-CLV-CAC",
  block: 7,
  topic: "business-model-metrics",
  tags: ["CAC", "CLV", "unit-economics", "saas", "startup"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "",
  stemTemplate:
    "Una startup SaaS spende {speseMarketing} in campagne di digital marketing e acquisisce {nuoviClienti} nuovi clienti abbonati paganti. Ciascun cliente genera un margine operativo annuo di {margineAnnuo} e rimane abbonato in media per {anniPermanenza}. Qual è il rapporto tra Customer Lifetime Value (CLV lordo = Margine annuo × Anni) e Customer Acquisition Cost (CAC)?",
  variables: {
    speseMarketing: { min: 40, max: 120, step: 10, unit: " k€", decimals: 0 },
    nuoviClienti: { min: 200, max: 600, step: 50, decimals: 0 },
    margineAnnuo: { min: 200, max: 600, step: 50, unit: "€", decimals: 0 },
    anniPermanenza: { min: 2, max: 4, step: 1, unit: " anni", decimals: 0 },
  },
  correctFormula:
    "(margineAnnuo * anniPermanenza) / ((speseMarketing * 1000) / nuoviClienti)",
  distractorFormulas: [
    "((speseMarketing * 1000) / nuoviClienti) / (margineAnnuo * anniPermanenza)", // inverted ratio
    "(margineAnnuo * anniPermanenza) / (speseMarketing / nuoviClienti)", // wrong scale for k€
    "(margineAnnuo) / ((speseMarketing * 1000) / nuoviClienti)", // 1 year only
  ],
  formulaKaTeX:
    "\\text{Rapporto} = \\frac{\\text{CLV}}{\\text{CAC}} = \\frac{\\text{Margine Annuo} \\cdot \\text{Anni}}{\\text{Spesa Marketing} / \\text{Nuovi Clienti}}",
  explanationTemplate: {
    why: "Nelle aziende digitali e nei modelli di abbonamento (SaaS), il rapporto CLV/CAC è il termometro della scalabilità economica. Un rapporto CLV/CAC ≥ 3 indica un business sano e profittevole.",
    what: "CAC = costo medio sostenuto per convertire un prospect in cliente; CLV = valore complessivo cumulato di contribuzione monetaria generato dal cliente lungo la sua relazione con l'impresa.",
    howTemplate:
      "CAC = ({speseMarketing_raw} × 1.000 €) / {nuoviClienti} clienti = {((speseMarketing_raw * 1000) / nuoviClienti_raw).toFixed(1)} €/cliente. CLV = {margineAnnuo} × {anniPermanenza} = {margineAnnuo_raw * anniPermanenza_raw} €. Rapporto CLV/CAC = {margineAnnuo_raw * anniPermanenza_raw} / {((speseMarketing_raw * 1000) / nuoviClienti_raw).toFixed(1)} = {correct}.",
    trap: "Se CLV/CAC < 1 l'azienda distrugge cassa a ogni nuovo cliente acquisito; se è tra 1 e 2 i costi di struttura renderanno il business insostenibile.",
  },
  sourceRef: "Slide Blocco VII - Metriche per Modelli di Business Digitali",
};

/**
 * Template 2: Payback Period (Tempo di Rientro dell'Investimento)
 * PBP = Investimento Iniziale / Flusso di Cassa Annuo Costante
 */
export const paybackPeriodTemplate: ParametricTemplate = {
  id: "B7-FIN-PAYBACK-PERIOD",
  block: 7,
  topic: "valutazione-investimenti",
  tags: ["payback", "tempo-rientro", "flussi-cassa", "rischio-liquidita"],
  track: "essential",
  difficulty: 1,
  type: "single-choice",
  unit: " anni",
  stemTemplate:
    "Un dipartimento IT intende automatizzare l'infrastruttura di test sostenendo un investimento iniziale immediato pari a {investimento}. L'automazione consente un risparmio annuo netto costante di costi pari a {flussoCassa}/anno. Qual è il tempo di recupero semplice (Payback Period) del progetto?",
  variables: {
    investimento: { min: 60, max: 300, step: 20, unit: " k€", decimals: 0 },
    flussoCassa: { min: 20, max: 100, step: 10, unit: " k€", decimals: 0 },
  },
  correctFormula: "investimento / flussoCassa",
  distractorFormulas: [
    "flussoCassa / investimento", // inverted
    "(investimento / flussoCassa) * 1.5",
    "(investimento - flussoCassa) / 10",
  ],
  formulaKaTeX:
    "\\text{Payback Period} = \\frac{\\text{Investimento Iniziale } (I_0)}{\\text{Flusso di Cassa Annuo } (CF)}",
  explanationTemplate: {
    why: "Il tempo di recupero semplice misura il periodo necessario affinché i flussi di cassa operativi generati dal progetto reintegrino l'esborso finanziario iniziale, fornendo una stima del rischio di liquidità.",
    what: "Rapporto tra l'esborso al tempo zero e il flusso monetario annuo costante.",
    howTemplate:
      "Payback Period = {investimento} / {flussoCassa}/anno = {correct}.",
    trap: "LIMITI GRAVI DEL PAYBACK: Ignora il valore temporale del denaro (non attualizza i flussi) e trascura completamente tutti i flussi di cassa positivi che maturano DOPO il raggiungimento del pareggio!",
  },
  sourceRef:
    "Slide Blocco VII - Valutazione degli Investimenti: Metodi Tradizionali",
};

/**
 * Template 3: Weighted Average Cost of Capital (WACC)
 * WACC = Ke * (E / (D + E)) + Kd * (1 - t) * (D / (D + E))
 */
export const waccTemplate: ParametricTemplate = {
  id: "B7-FIN-WACC-CAPITALE",
  block: 7,
  topic: "finanza-aziendale-investimenti",
  tags: ["WACC", "costo-capitale", "debito-equity", "tasso-attualizzazione"],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "%",
  stemTemplate:
    "Un'azienda quotata presenta un capitale proprio (Equity) pari a {equity} con un costo dell'equity Ke pari al {ke}, e un indebitamento finanziario netto (Debt) pari a {debt} con un costo del debito Kd del {kd}. L'aliquota d'imposta societaria sui redditi è del {aliquota}. Qual è il Costo Medio Ponderato del Capitale (WACC) dell'impresa?",
  variables: {
    equity: { min: 40, max: 80, step: 10, unit: " M€", decimals: 0 },
    debt: { min: 20, max: 60, step: 10, unit: " M€", decimals: 0 },
    ke: { min: 8, max: 14, step: 1, unit: "%", decimals: 0 },
    kd: { min: 4, max: 6, step: 0.5, unit: "%", decimals: 1 },
    aliquota: { min: 20, max: 30, step: 5, unit: "%", decimals: 0 },
  },
  correctFormula:
    "(ke * (equity / (equity + debt))) + (kd * (1 - (aliquota / 100)) * (debt / (equity + debt)))",
  distractorFormulas: [
    "(ke * (equity / (equity + debt))) + (kd * (debt / (equity + debt)))", // forgot tax shield (1 - t)
    "(ke + kd) / 2", // simple arithmetic average
    "(ke * (debt / (equity + debt))) + (kd * (equity / (equity + debt)))", // inverted weights
  ],
  formulaKaTeX:
    "WACC = K_e \\cdot \\frac{E}{D+E} + K_d \\cdot (1 - t) \\cdot \\frac{D}{D+E}",
  explanationTemplate: {
    why: "Il WACC rappresenta il rendimento minimo atteso che qualsiasi nuovo progetto di investimento aziendale deve generare per remunerare sia gli azionisti sia i creditori finanziari, costituendo il tasso di attualizzazione fondamentale per il calcolo del VAN.",
    what: "Media ponderata del costo dell'equity e del costo del debito, quest'ultimo rettificato con lo scudo fiscale (1 - t) dovuto alla deducibilità degli interessi passivi.",
    howTemplate:
      "Capitale Totale = {equity} + {debt} = {equity_raw + debt_raw} M€. Peso Equity = {equity}/{equity_raw + debt_raw} = {(equity_raw / (equity_raw + debt_raw)).toFixed(2)}. Peso Debito = {debt}/{equity_raw + debt_raw} = {(debt_raw / (equity_raw + debt_raw)).toFixed(2)}. Costo netto debito = {kd} × (1 − {aliquota}) = {(kd_raw * (1 - aliquota_raw/100)).toFixed(2)}%. WACC = {correct}.",
    trap: "Dimenticare di moltiplicare il costo del debito per lo scudo fiscale (1 - t), sovrastimando il costo effettivo del capitale.",
  },
  sourceRef: "Slide Blocco VII - Finanza d'Impresa e Costo del Capitale",
};

export const block7Templates = [
  clvCacTemplate,
  paybackPeriodTemplate,
  waccTemplate,
];

/**
 * Combinatorial question generator for Blocco 7
 */
export function generateBlock7CombinatorialQuestions(): Question[] {
  const questions: Question[] = [];

  const bmcFinanceConcepts = [
    {
      concept:
        "Business Model Canvas: Value Proposition e Segmenti di Clientela",
      trueStatement:
        "Nel Business Model Canvas di Osterwalder la Value Proposition descrive l'insieme dei prodotti e servizi che creano valore per uno specifico segmento di clientela, risolvendo un problema concreto o soddisfacendo un bisogno.",
      falseStatement:
        "Nel Business Model Canvas la Value Proposition corrisponde unicamente all'elenco dei costi operativi di produzione e alle specifiche del database.",
      why: "Comprendere che l'innovazione tecnologica deve agganciarsi a una proposta di valore rilevante per un target definito.",
      what: "Canvas: strumento visuale a 9 blocchi che mappa creazione, distribuzione e cattura del valore.",
      how: "Allineare problema del cliente (pain), benefici attesi (gain) e caratteristiche della soluzione offerta.",
      trap: "Progettare una soluzione brillante che non risolve alcun problema reale per il quale i clienti siano disposti a pagare.",
    },
    {
      concept: "Valore Attuale Netto (VAN / NPV) come criterio decisionale",
      trueStatement:
        "Il Valore Attuale Netto (VAN) è il criterio economico sovrano per la valutazione degli investimenti: un progetto crea valore per gli azionisti ed è finanziariamente accettabile se e solo se il suo VAN attualizzato al costo del capitale è strettamente positivo (VAN > 0).",
      falseStatement:
        "Un progetto con VAN negativo pari a -200.000 € deve essere approvato se il Payback Period è inferiore a un anno.",
      why: "Padroneggiare la matematica finanziaria delle decisioni di capital budgeting a lungo termine.",
      what: "VAN = somma algebrica di tutti i flussi di cassa futuri attualizzati al tempo presente meno l'investimento iniziale.",
      how: "Attualizzare ciascun flusso usando il WACC come tasso di sconto: CF_t / (1+r)^t.",
      trap: "Il Payback Period non sostituisce il VAN: un progetto può ripagarsi in 6 mesi ma distruggere valore se subisce perdite enormi negli anni successivi.",
    },
    {
      concept: "Proprietà Intellettuale: Brevetti vs Segreto Industriale",
      trueStatement:
        "Un brevetto per invenzione industriale conferisce un monopolio temporaneo di sfruttamento economico (in genere 20 anni) a fronte della divulgazione pubblica dell'invenzione, purché soddisfi i requisiti di novità, attività inventiva e applicazione industriale.",
      falseStatement:
        "Il brevetto protegge automaticamente l'invenzione per 100 anni senza richiedere alcuna descrizione tecnica né il pagamento di tasse di mantenimento.",
      why: "Tutelare il valore degli asset immateriali e degli sviluppi R&D nell'ingegneria del software e dell'hardware.",
      what: "Brevetto = tutela forte a tempo determinato con divulgazione; Segreto industriale = tutela potenzialmente perpetua ma vulnerabile a reverse engineering o fuga di notizie.",
      how: "Valutare il trade-off: brevettare o mantenere segreto l'algoritmo (es. formula Coca-Cola o PageRank iniziale).",
      trap: "I software 'puri' e i modelli matematici astratti non sono brevettabili come tali in Europa (tutelati dal diritto d'autore), a meno che non producano un effetto tecnico tangibile.",
    },
    {
      concept: "Metriche Startup: Churn Rate e Runway",
      trueStatement:
        "Il Churn Rate misura la percentuale di clienti che abbandonano il servizio in un dato periodo, mentre la Runway indica i mesi di sopravvivenza finanziaria residui prima dell'esaurimento della cassa disponibile (Cassa / Burn Rate mensile).",
      falseStatement:
        "Un Churn Rate del 50% mensile in un'app SaaS è il valore ottimale per garantire la crescita esponenziale del business.",
      why: "Monitorare la sostenibilità e la sopravvivenza delle iniziative imprenditoriali innovative ad alto rischio.",
      what: "Burn Rate = cassa bruciata ogni mese per coprire i costi operativi prima del pareggio; Runway = tempo a disposizione per chiudere un nuovo round o raggiungere il break-even.",
      how: "Runway (mesi) = Saldo Cassa Attuale / Spesa Netta Mensile.",
      trap: "Se il Churn Rate è troppo alto, aumentare la spesa di marketing è come versare acqua in un secchio bucato: non salverà la startup.",
    },
    {
      concept: "TIR (Tasso Interno di Rendimento) vs VAN",
      trueStatement:
        "Il TIR è il tasso di attualizzazione che azzera il Valore Attuale Netto del progetto (VAN = 0); in caso di progetti mutuamente esclusivi con scale o profili temporali differenti, il criterio del VAN deve sempre prevalere sul TIR.",
      falseStatement:
        "Il TIR è sempre superiore al VAN e non risente mai di ambiguità di calcolo o tassi multipli in flussi non convenzionali.",
      why: "Evitare classificazioni errate tra progetti di investimento alternativi.",
      what: "Il TIR esprime un rendimento percentuale; il VAN esprime l'incremento assoluto di ricchezza monetaria creato.",
      how: "Se TIR > WACC il progetto è conveniente; ma se si deve scegliere tra due alternative, si sceglie quella con il VAN più alto.",
      trap: "Un progetto con TIR del 50% su 1.000 € genera meno valore di un progetto con TIR del 20% su 1.000.000 €!",
    },
  ];

  let counter = 1;
  for (let round = 1; round <= 25; round++) {
    for (const b of bmcFinanceConcepts) {
      const isTrueQ = (round + counter) % 2 === 0;
      // 1. True/False
      questions.push({
        id: `B7-COMB-TF-${String(counter).padStart(4, "0")}`,
        version: 1,
        block: 7,
        topic: "business-model-finanza",
        tags: [
          "business-model",
          "canvas",
          "valutazione-investimenti",
          "van",
          "startup",
        ],
        track: "essential",
        difficulty: 1,
        type: "true-false",
        stem: `Valuta la veridicità della seguente affermazione riguardante "${b.concept}":\n\n«${isTrueQ ? b.trueStatement : b.falseStatement}»`,
        options: [
          { id: "a", text: "Vero", correct: isTrueQ },
          { id: "b", text: "Falso", correct: !isTrueQ },
        ],
        explanation: {
          why: b.why,
          what: b.what,
          how: isTrueQ
            ? `VERO. ${b.how}`
            : `FALSO. Affermazione corretta: ${b.trueStatement}`,
          trap: b.trap,
        },
        sourceRef:
          "Slide Blocco VII - Business Model e Valutazione Investimenti",
      });
      counter++;

      // 2. Single-choice
      questions.push({
        id: `B7-COMB-SC-${String(counter).padStart(4, "0")}`,
        version: 1,
        block: 7,
        topic: "decisioni-finanziarie-innovazione",
        tags: ["finanza", "investimenti", "innovazione"],
        track: "standard",
        difficulty: 2,
        type: "single-choice",
        stem: `Quale delle seguenti affermazioni descrive in modo rigoroso e corretto "${b.concept}"? (Variante #${round})`,
        options: shuffleArray([
          { id: "a", text: b.trueStatement, correct: true },
          { id: "b", text: b.falseStatement, correct: false },
          {
            id: "c",
            text: "Gli investimenti ad alto rischio tecnologico devono sempre essere valutati ignorando i flussi di cassa futuri.",
            correct: false,
          },
          {
            id: "d",
            text: "Il modello Canvas è applicabile solo a imprese tradizionali escludendo ogni forma di business digitale.",
            correct: false,
          },
        ]),
        explanation: {
          why: b.why,
          what: b.what,
          how: `Opzione corretta: ${b.trueStatement}`,
          trap: b.trap,
        },
        sourceRef: "EOA 2026 - Modelli di Business e Finanza",
      });
      counter++;

      // 3. Multi-True-False
      if (round % 2 === 0) {
        questions.push({
          id: `B7-COMB-MTF-${String(counter).padStart(4, "0")}`,
          version: 1,
          block: 7,
          topic: "valutazione-strategico-finanziaria",
          tags: ["multi-tf", "finanza", "canvas-investimenti"],
          track: "advanced",
          difficulty: 3,
          type: "multi-true-false",
          stem: `In merito a "${b.concept}" e alle dinamiche economico-finanziarie (Caso studio #${round}), valuta se ciascuna proposizione è Vera o Falsa:`,
          multiTrueFalseItems: [
            { id: "item-1", statement: b.trueStatement, isTrue: true },
            { id: "item-2", statement: b.falseStatement, isTrue: false },
            {
              id: "item-3",
              statement:
                "Il costo del capitale di rischio (Ke) è generalmente superiore al costo del debito (Kd) per riflettere il maggior rischio sopportato dagli azionisti.",
              isTrue: true,
            },
            {
              id: "item-4",
              statement:
                "Nel Business Model Canvas le 'Attività Chiave' e i 'Flussi di Ricavi' sono sinonimi intercambiabili.",
              isTrue: false,
            },
          ],
          explanation: {
            why: b.why,
            what: b.what,
            how: "Item 1: VERO. Item 2: FALSO. Item 3: VERO (premio per il rischio dell'equity). Item 4: FALSO (le attività chiave descrivono cosa fa l'impresa per creare valore, i ricavi descrivono le modalità di incasso monetario dai clienti).",
            trap: b.trap,
          },
          sourceRef: "Guida EOA 2026 / Slide Blocco VII",
        });
        counter++;
      }
    }
  }

  return questions;
}
