import { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { fetchQuestions } from './services/api';
import type { QuizQuestion } from './types/api';

let audioCtx: AudioContext | null = null;
type GameState = 'menu' | 'playing' | 'paused' | 'gameover';

const OPT_COLORS = ['#e84040', '#2d7cff', '#2ecf72', '#f5a623'];
const LETTERS = ['A', 'B', 'C', 'D'];

function App() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalRight, setTotalRight] = useState(0);
  const [removedOptions, setRemovedOptions] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startGame = async () => {
    setApiError(null);
    setIsLoading(true);
    try {
      const data = await fetchQuestions();
      setQuestions(data);
      setScore(0); setStreak(0); setTotalRight(0);
      setCurrentQuestionIndex(0);
      setRemovedOptions([]);
      setGameState('playing');
    } catch (e: any) {
      setApiError(e.message || 'Failed to load questions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      playSound('correct');
      setScore(s => s + 100);
      setStreak(s => s + 1);
      setTotalRight(t => t + 1);
    } else {
      playSound('wrong');
      setScore(s => s - 10);
      setStreak(0);
    }
    setRemovedOptions([]);
    setShowHint(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      setGameState('gameover');
    }
  };

  const playSound = (type: 'correct' | 'wrong' | 'jump') => {
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, audioCtx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    } else {
      osc.type = 'square';
      osc.frequency.setValueAtTime(280, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(560, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    }
    osc.start(); osc.stop(audioCtx.currentTime + 0.4);
  };

  const handleFiftyFifty = () => {
    const q = questions[currentQuestionIndex];
    if (!q || removedOptions.length > 0) return;
    const wrong = q.options.filter(o => o !== q.answer);
    setRemovedOptions(wrong.sort(() => 0.5 - Math.random()).slice(0, 2));
  };

  const togglePause = () => setGameState(s => s === 'playing' ? 'paused' : 'playing');

  const dispatchKey = (key: string, type: 'keydown' | 'keyup') => {
    window.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true }));
  };

  const currentQ = questions[currentQuestionIndex];
  const isPlaying = gameState === 'playing' || gameState === 'paused';

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden', background: '#1a3a6e' }}>

      {/* Canvas */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <GameCanvas
          question={currentQ}
          gameState={gameState}
          removedOptions={removedOptions}
          onAnswer={handleAnswer}
          playSound={playSound}
        />
      </div>

      {/* ── DESKTOP HUD ──────────────────────────────────── */}
      <div className="desktop-ui" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
        {isPlaying && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            padding: '12px 16px',
            display: 'flex', alignItems: 'flex-start', gap: '12px',
            pointerEvents: 'auto',
          }}>
            {/* Left controls */}
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button id="btn-pause" className="icon-btn" onClick={togglePause} title="Pause">
                {gameState === 'playing' ? '⏸' : '▶'}
              </button>
              <button id="btn-restart" className="icon-btn" onClick={() => setShowRestartModal(true)} title="Restart">
                ↺
              </button>
            </div>

            {/* Question + Options center */}
            <div className="glass-panel" style={{
              flex: 1, padding: '14px 18px',
              display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0
            }}>
              <p style={{ textAlign: 'center', fontWeight: 800, fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)', lineHeight: 1.4 }}>
                {currentQ?.question}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {currentQ?.options.map((opt, idx) => (
                  <div key={idx} className={`opt-pill${removedOptions.includes(opt) ? ' removed' : ''}`}
                    style={{ background: OPT_COLORS[idx] + '22', borderColor: OPT_COLORS[idx] + '55', minWidth: 180, flex: '1 1 180px', maxWidth: 320 }}>
                    <span className="opt-letter" style={{ background: OPT_COLORS[idx] }}>{LETTERS[idx]}</span>
                    {opt}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — score + powerups */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div className="score-badge">⭐ {score}</div>
                {streak > 1 && (
                  <div style={{ background: 'rgba(255,100,40,0.2)', border: '1px solid rgba(255,100,40,0.4)', borderRadius: 999, padding: '4px 12px', fontWeight: 800, fontSize: '0.82rem', color: '#ff8040' }}>
                    🔥 {streak}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button id="btn-5050" className="ui-btn" onClick={handleFiftyFifty} disabled={removedOptions.length > 0}>
                  50/50
                </button>
                <button id="btn-hint" className="ui-btn" onClick={() => setShowHint(true)} disabled={!currentQ?.hint}>
                  💡 Hint
                </button>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textAlign: 'right' }}>
                {currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE HUD ───────────────────────────────────── */}
      <div className="mobile-ui" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
        {isPlaying && (
          <>
            {/* TOP: Question + options */}
            <div className="glass-panel animate-fade-in" style={{ margin: '0', borderRadius: '0 0 16px 16px', padding: '10px 12px', pointerEvents: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Score row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="score-badge" style={{ fontSize: '0.78rem', padding: '3px 10px' }}>⭐ {score}</div>
                {streak > 1 && (
                  <div style={{ background: 'rgba(255,100,40,0.2)', border: '1px solid rgba(255,100,40,0.35)', borderRadius: 999, padding: '3px 10px', fontWeight: 800, fontSize: '0.75rem', color: '#ff8040' }}>
                    🔥 {streak}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="icon-btn" style={{ width: 32, height: 32, fontSize: '0.9rem', borderRadius: 8 }} onClick={togglePause}>{gameState === 'playing' ? '⏸' : '▶'}</button>
                  <button className="icon-btn" style={{ width: 32, height: 32, fontSize: '0.9rem', borderRadius: 8 }} onClick={() => setShowRestartModal(true)}>↺</button>
                </div>
              </div>

              {/* Question */}
              <p style={{ fontWeight: 800, fontSize: '1.05rem', textAlign: 'center', lineHeight: 1.35 }}>{currentQ?.question}</p>

              {/* Options 2x2 grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {currentQ?.options.map((opt, idx) => (
                  <div key={idx} className={`opt-pill${removedOptions.includes(opt) ? ' removed' : ''}`}
                    style={{ background: OPT_COLORS[idx] + '22', borderColor: OPT_COLORS[idx] + '55', fontSize: '0.73rem', padding: '7px 10px' }}>
                    <span className="opt-letter" style={{ background: OPT_COLORS[idx], width: 18, height: 18, fontSize: '0.72rem', borderRadius: 5 }}>{LETTERS[idx]}</span>
                    {opt}
                  </div>
                ))}
              </div>

              {/* Powerups */}
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                <button className="ui-btn" style={{ fontSize: '0.72rem', padding: '5px 12px' }} onClick={handleFiftyFifty} disabled={removedOptions.length > 0}>50/50</button>
                <button className="ui-btn" style={{ fontSize: '0.72rem', padding: '5px 12px' }} onClick={() => setShowHint(true)} disabled={!currentQ?.hint}>💡 Hint</button>
              </div>
            </div>

            {/* BOTTOM: Controls */}
            <div style={{ padding: '0 4px 4px', pointerEvents: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="ctrl-btn"
                  onTouchStart={e => { e.preventDefault(); dispatchKey('ArrowLeft', 'keydown'); }}
                  onTouchEnd={e => { e.preventDefault(); dispatchKey('ArrowLeft', 'keyup'); }}>←</button>
                <button className="ctrl-btn"
                  onTouchStart={e => { e.preventDefault(); dispatchKey('ArrowRight', 'keydown'); }}
                  onTouchEnd={e => { e.preventDefault(); dispatchKey('ArrowRight', 'keyup'); }}>→</button>
              </div>
              <button className="ctrl-btn" style={{ width: 72, height: 72, fontSize: '2rem', borderRadius: 18, background: 'rgba(245,200,66,0.15)', borderColor: 'rgba(245,200,66,0.4)' }}
                onTouchStart={e => { e.preventDefault(); dispatchKey('ArrowUp', 'keydown'); }}
                onTouchEnd={e => { e.preventDefault(); dispatchKey('ArrowUp', 'keyup'); }}>↑</button>
            </div>
          </>
        )}
      </div>

      {/* ── MODALS ───────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 100 }}>

        {/* MENU */}
        {gameState === 'menu' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '48px 52px', textAlign: 'center', pointerEvents: 'auto', maxWidth: 480, width: '90%' }}>
            <div style={{ fontSize: '3.6rem', marginBottom: 8 }}>🏙️</div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, marginBottom: 10, letterSpacing: '-0.01em' }}>
              City Quiz Run
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 32, lineHeight: 1.5, fontSize: '0.95rem' }}>
              Sprint through the city skyline. Jump onto the correct answer stone before time runs out!
            </p>
            {apiError && <div style={{ color: 'var(--danger)', marginBottom: 16, fontWeight: 700, fontSize: '0.9rem' }}>{apiError}</div>}
            <button id="btn-play" className="ui-btn primary pulse" style={{ fontSize: '1.1rem', padding: '14px 48px', borderRadius: 14, width: '100%' }} onClick={startGame} disabled={isLoading}>
              {isLoading ? 'Loading...' : '▶  Play'}
            </button>
            <p style={{ marginTop: 20, color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>Arrow keys / WASD to move · Space to jump</p>
          </div>
        )}

        {/* GAME OVER */}
        {gameState === 'gameover' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '44px 48px', textAlign: 'center', pointerEvents: 'auto', maxWidth: 420, width: '90%' }}>
            <div style={{ fontSize: '3rem', marginBottom: 8 }}>🏁</div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 900, marginBottom: 20 }}>Round Complete</h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 28 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>{score}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>SCORE</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--success)' }}>{totalRight}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>CORRECT</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ff8040' }}>{streak}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>STREAK</div>
              </div>
            </div>
            {apiError && <div style={{ color: 'var(--danger)', marginBottom: 16, fontWeight: 700 }}>{apiError}</div>}
            <button id="btn-again" className="ui-btn primary" style={{ fontSize: '1rem', padding: '13px 40px', borderRadius: 12, width: '100%' }} onClick={startGame} disabled={isLoading}>
              {isLoading ? 'Loading...' : '▶  Play Again'}
            </button>
          </div>
        )}

        {/* HINT */}
        {showHint && (
          <div className="glass-panel animate-fade-in" style={{ padding: '32px 36px', pointerEvents: 'auto', maxWidth: 380, width: '90%' }}>
            <h3 style={{ fontWeight: 800, marginBottom: 12, fontSize: '1rem' }}>💡 Hint</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, fontSize: '0.9rem' }}>{currentQ?.hint}</p>
            <button className="ui-btn" style={{ marginTop: 20, width: '100%' }} onClick={() => setShowHint(false)}>Close</button>
          </div>
        )}

        {/* RESTART CONFIRM */}
        {showRestartModal && (
          <div className="glass-panel animate-fade-in" style={{ padding: '32px 36px', pointerEvents: 'auto', maxWidth: 360, width: '90%', textAlign: 'center' }}>
            <h3 style={{ fontWeight: 800, marginBottom: 10, fontSize: '1.05rem' }}>Restart Game?</h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 24, fontSize: '0.88rem' }}>All progress will be lost.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="ui-btn" style={{ flex: 1 }} onClick={() => setShowRestartModal(false)}>Cancel</button>
              <button className="ui-btn danger" style={{ flex: 1 }} onClick={() => { setShowRestartModal(false); startGame(); }}>Restart</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
