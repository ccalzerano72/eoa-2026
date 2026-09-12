import { ParametricTemplate, Question } from "../types";

/**
 * Template 1: Reclassified Income Statement - Value Added and EBITDA (MOL)
 * VA = VP - CA_e
 * MOL = VA - CL
 * RO = MOL - Amm - Acc
 */
export const valueAddedEbitdaTemplate: ParametricTemplate = {
  id: "B4-BIL-VALORE-AGGIUNTO-MOL",
  block: 4,
  topic: "riclassificazione-conto-economico",
  tags: [
    "valore-aggiunto",
    "MOL",
    "EBITDA",
    "reddito-operativo",
    "conto-economico",
  ],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "€",
  stemTemplate:
    "Dai dati del bilancio riclassificato di una software enterprise emergono: Valore della Produzione pari a {vp} €, Costi per acquisto di materie prime e servizi esterni pari a {cae} €, Costo del personale dipendente pari a {cl} €, Ammortamenti pari a {amm} €. Qual è il Margine Operativo Lordo (MOL / EBITDA)?",
  variables: {
    vp: { min: 800000, max: 2500000, step: 50000, unit: "€", decimals: 0 },
    cae: { min: 200000, max: 700000, step: 20000, unit: "€", decimals: 0 },
    cl: { min: 300000, max: 1000000, step: 20000, unit: "€", decimals: 0 },
    amm: { min: 40000, max: 150000, step: 10000, unit: "€", decimals: 0 },
  },
  constraints: ["vp - cae > cl", "vp - cae - cl > amm"],
  correctFormula: "vp - cae - cl",
  distractorFormulas: [
    "vp - cae", // Valore Aggiunto (forgot labor cost)
    "vp - cae - cl - amm", // Reddito Operativo (deducted depreciation)
    "vp - cl", // forgot external services
  ],
  formulaKaTeX: "MOL = (VP - CA_e) - CL = VA - CL",
  explanationTemplate: {
    why: "Il Margine Operativo Lordo (MOL / EBITDA) è l'indicatore fondamentale della capacità della gestione caratteristica di generare cassa potenziale prima delle politiche contabili di ammortamento e degli oneri finanziari.",
    what: "Il Valore Aggiunto misura la ricchezza creata sottraendo al valore prodotto i consumi di beni e servizi esterni. Detraendo le retribuzioni del lavoro dipendente si ottiene il MOL.",
    howTemplate:
      "Valore Aggiunto = {vp} € − {cae} € = {vp_raw - cae_raw} €. MOL = {vp_raw - cae_raw} € − {cl} € = {correct} €.",
    trap: "NON dedurre gli ammortamenti per calcolare il MOL (EBITDA = Earnings BEFORE Interest, Taxes, Depreciation, and Amortization). Dedurre gli ammortamenti dà il Reddito Operativo (EBIT).",
  },
  sourceRef:
    "Slide Blocco IV - Riclassificazione del Conto Economico a Valore Aggiunto",
};

/**
 * Template 2: Straight-line Depreciation and Net Book Value (Ammortamento e Valore Netto Contabile)
 * Quota = (Costo - Residuo) / Anni
 * VNC = Costo - (Quota * t)
 */
