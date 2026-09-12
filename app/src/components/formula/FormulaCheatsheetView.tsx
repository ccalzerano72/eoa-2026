import React, { useState, useMemo, useRef, useEffect } from "react";
import { formulasData, type FormulaItem } from "../../data/formulas";
import { FormulaBlock } from "../ui/FormulaBlock";
import {
  Search,
  BookOpen,
  PlayCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Calculator,
  Compass,
} from "lucide-react";

interface FormulaCheatsheetViewProps {
  onPracticeFormula: (formula: FormulaItem) => void;
  onOpenStudy: (blockNumber: number, topicId?: string) => void;
}

const BLOCK_NAMES: Record<number, string> = {
  1: "Blocco I: Introduzione & Paradigmi",
  2: "Blocco II: Strategia & Vantaggio",
  3: "Blocco III: Organizzazione & Governance",
  4: "Blocco IV: Bilancio & Contabilità",
  5: "Blocco V: Analisi per Indici",
  6: "Blocco VI: Decisioni Breve & BEP",
  7: "Blocco VII: Modelli di Business & Finanza",
};

export const FormulaCheatsheetView: React.FC<FormulaCheatsheetViewProps> = ({
  onPracticeFormula,
  onOpenStudy,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<number | "all">("all");
  const [expandedFormulaId, setExpandedFormulaId] = useState<string | null>(
    null,
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Ref for scrolling to expanded formula explanation
  const expandedSectionRef = useRef<HTMLDivElement | null>(null);

  // Scroll to expanded section when a formula is expanded
  useEffect(() => {
    if (expandedFormulaId && expandedSectionRef.current) {
      expandedSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [expandedFormulaId]);

  // Filtered formulas
  const filteredFormulas = useMemo(() => {
    return formulasData.filter((item) => {
      const matchBlock =
        selectedBlock === "all" || item.block === selectedBlock;
      if (!matchBlock) return false;

      if (!searchTerm.trim()) return true;
      const lower = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.topic.toLowerCase().includes(lower) ||
        item.tags.some((t) => t.toLowerCase().includes(lower)) ||
        item.formulaKaTeX.toLowerCase().includes(lower) ||
        item.variables.some(
          (v) =>
            v.symbol.toLowerCase().includes(lower) ||
            v.meaning.toLowerCase().includes(lower),
        )
      );
    });
  }, [searchTerm, selectedBlock]);

  const handleCopyKaTeX = (id: string, katex: string) => {
    navigator.clipboard.writeText(katex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedFormulaId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-blue-200/80 dark:border-blue-800 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-slate-900/40 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider mb-1">
              <Calculator className="h-4 w-4" />
              <span>Formulario Ufficiale Didattico</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Formule e Modelli Quantitativi EOA 2026
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Tutte le formule matematiche del corso organizzate secondo la{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                Golden Rule
              </strong>{" "}
              (PERCHÉ, COSA, COME). Clicca su ciascuna scheda per esplorare le
              variabili, verificare le trappole concettuali o avviare un quiz
              mirato.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs border border-blue-100 dark:border-blue-800 rounded-xl px-4 py-3 shadow-2xs">
            <div className="text-center border-r border-slate-200 dark:border-slate-700 pr-3">
              <span className="block text-xl font-bold text-blue-700 dark:text-blue-400">
                {formulasData.length}
              </span>
              <span className="text-2xs text-slate-500 dark:text-slate-400 font-medium uppercase">
                Formule
              </span>
            </div>
            <div className="text-center pl-1">
              <span className="block text-xl font-bold text-indigo-700 dark:text-indigo-400">
                7
              </span>
              <span className="text-2xs text-slate-500 dark:text-slate-400 font-medium uppercase">
                Blocchi
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Cerca formula per nome, simbolo, KaTeX, argomento (es. ROE, BEP, Leva, WACC, Make or Buy, Diluizione)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-xs focus:border-blue-500 dark:focus:border-blue-400 focus:outline-hidden focus:ring-3 focus:ring-blue-100 dark:focus:ring-blue-900 text-sm md:text-base transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md"
            >
              Cancella
            </button>
          )}
        </div>

        {/* Block Filter Chips */}
        <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-blue-100/60 dark:border-blue-800/60">
          <button
            onClick={() => setSelectedBlock("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              selectedBlock === "all"
                ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
            }`}
          >
            Tutti i Blocchi ({formulasData.length})
          </button>
          {[1, 2, 3, 4, 5, 6, 7].map((b) => {
            const count = formulasData.filter((f) => f.block === b).length;
            return (
              <button
                key={b}
                onClick={() => setSelectedBlock(b as number)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedBlock === b
                    ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                    : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
                }`}
              >
                B{b} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulas List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
          <span>
            Visualizzazione di {filteredFormulas.length} formule
            {selectedBlock !== "all" ? ` nel Blocco ${selectedBlock}` : ""}
          </span>
          {searchTerm && <span>Filtro attivo: «{searchTerm}»</span>}
        </div>

        {filteredFormulas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-12 text-center bg-slate-50/50 dark:bg-slate-800/50">
            <Compass className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-base font-medium text-slate-700 dark:text-slate-300">
              Nessuna formula trovata per la ricerca corrente.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Prova a cercare con un altro termine o a selezionare "Tutti i
              Blocchi".
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedBlock("all");
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reimposta filtri
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredFormulas.map((item) => {
              const isExpanded = expandedFormulaId === item.id;
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Card Top bar */}
                  <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-700">
                          {BLOCK_NAMES[item.block] || `Blocco ${item.block}`}
                        </span>
                        <span className="text-2xs font-mono uppercase bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                          {item.topic}
                        </span>
                      </div>

                      {item.unit && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-600">
                          Unità:{" "}
                          <strong className="text-slate-700 dark:text-slate-200">
                            {item.unit}
                          </strong>
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                      {item.name}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {item.description}
                    </p>

                    {/* Formula Display */}
                    <div className="relative mt-4 bg-gradient-to-b from-slate-50 to-blue-50/20 dark:from-slate-700/50 dark:to-blue-900/20 rounded-xl p-4 border border-blue-100/60 dark:border-blue-800/60">
                      <FormulaBlock formula={item.formulaKaTeX} />
                      <button
                        onClick={() =>
                          handleCopyKaTeX(item.id, item.formulaKaTeX)
                        }
                        title="Copia codice KaTeX"
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-600 shadow-2xs transition-colors"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Variables Table */}
                    <div className="mt-4">
                      <div className="text-2xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-2">
                        Variabili e Parametri
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {item.variables.map((v, i) => (
                          <div
                            key={i}
                            className="bg-slate-50/70 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 rounded-lg p-2.5 text-xs"
                          >
                            <span className="font-mono font-semibold text-blue-800 dark:text-blue-300 mr-1.5">
                              {v.symbol}
                            </span>
                            <span className="text-slate-600 dark:text-slate-400">
                              {v.meaning}
                            </span>
                            {v.unit && (
                              <span className="block text-2xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                                [{v.unit}]
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Golden Rule Section */}
                  {isExpanded && (
                    <div
                      ref={expandedSectionRef}
                      className="p-5 md:p-6 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 space-y-4 animate-in fade-in-50 duration-200 text-xs md:text-sm scroll-mt-24"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                          <span className="inline-block text-2xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-1">
                            1. PERCHÉ (Decisione)
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {item.why}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                          <span className="inline-block text-2xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-1">
                            2. COSA (Concetto)
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {item.what}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                          <span className="inline-block text-2xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                            3. COME (Calcolo)
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {item.how}
                          </p>
                        </div>
                      </div>

                      {item.trap && (
                        <div className="flex items-start gap-2.5 bg-rose-50 dark:bg-rose-900/30 border border-rose-200/70 dark:border-rose-800 p-3.5 rounded-lg text-rose-900 dark:text-rose-100">
                          <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-2xs uppercase tracking-wider block text-rose-800 dark:text-rose-300 mb-0.5">
                              Trappola Concettuale (Non Dare per Scontato)
                            </span>
                            <p className="text-rose-800 dark:text-rose-200 leading-relaxed">
                              {item.trap}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Bottom Bar */}
                  <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          <span>Chiudi spiegazione didattica</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          <span>Mostra PERCHÉ / COSA / COME e Trappole</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenStudy(item.block, item.topic)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-all shadow-2xs"
                      >
                        <BookOpen className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                        <span>Vedi teoria</span>
                      </button>

                      <button
                        onClick={() => onPracticeFormula(item)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all shadow-2xs hover:shadow-xs"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        <span>Esercitati su questa formula</span>
                      </button>
                    </div>
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
