import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Question } from "./types";
import { allSeedQuestions } from "./seed-data";
import { allParametricTemplates } from "./templates";
import { instantiateTemplate } from "./engine";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target output paths in webapp public data directory
const outputDir = path.resolve(__dirname, "../../app/public/data/questions");
const sampleJsonPath = path.join(outputDir, "sample.json");
const questionsJsonPath = path.join(outputDir, "questions.json");

console.log("==================================================");
console.log("🚀 EOA 2026 — Batch Question Bank Generator (M1 & M3)");
console.log("==================================================\n");

// 1. Collect all curated seed questions
const dataset: Question[] = [...allSeedQuestions];
console.log(`✓ Loaded ${allSeedQuestions.length} curated seed questions across all 7 blocks.`);

// 2. Generate parametric instances for each template
const INSTANCES_PER_TEMPLATE = 18;
let totalParametricGenerated = 0;

for (const template of allParametricTemplates) {
  let templateSuccess = 0;
  for (let i = 1; i <= INSTANCES_PER_TEMPLATE; i++) {
    try {
      const q = instantiateTemplate(template, i);
      dataset.push(q);
      templateSuccess++;
      totalParametricGenerated++;
    } catch (err) {
      console.warn(`[Warning] Could not instantiate template ${template.id} #${i}:`, err);
    }
  }
  console.log(`✓ Template [${template.id}] (Blocco ${template.block}): generated ${templateSuccess} instances.`);
}

console.log(`\n✓ Generated ${totalParametricGenerated} parametric instances from ${allParametricTemplates.length} templates.`);
console.log(`Total questions in consolidated dataset: ${dataset.length}\n`);

// 3. Integrity checks
const idSet = new Set<string>();
for (const q of dataset) {
  if (idSet.has(q.id)) {
    throw new Error(`Integrity Error: Duplicate question ID detected: ${q.id}`);
  }
  idSet.add(q.id);

  if (!q.stem || q.stem.trim().length === 0) {
    throw new Error(`Integrity Error: Empty stem in question ${q.id}`);
  }

  if (!q.explanation || !q.explanation.why || !q.explanation.what || !q.explanation.how) {
    throw new Error(`Integrity Error: Incomplete Golden Rule explanation in question ${q.id}`);
  }

  if (q.type === "single-choice") {
    const correctCount = q.options?.filter((o) => o.correct).length || 0;
    if (correctCount !== 1) {
      throw new Error(`Integrity Error: Single-choice question ${q.id} must have exactly 1 correct option (found ${correctCount})`);
    }
  }

  if (q.type === "multi-choice") {
    const correctCount = q.options?.filter((o) => o.correct).length || 0;
    if (correctCount < 1) {
      throw new Error(`Integrity Error: Multi-choice question ${q.id} must have at least 1 correct option`);
    }
  }

  if (q.type === "multi-true-false") {
    if (!q.multiTrueFalseItems || q.multiTrueFalseItems.length < 2) {
      throw new Error(`Integrity Error: Multi-true-false question ${q.id} must have at least 2 statements`);
    }
  }
}
console.log("✓ All integrity checks passed successfully (unique IDs, valid options, complete explanations).\n");

// 4. Distribution Breakdown
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
  console.log(`  - ${t}: ${cnt} domande`);
}

console.log("\n📊 Distribution by Tiered Track:");
for (const [tr, cnt] of Object.entries(byTrack)) {
  console.log(`  - ${tr}: ${cnt} domande`);
}

// 5. Write to disk
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(sampleJsonPath, JSON.stringify(dataset, null, 2), "utf-8");
fs.writeFileSync(questionsJsonPath, JSON.stringify(dataset, null, 2), "utf-8");

console.log(`\n💾 Successfully exported ${dataset.length} questions to:`);
console.log(`  - ${sampleJsonPath}`);
console.log(`  - ${questionsJsonPath}\n`);
