import { useRef, useEffect, useState } from 'react';
import { useGameStore } from '../../gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackType } from '../../types';
import { HUD } from './HUD';
import { QuestionBoard } from './QuestionBoard';
import { StartScreen } from './overlays/StartScreen';
import { PauseScreen } from './overlays/PauseScreen';
import { GameOverScreen } from './overlays/GameOverScreen';
import { RestartConfirm } from './overlays/RestartConfirm';

interface GameUIProps {
  feedback: FeedbackType;
}

export function GameUI({ feedback }: GameUIProps) {
  const { gameState, flyingNuts, flyingNutColors, currentQuestionIndex } = useGameStore();

  const slot1Ref = useRef<HTMLDivElement>(null);
  const slot2Ref = useRef<HTMLDivElement>(null);
  const [target1, setTarget1] = useState({ x: 0, y: 0 });
  const [target2, setTarget2] = useState({ x: 0, y: 0 });

  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  const updateTargets = () => {
    if (slot1Ref.current && slot2Ref.current) {
      const r1 = slot1Ref.current.getBoundingClientRect();
      const r2 = slot2Ref.current.getBoundingClientRect();
      const offset = window.innerWidth < 768 ? 15 : 20;
      setTarget1({ x: r1.left + r1.width / 2 - offset, y: r1.top + r1.height / 2 - offset });
      setTarget2({ x: r2.left + r2.width / 2 - offset, y: r2.top + r2.height / 2 - offset });
    }
  };

  useEffect(() => {
    updateTargets();
    window.addEventListener('resize', updateTargets);
    return () => window.removeEventListener('resize', updateTargets);
  }, []);

  useEffect(() => {
    if (flyingNuts) {
      updateTargets();
    }
  }, [flyingNuts, currentQuestionIndex]);

  const isMobile = window.innerWidth < 768;
  const offset = isMobile ? 15 : 20;

  return (
    <div className="ui-layer">
      <HUD onRestart={() => setShowRestartConfirm(true)} />
      
      <QuestionBoard slot1Ref={slot1Ref} slot2Ref={slot2Ref} />

      <AnimatePresence>
        {feedback === 'correct' && flyingNuts && (
          <>
            <motion.div
              className="flying-nut"
              style={{ backgroundColor: flyingNutColors?.[0] || '#ff4757' }}
              initial={{ x: flyingNuts.x - offset, y: flyingNuts.y - offset, scale: 0.5 }}
              animate={{ x: target1.x, y: target1.y, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            >
              +
            </motion.div>
            <motion.div
              className="flying-nut"
              style={{ backgroundColor: flyingNutColors?.[1] || '#1e90ff' }}
              initial={{ x: flyingNuts.x - offset, y: flyingNuts.y - offset, scale: 0.5 }}
              animate={{ x: target2.x, y: target2.y, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 0.05 }}
            >
              +
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'start' && <StartScreen />}
        {gameState === 'paused' && !showRestartConfirm && <PauseScreen />}
        {showRestartConfirm && <RestartConfirm onCancel={() => setShowRestartConfirm(false)} />}
        {gameState === 'gameover' && !showRestartConfirm && <GameOverScreen />}
      </AnimatePresence>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: '-50%', x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '-60%' }}
            exit={{ opacity: 0, scale: 1.5 }}
            className={`feedback-text ${feedback === 'correct' ? 'feedback-correct' : 'feedback-wrong'}`}
          >
            {feedback === 'correct' ? 'Awesome!' : (feedback === 'wrong' ? 'Try Again!' : 'Wrong!')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
