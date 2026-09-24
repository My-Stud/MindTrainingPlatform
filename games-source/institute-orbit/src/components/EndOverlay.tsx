interface EndOverlayProps {
  score: number;
  isLoading: boolean;
  onRestart: () => void;
}

export default function EndOverlay({ score, isLoading, onRestart }: EndOverlayProps) {
  return (
    <div id="start-overlay">
      <div className="start-box">
        <h2>Game Over!</h2>
        <h1 style={{ fontSize: '3rem', margin: '20px 0', color: 'var(--theme-yellow)', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
          {score}
        </h1>
        <p style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Final Score</p>
        <button id="start-btn" onClick={onRestart} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Play Again'}
        </button>
      </div>
    </div>
  );
}
