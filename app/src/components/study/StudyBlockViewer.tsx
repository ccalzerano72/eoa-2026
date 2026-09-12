import React, { useEffect } from "react";
import type { StudyBlock } from "../../types/study";
import type { SyllabusBlock } from "../../types/question";
import { KeypointCard } from "../ui/KeypointCard";
import { TrapCard } from "../ui/TrapCard";
import { ShiftCard } from "../ui/ShiftCard";
import { CaseStudyCard } from "../ui/CaseStudyCard";
import {
  BookOpen,
  PlayCircle,
  HelpCircle,
  Compass,
  Sparkles,
} from "lucide-react";

interface StudyBlockViewerProps {
  block: StudyBlock;
  targetTopicId?: string;
  onStartBlockQuiz?: () => void;
  onStartTopicQuiz?: (block: SyllabusBlock, topicId: string) => void;
}

export const StudyBlockViewer: React.FC<StudyBlockViewerProps> = ({
  block,
  targetTopicId,
  onStartBlockQuiz,
  onStartTopicQuiz,
}) => {
  useEffect(() => {
    if (targetTopicId) {
      const el = document.getElementById(`topic-${targetTopicId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [targetTopicId, block]);
  return (
    <div className="mx-auto max-w-3xl py-8 px-4">
      {/* Block Header Banner */}
      <div className="rounded-3xl bg-linear-to-r from-sky-900 to-indigo-950 p-8 text-white shadow-md mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-800/60 px-3 py-1 text-xs font-mono font-semibold text-sky-200 border border-sky-600/40 mb-3">
          <BookOpen className="h-3.5 w-3.5" />
          <span>BLOCCO {block.block} • PROGRAMMA EOA 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          {block.title}
        </h1>
        <p className="mt-2 text-sky-200 text-base font-medium">
          {block.subtitle}
        </p>

        {/* Guiding Question */}
        <div className="mt-6 rounded-2xl bg-white/10 p-4 border border-white/15 backdrop-blur-xs flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-sky-300 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block mb-1">
              Domanda Chiave del Blocco:
            </span>
            <p className="text-sm sm:text-base font-medium text-white italic">
              "{block.guidingQuestion}"
            </p>
          </div>
        </div>

        {/* Action Button */}
        {onStartBlockQuiz && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={onStartBlockQuiz}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 font-bold text-sm text-slate-950 shadow-sm transition cursor-pointer"
            >
              <PlayCircle className="h-4.5 w-4.5" />
              <span>Simula Quesiti Blocco {block.block}</span>
            </button>
          </div>
        )}
      </div>

      {/* Case Study Card */}
      <CaseStudyCard caseStudy={block.caseStudy} />

      {/* Topics Section */}
      <div className="mt-10 space-y-12">
        {block.topics.map((topic, idx) => {
          const isTargeted = topic.id === targetTopicId;
          return (
            <section
              key={topic.id}
              id={`topic-${topic.id}`}
              className={`scroll-mt-24 transition-all duration-500 p-3 rounded-2xl ${
                isTargeted ? "ring-2 ring-sky-500 bg-sky-50/40 shadow-sm" : ""
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-800 font-mono text-xs font-bold">
                    {idx + 1}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    {topic.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Track: {topic.track}
                  </span>
                  {onStartTopicQuiz && (
                    <button
                      onClick={() => onStartTopicQuiz(block.block, topic.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 text-xs font-bold transition shadow-2xs cursor-pointer"
                      title={`Avvia un quiz mirato su: ${topic.title}`}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Quiz su questo argomento</span>
                    </button>
                  )}
                </div>
              </div>

              {/* WHY: Problem statement */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700 mb-2">
                  <Compass className="h-4 w-4" />
                  <span>Il Perché Decisionale (Golden Rule)</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {topic.whyIntro}
                </p>

                {/* WHAT: Conceptual Core */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Il Concetto Chiave
                  </span>
                  <p className="text-slate-800 text-sm leading-relaxed font-medium">
                    {topic.whatBody}
                  </p>
                </div>
              </div>

              {/* Keypoints */}
              {topic.keypoints?.map((kp) => (
                <KeypointCard
                  key={kp.id}
                  title={kp.title}
                  schematicFormula={kp.schematicFormula}
                  explanation={kp.explanation}
                />
              ))}

              {/* Traps */}
              {topic.traps?.map((trap) => (
                <TrapCard
                  key={trap.id}
                  title={trap.title}
                  misconception={trap.misconception}
                  truth={trap.truth}
                  example={trap.example}
                />
              ))}

              {/* Concept Shifts */}
              {topic.conceptShifts?.map((shift) => (
                <ShiftCard
                  key={shift.id}
                  title={shift.title}
                  technicalPerspective={shift.technicalPerspective}
                  managerialPerspective={shift.managerialPerspective}
                  mindsetShift={shift.mindsetShift}
                />
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
};
