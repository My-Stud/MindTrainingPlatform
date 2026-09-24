import { create } from 'zustand';
import { GAME_CONFIG } from './gameConfig';
import { fetchQuiz } from '../api/quizApi';
import type { GameState, GamePhase, EncounterResult, QuizQuestion } from './gameTypes';
import { INITIAL_GAME_STATE } from './gameTypes';

interface GameStore extends GameState {
  setPhase: (phase: GamePhase) => void;
  setQuestions: (questions: QuizQuestion[]) => void;
  resolveEncounter: (result: EncounterResult, correctAnswer: string) => void;
  advanceQuestion: () => void;
  toggleMute: () => void;
  setHintVisible: (v: boolean) => void;
  startCountdown: () => void;
  restartGame: () => void;
  startNewGame: () => Promise<void>;
  setError: (msg: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_GAME_STATE,

  setPhase: (phase) => set({ phase }),

  setQuestions: (questions) =>
    set({ questions, currentQuestionIndex: 0, phase: 'countdown' }),

  resolveEncounter: (result, correctAnswer) => {
    const { score, streak, bestStreak } = get();
    const delta =
      result === 'correct'
        ? GAME_CONFIG.scoring.correct
        : result === 'wrong'
        ? GAME_CONFIG.scoring.wrong
        : GAME_CONFIG.scoring.miss;

    const newScore = Math.max(0, score + delta);
    const newStreak = result === 'correct' ? streak + 1 : 0;
    const newBest = Math.max(bestStreak, newStreak);

    set({
      phase: 'resolving',
      lastResult: result,
      lastCorrectAnswer: correctAnswer,
      score: newScore,
      streak: newStreak,
      bestStreak: newBest,
    });
  },

  advanceQuestion: () => {
    const { currentQuestionIndex, questions, questionSessionId } = get();
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx >= questions.length) {
      set({ phase: 'game-over' });
    } else {
      set({
        currentQuestionIndex: nextIdx,
        phase: 'playing',
        lastResult: null,
        lastCorrectAnswer: null,
        hintVisible: false,
        questionSessionId: questionSessionId + 1,
      });
    }
  },

  toggleMute: () => set((state) => ({ muted: !state.muted })),
  setHintVisible: (hintVisible) => set({ hintVisible }),

  startCountdown: () => set({ phase: 'countdown' }),

  restartGame: () => {
    set({
      ...INITIAL_GAME_STATE,
      phase: 'countdown',
      questions: get().questions,
      questionSessionId: get().questionSessionId + 1,
    });
  },

  startNewGame: async () => {
    set({ phase: 'loading', errorMessage: null });
    try {
      const questions = await fetchQuiz();
      set({
        ...INITIAL_GAME_STATE,
        phase: 'countdown',
        questions,
        questionSessionId: 1,
      });
    } catch {
      set({
        phase: 'error',
        errorMessage: 'Unable to connect to mission HQ. Please try again.',
      });
    }
  },

  setError: (errorMessage) => set({ phase: 'error', errorMessage }),
}));
