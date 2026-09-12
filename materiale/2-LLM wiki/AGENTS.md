# LLM Wiki agent instructions

This is an exported seed vault laid out for the "LLM Wiki" pattern: an LLM
compiles the raw sources into an interlinked Markdown wiki instead of
re-deriving answers per query.

## Layout

- `raw/sources/` - the original documents (immutable; the source of truth).
- `wiki/sources/` - one Markdown file per document: the OCR transcription,
  including any corrections made during review, with YAML frontmatter linking
  back to its raw source.
- `wiki/index.md` - a catalog of the source documents.
- `wiki/log.md` - an append-only chronological operation record.

## Ownership

- Never modify files under `raw/`.
- Treat `wiki/sources/` as exported source transcriptions. Do not rewrite
  them unless the user explicitly asks.
- Create and maintain derived pages under `wiki/`, organized into
  directories such as `entities/`, `concepts/`, `comparisons/`,
  `synthesis/`, and `queries/` as the material requires.

## Page conventions

- Use Markdown with YAML frontmatter on every derived page.
- Include `type`, `title`, and a `sources: []` list of the raw source
  paths supporting the page.
- Cross-link with `[[wikilinks]]` (Obsidian style).
- Keep claims traceable to sources, and preserve page references when they are
  material to the claim.
- Update `wiki/index.md` whenever pages are added, renamed, or removed.

## Workflows

- Ingest: read `wiki/index.md` first, integrate the requested sources into
  the existing wiki, update affected pages and cross-links, then append to the log.
- Query: use the index to locate relevant pages, verify claims against source
  transcriptions or raw documents, cite the sources, and file durable results under
  `wiki/queries/` when useful.
- Lint: check for contradictions, stale claims, orphan pages, missing links, and
  unsupported claims; repair the wiki without changing raw sources.

## Log format

Append entries to `wiki/log.md` using a consistent heading:

`## [YYYY-MM-DD] operation | Title`
