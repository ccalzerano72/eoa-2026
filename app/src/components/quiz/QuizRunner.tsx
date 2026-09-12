import { useState, useEffect, useMemo } from "react";
import type {
  UserResponse,
  QuizSessionState,
  QuizScoreSummary,
} from "../../types/quiz";
import type { Question, SyllabusBlock } from "../../types/question";
import { FormulaBlock } from "../ui/FormulaBlock";
import {
  Clock,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Award,
  BookOpen,
  ExternalLink,
} from "lucide-react";

interface QuizRunnerProps {
  questions: Question[];
  mode?: "exam-simulation" | "free-practice";
  timeLimitSeconds?: number;
  onFinish?: (summary: QuizScoreSummary) => void;
  onExit?: () => void;
  onNavigateToStudy?: (block: SyllabusBlock, topicId: string) => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  questions,
  mode = "exam-simulation",
  timeLimitSeconds = 30 * 60, // default 30 mins
  onFinish,
  onExit,
  onNavigateToStudy,
}) => {
  const [session, setSession] = useState<QuizSessionState>(() => ({
    id: `quiz-${Date.now()}`,
    mode,
    questions,
    currentIndex: 0,
    responses: {},
    startTime: Date.now(),
    elapsedSeconds: 0,
    timeLimitSeconds: mode === "exam-simulation" ? timeLimitSeconds : undefined,
    isFinished: false,
  }));

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
        const text = (currentAnswers.textResponse || "").toLowerCase();
        const keywords = currentQuestion.freeTextKeywords || [];
        const matched = keywords.filter((kw) =>
          text.includes(kw.toLowerCase()),
        );
        isCorrect = matched.length >= Math.ceil(keywords.length * 0.5);
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

    if (mode === "free-practice" && !showImmediateExplanation) {
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
    if (session.isFinished && onFinish) {
      onFinish(summary);
    }
  }, [session.isFinished, summary, onFinish]);

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
      <div className="mx-auto max-w-3xl py-8 px-4">
        {/* Score Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-md">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 mb-4">
            <Award className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {summary.isPassed ? "Test Superato!" : "Test Non Superato"}
          </h2>
          <div className="my-4 flex items-center justify-center gap-3">
            <span
              className={`text-5xl font-black ${
                summary.isPassed ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {summary.scaledGrade30}
            </span>
            <span className="text-2xl font-semibold text-slate-400">/ 30</span>
          </div>
          <p className="text-slate-600 text-sm">
            Risposte corrette: <strong>{summary.correctCount}</strong> su{" "}
            <strong>{summary.totalQuestions}</strong> (
            {Math.round((summary.correctCount / summary.totalQuestions) * 100)}
            %) • Tempo impiegato: {formatTimer(summary.timeTakenSeconds)}
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => {
                setSession((prev) => ({
                  ...prev,
                  currentIndex: 0,
                  responses: {},
                  startTime: Date.now(),
                  elapsedSeconds: 0,
                  isFinished: false,
                }));
                setCurrentAnswers({});
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-sky-700 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Ripeti Test
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Torna al Menu
              </button>
            )}
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="mt-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">
            Revisione Domande e Spiegazioni
          </h3>
          {session.questions.map((q, idx) => {
            const resp = session.responses[q.id];
            const isOk = resp?.isCorrect;
            return (
              <div
                key={q.id}
                className={`rounded-2xl border p-6 bg-white shadow-2xs ${
                  isOk ? "border-emerald-200" : "border-rose-200"
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    {isOk ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-600" />
                    )}
                    <span className="font-bold text-slate-900">
                      Quesito #{idx + 1}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-mono text-slate-600">
                      Blocco {q.block}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isOk ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {isOk ? "Corretto (+1)" : "Errato (0)"}
                  </span>
                </div>

                <p className="mt-3 text-slate-900 font-medium">{q.stem}</p>

                {q.formula && <FormulaBlock formula={q.formula} />}

                {/* Explanation Block */}
                <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-200 text-sm space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs uppercase tracking-wider">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span>Spiegazione (Regola d'Oro):</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">
                      Perché:
                    </span>{" "}
                    <span className="text-slate-600">{q.explanation.why}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Cosa:</span>{" "}
                    <span className="text-slate-600">{q.explanation.what}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Come:</span>{" "}
                    <span className="text-slate-900 font-mono text-xs">
                      {q.explanation.how}
                    </span>
                  </div>
                  {q.explanation.trap && (
                    <div className="pt-2 text-rose-900 text-xs border-t border-slate-200">
                      <span className="font-bold">Trappola d'esame:</span>{" "}
                      {q.explanation.trap}
                    </div>
                  )}
                </div>

                {/* Lesson reference & Deep Link to Study */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                  {q.sourceRef ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <BookOpen className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                      <span>
                        Fonte didattica:{" "}
                        <strong className="text-slate-700">
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
                      className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-100 hover:text-sky-900 border border-sky-200/80 transition cursor-pointer shadow-2xs"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Vai alla Lezione (Blocco {q.block})</span>
                      <ExternalLink className="h-3 w-3 ml-0.5 opacity-70" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Quiz View
  return (
    <div className="mx-auto max-w-2xl py-6 px-4">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-xs border border-slate-200 mb-6">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-600 text-white font-mono text-xs font-bold">
            {session.currentIndex + 1}
          </span>
          <span className="text-slate-500 text-sm">
            di {session.questions.length} quesiti
          </span>
        </div>

        {/* Progress pill */}
        <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          Blocco {currentQuestion.block} • {currentQuestion.track.toUpperCase()}
        </div>

        {/* Timer */}
        <div className="flex items-center gap-1.5 font-mono text-sm font-semibold text-slate-700">
          <Clock className="h-4 w-4 text-sky-600" />
          <span>{formatTimer(remainingSeconds)}</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <HelpCircle className="h-4 w-4 text-sky-500" />
          <span>{currentQuestion.topic.replace(/-/g, " ")}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-950 leading-snug">
          {currentQuestion.stem}
        </h3>

        {currentQuestion.formula && (
          <FormulaBlock formula={currentQuestion.formula} />
        )}

        {/* Input area based on question type */}
        <div className="mt-6 space-y-3">
          {/* SINGLE CHOICE */}
          {currentQuestion.type === "single-choice" &&
            currentQuestion.options?.map((opt) => {
              const isSelected = currentAnswers.selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() =>
                    setCurrentAnswers({ selectedOptionId: opt.id })
                  }
                  className={`w-full text-left p-4 rounded-xl border font-medium text-sm transition flex items-start gap-3 ${
                    isSelected
                      ? "border-sky-600 bg-sky-50 text-sky-950 shadow-xs"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 text-slate-800"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                      isSelected
                        ? "bg-sky-600 text-white"
                        : "bg-white border border-slate-300 text-slate-600"
                    }`}
                  >
                    {opt.id.toUpperCase()}
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
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 text-slate-800"
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border mt-0.5 ${
                      isChecked
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 bg-white"
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
                    ? "border-sky-600 bg-sky-50 text-sky-950 ring-2 ring-sky-500"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                VERO
              </button>
              <button
                onClick={() => setCurrentAnswers({ booleanAnswer: false })}
                className={`p-4 rounded-xl border text-center font-bold text-base transition ${
                  currentAnswers.booleanAnswer === false
                    ? "border-sky-600 bg-sky-50 text-sky-950 ring-2 ring-sky-500"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
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
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="text-slate-800 leading-relaxed">
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
                            : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
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
                            : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
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
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
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
                  className="font-mono text-lg font-bold p-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none w-48 bg-white"
                />
                {currentQuestion.numericAnswer?.unit && (
                  <span className="font-semibold text-slate-500 text-sm">
                    {currentQuestion.numericAnswer.unit}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* FREE TEXT */}
          {currentQuestion.type === "free-text" && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
                Risposta argomentata (sintetica):
              </label>
              <textarea
                rows={4}
                placeholder="Argomenta la risposta sintetizzando cause e implicazioni aziendali..."
                value={currentAnswers.textResponse || ""}
                onChange={(e) =>
                  setCurrentAnswers({ textResponse: e.target.value })
                }
                className="w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
              />
            </div>
          )}
        </div>

        {/* Immediate explanation in free-practice mode */}
        {showImmediateExplanation && (
          <div className="mt-6 rounded-2xl bg-amber-50/80 border border-amber-200 p-4 text-sm text-slate-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span>Spiegazione del Quesito:</span>
            </div>
            <p className="text-slate-800 text-xs">
              {currentQuestion.explanation.how}
            </p>
            {currentQuestion.explanation.trap && (
              <p className="text-rose-900 text-xs font-medium border-t border-amber-200 pt-2">
                <strong>Trappola:</strong> {currentQuestion.explanation.trap}
              </p>
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
              {isLastQuestion ? "Termina e Consegna Test" : "Prossimo Quesito"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
