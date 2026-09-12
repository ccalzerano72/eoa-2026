# AI Knowledge Base Specification

**Version:** 1.1

## 1. Purpose

This specification defines a lightweight, persistent, tool-independent knowledge system for AI agents working on a project.

The system is designed to maximize:

- relevant context;
- reliability;
- freshness;
- traceability;
- efficient context loading;

while minimizing:

- unnecessary context;
- duplicated information;
- stale knowledge;
- uncontrolled growth of documentation.

The AI-KB is intended to be usable by different AI agents and development environments without making the knowledge itself dependent on a specific tool.

---

## 2. Architecture

The system has four layers:

```text
Bootstrap layer
    ↓
AGENTS.md / tool-specific adapter
    ↓
Routing layer
    ↓
.ai-docs/index.md
    ↓
Knowledge layer
    ↓
.ai-docs/*.md
```

Additional project-level files:

```text
AI-KB.md       Specification of the AI-KB system
onboard.md     Initial creation/reconstruction procedure
update.md      Incremental synchronization procedure
```

### 2.1 Bootstrap layer

The bootstrap layer solves a fundamental problem:

> A new AI session cannot use `.ai-docs/index.md` unless the agent first knows that the file exists.

`AGENTS.md` is therefore the canonical project-level bootstrap file.

Its responsibilities are limited to:

- directing the agent to `.ai-docs/index.md`;
- defining the startup procedure;
- defining source precedence;
- pointing to `onboard.md` and `update.md`;
- defining basic AI-KB operating principles.

It must **not** contain detailed project knowledge.

### 2.2 Tool adapters

Different AI tools may use different project-level instruction mechanisms.

The canonical instructions remain in `AGENTS.md`.

When a tool does not natively load `AGENTS.md`, a minimal adapter MAY be provided.

Example:

```text
CLAUDE.md
    ↓
@AGENTS.md
```

Adapters must not duplicate the contents of `AGENTS.md`.

Tool-specific rules may be added only when they are genuinely specific to that tool.

### 2.3 Knowledge layer

Project knowledge is stored under:

```text
.ai-docs/
```

The AI-KB is independent from the bootstrap mechanism.

---

## 3. Core principles

### 3.1 Minimality

Create only documents that provide real routing or knowledge value.

Do not create empty placeholder directories or documents.

### 3.2 Non-duplication

Each significant piece of knowledge should have one canonical location.

Other documents should reference it rather than duplicate it.

### 3.3 Modularity

Each document should have a clear scope and purpose.

### 3.4 Lazy loading

Do not load the entire AI-KB at session startup.

Start with the router and load relevant knowledge progressively.

### 3.5 Progressive disclosure

Load additional context only when the current context is insufficient.

### 3.6 Traceability

Important decisions and non-obvious project constraints should be traceable to their source or decision record.

### 3.7 Freshness

Current project state takes precedence over stale documentation.

### 3.8 Human readability

Documents must remain understandable and useful to humans.

### 3.9 Machine routability

Documents must contain sufficient metadata and descriptions for an AI agent to determine when they are relevant.

### 3.10 Source precedence

When information conflicts, use:

1. current explicit user instruction;
2. actual current project/workspace state;
3. primary project documentation and source files;
4. AI-KB documentation;
5. AI inference.

Never allow stale AI-KB information to override current project evidence.

---

## 4. Required project structure

The minimum AI-KB is:

```text
.ai-docs/
├── index.md
├── system-rules.md
└── state.md
```

Additional directories are created only when justified:

```text
.ai-docs/
├── architecture/
├── decisions/
├── standards/
├── modules/
├── knowledge/
├── research/
├── literature/
├── data/
└── tasks/
```

The exact structure is project-dependent.

The AI-KB must not become a mirror of the source repository.

---

## 5. Bootstrap

A compatible project should contain:

```text
AGENTS.md
```

at the project root.

`AGENTS.md` is the entry point for agents that support project-level agent instructions.

Its first responsibility is to direct the agent to:

```text
.ai-docs/index.md
```

The normal startup sequence is therefore:

```text
AGENTS.md
    ↓
.ai-docs/index.md
    ↓
task classification
    ↓
relevant AI-KB documents
    ↓
actual project sources when required
```

The AI-KB specification does not assume that every AI tool automatically reads `AGENTS.md`.

Tool-specific adapters may provide equivalent bootstrapping.

---

## 6. index.md

`index.md` is the AI-KB router.

It should normally remain below approximately 500 tokens.

It should contain:

- project identity;
- project type;
- primary objective;
- current high-level status;
- complete map of active AI-KB documents;
- short descriptions;
- task/domain routing information.

It should **not** contain detailed project knowledge.

Typical structure:

```text
Project identity
Project type
Primary objective
Current status

Document map:
ID | Path | Description | Relevant tasks/domains
```

