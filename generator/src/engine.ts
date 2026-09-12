import {
  ParametricTemplate,
  ParametricVariable,
  Question,
  QuestionOption,
} from "./types";

/**
 * Safe expression evaluation for math formulas with variable context.
 */
export function evaluateMath(
  expr: string,
  context: Record<string, number>,
): number {
  const sanitized = expr.replace(/[^a-zA-Z0-9_+\-*/(),.\s]/g, "");
  const keys = Object.keys(context);
  const values = Object.values(context);
  try {
    const fn = new Function(...keys, `return (${sanitized});`);
    const res = fn(...values);
    return Number(res);
  } catch (err) {
    throw new Error(
      `Failed to evaluate formula "${expr}" with context ${JSON.stringify(context)}: ${err}`,
    );
  }
}

/**
 * Safe constraint checker for template preconditions (e.g. "roi > i").
 */
export function checkConstraints(
  constraints: string[] | undefined,
  context: Record<string, number>,
): boolean {
  if (!constraints || constraints.length === 0) return true;
  for (const c of constraints) {
    const sanitized = c.replace(/[^a-zA-Z0-9_+\-*/().<>=!\s]/g, "");
    const keys = Object.keys(context);
    const values = Object.values(context);
    try {
      const fn = new Function(...keys, `return Boolean(${sanitized});`);
      if (!fn(...values)) {
        return false;
      }
    } catch {
      return false;
    }
  }
  return true;
}

/**
 * Sample a random value within the variable's min/max/step specification.
 */
export function sampleVariable(v: ParametricVariable): number {
  const steps = Math.round((v.max - v.min) / v.step);
  const randomStep = Math.floor(Math.random() * (steps + 1));
  const raw = v.min + randomStep * v.step;
  const decimals =
    v.decimals !== undefined
      ? v.decimals
      : v.step.toString().split(".")[1]?.length || 0;
  return Number(raw.toFixed(decimals));
}

/**
 * Interpolate placeholders like "{roi}" or expressions like "{q * (p - cv)}" inside a template string.
 */
export function interpolate(
  template: string,
  displayContext: Record<string, number | string>,
  numericContext: Record<string, number> = {},
): string {
  // Aggregate all available numeric values
  const numCtx: Record<string, number> = { ...numericContext };
  for (const [k, v] of Object.entries(displayContext)) {
    if (typeof v === "number" && numCtx[k] === undefined) {
      numCtx[k] = v;
    }
  }

  return template.replace(/\{([a-zA-Z0-9_+\-*/().\s]+)\}/g, (match, expr) => {
    const trimmed = expr.trim();
    if (displayContext[trimmed] !== undefined) {
      return String(displayContext[trimmed]);
    }
    try {
      const val = evaluateMath(trimmed, numCtx);
      if (!isNaN(val)) {
        return formatNumberIT(val, 1);
      }
    } catch {
      // ignore
    }
    return match;
  });
}

/**
 * Format a number cleanly for display in Italian locale (e.g. comma as decimal separator).
 */
export function formatNumberIT(val: number, decimals = 1, unit = ""): string {
  const formatted = val.toFixed(decimals).replace(".", ",");
  return unit ? `${formatted}${unit}` : formatted;
}

/**
 * Instantiate a concrete Question from a ParametricTemplate.
 */
