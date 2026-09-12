---
id: state
type: state
scope: global
status: active
priority: high
updated: 2026-09-12
volatility: high
confidence: high
source:
  - repository
  - documentation
depends_on:
  - index
triggers:
  - status
  - progress
  - backlog
  - issues
---

# Current Project State — EOA Exam Trainer

## Implemented

- **Course Materials Inventory**: Complete cataloging of 46 Markdown transcriptions in `materiale/1-md/` and LLM wiki in `materiale/2-LLM wiki/`.
- **Exam Constraints Mapped**: Complete mapping of exam format from `Guida-EOA-2026.md` (sequential non-reversible navigation, strict timer, 6 question types, punitive multi-T/F scoring).
- **Design Specification**: Approved canonical specification `DESIGN_SPEC.md` incorporating didactic models from `BOOK` (Golden Rule, Mindset Shift, `donotassume` traps, LOUD/QUIET visual grammar, tiered tracks, 8-part exercise anatomy, parametric generation).
- **AI Knowledge Base**: Initialized `.ai-docs/` (`index.md`, `state.md`, `system-rules.md`).
- **Milestone 0 (M0) — Project Infrastructure**: COMPLETED.
  - Setup React 19 + TypeScript + Vite 8 + Tailwind CSS 4 in `app/`.
  - Defined domain types: `Question`, `StudyBlock`, `QuizSessionState`, `ExplanationBlock` (WHY/WHAT/HOW/TRAP).
  - Created interactive didactic UI components: `KeypointCard` (schematic formula), `TrapCard` (misconceptions), `ShiftCard` (mindset contrast), `FormulaBlock` (KaTeX), `CaseStudyCard`.
  - Implemented `QuizRunner`: supports all 6 question types, sequential non-reversible navigation, timer, scoring, and post-exam review.
  - Implemented `StudyBlockViewer`: structured roadmap, case study dilemma, topics with Golden Rule sequence.
  - Implemented `generator/`: engine with formula evaluation, constraint checking, distractor synthesis, and tested with `B5-IND-LEVA-ROE`.
  - Validated production build with `tsc` and `vite build`.

- **Milestone 5 (M5) — Progress Dashboard & Persistence**: COMPLETED (Local storage persistence + History & Stats View + Navigation History).
  - Implemented `storage.ts` service with automatic local storage saving (`eoa_quiz_history_v1`) of completed tests and simulations.
  - Implemented `StatsHistoryView.tsx`: KPI cards (total simulations, pass rate, average grade /30, best grade, study time), 7-block mastery radar, and past session review table.
  - Implemented in-app navigation stack with Back/Forward arrow buttons (`←` / `→`) and keyboard shortcuts (`Alt+Left`, `Alt+Right`).
  - Implemented quiz review session preservation and contextual return banner when exploring study blocks from a quiz review.
  - Added dashboard progress widget for quick performance summary.

- **Milestone 1 (M1) & Milestone 3 (M3) — Question Bank Expansion & Parametric Engines**: COMPLETED.
  - Implemented 8 parametric templates across Blocchi IV, V e VI:
    - `leverage-roe.ts`: ROE = ROI + (ROI - i) \* (D / E)
    - `bep-quantity.ts`: Q\* = CF / (p - cv)
    - `bep-revenue.ts`: R\* = CF / ((p - cv) / p)
    - `operating-leverage.ts`: GLO = MdC_tot / RO
    - `safety-margin.ts`: MS = (Q - Q*) / Q * 100
    - `working-capital.ts`: CCN = AC - PC
    - `liquidity-ratios.ts`: Quick Ratio = (Liq.Imm + Liq.Diff) / PC
    - `turnover-working-capital.ts`: CCC = DIO + DSO - DPO (Cash Conversion Cycle)
  - Curated seed question bank covering all 7 syllabus blocks in `generator/src/seed-data/` across all 6 exam question types.
  - Implemented batch question generator `generator/src/build-questions.ts` (`npm run generate:questions`).
  - Generated and validated initial batch of 173 questions exported directly to `app/public/data/questions/sample.json` and `questions.json`.

