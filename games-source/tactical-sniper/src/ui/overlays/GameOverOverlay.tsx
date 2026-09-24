import { useEffect } from 'react';
import { useGameStore } from '../../game/gameStore';
import { RooftopAudio } from '../../audio/RooftopAudioManager';

export function GameOverOverlay() {
  const { phase, score, bestStreak, startNewGame } = useGameStore();

  useEffect(() => {
    if (phase === 'game-over') {
      RooftopAudio.play('victory');
    }
  }, [phase]);

  if (phase !== 'game-over') return null;

  return (
    <div className="overlay-backdrop" style={{ zIndex: 200 }}>
      <div className="overlay-card anim-slide-up" style={{ maxWidth: '480px' }}>
        <div style={{ fontSize: '42px', marginBottom: '8px' }}>🏆</div>
        <h1 className="overlay-title">MISSION COMPLETED</h1>
        <p className="overlay-subtitle">PURSUIT DEBRIEFING REPORT</p>

        {/* Tactical Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          margin: '20px 0',
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1.5px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '14px',
            padding: '14px 12px',
          }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.1em', fontWeight: 800 }}>
              TOTAL BOUNTY
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
              {score.toLocaleString()}
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1.5px solid rgba(251, 191, 36, 0.35)',
            borderRadius: '14px',
            padding: '14px 12px',
          }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.1em', fontWeight: 800 }}>
              MAX STREAK
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#fbbf24', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
              🔥 ×{bestStreak}
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', fontSize: '14px', padding: '13px 24px' }}
          onClick={() => startNewGame()}
        >
          ▶ DEPLOY NEXT MISSION
        </button>
      </div>
    </div>
  );
}
