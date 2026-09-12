import React from "react";
import { AlertOctagon } from "lucide-react";

interface TrapCardProps {
  title: string;
  misconception: string;
  truth: string;
  example?: string;
}

export const TrapCard: React.FC<TrapCardProps> = ({
  title,
  misconception,
  truth,
  example,
}) => {
  return (
    <div className="my-4 rounded-xl border-l-4 border-rose-500 bg-rose-50/80 dark:bg-rose-900/30 p-4.5 shadow-xs">
      <div className="flex items-center gap-2 font-semibold text-rose-950 dark:text-rose-200 text-sm tracking-wide uppercase">
        <AlertOctagon className="h-4.5 w-4.5 text-rose-600 dark:text-rose-400 shrink-0" />
        <span>Non Dare per Scontato: {title}</span>
      </div>
      <div className="mt-2 space-y-2 text-sm">
        <div className="text-slate-800 dark:text-slate-200">
          <span className="font-semibold text-rose-800 dark:text-rose-300">
            Falso amico / Errore tipico:
          </span>{" "}
          <span className="italic text-slate-700 dark:text-slate-300">
            {misconception}
          </span>
        </div>
        <div className="text-slate-900 dark:text-slate-100 bg-white/90 dark:bg-slate-800/90 p-2.5 rounded-lg border border-rose-200 dark:border-rose-800">
          <span className="font-semibold text-emerald-800 dark:text-emerald-400">
            Cosa dice la gestione aziendale:
          </span>{" "}
          <span>{truth}</span>
        </div>
        {example && (
          <div className="text-xs text-slate-600 dark:text-slate-400 pt-1">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Esempio:
            </span>{" "}
            {example}
          </div>
        )}
      </div>
    </div>
  );
};