- **Milestone 2 (M2) — Interactive Study Content & Didactic Blocks**: COMPLETED (Massive Overhaul & Full Course Alignment).
  - Authored, validated and fully aligned all 7 didactic knowledge blocks (`app/public/data/theory/blocco-1.json` through `blocco-7.json`) covering 100% of the material in `materiale/1-md/` (46 documents, slides and notes).
  - Dataset metrics: 37 in-depth topics, 62 keypoint cards, 38 trap cards, concept shifts, and complete procedural details (`howDetails`).
  - Blocco 1: Economia, definizioni art. 2082 e 2555 c.c., flussi di mercato, stakeholder theory, funzioni management, imprenditore vs manager, complicato vs complesso, trade-off vs costo opportunità, rassegna completa bias (Simon, Frederick, Kahneman & Tversky, Thaler, Iyengar & Lepper, Samuelson & Zeckhauser), casi Olivetti, Ferrari e Nokia.
  - Blocco 2: Autonomia patrimoniale perfetta/imperfetta, beneficio di escussione (art. 2304), impresa individuale, S.n.c., S.a.s. con divieto di immistione (art. 2320), S.r.l., S.p.A., S.a.p.a., Startup Innovativa (D.L. 179/2012), spettro degli scopi (B-Corp, Società Benefit L. 208/2015, Social Business, Terzo Settore) ed Economia Civile di Stefano Zamagni (parabola degli 11 cammelli).
  - Blocco 3: Azioni (ordinarie, risparmio, voto plurimo, maggiorato), obbligazioni (ordinarie, convertibili, subordinate), modelli di governance (tradizionale art. 2380-bis, dualistico, monistico), caso Parmalat, filiera VC completa (LP, GP, carried interest, power law, CVC), patti parasociali e clausole (liquidation preference, anti-dilution, drag/tag along, vesting & cliff).
  - Blocco 4: Modello del valore vs contabile (metafora diga), capitale di funzionamento, i 4 documenti OIC (SP, CE, Rendiconto Finanziario, Nota Integrativa), clausola generale verità/chiarezza/correttezza, principi art. 2423-bis (prudenza, competenza, continuità), ratei e risconti, ammortamento, magazzino FIFO/LIFO/CMP in inflazione.
  - Blocco 5: Riclassificazione finanziaria SP, margini strutturali (CCN, MT, MS1, MS2), indici di liquidità (Current e Quick Ratio), redditività (ROE, ROI, ROS, Turnover, Du Pont), formula Modigliani-Miller della leva finanziaria con spread (ROI - i), durate medie circolante (DIO, DSO, DPO, CCC) e dinamica Growth Eats Cash.
  - Blocco 6: Costi fissi/variabili/diretti/indiretti/a gradino, Direct Costing vs Full Costing, MdC unitario/totale/percentuale, Break-Even Point (volume e fatturato), utile obiettivo, Grado di Leva Operativa (GLO), Margine di Sicurezza (1/GLO) e le 3 decisioni di breve periodo (Make or Buy, chiusura linee, ordini speciali).
  - Blocco 7: Definizione business model (prodotto vs modello vs strategia), i 9 blocchi del Canvas (fasi canali, tipologie ricavi e prezzi fissi/dinamici), strategie competitive di Michael Porter con rischio stuck in the middle, modelli digitali (Freemium, SaaS, Razor & Blades) ed economie di rete in piattaforme two-sided.
  - Frontend: aggiornato `StudyBlockViewer.tsx` con supporto a formattazione a paragrafi (`whitespace-pre-line`) e rendering degli approfondimenti operativi e procedurali (`howDetails`).

