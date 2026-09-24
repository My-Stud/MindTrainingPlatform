import { Play, Pause, RotateCcw } from 'lucide-react';
import { useGameStore } from '../../gameStore';

export function HUD({ onRestart }: { onRestart: () => void }) {
  const { score, gameState, togglePause } = useGameStore();

  return (
    <div className="top-hud">
      <div className="hud-left">
        <button className="icon-btn" onClick={togglePause}>
          {gameState === 'paused' ? <Play size={24} strokeWidth={3} /> : <Pause size={24} strokeWidth={3} />}
        </button>
        <button className="icon-btn" onClick={onRestart}>
          <RotateCcw size={24} strokeWidth={3} />
        </button>
      </div>
      <div className="hud-right">
        <div className="score-badge">
          <div className="coin-icon">★</div>
          {score}
        </div>
      </div>
    </div>
  );
}
