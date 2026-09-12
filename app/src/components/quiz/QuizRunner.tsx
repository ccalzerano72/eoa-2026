import { useState, useEffect, useMemo, useRef } from "react";
import type {
  UserResponse,
  QuizSessionState,
  QuizScoreSummary,
  QuizMode,
} from "../../types/quiz";
import type { Question, SyllabusBlock } from "../../types/question";
import { FormulaBlock } from "../ui/FormulaBlock";
import { saveQuizRecord } from "../../services/storage";
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Award,
  BookOpen,
  ExternalLink,
  BarChart3,
} from "lucide-react";

interface QuizRunnerProps {
  questions: Question[];
  mode?: QuizMode;
  timeLimitSeconds?: number;
  initialSession?: QuizSessionState;
  onFinish?: (summary: QuizScoreSummary, session: QuizSessionState) => void;
  onExit?: () => void;
  onNavigateToStudy?: (block: SyllabusBlock, topicId: string) => void;
  onViewStats?: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  questions,
  mode = "exam-simulation",
  timeLimitSeconds = 30 * 60, // default 30 mins
  initialSession,
  onFinish,
  onExit,
  onNavigateToStudy,
  onViewStats,
}) => {
  const [session, setSession] = useState<QuizSessionState>(
    () =>
      initialSession || {
        id: `quiz-${Date.now()}`,
        mode,
        questions,
        currentIndex: 0,
        responses: {},
        startTime: Date.now(),
        elapsedSeconds: 0,
        timeLimitSeconds:
          mode === "exam-simulation" ? timeLimitSeconds : undefined,
        isFinished: false,
      },
  );

  const hasSavedRef = useRef(Boolean(initialSession?.isFinished));

  const [currentAnswers, setCurrentAnswers] = useState<{
    selectedOptionId?: string;
    selectedOptionIds?: string[];
    booleanAnswer?: boolean;
    multiTrueFalseAnswers?: Record<string, boolean>;
    numericValue?: string;
    textResponse?: string;
  }>({});

  const [showImmediateExplanation, setShowImmediateExplanation] =
    useState(false);
  const explanationRef = useRef<HTMLDivElement | null>(null);

  // Review navigation state (for finished quiz)
  const [reviewIndex, setReviewIndex] = useState(0);
  const reviewCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showImmediateExplanation && explanationRef.current) {
      explanationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showImmediateExplanation]);

  // Timer effect
  useEffect(() => {
    if (session.isFinished) return;
    const interval = setInterval(() => {
      setSession((prev) => {
        const nextElapsed = prev.elapsedSeconds + 1;
        if (prev.timeLimitSeconds && nextElapsed >= prev.timeLimitSeconds) {
          clearInterval(interval);
          return { ...prev, elapsedSeconds: nextElapsed, isFinished: true };
        }
        return { ...prev, elapsedSeconds: nextElapsed };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [session.isFinished]);

  const currentQuestion = session.questions[session.currentIndex];
  const isLastQuestion = session.currentIndex === session.questions.length - 1;

  // Grade an answer
  const gradeCurrentAnswer = (): UserResponse => {
    let isCorrect = false;
    let scoreEarned = 0;

    switch (currentQuestion.type) {
      case "single-choice": {
        const correctOpt = currentQuestion.options?.find((o) => o.correct);
        isCorrect = currentAnswers.selectedOptionId === correctOpt?.id;
        scoreEarned = isCorrect ? 1 : 0;
        break;
      }
      case "multi-choice": {
        const selected = currentAnswers.selectedOptionIds || [];
        const correctIds = (currentQuestion.options || [])
          .filter((o) => o.correct)
          .map((o) => o.id);
        const hasAllCorrect = correctIds.every((id) => selected.includes(id));
        const hasNoWrong = selected.every((id) => correctIds.includes(id));
        isCorrect = hasAllCorrect && hasNoWrong && correctIds.length > 0;
        scoreEarned = isCorrect ? 1 : 0;
        break;
      }
      case "true-false": {
        const correctOpt = currentQuestion.options?.find((o) => o.correct);
        const expected = correctOpt?.id === "true";
        isCorrect = currentAnswers.booleanAnswer === expected;
        scoreEarned = isCorrect ? 1 : 0;
        break;
      }
      case "multi-true-false": {
        // Punitive: ALL sub-statements must be correct
        const items = currentQuestion.multiTrueFalseItems || [];
        const userMtf = currentAnswers.multiTrueFalseAnswers || {};
        const allAnswered = items.every((it) => userMtf[it.id] !== undefined);
        const allCorrect = items.every((it) => userMtf[it.id] === it.isTrue);
        isCorrect = allAnswered && allCorrect;
        scoreEarned = isCorrect ? 1 : 0;
        break;
      }
      case "numeric-input": {
        const val = parseFloat(
          (currentAnswers.numericValue || "").replace(",", "."),
        );
        const target = currentQuestion.numericAnswer?.value ?? 0;
        const tolerance = currentQuestion.numericAnswer?.tolerance ?? 0.1;
        isCorrect = !isNaN(val) && Math.abs(val - target) <= tolerance;
        scoreEarned = isCorrect ? 1 : 0;
        break;
      }
      case "free-text": {
        const raw = (currentAnswers.textResponse || "").trim();
        const target = currentQuestion.numericAnswer;
        const parsed = parseFloat(raw.replace(",", "."));
        if (target !== undefined && !isNaN(parsed)) {
          // Numeric free-text (parametric): tolerance-aware grading.
          const tolerance = target.tolerance ?? 0.1;
          isCorrect = Math.abs(parsed - target.value) <= tolerance;
        } else {
          // Conceptual free-text (seeds): keyword-overlap grading.
          const text = raw.toLowerCase();
          const keywords = currentQuestion.freeTextKeywords || [];
          const matched = keywords.filter((kw) =>
            text.includes(kw.toLowerCase()),
          );
          isCorrect = matched.length >= Math.ceil(keywords.length * 0.5);
        }
        scoreEarned = isCorrect ? 1 : 0;
        break;
      }
    }

    return {
      questionId: currentQuestion.id,
      selectedOptionId: currentAnswers.selectedOptionId,
      selectedOptionIds: currentAnswers.selectedOptionIds,
      booleanAnswer: currentAnswers.booleanAnswer,
      multiTrueFalseAnswers: currentAnswers.multiTrueFalseAnswers,
      numericValue: currentAnswers.numericValue
        ? parseFloat(currentAnswers.numericValue.replace(",", "."))
        : undefined,
      textResponse: currentAnswers.textResponse,
      isCorrect,
      scoreEarned,
      timeSpentSeconds: 0,
    };
  };

  const hasAnsweredCurrent = useMemo(() => {
    if (!currentQuestion) return false;
    switch (currentQuestion.type) {
      case "single-choice":
        return Boolean(currentAnswers.selectedOptionId);
      case "multi-choice":
        return Boolean(
          currentAnswers.selectedOptionIds &&
          currentAnswers.selectedOptionIds.length > 0,
        );
      case "true-false":
        return currentAnswers.booleanAnswer !== undefined;
      case "multi-true-false": {
        const items = currentQuestion.multiTrueFalseItems || [];
        const userMtf = currentAnswers.multiTrueFalseAnswers || {};
        return items.every((it) => userMtf[it.id] !== undefined);
      }
      case "numeric-input":
        return Boolean(
          currentAnswers.numericValue &&
          currentAnswers.numericValue.trim().length > 0,
        );
      case "free-text":
        return Boolean(
          currentAnswers.textResponse &&
          currentAnswers.textResponse.trim().length > 10,
        );
    }
  }, [currentQuestion, currentAnswers]);

  const handleNext = () => {
    if (!hasAnsweredCurrent) return;

    if (
      (mode === "free-practice" ||
        mode === "traps-only" ||
        mode === "spaced-review") &&
      !showImmediateExplanation
    ) {
      setShowImmediateExplanation(true);
      return;
    }

    const graded = gradeCurrentAnswer();
    const updatedResponses = {
      ...session.responses,
      [currentQuestion.id]: graded,
    };

    if (isLastQuestion) {
      setSession((prev) => ({
        ...prev,
        responses: updatedResponses,
        isFinished: true,
      }));
    } else {
      // Scroll to top when moving to next question
      window.scrollTo({ top: 0, behavior: "instant" });
      setSession((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        responses: updatedResponses,
      }));
      setCurrentAnswers({});
      setShowImmediateExplanation(false);
    }
  };

  // Compute final summary
  const summary: QuizScoreSummary = useMemo(() => {
    const totalQuestions = session.questions.length;
    let correctCount = 0;
    let totalScore = 0;
    const blockMap: Record<
      SyllabusBlock,
      { total: number; correct: number; percentage: number }
    > = {
      1: { total: 0, correct: 0, percentage: 0 },
      2: { total: 0, correct: 0, percentage: 0 },
      3: { total: 0, correct: 0, percentage: 0 },
      4: { total: 0, correct: 0, percentage: 0 },
      5: { total: 0, correct: 0, percentage: 0 },
      6: { total: 0, correct: 0, percentage: 0 },
      7: { total: 0, correct: 0, percentage: 0 },
    };

    session.questions.forEach((q) => {
      const resp = session.responses[q.id];
      blockMap[q.block].total += 1;
      if (resp?.isCorrect) {
        correctCount += 1;
        totalScore += resp.scoreEarned ?? 1;
        blockMap[q.block].correct += 1;
      }
    });

    Object.keys(blockMap).forEach((b) => {
      const blk = Number(b) as SyllabusBlock;
      if (blockMap[blk].total > 0) {
        blockMap[blk].percentage = Math.round(
          (blockMap[blk].correct / blockMap[blk].total) * 100,
        );
      }
    });

    const scaledGrade30 =
      totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 30) : 0;

    return {
      totalQuestions,
      correctCount,
      totalScore,
      maxScore: totalQuestions,
      scaledGrade30,
      isPassed: scaledGrade30 >= 18,
      timeTakenSeconds: session.elapsedSeconds,
      blockBreakdown: blockMap,
    };
  }, [session]);

  useEffect(() => {
    if (session.isFinished && !hasSavedRef.current) {
      hasSavedRef.current = true;
      saveQuizRecord(session, summary);
      if (onFinish) {
        onFinish(summary, session);
      }
    }
  }, [session.isFinished, summary, session, onFinish]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const remainingSeconds = session.timeLimitSeconds
    ? Math.max(0, session.timeLimitSeconds - session.elapsedSeconds)
    : session.elapsedSeconds;

  // Render Quiz Review if finished
  if (session.isFinished) {
    return (
      <div className="mx-auto max-w-3xl py-8 px-4 overflow-x-hidden">
        {/* Score Header */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8 text-center shadow-md">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 mb-4">
            <Award className="h-8 w-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {summary.isPassed ? "Test Superato!" : "Test Non Superato"}
          </h2>
          <div className="my-4 flex items-center justify-center gap-3">
            <span
              className={`text-4xl sm:text-5xl font-black ${
                summary.isPassed
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {summary.scaledGrade30}
            </span>
            <span className="text-xl sm:text-2xl font-semibold text-slate-400 dark:text-slate-500">
              / 30
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Risposte corrette:{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              {summary.correctCount}
            </strong>{" "}
            su{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              {summary.totalQuestions}
            </strong>{" "}
            ({Math.round((summary.correctCount / summary.totalQuestions) * 100)}
            %) • Tempo: {formatTimer(summary.timeTakenSeconds)}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Risultato salvato nello Storico</span>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                hasSavedRef.current = false;
                window.scrollTo({ top: 0, behavior: "instant" });
                setSession((prev) => ({
                  ...prev,
                  id: `quiz-${Date.now()}`,
                  currentIndex: 0,
                  responses: {},
                  startTime: Date.now(),
                  elapsedSeconds: 0,
                  isFinished: false,
                }));
                setCurrentAnswers({});
                setReviewIndex(0);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 sm:px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-sky-700 transition cursor-pointer text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Ripeti Test</span>
              <span className="sm:hidden">Ripeti</span>
            </button>
            {onViewStats && (
              <button
                onClick={onViewStats}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 px-4 sm:px-5 py-2.5 font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 transition cursor-pointer text-sm"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">
                  Vedi Storico & Statistiche
                </span>
                <span className="sm:hidden">Stats</span>
              </button>
            )}
            {onExit && (
              <button
                onClick={onExit}
                className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 sm:px-5 py-2.5 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer text-sm"
              >
                <span className="hidden sm:inline">Torna al Menu</span>
                <span className="sm:hidden">Menu</span>
              </button>
            )}
          </div>
        </div>

        {/* Detailed Question Review - Paginated */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Revisione Domande e Spiegazioni
          </h3>

          {/* Quick Jump Buttons */}
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
            {session.questions.map((q, idx) => {
              const r = session.responses[q.id];
              const ok = r?.isCorrect;
              const isCurrent = idx === reviewIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setReviewIndex(idx);
                    setTimeout(() => {
                      reviewCardRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 0);
                  }}
                  className={`h-8 w-8 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                    isCurrent
                      ? "ring-2 ring-offset-1 ring-sky-500 dark:ring-offset-slate-800"
                      : ""
                  } ${
                    ok
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-rose-500 text-white hover:bg-rose-600"
                  }`}
                  title={`Domanda ${idx + 1} - ${ok ? "Corretta" : "Sbagliata"}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Review Question */}
          {(() => {
            const q = session.questions[reviewIndex];
            const resp = session.responses[q.id];
            const isOk = resp?.isCorrect;
            const idx = reviewIndex;
            return (
              <div
                ref={reviewCardRef}
                className={`rounded-2xl border p-4 sm:p-6 bg-white dark:bg-slate-800 shadow-2xs overflow-x-hidden ${
                  isOk
                    ? "border-emerald-200 dark:border-emerald-800"
                    : "border-rose-200 dark:border-rose-800"
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    {isOk ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      Quesito #{idx + 1}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 font-mono text-slate-600 dark:text-slate-300">
                      Bl. {q.block}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isOk
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-rose-700 dark:text-rose-400"
                    }`}
                  >
                    {isOk ? "+1" : "0"}
                  </span>
                </div>

                <p className="mt-3 text-slate-900 dark:text-slate-100 font-medium break-words">
                  {q.stem}
                </p>

                {q.formula && (
                  <div className="max-w-full overflow-x-auto">
                    <FormulaBlock formula={q.formula} />
                  </div>
                )}

                {/* Answer Options Review */}
                {q.type === "single-choice" && q.options && (
                  <div className="mt-4 space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isCorrectOption = opt.correct;
                      const wasSelected = resp?.selectedOptionId === opt.id;
                      let optionClasses =
                        "w-full text-left p-3 rounded-xl border text-sm flex items-start gap-3 ";
                      let letterClasses =
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ";
                      if (isCorrectOption) {
                        optionClasses +=
                          "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 ";
                        letterClasses += "bg-emerald-600 text-white ";
                      } else if (wasSelected && !isCorrectOption) {
                        optionClasses +=
                          "border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-900/30 ";
                        letterClasses += "bg-rose-600 text-white ";
                      } else {
                        optionClasses +=
                          "border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 ";
                        letterClasses +=
                          "bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-300 ";
                      }
                      return (
                        <div key={opt.id} className={optionClasses}>
                          <span className={letterClasses}>{letter}</span>
                          <span className="pt-0.5 text-slate-800 dark:text-slate-200 flex-1">
                            {opt.text}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isCorrectOption && (
                              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                Corretta
                              </span>
                            )}
                            {wasSelected && !isCorrectOption && (
                              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                                <XCircle className="h-4 w-4" />
                                Scelta
                              </span>
                            )}
                            {wasSelected && isCorrectOption && (
                              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 ml-1">
                                ✓ Scelta
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Multi-choice Answer Options Review */}
                {q.type === "multi-choice" && q.options && (
                  <div className="mt-4 space-y-2">
                    {q.options.map((opt) => {
                      const isCorrectOption = opt.correct;
                      const wasSelected =
                        resp?.selectedOptionIds?.includes(opt.id) ?? false;
                      let optionClasses =
                        "w-full text-left p-3 rounded-xl border text-sm flex items-start gap-3 ";
                      let checkClasses =
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border mt-0.5 ";
                      if (isCorrectOption && wasSelected) {
                        optionClasses +=
                          "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 ";
                        checkClasses +=
                          "bg-emerald-600 border-emerald-600 text-white ";
                      } else if (isCorrectOption && !wasSelected) {
                        optionClasses +=
                          "border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/30 ";
                        checkClasses +=
                          "bg-amber-600 border-amber-600 text-white ";
                      } else if (!isCorrectOption && wasSelected) {
                        optionClasses +=
                          "border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-900/30 ";
                        checkClasses +=
                          "bg-rose-600 border-rose-600 text-white ";
                      } else {
                        optionClasses +=
                          "border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 ";
                        checkClasses +=
                          "border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 ";
                      }
                      return (
                        <div key={opt.id} className={optionClasses}>
                          <div className={checkClasses}>
                            {(wasSelected || isCorrectOption) && (
                              <CheckCircle className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <span className="pt-0.5 text-slate-800 dark:text-slate-200 flex-1">
                            {opt.text}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold">
                            {isCorrectOption && wasSelected && (
                              <span className="text-emerald-700 dark:text-emerald-400">
                                ✓ Corretta
                              </span>
                            )}
                            {isCorrectOption && !wasSelected && (
                              <span className="text-amber-700 dark:text-amber-400">
                                Mancata
                              </span>
                            )}
                            {!isCorrectOption && wasSelected && (
                              <span className="text-rose-700 dark:text-rose-400">
                                Errata
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* True/False Answer Review */}
                {q.type === "true-false" && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[true, false].map((val) => {
                      const correctOpt = q.options?.find((o) => o.correct);
                      const correctAnswer = correctOpt?.id === "true";
                      const isCorrectOption = val === correctAnswer;
                      const wasSelected = resp?.booleanAnswer === val;
                      let btnClasses =
                        "p-3 rounded-xl border text-center font-bold text-sm ";
                      if (isCorrectOption) {
                        btnClasses +=
                          "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 ";
                      } else if (wasSelected && !isCorrectOption) {
                        btnClasses +=
                          "border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200 ";
                      } else {
                        btnClasses +=
                          "border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 ";
                      }
                      return (
                        <div key={String(val)} className={btnClasses}>
                          <div>{val ? "VERO" : "FALSO"}</div>
                          <div className="text-xs font-normal mt-1">
                            {isCorrectOption && wasSelected && (
                              <span className="text-emerald-700 dark:text-emerald-400">
                                ✓ Corretta
                              </span>
                            )}
                            {isCorrectOption && !wasSelected && (
                              <span className="text-emerald-700 dark:text-emerald-400">
                                Corretta
                              </span>
                            )}
                            {!isCorrectOption && wasSelected && (
                              <span className="text-rose-700 dark:text-rose-400">
                                Scelta errata
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Multi True/False Answer Review */}
                {q.type === "multi-true-false" && q.multiTrueFalseItems && (
                  <div className="mt-4 space-y-2">
                    {q.multiTrueFalseItems.map((item, itemIdx) => {
                      const userAnswer = resp?.multiTrueFalseAnswers?.[item.id];
                      const isCorrect = userAnswer === item.isTrue;
                      let rowClasses =
                        "p-3 rounded-xl border text-sm flex items-center justify-between gap-3 ";
                      if (userAnswer !== undefined) {
                        rowClasses += isCorrect
                          ? "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 "
                          : "border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-900/30 ";
                      } else {
                        rowClasses +=
                          "border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 ";
                      }
                      return (
                        <div key={item.id} className={rowClasses}>
                          <span className="text-slate-800 dark:text-slate-200 flex-1">
                            {String.fromCharCode(97 + itemIdx)}){" "}
                            {item.statement}
                          </span>
                          <div className="flex items-center gap-2 shrink-0 text-xs font-bold">
                            <span className="text-slate-500 dark:text-slate-400">
                              Tua:{" "}
                              {userAnswer === undefined
                                ? "—"
                                : userAnswer
                                  ? "V"
                                  : "F"}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400">
                              |
                            </span>
                            <span
                              className={
                                isCorrect
                                  ? "text-emerald-700 dark:text-emerald-400"
                                  : "text-rose-700 dark:text-rose-400"
                              }
                            >
                              Corretta: {item.isTrue ? "V" : "F"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Numeric Input Answer Review */}
                {q.type === "numeric-input" && (
                  <div className="mt-4 p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm">
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">
                          Tua risposta:{" "}
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            isOk
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-rose-700 dark:text-rose-400"
                          }`}
                        >
                          {resp?.numericValue ?? "—"}
                        </span>
                      </div>
                      <span className="text-slate-300 dark:text-slate-600">
                        |
                      </span>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">
                          Corretta:{" "}
                        </span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {q.numericAnswer?.value}
                          {q.numericAnswer?.tolerance
                            ? ` (±${q.numericAnswer.tolerance})`
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Free Text Answer Review */}
                {q.type === "free-text" && (
                  <div className="mt-4 p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm space-y-2">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">
                        Tua risposta:{" "}
                      </span>
                      <span
                        className={`font-medium ${
                          isOk
                            ? "text-emerald-700 dark:text-emerald-400"
                            : "text-rose-700 dark:text-rose-400"
                        }`}
                      >
                        {resp?.textResponse || "—"}
                      </span>
                    </div>
                    {q.numericAnswer && (
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">
                          Valore atteso:{" "}
                        </span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {q.numericAnswer.value}
                          {q.numericAnswer.tolerance
                            ? ` (±${q.numericAnswer.tolerance})`
                            : ""}
                        </span>
                      </div>
                    )}
                    {q.freeTextKeywords && q.freeTextKeywords.length > 0 && (
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">
                          Parole chiave attese:{" "}
                        </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {q.freeTextKeywords.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Explanation Block */}
                <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 p-3 sm:p-4 border border-slate-200 dark:border-slate-600 text-sm space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                    <Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0" />
                    <span>Spiegazione (Regola d'Oro):</span>
                  </div>
                  <div className="break-words">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Perché:
                    </span>{" "}
                    <span className="text-slate-600 dark:text-slate-400">
                      {q.explanation.why}
                    </span>
                  </div>
                  <div className="break-words">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Cosa:
                    </span>{" "}
                    <span className="text-slate-600 dark:text-slate-400">
                      {q.explanation.what}
                    </span>
                  </div>
                  <div className="break-words overflow-x-auto">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Come:
                    </span>{" "}
                    <span className="text-slate-900 dark:text-slate-100 font-mono text-xs">
                      {q.explanation.how}
                    </span>
                  </div>
                  {q.explanation.trap && (
                    <div className="pt-2 text-rose-900 dark:text-rose-300 text-xs border-t border-slate-200 dark:border-slate-600 break-words">
                      <span className="font-bold">Trappola d'esame:</span>{" "}
                      {q.explanation.trap}
                    </div>
                  )}
                </div>

                {/* Lesson reference & Deep Link to Study */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2.5">
                  {q.sourceRef ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium min-w-0">
                      <BookOpen className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span className="truncate">
                        Fonte:{" "}
                        <strong className="text-slate-700 dark:text-slate-300">
                          {q.sourceRef}
                        </strong>
                      </span>
                    </div>
                  ) : (
                    <div />
                  )}
                  {onNavigateToStudy && (
                    <button
                      onClick={() => onNavigateToStudy(q.block, q.topic)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 dark:bg-sky-900/50 px-2 sm:px-3 py-1.5 text-xs font-bold text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/70 hover:text-sky-900 dark:hover:text-sky-200 border border-sky-200/80 dark:border-sky-700 transition cursor-pointer shadow-2xs shrink-0"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">
                        Vai alla Lezione (Blocco {q.block})
                      </span>
                      <span className="sm:hidden">Lezione</span>
                      <ExternalLink className="h-3 w-3 ml-0.5 opacity-70" />
                    </button>
                  )}
                </div>

                {/* Navigation Arrows */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setReviewIndex((prev) => Math.max(0, prev - 1));
                      setTimeout(() => {
                        reviewCardRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 0);
                    }}
                    disabled={reviewIndex === 0}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-sm transition cursor-pointer ${
                      reviewIndex === 0
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        : "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500"
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span className="hidden sm:inline">Precedente</span>
                  </button>

                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {reviewIndex + 1} / {session.questions.length}
                  </span>

                  <button
                    onClick={() => {
                      setReviewIndex((prev) =>
                        Math.min(session.questions.length - 1, prev + 1),
                      );
                      setTimeout(() => {
                        reviewCardRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 0);
                    }}
                    disabled={reviewIndex === session.questions.length - 1}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-sm transition cursor-pointer ${
                      reviewIndex === session.questions.length - 1
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        : "bg-sky-600 text-white hover:bg-sky-700"
                    }`}
                  >
                    <span className="hidden sm:inline">Successiva</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  // Active Quiz View
  return (
    <div className="mx-auto max-w-2xl py-6 px-4 overflow-x-hidden">
      {/* Top Status Bar */}
      {mode === "traps-only" && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-3 mb-4 text-sm">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-rose-900">
              Modalità Trappole Concettuali
            </span>
            <span className="text-rose-700 text-xs block">
              Ogni quesito testa una confusione tipica. Dopo la risposta vedrai
              la trappola evidenziata.
            </span>
          </div>
        </div>
      )}
      {mode === "spaced-review" && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 p-3 mb-4 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white shrink-0">
            <span className="text-base">🧠</span>
          </div>
          <div className="min-w-0">
            <span className="font-bold text-teal-900">
              Ripasso Intelligente (Spaced Repetition)
            </span>
            <span className="text-teal-700 text-xs block">
              Questi quesiti sono stati selezionati dall'algoritmo in base ai
              tuoi errori passati e al tempo trascorso.
            </span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between rounded-2xl bg-white dark:bg-slate-800 p-3 sm:p-4 shadow-xs border border-slate-200 dark:border-slate-700 mb-6 gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold ${
              mode === "traps-only"
                ? "bg-rose-600 text-white"
                : mode === "spaced-review"
                  ? "bg-teal-600 text-white"
                  : "bg-sky-600 text-white"
            }`}
          >
            {session.currentIndex + 1}
          </span>
          <span className="text-slate-500 text-sm">
            di {session.questions.length}
          </span>
        </div>

        {/* Progress pill */}
        <div className="text-xs font-semibold px-2 sm:px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 truncate max-w-[120px] sm:max-w-none">
          <span className="hidden sm:inline">
            Blocco {currentQuestion.block} •{" "}
          </span>
          {currentQuestion.track.toUpperCase()}
        </div>

        {/* Timer — only show for timed modes */}
        {session.timeLimitSeconds ? (
          <div className="flex items-center gap-1.5 font-mono text-sm font-semibold text-slate-700 shrink-0">
            <Clock className="h-4 w-4 text-sky-600" />
            <span>{formatTimer(remainingSeconds)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 font-mono text-sm font-semibold text-slate-400 shrink-0">
            <Clock className="h-4 w-4 text-slate-300" />
            <span>{formatTimer(session.elapsedSeconds)}</span>
          </div>
        )}
      </div>

      {/* Main Question Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 sm:p-8 shadow-sm overflow-x-hidden">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <HelpCircle className="h-4 w-4 text-sky-500 shrink-0" />
          <span className="truncate">
            {currentQuestion.topic.replace(/-/g, " ")}
          </span>
        </div>

        <h3 className="text-base sm:text-xl font-bold text-slate-950 dark:text-slate-50 leading-snug break-words">
          {currentQuestion.stem}
        </h3>

        {currentQuestion.formula && (
          <div className="max-w-full overflow-x-auto">
            <FormulaBlock formula={currentQuestion.formula} />
          </div>
        )}

        {/* Input area based on question type */}
        <div className="mt-6 space-y-3">
          {/* SINGLE CHOICE */}
          {currentQuestion.type === "single-choice" &&
            currentQuestion.options?.map((opt, idx) => {
              const isSelected = currentAnswers.selectedOptionId === opt.id;
              const displayLetter = String.fromCharCode(65 + idx); // A, B, C, D...
              return (
                <button
                  key={opt.id}
                  onClick={() =>
                    setCurrentAnswers({ selectedOptionId: opt.id })
                  }
                  className={`w-full text-left p-4 rounded-xl border font-medium text-sm transition flex items-start gap-3 ${
                    isSelected
                      ? "border-sky-600 bg-sky-50 dark:bg-sky-900/50 text-sky-950 dark:text-sky-100 shadow-xs"
                      : "border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 hover:bg-slate-100/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                      isSelected
                        ? "bg-sky-600 text-white"
                        : "bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {displayLetter}
                  </span>
                  <span className="pt-0.5">{opt.text}</span>
                </button>
              );
            })}

          {/* MULTI CHOICE */}
          {currentQuestion.type === "multi-choice" &&
            currentQuestion.options?.map((opt) => {
              const selectedList = currentAnswers.selectedOptionIds || [];
              const isChecked = selectedList.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    const next = isChecked
                      ? selectedList.filter((id) => id !== opt.id)
                      : [...selectedList, opt.id];
                    setCurrentAnswers({ selectedOptionIds: next });
                  }}
                  className={`w-full text-left p-4 rounded-xl border font-medium text-sm transition flex items-start gap-3 ${
                    isChecked
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-100 shadow-xs"
                      : "border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 hover:bg-slate-100/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border mt-0.5 ${
                      isChecked
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700"
                    }`}
                  >
                    {isChecked && <CheckCircle className="h-3.5 w-3.5" />}
                  </div>
                  <span className="pt-0.5">{opt.text}</span>
                </button>
              );
            })}

          {/* TRUE FALSE */}
          {currentQuestion.type === "true-false" && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => setCurrentAnswers({ booleanAnswer: true })}
                className={`p-4 rounded-xl border text-center font-bold text-base transition ${
                  currentAnswers.booleanAnswer === true
                    ? "border-sky-600 bg-sky-50 dark:bg-sky-900/50 text-sky-950 dark:text-sky-100 ring-2 ring-sky-500"
                    : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                }`}
              >
                VERO
              </button>
              <button
                onClick={() => setCurrentAnswers({ booleanAnswer: false })}
                className={`p-4 rounded-xl border text-center font-bold text-base transition ${
                  currentAnswers.booleanAnswer === false
                    ? "border-sky-600 bg-sky-50 dark:bg-sky-900/50 text-sky-950 dark:text-sky-100 ring-2 ring-sky-500"
                    : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                }`}
              >
                FALSO
              </button>
            </div>
          )}

          {/* MULTI TRUE FALSE */}
          {currentQuestion.type === "multi-true-false" && (
            <div className="space-y-3 pt-2">
              {currentQuestion.multiTrueFalseItems?.map((item) => {
                const currentVal =
                  currentAnswers.multiTrueFalseAnswers?.[item.id];
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="text-slate-800 dark:text-slate-200 leading-relaxed">
                      {item.statement}
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() =>
                          setCurrentAnswers((prev) => ({
                            ...prev,
                            multiTrueFalseAnswers: {
                              ...prev.multiTrueFalseAnswers,
                              [item.id]: true,
                            },
                          }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          currentVal === true
                            ? "bg-emerald-600 text-white"
                            : "bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                        }`}
                      >
                        V
                      </button>
                      <button
                        onClick={() =>
                          setCurrentAnswers((prev) => ({
                            ...prev,
                            multiTrueFalseAnswers: {
                              ...prev.multiTrueFalseAnswers,
                              [item.id]: false,
                            },
                          }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          currentVal === false
                            ? "bg-rose-600 text-white"
                            : "bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                        }`}
                      >
                        F
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* NUMERIC INPUT */}
          {currentQuestion.type === "numeric-input" && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">
                Inserisci il valore numerico calcolato:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Es. 400 oppure 25.5"
                  value={currentAnswers.numericValue || ""}
                  onChange={(e) =>
                    setCurrentAnswers({ numericValue: e.target.value })
                  }
                  className="font-mono text-lg font-bold p-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-800 outline-none w-48 bg-white dark:bg-slate-700 dark:text-slate-100"
                />
                {currentQuestion.numericAnswer?.unit && (
                  <span className="font-semibold text-slate-500 dark:text-slate-400 text-sm">
                    {currentQuestion.numericAnswer.unit}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* FREE TEXT */}
          {currentQuestion.type === "free-text" && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">
                Risposta argomentata (sintetica):
              </label>
              <textarea
                rows={4}
                placeholder="Argomenta la risposta sintetizzando cause e implicazioni aziendali..."
                value={currentAnswers.textResponse || ""}
                onChange={(e) =>
                  setCurrentAnswers({ textResponse: e.target.value })
                }
                className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-600 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-800 outline-none"
              />
            </div>
          )}
        </div>

        {/* Immediate explanation in free-practice / traps-only mode */}
        {showImmediateExplanation && (
          <div ref={explanationRef} className="mt-6 space-y-3 scroll-mt-24">
            {/* Full explanation block */}
            <div className="rounded-2xl bg-amber-50/80 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 p-4 text-sm text-slate-900 dark:text-slate-100 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Spiegazione del Quesito:</span>
              </div>
              {mode === "traps-only" && (
                <>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Perché:{" "}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 text-xs">
                      {currentQuestion.explanation.why}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Cosa:{" "}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 text-xs">
                      {currentQuestion.explanation.what}
                    </span>
                  </div>
                </>
              )}
              <div>
                {mode === "traps-only" && (
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Come:{" "}
                  </span>
                )}
                <span className="text-slate-800 dark:text-slate-200 text-xs font-mono">
                  {currentQuestion.explanation.how}
                </span>
              </div>
            </div>

            {/* Prominent trap card for traps-only mode */}
            {currentQuestion.explanation.trap && (
              <div
                className={`rounded-2xl p-4 text-sm ${
                  mode === "traps-only"
                    ? "bg-rose-50 dark:bg-rose-900/30 border-2 border-rose-300 dark:border-rose-700 shadow-sm"
                    : "bg-amber-50/80 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 pt-0"
                }`}
              >
                {mode === "traps-only" ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-bold text-rose-900 dark:text-rose-300">
                      <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                      <span className="uppercase tracking-wider text-xs">
                        ⚠ Trappola Concettuale — Non Dare per Scontato
                      </span>
                    </div>
                    <p className="text-rose-900 dark:text-rose-200 text-sm leading-relaxed font-medium">
                      {currentQuestion.explanation.trap}
                    </p>
                  </div>
                ) : (
                  <p className="text-rose-900 dark:text-rose-300 text-xs font-medium border-t border-amber-200 dark:border-amber-800 pt-2">
                    <strong>Trappola:</strong>{" "}
                    {currentQuestion.explanation.trap}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Forward Action Button */}
        <div className="mt-8 flex justify-end">
          <button
            disabled={!hasAnsweredCurrent}
            onClick={handleNext}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-sm transition shadow-sm ${
              hasAnsweredCurrent
                ? "bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <span>
              {(() => {
                // In modalità con spiegazione immediata, il primo click mostra la spiegazione
                const needsExplanationFirst =
                  (mode === "free-practice" ||
                    mode === "traps-only" ||
                    mode === "spaced-review") &&
                  !showImmediateExplanation;

                if (needsExplanationFirst) {
                  return "Conferma e Mostra Spiegazione";
                }
                return isLastQuestion
                  ? "Termina e Consegna Test"
                  : "Prossimo Quesito";
              })()}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
