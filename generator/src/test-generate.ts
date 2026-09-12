import { instantiateTemplate } from "./engine";
import { allParametricTemplates } from "./templates";

console.log("=== Test Generatore Parametrico EOA 2026 (Tutti i Template) ===\n");

for (const template of allParametricTemplates) {
  console.log(`--- Test Template: [${template.id}] (Blocco ${template.block}) ---`);
  for (let i = 1; i <= 2; i++) {
    const q = instantiateTemplate(template, i);
    console.log(`[#${i}] ID: ${q.id} | Tipo: ${q.type}`);
    console.log(`Testo: ${q.stem}`);
    if (q.options) {
      console.log("Opzioni:");
      q.options.forEach((opt) => {
        console.log(`  (${opt.id}) ${opt.text} ${opt.correct ? "  <-- CORRETTA" : ""}`);
      });
    }
    console.log(`HOW: ${q.explanation.how}`);
    console.log(`Trappola: ${q.explanation.trap}\n`);
  }
}