- **Milestone 4 (M4) — Large Scale Batch Generation & Interactive Formulario**: COMPLETED (distribution later superseded by Fase 1 rebalancing → 6,055 questions).
  - Scaled question bank to **5,621 total validated questions** on disk (`app/public/data/questions/questions.json`, `sample.json`, and partitioned `blocks/block-{1..7}.json`).
  - Distribution across syllabus blocks:
    - Blocco 1: 737 domande
    - Blocco 2: 675 domande
    - Blocco 3: 554 domande
    - Blocco 4: 794 domande
    - Blocco 5: 1,033 domande
    - Blocco 6: 1,154 domande
    - Blocco 7: 674 domande
  - Distribution across question types:
    - Single-choice: 3,151 domande (56.1%)
    - Numeric-input: 1,121 domande (19.9%)
    - True-False: 905 domande (16.1%)
    - Multi-True-False: 437 domande (7.8%)
    - Multi-choice & Free-text: seed bank items
  - Distribution across tiered tracks:
    - Essential: 1,269 domande (22.6%)
    - Standard: 3,915 domande (69.6%)
    - Advanced: 437 domande (7.8%)
  - Expanded parametric template library from 8 to **28 templates** covering all 7 blocks, generating both single-choice and numeric-input variants with validated formulaic distractors and strict Golden Rule explanations.
  - Implemented **7 combinatorial generators** creating scenario-based True/False, Single-Choice, and Multi-True-False questions for all syllabus blocks.
  - Implemented **Interactive Formulario** (`app/src/components/formula/FormulaCheatsheetView.tsx` & `app/src/data/formulas.ts`):
    - Full didactic repository of all quantitative formulas of EOA 2026.
    - KaTeX display, variable definitions, and unit badges.
    - Structured PERCHÉ / COSA / COME and TRAPPOLA conceptual explanations.
    - Instant search and block filter chips.
    - Interactive actions: "Esercitati su questa formula" (initiates focused practice quiz) and "Vedi teoria" (opens the corresponding study block).
  - Webapp UI integration in `App.tsx`:
    - Added "Formulario" tab to navigation bar and history stack.
    - Added balanced exam simulation sampling (`sampleExamQuestions`: 28 questions drawn randomly across all 7 blocks).
    - Updated live question count display on dashboard.
  - Production build and oxlint validated with 0 errors.

- **Fase 1 — Question Bank Rebalancing (§7.2)**: COMPLETED.
  - Extended parametric engine (`generator/src/engine.ts`) from SC/NUM-only to 5 output types: `single-choice`, `numeric-input`, `multi-choice`, `multi-true-false`, `free-text` (`ParametricOutputType` in `types.ts`). New branches derive 2-correct MC options and 2V/2F MTF items from formula-anchored distractors; numeric FT carries dual grading fields (`numericAnswer` + `freeTextKeywords`).
  - Added `computeDistractors()` (validated: finite, distinct, non-trivial >2%/>0.05) with expanded fallback pool, `numericAnswerKeywords()`, and unbiased Fisher-Yates `shuffleArray()` replacing all 8 `.sort(() => Math.random() - 0.5)` occurrences (engine + 7 combinatorial generators).
  - Rebalanced per-template quotas in `build-questions.ts`: 40 SC + 40 NUM + 30 MC + 15 MTF + 10 FT (135/template, 3,780 parametric instances). TF intentionally excluded from parametric budget (already over target via combinatorics).
  - Added 14 curated seeds (`seed-data/block-seeds-2.ts`, `B*-SEED-*` namespace): 1 MC + 1 FT per block with Golden Rule explanations.
  - Fixed systematic double-unit rendering bug (`18,4%%`, `40M€ M€`, `625,0dipendenti dipendenti`) in ~20 templates (convention: interpolated values carry the unit, template text must not repeat it) and added a permanent double-unit regression gate in `build-questions.ts`.
  - Extended integrity checks: MC ≥2 correct, MTF mixed V/F, numeric finite value + positive tolerance, FT keywords (+ numericAnswer validation when present), `sourceRef` required.
  - Stratified `sample.json` (17 SC + 7 MC + 5 TF + 8 MTF + 10 NUM + 3 FT per block = 350).
  - Final dataset: **6,055 questions** — SC 33.5% (≈35), MC 14.1% (≈15), MTF 14.2% (≈15), NUM 18.5% (≈20), FT 4.8% (≈5), TF 14.9% (over 10% target, combinatorial excess, accepted).
  - QuizRunner free-text grading: numeric path (tolerance-aware) when `numericAnswer` present, keyword-overlap fallback otherwise (`QuizRunner.tsx`).
  - Known residuals: seed count 43 vs 300–500 target; templates 28 vs 80–120; `prerequisites`/`caseStudyRef` unpopulated; B5/B6 above 800/block ceiling.
  - NOTE: production build (`tsc` + `vite build`) and oxlint re-verification after these changes is PENDING (owner runs it).

