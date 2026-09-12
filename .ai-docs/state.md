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

## In Progress

- **Milestone 1 (M1) & Milestone 3 (M3) — Question Bank Expansion & Parametric Engines**:
  - Developing parametric templates for Break-Even Analysis (Blocco VI) and Financial Statements / Working Capital (Blocchi IV & V).
  - Extracting curated seed questions across all 7 blocks from course transcripts.

## Planned

- **M2**: Populate complete interactive study content for Blocchi I–VII.
- **M4**: Batch generation of 4,000–6,000 questions to disk.
- **M5**: Progress Dashboard & Persistence (LocalStorage / IndexedDB).
- **M6**: Electron desktop packaging & PWA offline bundle.

## Blocked

- None.

## Known Issues

- In Windows PowerShell, use `npm.cmd` / `npx.cmd` to avoid execution policy restriction on `npm.ps1`.
