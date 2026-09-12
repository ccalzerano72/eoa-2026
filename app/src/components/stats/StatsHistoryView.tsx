import React, { useState, useMemo } from "react";
import type { QuizHistoryRecord } from "../../types/quiz";
import type { SyllabusBlock } from "../../types/question";
import {
  computeOverallStats,
  deleteQuizRecord,
  clearQuizHistory,
} from "../../services/storage";
import {
  Award,
  Clock,
  CheckCircle2,
  TrendingUp,
  Trash2,
  BookOpen,
  PlayCircle,
  AlertTriangle,
  FileSpreadsheet,
  ChevronRight,
} from "lucide-react";

interface StatsHistoryViewProps {
  history: QuizHistoryRecord[];
  onRefreshHistory: () => void;
  onReviewPastSession: (record: QuizHistoryRecord) => void;
  onStartExam: () => void;
  onNavigateToStudy: (block: SyllabusBlock) => void;
}

const BLOCK_NAMES: Record<SyllabusBlock, { title: string; subtitle: string }> =
  {
    1: {
      title: "L'Impresa come Sistema",
      subtitle: "Complicato vs Complesso, Olivetti P101, razionalità limitata",
    },
    2: {
      title: "Le Forme Giuridiche",
      subtitle: "Ditte individuali, SNC, SRL, SPA, responsabilità",
    },
    3: {
      title: "Governance e Finanziamento",
      subtitle: "Modelli di governance, equity vs debito, venture capital",
    },
    4: {
      title: "Il Bilancio d'Esercizio",
      subtitle: "Stato Patrimoniale, Conto Economico, competenza vs cassa",
    },
    5: {
      title: "Analisi per Indici & Cassa",
      subtitle: "ROE, ROI, Leva Finanziaria, CCN, Growth eats cash",
    },
    6: {
      title: "Costi e Break-Even",
      subtitle: "Costi fissi/variabili, margine di contribuzione, BEP",
    },
    7: {
      title: "Business Model Canvas",
      subtitle: "I 9 blocchi, value proposition, flussi di ricavo",
    },
  };

