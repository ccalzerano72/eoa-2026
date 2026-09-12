# EOA Exam Trainer — Webapp

Offline-first study and exam-simulation webapp for **Economia e
Organizzazione Aziendale (EOA 2026)**, Università di Pisa — Ingegneria
Informatica (Prof.ssa Antonella Martini). Canonical specification:
`../DESIGN_SPEC.md`.

## Stack

React 19 + TypeScript + Vite 8 + Tailwind CSS 4, KaTeX for formulas.
No backend required: theory and the question bank are static JSON under
`public/data/` (theory, questions, blocks). An optional local telemetry
server lives in `../server/` and is only used via `npm run dev`.

## Scripts (run from `app/` with `npm.cmd` on Windows)

| Command                    | What it does                                              |
| -------------------------- | --------------------------------------------------------- |
| `npm run dev:app`          | Vite dev server (frontend only)                           |
| `npm run dev`              | Dev server + local log server (`../server/server.js`)     |
| `npm run generate:questions` | Regenerate the question bank (`../generator/`)          |
| `npm test`                 | Unit + snapshot tests (`tsx --test`, zero extra deps)     |
| `npm run test:generate`    | Regenerate bank, then run the full suite                  |
| `npm run lint`             | `oxlint` (must report 0 warnings)                         |
| `npm run build`            | `tsc -b && vite build` → static bundle in `dist/`        |
| `npm run preview`          | Serve the production bundle locally                       |

## Layout

- `src/components/quiz/` — `QuizRunner` (all 6 exam question types,
  sequential non-reversible exam mode, review), `FlashCardRunner`,
  `ExplanationCard` (shared Golden Rule PERCHÉ/COSA/COME renderer)
- `src/components/study/` — `StudyBlockViewer` (roadmap, keypoints,
  traps, mini-quiz entry points)
- `src/components/stats/` — `StatsHistoryView`, `charts.tsx`
  (SVG radar + sparkline, no chart dependency)
- `src/components/formula/` — interactive `FormulaCheatsheetView`
- `src/components/simulator/` — DuPont playground, balance-sheet builder
- `src/data/` — `formulas.ts`, `study-links.ts` (question/formula topic
  → theory anchor map with honest block-level fallback)
- `src/services/` — `storage.ts` (localStorage history + SM-2 spaced
  repetition), `logger.ts` (buffered, degrades gracefully offline)
- `src/types/` — `question.ts`, `quiz.ts`, `study.ts` (mirror
  `../generator/src/types.ts` for the runtime schema)

## Conventions

- Code, identifiers, commits: English. Didactic content: Italian.
- Didactic invariant: every explanation follows PERCHÉ → COSA → COME.
- Question bank is generated, never hand-edited: change templates or
  seeds in `../generator/src/`, then `npm run test:generate`.
- Quality gates: `npm test` (engine, study-links, archive snapshot),
  `npm run lint`, `npm run build` — all green before commit.