- **Fase 2 (parziale) — UX & Didattica 2.1–2.3**: COMPLETED.

- **Fase 2 (completamento) — UX & Didattica 2.4–2.6**: COMPLETED.
  - **2.4 Stats** (`StatsHistoryView.tsx` + nuovo `stats/charts.tsx` con radar eptagonale SVG e sparkline, senza nuove dipendenze): radar padronanza 7 blocchi, trend voti simulazioni, sezione "Punti Deboli" (blocchi <60% e topic <60% con CTA Ripassa/Quiz mirato/Quiz blocco), striscia copertura archivio (quesiti visti / 6.055 con `role=progressbar`), filtri dinamici per tutte le mode presenti nello storico (prima solo all/exam/free), badge mode reali nelle righe. Nuove prop `allQuestions`, `onStartTopicQuiz`, `onStartBlockQuiz`.
  - **2.5 Dashboard** (`App.tsx`): terzo CTA hero "Pratica Libera (15)" (`handleStartFreePractice`), barre % padronanza per blocco + sparkline trend nella sezione progressi, badge track persistente nell'header (click → dashboard).
  - **2.6 Finitura**: `CollapsibleSection` riscritta (niente più button-nidificati, `aria-expanded`/`aria-controls`, badge slot esterno); modale stats con `role=dialog`, Esc e focus; timer quiz con `role=timer`; card blocco e brand navigabili da tastiera; `aria-label` su frecce, temi, delete, copia KaTeX; focus su `<main>` a ogni navigazione; completati i `dark:` mancanti (badge, banner trappole/ripasso, pill); fix warning oxlint `set-state-in-effect` nel Formulario (reset indice nei gestores eventi).
  - Verificato: `tsc -b` pulito, `oxlint` 0 warning. Nota: `computeOverallStats.freePracticeCount` raggruppa ancora tutte le mode non-exam (i filtri UI ora usano conteggi dinamici reali).
  - **2.1 Golden Rule ovunque**: nuovo `ExplanationCard.tsx` (PERCHÉ/COSA/COME + trappola `quiet`/`loud`, toni `slate`/`amber`) usato sia nella review finale sia nel reveal immediato di `free-practice`/`spaced-review`/`traps-only` (prima mostravano solo `how`). `traps-only` mantiene la card rossa prominente.
  - **2.2 Deep-link teoria riparato**: nuovo `src/data/study-links.ts` con `resolveStudyTopic()` (exact-match + override table evidence-based + fallback onesto al blocco). Usato da "Vai alla Lezione" in review e da "Vedi teoria" nel Formulario. Copertura validata: 4,010/6,055 domande e 18/24 formule risolvono a un topic; il resto (slug strategia/organizzazione/finanza senza home teorica + `diagnosi-*`) apre il blocco. Firma `onNavigateToStudy` uniformata a `topicId?`.
  - **2.3 Quiz per argomento reali + mini-quiz**: `handleStartTopicQuiz` filtra per topic di studio risolto (prima il match `includes()` falliva quasi sempre → quiz di blocco camuffato); nuovo `handleStartBlockQuiz` esplicito (sostituisce il trucco `topicId=""`); nuovo `handleStartMiniQuiz` da 5 domande con bottone "Mini-quiz (5)" in `StudyBlockViewer`.
  - Verificato: `tsc -b` pulito; `oxlint` con 1 warning pre-esistente in `FormulaCheatsheetView.tsx:64` (set-state-in-effect, non toccato).

