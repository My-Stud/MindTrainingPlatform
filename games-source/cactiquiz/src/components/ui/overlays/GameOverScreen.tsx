import { motion } from 'framer-motion';
import { useGameStore } from '../../../gameStore';

export function GameOverScreen() {
  const { score, restart } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="overlay"
    >
      <div className="modal">
        <h1>Game Over!</h1>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Final Score: {score}</p>
        <button className="modal-btn" onClick={restart}>Play Again</button>
      </div>
    </motion.div>
  );
}
