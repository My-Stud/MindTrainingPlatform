import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../gameStore';

export function QuestionBoard({ slot1Ref, slot2Ref }: { slot1Ref: React.Ref<HTMLDivElement>, slot2Ref: React.Ref<HTMLDivElement> }) {
  const { currentQuestionIndex, questions, gameState, showHint, toggleHint } = useGameStore();
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <div className="question-board-wrapper">
        {currentQuestion && gameState !== 'gameover' && (
          <motion.div
            className="question-board"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            key={currentQuestion.definition}
          >
            <h2 className="question-text">{currentQuestion.definition}</h2>
            <div className="slots-container">
              <div className="slot" ref={slot1Ref}></div>
              <div className="slot" ref={slot2Ref}></div>
            </div>
            {showHint && currentQuestion.mnemonic && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="hint-box"
              >
                Hint: {currentQuestion.mnemonic}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
      {gameState === 'playing' && (
        <button className="hint-fab" onClick={toggleHint}>
          <HelpCircle size={28} strokeWidth={2.5} />
        </button>
      )}
    </>
  );
}
