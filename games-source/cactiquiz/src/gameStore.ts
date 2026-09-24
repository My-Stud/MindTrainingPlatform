import { create } from 'zustand';
import { GameStore, Question, Option, FeedbackType } from './types';
import { fetchQuizQuestions } from './lib/quizApi';

export const useGameStore = create<GameStore>((set, get) => ({
  score: 0,
  currentQuestionIndex: 0,
  wrongAttempts: 0,
  gameState: 'start',
  questions: [],
  showHint: false,
  flyingNuts: null,
  flyingNutColors: null,
  quizFetchState: 'idle',
  quizError: null,

  fetchQuizData: async () => {
    set({ quizFetchState: 'loading', quizError: null });
    try {
      const data = await fetchQuizQuestions();
      let questions: Question[] = data.map((item) => {
        const options: Option[] = item.options.map(opt => ({
          word: opt,
          isCorrect: opt === item.answer,
          id: Math.random()
        }));

        return {
          definition: item.question,
          mnemonic: item.hint || '',
          options
        };
      });

      set({
        questions,
        quizFetchState: 'done'
      });
      get().startGame();
    } catch (e: any) {
      set({
        quizFetchState: 'error',
        quizError: e.message || 'Failed to fetch quiz data'
      });
    }
  },

  startGame: () => {
    set({
      score: 0,
      currentQuestionIndex: 0,
      wrongAttempts: 0,
      gameState: 'playing',
      showHint: false,
      flyingNuts: null,
      flyingNutColors: null
    });
  },

  initGame: () => {
    set({
      score: 0,
      currentQuestionIndex: 0,
      wrongAttempts: 0,
      gameState: 'start',
      showHint: false,
      flyingNuts: null,
      flyingNutColors: null
    });
  },

  handleOptionSelect: (isCorrect: boolean, clientX: number, clientY: number, nutColors: [string, string], callback?: (result: FeedbackType) => void) => {
    const state = get();
    if (state.gameState !== 'playing') return;

    if (isCorrect) {
      set({ score: state.score + 100, flyingNuts: { x: clientX, y: clientY }, flyingNutColors: nutColors });
      if (callback) callback('correct');
      setTimeout(() => {
        get().nextQuestion();
      }, 1500);
    } else {
      const newAttempts = state.wrongAttempts + 1;
      set({
        score: state.score - 10,
        wrongAttempts: newAttempts
      });

      if (newAttempts >= 2) {
        if (callback) callback('failed');
        setTimeout(() => {
          get().nextQuestion();
        }, 1500);
      } else {
        if (callback) callback('wrong');
      }
    }
  },

  nextQuestion: () => {
    const state = get();
    if (state.currentQuestionIndex >= state.questions.length - 1) {
      set({ gameState: 'gameover', flyingNuts: null, flyingNutColors: null });
    } else {
      set({
        currentQuestionIndex: state.currentQuestionIndex + 1,
        wrongAttempts: 0,
        showHint: false,
        flyingNuts: null,
        flyingNutColors: null
      });
    }
  },

  togglePause: () => {
    set((state: GameStore) => ({
      gameState: state.gameState === 'paused' ? 'playing' : (state.gameState === 'playing' ? 'paused' : state.gameState)
    }));
  },

  restart: () => {
    get().initGame();
  },

  toggleHint: () => {
    set(state => ({ showHint: !state.showHint }));
  }
}));
