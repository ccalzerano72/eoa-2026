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
    <div className="my-4 rounded-xl border-l-4 border-rose-500 bg-rose-50/80 p-4.5 shadow-xs">
      <div className="flex items-center gap-2 font-semibold text-rose-950 text-sm tracking-wide uppercase">
        <AlertOctagon className="h-4.5 w-4.5 text-rose-600 shrink-0" />
        <span>Non Dare per Scontato: {title}</span>
      </div>
      <div className="mt-2 space-y-2 text-sm">
        <div className="text-slate-800">
          <span className="font-semibold text-rose-800">
            Falso amico / Errore tipico:
          </span>{" "}
          <span className="italic text-slate-700">{misconception}</span>
        </div>
        <div className="text-slate-900 bg-white/90 p-2.5 rounded-lg border border-rose-200">
          <span className="font-semibold text-emerald-800">
            Cosa dice la gestione aziendale:
          </span>{" "}
          <span>{truth}</span>
        </div>
        {example && (
          <div className="text-xs text-slate-600 pt-1">
            <span className="font-medium text-slate-700">Esempio:</span>{" "}
            {example}
          </div>
        )}
      </div>
    </div>
  );
};
