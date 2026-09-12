# EOA Exam Trainer — Design Specification

> Strumento didattico avanzato per la preparazione e la simulazione dell'esame di
> **Economia e Organizzazione Aziendale** (EOA 2026),
> Corso di Laurea in Ingegneria Informatica, Università di Pisa.
>
> **Autore del corso:** Prof.ssa Antonella Martini.
> **Autore dello strumento:** Salvatore Calzerano.
>
> Documento creato: 2026-09-12.

---

## 1. Obiettivo del Progetto

Realizzare una **webapp offline-first** che gli studenti possano utilizzare
autonomamente — senza connessione a internet e senza accesso a un LLM — per:

1. **Studiare** i contenuti del corso in modo strutturato e interattivo.
2. **Esercitarsi** con migliaia di domande pre-generate e memorizzate su disco.
3. **Simulare l'esame** con un generatore automatico di quiz che pesca da un
   archivio enorme e produce combinazioni virtualmente infinite.

Il prodotto finale è un'**applicazione web statica** (HTML + CSS + JS) che può
essere:

- fruita direttamente aprendo `index.html` in un browser;
- incapsulata in **Electron** per distribuzione come app desktop;
- servita da un server locale per l'uso su dispositivi mobili.

Nessun backend, nessuna API, nessun database server: tutto il contenuto — teoria,
domande, logica del quiz — è pre-generato e incluso come file statici.

---

## 2. Principi Fondanti (derivati dal progetto BOOK)

Questo progetto si ispira alla filosofia didattica e ai principi editoriali
definiti nel progetto BOOK (serie didattica Common Lisp), adattandoli al
dominio EOA e al formato webapp. I principi qui elencati sono **vincolanti**
per tutto il ciclo di sviluppo.

### 2.1 La Regola d'Oro dell'Esposizione (Golden Rule)

> **Non presentare mai un concetto, un dato o un calcolo come un fatto
> inspiegato. Ogni nozione deve prima essere GIUSTIFICATA come risposta a un
> problema reale o a una domanda concreta.**

Sequenza obbligatoria, sempre:

1. **PERCHÉ** — il problema: a quale decisione aziendale serve questo concetto?
   Perché uno studente di ingegneria informatica dovrebbe interessarsene?
2. **COSA** — il concetto, presentato come *conseguenza* di quel bisogno.
3. **COME** — la formula, il calcolo, la procedura, l'esempio numerico.

Nelle pagine di studio, questa sequenza si traduce in blocchi visivi distinti.
Nel quiz, le spiegazioni post-risposta seguono la stessa struttura.

### 2.2 Contrasto come Strumento Didattico

Mutuato dal "Mindset Shift" e dal "Migration Delta" di BOOK:

- **Ogni concetto economico-aziendale va contrapposto alla mentalità tecnica**
  ("paradigma ingegneristico" vs. "paradigma aziendale", come definito nella
  slide I di EOA 2026).
- Dove applicabile, usare il formato a 3 righe:
  - *Mentalità tecnica:* come un ingegnere tende a vedere il problema.
  - *Mentalità aziendale:* come lo inquadra l'economia d'impresa.
  - *Salto concettuale:* perché cambiare prospettiva cambia la decisione.

### 2.3 "Non Dare per Scontato" — Trappole Concettuali

Mutuato dai `donotassume` di BOOK: blocchi prominenti che demoliscono i
**falsi amici** e le confusioni tipiche dello studente di ingegneria:

