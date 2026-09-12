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
    <div className="my-4 rounded-xl border border-slate-200 bg-white p-4.5 shadow-xs">
      <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
        <ArrowLeftRight className="h-4 w-4 text-indigo-600" />
        <span>Salto di Paradigma: {title}</span>
      </div>
      <div className="mt-3 space-y-2.5 text-sm">
        <div className="flex items-start gap-3">
          <span className="shrink-0 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            TECNICO
          </span>
          <p className="text-slate-600">{technicalPerspective}</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="shrink-0 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
            AZIENDALE
          </span>
          <p className="text-slate-800 font-medium">{managerialPerspective}</p>
        </div>
        <div className="flex items-start gap-3 pt-1 border-t border-slate-100">
          <span className="shrink-0 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
            SALTO MENTALE
          </span>
          <p className="text-indigo-950 font-semibold">{mindsetShift}</p>
        </div>
      </div>
    </div>
  );
};
