import { useGameStore } from '../../game/gameStore';

export function ResultFeedback() {
  const phase = useGameStore((s) => s.phase);
  const lastResult = useGameStore((s) => s.lastResult);
  const streak = useGameStore((s) => s.streak);

  if (phase !== 'resolving' || !lastResult) return null;

  const isCorrect = lastResult === 'correct';
  const isWrong = lastResult === 'wrong';

  return (
    <>
      {/* Screen Hit Vignette */}
      <div className={`screen-vignette ${isCorrect ? 'vignette--correct' : 'vignette--wrong'}`} />

      {/* Floating Tactical Banner */}
      <div className="feedback-top-container anim-slide-up">
        <div className={`feedback-badge ${isCorrect ? 'badge--correct' : isWrong ? 'badge--wrong' : 'badge--miss'}`}>
          <div className="badge-main-text">
            {isCorrect ? 'CORRECT HIT!' : isWrong ? 'WRONG HIT!' : 'MISSED!'}
          </div>
          <div className="badge-sub-text">
            {isCorrect
              ? `+100 BOUNTY ${streak > 1 ? `• 🔥 ×${streak} STREAK BONUS` : ''}`
              : isWrong
                ? '-25 BOUNTY PENALTY'
                : '-10 BOUNTY PENALTY'
            }
          </div>
        </div>
      </div>
    </>
  );
}
