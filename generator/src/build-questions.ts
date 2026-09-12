import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Question } from "./types";
import { allSeedQuestions } from "./seed-data";
import {
  allParametricTemplates,
  allCombinatorialGenerators,
} from "./templates";
import { instantiateTemplate } from "./engine";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target output paths in webapp public data directory
const outputDir = path.resolve(__dirname, "../../app/public/data/questions");
const blocksDir = path.join(outputDir, "blocks");
const sampleJsonPath = path.join(outputDir, "sample.json");
const questionsJsonPath = path.join(outputDir, "questions.json");

console.log("==================================================");
console.log("🚀 EOA 2026 — Massive Batch Question Generator (M4)");
console.log("Target: 4,000–6,000 balanced questions across 7 blocks");
console.log("==================================================\n");

const dataset: Question[] = [];

// 1. Collect all curated seed questions
dataset.push(...allSeedQuestions);
console.log(
  `✓ Loaded ${allSeedQuestions.length} curated seed questions across all 7 blocks.`,
);

// 2. Run combinatorial question generators across all 7 syllabus blocks
let totalCombinatorial = 0;
for (let i = 0; i < allCombinatorialGenerators.length; i++) {
  const gen = allCombinatorialGenerators[i];
  const blockNum = i + 1;
  try {
    const questions = gen();
    dataset.push(...questions);
    totalCombinatorial += questions.length;
    console.log(
      `✓ Combinatorial Gen [Blocco ${blockNum}]: produced ${questions.length} questions.`,
    );
  } catch (err) {
    console.warn(
      `[Warning] Error running combinatorial generator for Blocco ${blockNum}:`,
      err,
    );
  }
}
console.log(
  `✓ Generated ${totalCombinatorial} combinatorial questions across Blocks 1–7.\n`,
);

// 3. Generate parametric instances for each template.
// Quotas rebalance the archive toward DESIGN_SPEC §7.2 targets
// (SC 35% / MC 15% / TF 10% / MTF 15% / NUM 20% / FT 5%):
// TF already exceeds target via combinatorics, so parametric budget
// goes to the deficit types (MC, MTF, FT). SC is trimmed from 80 to 40
// to reabsorb its +21pp excess without deleting combinatorial coverage.
const SC_INSTANCES_PER_TEMPLATE = 40;
const NUM_INSTANCES_PER_TEMPLATE = 40;
const MC_INSTANCES_PER_TEMPLATE = 30;
const MTF_INSTANCES_PER_TEMPLATE = 15;
const FT_INSTANCES_PER_TEMPLATE = 10;
let totalParametricGenerated = 0;

const quotas: Array<{
  label: string;
  count: number;
  type: "single-choice" | "numeric-input" | "multi-choice" | "multi-true-false" | "free-text";
}> = [
  { label: "SC", count: SC_INSTANCES_PER_TEMPLATE, type: "single-choice" },
  { label: "NUM", count: NUM_INSTANCES_PER_TEMPLATE, type: "numeric-input" },
  { label: "MC", count: MC_INSTANCES_PER_TEMPLATE, type: "multi-choice" },
  { label: "MTF", count: MTF_INSTANCES_PER_TEMPLATE, type: "multi-true-false" },
  { label: "FT", count: FT_INSTANCES_PER_TEMPLATE, type: "free-text" },
];

for (const template of allParametricTemplates) {
  let templateSuccess = 0;
  const perType: Record<string, number> = {};

  for (const q of quotas) {
    let ok = 0;
    for (let i = 1; i <= q.count; i++) {
      try {
        const question = instantiateTemplate(template, i, 100, q.type);
        dataset.push(question);
        templateSuccess++;
        totalParametricGenerated++;
        ok++;
      } catch (err) {
        console.warn(
          `[Warning] Could not instantiate ${q.label} template ${template.id} #${i}:`,
          err,
        );
      }
    }
    perType[q.label] = ok;
  }

  console.log(
    `✓ Template [${template.id}] (Blocco ${template.block}): generated ${templateSuccess} instances (SC ${perType["SC"] ?? 0} + NUM ${perType["NUM"] ?? 0} + MC ${perType["MC"] ?? 0} + MTF ${perType["MTF"] ?? 0} + FT ${perType["FT"] ?? 0}).`,
  );
}