- *Utile ≠ cassa* (un'impresa in utile può fallire per crisi di liquidità).
- *Fatturato ≠ guadagno*.
- *Costo ≠ uscita di cassa* (principio di competenza).
- *ROE alto ≠ impresa sana* (effetto leva finanziaria).
- *Patrimonio netto ≠ denaro disponibile*.
- *Complicato ≠ complesso* (sistemi ordinati vs. adattivi).
- *Trade-off ≠ costo opportunità*.

Questi blocchi appaiono sia nelle pagine di studio sia come spiegazioni
post-risposta nel quiz quando lo studente sbaglia per una di queste confusioni.

### 2.4 Gerarchia Visiva: LOUD vs. QUIET

Dal "contrasto contract" di BOOK, adattato al web:

| Voce       | Trattamento                                                     | Cosa lo usa                                            |
| ---------- | --------------------------------------------------------------- | ------------------------------------------------------ |
| **LOUD**   | Colore accento, testo bold, barre laterali, card con sfondo     | Titoli di blocco, keypoint, formula chiave, trappola   |
| **QUIET**  | Testo più piccolo, colori smorzati, pannelli con tinta leggera  | Spiegazioni discorsive, note, dettagli                 |
| **SILENT** | Font minimo, grigio chiaro                                      | Riferimenti, fonti, note a margine                     |

- **Keypoint = formula schematica**, mai un paragrafo.
  Es.: `ROE = Utile netto / Patrimonio netto · 100`
- **Max 1-3 elementi LOUD per schermata.**
- **Mai box-in-box**: nessun pannello annidato dentro un altro.
- **Colore è semantico, non decorativo**: una palette fissa codifica il
  significato (blu = concetti, verde = esercizi/quiz, rosso = trappole,
  ambra = casi studio, grigio = dettagli).

### 2.5 Anatomia dell'Esercizio / Domanda (8 parti)

Adattato dall'Exercise Anatomy di BOOK:

1. **Enunciato** — domanda o problema, formulazione chiara e concisa.
2. **Contesto** — a quale blocco tematico e argomento appartiene.
3. **Tipo** — scelta multipla / risposta multipla / V/F semplice / V/F
   multiplo / inserimento numerico / testo libero.
4. **Opzioni di risposta** — con ordine randomizzabile.
5. **Risposta corretta** — con flag per le risposte multiple.
6. **Spiegazione** — *perché* quella è la risposta corretta, seguendo la
   Golden Rule (PERCHÉ → COSA → COME).
7. **Trappola** — se la domanda testa una confusione tipica (§2.3), la
   spiegazione la nomina esplicitamente.
8. **Difficoltà e Tags** — livello (★ a ★★★), blocco tematico, argomento,
   tipo di competenza (concettuale / calcolo / caso studio / normativa).

### 2.6 Percorsi Differenziati (Tiered Tracks)

Mutuato da ADR-003 di BOOK (percorsi Minimo / Standard / Completo):

| Percorso        | Badge | Descrizione                                       | Target                              |
| --------------- | ----- | ------------------------------------------------- | ----------------------------------- |
| **Essenziale**  | ◆     | Concetti irrinunciabili per il 18/30              | Studente con poco tempo             |
| **Standard**    | ■     | Copertura completa del programma                  | Preparazione solida                 |
| **Approfondito**| ○     | Approfondimenti, trappole, orale                  | Puntare al 30 / prepararsi all'orale|

Il quiz consente di filtrare per percorso, e le pagine di studio indicano
visivamente a quale percorso appartiene ciascun contenuto.

### 2.7 Progressione e Non-Anticipazione

> **Nessun concetto può essere usato prima di essere stato introdotto.**

Le pagine di studio seguono la progressione del corso (Blocchi I–VII).
Il quiz avanzato può testare trasversalmente, ma ogni domanda è taggata
con i prerequisiti e il generatore può essere configurato per rispettare
la progressione didattica.

---

## 3. Struttura dei Contenuti — I 7 Blocchi EOA 2026

Il corso è organizzato in 7 blocchi tematici, ciascuno con un caso studio
guida. Lo strumento replica e amplifica questa struttura.

| Blocco | Tema                      | Domanda Chiave                                       | Caso Studio Guida                   |
| ------ | ------------------------- | ---------------------------------------------------- | ----------------------------------- |
| **I**  | Impresa e decisioni       | Cos'è un'impresa? È diversa da un'azienda?           | Olivetti (Programma 101)            |
| **II** | Forme giuridiche          | Come si sceglie la forma giuridica ottimale?          | Satispay, Exein, Davines            |
| **III**| Governance e finanziamento| Chi decide nell'impresa e chi la finanzia?            | Governance S.p.A.                   |
| **IV** | Bilancio d'esercizio      | Il bilancio è una fotografia o un film?               | Prospetti OIC / IAS                 |
| **V**  | Analisi per indici        | Come può un'azienda in utile fallire per cassa?       | Connecta S.r.l., De Cecco S.p.A.   |
| **VI** | Costi e decisioni         | Quante unità devo vendere per non perdere?            | Analisi di Break-Even               |
| **VII**| Business Model Canvas     | Come guadagna l'impresa?                              | All'Antico Vinaio et al.            |

### 3.1 Mappa dei Sotto-Argomenti per Blocco

Ogni blocco si articola in sotto-argomenti, ciascuno con:

- **Concetti** (definizioni, relazioni, modelli)
- **Formule e calcoli** (indici, BEP, riclassificazioni)
- **Casi studio** (analisi critica, applicazione dei concetti)
- **Norme e forme** (codice civile, schemi obbligatori, governance)

La mappa dettagliata dei sotto-argomenti sarà estratta dal materiale
didattico durante la fase di generazione dei contenuti.

---

## 4. Architettura Tecnica

### 4.1 Stack Tecnologico

| Componente        | Tecnologia                                                          |
| ----------------- | ------------------------------------------------------------------- |
| **Frontend**      | React 19 + TypeScript + Vite                                       |
| **Styling**       | Tailwind CSS 4 (utility-first, palette semantica fissa)             |
| **State**         | Zustand (leggero, senza boilerplate)                                |
| **Persistenza**   | LocalStorage / IndexedDB per stato utente (progressi, punteggi)     |
| **Dati contenuto**| File JSON statici (pre-generati), importati a build time o lazy-loaded |
| **Math rendering**| KaTeX (formule inline e display)                                    |
| **Charts**        | Recharts o Chart.js (per visualizzazione di bilanci, indici)        |
| **Packaging**     | Electron (desktop) / PWA (mobile)                                   |
| **Build**         | Vite → bundle statico → Electron-builder                            |

### 4.2 Struttura del Repository

```
EOA-2026/
├── DESIGN_SPEC.md               ← questo documento
├── materiale/                   ← materiale sorgente del corso
│   ├── 1-md/                    ← trascrizioni MD
│   └── 2-LLM wiki/             ← wiki per LLM
├── app/                         ← webapp
│   ├── public/
│   │   └── data/                ← dati pre-generati
│   │       ├── questions/       ← archivio domande (JSON)
│   │       │   ├── blocco-1.json
│   │       │   ├── blocco-2.json
│   │       │   └── ...
│   │       ├── theory/          ← contenuti di studio (JSON/MD)
│   │       │   ├── blocco-1/
│   │       │   └── ...
│   │       └── cases/           ← casi studio interattivi
│   ├── src/
│   │   ├── components/          ← componenti React
│   │   │   ├── study/           ← pagine di studio interattive
│   │   │   ├── quiz/            ← engine del quiz
│   │   │   ├── dashboard/       ← progressi e statistiche
│   │   │   └── ui/              ← componenti base (card, button, ...)
│   │   ├── data/                ← tipi, schema, utilities
│   │   ├── engine/              ← logica del generatore di quiz
│   │   ├── store/               ← stato applicazione (Zustand)
│   │   └── App.tsx
│   ├── electron/                ← wrapper Electron
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.ts
├── generator/                   ← generatore di domande (script Node/TS)
│   ├── templates/               ← template per generazione parametrica
│   ├── seed-data/               ← dati seme (concetti, formule, valori)
│   ├── generate.ts              ← script principale
│   └── README.md
└── AGENTS.md
```

### 4.3 Formato Dati delle Domande

Ogni domanda è un oggetto JSON con il seguente schema:

```jsonc
{
  "id": "B5-IND-ROE-003",           // ID univoco: Blocco-Categoria-Argomento-Seq
  "version": 1,
  "block": 5,                       // Blocco tematico (1-7)
  "topic": "indici-redditivita",     // Sotto-argomento
  "tags": ["ROE", "leva-finanziaria", "calcolo"],
  "track": "standard",              // essenziale | standard | approfondito
  "difficulty": 2,                  // 1-3 (stelle)
  "type": "single-choice",          // Tipo di domanda (vedi §4.4)
  "stem": "Un'impresa ha ROI = 12%, tasso di interesse sui debiti i = 8%, ...",
  "options": [                       // Ordine randomizzabile dal quiz engine
    { "id": "a", "text": "15,2%", "correct": false },
    { "id": "b", "text": "18,4%", "correct": true },
    { "id": "c", "text": "12,0%", "correct": false },
    { "id": "d", "text": "8,0%",  "correct": false }
  ],
  "explanation": {
    "why": "Il ROE non coincide con il ROI quando l'impresa è indebitata...",
    "what": "La formula della leva finanziaria lega ROE, ROI, costo del debito e rapporto D/E.",
    "how": "ROE = ROI + (ROI − i) × D/E = 12% + (12% − 8%) × 1,6 = 18,4%",
    "trap": "Confondere ROE con ROI: il ROE incorpora l'effetto della struttura finanziaria."
  },
  "formula": "ROE = ROI + (ROI - i) \\times \\frac{D}{E}",
  "prerequisites": ["B4-BIL", "B5-IND-BASE"],
  "parametric": {                    // Se presente, la domanda è un template
    "variables": {
      "roi": { "min": 5, "max": 20, "step": 0.5, "unit": "%" },
      "i":   { "min": 3, "max": 15, "step": 0.5, "unit": "%" },
      "de":  { "min": 0.5, "max": 3.0, "step": 0.1 }
    },
    "constraints": ["roi > i"],      // Solo leva positiva in questo template
    "correct_formula": "roi + (roi - i) * de",
    "distractors": [                 // Formule per generare distrattori plausibili
      "roi * de",
      "roi - i",
      "(roi + i) / 2"
    ]
  }
}
```

### 4.4 Tipi di Domanda Supportati

Rispecchiano fedelmente il formato dell'esame reale (cfr. Guida EOA 2026):

| Tipo              | Codice            | Descrizione                                             |
| ----------------- | ----------------- | ------------------------------------------------------- |
| Scelta multipla   | `single-choice`   | Una sola risposta corretta tra N opzioni                |
| Risposta multipla | `multi-choice`    | Più risposte corrette, tutte da selezionare             |
| Vero/Falso        | `true-false`      | Una sola affermazione, V o F                            |
| V/F multiplo      | `multi-true-false` | Più affermazioni, ciascuna V o F (tutte devono essere corrette) |
| Inserimento       | `numeric-input`   | Risultato numerico da inserire                          |
| Testo libero      | `free-text`       | Risposta testuale (con keywords per validazione)        |

### 4.5 Il Generatore di Quiz — Combinazioni Infinite

Il generatore opera su tre livelli di casualità:

1. **Selezione** — pesca N domande dall'archivio secondo filtri configurabili
   (blocco, argomento, difficoltà, percorso, tipo).
2. **Parametrizzazione** — per le domande con campo `parametric`, genera
   istanze numeriche uniche a ogni esecuzione sostituendo le variabili con
   valori casuali entro i vincoli, calcolando la risposta corretta con la
   formula e generando distrattori plausibili con le formule distractor.
3. **Permutazione** — randomizza l'ordine delle domande e l'ordine delle
   opzioni di risposta all'interno di ciascuna domanda.

Questo garantisce che anche con un archivio finito di template, il numero
di quiz possibili sia virtualmente infinito.

#### Modalità di Quiz

| Modalità              | Descrizione                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| **Simulazione Esame** | 25–40 domande, tempo limitato, sequenziale senza ritorno, mix di tipi  |
| **Pratica Libera**    | N domande configurabili, senza tempo, con spiegazione immediata        |
| **Per Blocco**        | Solo domande di un blocco specifico                                    |
| **Per Argomento**     | Solo domande di un sotto-argomento                                     |
| **Trappole**          | Solo domande che testano confusioni tipiche (§2.3)                     |
| **Calcoli**           | Solo domande numeriche (indici, BEP, riclassificazione)                |
| **Flash Cards**       | Definizione → concetto, senza opzioni di risposta                      |

---

## 5. Sezioni della Webapp

### 5.1 Dashboard (Home)

- Panoramica dei progressi per blocco (barra di completamento).
- Ultimo punteggio di simulazione e trend.
- Accesso rapido a "Simulazione Esame", "Pratica Libera", "Studio".
- Badge del percorso attivo (◆ / ■ / ○).

### 5.2 Studio Interattivo

Per ogni blocco tematico, pagine di studio con:

- **Roadmap visiva** del blocco (domanda chiave → concetti → formule → caso).
- **Schede concetto** con la struttura PERCHÉ → COSA → COME (§2.1).
- **Keypoint** evidenziati come formule schematiche (§2.4).
- **Blocchi "Non dare per scontato"** (§2.3) prominenti e visivamente distinti.
- **Blocchi "Salto concettuale"** (§2.2) con il contrasto ingegnere/aziendalista.
- **Casi studio interattivi**: testo del caso + domande embedded + reveal
  della risposta.
- **Mini-quiz di autoverifica** a fine di ogni sotto-argomento (3-5 domande).
- **Schemi di bilancio interattivi** (per i Blocchi IV e V): lo studente può
  compilare celle e vedere il risultato, con validazione immediata.
- **Calcolatore di indici**: inserisci i dati del bilancio, calcola e
  interpreta automaticamente gli indici.

### 5.3 Quiz Engine

L'interfaccia del quiz replica fedelmente l'esperienza dell'esame reale:

- **Una domanda alla volta**, a schermo intero.
- **Sequenziale senza ritorno** (in modalità Simulazione Esame).
- **Timer** visibile con tempo trascorso e rimanente.
- **Contatore** domande (es. "12 / 30").
- **Risposta obbligatoria** prima di procedere (come nell'esame reale).
- **Risultato immediato a fine quiz** con punteggio, tempo, dettaglio errori.
- **Review completo** con spiegazione per ogni domanda (anche quelle corrette).

### 5.4 Statistiche e Progressi

- **Punteggio per blocco e argomento** (radar chart).
- **Trend temporale** dei punteggi di simulazione.
- **Argomenti deboli** evidenziati automaticamente.
- **Contatore domande viste / totali**.
- **Storico simulazioni** con possibilità di rivedere le risposte.

### 5.5 Formulario

- Tutte le formule del corso, organizzate per blocco.
- Ricerca rapida.
- Ogni formula è cliccabile: apre la scheda concetto corrispondente.

---

## 6. Specifiche di Design Visivo

### 6.1 Principi Generali (da BOOK Visual Grammar v3)

- **Design stance**: ibrido tra Technical Book Minimal e Engineering Handbook,
  con forte inclinazione verso il Technical Book. Pulizia, whitespace,
  gerarchia tipografica forte.
- **Segnali leggeri, non packaging pesante**: micro-heading colorati, barre
  laterali, tinte leggere. Box pieni solo per i LOUD (keypoint, trappole).
- **Pagine leggere e ariose**: max 3-5 blocchi principali per schermata,
  separati da whitespace. Mai schermate dense e monocromatiche.
- **Page economy**: niente spazio sprecato, ma niente affollamento.

### 6.2 Palette Semantica

| Ruolo             | Colore         | Uso                                          |
| ----------------- | -------------- | -------------------------------------------- |
| Concetti / Teoria | Tech Blue      | Keypoint, formule, definizioni               |
| Esercizi / Quiz   | Emerald Green  | Card esercizio, punteggi positivi            |
| Trappole / Errori | Coral Red      | "Non dare per scontato", errori              |
| Casi Studio       | Warm Amber     | Card caso studio, riferimenti reali          |
| Dettagli / Note   | Slate Gray     | Testo secondario, note, fonti               |
| Orale / Avanzato  | Purple         | Contenuti del percorso Approfondito          |
| Sfondo            | White / Snow   | Fondo pagina pulito                          |

### 6.3 Tipografia

- **Headings**: sans-serif geometrico (Inter o simile), bold, colore accento.
- **Body**: serif leggero (Source Serif 4 o simile) oppure sans-serif se
  preferito per il contesto web/mobile.
- **Code / Numeri**: monospace (Source Code Pro o JetBrains Mono) per formule
  numeriche, valori di bilancio, risultati.
- **Corpo testo**: 16px base, con scaling responsive.

### 6.4 Componenti UI Chiave

| Componente        | Stile                                              | Equivalente BOOK        |
| ----------------- | -------------------------------------------------- | ----------------------- |
| **KeypointCard**  | Sfondo tinted blue, barra laterale accento, formula schematica in bold | `keypoint`        |
| **TrapCard**      | Sfondo tinted red, icona ⚠, testo conciso          | `donotassume`           |
| **ShiftCard**     | 3 righe con badge colorati (Tecnico / Aziendale / Salto) | `migrationdelta`  |
| **CaseStudyCard** | Sfondo tinted amber, nome del caso, domanda chiave | `webgl2note`            |
| **QuizQuestion**  | Card a schermo intero, opzioni come bottoni/checkbox | `exercise`            |
| **ExplanationCard**| Reveal dopo risposta, struttura PERCHÉ/COSA/COME  | `solution` + `hints`    |
| **FormulaBlock**  | KaTeX rendered, sfondo leggero, cliccabile          | `keypoint` formula     |
| **ProgressBar**   | Barra segmentata per blocco, colore per mastery    | —                       |

### 6.5 Responsività

- **Desktop** (≥1024px): layout a 2 colonne per studio (contenuto + sidebar
  con formulario/navigazione).
- **Tablet** (768–1023px): layout a 1 colonna con sidebar collassabile.
- **Mobile** (< 768px): layout a 1 colonna, card full-width, quiz a schermo
  intero.

---

## 7. Il Generatore di Contenuti — Pipeline di Produzione

Tutto il contenuto è pre-generato offline. La pipeline è:

```
materiale/ (MD sorgente)
    ↓
[1] Analisi e strutturazione (manuale + AI-assistita)
    ↓
[2] Creazione schede di studio (JSON/MD → app/public/data/theory/)
    ↓
[3] Creazione domande manuali (seed questions → app/public/data/questions/)
    ↓
[4] Creazione template parametrici (generator/templates/)
    ↓
[5] Generazione massiva (generator/generate.ts → migliaia di istanze)
    ↓
[6] Validazione e QA
    ↓
[7] Build webapp (vite build → dist/)
    ↓
[8] Packaging (Electron / PWA)
```

### 7.1 Obiettivi Quantitativi dell'Archivio Domande

| Categoria                   | Target minimo | Note                                          |
| --------------------------- | ------------- | --------------------------------------------- |
| Domande manuali (seed)      | 300–500       | Curate manualmente, coprono tutto il programma |
| Template parametrici        | 80–120        | Domande con variabili numeriche               |
| Istanze generate            | 3.000–5.000   | Generate dai template parametrici              |
| **Totale archivio**         | **4.000–6.000** | Combinato                                    |
| Domande per blocco (min)    | 400–800       | Distribuzione bilanciata                       |

### 7.2 Copertura per Tipo di Domanda

Distribuzione target nell'archivio complessivo:

| Tipo              | Quota target |
| ----------------- | ------------ |
| Scelta multipla   | 35%          |
| Risposta multipla | 15%          |
| V/F semplice      | 10%          |
| V/F multiplo      | 15%          |
| Inserimento num.  | 20%          |
| Testo libero      | 5%           |

---

## 8. Workflow di Sviluppo — Milestone

### M0 — Infrastruttura Progetto
- Inizializzazione repository, toolchain, struttura directory.
- Definizione schema JSON delle domande (con validazione JSON Schema).
- Definizione schema JSON dei contenuti di studio.
- Setup progetto React + Vite + Tailwind + TypeScript.

### M1 — Quiz Engine MVP
- Componente quiz funzionante con tutti i 6 tipi di domanda.
- Modalità sequenziale senza ritorno.
- Timer.
- Risultato a fine quiz con punteggio.
- 50 domande manuali di test (Blocco I e V).

### M2 — Pagine di Studio (Blocchi I–III)
- Struttura delle pagine di studio con tutti i componenti UI.
- Contenuti per i primi 3 blocchi.
- Mini-quiz di autoverifica embedded.
- Navigazione tra blocchi e sotto-argomenti.

### M3 — Generatore Parametrico
- Script generatore funzionante.
- Template parametrici per Blocco V (indici) e VI (BEP).
- Generazione di 500+ istanze.
- Integrazione nel quiz engine.

### M4 — Contenuti Completi
- Pagine di studio per tutti i 7 blocchi.
- Archivio domande completo (target §7.1).
- Casi studio interattivi.
- Formulario.

### M5 — Statistiche e Progressi
- Dashboard con progressi.
- Persistenza in LocalStorage/IndexedDB.
- Radar chart, trend, argomenti deboli.
- Storico simulazioni.

### M6 — Packaging e Polish
- Packaging Electron.
- PWA manifest e service worker.
- Test su dispositivi mobili.
- Revisione visiva completa.
- Distribuzione.

---

## 9. Regole Operative per Agenti AI

### 9.1 Lingua
- **Tutto il codice** (variabili, commenti, commit) è in **inglese**.
- **Tutto il contenuto didattico** (domande, spiegazioni, pagine di studio)
  è in **italiano**, perché il corso è in italiano.
- **Questo documento e la documentazione tecnica** sono in italiano.

### 9.2 Qualità del Contenuto Didattico
- Ogni domanda deve essere **verificata** rispetto al materiale del corso.
- Mai inventare contenuti che non siano supportati dal materiale sorgente.
- Le formule devono essere **esatte**: verificare sempre contro le slide e
  le dispense.
- Le spiegazioni devono seguire la Golden Rule (§2.1): PERCHÉ → COSA → COME.
- I distrattori nelle domande a scelta multipla devono essere
  **plausibili**: errori tipici, confusioni note, valori ottenuti con
  formule sbagliate. Mai opzioni assurde.

### 9.3 Fonti di Contenuto
Ordine di precedenza per i contenuti:

1. Slide e dispense ufficiali del corso (in `materiale/`).
2. Sintesi del docente (`XII-27-05-26-SINTESI-di-EOA26-a.md` e `b`).
3. Appunti degli studenti (`AppuntiEOA__.md`).
4. Conoscenza generale di economia aziendale (solo per arricchimento, mai
   in contraddizione con le fonti 1-3).

### 9.4 Riferimento Esame Reale
L'esame reale ha queste caratteristiche (cfr. `Guida-EOA-2026.md`
e `I-04-03-26-Modalita-esame.md`):

- 25–40 domande a tempo (durata comunicata dal docente).
- Sequenziale: 1 domanda alla volta, non si torna indietro.
- Risposta obbligatoria per proseguire.
- Ordine domande e ordine opzioni casuali per ogni studente.
- Superamento con ≥ 18/30.
- Mix di tutti i tipi di domanda (§4.4).
- Calcolatrice esterna consentita (no app).

La modalità "Simulazione Esame" della webapp deve replicare **esattamente**
questa esperienza.

---

## 10. Quality Bar

Prima di dichiarare qualsiasi milestone completa:

- [ ] **Golden Rule (§2.1)**: ogni concetto nelle pagine di studio è
      giustificato, non cade dal cielo.
- [ ] **Contrasto contract (§2.4)**: LOUD e QUIET sono chiaramente distinti;
      nessun affollamento visivo.
- [ ] **Nessun box-in-box**: i componenti UI non si annidano.
- [ ] **Domande verificate**: ogni domanda è corretta rispetto al materiale.
- [ ] **Distrattori plausibili**: nessuna opzione assurda.
- [ ] **Spiegazioni complete**: ogni domanda ha spiegazione PERCHÉ/COSA/COME.
- [ ] **Offline funzionante**: l'app funziona senza connessione internet.
- [ ] **Responsive**: testato su desktop, tablet e mobile.
- [ ] **Accessibilità base**: navigazione da tastiera, contrasto sufficiente,
      font leggibile.

---

## Appendice A — Mapping dal Progetto BOOK

Questa tabella documenta la derivazione dei principi applicati:

| Principio EOA Trainer          | Fonte BOOK                                             | Adattamento                                              |
| ------------------------------ | ------------------------------------------------------ | -------------------------------------------------------- |
| Golden Rule (§2.1)             | MANUAL_GUIDE.md §4.0                                   | Da WebGL2 pain → a decisione aziendale                   |
| Salto Concettuale (§2.2)       | Mindset Shift (`saltoparadigma`)                       | Da Imperativo/Lisp/Salto → a Tecnico/Aziendale/Salto    |
| Non Dare per Scontato (§2.3)   | `donotassume` callouts                                 | Da falsi amici C/Java → a confusioni economiche          |
| LOUD vs QUIET (§2.4)           | Visual Grammar v3, Contrast Contract                   | Da LaTeX boxes → a componenti React con Tailwind         |
| Anatomia Esercizio (§2.5)      | Exercise Anatomy 8 parti (§6.2)                        | Da esercizio di codice → a domanda d'esame               |
| Percorsi Differenziati (§2.6)  | ADR-003 Tiered Exercise Tracks                         | Da Min/Std/Cmpl → a Essenziale/Standard/Approfondito    |
| Non-Anticipazione (§2.7)       | Progression rule (§6.3)                                | Stessa regola, applicata ai blocchi EOA                  |
| Palette semantica (§6.2)       | Color is structural, not decorative (§4.2)             | Stessa filosofia, palette adattata                       |
| Keypoint = formula (§6.4)      | Keypoints are SCHEMATIC (§4.2)                         | Identico                                                 |
| Quality Bar (§10)              | Quality Bar (MANUAL_GUIDE.md §10)                      | Checklist adattata al formato webapp                     |
