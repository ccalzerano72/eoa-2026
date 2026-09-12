/**
 * Question bank domain types for EOA Exam Trainer.
 * Matches DESIGN_SPEC.md §4.3 and §4.4.
 */

export type QuestionType =
  | "single-choice"
  | "multi-choice"
  | "true-false"
  | "multi-true-false"
  | "numeric-input"
  | "free-text";

export type StudyTrack = "essential" | "standard" | "advanced";

export type SyllabusBlock = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface QuestionOption {
  id: string; // 'a', 'b', 'c', 'd', ...
  text: string;
  correct: boolean;
}

export interface MultiTrueFalseItem {
  id: string;
  statement: string;
  isTrue: boolean;
}

export interface ExplanationBlock {
  why: string; // PERCHÉ: finalità decisionale
  what: string; // COSA: modello teorico / concetto
  how: string; // COME: calcolo puntuale o logica
  trap?: string; // TRAPPOLA: confusione concettuale tipica
}

export interface Question {
  id: string;
  version: number;
  block: SyllabusBlock;
  topic: string;
  tags: string[];
  track: StudyTrack;
  difficulty: 1 | 2 | 3;
  type: QuestionType;
  stem: string;
  options?: QuestionOption[];
  multiTrueFalseItems?: MultiTrueFalseItem[];
  numericAnswer?: {
    value: number;
    tolerance?: number;
    unit?: string;
  };
  freeTextKeywords?: string[];
  explanation: ExplanationBlock;
  formula?: string;
  prerequisites?: string[];
  caseStudyRef?: string;
  sourceRef?: string;
}

export interface QuestionBankMeta {
  course: string;
  updatedAt: string;
  totalQuestions: number;
  blockDistribution: Record<SyllabusBlock, number>;
}
