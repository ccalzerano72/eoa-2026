import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  /** Header title text */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Icon element to show in header */
  icon?: ReactNode;
  /** Right-side badge or extra info */
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

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden ${className}`}
    >
      {/* Clickable Header */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 p-5 sm:p-6 text-left cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {badge}
          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Collapsible Content */}
      <div
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
