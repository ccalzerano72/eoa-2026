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
    <div className="my-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-center shadow-2xs max-w-full overflow-hidden">
      {label && (
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          {label}
        </div>
      )}
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className="overflow-x-auto py-1 max-w-full text-slate-900 dark:text-slate-100 [&_.katex]:text-sm [&_.katex]:sm:text-base [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:py-1"
      />
    </div>
  );
};
