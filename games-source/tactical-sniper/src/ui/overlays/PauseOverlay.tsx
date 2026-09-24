import { useGameStore } from '../../game/gameStore';

export function PauseOverlay() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);
  const restartGame = useGameStore((s) => s.restartGame);

  if (phase !== 'paused') return null;

  return (
    <div className="overlay-backdrop" style={{ zIndex: 200 }}>
      <div className="overlay-card anim-slide-up" style={{ maxWidth: '420px' }}>
        <h2 className="overlay-title">MISSION PAUSED</h2>
        <p className="overlay-subtitle">TACTICAL REGROUPING</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '22px' }}>
          <button
            className="btn btn-primary"
            onClick={() => setPhase('playing')}
          >
            ▶ RESUME PURSUIT
          </button>
          <button
            className="btn btn-secondary"
            onClick={restartGame}
          >
            🔄 RESTART MISSION
          </button>
        </div>
      </div>
    </div>
  );
}
