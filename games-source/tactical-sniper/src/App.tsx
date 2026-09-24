import { useRef } from 'react';
import { useGameStore } from './game/gameStore';
import { GameScene, type GameSceneHandle } from './game/GameScene';
import { QuestionPanel } from './ui/hud/QuestionPanel';
import { ScorePanel } from './ui/hud/ScorePanel';
import { ControlBar } from './ui/hud/ControlBar';
import { OptionsTray } from './ui/hud/OptionsTray';
import { LoadingOverlay } from './ui/overlays/LoadingOverlay';
import { CountdownOverlay } from './ui/overlays/CountdownOverlay';
import { ResultFeedback } from './ui/overlays/ResultFeedback';
import { PauseOverlay } from './ui/overlays/PauseOverlay';
import { HintModal } from './ui/overlays/HintModal';
import { GameOverOverlay } from './ui/overlays/GameOverOverlay';
import { ErrorOverlay } from './ui/overlays/ErrorOverlay';

export default function App() {
  const sceneRef = useRef<GameSceneHandle>(null);
  const phase = useGameStore((s) => s.phase);

  const isCombatActive = phase === 'playing' || phase === 'aiming';

  return (
    <main className="game-root" aria-label="Rooftop Tactical Police Encounter">
      {/* 3D WebGL Canvas Layer */}
      <GameScene ref={sceneRef} />

      {/* 2D Tactical Intelligence HUD Layer */}
      <section className="hud-layer" aria-label="Tactical Police HUD">
        <ControlBar />
        <QuestionPanel />
        <ScorePanel />
        <OptionsTray />
        <ResultFeedback />

        {/* Desktop Tactical SHOOT Action Button */}
        {isCombatActive && (
          <div className="desktop-fire-container">
            <button
              className="desktop-fire-btn"
              onClick={() => sceneRef.current?.triggerShoot()}
              aria-label="Fire Sniper Rifle (Space)"
            >
              <span>🎯</span>
              <span>SHOOT</span>
            </button>
            <span className="desktop-fire-hint">PRESS SPACE</span>
          </div>
        )}

        {/* Mobile Dual-Thumb Controls */}
        {isCombatActive && (
          <div className="mobile-controls" aria-label="Virtual Touch Controls">
            {/* Left Thumb: Ledge Movement Strafe */}
            <div className="move-group">
              <button
                className="move-btn"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  sceneRef.current?.setMobileKeys({ left: true });
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  sceneRef.current?.setMobileKeys({ left: false });
                }}
                onPointerLeave={(e) => {
                  e.stopPropagation();
                  sceneRef.current?.setMobileKeys({ left: false });
                }}
                aria-label="Strafe Left"
              >
                ◀
              </button>
              <button
                className="move-btn"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  sceneRef.current?.setMobileKeys({ right: true });
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  sceneRef.current?.setMobileKeys({ right: false });
                }}
                onPointerLeave={(e) => {
                  e.stopPropagation();
                  sceneRef.current?.setMobileKeys({ right: false });
                }}
                aria-label="Strafe Right"
              >
                ▶
              </button>
            </div>

            {/* Right Thumb: Tactical Shoot Button */}
            <button
              className="fire-btn-mobile"
              onPointerDown={(e) => {
                e.stopPropagation();
                sceneRef.current?.triggerShoot();
              }}
              aria-label="Shoot Target"
            >
              🎯 FIRE
            </button>
          </div>
        )}
      </section>

      {/* Screen Modals & Overlays */}
      <LoadingOverlay />
      <CountdownOverlay />
      <PauseOverlay />
      <HintModal />
      <GameOverOverlay />
      <ErrorOverlay />
    </main>
  );
}
