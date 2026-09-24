import { useGameStore } from '../../game/gameStore';

export function ErrorOverlay() {
  const { phase, errorMessage, startNewGame } = useGameStore();

  if (phase !== 'error') return null;

  return (
    <div className="overlay-backdrop">
      <div className="overlay-card anim-slide-up">
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>⚠️</div>
        <h2 className="overlay-title">COMMS OFFLINE</h2>
        <p className="overlay-subtitle">{errorMessage || 'Mission intel feed interrupted.'}</p>

        <button
          className="btn btn-primary"
          onClick={() => startNewGame()}
          style={{ marginTop: '20px', width: '100%' }}
        >
          RECONNECT TO HQ
        </button>
      </div>
    </div>
  );
}
