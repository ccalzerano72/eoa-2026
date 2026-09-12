import { useState, useEffect, useMemo, useCallback } from "react";
import type { Question, SyllabusBlock, StudyTrack } from "./types/question";
import type { StudyBlock } from "./types/study";
import type {
  QuizSessionState,
  QuizScoreSummary,
  QuizHistoryRecord,
  QuizMode,
} from "./types/quiz";
import { QuizRunner } from "./components/quiz/QuizRunner";
import { FlashCardRunner } from "./components/quiz/FlashCardRunner";
import { StudyBlockViewer } from "./components/study/StudyBlockViewer";
import { StatsHistoryView } from "./components/stats/StatsHistoryView";
import { FormulaCheatsheetView } from "./components/formula/FormulaCheatsheetView";
import { DuPontPlayground } from "./components/simulator/DuPontPlayground";
import type { FormulaItem } from "./data/formulas";
import { formulasData } from "./data/formulas";
import { getQuizHistory, computeOverallStats } from "./services/storage";
import {
  GraduationCap,
  BookOpen,
  PlayCircle,
  Sparkles,
  Award,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  TrendingUp,
  ChevronRight,
  Calculator,
  AlertTriangle,
  Layers,
  Filter,
  LayoutGrid,
  Zap,
} from "lucide-react";
import { CollapsibleSection } from "./components/ui/CollapsibleSection";

type NavTab =
  | "dashboard"
  | "study"
  | "quiz"
  | "formula"
  | "stats"
  | "simulator";

