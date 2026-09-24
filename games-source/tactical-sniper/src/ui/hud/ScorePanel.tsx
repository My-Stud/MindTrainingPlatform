import { useState, useEffect } from 'react';
import { useGameStore } from '../../game/gameStore';

export function ScorePanel() {
  const score = useGameStore((s) => s.score);
  const streak = useGameStore((s) => s.streak);
  const phase = useGameStore((s) => s.phase);

  const [prevScore, setPrevScore] = useState(score);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (score !== prevScore) {
      setPrevScore(score);
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 400);
      return () => clearTimeout(t);
    }
  }, [score, prevScore]);

  const visible =
    phase === 'playing' || phase === 'aiming' || phase === 'firing' ||
    phase === 'resolving' || phase === 'paused' || phase === 'hint';

  if (!visible) return null;

  return (
    <div className="score-panel glass">
      <div className="score-badge">BOUNTY</div>
      <div className={`score-value ${animating ? 'pulse' : ''}`}>
        {score.toLocaleString()}
      </div>
      {streak > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(251, 191, 36, 0.2)', padding: '4px 8px', borderRadius: '8px' }}>
          <span style={{ fontSize: '14px' }}>🔥</span>
          <span style={{ color: '#fbbf24', fontWeight: 900, fontFamily: 'var(--font-heading)', fontSize: '12px' }}>× {streak}</span>
        </div>
      )}
    </div>
  );
}