Every active AI-KB document should be represented in the index.

---

## 7. state.md

`state.md` describes the current project state.

Typical sections:

- Implemented
- In progress
- Planned
- Blocked
- Known issues
- Recent structural changes

It should describe the current state, not become a chronological project diary.

---

## 8. system-rules.md

`system-rules.md` contains project-specific operating rules for AI agents.

It may define:

- startup behavior;
- routing rules;
- lazy-loading rules;
- source precedence;
- conflict resolution;
- project conventions;
- maintenance rules.

It must not duplicate general project knowledge.

---

## 9. Metadata

AI-KB documents should use YAML frontmatter.

Required fields:

```yaml
---
id:
type:
scope:
status:
priority:
updated:
---
```

Optional fields:

```yaml
volatility:
confidence:
source:
depends_on:
related:
triggers:
```

### 9.1 Standard values

`type`:

```text
architecture
module
standard
decision
state
domain
workflow
api
data
research
literature
experiment
requirement
task
glossary
reference
index
other
```

`scope`:

```text
global
subsystem
module
task
```

`status`:

```text
active
draft
deprecated
archived
```

`priority`:

```text
critical
high
medium
low
```

`volatility`:

```text
low
medium
high
```

`confidence`:

```text
high
medium
low
```

`source`:

```text
repository
user
documentation
conversation
external
inference
```

`depends_on` must contain document IDs, not paths.

`related` contains non-essential related document IDs.

`triggers` contains concepts or keywords useful for routing.

---

## 10. Document IDs

Every AI-KB document should have a stable logical ID.

Recommended format:

```text
lowercase-kebab-case
```

Examples:

```text
system-rules
project-architecture
authentication
database-schema
adr-003-api-versioning
```

IDs should remain stable when possible, even if files are reorganized.

---

## 11. Task routing

The agent should classify documents relative to the current task as:

### REQUIRED

The document is necessary to perform the task correctly.

### CANDIDATE

The document may become relevant but is not currently necessary.

### IRRELEVANT

The document is unrelated to the current task.

The agent should initially load the smallest useful context.

Normally this means approximately 2–3 high-value documents when specialized knowledge is required.

This is a heuristic, not a fixed limit.

The agent must expand context when dependencies, ambiguities, or missing information require it.

---

## 12. Knowledge certainty

Agents must distinguish:

### FACT

Directly supported by project evidence or an authoritative source.

### INFERENCE

Derived from available evidence but not explicitly established.

### UNKNOWN

Not established by available evidence.

Agents must never convert an inference or unknown into an asserted fact.

---

## 13. Source of truth

When an AI-KB document conflicts with the current project:

```text
current project > stale AI-KB
```

The AI-KB must then be reconciled.

Historical decisions should not be silently rewritten.

Instead, they should be superseded, deprecated, or archived when appropriate.

---

## 14. Decision records

Important architectural or project decisions should be recorded under:

```text
.ai-docs/decisions/
```

Recommended naming:

```text
ADR-001.md
ADR-002.md
ADR-003.md
```

Recommended structure:

```text
Decision
Status
Context
Rationale
Alternatives
Consequences
```

Never invent historical rationale.

If the rationale is unknown:

```text
Rationale: UNKNOWN
```

---

## 15. Maintenance

The AI-KB should be updated after significant changes to:

- architecture;
- components;
- APIs;
- interfaces;
- dependencies;
- configuration;
- workflows;
- conventions;
- data structures;
- tests;
- objectives;
- project state;
- important decisions.

Trivial edits do not require AI-KB updates.

When knowledge becomes obsolete:

1. update it if still useful;
2. deprecate or archive it if historically relevant;
3. remove it if it has no remaining value.

Avoid dead documents.

---

## 16. Initialization

`onboard.md` defines the procedure for:

- first-time AI-KB creation;
- reconstruction;
- structural repair;
- migration of an existing AI-KB.

It should inspect the project and build the minimum sufficient knowledge architecture.

---

## 17. Incremental synchronization

`update.md` defines the procedure for reconciling the AI-KB with project changes.

It must prefer selective inspection over rebuilding the entire AI-KB.

---

## 18. Specification versus project knowledge

The following are system-level files:

```text
AI-KB.md
AGENTS.md
onboard.md
update.md
```

Project-specific knowledge belongs under:

```text
.ai-docs/
```

`AI-KB.md` must not be copied into `.ai-docs/`.

---

## 19. Versioning

The specification uses:

```text
MAJOR.MINOR
```

A major version indicates structural or behavioral incompatibility.

A minor version indicates backward-compatible additions or clarifications.

---

## 20. Design objective

The AI-KB exists to provide:

> the smallest reliable and current set of project context required for an AI agent to perform a task correctly.