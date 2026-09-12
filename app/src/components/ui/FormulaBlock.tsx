import React, { useMemo } from "react";
import katex from "katex";

interface FormulaBlockProps {
  formula: string;
  inline?: boolean;
  label?: string;
}

export const FormulaBlock: React.FC<FormulaBlockProps> = ({
  formula,
  inline = false,
  label,
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(formula, {
        displayMode: !inline,
        throwOnError: false,
      });
    } catch {
      return formula;
    }
  }, [formula, inline]);

  if (inline) {
    return (
      <span
        dangerouslySetInnerHTML={{ __html: html }}
        className="inline-block"
      />
    );
  }

  return (
    <div className="my-3 rounded-lg border border-slate-200 bg-white p-3 text-center shadow-2xs">
      {label && (
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          {label}
        </div>
      )}
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className="overflow-x-auto py-1"
      />
    </div>
  );
};
