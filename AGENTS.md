# AI WORKSPACE BOOTSTRAP

This file is the project-level bootstrap for AI coding and research agents.

The project's persistent knowledge is maintained in `.ai-docs/`.

## 1. Mandatory startup procedure

At the beginning of every new session:

1. Read `.ai-docs/index.md`.
2. Use `index.md` to identify the documents relevant to the current task.
3. Load only the minimum additional AI-KB documents required for the task.
4. Load further documents progressively when dependencies or missing context are discovered.
5. Do not load the entire `.ai-docs/` directory unless the task explicitly requires it.
6. When relevant, follow the operating rules in `.ai-docs/system-rules.md`.
7. Use `.ai-docs/state.md` when the current project status matters.

If `.ai-docs/index.md` does not exist, do not invent project knowledge. Inspect the workspace and determine whether the AI-KB needs to be initialized or repaired.

## 2. Task-oriented context loading

Before working on a task, classify AI-KB documents as:

- **REQUIRED** — necessary to perform the task correctly.
- **CANDIDATE** — potentially useful; load only if needed.
- **IRRELEVANT** — not needed for the current task.

Start with the smallest useful context and expand it only when necessary.

Normally, begin with approximately 2–3 high-value documents when specialized knowledge is required. This is a heuristic, not a fixed limit.

## 3. Source precedence

When information conflicts, use this precedence:

1. Current explicit user instruction
2. Actual current project/workspace state
3. Primary project documentation and source files
4. AI-KB documentation
5. AI inference

Never allow stale AI-KB content to override the current project.

Distinguish clearly between:

- **FACT** — directly supported by the project or an authoritative source
- **INFERENCE** — derived from available evidence
- **UNKNOWN** — not established by available evidence

Never fabricate missing information.

## 4. AI-KB maintenance

The AI-KB is maintained incrementally.

After significant changes to architecture, modules, APIs, dependencies, workflows, conventions, decisions, objectives, or project state:

1. Reconcile the affected AI-KB documents.
2. Update `.ai-docs/state.md` when project status changed.
3. Update `.ai-docs/index.md` when the document map, routing information, project identity, or structure changed.
4. Update or archive obsolete knowledge.
5. Keep the AI-KB minimal, non-duplicated, current, and routable.

Do not update the AI-KB merely to record trivial edits.

## 5. Initialization and synchronization

For first-time creation or reconstruction of the AI-KB:

> Execute the instructions in `onboard.md`.

For incremental synchronization after project changes:

> Execute the instructions in `update.md`.

Do not modify project source code merely because the AI-KB is being initialized or synchronized unless the user explicitly requests it.

## 6. AI-KB specification

The AI-KB follows **AI-KB Specification v1.0**, defined by `AI-KB.md`.

`AI-KB.md` defines the knowledge-base architecture and metadata conventions.

It is a specification, not project knowledge, and should not be copied into `.ai-docs/`.

## 7. General operating principles

- Prefer current evidence over assumptions.
- Prefer existing project conventions over generic best practices.
- Prefer focused context over exhaustive context.
- Avoid duplicating information across documents.
- Keep documents small and single-purpose.
- Preserve traceability of important decisions.
- Do not create documents that have no clear routing or maintenance value.
- Do not silently rewrite historical decisions; supersede or archive them when appropriate.

The AI-KB exists to maximize relevant, reliable, current context while minimizing unnecessary context loading.