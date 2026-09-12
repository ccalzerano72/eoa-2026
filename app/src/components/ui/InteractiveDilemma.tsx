import { useState } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  History,
  Lightbulb,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { CaseStudy } from "../../types/study";

interface InteractiveDilemmaProps {
  caseStudy: CaseStudy;
  onComplete?: () => void;
}

type DilemmaState = "intro" | "choosing" | "revealed";

export function InteractiveDilemma({
  caseStudy,
  onComplete,
}: InteractiveDilemmaProps) {
  const [state, setState] = useState<DilemmaState>("intro");
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const dilemma = caseStudy.interactiveDilemma;

  if (!dilemma) {
    return null;
  }

  const selectedChoice = dilemma.choices.find((c) => c.id === selectedChoiceId);
  const historicalChoice = dilemma.choices.find((c) => c.isHistorical);
  const userChoseCorrectly = selectedChoice?.isHistorical === true;

  const handleSelectChoice = (choiceId: string) => {
    setSelectedChoiceId(choiceId);
  };

  const handleReveal = () => {
    setState("revealed");
    onComplete?.();
  };

  const handleReset = () => {
    setState("intro");
    setSelectedChoiceId(null);
  };

  const handleStartChoosing = () => {
    setState("choosing");
  };

  return (
    <div className="my-6 rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-100">
              Dilemma Decisionale Interattivo
            </span>
            <h3 className="text-sm font-bold text-white leading-tight">
              {caseStudy.company} — Tu Cosa Avresti Fatto?
            </h3>
          </div>
        </div>
        {state === "revealed" && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Riprova
          </button>
        )}
      </div>

      <div className="p-5">
        {/* INTRO STATE */}
        {state === "intro" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-white/80 border border-amber-200 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 text-sm mb-1">
                    Contesto della Decisione
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {dilemma.context}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartChoosing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3.5 px-5 shadow-md hover:shadow-lg transition text-sm"
            >
              <span>Affronta il Dilemma</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* CHOOSING STATE */}
        {state === "choosing" && (
          <div className="space-y-4">
            {/* Question */}
            <div className="rounded-xl bg-slate-900 text-white p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-slate-900">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    La Domanda Decisionale
                  </span>
                  <p className="text-base font-semibold leading-relaxed mt-1">
                    {dilemma.question}
                  </p>
                </div>
              </div>
            </div>

            {/* Choices */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Scegli la tua risposta:
              </span>
              {dilemma.choices.map((choice) => {
                const isSelected = selectedChoiceId === choice.id;
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice.id)}
                    className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                      isSelected
                        ? "border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-200"
                        : "border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 mt-0.5 transition ${
                          isSelected
                            ? "border-amber-500 bg-amber-500"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">
                          {choice.label}
                        </h5>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {choice.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reveal Button */}
            <button
              onClick={handleReveal}
              disabled={!selectedChoiceId}
              className={`w-full flex items-center justify-center gap-2 rounded-xl font-bold py-3.5 px-5 shadow-md transition text-sm ${
                selectedChoiceId
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-lg cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <History className="h-4 w-4" />
              <span>Scopri Cosa Fecero Davvero</span>
            </button>
          </div>
        )}

        {/* REVEALED STATE */}
        {state === "revealed" && selectedChoice && (
          <div className="space-y-4">
            {/* User's Choice Result */}
            <div
              className={`rounded-xl border-2 p-4 ${
                userChoseCorrectly
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-rose-300 bg-rose-50"
              }`}
            >
              <div className="flex items-start gap-3">
                {userChoseCorrectly ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4
                    className={`font-bold text-sm ${
                      userChoseCorrectly ? "text-emerald-800" : "text-rose-800"
                    }`}
                  >
                    {userChoseCorrectly
                      ? "Hai scelto come loro!"
                      : "Non è quello che fecero..."}
                  </h4>
                  <p
                    className={`text-xs mt-1 ${
                      userChoseCorrectly ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    La tua scelta: <strong>{selectedChoice.label}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Historical Choice */}
            <div className="rounded-xl bg-slate-900 text-white p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-slate-900">
                  <History className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    La Scelta Storica di {caseStudy.company}
                  </span>
                  <p className="text-sm font-semibold mt-1">
                    {historicalChoice?.label}
                  </p>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {historicalChoice?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Historical Outcome */}
            <div className="rounded-xl bg-white border border-slate-200 p-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                  <ChevronRight className="h-3 w-3" />
                </span>
                Cosa Successe Dopo
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {dilemma.historicalOutcome}
              </p>
            </div>

            {/* Lesson Learned */}
            <div className="rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">
                    La Lezione per l'Ingegnere Gestionale
                  </h4>
                  <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                    {dilemma.lessonLearned}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
