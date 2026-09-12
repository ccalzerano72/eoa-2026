import type {
  QuizHistoryRecord,
  QuizSessionState,
  QuizScoreSummary,
  OverallStats,
} from "../types/quiz";
import type { SyllabusBlock } from "../types/question";

const STORAGE_KEY = "eoa_quiz_history_v1";
const SPACED_REP_KEY = "eoa_spaced_repetition_v1";
const THEME_KEY = "eoa_theme_preference";
const MAX_HISTORY_ITEMS = 100;

// ============================================================
// SPACED REPETITION SYSTEM
// ============================================================

/**
 * Tracks performance on individual questions for spaced repetition.
 * Uses a simplified SM-2 inspired algorithm:
 * - Each question has an "ease factor" that decreases with errors
 * - Questions with lower ease factors are prioritized for review
 * - Recent errors weight more heavily than old ones
 */
export interface QuestionPerformance {
  questionId: string;
  totalAttempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  lastAttemptTimestamp: number;
  lastAttemptCorrect: boolean;
  easeFactor: number; // 1.0 = easy, 0.0 = very difficult
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
}

export interface SpacedRepetitionData {
  questions: Record<string, QuestionPerformance>;
  lastUpdated: number;
}

function getDefaultSpacedRepData(): SpacedRepetitionData {
  return {
    questions: {},
    lastUpdated: Date.now(),
  };
}

export function getSpacedRepetitionData(): SpacedRepetitionData {
  try {
    const raw = localStorage.getItem(SPACED_REP_KEY);
    if (!raw) return getDefaultSpacedRepData();
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.questions === "object") {
      return parsed as SpacedRepetitionData;
    }
    return getDefaultSpacedRepData();
  } catch (err) {
    console.error("Failed to load spaced repetition data:", err);
    return getDefaultSpacedRepData();
  }
}

