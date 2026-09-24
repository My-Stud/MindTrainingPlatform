// ─────────────────────────────────────────────────────────────────
//  GAME TYPES — shared TypeScript interfaces for Rooftop Pursuit 3D
// ─────────────────────────────────────────────────────────────────

export type GamePhase =
  | 'menu'
  | 'loading'
  | 'error'
  | 'ready'
  | 'countdown'
  | 'playing'
  | 'aiming'
  | 'firing'
  | 'resolving'
  | 'paused'
  | 'hint'
  | 'game-over';

export type EncounterResult = 'correct' | 'wrong' | 'miss' | null;

export type SuspectLifecycle = 'running' | 'vaulting' | 'sliding' | 'tackled' | 'escaped';

export interface SuspectTarget {
  id: string;
  optionIndex: number;
  optionText: string;
  isCorrect: boolean;
  laneX: number;
}

export interface QuizQuestion {
  question: string;
  hint: string;
  options?: string[];
  answer: string;
}

export interface GameState {
  phase: GamePhase;
  questions: QuizQuestion[];
  currentQuestionIndex: number;

  score: number;
  streak: number;
  bestStreak: number;

  lastResult: EncounterResult;
  lastCorrectAnswer: string | null;

  hintVisible: boolean;
  muted: boolean;

  questionSessionId: number;
  errorMessage: string | null;
}

export const INITIAL_GAME_STATE: GameState = {
  phase: 'menu',
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  lastResult: null,
  lastCorrectAnswer: null,
  hintVisible: false,
  muted: false,
  questionSessionId: 0,
  errorMessage: null,
};