- **New Quiz Modes — Flash Cards, Track Selector, Traps Quiz**: COMPLETED.
  - Implemented `FlashCardRunner.tsx`: standalone flip-card component with keyboard navigation (←/→/Space/Enter), block and source filters (Domande/Formule), shuffle, dual data sources (6,055 questions + all formulasData formulas), no timer/scoring.
  - Implemented **Tiered Track Selector** (◆ Essenziale / ■ Standard / ○ Approfondito / Tutti): global filter on Dashboard that restricts all quiz modes and flash cards to the selected track (essential: 1,322 Qs, standard: 4,296 Qs, advanced: 437 Qs — post-Fase-1 counts).
  - Implemented **Quiz Trappole Dedicate**: `traps-only` mode in `QuizRunner` with immediate explanation reveal, full PERCHÉ/COSA/COME breakdown, and prominent red ⚠ "Trappola Concettuale — Non Dare per Scontato" card. 20 random questions per session. Rose-colored status bar and mode banner.
  - Added `"flash-cards"` to `QuizMode` type union in `quiz.ts`.
  - Dashboard "Modalità di Studio Avanzate" panel with two action cards (Flash Cards, Quiz Trappole) and inline track filter chips.
  - Production build (`tsc` + `vite build`) and oxlint validated with 0 errors.

- **Performance & UX Enhancements (September 2026)**: COMPLETED.
  - **Code Splitting**: Implemented React.lazy() for heavy components (`FlashCardRunner`, `StatsHistoryView`, `FormulaCheatsheetView`, `DuPontPlayground`) with Suspense boundaries and animated LoadingFallback spinner. Reduces initial bundle load.
  - **Spaced Repetition System**: Full implementation in `storage.ts`:
    - `QuestionPerformance` tracking per-question with ease factor (SM-2 inspired algorithm).
    - `recordQuestionAttempt()` updates ease factor on correct/incorrect answers.
    - `recordSessionPerformance()` batch updates from completed quiz sessions (auto-called by `saveQuizRecord()`).
    - `getQuestionsNeedingReview()` returns prioritized question IDs based on low ease factor, time decay, and consecutive errors.
    - `getSpacedRepStats()` computes mastered/learning/difficult counts for dashboard display.
    - New localStorage key: `eoa_spaced_repetition_v1`.
  - **Intelligent Review Mode ("Ripasso Intelligente")**: New `spaced-review` QuizMode that selects questions using spaced repetition algorithm. Dashboard card displays live stats (difficili/in corso/ok). Teal-colored banner in QuizRunner. Immediate explanation reveal like free-practice mode.
  - **Dark Mode**: Full implementation with three-state toggle (Light ☀️ / System 🖥️ / Dark 🌙):
    - Theme preference persisted in localStorage (`eoa_theme_preference`).
    - CSS custom properties for dark mode colors in `index.css`.
    - Tailwind `dark:` variants applied to: main wrapper, header, footer, LoadingFallback, QuizRunner cards and status bar.
    - Toggle widget in navbar with visual feedback for active state.

## In Progress

- None.

## Planned

- **M6**: Electron desktop packaging & PWA offline bundle.

## Blocked

- None.

## Known Issues

- In Windows PowerShell, use `npm.cmd` / `npx.cmd` to avoid execution policy restriction on `npm.ps1`.
