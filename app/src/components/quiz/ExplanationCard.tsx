import React from "react";
import type { ExplanationBlock } from "../../types/question";
import { AlertCircle, Lightbulb } from "lucide-react";

interface ExplanationCardProps {
  explanation: ExplanationBlock;
  /** Visual tone: slate for post-exam review, amber for in-quiz reveal. */
  tone?: "slate" | "amber";
  /**
   * Trap emphasis: "loud" renders the prominent red conceptual-trap card
   * (traps-only mode), "quiet" renders the compact footer variant.
   */
  trapEmphasis?: "loud" | "quiet";
  title?: string;
}

/**
 * Golden Rule explanation card (PERCHÉ → COSA → COME + trappola).
 * Single shared renderer for post-exam review and in-quiz immediate
 * reveal, so every mode shows the full didactic breakdown (§2.1).
 */
export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  explanation,
  tone = "slate",
  trapEmphasis = "quiet",
  title,
}) => {
  const container =
    tone === "amber"
      ? "rounded-2xl bg-amber-50/80 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 p-4 text-sm space-y-2"
      : "rounded-xl bg-slate-50 dark:bg-slate-700/50 p-3 sm:p-4 border border-slate-200 dark:border-slate-600 text-sm space-y-2";
  const trapFooterBorder =
    tone === "amber"
      ? "border-amber-200 dark:border-amber-800"
      : "border-slate-200 dark:border-slate-600";
  const heading =
    tone === "amber" ? (
      <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <span>{title ?? "Spiegazione del Quesito:"}</span>
      </div>
    ) : (
      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
        <Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0" />
        <span>{title ?? "Spiegazione (Regola d'Oro):"}</span>
      </div>
    );

  return (
    <div className="space-y-3">
      <div className={container}>
        {heading}
        <div className="break-words">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Perché:{" "}
          </span>
          <span className="text-slate-600 dark:text-slate-400 text-xs">
            {explanation.why}
          </span>
        </div>
        <div className="break-words">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Cosa:{" "}
          </span>
          <span className="text-slate-600 dark:text-slate-400 text-xs">
            {explanation.what}
          </span>
        </div>
        <div className="break-words overflow-x-auto">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Come:{" "}
          </span>
          <span className="text-slate-800 dark:text-slate-200 text-xs font-mono">
            {explanation.how}
          </span>
        </div>
        {explanation.trap && trapEmphasis === "quiet" && (
          <div className={`pt-2 text-rose-900 dark:text-rose-300 text-xs border-t ${trapFooterBorder} break-words`}>
            <span className="font-bold">Trappola d'esame:</span>{" "}
            {explanation.trap}
          </div>
        )}
      </div>

      {explanation.trap && trapEmphasis === "loud" && (
        <div className="rounded-2xl p-4 text-sm bg-rose-50 dark:bg-rose-900/30 border-2 border-rose-300 dark:border-rose-700 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-900 dark:text-rose-300">
              <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              <span className="uppercase tracking-wider text-xs">
                ⚠ Trappola Concettuale — Non Dare per Scontato
              </span>
            </div>
            <p className="text-rose-900 dark:text-rose-200 text-sm leading-relaxed font-medium">
              {explanation.trap}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
