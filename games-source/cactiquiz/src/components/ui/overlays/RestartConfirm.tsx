import { motion } from 'framer-motion';
import { useGameStore } from '../../../gameStore';

export function RestartConfirm({ onCancel }: { onCancel: () => void }) {
  const { restart } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="overlay"
    >
      <div className="modal">
        <h1>Restart Game?</h1>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Are you sure you want to start over?</p>
        <div className="modal-actions">
          <button className="modal-btn" style={{ background: '#f44336', boxShadow: '0 6px 0 #c0392b' }} onClick={onCancel}>Cancel</button>
          <button className="modal-btn" onClick={() => { onCancel(); restart(); }}>Restart Over</button>
        </div>
      </div>
    </motion.div>
  );
}
