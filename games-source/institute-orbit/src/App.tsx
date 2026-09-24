import { useState } from 'react';
import StartOverlay from './components/StartOverlay';
import Game from './components/Game';
import EndOverlay from './components/EndOverlay';
import { QuizQuestion, ApiResponse } from './types/api';

export default function App() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizFetchState, setQuizFetchState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [quizErrorMsg, setQuizErrorMsg] = useState<string>('');
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [finalScore, setFinalScore] = useState<number>(0);
  const [gameId, setGameId] = useState<number>(0);

  const fetchQuizData = async () => {
    setQuizFetchState('loading');
    setQuizErrorMsg('');

    try {
      const baseUrl = import.meta.env?.VITE_API_BASE_URL || '';
      const projectId = import.meta.env?.VITE_PROJECT_ID || '';
      const res = await fetch(`${baseUrl}/projects/${projectId}/quiz`);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }

      const json: ApiResponse<QuizQuestion[]> = await res.json();
      setQuestions(json.data);
      setGameId(prev => prev + 1);
      setQuizFetchState('done');
      setGameState('playing');
    } catch (e) {
      setQuizFetchState('error');
      setQuizErrorMsg(e instanceof Error ? e.message : 'Failed to fetch quiz');
    }
  };

  return (
    <div id="game-container">
      {gameState === 'start' && (
        <StartOverlay
          fetchState={quizFetchState}
          errorMsg={quizErrorMsg}
          onStart={fetchQuizData}
        />
      )}
      {gameState === 'playing' && (
        <Game 
          key={gameId}
          questions={questions} 
          onEnd={(score) => {
            setFinalScore(score);
            setGameState('end');
          }} 
          onRestartGame={fetchQuizData}
          isFetchingQuiz={quizFetchState === 'loading'}
        />
      )}
      {gameState === 'end' && (
        <EndOverlay 
          score={finalScore} 
          isLoading={quizFetchState === 'loading'}
          onRestart={fetchQuizData} 
        />
      )}
    </div>
  );
}
