import type { SyllabusBlock, StudyTrack } from "./question";

export interface Keypoint {
  id: string;
  title: string;
  schematicFormula: string; // concise formula / rule (max 1-2 lines)
  explanation: string;
}

export interface TrapItem {
  id: string;
  title: string;
  misconception: string;
  truth: string;
  example?: string;
}

export interface ConceptShift {
  id: string;
  title: string;
  technicalPerspective: string; // Come ragiona l'ingegnere
  managerialPerspective: string; // Come ragiona l'economia d'impresa
  mindsetShift: string; // Il salto concettuale
}

/**
 * Interactive Dilemma Choice for Case Studies
 * Allows students to make a decision before revealing the historical outcome
 */
export interface DilemmaChoice {
  id: string;
  label: string; // Short label for the button (e.g., "Vendere la divisione")
  description: string; // Fuller explanation of this choice
  isHistorical: boolean; // True if this is what the company actually did
}

export interface CaseStudy {
  id: string;
  name: string; // e.g. "Olivetti: La Programma 101"
  company: string; // e.g. "Olivetti"
  year?: string;
  dilemma: string; // La domanda guida (es. "Se avevamo la tecnologia migliore, perché abbiamo perso la leadership?")
  summary: string;
  coreLessons: string[];
  keytakeaway: string;
  // Interactive dilemma fields (optional for backward compatibility)
  interactiveDilemma?: {
    question: string; // The decision question posed to the student
    context: string; // Brief context before the choice (setting the scene)
    choices: DilemmaChoice[];
    historicalOutcome: string; // What actually happened as a result
    lessonLearned: string; // Key insight from this decision
  };
}

export interface StudyTopic {
  id: string;
  title: string;
  track: StudyTrack;
  keypoints: Keypoint[];
  whyIntro: string; // The WHY behind this topic
  whatBody: string; // The conceptual core
  howDetails?: string; // Mathematical formulas or procedures
  traps?: TrapItem[];
  conceptShifts?: ConceptShift[];
}

export interface StudyBlock {
  block: SyllabusBlock;
  title: string;
  subtitle: string;
  guidingQuestion: string;
  caseStudy: CaseStudy;
  topics: StudyTopic[];
}
