import { instantiateTemplate } from "./engine";
import { leverageRoeTemplate } from "./templates/leverage-roe";

console.log("=== Test Generatore Parametrico EOA 2026 ===\n");

for (let i = 1; i <= 3; i++) {
  const q = instantiateTemplate(leverageRoeTemplate, i);
  console.log(`[Domanda #${i}] ID: ${q.id}`);
  console.log(`Testo: ${q.stem}`);
  console.log("Opzioni:");
  q.options?.forEach((opt) => {
    console.log(
      `  (${opt.id}) ${opt.text} ${opt.correct ? "  <-- CORRETTA" : ""}`,
    );
  });
  console.log(`Spiegazione (HOW): ${q.explanation.how}`);
  console.log(`Trappola: ${q.explanation.trap}`);
  console.log("--------------------------------------------------\n");
}
