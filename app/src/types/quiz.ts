import type { Question, SyllabusBlock, StudyTrack } from "./question";

export type QuizMode =
  | "exam-simulation" // 25-40 questions, strict timer, strictly sequential non-reversible
  | "free-practice" // user-defined question count, immediate explanation reveal, unconstrained
  | "by-block" // focus on a single block
  | "traps-only" // focus on misconception-targeted questions
  | "calculations" // focus on numeric input & financial formulas
  | "case-studies"; // focus on real company scenarios (Olivetti, Nokia, Ferrari...)

export interface UserResponse {
  questionId: string;
  selectedOptionId?: string; // single-choice
  selectedOptionIds?: string[]; // multi-choice
  booleanAnswer?: boolean; // true-false
  multiTrueFalseAnswers?: Record<string, boolean>; // multi-true-false
  numericValue?: number; // numeric-input
  textResponse?: string; // free-text
  isCorrect?: boolean;
  scoreEarned?: number; // 0 to 1
  timeSpentSeconds: number;
}

export interface QuizFilterOptions {
  mode: QuizMode;
  targetBlocks?: SyllabusBlock[];
  tracks?: StudyTrack[];
  questionCount?: number;
  timeLimitSeconds?: number;
  allowBacktrack?: boolean; // false in exam-simulation
}

export interface QuizSessionState {
  id: string;
  mode: QuizMode;
  questions: Question[];
  currentIndex: number;
  responses: Record<string, UserResponse>;
  startTime: number;
  elapsedSeconds: number;
  timeLimitSeconds?: number;
  isFinished: boolean;
}

export interface QuizScoreSummary {
  totalQuestions: number;
  correctCount: number;
  totalScore: number;
  maxScore: number;
  scaledGrade30: number; // Vote expressed out of 30 (e.g. 24/30)
  isPassed: boolean; // scaledGrade30 >= 18
  timeTakenSeconds: number;
  blockBreakdown: Record<
    SyllabusBlock,
    { total: number; correct: number; percentage: number }
  >;
}

export interface QuizHistoryRecord {
  id: string;
  timestamp: number; // epoch ms
  formattedDate: string; // e.g. "12/09/2026, 15:30"
  mode: QuizMode;
  summary: QuizScoreSummary;
  session: QuizSessionState;
}

export interface OverallStats {
  totalSessions: number;
  examSimulationsCount: number;
  freePracticeCount: number;
  passedSimulationsCount: number;
  passRatePercentage: number;
  averageScaledGrade30: number;
  bestScaledGrade30: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  totalTimeSeconds: number;
  blockStats: Record<
    SyllabusBlock,
    {
      totalQuestions: number;
      correctQuestions: number;
      accuracyPercentage: number;
    }
  >;
}