export function saveSpacedRepetitionData(data: SpacedRepetitionData): void {
  try {
    data.lastUpdated = Date.now();
    localStorage.setItem(SPACED_REP_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save spaced repetition data:", err);
  }
}

/**
 * Updates performance data for a single question after an attempt.
 * Implements a simplified SM-2 algorithm for ease factor calculation.
 */
export function recordQuestionAttempt(
  questionId: string,
  isCorrect: boolean,
): void {
  const data = getSpacedRepetitionData();
  const existing = data.questions[questionId];

  if (existing) {
    // Update existing record
    existing.totalAttempts += 1;
    existing.lastAttemptTimestamp = Date.now();
    existing.lastAttemptCorrect = isCorrect;

    if (isCorrect) {
      existing.correctAttempts += 1;
      existing.consecutiveCorrect += 1;
      existing.consecutiveIncorrect = 0;
      // Increase ease factor (max 1.0)
      existing.easeFactor = Math.min(
        1.0,
        existing.easeFactor + 0.1 * existing.consecutiveCorrect,
      );
    } else {
      existing.incorrectAttempts += 1;
      existing.consecutiveIncorrect += 1;
      existing.consecutiveCorrect = 0;
      // Decrease ease factor significantly on error (min 0.0)
      existing.easeFactor = Math.max(
        0.0,
        existing.easeFactor - 0.2 - 0.05 * existing.consecutiveIncorrect,
      );
    }
  } else {
    // Create new record
    data.questions[questionId] = {
      questionId,
      totalAttempts: 1,
      correctAttempts: isCorrect ? 1 : 0,
      incorrectAttempts: isCorrect ? 0 : 1,
      lastAttemptTimestamp: Date.now(),
      lastAttemptCorrect: isCorrect,
      easeFactor: isCorrect ? 0.7 : 0.3, // Start neutral-ish
      consecutiveCorrect: isCorrect ? 1 : 0,
      consecutiveIncorrect: isCorrect ? 0 : 1,
    };
  }

  saveSpacedRepetitionData(data);
}

/**
 * Batch update from a completed quiz session.
 */
export function recordSessionPerformance(session: QuizSessionState): void {
  for (const [questionId, response] of Object.entries(session.responses)) {
    if (response.isCorrect !== undefined) {
      recordQuestionAttempt(questionId, response.isCorrect);
    }
  }
}

/**
 * Calculates a priority score for a question.
 * Lower scores = higher priority for review.
 *
 * Factors:
 * - Ease factor (lower = more priority)
 * - Time since last attempt (longer = more priority)
 * - Number of incorrect attempts (more = more priority)
 */
export function calculateReviewPriority(perf: QuestionPerformance): number {
  const now = Date.now();
  const daysSinceLastAttempt =
    (now - perf.lastAttemptTimestamp) / (1000 * 60 * 60 * 24);

  // Base priority from ease factor (inverted: low ease = high priority)
  let priority = 1 - perf.easeFactor;

  // Boost priority based on time decay (forgotten knowledge)
  // Questions not seen in 7+ days get a boost
  const timeBoost = Math.min(0.3, daysSinceLastAttempt / 30);
  priority += timeBoost;

  // Boost for consecutive errors
  priority += perf.consecutiveIncorrect * 0.15;

  // Slight penalty if last attempt was correct (reduce urgency)
  if (perf.lastAttemptCorrect) {
    priority -= 0.1;
  }

  return Math.max(0, Math.min(1, priority));
}

/**
 * Returns question IDs sorted by review priority (most needing review first).
 * Optionally filters by a list of available question IDs.
 */
export function getQuestionsByReviewPriority(
  availableQuestionIds?: string[],
): string[] {
  const data = getSpacedRepetitionData();
  let entries = Object.values(data.questions);

  // Filter to available questions if provided
  if (availableQuestionIds) {
    const availableSet = new Set(availableQuestionIds);
    entries = entries.filter((p) => availableSet.has(p.questionId));
  }

  // Sort by priority (highest priority first)
  entries.sort(
    (a, b) => calculateReviewPriority(b) - calculateReviewPriority(a),
  );

  return entries.map((e) => e.questionId);
}

/**
 * Returns questions that have been attempted and need review.
 * "Need review" = ease factor below threshold OR last attempt incorrect
 */
export function getQuestionsNeedingReview(
  availableQuestionIds?: string[],
  easeThreshold = 0.6,
): string[] {
  const data = getSpacedRepetitionData();
  let entries = Object.values(data.questions);

  // Filter to available questions if provided
  if (availableQuestionIds) {
    const availableSet = new Set(availableQuestionIds);
    entries = entries.filter((p) => availableSet.has(p.questionId));
  }

  // Filter to questions needing review
  entries = entries.filter(
    (p) => p.easeFactor < easeThreshold || !p.lastAttemptCorrect,
  );

  // Sort by priority
  entries.sort(
    (a, b) => calculateReviewPriority(b) - calculateReviewPriority(a),
  );

  return entries.map((e) => e.questionId);
}

/**
 * Gets statistics about spaced repetition progress.
 */
export interface SpacedRepStats {
  totalTracked: number;
  masteredCount: number; // ease >= 0.8
  learningCount: number; // 0.4 <= ease < 0.8
  difficultCount: number; // ease < 0.4
  averageEaseFactor: number;
  questionsNeedingReview: number;
}

export function getSpacedRepStats(
  availableQuestionIds?: string[],
): SpacedRepStats {
  const data = getSpacedRepetitionData();
  let entries = Object.values(data.questions);

  if (availableQuestionIds) {
    const availableSet = new Set(availableQuestionIds);
    entries = entries.filter((p) => availableSet.has(p.questionId));
  }

  const totalTracked = entries.length;
  if (totalTracked === 0) {
    return {
      totalTracked: 0,
      masteredCount: 0,
      learningCount: 0,
      difficultCount: 0,
      averageEaseFactor: 0,
      questionsNeedingReview: 0,
    };
  }

  let masteredCount = 0;
  let learningCount = 0;
  let difficultCount = 0;
  let sumEase = 0;
  let needingReview = 0;

  for (const p of entries) {
    sumEase += p.easeFactor;
    if (p.easeFactor >= 0.8) {
      masteredCount++;
    } else if (p.easeFactor >= 0.4) {
      learningCount++;
    } else {
      difficultCount++;
    }
    if (p.easeFactor < 0.6 || !p.lastAttemptCorrect) {
      needingReview++;
    }
  }

  return {
    totalTracked,
    masteredCount,
    learningCount,
    difficultCount,
    averageEaseFactor: Math.round((sumEase / totalTracked) * 100) / 100,
    questionsNeedingReview: needingReview,
  };
}

export function clearSpacedRepetitionData(): void {
  try {
    localStorage.removeItem(SPACED_REP_KEY);
  } catch (err) {
    console.error("Failed to clear spaced repetition data:", err);
  }
}

// ============================================================
// THEME PREFERENCE
// ============================================================

export type ThemePreference = "light" | "dark" | "system";

export function getThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
    return "system";
  } catch {
    return "system";
  }
}

export function setThemePreference(theme: ThemePreference): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error("Failed to save theme preference:", err);
  }
}

