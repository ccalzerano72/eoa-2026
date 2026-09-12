import type {
  QuizHistoryRecord,
  QuizSessionState,
  QuizScoreSummary,
  OverallStats,
} from "../types/quiz";
import type { SyllabusBlock } from "../types/question";

const STORAGE_KEY = "eoa_quiz_history_v1";
const MAX_HISTORY_ITEMS = 100;

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
