import { useEffect, useState } from 'react';
import { Scene } from './components/3d/Scene';
import { useGameStore } from './gameStore';
import { CactusStatus, FeedbackType } from './types';
import { playSound } from './lib/audioManager';
import { GameUI } from './components/ui/GameUI';

export default function App() {
  const handleOptionSelect = useGameStore(state => state.handleOptionSelect);
  const currentQuestionIndex = useGameStore(state => state.currentQuestionIndex);
  const gameState = useGameStore(state => state.gameState);

  const [cactusStatuses, setCactusStatuses] = useState<CactusStatus[]>(['idle', 'idle', 'idle', 'idle']);
  const [feedback, setFeedback] = useState<FeedbackType>(null);

  useEffect(() => {
    setCactusStatuses(['idle', 'idle', 'idle', 'idle']);
    setFeedback(null);
  }, [currentQuestionIndex]);

  const onOptionClick = (index: number, isCorrect: boolean, clientX: number, clientY: number, nutColors: [string, string]) => {
    if (cactusStatuses[index] !== 'idle') return;
    if (feedback === 'correct' || feedback === 'failed') return;

    playSound('click');

    const newStatuses = [...cactusStatuses];

    handleOptionSelect(isCorrect, clientX, clientY, nutColors, (result: FeedbackType) => {
      setFeedback(result);
      if (result === 'correct') {
        playSound('correct');
        newStatuses[index] = 'correct';
      } else {
        playSound('wrong');
        newStatuses[index] = 'wrong';
      }
      setCactusStatuses(newStatuses);
    });
  };

  return (
    <>
      {gameState !== 'start' && <Scene onOptionSelect={onOptionClick} cactusStatuses={cactusStatuses} />}
      <GameUI feedback={feedback} />
    </>
  );
}