export function instantiateTemplate(
  template: ParametricTemplate,
  seq: number,
  maxAttempts = 100,
  targetType?: "single-choice" | "numeric-input",
): Question {
  let attempts = 0;
  let context: Record<string, number> = {};

  while (attempts < maxAttempts) {
    attempts++;
    context = {};
    for (const [varName, varDef] of Object.entries(template.variables)) {
      context[varName] = sampleVariable(varDef);
    }
    if (checkConstraints(template.constraints, context)) {
      break;
    }
  }

  if (attempts >= maxAttempts) {
    throw new Error(
      `Could not satisfy constraints for template ${template.id} after ${maxAttempts} attempts`,
    );
  }

  // Calculate correct answer
  const correctValRaw = evaluateMath(template.correctFormula, context);
  const correctVal = Number(correctValRaw.toFixed(1));

  // Build display context (both formatted with units/commas and raw numeric values)
  const displayContext: Record<string, string | number> = { ...context };
  for (const [k, v] of Object.entries(context)) {
    const varDef = template.variables[k];
    displayContext[k] = formatNumberIT(
      v,
      varDef.decimals ?? 1,
      varDef.unit ?? "",
    );
    displayContext[`${k}_raw`] = v;
  }
  displayContext["correct"] = formatNumberIT(
    correctVal,
    1,
    template.unit ?? "",
  );

  const stem = interpolate(template.stemTemplate, displayContext, context);
  const how = interpolate(
    template.explanationTemplate.howTemplate,
    displayContext,
    context,
  );

  const effectiveType = targetType ?? template.type;
  const typeSuffix = targetType
    ? targetType === "numeric-input"
      ? "NUM"
      : "SC"
    : "INST";
  const questionId = `${template.id}-${typeSuffix}-${String(seq).padStart(4, "0")}`;

  if (effectiveType === "numeric-input") {
    return {
      id: questionId,
      version: 1,
      block: template.block,
      topic: template.topic,
      tags: [...template.tags, "parametric-instance"],
      track: template.track,
      difficulty: template.difficulty,
      type: "numeric-input",
      stem,
      numericAnswer: {
        value: correctVal,
        tolerance: template.tolerance ?? 0.1,
        unit: template.unit,
      },
      explanation: {
        why: template.explanationTemplate.why,
        what: template.explanationTemplate.what,
        how,
        trap: template.explanationTemplate.trap,
      },
      formula: template.formulaKaTeX,
      sourceRef: template.sourceRef,
    };
  }

  // Single choice: generate distractors
  const distractors: number[] = [];
  if (template.distractorFormulas) {
    for (const distExpr of template.distractorFormulas) {
      try {
        const dVal = Number(evaluateMath(distExpr, context).toFixed(1));
        if (
          dVal !== correctVal &&
          !distractors.includes(dVal) &&
          isFinite(dVal)
        ) {
          distractors.push(dVal);
        }
      } catch {
        // ignore invalid distractor calculations
      }
    }
  }

  // Fallback plausibility offsets if not enough formulaic distractors
  const fallbacks = [
    correctVal * 0.8,
    correctVal * 1.2,
    correctVal + 2.5,
    Math.max(1, correctVal - 3.2),
  ];
  for (const fb of fallbacks) {
    const roundedFb = Number(fb.toFixed(1));
    if (
      roundedFb !== correctVal &&
      !distractors.includes(roundedFb) &&
      distractors.length < 3
    ) {
      distractors.push(roundedFb);
    }
  }

  const rawOptions: QuestionOption[] = [
    {
      id: "opt-corr",
      text: formatNumberIT(correctVal, 1, template.unit ?? ""),
      correct: true,
    },
    ...distractors.slice(0, 3).map((d, i) => ({
      id: `opt-dist-${i + 1}`,
      text: formatNumberIT(d, 1, template.unit ?? ""),
      correct: false,
    })),
  ];

  // Shuffle options
  const shuffledOptions = rawOptions
    .map((opt) => ({ opt, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item, index) => ({
      ...item.opt,
      id: String.fromCharCode(97 + index), // 'a', 'b', 'c', 'd'
    }));

  return {
    id: questionId,
    version: 1,
    block: template.block,
    topic: template.topic,
    tags: [...template.tags, "parametric-instance"],
    track: template.track,
    difficulty: template.difficulty,
    type: "single-choice",
    stem,
    options: shuffledOptions,
    explanation: {
      why: template.explanationTemplate.why,
      what: template.explanationTemplate.what,
      how,
      trap: template.explanationTemplate.trap,
    },
    formula: template.formulaKaTeX,
    sourceRef: template.sourceRef,
  };
}
