import { useState, useId, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  /** Header title text */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Icon element to show in header */
  icon?: ReactNode;
  /** Right-side badge or extra info (rendered outside buttons — may be interactive) */
  badge?: ReactNode;
  /** Section content */
  children: ReactNode;
  /** Whether section starts expanded (default: false on mobile, true on desktop handled via CSS) */
  defaultExpanded?: boolean;
  /** Additional className for the outer container */
  className?: string;
}

export function CollapsibleSection({
  title,
  subtitle,
  icon,
  badge,
  children,
  defaultExpanded = false,
  className = "",
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentId = useId();

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs overflow-hidden ${className}`}
    >
      {/* Header row: title toggle + badge slot + chevron toggle (no nesting) */}
      <div className="w-full flex items-center justify-between gap-3 p-5 sm:p-6">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer rounded-lg"
        >
          {icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </button>
        <div className="flex items-center gap-2 shrink-0">
          {badge}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-controls={contentId}
            aria-label={isExpanded ? `Comprimi ${title}` : `Espandi ${title}`}
            className="p-1 rounded-lg cursor-pointer"
          >
            <ChevronDown
              className={`h-5 w-5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        id={contentId}
        aria-hidden={!isExpanded}
        className={`transition-all duration-200 ease-in-out ${
          isExpanded
            ? "max-h-[2000px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">{children}</div>
      </div>
    </div>
  );
}
