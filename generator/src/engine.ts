import {
  MultiTrueFalseItem,
  ParametricOutputType,
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
 * Unbiased Fisher-Yates shuffle. Replaces the biased
 * `.sort(() => Math.random() - 0.5)` pattern.
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
 * Compute formula-anchored distractor values for a sampled context.
 * Distractors derived from `distractorFormulas` (typical student errors)
 * are preferred; mechanical fallbacks are used only to fill up to `count`.
 * Every distractor is validated: finite, distinct from the correct value
 * and from each other, and non-trivially distant (relative diff > 2%
 * or absolute diff > 0.05) so options are never near-duplicates.
 */
export function computeDistractors(
  template: ParametricTemplate,
  context: Record<string, number>,
  correctVal: number,
  count: number,
): number[] {
  const distractors: number[] = [];
  const isNonTrivial = (d: number): boolean => {
    if (!isFinite(d) || d === correctVal || distractors.includes(d)) {
      return false;
    }
    const absDiff = Math.abs(d - correctVal);
    if (absDiff <= 0.05) return false;
    if (Math.abs(correctVal) > 1e-9) {
      if (absDiff / Math.abs(correctVal) <= 0.02) return false;
    }
    return true;
  };

  if (template.distractorFormulas) {
    for (const distExpr of template.distractorFormulas) {
      if (distractors.length >= count) break;
      try {
        const dVal = Number(evaluateMath(distExpr, context).toFixed(1));
        if (isNonTrivial(dVal)) {
          distractors.push(dVal);
        }
      } catch {
        // ignore invalid distractor calculations
      }
    }
  }

  // Mechanical fallbacks (last resort only)
  const fallbacks = [
    correctVal * 0.8,
    correctVal * 1.2,
    correctVal * 0.5,
    correctVal * 1.5,
    correctVal + 2.5,
    Math.max(1, correctVal - 3.2),
    correctVal + 5,
    correctVal - 5,
    correctVal + 1,
    correctVal - 1,
  ];
  for (const fb of fallbacks) {
    if (distractors.length >= count) break;
    const roundedFb = Number(fb.toFixed(1));
    if (isNonTrivial(roundedFb)) {
      distractors.push(roundedFb);
    }
  }

  return distractors;
}

/**
 * Build the keyword variants accepted for a numeric free-text answer.
 * The QuizRunner grades free-text by substring match requiring >= 50% of
 * keywords, so at most 2 variants are emitted (comma + dot decimal
 * separator); whole values collapse to a single keyword so any reasonable
 * typing ("240", "240,0", "240%") matches.
 */
export function numericAnswerKeywords(correctVal: number): string[] {
  if (Number.isInteger(correctVal)) {
    return [String(correctVal)];
  }
  const comma = correctVal.toFixed(1).replace(".", ",");
  const dot = correctVal.toFixed(1);
  return comma === dot ? [comma] : [comma, dot];
}

/**
 * Instantiate a concrete Question from a ParametricTemplate.
 */
export function instantiateTemplate(
  template: ParametricTemplate,
  seq: number,
  maxAttempts = 100,
  targetType?: ParametricOutputType,
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

  const effectiveType: ParametricOutputType = targetType ?? template.type;
  const typeSuffix =
    effectiveType === "numeric-input"
      ? "NUM"
      : effectiveType === "multi-choice"
        ? "MC"
        : effectiveType === "multi-true-false"
          ? "MTF"
          : effectiveType === "free-text"
            ? "FT"
            : targetType
              ? "SC"
              : "INST";
  const questionId = `${template.id}-${typeSuffix}-${String(seq).padStart(4, "0")}`;

  const baseExplanation = {
    why: template.explanationTemplate.why,
    what: template.explanationTemplate.what,
    how,
    trap: template.explanationTemplate.trap,
  };
  const passthrough = {
    formula: template.formulaKaTeX,
    sourceRef: template.sourceRef,
    prerequisites: template.prerequisites,
    caseStudyRef: template.caseStudyRef,
  };

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
      explanation: baseExplanation,
      ...passthrough,
    };
  }

  if (effectiveType === "free-text") {
    return {
      id: questionId,
      version: 1,
      block: template.block,
      topic: template.topic,
      tags: [...template.tags, "parametric-instance", "calcolo"],
      track: template.track,
      difficulty: template.difficulty,
      type: "free-text",
      stem: `${stem} Esprimi il risultato numerico (sono accettati sia la virgola sia il punto come separatore decimale).`,
      // Dual grading support: the QuizRunner grades numerically when
      // numericAnswer is present (tolerance-aware) and falls back to
      // keywords otherwise (used by conceptual seeds).
      numericAnswer: {
        value: correctVal,
        tolerance: template.tolerance ?? 0.1,
        unit: template.unit,
      },
      freeTextKeywords: numericAnswerKeywords(correctVal),
      explanation: baseExplanation,
      ...passthrough,
    };
  }

  if (effectiveType === "multi-choice") {
    // "Select all correct statements": 2 correct (numeric result + concept)
    // + 2 wrong (typical-error values from distractor formulas).
    const distractors = computeDistractors(template, context, correctVal, 2);
    if (distractors.length < 2) {
      throw new Error(
        `Could not derive 2 valid distractors for multi-choice template ${template.id}`,
      );
    }
    const correctStr = formatNumberIT(correctVal, 1, template.unit ?? "");
    const rawOptions: QuestionOption[] = shuffleArray([
      {
        id: "opt-corr-val",
        text: `Il valore corretto ottenuto applicando la formula è ${correctStr}.`,
        correct: true,
      },
      {
        id: "opt-corr-concept",
        text: template.explanationTemplate.what,
        correct: true,
      },
      {
        id: "opt-dist-1",
        text: `Il valore corretto è pari a ${formatNumberIT(distractors[0], 1, template.unit ?? "")}.`,
        correct: false,
      },
      {
        id: "opt-dist-2",
        text: `Il calcolo corretto porta a un risultato pari a ${formatNumberIT(distractors[1], 1, template.unit ?? "")}.`,
        correct: false,
      },
    ]).map((opt, index) => ({
      ...opt,
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
      type: "multi-choice",
      stem: `${stem} Seleziona TUTTE le affermazioni corrette.`,
      options: rawOptions,
      explanation: {
        ...baseExplanation,
        how: `${how} Sono corrette l'opzione con valore ${correctStr} e l'enunciato concettuale; gli altri valori derivano da procedimenti errati tipici.`,
      },
      ...passthrough,
    };
  }

  if (effectiveType === "multi-true-false") {
    // 2 true (correct value + concept) + 2 false (typical-error values).
    const distractors = computeDistractors(template, context, correctVal, 2);
    if (distractors.length < 2) {
      throw new Error(
        `Could not derive 2 valid distractors for multi-true-false template ${template.id}`,
      );
    }
    const correctStr = formatNumberIT(correctVal, 1, template.unit ?? "");
    const rawItems: MultiTrueFalseItem[] = shuffleArray([
      {
        id: "mtf-corr-val",
        statement: `Applicando la formula ai dati assegnati si ottiene ${correctStr}.`,
        isTrue: true,
      },
      {
        id: "mtf-concept",
        statement: template.explanationTemplate.what,
        isTrue: true,
      },
      {
        id: "mtf-dist-1",
        statement: `Applicando la formula ai dati assegnati si ottiene ${formatNumberIT(distractors[0], 1, template.unit ?? "")}.`,
        isTrue: false,
      },
      {
        id: "mtf-dist-2",
        statement: `Un procedimento di calcolo alternativo valido porta a ${formatNumberIT(distractors[1], 1, template.unit ?? "")}.`,
        isTrue: false,
      },
    ]).map((item, index) => ({ ...item, id: `item-${index + 1}` }));
    return {
      id: questionId,
      version: 1,
      block: template.block,
      topic: template.topic,
      tags: [...template.tags, "parametric-instance"],
      track: template.track,
      difficulty: template.difficulty,
      type: "multi-true-false",
      stem: `${stem} Indica se ciascuna affermazione è Vera o Falsa (tutte le risposte devono essere esatte).`,
      multiTrueFalseItems: rawItems,
      explanation: {
        ...baseExplanation,
        how: `${how} Il valore ${correctStr} e l'enunciato concettuale sono veri; gli altri due valori corrispondono a errori tipici di procedimento.`,
      },
      ...passthrough,
    };
  }

  // Single choice: generate distractors (formula-anchored, validated)
  const distractors = computeDistractors(template, context, correctVal, 3);
  if (distractors.length < 3) {
    throw new Error(
      `Could not derive 3 valid distractors for single-choice template ${template.id}`,
    );
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

  // Shuffle options (Fisher-Yates, unbiased)
  const shuffledOptions = shuffleArray(rawOptions).map((opt, index) => ({
    ...opt,
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
    explanation: baseExplanation,
    ...passthrough,
  };
}
