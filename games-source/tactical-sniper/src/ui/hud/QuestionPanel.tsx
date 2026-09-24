import { useGameStore } from '../../game/gameStore';

export function QuestionPanel() {
  const questions = useGameStore((s) => s.questions);
  const currentQuestionIndex = useGameStore((s) => s.currentQuestionIndex);
  const phase = useGameStore((s) => s.phase);

  const visible =
    phase === 'countdown' || phase === 'playing' || phase === 'aiming' || phase === 'firing' ||
    phase === 'resolving' || phase === 'paused' || phase === 'hint';

  if (!visible || !questions.length) return null;

  const q = questions[currentQuestionIndex];
  const total = questions.length;
  const num = currentQuestionIndex + 1;

  return (
    <div className="arcade-question-header" aria-label="Mission Intelligence Trivia Question">
      <div className="arcade-question-badge">
        <span className="q-tag">Q. {String(num).padStart(2, '0')}</span>
        <span className="q-total">/ {total}</span>
      </div>
      <div className="arcade-question-question">
        {q.question}
      </div>
    </div>
  );
}
