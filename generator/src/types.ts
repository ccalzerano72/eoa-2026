/**
 * Core type definitions for EOA Exam Trainer Question Bank and Generator.
 * Conforms to DESIGN_SPEC.md §4.3 and §4.4.
 */

export type QuestionType =
  | "single-choice" // One correct answer among N options
  | "multi-choice" // Multiple correct answers (all must be selected)
  | "true-false" // Single statement: True or False
  | "multi-true-false" // Multiple sub-statements: each V or F (punitive all-or-nothing)
  | "numeric-input" // Number result to type in (with tolerance)
  | "free-text"; // Open short answer checked against keywords

export type StudyTrack = "essential" | "standard" | "advanced";

export type SyllabusBlock = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface QuestionOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface MultiTrueFalseItem {
  id: string;
  statement: string;
  isTrue: boolean;
}

export interface ExplanationBlock {
  /** WHY: Why does this concept matter for managerial decisions? */
  why: string;
  /** WHAT: Conceptual definition and theoretical anchor */
  what: string;
  /** HOW: Step-by-step mathematical calculation or operational logic */
  how: string;
  /** TRAP: Common misconception or imperative bias being targeted */
  trap?: string;
}

export interface Question {
  id: string;
  version: number;
  block: SyllabusBlock;
  topic: string;
  tags: string[];
  track: StudyTrack;
  difficulty: 1 | 2 | 3; // 1: ★, 2: ★★, 3: ★★★
  type: QuestionType;
  stem: string;
  options?: QuestionOption[];
  multiTrueFalseItems?: MultiTrueFalseItem[];
  numericAnswer?: {
    value: number;
    tolerance?: number; // e.g. 0.05 for 5% margin or 0.1 for rounding
    unit?: string; // e.g. "%", "€", "unità"
  };
  freeTextKeywords?: string[]; // keywords required for grading free-text
  explanation: ExplanationBlock;
  formula?: string; // KaTeX formula string
  prerequisites?: string[]; // IDs of predecessor concepts
  caseStudyRef?: string; // e.g. "Olivetti", "Nokia", "Ferrari", "De Cecco"
  sourceRef?: string; // e.g. "Dispensa BILANCIO p. 12", "Slide Blocco V"
}

/**
 * Parametric template definition for infinite question generation.
 */
export interface ParametricVariable {
  min: number;
  max: number;
  step: number;
  unit?: string;
  decimals?: number;
}

export interface ParametricTemplate {
  id: string;
  block: SyllabusBlock;
  topic: string;
  tags: string[];
  track: StudyTrack;
  difficulty: 1 | 2 | 3;
  type: "single-choice" | "numeric-input";
  stemTemplate: string; // e.g. "Un'impresa presenta un ROI pari al {roi}% e un costo del debito i pari al {i}%..."
  variables: Record<string, ParametricVariable>;
  constraints?: string[]; // e.g. ["roi > i", "de >= 1"]
  correctFormula: string; // JavaScript math expression: e.g. "roi + (roi - i) * de"
  distractorFormulas?: string[]; // e.g. ["roi * de", "roi - i", "(roi + i) / 2"]
  tolerance?: number;
  unit?: string;
  explanationTemplate: {
    why: string;
    what: string;
    howTemplate: string;
    trap?: string;
  };
  formulaKaTeX: string;
  sourceRef?: string;
}
