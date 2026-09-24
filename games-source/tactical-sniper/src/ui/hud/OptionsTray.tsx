import { useGameStore } from '../../game/gameStore';
import { SUSPECT_PALETTES } from '../../game/entities/SuspectThief';

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function OptionsTray() {
  const questions = useGameStore((s) => s.questions);
  const currentQuestionIndex = useGameStore((s) => s.currentQuestionIndex);
  const phase = useGameStore((s) => s.phase);
  const lastResult = useGameStore((s) => s.lastResult);
  const lastCorrectAnswer = useGameStore((s) => s.lastCorrectAnswer);

  const visible =
    phase === 'countdown' || phase === 'playing' || phase === 'aiming' || phase === 'firing' ||
    phase === 'resolving' || phase === 'hint';

  if (!visible || !questions.length) return null;

  const currentQ = questions[currentQuestionIndex];
  if (!currentQ || !currentQ.options) return null;

  return (
    <div className="bgmi-squad-panel" aria-label="Target Suspect Profiles">
      <div className="bgmi-squad-header">
        <span className="squad-title">🎯 TARGETS</span>
      </div>

      <div className="bgmi-squad-list">
        {currentQ.options.map((optText, idx) => {
          const letter = OPTION_LETTERS[idx] || String.fromCharCode(65 + idx);
          const palette = SUSPECT_PALETTES[idx % SUSPECT_PALETTES.length];

          let statusClass = '';
          if (phase === 'resolving') {
            if (optText === lastCorrectAnswer) {
              statusClass = 'bgmi-card--correct';
            } else if (lastResult === 'wrong') {
              statusClass = 'bgmi-card--wrong';
            }
          }

          return (
            <div
              key={`opt-${idx}`}
              className={`bgmi-squad-item ${statusClass}`}
              style={{
                '--item-color': palette.jacket,
                '--item-accent': palette.accent,
              } as React.CSSProperties}
            >
              {/* Colored Target Letter Box (Like BGMI Player Number 1,2,3,4) */}
              <div
                className="bgmi-number-badge"
                style={{
                  background: palette.jacket,
                  boxShadow: `0 0 8px ${palette.accent}`,
                }}
              >
                <span>{letter}</span>
              </div>

              {/* Suspect Option Text */}
              <div className="bgmi-name-label">
                {optText}
              </div>

              {/* Status Indicator */}
              {phase === 'resolving' && optText === lastCorrectAnswer && (
                <div className="bgmi-status-pill">
                  ✔
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
