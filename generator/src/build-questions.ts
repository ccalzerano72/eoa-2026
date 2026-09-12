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

// 3. Generate parametric instances for each template
// We generate both single-choice (SC) and numeric-input (NUM) variations
const SC_INSTANCES_PER_TEMPLATE = 80;
const NUM_INSTANCES_PER_TEMPLATE = 40;
let totalParametricGenerated = 0;

for (const template of allParametricTemplates) {
  let templateSuccess = 0;

  // Single choice instances
  for (let i = 1; i <= SC_INSTANCES_PER_TEMPLATE; i++) {
    try {
      const q = instantiateTemplate(template, i, 100, "single-choice");
      dataset.push(q);
      templateSuccess++;
      totalParametricGenerated++;
    } catch (err) {
      console.warn(
        `[Warning] Could not instantiate SC template ${template.id} #${i}:`,
        err,
      );
    }
  }

  // Numeric input instances
  for (let i = 1; i <= NUM_INSTANCES_PER_TEMPLATE; i++) {
    try {
      const q = instantiateTemplate(template, i, 100, "numeric-input");
      dataset.push(q);
      templateSuccess++;
      totalParametricGenerated++;
    } catch (err) {
      console.warn(
        `[Warning] Could not instantiate NUM template ${template.id} #${i}:`,
        err,
      );
    }
  }

  console.log(
    `✓ Template [${template.id}] (Blocco ${template.block}): generated ${templateSuccess} instances (SC + NUM).`,
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
  }

  if (q.type === "multi-choice") {
    const correctCount = q.options?.filter((o) => o.correct).length || 0;
    if (correctCount < 1) {
      throw new Error(
        `Integrity Error: Multi-choice question ${q.id} must have at least 1 correct option`,
      );
    }
  }

  if (q.type === "multi-true-false") {
    if (!q.multiTrueFalseItems || q.multiTrueFalseItems.length < 2) {
      throw new Error(
        `Integrity Error: Multi-true-false question ${q.id} must have at least 2 statements`,
      );
    }
  }
}
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

console.log("\n📊 Distribution by Question Type:");
for (const [t, cnt] of Object.entries(byType)) {
  console.log(
    `  - ${t}: ${cnt} domande (${((cnt / dataset.length) * 100).toFixed(1)}%)`,
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

// Sample dataset (50 questions per block = 350 questions for fast preview / dev)
const sampleQuestions: Question[] = [];
for (let b = 1; b <= 7; b++) {
  const blockQuestions = dataset.filter((q) => q.block === b);
  sampleQuestions.push(...blockQuestions.slice(0, 50));
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
