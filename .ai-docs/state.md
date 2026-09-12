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

- **Milestone 2 (M2) — Interactive Study Content & Didactic Blocks**: COMPLETED.
  - Authored and validated complete didactic knowledge blocks for all 7 syllabus blocks (`app/public/data/theory/blocco-1.json` through `blocco-7.json`).
  - Structured strictly according to the BOOK Golden Rule (WHY decision problem, WHAT conceptual core, HOW schematic formulas, TRAP donotassume misconceptions, and CONCEPT SHIFT engineering vs managerial perspective).
  - Integrated course case studies: Olivetti P101 (B1), Satispay / Exein / Davines (B2), Governance & Startup Funding (B3), Bilancio OIC & De Cecco (B4), Connecta S.r.l. & Growth Eats Cash (B5), Break-Even Analysis (B6), Business Model Canvas & All'Antico Vinaio (B7).
  - Added horizontal block quick-selector bar to `App.tsx` for seamless switching between blocks 1 to 7 in the Study tab.

## In Progress

- **Milestone 4 (M4) — Large Scale Batch Generation**:
  - Expanding parametric templates and combinatorics to reach 4,000–6,000 questions on disk.

## Planned

- **M4**: Batch generation of 4,000–6,000 questions to disk.
- **M6**: Electron desktop packaging & PWA offline bundle.

## Blocked

- None.

## Known Issues

- In Windows PowerShell, use `npm.cmd` / `npx.cmd` to avoid execution policy restriction on `npm.ps1`.
