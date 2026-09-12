import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Question } from "./types";

/**
 * Snapshot guard on the generated archive (mirrors build-questions QA).
 * Run after `npm run generate:questions`. Bands are intentionally wider
 * than the §7.2 targets to catch regressions, not to enforce exact quotas.
 */
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATASET_PATH = path.resolve(
  HERE,
  "../../app/public/data/questions/questions.json",
);

const TYPE_BANDS: Record<string, [number, number]> = {
  "single-choice": [28, 40],
  "multi-choice": [10, 20],
  "true-false": [8, 18],
  "multi-true-false": [10, 20],
  "numeric-input": [15, 25],
  "free-text": [2, 8],
};

const DOUBLE_UNIT_PATTERNS = [
  "€ €",
  "%%",
  "M€ M€",
  "k€ k€",
  "anni anni",
  "unità unità",
  "volte volte",
  "dipendenti dipendenti",
  "giorni giorni",
  "ore ore",
  "pezzi pezzi",
  "mesi mesi",
  "clienti clienti",
];

function loadDataset(): Question[] {
  const raw = fs.readFileSync(DATASET_PATH, "utf-8");
  const data = JSON.parse(raw);
  assert.ok(Array.isArray(data), "dataset must be an array");
  return data as Question[];
}

describe("question archive snapshot", () => {
  it("total size stays within the 4,000–7,000 envelope", () => {
    const dataset = loadDataset();
    assert.ok(
      dataset.length >= 4000 && dataset.length <= 7000,
      `unexpected total: ${dataset.length}`,
    );
  });

  it("question IDs are unique and stems non-empty", () => {
    const dataset = loadDataset();
    const ids = new Set<string>();
    for (const q of dataset) {
      assert.ok(!ids.has(q.id), `duplicate id: ${q.id}`);
      ids.add(q.id);
      assert.ok(q.stem && q.stem.trim().length > 0, `empty stem: ${q.id}`);
    }
  });

  it("type distribution stays within bands", () => {
    const dataset = loadDataset();
    const counts: Record<string, number> = {};
    for (const q of dataset) counts[q.type] = (counts[q.type] ?? 0) + 1;
    for (const [type, [lo, hi]] of Object.entries(TYPE_BANDS)) {
      const pct = ((counts[type] ?? 0) / dataset.length) * 100;
      assert.ok(
        pct >= lo && pct <= hi,
        `${type} at ${pct.toFixed(1)}% (band ${lo}–${hi}%)`,
      );
    }
  });

  it("every question carries Golden Rule + sourceRef", () => {
    const dataset = loadDataset();
    for (const q of dataset) {
      assert.ok(q.explanation?.why, `${q.id}: missing why`);
      assert.ok(q.explanation?.what, `${q.id}: missing what`);
      assert.ok(q.explanation?.how, `${q.id}: missing how`);
      assert.ok(
        q.sourceRef && q.sourceRef.trim().length >= 8,
        `${q.id}: weak sourceRef`,
      );
    }
  });

  it("choice questions have valid option sets", () => {
    const dataset = loadDataset();
    for (const q of dataset) {
      if (q.type === "single-choice") {
        assert.equal(
          q.options?.filter((o) => o.correct).length,
          1,
          `${q.id}: SC must have exactly 1 correct`,
        );
        assert.ok((q.options?.length ?? 0) >= 3, `${q.id}: SC needs ≥3 options`);
      }
      if (q.type === "multi-choice") {
        assert.ok(
          (q.options?.filter((o) => o.correct).length ?? 0) >= 2,
          `${q.id}: MC needs ≥2 correct`,
        );
      }
      if (q.type === "multi-true-false") {
        const items = q.multiTrueFalseItems ?? [];
        assert.ok(items.length >= 2, `${q.id}: MTF needs ≥2 items`);
        assert.ok(
          items.some((i) => i.isTrue) && items.some((i) => !i.isTrue),
          `${q.id}: MTF must mix true/false`,
        );
      }
      if (q.type === "free-text") {
        assert.ok(
          (q.freeTextKeywords?.length ?? 0) >= 1,
          `${q.id}: FT needs keywords`,
        );
      }
    }
  });

  it("no double-unit rendering anywhere", () => {
    const dataset = loadDataset();
    for (const q of dataset) {
      const texts = [
        q.stem,
        q.explanation.how,
        ...(q.options ?? []).map((o) => o.text),
        ...(q.multiTrueFalseItems ?? []).map((i) => i.statement),
      ];
      for (const text of texts) {
        for (const pat of DOUBLE_UNIT_PATTERNS) {
          assert.ok(
            !text.includes(pat),
            `${q.id}: double-unit "${pat}"`,
          );
        }
      }
    }
  });
});
