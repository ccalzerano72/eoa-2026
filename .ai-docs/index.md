---
id: index
type: index
scope: global
status: active
priority: critical
updated: 2026-09-12
volatility: medium
confidence: high
source:
  - repository
  - documentation
---

# EOA Exam Trainer — Knowledge Base Index

## Project Identity

- **Name:** EOA Exam Trainer (Economia e Organizzazione Aziendale 2026)
- **Author / Instructor:** Prof.ssa Antonella Martini (Docente titolare), Salvatore Calzerano (Autore strumento didattico)
- **Institution:** Università di Pisa, Corso di Laurea in Ingegneria Informatica
- **Type:** HYBRID (SOFTWARE / WEBAPP + STUDY / EDUCATIONAL DATA GENERATION)
- **Primary Objective:** Offline-first web application for exam training and simulation, featuring interactive study pages, parametric infinite quiz generation, and a bank of 4,000–6,000 questions covering all 7 syllabus blocks.

## Current Status

- **Phase:** M0–M5 completed + Fase 1 question-bank rebalancing completed (6,055 questions aligned to §7.2). Next: M6 (Electron desktop packaging & PWA offline bundle). Build re-verification pending (owner runs it).
- Specification distilled from BOOK didactic & visual standards (`Golden Rule`, `LOUD/QUIET`, `donotassume`, `tiered tracks`).
- Course materials cataloged in `materiale/1-md/` (46 documents) and `materiale/2-LLM wiki/`.

## Document Routing Map

| ID             | Path                | Description                                                      | Task / Domain                      |
| -------------- | ------------------- | ---------------------------------------------------------------- | ---------------------------------- |
| `system-rules` | `system-rules.md`   | Operating rules & protocol for AI agents                         | Startup, context loading, routing  |
| `state`        | `state.md`          | Current implementation state, milestone tracking, known issues   | Project monitoring, task selection |
| `design-spec`  | `../DESIGN_SPEC.md` | Canonical master specification for the webapp and quiz generator | Architecture, UI/UX, didactics     |
