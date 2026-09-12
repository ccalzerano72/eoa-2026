import { useState, useMemo, useCallback, useEffect } from "react";
import type { Question, SyllabusBlock } from "../../types/question";
import type { FormulaItem } from "../../data/formulas";
import { FormulaBlock } from "../ui/FormulaBlock";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Layers,
  BookOpen,
  Calculator,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";

/** A unified flash‑card item derived from either a Question or a FormulaItem. */
interface FlashCard {
  id: string;
  block: SyllabusBlock;
  front: string; // keypoint / stem
  formulaKaTeX?: string;
  back: {
    why: string;
    what: string;
    how: string;
    trap?: string;
  };
  source: "question" | "formula";
  topic: string;
}

interface FlashCardRunnerProps {
  questions: Question[];
  formulas: FormulaItem[];
  onExit?: () => void;
}

function questionToCard(q: Question): FlashCard {
  return {
    id: `fc-q-${q.id}`,
    block: q.block,
    front: q.stem,
    formulaKaTeX: q.formula,
    back: {
      why: q.explanation.why,
      what: q.explanation.what,
      how: q.explanation.how,
      trap: q.explanation.trap,
    },
    source: "question",
    topic: q.topic,
  };
}

function formulaToCard(f: FormulaItem): FlashCard {
  return {
    id: `fc-f-${f.id}`,
    block: f.block as SyllabusBlock,
    front: f.name,
    formulaKaTeX: f.formulaKaTeX,
    back: {
      why: f.why,
      what: f.what,
      how: f.how,
      trap: f.trap,
    },
    source: "formula",
    topic: f.topic,
  };
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const FlashCardRunner: React.FC<FlashCardRunnerProps> = ({
  questions,
  formulas,
  onExit,
}) => {
  type SourceFilter = "all" | "questions" | "formulas";

  const [blockFilter, setBlockFilter] = useState<SyllabusBlock | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0); // bump to re-shuffle

  // Build the card deck from filtered sources
  const deck: FlashCard[] = useMemo(() => {
    let qCards: FlashCard[] = [];
    let fCards: FlashCard[] = [];

    if (sourceFilter !== "formulas") {
      let filteredQ = questions;
      if (blockFilter !== "all") {
        filteredQ = filteredQ.filter((q) => q.block === blockFilter);
      }
      // Sample up to 60 questions to keep the deck manageable
      const shuffled = shuffleArray(filteredQ);
      qCards = shuffled.slice(0, 60).map(questionToCard);
    }

    if (sourceFilter !== "questions") {
      let filteredF = formulas;
      if (blockFilter !== "all") {
        filteredF = filteredF.filter(
          (f) => (f.block as SyllabusBlock) === blockFilter,
        );
      }
      fCards = filteredF.map(formulaToCard);
    }

    return shuffleArray([...qCards, ...fCards]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, formulas, blockFilter, sourceFilter, shuffleKey]);

  // Reset index when deck changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [deck]);

  const card = deck[currentIndex] ?? null;

  const goNext = useCallback(() => {
    if (currentIndex < deck.length - 1) {
      // Scroll to top when moving to next card
      window.scrollTo({ top: 0, behavior: "instant" });
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, deck.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      // Scroll to top when moving to previous card
      window.scrollTo({ top: 0, behavior: "instant" });
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleReshuffle = () => {
    setShuffleKey((k) => k + 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        if (isFlipped) goNext();
        else setIsFlipped(true);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (!isFlipped) goPrev();
        else setIsFlipped(false);
      } else if (e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFlipped, goNext, goPrev]);

  if (deck.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-20 px-4 text-center text-slate-500 dark:text-slate-400">
        <Layers className="h-10 w-10 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          Nessuna flash card disponibile con i filtri selezionati.
        </p>
        <p className="text-sm mt-1">
          Prova a selezionare un blocco diverso o cambiare la sorgente.
        </p>
        {onExit && (
          <button
            onClick={onExit}
            className="mt-6 rounded-xl border border-slate-300 dark:border-slate-600 px-5 py-2.5 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            Torna al Menu
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8 px-4 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Flash Cards
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Ripasso rapido • Premi Spazio per girare, ← → per navigare
            </p>
          </div>
        </div>
        {onExit && (
          <button
            onClick={onExit}
            className="rounded-xl border border-slate-300 dark:border-slate-600 px-3 sm:px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer shrink-0"
          >
            Esci
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-2">
        {/* Block filter row */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1 shrink-0">
            Blocco:
          </span>
          {(
            [
              { val: "all" as const, label: "Tutti" },
              { val: 1 as const, label: "I" },
              { val: 2 as const, label: "II" },
              { val: 3 as const, label: "III" },
              { val: 4 as const, label: "IV" },
              { val: 5 as const, label: "V" },
              { val: 6 as const, label: "VI" },
              { val: 7 as const, label: "VII" },
            ] as const
          ).map((b) => (
            <button
              key={b.val}
              onClick={() => setBlockFilter(b.val)}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                blockFilter === b.val
                  ? "bg-violet-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Source filter row */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setSourceFilter("all")}
            className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              sourceFilter === "all"
                ? "bg-violet-600 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            Tutto
          </button>
          <button
            onClick={() => setSourceFilter("questions")}
            className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              sourceFilter === "questions"
                ? "bg-sky-600 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            <BookOpen className="h-3 w-3" />{" "}
            <span className="hidden sm:inline">Domande</span>
          </button>
          <button
            onClick={() => setSourceFilter("formulas")}
            className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
              sourceFilter === "formulas"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            <Calculator className="h-3 w-3" />{" "}
            <span className="hidden sm:inline">Formule</span>
          </button>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-600 mx-1 shrink-0 hidden sm:block" />

          <button
            onClick={handleReshuffle}
            className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/70 transition cursor-pointer shrink-0"
          >
            <Shuffle className="h-3 w-3" />{" "}
            <span className="hidden sm:inline">Mescola</span>
          </button>
        </div>
      </div>

      {/* Card */}
      {card && (
        <div
          onClick={() => setIsFlipped((f) => !f)}
          className={`relative min-h-[340px] rounded-3xl border-2 bg-white dark:bg-slate-800 shadow-md transition-all duration-300 cursor-pointer select-none hover:shadow-lg overflow-hidden ${
            isFlipped
              ? "border-violet-500 dark:border-violet-400"
              : "border-slate-200 dark:border-slate-600"
          }`}
        >
          {/* Top badge bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-5 pt-4 z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 font-mono">
                Blocco {card.block}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  card.source === "formula"
                    ? "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700"
                    : "bg-sky-50 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-700"
                }`}
              >
                {card.source === "formula" ? "Formula" : "Concetto"}
              </span>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono font-semibold shrink-0">
              {currentIndex + 1} / {deck.length}
            </span>
          </div>

          {/* FRONT */}
          {!isFlipped && (
            <div className="flex flex-col items-center justify-center px-4 sm:px-8 pt-16 pb-12 min-h-[340px]">
              <div className="mb-4">
                <Eye className="h-5 w-5 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-center text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug whitespace-pre-line break-words max-w-full">
                {card.front}
              </p>
              {card.formulaKaTeX && (
                <div className="mt-5 max-w-full overflow-x-auto">
                  <FormulaBlock formula={card.formulaKaTeX} />
                </div>
              )}
              <p className="mt-6 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Tocca o premi Spazio per rivelare la risposta →
              </p>
            </div>
          )}

          {/* BACK */}
          {isFlipped && (
            <div className="px-4 sm:px-8 pt-14 pb-8 min-h-[340px] overflow-x-hidden">
              <div className="flex items-center gap-2 mb-4">
                <EyeOff className="h-4 w-4 text-violet-500 dark:text-violet-400 shrink-0" />
                <span className="text-xs font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider">
                  Spiegazione (Regola d'Oro)
                </span>
              </div>

              {card.formulaKaTeX && (
                <div className="mb-4 max-w-full overflow-x-auto">
                  <FormulaBlock formula={card.formulaKaTeX} />
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="break-words">
                  <span className="font-semibold text-sky-800 dark:text-sky-400">
                    Perché:{" "}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {card.back.why}
                  </span>
                </div>
                <div className="break-words">
                  <span className="font-semibold text-sky-800 dark:text-sky-400">
                    Cosa:{" "}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {card.back.what}
                  </span>
                </div>
                <div className="break-words overflow-x-auto">
                  <span className="font-semibold text-sky-800 dark:text-sky-400">
                    Come:{" "}
                  </span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono text-xs">
                    {card.back.how}
                  </span>
                </div>
                {card.back.trap && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100 text-xs break-words">
                    <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-800 dark:text-rose-300">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>Trappola d'Esame:</span>
                    </div>
                    {card.back.trap}
                  </div>
                )}
              </div>

              <p className="mt-5 text-xs text-slate-400 dark:text-slate-500 font-medium text-center">
                ← Tocca per tornare al fronte • → per la prossima card
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 gap-2">
        <button
          disabled={currentIndex === 0}
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-xl px-3 sm:px-5 py-2.5 font-semibold text-sm transition ${
            currentIndex === 0
              ? "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
              : "bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer shadow-xs"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Precedente</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            window.scrollTo({ top: 0, behavior: "instant" });
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl px-3 sm:px-4 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Ricomincia</span>
        </button>

        <button
          disabled={currentIndex >= deck.length - 1}
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-xl px-3 sm:px-5 py-2.5 font-semibold text-sm transition ${
            currentIndex >= deck.length - 1
              ? "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
              : "bg-violet-600 text-white hover:bg-violet-700 cursor-pointer shadow-sm"
          }`}
        >
          <span className="hidden sm:inline">Prossima</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
        <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
          ←
        </span>{" "}
        Indietro •{" "}
        <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
          Spazio
        </span>{" "}
        Gira •{" "}
        <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
          →
        </span>{" "}
        Avanti •{" "}
        <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
          Invio
        </span>{" "}
        Flip
      </div>
    </div>
  );
};
