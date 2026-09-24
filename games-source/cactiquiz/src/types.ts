export interface Option {
  word: string;
  isCorrect: boolean;
  id: number;
}

export interface Question {
  definition: string;
  mnemonic: string;
  options: Option[];
}

export type GameState = 'start' | 'playing' | 'paused' | 'gameover';
export type CactusStatus = 'idle' | 'wrong' | 'correct';
export type FeedbackType = 'correct' | 'wrong' | 'failed' | null;
export type QuizFetchState = 'idle' | 'loading' | 'done' | 'error';

export interface GameStore {
  score: number;
  currentQuestionIndex: number;
  wrongAttempts: number;
  gameState: GameState;
  questions: Question[];
  showHint: boolean;
  flyingNuts: { x: number, y: number } | null;
  flyingNutColors: [string, string] | null;
  quizFetchState: QuizFetchState;
  quizError: string | null;
  fetchQuizData: () => Promise<void>;
  startGame: () => void;
  initGame: () => void;
  handleOptionSelect: (isCorrect: boolean, clientX: number, clientY: number, nutColors: [string, string], callback?: (result: FeedbackType) => void) => void;
  nextQuestion: () => void;
  togglePause: () => void;
  restart: () => void;
  toggleHint: () => void;
}
