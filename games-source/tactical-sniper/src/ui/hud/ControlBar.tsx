import { useGameStore } from '../../game/gameStore';

export function ControlBar() {
  const { phase, muted, hintVisible, setPhase, toggleMute, setHintVisible } = useGameStore();

  const isPlaying = phase === 'playing' || phase === 'aiming';
  const isPaused  = phase === 'paused';

  if (phase === 'menu' || phase === 'loading' || phase === 'error' || phase === 'game-over') {
    return null;
  }

  return (
    <div className="top-utility-bar glass">
      {/* Pause / Resume Button */}
      <button
        className="ctrl-btn-compact"
        onClick={() => {
          if (isPlaying) setPhase('paused');
          else if (isPaused) setPhase('playing');
        }}
        aria-label={isPaused ? 'Resume Mission' : 'Pause Mission'}
      >
        <span>{isPaused ? '▶' : '⏸'}</span>
        <span className="btn-text">{isPaused ? 'RESUME' : 'PAUSE'}</span>
      </button>

      {/* Intelligence Hint Button */}
      <button
        className={`ctrl-btn-compact ${hintVisible ? 'ctrl-btn--active' : ''}`}
        onClick={() => setHintVisible(!hintVisible)}
        aria-label="Toggle Mission Intelligence Hint"
      >
        <span>💡</span>
        <span className="btn-text">INTEL</span>
      </button>

      {/* Mute Radio Toggle */}
      <button
        className="ctrl-btn-compact"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
      >
        <span>{muted ? '🔇' : '🔊'}</span>
      </button>
    </div>
  );
}
