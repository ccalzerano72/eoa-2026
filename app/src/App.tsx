import { useState, useEffect } from "react";
import type { Question } from "./types/question";
import type { StudyBlock } from "./types/study";
import { QuizRunner } from "./components/quiz/QuizRunner";
import { StudyBlockViewer } from "./components/study/StudyBlockViewer";
import {
  GraduationCap,
  BookOpen,
  PlayCircle,
  Sparkles,
  Award,
} from "lucide-react";

type NavTab = "dashboard" | "study" | "quiz" | "generator";

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [studyBlock, setStudyBlock] = useState<StudyBlock | null>(null);
  const [quizMode, setQuizMode] = useState<"exam-simulation" | "free-practice">(
    "exam-simulation",
  );

  // Load sample questions and study unit from public data
  useEffect(() => {
    fetch("/data/questions/sample.json")
      .then((res) => res.json())
      .then((data: Question[]) => setQuestions(data))
      .catch((err) => console.error("Failed to load sample questions:", err));

    fetch("/data/theory/blocco-1.json")
      .then((res) => res.json())
      .then((data: StudyBlock) => setStudyBlock(data))
      .catch((err) => console.error("Failed to load sample theory:", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-sky-600 uppercase tracking-wider">
                  EOA 2026
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-sky-50 text-sky-800 font-semibold border border-sky-200/60">
                  Ing. Informatica • UniPi
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-950 leading-tight">
                Exam Trainer & Simulator
              </h1>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                activeTab === "dashboard"
                  ? "bg-sky-50 text-sky-700 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("study")}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === "study"
                  ? "bg-sky-50 text-sky-700 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Studio</span>
            </button>
            <button
              onClick={() => {
                setQuizMode("exam-simulation");
                setActiveTab("quiz");
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-2xs ${
                activeTab === "quiz"
                  ? "bg-sky-600 text-white"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              <PlayCircle className="h-4 w-4" />
              <span>Simula Esame</span>
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

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setQuizMode("exam-simulation");
                    setActiveTab("quiz");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3 font-bold text-sm text-slate-950 shadow-md transition cursor-pointer"
                >
                  <PlayCircle className="h-5 w-5" />
                  <span>Avvia Simulazione Esame (Sequenziale)</span>
                </button>
                <button
                  onClick={() => setActiveTab("study")}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 font-bold text-sm text-white transition cursor-pointer"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Esplora Materiale di Studio</span>
                </button>
              </div>
            </div>

            {/* Syllabus 7 Blocks Grid */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    I 7 Blocchi del Programma Didattico
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Struttura conforme al percorso EOA 2026 per Ingegneria
                    Informatica
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  7 Blocchi • 46 Documenti
                </span>
              </div>

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
                    onClick={() => setActiveTab("study")}
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
            </div>

            {/* Exam Simulation Guidelines */}
            <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2.5 font-bold text-slate-900 mb-3">
                <Award className="h-5 w-5 text-sky-600" />
                <h4>Regole del Test Ufficiale EOA 2026</h4>
              </div>
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
            </div>
          </div>
        )}

        {/* STUDY TAB */}
        {activeTab === "study" && (
          <div>
            {studyBlock ? (
              <StudyBlockViewer
                block={studyBlock}
                onStartBlockQuiz={() => {
                  setQuizMode("exam-simulation");
                  setActiveTab("quiz");
                }}
              />
            ) : (
              <div className="text-center py-20 text-slate-500">
                Caricamento contenuti di studio...
              </div>
            )}
          </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === "quiz" && (
          <div>
            {questions.length > 0 ? (
              <QuizRunner
                questions={questions}
                mode={quizMode}
                timeLimitSeconds={15 * 60} // 15 mins for the 6-question demo
                onExit={() => setActiveTab("dashboard")}
              />
            ) : (
              <div className="text-center py-20 text-slate-500">
                Caricamento quesiti...
              </div>
            )}
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