export const straightLineDepreciationTemplate: ParametricTemplate = {
  id: "B4-BIL-AMMORTAMENTO-VNC",
  block: 4,
  topic: "principi-redazione-bilancio",
  tags: [
    "ammortamento",
    "costo-storico",
    "valore-netto-contabile",
    "competenza",
  ],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "€",
  stemTemplate:
    "Un'azienda acquista un server cluster per il cloud computing a un costo storico di {costoStorico} €, con una vita utile stimata di {vitaUtile} anni e un valore residuo finale stimato pari a {valoreResiduo} €. Adottando il piano di ammortamento civilistico a quote costanti, qual è il Valore Netto Contabile (VNC) del server iscritto nello Stato Patrimoniale al termine del {annoValutazione}° anno di utilizzo?",
  variables: {
    costoStorico: {
      min: 40000,
      max: 120000,
      step: 5000,
      unit: "€",
      decimals: 0,
    },
    vitaUtile: { min: 4, max: 6, step: 1, decimals: 0 },
    valoreResiduo: { min: 0, max: 10000, step: 2000, unit: "€", decimals: 0 },
    annoValutazione: { min: 2, max: 3, step: 1, decimals: 0 },
  },
  constraints: ["annoValutazione < vitaUtile", "costoStorico > valoreResiduo"],
  correctFormula:
    "costoStorico - (((costoStorico - valoreResiduo) / vitaUtile) * annoValutazione)",
  distractorFormulas: [
    "((costoStorico - valoreResiduo) / vitaUtile) * annoValutazione", // Fondo ammortamento, not VNC
    "costoStorico - ((costoStorico / vitaUtile) * annoValutazione)", // forgot residual value
    "costoStorico - ((costoStorico - valoreResiduo) / vitaUtile)", // 1 year only
  ],
  formulaKaTeX:
    "VNC_t = \\text{Costo Storico} - t \\cdot \\frac{\\text{Costo Storico} - \\text{Valore Residuo}}{\\text{Vita Utile}}",
  explanationTemplate: {
    why: "L'ammortamento ripartisce il costo pluriennale di un bene durevole lungo gli esercizi in cui cede la propria utilità economica, in conformità al principio di competenza economica.",
    what: "Il Valore Netto Contabile (VNC) è la frazione di costo storico non ancora ammortizzata, che residua come valore patrimoniale iscritto nell'Attivo dello Stato Patrimoniale.",
    howTemplate:
      "Quota annua = ({costoStorico} € − {valoreResiduo} €) / {vitaUtile} anni = {((costoStorico_raw - valoreResiduo_raw) / vitaUtile_raw)} €/anno. Fondo ammortamento al {annoValutazione}° anno = {(((costoStorico_raw - valoreResiduo_raw) / vitaUtile_raw) * annoValutazione_raw)} €. VNC = {costoStorico} € − {(((costoStorico_raw - valoreResiduo_raw) / vitaUtile_raw) * annoValutazione_raw)} € = {correct} €.",
    trap: "Non confondere la quota di ammortamento (costo di competenza nel Conto Economico) con il VNC o con il Fondo Ammortamento (valori cumulati dello Stato Patrimoniale).",
  },
  sourceRef: "Slide Blocco IV - Le Immobilizzazioni e l'Ammortamento",
};

/**
 * Template 3: Accruals and Deferrals (Ratei e Risconti Attivi/Passivi)
 * Calcolo quota di competenza vs quota riscontata
 */
export const accrualsDeferralsTemplate: ParametricTemplate = {
  id: "B4-BIL-RATEI-RISCONTI",
  block: 4,
  topic: "principio-competenza",
  tags: [
    "risconti",
    "competenza-economica",
    "manifestazione-finanziaria",
    "scritture-rettifica",
  ],
  track: "standard",
  difficulty: 2,
  type: "single-choice",
  unit: "€",
  stemTemplate:
    "Il 1° novembre dell'anno T un'impresa paga anticipatamente a mezzo bonifico bancario un canone di locazione semestrale pari a {canoneSemestrale} € relativo al periodo 01/11/T – 30/04/T+1. In applicazione del principio di competenza economica, quale valore deve essere iscritto a Risconto Attivo al 31/12/T?",
  variables: {
    canoneSemestrale: {
      min: 6000,
      max: 24000,
      step: 1200,
      unit: "€",
      decimals: 0,
    },
  },
  correctFormula: "(canoneSemestrale / 6) * 4",
  distractorFormulas: [
    "(canoneSemestrale / 6) * 2", // competenza anno T (costo a CE), not risconto
    "canoneSemestrale", // entire payment
    "(canoneSemestrale / 6) * 3", // wrong months (3 instead of 4)
  ],
  formulaKaTeX:
    "\\text{Risconto Attivo} = \\frac{\\text{Canone Complessivo}}{6} \\cdot 4 \\text{ mesi (T+1)}",
  explanationTemplate: {
    why: "I risconti attivi consentono di sospendere costi già pagati finanziariamente nell'esercizio ma la cui utilità economica maturerà negli esercizi futuri, rispettando il principio di competenza.",
    what: "Il periodo totale è di 6 mesi (novembre-aprile). 2 mesi (novembre e dicembre) sono di competenza dell'anno T e vanno a Conto Economico. I restanti 4 mesi (gennaio-aprile) competono all'anno T+1 e formano il Risconto Attivo nello Stato Patrimoniale.",
    howTemplate:
      "Canone mensile = {canoneSemestrale} € / 6 = {canoneSemestrale_raw / 6} €/mese. Quota anno T+1 da rinviare al futuro = {canoneSemestrale_raw / 6} €/mese × 4 mesi = {correct} €.",
    trap: "La trappola classica è calcolare la quota dei 2 mesi dell'anno corrente anziché i 4 mesi di competenza futura da iscrivere a Risconto Attivo!",
  },
  sourceRef: "Slide Blocco IV - Scritture di Assestamento: Ratei e Risconti",
};

export const block4Templates = [
  valueAddedEbitdaTemplate,
  straightLineDepreciationTemplate,
  accrualsDeferralsTemplate,
];

/**
 * Combinatorial question generator for Blocco 4
 */
