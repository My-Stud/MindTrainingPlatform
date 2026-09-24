import { motion } from 'framer-motion';
import { useGameStore } from '../../../gameStore';

export function PauseScreen() {
  const { togglePause } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="overlay"
    >
      <div className="modal">
        <h1>Paused</h1>
        <button className="modal-btn" onClick={togglePause}>Resume Game</button>
      </div>
    </motion.div>
  );
}
