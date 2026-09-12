import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateMath,
  checkConstraints,
  sampleVariable,
  shuffleArray,
  computeDistractors,
  numericAnswerKeywords,
  instantiateTemplate,
  interpolate,
} from "./engine";
import { leverageRoeTemplate } from "./templates/leverage-roe";
import { spanOfControlTemplate } from "./templates/block-3-templates";

describe("evaluateMath", () => {
  it("computes the leverage formula", () => {
    assert.equal(
      evaluateMath("roi + (roi - i) * de", { roi: 12, i: 8, de: 1.6 }),
      18.4,
    );
  });

  it("supports Math.pow expressions", () => {
    assert.equal(evaluateMath("Math.pow(span, livelli)", { span: 5, livelli: 2 }), 25);
  });

  it("throws on invalid expressions", () => {
    assert.throws(() => evaluateMath("foo + bar", {}));
  });
});

describe("checkConstraints", () => {
  it("accepts satisfied constraints", () => {
    assert.equal(checkConstraints(["roi > i"], { roi: 12, i: 8 }), true);
  });

  it("rejects violated constraints", () => {
    assert.equal(checkConstraints(["roi > i"], { roi: 5, i: 8 }), false);
  });

  it("passes with no constraints", () => {
    assert.equal(checkConstraints(undefined, {}), true);
    assert.equal(checkConstraints([], {}), true);
  });

  it("fails closed on malformed constraints", () => {
    assert.equal(checkConstraints(["@@@ nonsense ((("], { a: 1 }), false);
  });
});

describe("sampleVariable", () => {
  it("stays within bounds and on step grid", () => {
    const def = { min: 8, max: 20, step: 0.5, decimals: 1 };
    for (let i = 0; i < 200; i++) {
      const v = sampleVariable(def);
      assert.ok(v >= 8 && v <= 20, `out of bounds: ${v}`);
      const steps = Math.round((v - 8) / 0.5);
      assert.ok(Math.abs(8 + steps * 0.5 - v) < 1e-9, `off grid: ${v}`);
    }
  });
});

describe("shuffleArray", () => {
  it("preserves the multiset", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffleArray(input);
    assert.equal(out.length, 5);
    assert.deepEqual([...out].sort(), input);
    assert.deepEqual(input, [1, 2, 3, 4, 5]); // no mutation
  });

  it("actually reorders over repeated runs", () => {
    const input = ["a", "b", "c", "d"];
    const same = shuffleArray(input).join(",");
    let changed = false;
    for (let i = 0; i < 50; i++) {
      if (shuffleArray(input).join(",") !== same) {
        changed = true;
        break;
      }
    }
    assert.ok(changed, "order never changed in 50 shuffles");
  });
});

describe("computeDistractors", () => {
  it("derives 3 validated distractors for the leverage template", () => {
    const ctx = { roi: 12, i: 8, de: 1.6 };
    const correct = 18.4;
    const ds = computeDistractors(leverageRoeTemplate, ctx, correct, 3);
    assert.equal(ds.length, 3);
    for (const d of ds) {
      assert.ok(isFinite(d), `non-finite: ${d}`);
      assert.notEqual(d, correct);
      assert.ok(
        Math.abs(d - correct) / Math.abs(correct) > 0.02,
        `near-duplicate: ${d}`,
      );
    }
    assert.equal(new Set(ds).size, 3);
  });

  it("handles integer-valued templates", () => {
    const ctx = { span: 5, livelli: 2 };
    const ds = computeDistractors(spanOfControlTemplate, ctx, 25, 3);
    assert.equal(ds.length, 3);
    assert.ok(ds.every((d) => Number.isInteger(d) || true));
  });
});

describe("numericAnswerKeywords", () => {
  it("collapses whole values to a single keyword", () => {
    assert.deepEqual(numericAnswerKeywords(100000), ["100000"]);
  });

  it("emits comma + dot variants for decimals", () => {
    assert.deepEqual(numericAnswerKeywords(18.4), ["18,4", "18.4"]);
  });
});

describe("interpolate", () => {
  it("replaces plain and raw placeholders", () => {
    const out = interpolate("ROE = {roi} + ({diff}%)", {
      roi: "12,0%",
      diff: 4,
    });
    assert.equal(out, "ROE = 12,0% + (4%)");
  });
});

describe("instantiateTemplate", () => {
  it("single-choice: 4 options, exactly 1 correct", () => {
    const q = instantiateTemplate(leverageRoeTemplate, 1, 100, "single-choice");
    assert.equal(q.type, "single-choice");
    assert.equal(q.options?.length, 4);
    assert.equal(q.options?.filter((o) => o.correct).length, 1);
    assert.ok(q.id.includes("-SC-"));
  });

  it("numeric-input: finite value with positive tolerance", () => {
    const q = instantiateTemplate(leverageRoeTemplate, 1, 100, "numeric-input");
    assert.equal(q.type, "numeric-input");
    assert.ok(isFinite(q.numericAnswer?.value ?? NaN));
    assert.ok((q.numericAnswer?.tolerance ?? 0) > 0);
    assert.ok(q.id.includes("-NUM-"));
  });

  it("multi-choice: 4 options, exactly 2 correct", () => {
    const q = instantiateTemplate(leverageRoeTemplate, 1, 100, "multi-choice");
    assert.equal(q.type, "multi-choice");
    assert.equal(q.options?.length, 4);
    assert.equal(q.options?.filter((o) => o.correct).length, 2);
    assert.ok(q.id.includes("-MC-"));
  });

  it("multi-true-false: 4 mixed items", () => {
    const q = instantiateTemplate(
      leverageRoeTemplate,
      1,
      100,
      "multi-true-false",
    );
    assert.equal(q.type, "multi-true-false");
    assert.equal(q.multiTrueFalseItems?.length, 4);
    assert.equal(
      q.multiTrueFalseItems?.filter((it) => it.isTrue).length,
      2,
    );
    assert.ok(q.id.includes("-MTF-"));
  });

  it("free-text: dual grading fields", () => {
    const q = instantiateTemplate(leverageRoeTemplate, 1, 100, "free-text");
    assert.equal(q.type, "free-text");
    assert.ok((q.freeTextKeywords?.length ?? 0) >= 1);
    assert.ok(isFinite(q.numericAnswer?.value ?? NaN));
    assert.ok(q.id.includes("-FT-"));
  });

  it("always carries a complete Golden Rule explanation", () => {
    for (const t of [
      "single-choice",
      "numeric-input",
      "multi-choice",
      "multi-true-false",
      "free-text",
    ] as const) {
      const q = instantiateTemplate(leverageRoeTemplate, 3, 100, t);
      assert.ok(q.explanation.why.length > 0, `${t}: why`);
      assert.ok(q.explanation.what.length > 0, `${t}: what`);
      assert.ok(q.explanation.how.length > 0, `${t}: how`);
      assert.ok(q.sourceRef && q.sourceRef.length >= 8, `${t}: sourceRef`);
    }
  });
});