export const StatsHistoryView: React.FC<StatsHistoryViewProps> = ({
  history,
  onRefreshHistory,
  onReviewPastSession,
  onStartExam,
  onNavigateToStudy,
}) => {
  const [filterMode, setFilterMode] = useState<
    "all" | "exam-simulation" | "free-practice"
  >("all");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const stats = useMemo(() => computeOverallStats(history), [history]);

  const filteredHistory = useMemo(() => {
    if (filterMode === "all") return history;
    return history.filter((r) => r.mode === filterMode);
  }, [history, filterMode]);

  const formatDuration = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteQuizRecord(id);
    onRefreshHistory();
  };

  const handleClearAll = () => {
    clearQuizHistory();
    onRefreshHistory();
    setShowClearConfirm(false);
  };

  return (
    <div className="mx-auto max-w-5xl py-8 px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Tracciamento Permanente Locale</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Storico Prove & Statistiche di Preparazione
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Analizza l'andamento delle simulazioni d'esame e identifica i
            blocchi da potenziare.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onStartExam}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition cursor-pointer"
          >
            <PlayCircle className="h-4 w-4" />
            <span>Nuova Simulazione</span>
          </button>
          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Azzera archivio storico"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Azzera Storico</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Clearing History */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertTriangle className="h-6 w-6" />
              <h4 className="font-bold text-base text-slate-900">
                Sei sicuro di voler azzerare?
              </h4>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm mb-6">
              Verranno eliminate tutte le {history.length} prove e le relative
              statistiche memorizzate nel browser. L'azione non è reversibile.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Annulla
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-xs transition cursor-pointer"
              >
                Sì, elimina tutto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Simulazioni */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Simulazioni Esame
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.examSimulationsCount}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {stats.passedSimulationsCount} superate ({stats.passRatePercentage}
            %)
          </p>
        </div>

        {/* Card 2: Media Voti */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Media Voti
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-2xl sm:text-3xl font-black ${stats.averageScaledGrade30 >= 18 ? "text-emerald-600" : stats.examSimulationsCount > 0 ? "text-rose-600" : "text-slate-900"}`}
            >
              {stats.examSimulationsCount > 0
                ? stats.averageScaledGrade30
                : "—"}
            </span>
            {stats.examSimulationsCount > 0 && (
              <span className="text-sm font-semibold text-slate-400">/ 30</span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Miglior voto:{" "}
            <strong>
              {stats.bestScaledGrade30 > 0
                ? `${stats.bestScaledGrade30}/30`
                : "—"}
            </strong>
          </p>
        </div>

        {/* Card 3: Domande Risposte */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Quesiti Risolti
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.totalQuestionsAnswered}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Corrette: {stats.totalCorrectAnswers} (
            {stats.totalQuestionsAnswered > 0
              ? Math.round(
                  (stats.totalCorrectAnswers / stats.totalQuestionsAnswered) *
                    100,
                )
              : 0}
            %)
          </p>
        </div>

        {/* Card 4: Tempo Totale */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Tempo Dedicato
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatDuration(stats.totalTimeSeconds)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {stats.totalSessions} sessioni complessive
          </p>
        </div>
      </div>

      {/* Block-by-Block Mastery Radar / Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Padronanza per Blocco del Programma
            </h3>
            <p className="text-xs text-slate-500">
              Percentuale di risposte corrette ottenute nei quesiti dei 7
              blocchi didattici
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 self-start sm:self-auto">
            7 Blocchi Syllabus EOA 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((bNum) => {
            const blk = bNum as SyllabusBlock;
            const bStats = stats.blockStats[blk];
            const info = BLOCK_NAMES[blk];
            const hasData = bStats.totalQuestions > 0;
            const acc = bStats.accuracyPercentage;

            let colorClass = "bg-slate-200";
            let textColor = "text-slate-500";
            if (hasData) {
              if (acc >= 75) {
                colorClass = "bg-emerald-500";
                textColor = "text-emerald-700";
              } else if (acc >= 50) {
                colorClass = "bg-amber-500";
                textColor = "text-amber-700";
              } else {
                colorClass = "bg-rose-500";
                textColor = "text-rose-700";
              }
            }

            return (
              <div
                key={blk}
                className="rounded-xl border border-slate-100 p-3.5 bg-slate-50/50 flex flex-col justify-between hover:bg-slate-50 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        B{blk}
                      </span>
                      <span className="font-bold text-sm text-slate-900">
                        {info.title}
                      </span>
                    </div>
                    <span className={`text-xs font-bold ${textColor}`}>
                      {hasData ? `${acc}%` : "Non testato"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                    {info.subtitle}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full ${colorClass} transition-all duration-500`}
                      style={{ width: `${hasData ? Math.max(acc, 5) : 0}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-500">
                      {hasData
                        ? `${bStats.correctQuestions} / ${bStats.totalQuestions} quesiti corretti`
                        : "0 quesiti affrontati"}
                    </span>
                    <button
                      onClick={() => onNavigateToStudy(blk)}
                      className="inline-flex items-center gap-1 font-semibold text-sky-600 hover:text-sky-800 transition cursor-pointer"
                    >
                      <span>Ripassa lezione</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Table & Sessions List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Registro delle Prove Svolte
            </h3>
            <p className="text-xs text-slate-500">
              Clicca su "Rivedi Prova" per consultare ogni singola risposta e le
              relative spiegazioni
            </p>
          </div>

          {/* Filter tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === "all"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tutte ({history.length})
            </button>
            <button
              onClick={() => setFilterMode("exam-simulation")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === "exam-simulation"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Simulazioni ({stats.examSimulationsCount})
            </button>
            <button
              onClick={() => setFilterMode("free-practice")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === "free-practice"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pratica ({stats.freePracticeCount})
            </button>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <FileSpreadsheet className="h-10 w-10 text-slate-400 mx-auto mb-3 opacity-60" />
            <h4 className="font-bold text-slate-800 text-sm mb-1">
              Nessuna prova presente
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Non hai ancora completato test in questa categoria. Le tue prove
              verranno salvate automaticamente al termine di ciascun quiz.
            </p>
            <button
              onClick={onStartExam}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer shadow-xs"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Avvia la tua prima Simulazione</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((rec) => {
              const { summary, mode, formattedDate } = rec;
              const isExam = mode === "exam-simulation";

              return (
                <div
                  key={rec.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Outcome Badge */}
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-mono text-base font-black ${
                        summary.isPassed
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {summary.scaledGrade30}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            isExam
                              ? "bg-sky-100 text-sky-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {isExam ? "Simulazione Esame" : "Pratica Libera"}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            summary.isPassed
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {summary.isPassed
                            ? "Superato (≥ 18)"
                            : "Non Superato (< 18)"}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {formattedDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span>
                          Punteggio: <strong>{summary.correctCount}</strong> /{" "}
                          {summary.totalQuestions} (
                          {Math.round(
                            (summary.correctCount / summary.totalQuestions) *
                              100,
                          )}
                          %)
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {formatDuration(summary.timeTakenSeconds)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onReviewPastSession(rec)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200/80 px-4 py-2 text-xs font-bold text-sky-700 hover:text-sky-900 transition cursor-pointer shadow-2xs"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Rivedi Prova</span>
                    </button>
                    <button
                      onClick={(e) => handleDelete(rec.id, e)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Elimina singola sessione"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