console.log(
  `\n✓ Generated ${totalParametricGenerated} parametric instances from ${allParametricTemplates.length} templates.`,
);
console.log(`Total questions in consolidated dataset: ${dataset.length}\n`);

// 4. Integrity checks
const idSet = new Set<string>();
for (const q of dataset) {
  if (idSet.has(q.id)) {
    throw new Error(`Integrity Error: Duplicate question ID detected: ${q.id}`);
  }
  idSet.add(q.id);

  if (!q.stem || q.stem.trim().length === 0) {
    throw new Error(`Integrity Error: Empty stem in question ${q.id}`);
  }

  if (
    !q.explanation ||
    !q.explanation.why ||
    !q.explanation.what ||
    !q.explanation.how
  ) {
    throw new Error(
      `Integrity Error: Incomplete Golden Rule explanation in question ${q.id}`,
    );
  }

  if (q.type === "single-choice") {
    const correctCount = q.options?.filter((o) => o.correct).length || 0;
    if (correctCount !== 1) {
      throw new Error(
        `Integrity Error: Single-choice question ${q.id} must have exactly 1 correct option (found ${correctCount})`,
      );
    }
    if (!q.options || q.options.length < 3) {
      throw new Error(
        `Integrity Error: Single-choice question ${q.id} must have at least 3 options`,
      );
    }
  }

  if (q.type === "multi-choice") {
    const correctCount = q.options?.filter((o) => o.correct).length || 0;
    if (correctCount < 2) {
      throw new Error(
        `Integrity Error: Multi-choice question ${q.id} must have at least 2 correct options (found ${correctCount})`,
      );
    }
    if (!q.options || q.options.length < 3) {
      throw new Error(
        `Integrity Error: Multi-choice question ${q.id} must have at least 3 options`,
      );
    }
  }

  if (q.type === "multi-true-false") {
    if (!q.multiTrueFalseItems || q.multiTrueFalseItems.length < 2) {
      throw new Error(
        `Integrity Error: Multi-true-false question ${q.id} must have at least 2 statements`,
      );
    }
    const hasTrue = q.multiTrueFalseItems.some((it) => it.isTrue);
    const hasFalse = q.multiTrueFalseItems.some((it) => !it.isTrue);
    if (!hasTrue || !hasFalse) {
      throw new Error(
        `Integrity Error: Multi-true-false question ${q.id} must mix true and false statements`,
      );
    }
  }

  if (q.type === "numeric-input") {
    if (
      q.numericAnswer === undefined ||
      !isFinite(q.numericAnswer.value) ||
      (q.numericAnswer.tolerance !== undefined &&
        !(q.numericAnswer.tolerance > 0))
    ) {
      throw new Error(
        `Integrity Error: Numeric question ${q.id} must have a finite value and positive tolerance`,
      );
    }
  }

  if (q.type === "free-text") {
    if (!q.freeTextKeywords || q.freeTextKeywords.length < 1) {
      throw new Error(
        `Integrity Error: Free-text question ${q.id} must define at least 1 keyword`,
      );
    }
    for (const kw of q.freeTextKeywords) {
      if (!kw || kw.trim().length < 1) {
        throw new Error(
          `Integrity Error: Free-text question ${q.id} has an empty keyword`,
        );
      }
    }
    // Numeric free-text carries a tolerance-graded numericAnswer; single-digit
    // keywords alone would false-positive on substring match, so the numeric
    // path (see QuizRunner) is the primary grader there.
    if (q.numericAnswer !== undefined) {
      if (
        !isFinite(q.numericAnswer.value) ||
        (q.numericAnswer.tolerance !== undefined &&
          !(q.numericAnswer.tolerance > 0))
      ) {
        throw new Error(
          `Integrity Error: Free-text numeric question ${q.id} must have a finite value and positive tolerance`,
        );
      }
    }
  }

  if (!q.sourceRef || q.sourceRef.trim().length < 8) {
    throw new Error(
      `Integrity Error: Question ${q.id} must carry a specific sourceRef`,
    );
  }
}

