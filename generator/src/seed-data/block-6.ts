import { Question } from "../types";

export const block6Questions: Question[] = [
  {
    id: "B6-MAK-BUY-001",
    version: 1,
    block: 6,
    topic: "make-or-buy",
    tags: [
      "make-or-buy",
      "costi-rilevanti",
      "costi-cessanti",
      "costi-sommersi",
      "costi-opportunita",
    ],
    track: "standard",
    difficulty: 3,
    type: "single-choice",
    stem: "Un'azienda produce internamente 10.000 schede elettroniche all'anno. I costi totali unitari interni sono: Costi variabili = 35 €/pezzo, Costi fissi specifici ammortamento macchinari dedicati (non riutilizzabili né vendibili) = 15 €/pezzo, per un totale di 50 €/pezzo. Un fornitore esterno specializzato offre di fornire le stesse schede a un prezzo di fornitura p = 42 €/pezzo. Nel breve termine, qual è la decisione economicamente corretta e perché?",
    options: [
      {
        id: "a",
        text: "Conviene acquistare dal fornitore esterno perché 42 € è inferiore al costo totale interno di 50 €",
        correct: false,
      },
      {
        id: "b",
        text: "Conviene continuare a produrre internamente (Make), perché il costo differenziale eliminabile interno (35 € variabili) è inferiore al prezzo di acquisto esterno (42 €), dato che i costi fissi dei macchinari dedicati sono sommersi e non cesserebbero",
        correct: true,
      },
      {
        id: "c",
        text: "Le due opzioni sono indifferenti perché la differenza di 7 € viene compensata dal credito IVA",
        correct: false,
      },
      {
        id: "d",
        text: "Conviene esternalizzare solo se l'impresa licenzia immediatamente tutti gli operai",
        correct: false,
      },
    ],
    explanation: {
      why: "Nelle decisioni operative di breve termine, confrontare i costi medi totali comprensivi di quote di costi fissi sommersi porta a decisioni errate che distruggono marginalità.",
      what: "La decisione Make or Buy nel breve termine si basa sull'analisi differenziale: si confrontano solo i costi 'cessanti' (quelli che realmente si eviterebbero non producendo, tipicamente i soli costi variabili) con i costi 'sorgenti' (il prezzo di fornitura). I costi fissi non eliminabili (sunk costs) continuerebbero a gravare sul bilancio anche acquistando fuori.",
      how: "Costo cessante interno = 35 €/pezzo. Costo sorgente acquisto = 42 €/pezzo. Differenziale = 35 € − 42 € = −7 € a svantaggio del Buy (acquistare all'esterno comporterebbe un danno economico netto di 70.000 €/anno).",
      trap: "Cadere nella trappola del costo pieno (full costing): includere costi fissi irrecuperabili nel confronto porta a credere erroneamente che 42 € < 50 €.",
    },
    sourceRef: "Slide Blocco VI - Decisioni di Breve Periodo e Make or Buy",
  },
  {
    id: "B6-MDC-LIVELLI-002",
    version: 1,
    block: 6,
    topic: "margine-contribuzione-livelli",
    tags: [
      "MdC-I-livello",
      "MdC-II-livello",
      "costi-fissi-specifici",
      "eliminazione-linea",
    ],
    track: "standard",
    difficulty: 2,
    type: "multi-true-false",
    stem: "In merito alla contabilità a costi variabili (Direct Costing) e alla distinzione tra Margine di Contribuzione di I e di II livello, valuta ciascuna affermazione:",
    multiTrueFalseItems: [
      {
        id: "mtf-mdc-1",
        statement:
          "Il Margine di Contribuzione di I livello (MdC I = Ricavi - Costi Variabili) misura il contributo che il prodotto o servizio offre per la copertura dell'insieme dei costi fissi aziendali.",
        isTrue: true,
      },
      {
        id: "mtf-mdc-2",
        statement:
          "Il Margine di Contribuzione di II livello si ottiene sottraendo al MdC I i Costi Fissi Comuni dell'intera organizzazione aziendale.",
        isTrue: false,
      },
      {
        id: "mtf-mdc-3",
        statement:
          "Se una linea di prodotto presenta un MdC I positivo ma un risultato netto complessivo negativo per effetto della ripartizione arbitraria di costi fissi generali, eliminarla peggiorerebbe il risultato operativo complessivo dell'azienda.",
        isTrue: true,
      },
      {
        id: "mtf-mdc-4",
        statement:
          "Un prodotto con MdC unitario negativo dovrebbe essere venduto a volumi il più elevati possibile per recuperare i margini con le economie di scala.",
        isTrue: false,
      },
    ],
    explanation: {
      why: "Permette di decidere quali prodotti spingere a catalogo e impedisce la dismissione errata di linee di prodotto che invece contribuiscono positivamente alla copertura dei costi fissi.",
      what: "MdC I = Ricavi − Costi Variabili. MdC II = MdC I − Costi Fissi Specifici della linea. Il MdC II misura il contributo netto della linea alla copertura dei Costi Fissi Comuni.",
      how: "1: Vera. 2: Falsa (al MdC I si sottraggono i costi fissi *specifici* della linea, non i costi comuni). 3: Vera (finché MdC I > costi fissi specifici eliminabili, il prodotto apporta un contributo positivo). 4: Falsa (se il margine unitario è negativo, ogni unità in più prodotta allarga la voragine delle perdite).",
      trap: "Eliminare una linea di prodotto apparentemente in perdita senza verificare se il suo MdC copre costi fissi comuni che altrimenti ricadrebbero interamente sugli altri prodotti.",
    },
    formula:
      "\\text{MdC}_I = R - CV; \\quad \\text{MdC}_{II} = \\text{MdC}_I - CFS",
    sourceRef: "Slide Blocco VI - Direct Costing e Margini di Contribuzione",
  },
  {
    id: "B6-COSTI-CLASS-003",
    version: 1,
    block: 6,
    topic: "classificazione-costi",
    tags: [
      "costi-fissi",
      "costi-variabili",
      "costi-diretti",
      "costi-indiretti",
    ],
    track: "essential",
    difficulty: 1,
    type: "multi-choice",
    stem: "Quale combinazione di criteri di classificazione dei costi aziendali è corretta?",
    options: [
      {
        id: "a",
        text: "In relazione al volume di produzione: Costi Fissi (non variano al variare della quantità prodotta nel breve periodo) e Costi Variabili (variano proporzionalmente o non linearmente con la quantità)",
        correct: true,
      },
      {
        id: "b",
        text: "In relazione all'oggetto di costo: Costi Diretti (imputabili oggettivamente e univocamente all'unità di prodotto) e Costi Indiretti (comuni a più prodotti, imputabili solo tramite basi di riparto)",
        correct: true,
      },
      {
        id: "c",
        text: "Tutti i costi fissi sono necessariamente costi indiretti, e tutti i costi variabili sono necessariamente costi diretti",
        correct: false,
      },
      {
        id: "d",
        text: "I costi fissi unitari diminuiscono all'aumentare dei volumi prodotti per effetto dell'assorbimento dei costi fissi (economie di scala)",
        correct: true,
      },
    ],
    explanation: {
      why: "La corretta tassonomia dei costi è indispensabile per non confondere il comportamento dei costi al variare del volume con la loro modalità di imputazione.",
      what: "I due assi sono ortogonali: variabilità rispetto ai volumi (Fisso vs Variabile) e modalità di imputazione rispetto all'oggetto di calcolo (Diretto vs Indiretti). Esistono costi fissi diretti (es. ammortamento di un macchinario che produce solo quel modello).",
      how: "Le opzioni corrette sono (a), (b) e (d). L'opzione (c) è un grave errore concettuale.",
      trap: "Identificare 'costo fisso' con 'costo indiretto': un canone software licenziato a canone fisso per una sola specifica linea di produzione è un costo fisso ma diretto.",
    },
    sourceRef: "Slide Blocco VI - Classificazione dei Costi",
  },
  {
    id: "B6-COS-BEP-004",
    version: 1,
    block: 6,
    topic: "break-even-analysis",
    tags: [
      "costi-fissi",
      "costi-variabili",
      "BEP",
      "quantita-pareggio",
      "numeric-input",
    ],
    track: "standard",
    difficulty: 2,
    type: "numeric-input",
    stem: "Una startup ICT sostiene costi fissi annui pari a 120.000 €. Commercializza una licenza software SaaS al prezzo unitario di 500 €, sostenendo costi variabili unitari (server cloud, supporto tecnico, commissioni di pagamento) pari a 200 € per licenza. Quante licenze software deve vendere in un anno per raggiungere il punto di pareggio (Break-Even Point in quantità)?",
    numericAnswer: {
      value: 400,
      tolerance: 0.5,
      unit: "licenze",
    },
    explanation: {
      why: "Il Break-Even Point è la soglia di sopravvivenza minima: indica quante unità vendere prima che ogni vendita successiva generi vero utile aziendale.",
      what: "La quantità di pareggio Q* si calcola dividendo i Costi Fissi Totali per il Margine di Contribuzione Unitario (MdC = Prezzo - Costo Variabile Unitario).",
      how: "MdC unitario = p − cv = 500 € − 200 € = 300 €/licenza. Q* = CF / MdC = 120.000 € / 300 € = 400 licenze.",
      trap: "Dividere i costi fissi per il prezzo di vendita anziché per il margine di contribuzione unitario (dimenticando i costi variabili).",
    },
    formula: "Q^* = \\frac{CF}{p - cv} = \\frac{CF}{MdC_u}",
    sourceRef: "Slide Blocco VI Costi e Break-Even",
  },
];
