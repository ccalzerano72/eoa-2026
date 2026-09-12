import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  resolveStudyTopic,
  THEORY_TOPICS,
  TOPIC_OVERRIDES,
} from "./study-links";
import type { SyllabusBlock } from "../types/question";

const BLOCKS: SyllabusBlock[] = [1, 2, 3, 4, 5, 6, 7];
const HERE = path.dirname(fileURLToPath(import.meta.url));

function loadTheoryTopics(block: SyllabusBlock): string[] {
  const raw = fs.readFileSync(
    path.resolve(HERE, `../../public/data/theory/blocco-${block}.json`),
    "utf-8",
  );
  const data = JSON.parse(raw);
  return (data.topics ?? []).map((t: { id: string }) => t.id);
}

describe("resolveStudyTopic", () => {
  it("passes through exact theory ids", () => {
    assert.equal(
      resolveStudyTopic(6, "break-even-point-analisi-pareggio"),
      "break-even-point-analisi-pareggio",
    );
    assert.equal(
      resolveStudyTopic(1, "tradeoff-e-costo-opportunita"),
      "tradeoff-e-costo-opportunita",
    );
  });

  it("maps generator slugs via overrides", () => {
    assert.equal(
      resolveStudyTopic(6, "break-even-analysis"),
      "break-even-point-analisi-pareggio",
    );
    assert.equal(
      resolveStudyTopic(5, "leva-finanziaria-spread"),
      "indici-redditivita-du-pont-e-leva-finanziaria",
    );
  });

  it("returns undefined for unknown or missing topics", () => {
    assert.equal(resolveStudyTopic(2, "vantaggio-competitivo"), undefined);
    assert.equal(resolveStudyTopic(3, "no-such-topic"), undefined);
    assert.equal(resolveStudyTopic(1, undefined), undefined);
    assert.equal(resolveStudyTopic(1, ""), undefined);
  });

  it("every override target exists in its block theory file (no dead anchors)", () => {
    for (const [key, target] of Object.entries(TOPIC_OVERRIDES)) {
      const [blockStr] = key.split(":");
      const block = Number(blockStr) as SyllabusBlock;
      assert.ok(
        THEORY_TOPICS[block].includes(target),
        `override ${key} → unknown theory topic ${target}`,
      );
      const fileTopics = loadTheoryTopics(block);
      assert.ok(
        fileTopics.includes(target),
        `override ${key} → ${target} missing from blocco-${block}.json`,
      );
    }
  });

  it("every THEORY_TOPICS id exists in its block theory file", () => {
    for (const b of BLOCKS) {
      const fileTopics = loadTheoryTopics(b);
      for (const id of THEORY_TOPICS[b]) {
        assert.ok(
          fileTopics.includes(id),
          `THEORY_TOPICS[${b}] lists ${id}, missing from blocco-${b}.json`,
        );
      }
    }
  });
});
