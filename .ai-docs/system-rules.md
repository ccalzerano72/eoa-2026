---
id: system-rules
type: standard
scope: global
status: active
priority: critical
updated: 2026-09-12
volatility: low
confidence: high
source:
  - repository
  - documentation
depends_on:
  - index
---

# System Rules & Operating Protocol — EOA Exam Trainer

## 1. Source Precedence

1. Current explicit user/instructor instruction
2. Actual current project/workspace state
3. Primary course materials (`materiale/1-md/`, `materiale/2-LLM wiki/`)
4. Approved specification (`DESIGN_SPEC.md`)
5. AI-KB documentation (`.ai-docs/`)
6. AI inference

Never fabricate economic data, formulas, or course concepts. Distinguish FACT, INFERENCE, and UNKNOWN.

## 2. Language Protocol

- **Code, identifiers, file names, commits:** English.
- **Didactic content (questions, explanations, theory, study pages):** Italian (the course is taught in Italian at UniPi).
- **Technical specifications and documentation:** Italian / English hybrid as per project conventions.

## 3. Didactic Invariants (from BOOK)

- **The Golden Rule:** Every concept, formula, or calculation must be justified BEFORE presentation (WHY $\rightarrow$ WHAT $\rightarrow$ HOW).
- **Engineering vs. Business Contrast:** Frame concepts by contrasting technical thinking with economic-managerial thinking.
- **Do Not Assume Traps:** Explicitly flag and demolish common misconceptions (e.g. profit $\neq$ cash, complicated $\neq$ complex).
- **Exam Fidelity:** The simulation engine must replicate real exam mechanics (sequential, non-reversible, time-bound, exact question formats).

## 4. Technical Protocol

- **Offline-First:** No reliance on cloud APIs, live LLM calls, or external network services. All assets bundled locally.
- **Shell on Windows:** Use `npm.cmd` / `npx.cmd` in PowerShell to bypass script execution policy constraints.