// ============================================================
// QUIZ HISTORY (existing code)
// ============================================================

export function getQuizHistory(): QuizHistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error("Failed to load quiz history from localStorage:", err);
    return [];
  }
}

export function saveQuizRecord(
  session: QuizSessionState,
  summary: QuizScoreSummary,
): QuizHistoryRecord {
  const timestamp = Date.now();
  const formattedDate = new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));

  const newRecord: QuizHistoryRecord = {
    id: session.id || `session-${timestamp}`,
    timestamp,
    formattedDate,
    mode: session.mode,
    summary,
    session,
  };

  try {
    const current = getQuizHistory();
    // Prepend new record, avoid duplicate ID if updated
    const filtered = current.filter((r) => r.id !== newRecord.id);
    const updated = [newRecord, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Also update spaced repetition data for individual questions
    recordSessionPerformance(session);
  } catch (err) {
    console.error("Failed to save quiz record to localStorage:", err);
  }

  return newRecord;
}

export function deleteQuizRecord(id: string): void {
  try {
    const current = getQuizHistory();
    const updated = current.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to delete quiz record:", err);
  }
}

export function clearQuizHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear quiz history:", err);
  }
}

export function computeOverallStats(
  history: QuizHistoryRecord[],
): OverallStats {
  const initialBlocks: Record<
    SyllabusBlock,
    {
      totalQuestions: number;
      correctQuestions: number;
      accuracyPercentage: number;
    }
  > = {
    1: { totalQuestions: 0, correctQuestions: 0, accuracyPercentage: 0 },
    2: { totalQuestions: 0, correctQuestions: 0, accuracyPercentage: 0 },
    3: { totalQuestions: 0, correctQuestions: 0, accuracyPercentage: 0 },
    4: { totalQuestions: 0, correctQuestions: 0, accuracyPercentage: 0 },
    5: { totalQuestions: 0, correctQuestions: 0, accuracyPercentage: 0 },
    6: { totalQuestions: 0, correctQuestions: 0, accuracyPercentage: 0 },
    7: { totalQuestions: 0, correctQuestions: 0, accuracyPercentage: 0 },
  };

  let examSimulationsCount = 0;
  let freePracticeCount = 0;
  let passedSimulationsCount = 0;
  let sumScaledGrade30 = 0;
  let bestScaledGrade30 = 0;
  let totalQuestionsAnswered = 0;
  let totalCorrectAnswers = 0;
  let totalTimeSeconds = 0;

  for (const record of history) {
    const { summary, mode } = record;
    totalTimeSeconds += summary.timeTakenSeconds || 0;
    totalQuestionsAnswered += summary.totalQuestions;
    totalCorrectAnswers += summary.correctCount;

    if (mode === "exam-simulation") {
      examSimulationsCount += 1;
      sumScaledGrade30 += summary.scaledGrade30;
      if (summary.scaledGrade30 > bestScaledGrade30) {
        bestScaledGrade30 = summary.scaledGrade30;
      }
      if (summary.isPassed) {
        passedSimulationsCount += 1;
      }
    } else {
      freePracticeCount += 1;
    }

    if (summary.blockBreakdown) {
      for (const [blockKey, val] of Object.entries(summary.blockBreakdown)) {
        const blkNum = Number(blockKey) as SyllabusBlock;
        if (initialBlocks[blkNum]) {
          initialBlocks[blkNum].totalQuestions += val.total;
          initialBlocks[blkNum].correctQuestions += val.correct;
        }
      }
    }
  }

  for (let b = 1; b <= 7; b++) {
    const blk = b as SyllabusBlock;
    const item = initialBlocks[blk];
    item.accuracyPercentage =
      item.totalQuestions > 0
        ? Math.round((item.correctQuestions / item.totalQuestions) * 100)
        : 0;
  }

  const averageScaledGrade30 =
    examSimulationsCount > 0
      ? Math.round((sumScaledGrade30 / examSimulationsCount) * 10) / 10
      : 0;

  const passRatePercentage =
    examSimulationsCount > 0
      ? Math.round((passedSimulationsCount / examSimulationsCount) * 100)
      : 0;

  return {
    totalSessions: history.length,
    examSimulationsCount,
    freePracticeCount,
    passedSimulationsCount,
    passRatePercentage,
    averageScaledGrade30,
    bestScaledGrade30,
    totalQuestionsAnswered,
    totalCorrectAnswers,
    totalTimeSeconds,
    blockStats: initialBlocks,
  };
}
