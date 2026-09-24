import { useGameStore } from '../../game/gameStore';
import { useProgress } from '@react-three/drei';

export function LoadingOverlay() {
  const { phase, startNewGame } = useGameStore();
  const { progress, active } = useProgress();

  if (phase !== 'menu' && phase !== 'loading') return null;

  const isLoading = phase === 'loading' || active || progress < 100;

  return (
    <div className="landing-screen">
      {/* Dynamic Background Effects */}
      <div className="landing-ambient-glow" />
      <div className="landing-grid-overlay" />
      
      {/* Top Left Branding */}
      <div className="landing-header anim-slide-up">
        <div className="radar-icon" style={{ fontSize: '24px' }}>
          🎯
        </div>
        <div className="brand-text">
          <h1>ROOFTOP PURSUIT</h1>
          <p>NIGHT OPERATIONS</p>
        </div>
      </div>

      {/* Center Cinematic Title */}
      <div className="landing-center-hero anim-slide-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="glitch-title">TACTICAL SNIPER</h2>
        <div className="hero-subtitle">URBAN CRIME SYNDICATE TAKEDOWN</div>
      </div>

      {/* Bottom Action Area */}
      <div className="landing-action-area anim-slide-up" style={{ animationDelay: '0.2s' }}>
        {isLoading ? (
          <div className="landing-loading-box">
             <div className="loading-status">ESTABLISHING SATELLITE UPLINK... {Math.round(progress)}%</div>
             <div className="loading-bar-container">
               <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
             </div>
          </div>
        ) : (
          <div className="landing-ready-box">
            <div className="mission-briefing-panel">
              <div className="briefing-title">🚨 MISSION BRIEFING</div>
              <p>You are stationed on the central 38-meter vantage tower. Your objective is to identify and eliminate the correct suspect based on the HQ trivia intelligence. Neutralize the target across the distant skyscrapers.</p>
              
              <div className="controls-row">
                <div className="control-item"><span>👆</span> SCOPE (Tap)</div>
                <div className="control-item"><span>🎯</span> FIRE (Button)</div>
                <div className="control-item"><span>🕹️</span> MOVE (Joystick)</div>
              </div>
            </div>
            
            <button className="deploy-btn-massive" onClick={() => startNewGame()}>
              ▶ DEPLOY TO FIELD
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
