import { motion } from 'framer-motion';
import { useGameStore } from '../../../gameStore';

export function StartScreen() {
  const { quizFetchState, quizError, fetchQuizData } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="overlay start-screen"
    >
      <div className="modal">
        <h1>Vocabullseye</h1>
        <p style={{ marginBottom: '1rem' }}>Test your knowledge!</p>
        
        {quizFetchState === 'error' && (
          <div style={{ color: '#ff4757', marginBottom: '1rem', fontWeight: 'bold' }}>
            {quizError}
          </div>
        )}
        
        {quizFetchState === 'error' ? (
          <button className="modal-btn" onClick={() => fetchQuizData()}>
            Retry
          </button>
        ) : (
          <button 
            className="modal-btn" 
            disabled={quizFetchState === 'loading'}
            style={{ opacity: quizFetchState === 'loading' ? 0.5 : 1 }}
            onClick={() => fetchQuizData()}
          >
            {quizFetchState === 'loading' ? 'Loading...' : 'Start Game'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
