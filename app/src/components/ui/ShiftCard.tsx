import React from "react";
import { ArrowLeftRight } from "lucide-react";

interface ShiftCardProps {
  title: string;
  technicalPerspective: string;
  managerialPerspective: string;
  mindsetShift: string;
}

export const ShiftCard: React.FC<ShiftCardProps> = ({
  title,
  technicalPerspective,
  managerialPerspective,
  mindsetShift,
}) => {
  return (
    <div className="my-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4.5 shadow-xs">
      <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wide border-b border-slate-100 dark:border-slate-700 pb-2">
        <ArrowLeftRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <span>Salto di Paradigma: {title}</span>
      </div>
      <div className="mt-3 space-y-2.5 text-sm">
        <div className="flex items-start gap-3">
          <span className="shrink-0 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
            TECNICO
          </span>
          <p className="text-slate-600 dark:text-slate-400">
            {technicalPerspective}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <span className="shrink-0 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-700">
            AZIENDALE
          </span>
          <p className="text-slate-800 dark:text-slate-200 font-medium">
            {managerialPerspective}
          </p>
        </div>
        <div className="flex items-start gap-3 pt-1 border-t border-slate-100 dark:border-slate-700">
          <span className="shrink-0 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700">
            SALTO MENTALE
          </span>
          <p className="text-indigo-950 dark:text-indigo-200 font-semibold">
            {mindsetShift}
          </p>
        </div>
      </div>
    </div>
  );
};