interface NavEntry {
  tab: NavTab;
  studyBlockNumber?: number;
  studyTopicId?: string;
  fromQuizReview?: boolean;
}

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [studyBlock, setStudyBlock] = useState<StudyBlock | null>(null);
  const [targetTopicId, setTargetTopicId] = useState<string | undefined>();
  const [quizMode, setQuizMode] = useState<QuizMode>("exam-simulation");
  const [activeTrackFilter, setActiveTrackFilter] = useState<
    StudyTrack | "all"
  >("all");

  // Active quiz session and key (to preserve review or re-render when needed)
  const [activeReviewSession, setActiveReviewSession] =
    useState<QuizSessionState | null>(null);
  const [quizRunnerKey, setQuizRunnerKey] = useState<string>("init-quiz");

  // Local storage history
  const [quizHistory, setQuizHistory] = useState<QuizHistoryRecord[]>(() =>
    getQuizHistory(),
  );

  // In-app navigation history stack for Back/Forward arrows
  const [navHistory, setNavHistory] = useState<NavEntry[]>([
    { tab: "dashboard" },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < navHistory.length - 1;

  // Load full questions dataset and initial study unit from public data
  useEffect(() => {
    fetch("/data/questions/questions.json")
      .then((res) => {
        if (!res.ok) throw new Error("Could not load questions.json");
        return res.json();
      })
      .then((data: Question[]) => {
        setAllQuestions(data);
        setActiveQuestions(data);
      })
      .catch((err) => {
        console.warn("Falling back to sample questions:", err);
        fetch("/data/questions/sample.json")
          .then((res) => res.json())
          .then((data: Question[]) => {
            setAllQuestions(data);
            setActiveQuestions(data);
          })
          .catch((e) => console.error("Failed to load sample questions:", e));
      });

    fetch("/data/theory/blocco-1.json")
      .then((res) => res.json())
      .then((data: StudyBlock) => setStudyBlock(data))
      .catch((err) => console.error("Failed to load sample theory:", err));
  }, []);

  const loadStudyBlock = useCallback(
    (blockNumber: number, topicId?: string) => {
      setTargetTopicId(topicId);
      fetch(`/data/theory/blocco-${blockNumber}.json`)
        .then((res) => res.json())
        .then((data: StudyBlock) => {
          setStudyBlock(data);
        })
        .catch((err) => {
          console.error("Failed to load study block:", err);
        });
    },
    [],
  );

  const applyNavEntry = useCallback(
    (entry: NavEntry) => {
      setActiveTab(entry.tab);
      if (entry.tab === "study" && entry.studyBlockNumber) {
        loadStudyBlock(entry.studyBlockNumber, entry.studyTopicId);
      }
    },
    [loadStudyBlock],
  );

  const navigateTo = useCallback(
    (nextEntry: NavEntry) => {
      setNavHistory((prev) => {
        const trimmed = prev.slice(0, historyIndex + 1);
        return [...trimmed, nextEntry];
      });
      setHistoryIndex((prev) => prev + 1);
      applyNavEntry(nextEntry);
    },
    [historyIndex, applyNavEntry],
  );

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      applyNavEntry(navHistory[nextIdx]);
    }
  }, [historyIndex, navHistory, applyNavEntry]);

  const goForward = useCallback(() => {
    if (historyIndex < navHistory.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      applyNavEntry(navHistory[nextIdx]);
    }
  }, [historyIndex, navHistory, applyNavEntry]);

  // Keyboard shortcut listener (Alt+Left, Alt+Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        goBack();
      } else if (e.altKey && e.key === "ArrowRight") {
        e.preventDefault();
        goForward();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goBack, goForward]);

  const handleNavigateToStudy = (blockNumber: number, topicId?: string) => {
    loadStudyBlock(blockNumber, topicId);
    navigateTo({
      tab: "study",
      studyBlockNumber: blockNumber,
      studyTopicId: topicId,
    });
  };

  const handleNavigateToStudyFromReview = (
    blockNumber: SyllabusBlock,
    topicId: string,
  ) => {
    loadStudyBlock(blockNumber, topicId);
    navigateTo({
      tab: "study",
      studyBlockNumber: blockNumber,
      studyTopicId: topicId,
      fromQuizReview: true,
    });
  };

  const sampleExamQuestions = useCallback(
    (pool: Question[], countPerBlock = 4): Question[] => {
      const selected: Question[] = [];
      for (let b = 1; b <= 7; b++) {
        const blockPool = pool.filter((q) => q.block === b);
        if (blockPool.length === 0) continue;
        const shuffled = [...blockPool].sort(() => Math.random() - 0.5);
        selected.push(...shuffled.slice(0, countPerBlock));
      }
      return selected.sort(() => Math.random() - 0.5);
    },
    [],
  );

  const handleStartTopicQuiz = (blockNumber: number, topicId: string) => {
    const filtered = allQuestions.filter(
      (q) =>
        q.block === blockNumber &&
        (q.topic === topicId || q.topic.includes(topicId)),
    );
    const pool =
      filtered.length > 0
        ? filtered
        : allQuestions.filter((q) => q.block === blockNumber);
    const questionsToUse = [...pool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 15);

    setActiveReviewSession(null);
    setActiveQuestions(questionsToUse);
    setQuizMode("free-practice");
    setQuizRunnerKey(`topic-${blockNumber}-${topicId}-${Date.now()}`);
    navigateTo({ tab: "quiz" });
  };

  // Helper: filter questions by active track
  const filterByTrack = useCallback(
    (pool: Question[]): Question[] => {
      if (activeTrackFilter === "all") return pool;
      return pool.filter((q) => q.track === activeTrackFilter);
    },
    [activeTrackFilter],
  );

  const handleStartFullExam = useCallback(() => {
    setActiveReviewSession(null);
    const pool = filterByTrack(allQuestions);
    const examQuestions = sampleExamQuestions(pool, 4);
    setActiveQuestions(
      examQuestions.length > 0 ? examQuestions : pool.slice(0, 28),
    );
    setQuizMode("exam-simulation");
    setQuizRunnerKey(`exam-${Date.now()}`);
    navigateTo({ tab: "quiz" });
  }, [allQuestions, filterByTrack, sampleExamQuestions, navigateTo]);

  const handlePracticeFormula = useCallback(
    (formula: FormulaItem) => {
      const matching = allQuestions.filter(
        (q) =>
          q.block === formula.block &&
          (q.topic === formula.topic ||
            q.tags.some((t) => formula.tags.includes(t)) ||
            q.id
              .toLowerCase()
              .includes(formula.id.replace("f-", "").toLowerCase())),
      );
      const pool =
        matching.length >= 4
          ? matching
          : allQuestions.filter((q) => q.block === formula.block);
      const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);

      setActiveQuestions(selected);
      setQuizMode("calculations");
      setActiveReviewSession(null);
      setQuizRunnerKey(`formula-quiz-${formula.id}-${Date.now()}`);
      navigateTo({ tab: "quiz" });
    },
    [allQuestions, navigateTo],
  );

  const handleOpenStudyFromFormula = useCallback(
    (blockNumber: number, topicId?: string) => {
      navigateTo({
        tab: "study",
        studyBlockNumber: blockNumber,
        studyTopicId: topicId,
      });
    },
    [navigateTo],
  );

  const handleReviewPastSession = (record: QuizHistoryRecord) => {
    setActiveReviewSession(record.session);
    setActiveQuestions(record.session.questions);
    setQuizMode(record.session.mode);
    setQuizRunnerKey(`review-${record.id}`);
    navigateTo({ tab: "quiz" });
  };

  const handleQuizFinish = (
    _summary: QuizScoreSummary,
    session: QuizSessionState,
  ) => {
    setActiveReviewSession(session);
    setQuizHistory(getQuizHistory());
  };

  const handleStartFlashCards = useCallback(() => {
    setActiveReviewSession(null);
    setQuizMode("flash-cards");
    setQuizRunnerKey(`flash-${Date.now()}`);
    navigateTo({ tab: "quiz" });
  }, [navigateTo]);

  const handleStartTrapsQuiz = useCallback(() => {
    // All questions have traps — prioritize variety across blocks
    const pool = filterByTrack(allQuestions);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 20);

    setActiveReviewSession(null);
    setActiveQuestions(selected);
    setQuizMode("traps-only");
    setQuizRunnerKey(`traps-${Date.now()}`);
    navigateTo({ tab: "quiz" });
  }, [allQuestions, filterByTrack, navigateTo]);

  const overallStats = useMemo(
    () => computeOverallStats(quizHistory),
    [quizHistory],
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs overflow-x-hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2 sm:px-6 sm:py-3">
          {/* Brand & History Navigation Arrows */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Back / Forward Arrows */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                disabled={!canGoBack}
                onClick={goBack}
                className={`p-1.5 rounded-lg transition ${
                  canGoBack
                    ? "text-slate-700 hover:bg-white hover:text-slate-950 shadow-2xs cursor-pointer"
                    : "text-slate-300 cursor-not-allowed"
                }`}
                title="Torna alla schermata precedente (Alt + ←)"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                disabled={!canGoForward}
                onClick={goForward}
                className={`p-1.5 rounded-lg transition ${
                  canGoForward
                    ? "text-slate-700 hover:bg-white hover:text-slate-950 shadow-2xs cursor-pointer"
                    : "text-slate-300 cursor-not-allowed"
                }`}
                title="Vai alla schermata successiva (Alt + →)"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div
              onClick={() => navigateTo({ tab: "dashboard" })}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none"
            >
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs shrink-0">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-600 uppercase tracking-wider">
                    EOA 2026
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-sky-50 text-sky-800 font-semibold border border-sky-200/60 hidden md:inline-block">
                    Ing. Informatica • UniPi
                  </span>
                </div>
                <h1 className="text-base font-bold text-slate-950 leading-tight">
                  Exam Trainer & Simulator
                </h1>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex items-center gap-0.5 sm:gap-2 shrink-0">
            <button
              onClick={() => navigateTo({ tab: "dashboard" })}
              className={`hidden sm:block px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-sky-50 text-sky-700 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() =>
                navigateTo({
                  tab: "study",
                  studyBlockNumber: studyBlock?.block || 1,
                })
              }
              className={`p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "study"
                  ? "bg-sky-50 text-sky-700 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Studio"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Studio</span>
            </button>
            <button
              onClick={() => navigateTo({ tab: "formula" })}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "formula"
                  ? "bg-sky-50 text-sky-700 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Formulario"
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Formulario</span>
            </button>
            <button
              onClick={() => navigateTo({ tab: "simulator" })}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-purple-50 text-purple-700 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Simulatori Interattivi"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden md:inline">Simulatori</span>
            </button>
            <button
              onClick={() => navigateTo({ tab: "stats" })}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "stats"
                  ? "bg-sky-50 text-sky-700 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Storico & Stats"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden md:inline">Storico & Stats</span>
              {quizHistory.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700">
                  {quizHistory.length}
                </span>
              )}
            </button>
            <button
              onClick={handleStartFullExam}
              className={`p-2 sm:px-3.5 sm:py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                activeTab === "quiz" && !activeReviewSession
                  ? "bg-sky-600 text-white"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
              title="Simula Esame"
            >
              <PlayCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Simula Esame</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="mx-auto max-w-5xl py-10 px-4 sm:px-6">
            {/* Hero Welcome */}
            <div className="rounded-3xl bg-linear-to-br from-slate-900 via-sky-950 to-indigo-950 p-8 sm:p-10 text-white shadow-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-200 border border-white/15 backdrop-blur-xs mb-4">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Strumento Didattico Offline-First</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Preparazione e Simulazione Esame EOA 2026
              </h2>
              <p className="mt-3 max-w-2xl text-slate-300 text-sm sm:text-base leading-relaxed">
                Piattaforma conforme al formato d'esame della Prof.ssa Antonella
                Martini: quiz sequenziali a tempo, quesiti a risposta multipla,
                vero/falso multipli e calcoli numerici di bilancio e break-even
                point.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleStartFullExam}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3 font-bold text-sm text-slate-950 shadow-md transition cursor-pointer w-full sm:w-auto"
                >
                  <PlayCircle className="h-5 w-5 shrink-0" />
                  <span>Avvia Simulazione Esame (Sequenziale)</span>
                </button>
                <button
                  onClick={() => handleNavigateToStudy(1)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 font-bold text-sm text-white transition cursor-pointer w-full sm:w-auto"
                >
                  <BookOpen className="h-5 w-5 shrink-0" />
                  <span>Esplora Materiale di Studio</span>
                </button>
              </div>
            </div>

            {/* User Progress & Stats Banner — Collapsible */}
            {overallStats.totalSessions > 0 ? (
              <CollapsibleSection
                title="I Tuoi Progressi & Statistiche"
                subtitle={`${overallStats.examSimulationsCount} simulazioni svolte • ${overallStats.totalQuestionsAnswered} quesiti affrontati`}
                icon={<TrendingUp className="h-5 w-5 text-indigo-600" />}
                badge={
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo({ tab: "stats" });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        navigateTo({ tab: "stats" });
                      }
                    }}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200/80 transition cursor-pointer"
                  >
                    <span>Storico Completo</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                }
                defaultExpanded={true}
                className="mt-8"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-xs text-slate-500 font-semibold mb-1">
                      Media Voto Esame
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900">
                      {overallStats.examSimulationsCount > 0
                        ? `${overallStats.averageScaledGrade30}/30`
                        : "—"}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-xs text-slate-500 font-semibold mb-1">
                      Tasso Superamento
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-600">
                      {overallStats.examSimulationsCount > 0
                        ? `${overallStats.passRatePercentage}%`
                        : "—"}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-xs text-slate-500 font-semibold mb-1">
                      Miglior Voto
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-sky-600">
                      {overallStats.bestScaledGrade30 > 0
                        ? `${overallStats.bestScaledGrade30}/30`
                        : "—"}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-xs text-slate-500 font-semibold mb-1">
                      Tempo Totale
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-amber-600">
                      {Math.round(overallStats.totalTimeSeconds / 60)} min
                    </div>
                  </div>
                </div>
                {/* Mobile link to stats */}
                <button
                  onClick={() => navigateTo({ tab: "stats" })}
                  className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-3.5 py-2.5 rounded-xl border border-sky-200/80 transition cursor-pointer"
                >
                  <span>Vedi Storico Completo & Analisi Blocchi</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </CollapsibleSection>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Nessuna simulazione ancora registrata
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Le tue prove verranno salvate in locale, con statistiche
                      per blocco e voti su 30.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleStartFullExam}
                  className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition cursor-pointer"
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Avvia Prima Prova</span>
                </button>
              </div>
            )}

            {/* Syllabus 7 Blocks Grid — Collapsible on mobile */}
            <CollapsibleSection
              title="I 7 Blocchi del Programma Didattico"
              subtitle="Struttura conforme al percorso EOA 2026 per Ingegneria Informatica"
              icon={<LayoutGrid className="h-5 w-5" />}
              badge={
                <span className="hidden sm:inline text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  7 Blocchi •{" "}
                  {allQuestions.length > 0
                    ? `${allQuestions.length.toLocaleString()} Quesiti`
                    : "5.600+ Quesiti"}
                </span>
              }
              defaultExpanded={false}
              className="mt-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    num: 1,
                    title: "L'Impresa come Sistema",
                    case: "Olivetti (P101)",
                    color: "border-sky-500",
                    desc: "Complicato vs. complesso, razionalità limitata, trade-off e bias cognitivi.",
                  },
                  {
                    num: 2,
                    title: "Le Forme Giuridiche",
                    case: "Satispay, Davines",
                    color: "border-indigo-500",
                    desc: "Ditte individuali, società di persone vs capitali (SNC, SRL, SPA).",
                  },
                  {
                    num: 3,
                    title: "Governance e Finanziamento",
                    case: "Governance S.p.A.",
                    color: "border-purple-500",
                    desc: "Modelli di governance, fonti di finanziamento start-up, equity e debito.",
                  },
                  {
                    num: 4,
                    title: "Il Bilancio d'Esercizio",
                    case: "Schemi OIC / IAS",
                    color: "border-blue-500",
                    desc: "Stato Patrimoniale, Conto Economico, competenza economica vs cassa.",
                  },
                  {
                    num: 5,
                    title: "Analisi per Indici & Cassa",
                    case: "Connecta, De Cecco",
                    color: "border-emerald-500",
                    desc: "ROE, ROI, leva finanziaria, CCN, paradosso Growth eats cash.",
                  },
                  {
                    num: 6,
                    title: "Costi e Break-Even",
                    case: "Break-Even Point",
                    color: "border-amber-500",
                    desc: "Costi fissi e variabili, margine di contribuzione, BEP in quantità e fatturato.",
                  },
                  {
                    num: 7,
                    title: "Business Model Canvas",
                    case: "All'Antico Vinaio",
                    color: "border-rose-500",
                    desc: "I 9 blocchi del canvas, value proposition, flussi di ricavo, canali.",
                  },
                ].map((b) => (
                  <div
                    key={b.num}
                    onClick={() => handleNavigateToStudy(b.num)}
                    className={`rounded-2xl border bg-white p-5 shadow-2xs hover:shadow-md transition cursor-pointer border-l-4 ${b.color}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        BLOCCO {b.num}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        Caso: {b.case}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-1">
                      {b.title}
                    </h4>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Exam Simulation Guidelines — Collapsible */}
            <CollapsibleSection
              title="Regole del Test Ufficiale EOA 2026"
              icon={<Award className="h-5 w-5 text-sky-600" />}
              defaultExpanded={false}
              className="mt-6"
            >
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-sky-600">•</span>
                  <span>
                    <strong>Sequenziale vincolante:</strong> si vede 1 quesito
                    alla volta e non è possibile tornare indietro.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-sky-600">•</span>
                  <span>
                    <strong>Vero/Falso multipli punitivi:</strong> il punto
                    viene assegnato solo se tutte le affermazioni del quesito
                    sono corrette.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-sky-600">•</span>
                  <span>
                    <strong>Inserimento numerico:</strong> calcolo esatto di
                    indici (ROE, ROI, CCN) e quantità di pareggio (BEP).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-sky-600">•</span>
                  <span>
                    <strong>Tempo assegnato con cronometro:</strong> prova
                    svolta in aula informatica o con notebook personale.
                  </span>
                </li>
              </ul>
            </CollapsibleSection>

            {/* Study Modes Panel — Flash Cards, Trappole, Track Selector — Collapsible */}
            <CollapsibleSection
              title="Modalità di Studio Avanzate"
              subtitle="Ripasso rapido, allenamento sulle trappole e filtro per percorso"
              icon={<Sparkles className="h-5 w-5 text-violet-600" />}
              defaultExpanded={false}
              className="mt-6"
            >
              {/* Track Selector Chips */}
              <div className="flex items-center justify-center gap-1.5 flex-wrap mb-5 pb-4 border-b border-slate-100">
                <Filter className="h-3.5 w-3.5 text-slate-400 mr-0.5" />
                {(
                  [
                    {
                      val: "all" as const,
                      label: "Tutti",
                      badge: "",
                      color: "slate",
                    },
                    {
                      val: "essential" as const,
                      label: "Essenziale",
                      badge: "◆",
                      color: "emerald",
                    },
                    {
                      val: "standard" as const,
                      label: "Standard",
                      badge: "■",
                      color: "sky",
                    },
                    {
                      val: "advanced" as const,
                      label: "Approfondito",
                      badge: "○",
                      color: "purple",
                    },
                  ] as const
                ).map((t) => {
                  const isActive = activeTrackFilter === t.val;
                  return (
                    <button
                      key={t.val}
                      onClick={() => setActiveTrackFilter(t.val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isActive
                          ? t.val === "all"
                            ? "bg-slate-800 text-white"
                            : t.val === "essential"
                              ? "bg-emerald-600 text-white"
                              : t.val === "standard"
                                ? "bg-sky-600 text-white"
                                : "bg-purple-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {t.badge ? `${t.badge} ` : ""}
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Flash Cards */}
                <button
                  onClick={handleStartFlashCards}
                  className="group rounded-2xl border border-violet-200 bg-violet-50/50 p-5 text-left hover:bg-violet-50 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 group-hover:bg-violet-200 transition">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">
                        🃏 Flash Cards
                      </h5>
                      <p className="text-xs text-slate-500">
                        Ripasso rapido fronte/retro
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Gira le card per rivedere concetti, formule e spiegazioni.
                    Nessun punteggio, nessun timer — puro ripasso veloce.
                  </p>
                </button>

                {/* Traps Quiz */}
                <button
                  onClick={handleStartTrapsQuiz}
                  className="group rounded-2xl border border-rose-200 bg-rose-50/50 p-5 text-left hover:bg-rose-50 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 group-hover:bg-rose-200 transition">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">
                        ⚠ Quiz Trappole
                      </h5>
                      <p className="text-xs text-slate-500">
                        20 quesiti sulle confusioni tipiche
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Allenati sui «Non Dare per Scontato»: le trappole
                    concettuali che fanno sbagliare all'esame.
                  </p>
                </button>
              </div>

              {activeTrackFilter !== "all" && (
                <div className="mt-4 flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>
                    Filtro attivo:{" "}
                    <strong className="text-slate-800">
                      {activeTrackFilter === "essential"
                        ? "◆ Essenziale"
                        : activeTrackFilter === "standard"
                          ? "■ Standard"
                          : "○ Approfondito"}
                    </strong>{" "}
                    — le sessioni quiz e flash cards useranno solo domande di
                    questo percorso (
                    {filterByTrack(allQuestions).length.toLocaleString()}{" "}
                    quesiti).
                  </span>
                </div>
              )}
            </CollapsibleSection>

            {/* Interactive Simulators Section */}
            <CollapsibleSection
              title="Strumenti Interattivi"
              subtitle="Simulatori dinamici per comprendere le relazioni tra variabili di bilancio"
              icon={<Zap className="h-5 w-5 text-purple-600" />}
              badge={
                <span className="hidden sm:inline text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  NUOVO
                </span>
              }
              defaultExpanded={false}
              className="mt-6"
            >
              <div className="grid grid-cols-1 gap-4">
                {/* DuPont Playground Card */}
                <button
                  onClick={() => navigateTo({ tab: "simulator" })}
                  className="group rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-5 text-left hover:shadow-lg hover:border-indigo-300 transition cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg group-hover:scale-105 transition shrink-0">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-bold text-slate-900">
                          DuPont Playground
                        </h5>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                          Interattivo
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed mb-3">
                        Modifica slider di bilancio (Fatturato, Costi, Debito,
                        Equity, Tasso d'interesse) e osserva in tempo reale
                        l'impatto su <strong>ROI</strong>, <strong>ROE</strong>{" "}
                        e lo <strong>spread (ROI − i)</strong>.
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 font-semibold">
                          Leva Finanziaria
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-sky-100 text-sky-700 font-semibold">
                          Modigliani-Miller
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-700 font-semibold">
                          Scenari Precaricati
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition shrink-0 mt-1" />
                  </div>
                </button>
              </div>
            </CollapsibleSection>
          </div>
        )}

        {/* STUDY TAB */}
        {activeTab === "study" && (
          <div>
            {/* Banner for returning to quiz review if coming from review */}
            {activeReviewSession && (
              <div className="bg-slate-900 text-white px-4 py-3 border-b border-sky-900/50 shadow-md">
                <div className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span>
                      Stai consultando la teoria durante la revisione del test (
                      <strong>
                        {activeReviewSession.mode === "exam-simulation"
                          ? "Simulazione d'Esame"
                          : "Pratica Libera"}
                      </strong>
                      ).
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigateTo({ tab: "quiz" });
                    }}
                    className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 px-3.5 py-1.5 font-bold text-slate-950 transition cursor-pointer shadow-xs text-xs"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Torna alla Revisione del Test</span>
                  </button>
                </div>
              </div>
            )}

            {/* Horizontal Block Selector Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-14 z-20 shadow-2xs">
              <div className="mx-auto max-w-5xl px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1 hidden md:inline">
                  Blocchi:
                </span>
                {[
                  { num: 1, label: "I. Impresa", name: "Impresa e Decisioni" },
                  { num: 2, label: "II. Forme", name: "Forme Giuridiche" },
                  {
                    num: 3,
                    label: "III. Governance",
                    name: "Governance & Finanziamento",
                  },
                  {
                    num: 4,
                    label: "IV. Bilancio",
                    name: "Bilancio d'Esercizio",
                  },
                  { num: 5, label: "V. Indici", name: "Indici & Cassa" },
                  { num: 6, label: "VI. Costi", name: "Costi & BEP" },
                  {
                    num: 7,
                    label: "VII. Canvas",
                    name: "Business Model Canvas",
                  },
                ].map((b) => {
                  const isActive = studyBlock?.block === b.num;
                  return (
                    <button
                      key={b.num}
                      onClick={() => handleNavigateToStudy(b.num)}
                      title={b.name}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        isActive
                          ? "bg-sky-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black ${
                          isActive
                            ? "bg-white text-sky-700"
                            : "bg-slate-300 text-slate-800"
                        }`}
                      >
                        {b.num}
                      </span>
                      <span>{b.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {studyBlock ? (
              <StudyBlockViewer
                block={studyBlock}
                targetTopicId={targetTopicId}
                onStartBlockQuiz={() =>
                  handleStartTopicQuiz(studyBlock.block, "")
                }
                onStartTopicQuiz={handleStartTopicQuiz}
              />
            ) : (
              <div className="text-center py-20 text-slate-500">
                Caricamento contenuti di studio...
              </div>
            )}
          </div>
        )}

        {/* FORMULARIO TAB */}
        {activeTab === "formula" && (
          <FormulaCheatsheetView
            onPracticeFormula={handlePracticeFormula}
            onOpenStudy={handleOpenStudyFromFormula}
          />
        )}

        {/* QUIZ TAB */}
        {activeTab === "quiz" && (
          <div>
            {quizMode === "flash-cards" ? (
              <FlashCardRunner
                key={quizRunnerKey}
                questions={filterByTrack(allQuestions)}
                formulas={formulasData}
                onExit={() => navigateTo({ tab: "dashboard" })}
              />
            ) : activeQuestions.length > 0 ? (
              <QuizRunner
                key={quizRunnerKey}
                questions={activeQuestions}
                mode={quizMode}
                initialSession={activeReviewSession || undefined}
                timeLimitSeconds={15 * 60} // 15 mins for the demo
                onFinish={handleQuizFinish}
                onExit={() => navigateTo({ tab: "dashboard" })}
                onNavigateToStudy={handleNavigateToStudyFromReview}
                onViewStats={() => navigateTo({ tab: "stats" })}
              />
            ) : (
              <div className="text-center py-20 text-slate-500">
                Caricamento quesiti...
              </div>
            )}
          </div>
        )}

        {/* STATS & HISTORY TAB */}
        {activeTab === "stats" && (
          <StatsHistoryView
            history={quizHistory}
            onRefreshHistory={() => setQuizHistory(getQuizHistory())}
            onReviewPastSession={handleReviewPastSession}
            onStartExam={handleStartFullExam}
            onNavigateToStudy={(b) => handleNavigateToStudy(b)}
          />
        )}

        {/* SIMULATOR TAB */}
        {activeTab === "simulator" && (
          <div className="mx-auto max-w-5xl py-8 px-4 sm:px-6">
            <DuPontPlayground />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            EOA Exam Trainer 2026 • C.d.S. Ingegneria Informatica, Università di
            Pisa
          </span>
          <span className="font-mono text-slate-400">
            Offline-first • Architettura pre-generata su disco
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
