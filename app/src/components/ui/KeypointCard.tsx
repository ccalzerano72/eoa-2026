import React from "react";
import { Lightbulb } from "lucide-react";

interface KeypointCardProps {
  title: string;
  schematicFormula: string;
  explanation: string;
}

export const KeypointCard: React.FC<KeypointCardProps> = ({
  title,
  schematicFormula,
  explanation,
}) => {
  return (
    <div className="my-4 rounded-xl border-l-4 border-sky-600 bg-sky-50/80 p-4.5 shadow-xs transition-all hover:bg-sky-50">
      <div className="flex items-center gap-2 font-semibold text-sky-950 text-sm tracking-wide uppercase">
        <Lightbulb className="h-4.5 w-4.5 text-sky-600 shrink-0" />
        <span>Keypoint: {title}</span>
      </div>
      <div className="my-2.5 font-mono text-base font-bold text-sky-900 bg-white/80 py-2 px-3 rounded-lg border border-sky-200/70 inline-block max-w-full overflow-x-auto">
        {schematicFormula}
      </div>
      <p className="text-slate-700 text-sm leading-relaxed">{explanation}</p>
    </div>
  );
};