export function generateBlock4CombinatorialQuestions(): Question[] {
  const questions: Question[] = [];

  const accountingConcepts = [
    {
      concept: "Principio di Competenza Economica",
      trueStatement:
        "Secondo il principio di competenza economica, i costi e i ricavi devono essere imputati all'esercizio a cui si riferiscono economicamente (quando i servizi sono resi o i beni ceduti), a prescindere dal momento in cui avviene l'incasso o il pagamento monetario.",
      falseStatement:
        "Nel bilancio d'esercizio civilistico vige il principio di cassa: un costo viene iscritto a Conto Economico solo ed esclusivamente quando il relativo importo è stato effettivamente addebitato sul conto corrente bancario.",
      why: "Comprendere che l'utile contabile misura l'efficacia economica del periodo e non la liquidità di cassa.",
      what: "Separazione netta tra ciclo economico (costi/ricavi) e ciclo finanziario/monetario (uscite/entrate).",
      how: "Riconoscere ricavi quando scambiati e costi quando correlati ai ricavi generati.",
      trap: "CONFUSIONE MORTALE: Credere che avere un utile di 100.000 € significhi avere 100.000 € di denaro contante in banca.",
    },
    {
      concept: "Principio di Prudenza",
      trueStatement:
        "In base al principio di prudenza si devono contabilizzare le perdite e i rischi presunti o probabili anche se non definitivamente realizzati, mentre gli utili possono essere iscritti solo se effettivamente realizzati entro la chiusura dell'esercizio.",
      falseStatement:
        "Il principio di prudenza prescrive di registrare immediatamente gli utili sperati e previsti per il prossimo triennio al fine di mostrare un patrimonio solido agli investitori.",
      why: "Evitare l'annacquamento del capitale e la distribuzione di utili fittizi agli azionisti.",
      what: "Asimmetria di trattamento: pessimismo razionale a tutela dell'integrità del capitale sociale e dei creditori.",
      how: "Stanziare fondi rischi e svalutazioni crediti/rimanenze; vietare la rivalutazione speculativa degli asset.",
      trap: "Non si possono iscrivere plusvalenze latenti su beni immateriali solo perché 'il mercato li pagherebbe di più'.",
    },
    {
      concept: "Rimanenze Finali di Magazzino nel Conto Economico",
      trueStatement:
        "Nel Conto Economico a valore della produzione, la voce 'Variazione delle rimanenze di prodotti in corso di lavorazione, semilavorati e finiti' rettifica i costi di periodo, sommandosi positivamente ai ricavi se le rimanenze finali superano quelle iniziali (produzione per il magazzino).",
      falseStatement:
        "Le rimanenze finali di magazzino rappresentano una perdita secca di liquidità che deve essere registrata unicamente tra gli oneri straordinari del Conto Economico.",
      why: "Comprendere la corretta correlazione tra costi sostenuti e produzione effettivamente ottenuta nel periodo.",
      what: "Se ho prodotto 100 ma venduto solo 80, i costi sostenuti per produrre i 20 ancora a magazzino non devono deprimere l'utile del periodo.",
      how: "Valore della Produzione = Vendite + Variazione Rimanenze (RF - RI).",
      trap: "Un aumento di magazzino fa salire il Valore della Produzione e l'Utile contabile, ma assorbe cassa!",
    },
    {
      concept: "Stato Patrimoniale vs Conto Economico",
      trueStatement:
        "Lo Stato Patrimoniale fotografa la situazione stock delle attività, passività e patrimonio netto a una data precisa (31/12); il Conto Economico descrive il flusso dinamico dei ricavi e dei costi generati lungo l'intero arco temporale dell'esercizio.",
      falseStatement:
        "Lo Stato Patrimoniale e il Conto Economico sono documenti identici che riportano le stesse grandezze misurate con le stesse unità di misura temporale.",
      why: "Padroneggiare la struttura logica del bilancio civilistico (art. 2424 e 2425 c.c.).",
      what: "Stock (fotografia istantanea della ricchezza) vs Flusso (film della gestione annuale).",
      how: "Il risultato d'esercizio del CE (utile/perdita) confluisce come variazione del Patrimonio Netto nello SP.",
      trap: "Non confondere voci di flusso (es. ammortamento, fatturato) con voci di stock (es. fondo ammortamento, crediti commerciali residui).",
    },
    {
      concept: "Capitale Circolante Netto Operativo (CCNO)",
      trueStatement:
        "Il CCNO è dato da Crediti Commerciali + Rimanenze di Magazzino - Debiti Commerciali verso fornitori; un incremento del CCNO indica che l'impresa sta assorbendo cassa per finanziare il ciclo operativo.",
      falseStatement:
        "Il Capitale Circolante Netto include unicamente la liquidità depositata sui conti correnti bancari.",
      why: "Diagnosticare il fabbisogno finanziario generato dalla crescita del fatturato ('Growth eats cash').",
      what: "CCNO = investimenti a breve termine strettamente legati al ciclo acquisto-produzione-vendita.",
      how: "Se aumentano le scorte o i crediti verso clienti senza che aumentino i debiti fornitori, la cassa diminuisce.",
      trap: "Crescere di fatturato senza presidiare il CCNO porta rapidamente all'insolvenza per crisi di liquidità.",
    },
  ];

  let counter = 1;
  for (let round = 1; round <= 25; round++) {
    for (const a of accountingConcepts) {
      const isTrueQ = (round + counter) % 2 === 0;
      // 1. True/False
      questions.push({
        id: `B4-COMB-TF-${String(counter).padStart(4, "0")}`,
        version: 1,
        block: 4,
        topic: "principi-bilancio",
        tags: ["bilancio", "contabilita", "oic", "principi-contabili"],
        track: "essential",
        difficulty: 1,
        type: "true-false",
        stem: `Valuta la seguente affermazione su "${a.concept}":\n\n«${isTrueQ ? a.trueStatement : a.falseStatement}»`,
        options: [
          { id: "a", text: "Vero", correct: isTrueQ },
          { id: "b", text: "Falso", correct: !isTrueQ },
        ],
        explanation: {
          why: a.why,
          what: a.what,
          how: isTrueQ
            ? `VERO. ${a.how}`
            : `FALSO. Affermazione corretta: ${a.trueStatement}`,
          trap: a.trap,
        },
        sourceRef: "Slide Blocco IV - Bilancio d'Esercizio OIC",
      });
      counter++;

      // 2. Single-choice
      questions.push({
        id: `B4-COMB-SC-${String(counter).padStart(4, "0")}`,
        version: 1,
        block: 4,
        topic: "interpretazione-bilancio",
        tags: ["bilancio", "riclassificazione", "analisi-contabile"],
        track: "standard",
        difficulty: 2,
        type: "single-choice",
        stem: `In sede di redazione e lettura del bilancio d'esercizio, quale principio definisce correttamente "${a.concept}"? (Test #${round})`,
        options: [
          { id: "a", text: a.trueStatement, correct: true },
          { id: "b", text: a.falseStatement, correct: false },
          {
            id: "c",
            text: "Tutti i beni aziendali devono essere valutati al presunto valore di cessione forzata in asta.",
            correct: false,
          },
          {
            id: "d",
            text: "Il risultato economico finale prescinde dalla distinzione tra gestione caratteristica e finanziaria.",
            correct: false,
          },
        ].sort(() => Math.random() - 0.5),
        explanation: {
          why: a.why,
          what: a.what,
          how: `Opzione esatta: ${a.trueStatement}`,
          trap: a.trap,
        },
        sourceRef: "Dispensa Bilancio d'Esercizio",
      });
      counter++;

      // 3. Multi-True-False
      if (round % 2 === 0) {
        questions.push({
          id: `B4-COMB-MTF-${String(counter).padStart(4, "0")}`,
          version: 1,
          block: 4,
          topic: "diagnosi-contabile-avanzata",
          tags: ["multi-tf", "bilancio", "contabilita-oic"],
          track: "advanced",
          difficulty: 3,
          type: "multi-true-false",
          stem: `In merito a "${a.concept}" e alle norme di corretta redazione del bilancio civilistico (Caso #${round}), valuta ciascuna affermazione:`,
          multiTrueFalseItems: [
            { id: "item-1", statement: a.trueStatement, isTrue: true },
            { id: "item-2", statement: a.falseStatement, isTrue: false },
            {
              id: "item-3",
              statement:
                "Il principio della continuità della gestione (going concern) presuppone che l'azienda continui a operare nel prevedibile futuro e non sia in liquidazione.",
              isTrue: true,
            },
            {
              id: "item-4",
              statement:
                "Le immobilizzazioni immateriali e materiali sono iscritte nell'attivo circolante perché possono essere liquidate entro pochi giorni.",
              isTrue: false,
            },
          ],
          explanation: {
            why: a.why,
            what: a.what,
            how: "Item 1: VERO. Item 2: FALSO. Item 3: VERO (pilastro della valutazione al costo storico). Item 4: FALSO (sono iscritte nell'attivo immobilizzato in quanto fattori a fecondità ripetuta durevoli).",
            trap: a.trap,
          },
          sourceRef: "Guida EOA 2026 / Slide Blocco IV",
        });
        counter++;
      }
    }
  }

  return questions;
}
