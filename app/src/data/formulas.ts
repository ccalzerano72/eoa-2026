export interface FormulaItem {
  id: string;
  name: string;
  block: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  topic: string;
  formulaKaTeX: string;
  unit?: string;
  description: string;
  variables: { symbol: string; meaning: string; unit?: string }[];
  why: string;
  what: string;
  how: string;
  trap?: string;
  tags: string[];
}

export const formulasData: FormulaItem[] = [
  // BLOCCO 1
  {
    id: "f-prod-lavoro",
    name: "Produttività del Lavoro",
    block: 1,
    topic: "efficienza-produttivita",
    formulaKaTeX:
      "\\text{Prod}_L = \\frac{\\text{Output}}{\\text{Ore Lavoro}} = \\frac{\\text{Fatturato}}{\\text{N. Dipendenti}}",
    unit: "€/addetto o unità/ora",
    description:
      "Misura l'intensità di valore o di output fisico generata per unità di lavoro umano impiegato.",
    variables: [
      {
        symbol: "Output / Fatturato",
        meaning: "Valore della produzione o ricavi generati nel periodo",
        unit: "€ o unità",
      },
      {
        symbol: "Input Lavoro",
        meaning: "Ore lavorate complessive o organico medio equivalente",
        unit: "ore o dipendenti",
      },
    ],
    why: "Permette di misurare l'efficienza interna dell'organizzazione e confrontarsi con i benchmark di settore per capire se la forza lavoro è valorizzata al meglio.",
    what: "Rapporto parziale di produttività che esprime il rendimento del fattore produttivo umano.",
    how: "Dividere il fatturato o le unità prodotte per il numero di dipendenti a tempo pieno.",
    trap: "Un'alta produttività per dipendente non garantisce utili se i costi generali fissi o i materiali sono sproporzionati.",
    tags: ["produttivita", "lavoro", "efficienza", "blocco-1"],
  },
  {
    id: "f-prod-capitale",
    name: "Produttività del Capitale Investito",
    block: 1,
    topic: "efficienza-produttivita",
    formulaKaTeX:
      "\\text{Prod}_K = \\frac{\\text{Valore Aggiunto}}{\\text{Capitale Investito}} \\cdot 100",
    unit: "%",
    description:
      "Capacità del capitale investito (impianti, tecnologia, circolante) di generare valore aggiunto.",
    variables: [
      {
        symbol: "Valore Aggiunto",
        meaning:
          "Ricchezza creata al netto dei consumi intermedi di beni e servizi",
        unit: "€",
      },
      {
        symbol: "Capitale Investito",
        meaning: "Totale delle risorse patrimoniali operative impiegate",
        unit: "€",
      },
    ],
    why: "Valutare quanto rendono le immobilizzazioni e gli investimenti tecnologici in termini di ricchezza incrementale generata.",
    what: "Indice parziale che misura l'intensità di creazione di valore rispetto alla dotazione di capitale.",
    how: "Dividere il Valore Aggiunto per il Capitale Investito totale e moltiplicare per 100.",
    trap: "Il capitale investito include anche il capitale circolante operativo, non solo i macchinari e i computer.",
    tags: ["produttivita", "capitale", "valore-aggiunto", "blocco-1"],
  },
  {
    id: "f-costo-opportunita",
    name: "Costo Opportunità di un Progetto",
    block: 1,
    topic: "costo-opportunita",
    formulaKaTeX:
      "\\text{Costo Opportunità} = (\\text{Capitale} \\cdot i) + \\text{Mancata Retribuzione}",
    unit: "€",
    description:
      "Valore della migliore alternativa a cui si rinuncia impiegando risorse proprie in un'iniziativa.",
    variables: [
      {
        symbol: "Capitale proprio",
        meaning: "Fondi propri investiti nell'iniziativa",
        unit: "€",
      },
      {
        symbol: "i",
        meaning:
          "Rendimento privo di rischio o di investimenti alternativi equivalenti",
        unit: "%",
      },
      {
        symbol: "Mancata Retribuzione",
        meaning: "Stipendio da lavoro dipendente a cui si rinuncia",
        unit: "€/anno",
      },
    ],
    why: "Nessun progetto è conveniente se non rende almeno quanto la migliore alternativa scartata a parità di rischio.",
    what: "Concetto fondante dell'economia: costo implicito non registrato in contabilità ordinaria.",
    how: "Sommare gli interessi alternativi del capitale e il reddito da lavoro a cui si è rinunciato.",
    trap: "Gli ingegneri considerano solo le uscite vive di cassa; gli economisti considerano sempre anche i costi opportunità del tempo e del capitale.",
    tags: ["costo-opportunita", "decisione", "imprenditorialita", "blocco-1"],
  },

  // BLOCCO 2
  {
    id: "f-qmr-bcg",
    name: "Quota di Mercato Relativa (Matrice BCG)",
    block: 2,
    topic: "vantaggio-competitivo",
    formulaKaTeX:
      "QMR = \\frac{\\text{Fatturato Impresa}}{\\text{Fatturato Leader di Mercato}}",
    unit: "adimensionale",
    description:
      "Rapporto tra la quota di mercato dell'azienda e quella del primo concorrente leader del settore.",
    variables: [
      {
        symbol: "Fatturato Impresa",
        meaning: "Vendite realizzate dall'azienda nel settore",
        unit: "€",
      },
      {
        symbol: "Fatturato Leader",
        meaning: "Vendite realizzate dall'azienda leader di mercato",
        unit: "€",
      },
    ],
    why: "Identifica la forza competitiva e il potenziale di generazione di cassa secondo il modello Boston Consulting Group.",
    what: "Se QMR > 1 l'azienda è leader. Combinata con la crescita del mercato classifica il business in: Cash Cow, Star, Question Mark, Dog.",
    how: "Dividere il proprio fatturato per il fatturato dell'azienda prima in classifica.",
    trap: "Non confondere la quota di mercato assoluta (% sul totale mercato) con la quota relativa (rapporto con il leader).",
    tags: ["BCG", "quota-mercato", "strategia", "blocco-2"],
  },
  {
    id: "f-curva-esperienza",
    name: "Curva di Esperienza (Apprendimento)",
    block: 2,
    topic: "economie-scala-esperienza",
    formulaKaTeX: "C_{2n} = C_n \\cdot (1 - \\lambda)",
    unit: "€/unità",
    description:
      "Riduzione percentuale del costo unitario del prodotto a ogni raddoppio della produzione cumulata storica.",
    variables: [
      {
        symbol: "C_n",
        meaning: "Costo unitario attuale al volume cumulato n",
        unit: "€",
      },
      {
        symbol: "\\lambda",
        meaning: "Tasso di apprendimento (progress ratio = 1 - lambda)",
        unit: "%",
      },
      {
        symbol: "C_{2n}",
        meaning: "Costo unitario al volume cumulato raddoppiato 2n",
        unit: "€",
      },
    ],
    why: "Spiega perché i pionieri che accumulano volumi prima dei concorrenti acquisiscono un vantaggio di costo incolmabile.",
    what: "Legge empirica dell'apprendimento: ripetere le attività migliora l'efficienza, riduce gli scarti e ottimizza il design.",
    how: "A ogni raddoppio moltiplicare il costo unitario precedente per (1 - tasso di apprendimento).",
    trap: "La curva di esperienza riguarda la produzione CUMULATA storica negli anni, non la capacità produttiva istantanea dell'impianto (economie di scala).",
    tags: ["curva-esperienza", "costo-unitario", "apprendimento", "blocco-2"],
  },
  {
    id: "f-elasticita-domanda",
    name: "Elasticità della Domanda al Prezzo",
    block: 2,
    topic: "analisi-domanda-prezzo",
    formulaKaTeX:
      "\\varepsilon = \\left| \\frac{\\%\\Delta Q}{\\%\\Delta P} \\right| = \\frac{\\Delta Q / Q}{\\Delta P / P}",
    unit: "adimensionale",
    description:
      "Reattività percentuale della quantità richiesta dai consumatori a fronte di una variazione percentuale del prezzo.",
    variables: [
      {
        symbol: "%Delta Q",
        meaning: "Variazione percentuale della quantità venduta",
        unit: "%",
      },
      {
        symbol: "%Delta P",
        meaning: "Variazione percentuale del prezzo di vendita",
        unit: "%",
      },
    ],
    why: "Regola fondamentale per le politiche di prezzo: se e < 1 aumentare il prezzo fa salire i ricavi totali; se e > 1 li fa scendere.",
    what: "Domanda anelastica (e < 1): beni primari o differenziati; Domanda elastica (e > 1): beni standard con molti sostituti.",
    how: "Dividere la percentuale di calo delle vendite per la percentuale di rincaro del prezzo.",
    trap: "L'elasticità è un valore adimensionale e viene convenzionalmente considerata in valore assoluto.",
    tags: ["elasticita", "prezzo", "pricing", "domanda", "blocco-2"],
  },

  // BLOCCO 3
  {
    id: "f-startup-postmoney",
    name: "Valutazione Post-Money e Quota Investitore",
    block: 3,
    topic: "governance-startup-funding",
    formulaKaTeX:
      "V_{\\text{post}} = V_{\\text{pre}} + I, \\quad \\%_{\\text{investitore}} = \\frac{I}{V_{\\text{post}}} \\cdot 100",
    unit: "%",
    description:
      "Calcolo del valore societario dopo l'iniezione di nuovo capitale e della percentuale di equity spettante all'investitore.",
    variables: [
      {
        symbol: "V_pre",
        meaning: "Valutazione dell'azienda concordata prima del round",
        unit: "€",
      },
      {
        symbol: "I",
        meaning: "Capitale monetario iniettato dal fondo (aumento di capitale)",
        unit: "€",
      },
      {
        symbol: "V_post",
        meaning: "Valutazione complessiva dell'azienda dopo l'investimento",
        unit: "€",
      },
    ],
    why: "Determina la governance, i diritti di voto e la diluizione della quota dei fondatori nei round di venture capital.",
    what: "La quota dell'investitore si calcola SEMPRE sulla valutazione post-money, mai sulla pre-money.",
    how: "Sommare pre-money e investimento, quindi dividere l'investimento per la somma ottenuta.",
    trap: "Dividere l'investimento per la pre-money è un errore grave che sovrastima la quota spettante all'investitore.",
    tags: ["startup", "equity", "venture-capital", "pre-money", "blocco-3"],
  },
  {
    id: "f-span-of-control",
    name: "Ampiezza del Controllo (Span of Control)",
    block: 3,
    topic: "strutture-organizzative",
    formulaKaTeX: "N_{\\text{base}} = (\\text{Span})^{\\text{Livelli}}",
    unit: "collaboratori",
    description:
      "Numero di collaboratori operativi coordinabili in una struttura gerarchica regolare a più livelli.",
    variables: [
      {
        symbol: "Span",
        meaning: "Numero medio di persone che rispondono a ciascun capo",
        unit: "persone",
      },
      {
        symbol: "Livelli",
        meaning: "Numero di livelli gerarchici intermedi tra vertice e base",
        unit: "livelli",
      },
    ],
    why: "Progettare l'organigramma bilanciando costi di supervisione (strutture alte) e sovraccarico manageriale (strutture piatte).",
    what: "Relazione esponenziale che mostra come l'ampiezza di controllo moltiplica le dimensioni dell'organico alla base.",
    how: "Elevare il valore dello span al numero di livelli manageriali.",
    trap: "Non moltiplicare: la ramificazione manageriale segue una progressione geometrica esponenziale.",
    tags: [
      "span-of-control",
      "organizzazione",
      "gerarchia",
      "mintzberg",
      "blocco-3",
    ],
  },

  // BLOCCO 4
  {
    id: "f-valore-aggiunto-mol",
    name: "Valore Aggiunto e MOL / EBITDA",
    block: 4,
    topic: "riclassificazione-conto-economico",
    formulaKaTeX: "VA = VP - CA_e, \\quad MOL = VA - CL",
    unit: "€",
    description:
      "Riclassificazione del Conto Economico per misurare la ricchezza creata e la marginalità operativa lorda.",
    variables: [
      {
        symbol: "VP",
        meaning: "Valore della Produzione (Vendite + Variazione Rimanenze)",
        unit: "€",
      },
      {
        symbol: "CA_e",
        meaning: "Consumi di materie prime e costi per servizi esterni",
        unit: "€",
      },
      {
        symbol: "CL",
        meaning:
          "Costo del personale dipendente (salari, stipendi, TFR, contributi)",
        unit: "€",
      },
    ],
    why: "Il MOL (EBITDA) è il miglior indicatore della capacità della gestione caratteristica di generare cassa potenziale.",
    what: "Il Valore Aggiunto misura la ricchezza netta creata; dedotto il costo del lavoro si ottiene il MOL lordo.",
    how: "Calcolare prima VA = VP - CA_e, poi sottrarre CL per ottenere il MOL.",
    trap: "Il MOL NON include gli ammortamenti: EBITDA significa Earnings BEFORE Depreciation and Amortization.",
    tags: ["valore-aggiunto", "MOL", "EBITDA", "bilancio", "blocco-4"],
  },
  {
    id: "f-ammortamento-quote",
    name: "Ammortamento a Quote Costanti e VNC",
    block: 4,
    topic: "principi-redazione-bilancio",
    formulaKaTeX:
      "\\text{Quota} = \\frac{\\text{Costo Storico} - \\text{Valore Residuo}}{\\text{Vita Utile}}, \\quad VNC_t = \\text{Costo} - (\\text{Quota} \\cdot t)",
    unit: "€/anno e €",
    description:
      "Ripartizione pluriennale del costo di un bene durevole e calcolo del valore netto contabile residuo.",
    variables: [
      {
        symbol: "Costo Storico",
        meaning: "Prezzo di acquisto originario del bene capitalizzato",
        unit: "€",
      },
      {
        symbol: "Valore Residuo",
        meaning: "Valore di realizzo stimato al termine della vita utile",
        unit: "€",
      },
      {
        symbol: "Vita Utile",
        meaning: "Numero stimato di anni di utilizzo economico",
        unit: "anni",
      },
      {
        symbol: "VNC_t",
        meaning: "Valore Netto Contabile iscritto a bilancio dopo t anni",
        unit: "€",
      },
    ],
    why: "Applicare il principio di competenza economica, evitando di addebitare un investimento durevole su un solo esercizio.",
    what: "La quota va a Conto Economico come costo d'esercizio; il Fondo Ammortamento cumula nello Stato Patrimoniale riducendo il VNC.",
    how: "Sottrarre il valore residuo dal costo storico e dividere per gli anni di vita utile.",
    trap: "Il fondo ammortamento NON è un conto corrente con soldi messi da parte: è una posta rettificativa dell'attivo!",
    tags: ["ammortamento", "costo-storico", "VNC", "bilancio", "blocco-4"],
  },
  {
    id: "f-ratei-risconti",
    name: "Risconto Attivo (Competenza Temporale)",
    block: 4,
    topic: "principio-competenza",
    formulaKaTeX:
      "\\text{Risconto Attivo} = \\text{Importo Pagato} \\cdot \\frac{\\text{Mesi di Competenza Futura}}{\\text{Mesi Totali Coperti}}",
    unit: "€",
    description:
      "Quota di costo pagata anticipatamente nell'anno in corso la cui utilità economica matura negli esercizi futuri.",
    variables: [
      {
        symbol: "Importo Pagato",
        meaning: "Esborso monetario totale sostenuto anticipatamente",
        unit: "€",
      },
      {
        symbol: "Mesi Totali",
        meaning: "Durata contrattuale complessiva coperta dal pagamento",
        unit: "mesi",
      },
      {
        symbol: "Mesi Futuri",
        meaning:
          "Mesi che cadono nell'esercizio successivo a quello di chiusura",
        unit: "mesi",
      },
    ],
    why: "Garantire che il Conto Economico registri solo i costi effettivamente consumati entro il 31/12.",
    what: "Il risconto attivo sospende un costo dal CE e lo iscrive nello Stato Patrimoniale tra le attività a breve.",
    how: "Calcolare la quota mensile e moltiplicarla per i mesi che scadono dopo il 31 dicembre.",
    trap: "Attenzione a non calcolare la quota dei mesi dell'anno in corso (quelli vanno a costo di competenza, non a risconto!).",
    tags: ["risconti", "competenza-economica", "bilancio", "blocco-4"],
  },

  // BLOCCO 5
  {
    id: "f-roe-formula",
    name: "ROE (Return on Equity)",
    block: 5,
    topic: "indici-redditivita",
    formulaKaTeX:
      "ROE = \\frac{\\text{Utile Netto}}{\\text{Patrimonio Netto}} \\cdot 100",
    unit: "%",
    description:
      "Redditività globale del capitale proprio investito dai soci o azionisti nell'impresa.",
    variables: [
      {
        symbol: "Utile Netto",
        meaning:
          "Risultato economico finale dell'esercizio al netto delle imposte",
        unit: "€",
      },
      {
        symbol: "Patrimonio Netto",
        meaning: "Capitale sociale, riserve e utili portati a nuovo",
        unit: "€",
      },
    ],
    why: "È il rendimento di riferimento per gli azionisti, da confrontare con il rendimento di investimenti alternativi a parità di rischio.",
    what: "Misura la remunerazione percentuale del capitale di rischio dell'azienda.",
    how: "Dividere l'Utile Netto a fine anno per il totale del Patrimonio Netto e moltiplicare per 100.",
    trap: "Un ROE elevato non significa necessariamente che l'azienda sia sana: può essere gonfiato da un debito pericolosissimo (effetto leva).",
    tags: ["ROE", "redditivita", "indici", "azionisti", "blocco-5"],
  },
  {
    id: "f-leva-finanziaria",
    name: "Leva Finanziaria (Formula del ROE)",
    block: 5,
    topic: "indici-redditivita",
    formulaKaTeX: "ROE = ROI + (ROI - i) \\cdot \\frac{D}{E}",
    unit: "%",
    description:
      "Relazione fondamentale tra redditività operativa (ROI), costo del debito (i), indebitamento (D/E) e ROE.",
    variables: [
      {
        symbol: "ROI",
        meaning:
          "Rendimento della gestione operativa (RO / Capitale Investito)",
        unit: "%",
      },
      {
        symbol: "i",
        meaning:
          "Costo medio percentuale del debito finanziario (Oneri Finanziari / Debiti)",
        unit: "%",
      },
      {
        symbol: "D / E",
        meaning:
          "Rapporto di indebitamento finanziario (Debiti Finanziari / Patrimonio Netto)",
        unit: "adimensionale",
      },
    ],
    why: "Spiega se indebitarsi fa guadagnare di più agli azionisti o li trascina verso il default finanziario.",
    what: "Se ROI > i, lo spread positivo amplifica il ROE all'aumentare del debito. Se ROI < i, il debito distrugge redditività.",
    how: "Calcolare lo spread (ROI - i), moltiplicarlo per D/E e sommarlo al ROI base.",
    trap: "Indebitarsi quando ROI < i provoca un crollo rovinoso del ROE e accelera il fallimento.",
    tags: ["leva-finanziaria", "ROE", "ROI", "debito", "indici", "blocco-5"],
  },
  {
    id: "f-dupont-roi",
    name: "Scomposizione Du Pont del ROI",
    block: 5,
    topic: "indici-redditivita",
    formulaKaTeX:
      "ROI = ROS \\cdot \\text{Turnover} = \\frac{RO}{\\text{Ricavi}} \\cdot \\frac{\\text{Ricavi}}{CI} \\cdot 100",
    unit: "%",
    description:
      "Scomposizione della redditività operativa nel prodotto tra margine commerciale sulle vendite e rotazione degli asset.",
    variables: [
      {
        symbol: "ROS",
        meaning: "Return on Sales (Reddito Operativo / Ricavi)",
        unit: "%",
      },
      {
        symbol: "Turnover",
        meaning: "Velocità di rotazione del capitale investito (Ricavi / CI)",
        unit: "volte/anno",
      },
      {
        symbol: "CI",
        meaning: "Capitale Investito operativo netto totale",
        unit: "€",
      },
    ],
    why: "Indica ai manager le due strade strategiche per aumentare la redditività operativa: aumentare i margini di prezzo o accelerare la rotazione del capitale.",
    what: "Il modello Du Pont dimostra che ROI elevati possono essere raggiunti sia nel lusso (ROS alto, turnover basso) sia nella GDO (ROS basso, turnover altissimo).",
    how: "Moltiplicare il ROS percentuale per il numero di volte in cui il capitale ruota in un anno.",
    trap: "La relazione Du Pont è moltiplicativa, non additiva: non sommare ROS e Turnover!",
    tags: ["DuPont", "ROI", "ROS", "turnover", "indici", "blocco-5"],
  },
  {
    id: "f-quick-current-ratio",
    name: "Current Ratio e Quick Ratio (Liquidità)",
    block: 5,
    topic: "indici-liquidita",
    formulaKaTeX:
      "\\text{Current} = \\frac{AC}{PC}, \\quad \\text{Quick} = \\frac{\\text{Liq.Imm} + \\text{Liq.Diff}}{PC}",
    unit: "adimensionale",
    description:
      "Misura della capacità dell'impresa di far fronte ai propri debiti a breve termine con le attività correnti.",
    variables: [
      {
        symbol: "AC",
        meaning:
          "Attivo Corrente (Liquidità immediate + differite + rimanenze)",
        unit: "€",
      },
      {
        symbol: "PC",
        meaning:
          "Passivo Corrente (Debiti commerciali e finanziari a breve termine < 1 anno)",
        unit: "€",
      },
      {
        symbol: "Quick",
        meaning:
          "Acid Test: esclude il magazzino per testare la solvibilità istantanea",
        unit: "adimensionale",
      },
    ],
    why: "Evitare il fallimento per crisi di cassa: un'azienda può essere redditizia sulla carta ma insolvente domani mattina.",
    what: "Current Ratio ottimale > 1.5 - 2; Quick Ratio ottimale >= 1 (deve coprire i debiti a breve senza dover svendere le scorte).",
    how: "Dividere le attività a breve per i debiti a breve, escludendo le rimanenze per il Quick Ratio.",
    trap: "Un Current Ratio alto ma un Quick Ratio basso rivela che l'azienda ha troppo magazzino invenduto e rischia l'illiquidità.",
    tags: [
      "liquidita",
      "quick-ratio",
      "current-ratio",
      "acid-test",
      "blocco-5",
    ],
  },
  {
    id: "f-cash-conversion-cycle",
    name: "Ciclo di Conversione del Circolante (CCC)",
    block: 5,
    topic: "capitale-circolante",
    formulaKaTeX: "CCC = DIO + DSO - DPO",
    unit: "giorni",
    description:
      "Tempo medio che intercorre tra l'uscita monetaria per i fattori produttivi e l'incasso dai clienti.",
    variables: [
      {
        symbol: "DIO",
        meaning:
          "Days Inventory Outstanding: giorni di giacenza media delle scorte",
        unit: "giorni",
      },
      {
        symbol: "DSO",
        meaning:
          "Days Sales Outstanding: giorni medi di incasso crediti dai clienti",
        unit: "giorni",
      },
      {
        symbol: "DPO",
        meaning:
          "Days Payables Outstanding: giorni medi di pagamento debiti fornitori",
        unit: "giorni",
      },
    ],
    why: "La metrica regina della gestione della tesoreria: ogni giorno in meno di CCC libera cassa immediata per l'azienda.",
    what: "Un CCC positivo richiede finanziamenti bancari; un CCC negativo (es. Amazon) genera autofinanziamento gratuito.",
    how: "Sommare i giorni scorte e i giorni clienti, quindi sottrarre i giorni concessi dai fornitori.",
    trap: "Non sottrarre DSO: i clienti ti devono pagare, quindi i loro ritardi allungano il ciclo monetario!",
    tags: ["CCC", "DSO", "DIO", "DPO", "circolante", "tesoreria", "blocco-5"],
  },

  // BLOCCO 6
  {
    id: "f-bep-quantita",
    name: "Break-Even Point in Quantità (Q*)",
    block: 6,
    topic: "bep-analisi",
    formulaKaTeX: "Q^* = \\frac{CF}{p - cv} = \\frac{CF}{MdC_u}",
    unit: "unità",
    description:
      "Volume minimo di produzione e vendita necessario per azzerare le perdite e coprire tutti i costi fissi (RO = 0).",
    variables: [
      {
        symbol: "CF",
        meaning:
          "Costi Fissi totali di periodo (indipendenti dal volume prodotto)",
        unit: "€",
      },
      {
        symbol: "p",
        meaning: "Prezzo unitario di vendita del prodotto",
        unit: "€/unità",
      },
      {
        symbol: "cv",
        meaning:
          "Costo variabile unitario (materie, componenti, lavorazione diretta)",
        unit: "€/unità",
      },
      {
        symbol: "MdC_u",
        meaning: "Margine di contribuzione unitario (p - cv)",
        unit: "€/unità",
      },
    ],
    why: "Prima di lanciare qualsiasi prodotto, l'ingegnere/manager deve sapere quante unità minime deve vendere per non fallire.",
    what: "Il punto in cui i Ricavi Totali eguagliano i Costi Totali. Ogni unità venduta oltre Q* genera utile pari a MdC_u.",
    how: "Dividere il totale dei costi fissi per la differenza tra prezzo e costo variabile unitario.",
    trap: "Se p <= cv il BEP è matematicamente impossibile: vendendo sottocosto più vendi e più perdi!",
    tags: [
      "BEP",
      "pareggio",
      "costi-fissi",
      "margine-contribuzione",
      "blocco-6",
    ],
  },
  {
    id: "f-bep-fatturato",
    name: "Break-Even Point in Fatturato (R*)",
    block: 6,
    topic: "bep-analisi",
    formulaKaTeX: "R^* = \\frac{CF}{\\frac{p - cv}{p}} = \\frac{CF}{m_c\\%}",
    unit: "€",
    description:
      "Fatturato monetario minimo necessario per raggiungere il pareggio economico (indispensabile per aziende multi-prodotto).",
    variables: [
      {
        symbol: "CF",
        meaning: "Costi fissi complessivi dell'azienda",
        unit: "€",
      },
      {
        symbol: "m_c%",
        meaning: "Margine di contribuzione percentuale medio sui ricavi",
        unit: "% o frazione",
      },
    ],
    why: "Permette di calcolare il pareggio quando l'azienda vende migliaia di prodotti eterogenei e non ha senso parlare di un'unica quantità fisica.",
    what: "Rapporto tra costi fissi e margine di contribuzione percentuale.",
    how: "Dividere i costi fissi per il margine di contribuzione relativo (p - cv) / p.",
    trap: "Non dividere per il prezzo: si divide per la percentuale di margine di contribuzione.",
    tags: ["BEP", "fatturato", "break-even", "ricavi", "blocco-6"],
  },
  {
    id: "f-margine-sicurezza",
    name: "Margine di Sicurezza (MS)",
    block: 6,
    topic: "bep-analisi",
    formulaKaTeX:
      "MS = \\frac{Q - Q^*}{Q} \\cdot 100 = \\frac{R - R^*}{R} \\cdot 100",
    unit: "%",
    description:
      "Percentuale massima di riduzione delle vendite che l'impresa può sopportare prima di entrare nell'area di perdita.",
    variables: [
      {
        symbol: "Q o R",
        meaning: "Volume effettivo o fatturato attuale di vendita",
        unit: "unità o €",
      },
      {
        symbol: "Q* o R*",
        meaning: "Quantità o fatturato di pareggio (Break-Even)",
        unit: "unità o €",
      },
    ],
    why: "Misura la rischiosità operativa e la vulnerabilità dell'azienda rispetto a recessioni o crisi di mercato.",
    what: "Cuscino di sicurezza: se MS = 20%, l'azienda può perdere fino al 20% dei clienti restando comunque in utile.",
    how: "Sottrarre il volume di pareggio dal volume attuale e dividere per il volume attuale, moltiplicando per 100.",
    trap: "Dividere per Q* anziché per Q effettivo: il margine si calcola sul livello di vendite di partenza!",
    tags: ["margine-sicurezza", "rischio-operativo", "bep", "blocco-6"],
  },
  {
    id: "f-leva-operativa-glo",
    name: "Grado di Leva Operativa (GLO)",
    block: 6,
    topic: "bep-analisi",
    formulaKaTeX:
      "GLO = \\frac{\\text{MdC}_{\\text{totale}}}{RO} = \\frac{Q \\cdot (p - cv)}{Q \\cdot (p - cv) - CF}",
    unit: "adimensionale",
    description:
      "Elasticità del Reddito Operativo rispetto a variazioni percentuali del volume di vendita.",
    variables: [
      {
        symbol: "MdC_totale",
        meaning: "Margine di Contribuzione complessivo generato dalle vendite",
        unit: "€",
      },
      {
        symbol: "RO",
        meaning: "Reddito Operativo (EBIT) dell'esercizio",
        unit: "€",
      },
    ],
    why: "Spiega come strutture ad alti costi fissi (es. software factory, semiconduttori) vedano esplodere l'utile con la crescita dei ricavi, ma crollare rovinosamente al minimo rallentamento.",
    what: "Se GLO = 3, un aumento del 10% del fatturato genera un incremento del 30% del reddito operativo.",
    how: "Dividere il Margine di Contribuzione totale per il Reddito Operativo.",
    trap: "Non confondere con la leva finanziaria: la leva operativa dipende solo dalla struttura dei costi industriali (fissi vs variabili).",
    tags: [
      "GLO",
      "leva-operativa",
      "rischio-operativo",
      "costi-fissi",
      "blocco-6",
    ],
  },
  {
    id: "f-make-or-buy",
    name: "Punto di Indifferenza Make or Buy",
    block: 6,
    topic: "decisioni-breve-periodo",
    formulaKaTeX:
      "Q_{\\text{indiff}} = \\frac{CF_{\\text{specifici}}}{p_{\\text{fornitore}} - cv_{\\text{interno}}}",
    unit: "unità",
    description:
      "Soglia quantitativa oltre la quale produrre internamente conviene rispetto ad acquistare dall'esterno.",
    variables: [
      {
        symbol: "CF_specifici",
        meaning: "Costi fissi eliminabili se si esternalizza la produzione",
        unit: "€",
      },
      {
        symbol: "p_fornitore",
        meaning:
          "Prezzo unitario richiesto dal fornitore esterno per il componente",
        unit: "€/unità",
      },
      {
        symbol: "cv_interno",
        meaning: "Costo variabile sostenuto per produrre il pezzo in azienda",
        unit: "€/unità",
      },
    ],
    why: "Decisione fondamentale di supply chain e produzione: esternalizzare o mantenere il controllo manifatturiero?",
    what: "Sotto Q_indiff conviene il Buy (evita i costi fissi); sopra Q_indiff conviene il Make (il risparmio sui variabili ammortizza i fissi).",
    how: "Dividere i costi fissi dedicati per la differenza tra prezzo fornitore e costo variabile interno.",
    trap: "Considerare quote di costi fissi generali ineliminabili (es. stipendio del CEO): nel Make or Buy contano SOLO i costi fissi differenziali eliminabili!",
    tags: [
      "make-or-buy",
      "esternalizzazione",
      "punto-indifferenza",
      "costi-rilevanti",
      "blocco-6",
    ],
  },

  // BLOCCO 7
  {
    id: "f-clv-cac",
    name: "Customer Acquisition Cost e Lifetime Value (CLV / CAC)",
    block: 7,
    topic: "business-model-metrics",
    formulaKaTeX:
      "CAC = \\frac{\\text{Spese Mktg}}{\\text{Nuovi Clienti}}, \\quad \\text{Rapporto} = \\frac{\\text{CLV}}{\\text{CAC}} \\ge 3",
    unit: "adimensionale",
    description:
      "Metrica aurea di scalabilità economica per software, app e servizi in abbonamento.",
    variables: [
      {
        symbol: "CAC",
        meaning: "Costo medio sostenuto per acquisire ogni nuovo cliente",
        unit: "€/cliente",
      },
      {
        symbol: "CLV",
        meaning:
          "Margine di contribuzione totale generato dal cliente lungo tutta la sua permanenza",
        unit: "€/cliente",
      },
    ],
    why: "Dimostra agli investitori se la startup può scalare profittevolmente o se sta bruciando cassa per comprare utenti non redditizi.",
    what: "Regola d'oro: CLV/CAC deve essere >= 3; se < 1 l'azienda muore per ogni nuovo cliente acquisito.",
    how: "Calcolare CAC dividendo le spese di vendita/marketing per i clienti; calcolare il CLV e confrontarli.",
    trap: "Confondere il fatturato generato dal cliente con il suo MARGINE: il CLV si calcola sui margini, non sul fatturato lordo!",
    tags: ["CAC", "CLV", "saas", "startup", "unit-economics", "blocco-7"],
  },
  {
    id: "f-payback-period",
    name: "Payback Period (Tempo di Recupero)",
    block: 7,
    topic: "valutazione-investimenti",
    formulaKaTeX:
      "PBP = \\frac{\\text{Investimento Iniziale } (I_0)}{\\text{Flusso di Cassa Annuo } (CF)}",
    unit: "anni",
    description:
      "Numero di anni necessari affinché i flussi di cassa cumulati reintegrino l'esborso iniziale dell'investimento.",
    variables: [
      {
        symbol: "I_0",
        meaning:
          "Esborso monetario sostenuto al momento iniziale dell'investimento",
        unit: "€",
      },
      {
        symbol: "CF",
        meaning: "Flusso di cassa netto annuo costante generato dal progetto",
        unit: "€/anno",
      },
    ],
    why: "Fornisce una misura intuitiva e immediata del rischio di liquidità di una proposta progettuale.",
    what: "Criterio di recupero semplice. Più breve è il recupero, minore è il rischio che l'azienda rimanga a corto di cassa.",
    how: "Dividere l'investimento iniziale per il flusso di cassa annuo costante.",
    trap: "GRAVE LIMITE: Il Payback ignora il valore temporale del denaro e non considera nessun flusso successivo al rientro!",
    tags: [
      "payback",
      "tempo-rientro",
      "investimenti",
      "flussi-cassa",
      "blocco-7",
    ],
  },
  {
    id: "f-wacc-capitale",
    name: "WACC (Costo Medio Ponderato del Capitale)",
    block: 7,
    topic: "finanza-aziendale-investimenti",
    formulaKaTeX:
      "WACC = K_e \\cdot \\frac{E}{D+E} + K_d \\cdot (1 - t) \\cdot \\frac{D}{D+E}",
    unit: "%",
    description:
      "Rendimento minimo atteso che qualsiasi nuovo investimento deve garantire per remunerare sia azionisti che creditori.",
    variables: [
      {
        symbol: "K_e",
        meaning:
          "Costo del capitale di rischio (rendimento atteso dagli azionisti)",
        unit: "%",
      },
      {
        symbol: "K_d",
        meaning:
          "Costo lordo del debito finanziario (tasso di interesse bancario)",
        unit: "%",
      },
      {
        symbol: "t",
        meaning:
          "Aliquota fiscale societaria (scudo fiscale sul debito: 1 - t)",
        unit: "%",
      },
      {
        symbol: "E, D",
        meaning: "Valore di mercato dell'Equity e del Debito finanziario",
        unit: "€",
      },
    ],
    why: "Costituisce il tasso di sconto (discount rate) per il calcolo del Valore Attuale Netto (VAN) dei progetti aziendali.",
    what: "Media ponderata del rendimento dell'equity e del debito, al netto dello scudo fiscale derivante dalla deducibilità degli interessi.",
    how: "Ponderare Ke e Kd*(1-t) per le rispettive quote di capitale sul totale delle fonti.",
    trap: "Dimenticare lo scudo fiscale (1 - t) sul costo del debito, sovrastimando il costo effettivo dei finanziamenti.",
    tags: [
      "WACC",
      "costo-capitale",
      "debito",
      "equity",
      "scudo-fiscale",
      "blocco-7",
    ],
  },
];
