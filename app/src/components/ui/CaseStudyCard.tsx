import React from "react";
import { Landmark, HelpCircle, CheckCircle2 } from "lucide-react";
import type { CaseStudy } from "../../types/study";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ caseStudy }) => {
  return (
    <div className="my-5 rounded-2xl border border-amber-300 bg-amber-50/70 p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Caso Studio Guida
            </span>
            <h3 className="text-lg font-bold text-amber-950">
              {caseStudy.name}
            </h3>
          </div>
        </div>
        {caseStudy.year && (
          <span className="rounded-full bg-amber-200/80 px-2.5 py-1 text-xs font-mono font-semibold text-amber-900">
            {caseStudy.year}
          </span>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-white/90 p-3.5 border border-amber-200 text-amber-950 text-sm">
        <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
          <HelpCircle className="h-4 w-4 text-amber-600" />
          <span>Il Dilemma Decisionale:</span>
        </div>
        <p className="italic font-medium">{caseStudy.dilemma}</p>
      </div>

      <p className="mt-3.5 text-sm leading-relaxed text-slate-800">
        {caseStudy.summary}
      </p>

      <div className="mt-4 space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Lezioni per l'ingegnere gestionale:
        </div>
        <ul className="space-y-1.5 text-sm text-slate-700">
          {caseStudy.coreLessons.map((lesson, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{lesson}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-3 border-t border-amber-200/80 text-xs font-medium text-amber-900">
        <span className="font-bold">Key Takeaway:</span> {caseStudy.keytakeaway}
      </div>
    </div>
  );
};