// 4b. Double-unit regression gate: interpolated values already carry their
// unit (e.g. "18,4%", "40 M€"), so template literals must not repeat it.
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
  "€/dipendente €/dipendente",
  "€/ora €/ora",
];
for (const q of dataset) {
  const texts = [
    q.stem,
    q.explanation.how,
    ...(q.options ?? []).map((o) => o.text),
    ...(q.multiTrueFalseItems ?? []).map((it) => it.statement),
  ];
  for (const text of texts) {
    for (const pat of DOUBLE_UNIT_PATTERNS) {
      if (text.includes(pat)) {
        throw new Error(
          `Integrity Error: Double-unit "${pat}" in question ${q.id}: ...${text.substring(Math.max(0, text.indexOf(pat) - 30), text.indexOf(pat) + pat.length + 20)}...`,
        );
      }
    }
  }
}
console.log("✓ Double-unit regression gate passed.\n");
console.log(
  "✓ All integrity checks passed successfully (unique IDs, valid options, complete explanations).\n",
);

// 5. Distribution Breakdown
const byBlock: Record<number, number> = {};
const byType: Record<string, number> = {};
const byTrack: Record<string, number> = {};

for (const q of dataset) {
  byBlock[q.block] = (byBlock[q.block] || 0) + 1;
  byType[q.type] = (byType[q.type] || 0) + 1;
  byTrack[q.track] = (byTrack[q.track] || 0) + 1;
}

console.log("📊 Distribution by Syllabus Block:");
for (let b = 1; b <= 7; b++) {
  console.log(`  - Blocco ${b}: ${byBlock[b] || 0} domande`);
}

console.log("\n📊 Distribution by Question Type (vs DESIGN_SPEC §7.2 target):");
const typeTargets: Record<string, number> = {
  "single-choice": 35,
  "multi-choice": 15,
  "true-false": 10,
  "multi-true-false": 15,
  "numeric-input": 20,
  "free-text": 5,
};
for (const [t, cnt] of Object.entries(byType)) {
  const pct = (cnt / dataset.length) * 100;
  const target = typeTargets[t] ?? 0;
  const delta = pct - target;
  console.log(
    `  - ${t}: ${cnt} domande (${pct.toFixed(1)}% vs ${target}% target, ${delta >= 0 ? "+" : ""}${delta.toFixed(1)}pp)`,
  );
}

console.log("\n📊 Distribution by Tiered Track:");
for (const [tr, cnt] of Object.entries(byTrack)) {
  console.log(
    `  - ${tr}: ${cnt} domande (${((cnt / dataset.length) * 100).toFixed(1)}%)`,
  );
}

// 6. Write to disk
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(blocksDir)) {
  fs.mkdirSync(blocksDir, { recursive: true });
}

// Full dataset
fs.writeFileSync(questionsJsonPath, JSON.stringify(dataset, null, 2), "utf-8");

// Partitioned dataset by block
for (let b = 1; b <= 7; b++) {
  const blockQuestions = dataset.filter((q) => q.block === b);
  fs.writeFileSync(
    path.join(blocksDir, `block-${b}.json`),
    JSON.stringify(blockQuestions, null, 2),
    "utf-8",
  );
}

// Sample dataset: stratified by type per block (50/block = 350 for fast preview/dev)
// Stratification mirrors §7.2 so the preview is representative, not head-biased.
const SAMPLE_STRATA: Array<{ type: Question["type"]; count: number }> = [
  { type: "single-choice", count: 17 },
  { type: "multi-choice", count: 7 },
  { type: "true-false", count: 5 },
  { type: "multi-true-false", count: 8 },
  { type: "numeric-input", count: 10 },
  { type: "free-text", count: 3 },
];
const sampleQuestions: Question[] = [];
for (let b = 1; b <= 7; b++) {
  const blockQuestions = dataset.filter((q) => q.block === b);
  for (const s of SAMPLE_STRATA) {
    sampleQuestions.push(
      ...blockQuestions.filter((q) => q.type === s.type).slice(0, s.count),
    );
  }
}
fs.writeFileSync(
  sampleJsonPath,
  JSON.stringify(sampleQuestions, null, 2),
  "utf-8",
);

console.log(`\n💾 Successfully exported ${dataset.length} questions to:`);
console.log(`  - Consolidated: ${questionsJsonPath}`);
console.log(`  - Sample (${sampleQuestions.length} Qs): ${sampleJsonPath}`);
console.log(`  - Block partitions: ${blocksDir}/block-{1..7}.json\n`);
