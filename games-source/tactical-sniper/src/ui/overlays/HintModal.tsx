import { useGameStore } from '../../game/gameStore';

export function HintModal() {
  const { hintVisible, setHintVisible, questions, currentQuestionIndex } = useGameStore();

  if (!hintVisible || !questions.length) return null;

  const currentQ = questions[currentQuestionIndex];
  if (!currentQ) return null;

  return (
    <div className="overlay-backdrop" style={{ zIndex: 200 }} onClick={() => setHintVisible(false)}>
      <div className="overlay-card anim-slide-up" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: '36px', marginBottom: '6px' }}>💡</div>
        <h2 className="overlay-title">TACTICAL INTEL</h2>
        <p className="overlay-subtitle">MISSION SURVEILLANCE DATA</p>

        <div style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '14px',
          padding: '16px',
          color: '#e0f2fe',
          fontSize: '15px',
          lineHeight: '1.6',
          margin: '18px 0',
          textAlign: 'left',
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
        }}>
          {currentQ.hint || 'No surveillance intel available for this target.'}
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setHintVisible(false)}
          style={{ width: '100%', fontSize: '13px' }}
        >
          RETURN TO PURSUIT
        </button>
      </div>
    </div>
  );
}
