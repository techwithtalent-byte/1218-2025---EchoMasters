
export type DemoId = 'waves' | 'transducers' | 'doppler' | 'pulsed' | 'artifacts' | 'safety' | 'hemodynamics' | 'qa' | 'resolution' | 'harmonics' | 'tgc' | 'dynamic_range' | 'processing' | 'study_guide' | 'contrast_agents' | 'elastography' | '3d_4d' | 'advanced_artifacts' | 'knobology' | 'biomedical_physics' | 'abdominal' | 'vascular' | 'msk' | 'cardiac' | 'jeopardy' | 'spi_mock_exam' | 'clinical_case_simulator' | 'ai_history';

export type Theme = 'Classic' | 'Neon';

export interface CourseModuleData {
  id: DemoId;
  status: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  hasWaveAnimation?: boolean;
}

// New type for a single flashcard with SRS data
export interface SRSCard {
  id: string; // Unique ID for the card
  term: string;
  definition: string;
  frontImage?: string; // Optional URL or base64 string for front image
  backImage?: string;  // Optional URL or base64 string for back image
  level: number; // SRS level (e.g., Leitner box number)
  lastReviewed: number | null; // Timestamp of last review
  nextReview: number; // Timestamp for next scheduled review
}

export type Priority = 'High' | 'Medium' | 'Low';

export interface StudyTask {
  id: string;
  text: string;
  isCompleted: boolean;
  priority: Priority;
}

export interface UserProfile {
  name: string;
  joinDate: number;
  lastActiveModule: DemoId | null;
  completedModules: DemoId[];
  quizScores: {
    spi?: number; // Store highest score for the SPI quiz
    spiMockExam?: number; // Store highest score for the SPI mock exam
  };
  achievements: string[]; // Array of achievement IDs
  flashcardDecks: {
    [deckId: string]: SRSCard[]; // e.g., 'spi_study_guide': [SRSCard, ...]
  };
  studyTasks: StudyTask[];
  notes: { [sectionId: string]: string }; // For persistent note-taking
  learningStyle: LearningStyle | null;
  studyPath: AIStudyPath | null;
  hasCompletedOnboarding: boolean;
  theme: Theme;
}

// Types for AI-generated content
export interface AIQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface AIFlashcard {
  term: string;
  definition: string;
  frontImage?: string;
  backImage?: string;
}

export interface StudyPlanWeek {
  week: string;
  title: string;
  keyConcepts: string[];
  recommendedModuleIds: DemoId[];
  milestone: string;
  visualSuggestion: string;
  auditorySuggestion: string;
  readingWritingSuggestion: string;
  kinestheticSuggestion: string;
}

export type LearningStyle = 'Visual' | 'Auditory' | 'Reading/Writing' | 'Kinesthetic' | 'Multimodal';


export interface AIStudyPath {
  summary: string;
  learningStyle: LearningStyle;
  weeklyPlan: StudyPlanWeek[];
}

// FIX: Add AIStudyPlan and related types to resolve missing type errors.
export interface AIStudyPlanWeakArea {
  concept: string;
  explanation: string;
  recommendedModules?: string[];
  keyTakeaway: string;
}

export interface AIStudyPlan {
  summary: string;
  weakAreas: AIStudyPlanWeakArea[];
}

export interface ClinicalCase {
  id: string;
  title: string;
  history: string;
  scanAreas: {
    id: string;
    name: string;
    imagePrompt: string;
    correctFindings: string[];
  }[];
  allFindings: string[];
  correctDiagnosis: string;
  feedbackPrompt: string;
}

export type AIHistoryItemType = 
  | 'studyPath' 
  | 'flashcards' 
  | 'chat' 
  | 'essayQuestion' 
  | 'definition' 
  | 'simplification' 
  | 'examReview' 
  | 'clinicalImage' 
  | 'clinicalFeedback';

export interface AIHistoryItem {
  id: string;
  timestamp: number;
  type: AIHistoryItemType;
  content: any;
  context?: string;
}
