import { useState, useEffect, useCallback } from 'react';
import HintModal from './HintModal';
import PauseOverlay from './PauseOverlay';
import PlayArea from './PlayArea';
import { QuizQuestion } from '../types/api';

interface GameProps {
  questions: QuizQuestion[];
  onEnd: (score: number) => void;
  onRestartGame: () => void;
  isFetchingQuiz?: boolean;
}

export default function Game({ questions, onEnd, onRestartGame, isFetchingQuiz }: GameProps) {
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hintOpen, setHintOpen] = useState<boolean>(false);
  const [scoreBump, setScoreBump] = useState<boolean>(false);
  const [restartConfirmOpen, setRestartConfirmOpen] = useState<boolean>(false);

  const [fiftyRemoved, setFiftyRemoved] = useState<number[]>([]);
  const [fiftyUsed, setFiftyUsed] = useState<boolean>(false);
  const [qLabel, setQLabel] = useState<string>('');
  const [entering, setEntering] = useState<boolean>(false);

  useEffect(() => {
    if (questions.length > 0) {
      loadQuestion(questions, 0);
    }
  }, [questions]);

  const loadQuestion = (qs: QuizQuestion[], idx: number) => {
    if (idx >= qs.length) return;

    const q = qs[idx];
    setCurrentQuestion(q);
    setCurrentOptions([...q.options]);
    setCurrentQIdx(idx);
    setFiftyRemoved([]);
    setFiftyUsed(false);

    setQLabel(`${idx + 1}. ${q.question.label || 'Question'}`);

    setEntering(false);
    setTimeout(() => setEntering(true), 50);
  };

  const handleAnswer = useCallback((_index: number, isCorrect: boolean) => {
    let newPoints = points;
    if (isCorrect) {
      newPoints += 100;
    } else {
      newPoints = Math.max(0, newPoints - 10);
    }
    setPoints(newPoints);

    setScoreBump(false);
    setTimeout(() => setScoreBump(true), 50);

    setTimeout(() => {
      if (currentQIdx + 1 >= questions.length) {
        onEnd(newPoints);
      } else {
        loadQuestion(questions, currentQIdx + 1);
      }
    }, 1200);
  }, [questions, currentQIdx, points, onEnd]);

  const handleFiftyFifty = () => {
    if (fiftyUsed || !currentQuestion) return;
    setFiftyUsed(true);
    const wrongIdxs = currentOptions
      .map((o, i) => o !== currentQuestion.answer ? i : -1)
      .filter(i => i !== -1)
      .sort(() => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32 - 0.5)
      .slice(0, 2);
    setFiftyRemoved(wrongIdxs);
  };

  return (
    <>
      {hintOpen && currentQuestion && (
        <HintModal
          hintText={currentQuestion.hint || 'No hint provided.'}
          onClose={() => setHintOpen(false)}
        />
      )}

      {isPaused && <PauseOverlay onResume={() => setIsPaused(false)} />}

      <div id="top-header">
        <img id="app-logo" src="./assets/logo.png" alt="Institute Orbit" />
        <div id="score-bar">
          <span id="score-icon">🏆</span>
          <span id="score-value" className={scoreBump ? 'bump' : ''}>{points}</span>
        </div>
      </div>

      <div id="question-board">
        <p className="q-label">{qLabel}</p>
        <h1 id="state-name" className={entering ? 'question-entering' : ''}>
          {currentQuestion ? currentQuestion.question : 'Loading...'}
        </h1>
      </div>

      <PlayArea
        currentQuestion={currentQuestion}
        currentOptions={currentOptions}
        fiftyRemoved={fiftyRemoved}
        isPaused={isPaused}
        onAnswer={handleAnswer}
      />

      <div id="bottom-bar">
        <div id="fifty-area">
          <button id="fifty-fifty-btn" title="50/50" disabled={fiftyUsed} onClick={handleFiftyFifty}>
            <img src="./assets/fifty.png" alt="50/50" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </button>
        </div>
        <div id="right-btns">
          <button id="hint-btn" className="round-btn blue-btn" title="Hint" onClick={() => setHintOpen(true)}>
            <span>💡</span>
          </button>
          <button id="restart-btn" className="round-btn orange-btn" title="Restart" onClick={() => setRestartConfirmOpen(true)}>
            <span style={{ color: 'white', fontSize: '1.4rem', paddingBottom: '2px', fontFamily: 'Inter, sans-serif' }}>🔄</span>
          </button>
          <button id="pause-btn" className="round-btn pink-btn" title="Pause" onClick={() => setIsPaused(!isPaused)}>
            <span>{isPaused ? '▶' : '⏸'}</span>
          </button>
        </div>
      </div>

      {restartConfirmOpen && (
        <div className="overlay" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '20px' }}>Restart Game?</h2>
            <p style={{ marginBottom: '20px' }}>Are you sure you want to restart? Your current progress will be lost.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                className="action-btn"
                style={{ background: 'var(--theme-pink)', padding: '10px 20px', fontSize: '1rem' }}
                onClick={() => setRestartConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="action-btn"
                style={{ background: 'var(--theme-green)', padding: '10px 20px', fontSize: '1rem' }}
                onClick={() => {
                  setRestartConfirmOpen(false);
                  onRestartGame();
                }}
                disabled={isFetchingQuiz}
              >
                {isFetchingQuiz ? 'Loading...' : 'Yes, Restart'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
