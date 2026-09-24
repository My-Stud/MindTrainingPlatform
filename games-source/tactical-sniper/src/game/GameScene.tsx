import {
  useRef, useState, useMemo, useCallback, useEffect,
  forwardRef, useImperativeHandle, Suspense,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from './gameStore';
import { GAME_CONFIG } from './gameConfig';
import { CityEnvironment } from './scene/CityEnvironment';
import { RooftopArena } from './scene/RooftopArena';
import { PoliceOfficer, type PoliceOfficerHandle } from './entities/PoliceOfficer';
import { SuspectThief, type SuspectHandle } from './entities/SuspectThief';
import { BulletProjectile } from './entities/BulletProjectile';
import { ImpactEffect } from './effects/ImpactEffect';
import { RainSystem } from './effects/GameEffects';
import { RooftopAudio } from '../audio/RooftopAudioManager';
import { useKeyboard, type KeyState } from '../controls/useKeyboard';
import { VirtualJoystick, type JoystickOutput } from '../controls/VirtualJoystick';
import { ScopeOverlay } from '../ui/overlays/ScopeOverlay';
import type { SuspectTarget } from './gameTypes';
import { HitMarker } from './effects/GameEffects';

export interface GameSceneHandle {
  setMobileKeys: (keys: Partial<KeyState>) => void;
  triggerShoot: () => void;
}

interface BulletState {
  id: number;
  origin: THREE.Vector3;
  velocity: THREE.Vector3;
  sessionId: number;
}

interface ImpactItem {
  id: number;
  pos: THREE.Vector3;
  normal: THREE.Vector3;
  type: 'blood' | 'concrete';
}

// ── Scene Inner ──────────────────────────────────────────────────
interface SceneInnerProps {
  externalKeys: React.MutableRefObject<KeyState>;
  fireSignal: React.MutableRefObject<boolean>;
  playerRef: React.RefObject<PoliceOfficerHandle>;
  onScopeChange?: (v: boolean) => void;
  onHitResult?: (type: 'kill' | 'wrong' | 'miss') => void;
}

function SceneInner({ externalKeys, fireSignal, playerRef, onScopeChange, onHitResult }: SceneInnerProps) {
  const {
    phase, questions, currentQuestionIndex, questionSessionId,
    resolveEncounter, advanceQuestion,
  } = useGameStore();

  const { keys: kbKeys, oneShot } = useKeyboard();
  const unified = useRef<KeyState>({ left: false, right: false, up: false, down: false });
  const launchSignal = useRef(false);

  const suspectRefs = useRef<(SuspectHandle | null)[]>([]);
  const suspectIds = useRef<string[]>([]);
  const hasResolved = useRef(false);

  const [bullets, setBullets] = useState<BulletState[]>([]);
  const [impacts, setImpacts] = useState<ImpactItem[]>([]);
  const counter = useRef(0);

  const targets = useMemo<SuspectTarget[]>(() => {
    if (!questions.length) return []
    const q = questions[currentQuestionIndex];
    if (!q.options) return [];
    return q.options.map((opt, i) => {
      const b = GAME_CONFIG.suspects[i % GAME_CONFIG.suspects.length];
      return { id: `s-${questionSessionId}-${i}`, optionIndex: i, optionText: opt, isCorrect: opt === q.answer, laneX: b.posX };
    });
  }, [questions, currentQuestionIndex, questionSessionId]);

  useEffect(() => {
    suspectIds.current = targets.map(t => t.id);
    hasResolved.current = false;
  }, [targets]);

  useEffect(() => {
    if (phase !== 'countdown') return;
    let c = GAME_CONFIG.timing.countdownSeconds;
    const iv = setInterval(() => {
      c--;
      if (c <= 0) {
        clearInterval(iv);
        useGameStore.getState().setPhase('playing');
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [phase]);

  useFrame(() => {
    unified.current.left = kbKeys.current.left || externalKeys.current.left;
    unified.current.right = kbKeys.current.right || externalKeys.current.right;
    unified.current.up = kbKeys.current.up || externalKeys.current.up;
    unified.current.down = kbKeys.current.down || externalKeys.current.down;

    if (oneShot.current.space || fireSignal.current) {
      oneShot.current.space = false;
      fireSignal.current = false;
      const p = useGameStore.getState().phase;
      if (p === 'playing' || p === 'aiming') {
        useGameStore.getState().setPhase('firing');
        launchSignal.current = true;
      }
    }
  });

  const onShoot = useCallback((origin: THREE.Vector3, velocity: THREE.Vector3) => {
    counter.current++;
    setBullets(prev => [...prev, { id: counter.current, origin: origin.clone(), velocity: velocity.clone(), sessionId: questionSessionId }]);
  }, [questionSessionId]);

  const onHitSuspect = useCallback((id: string, hitPos: THREE.Vector3, hitVel: THREE.Vector3) => {
    if (hasResolved.current) return;
    hasResolved.current = true;
    const hit = targets.find(t => t.id === id);
    const correct = targets.find(t => t.isCorrect);
    setImpacts(prev => [...prev, { id: Date.now(), pos: hitPos.clone(), normal: hitVel.clone().normalize(), type: 'blood' }]);

    if (hit?.isCorrect) {
      onHitResult?.('kill');
      RooftopAudio.play('hit_body');
      RooftopAudio.play('radio');
      resolveEncounter('correct', correct?.optionText ?? '');
    } else {
      onHitResult?.('wrong');
      RooftopAudio.play('hit_body');
      resolveEncounter('wrong', correct?.optionText ?? '');
    }
    setTimeout(() => { advanceQuestion(); }, GAME_CONFIG.timing.resolvingDelayMs);
  }, [targets, resolveEncounter, advanceQuestion, onHitResult]);

  const onMiss = useCallback((hitPos: THREE.Vector3, hitVel: THREE.Vector3) => {
    if (hasResolved.current) return;
    hasResolved.current = true;
    onHitResult?.('miss');
    RooftopAudio.play('hit_concrete');
    const correct = targets.find(t => t.isCorrect);
    setImpacts(prev => [...prev, { id: Date.now(), pos: hitPos.clone(), normal: hitVel.clone().normalize(), type: 'concrete' }]);
    resolveEncounter('miss', correct?.optionText ?? '');
    setTimeout(() => { advanceQuestion(); }, GAME_CONFIG.timing.resolvingDelayMs);
  }, [targets, resolveEncounter, advanceQuestion, onHitResult]);

  const paused = phase === 'paused';

  return (
    <>
      {/* ── CINEMATIC CITY NIGHT LIGHTING ── */}
      <hemisphereLight args={['#93c5fd', '#020617', 2.4]} />

      {/* Main Moonlight Key Light */}
      <directionalLight
        position={[25, 65, 20]}
        intensity={4.2}
        color="#e0f2fe"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={160}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />

      {/* City Glow Amber Fill from Below */}
      <directionalLight position={[-15, -10, 10]} intensity={1.8} color="#f59e0b" />

      {/* Volumetric Fog */}
      <fog attach="fog" args={['#030b1a', 100, 300]} />

      {/* City Background & Multi-Skyscraper Arena */}
      <CityEnvironment />
      <RooftopArena />
      <RainSystem />

      {/* Police Officer — FPP Camera + Viewmodel + Legs */}
      <PoliceOfficer
        ref={playerRef}
        keys={unified}
        fireSignal={launchSignal}
        onShootBullet={onShoot}
        paused={paused}
        onScopeChange={onScopeChange}
      />

      {/* 4 Vivid Parkour Suspects on Separate Rooftops */}
      {targets.map((tgt, i) => (
        <SuspectThief
          key={tgt.id}
          ref={h => { suspectRefs.current[i] = h; }}
          target={tgt}
          paused={paused}
        />
      ))}

      {/* Ballistic Bullets */}
      {bullets.map(b => (
        <BulletProjectile
          key={`b-${b.id}`}
          origin={b.origin}
          velocity={b.velocity}
          sessionId={b.sessionId}
          suspectHandles={suspectRefs}
          suspectTargetIds={suspectIds.current}
          onHitSuspect={onHitSuspect}
          onHitConcrete={onMiss}
          onDestroy={() => setBullets(prev => prev.filter(x => x.id !== b.id))}
        />
      ))}

      {/* Impact Effects (Blood / Concrete) */}
      {impacts.map(imp => (
        <ImpactEffect
          key={`imp-${imp.id}`}
          position={imp.pos}
          normal={imp.normal}
          type={imp.type}
          onComplete={() => setImpacts(prev => prev.filter(x => x.id !== imp.id))}
        />
      ))}
    </>
  );
}

// ── Root Game Canvas & Full HUD Controls ─────────────────────────
export const GameScene = forwardRef<GameSceneHandle, {}>(function GameScene(_props, ref) {
  const externalKeys = useRef<KeyState>({ left: false, right: false, up: false, down: false });
  const fireSignal = useRef(false);
  const playerRef = useRef<PoliceOfficerHandle>(null);
  const [isScoped, setIsScoped] = useState(false);
  const [hitType, setHitType] = useState<'kill' | 'wrong' | 'miss' | null>(null);

  useImperativeHandle(ref, () => ({
    setMobileKeys: k => { Object.assign(externalKeys.current, k); },
    triggerShoot: () => {
      const p = useGameStore.getState().phase;
      if (p === 'playing' || p === 'aiming') {
        useGameStore.getState().setPhase('firing');
        playerRef.current?.fireWeapon();
      }
    },
  }));

  // 4-Way Joystick Input handler
  const handleJoystick = useCallback((out: JoystickOutput) => {
    externalKeys.current.left = out.left;
    externalKeys.current.right = out.right;
    externalKeys.current.up = out.up;
    externalKeys.current.down = out.down;
  }, []);

  // Fire Weapon
  const handleJoyShoot = useCallback(() => {
    const p = useGameStore.getState().phase;
    if (p === 'playing' || p === 'aiming') {
      useGameStore.getState().setPhase('firing');
      playerRef.current?.fireWeapon();
    }
  }, []);

  // Reset scope state when a new question arrives or phase changes
  const currentQuestionIndex = useGameStore(s => s.currentQuestionIndex);
  const phase = useGameStore(s => s.phase);
  useEffect(() => {
    setIsScoped(false);
    playerRef.current?.setScoped(false);
  }, [currentQuestionIndex, phase]);

  // Toggle Scope (Tap to Toggle)
  const handleToggleScope = useCallback(() => {
    setIsScoped(prev => {
      const next = !prev;
      playerRef.current?.setScoped(next);
      return next;
    });
  }, []);

  const onScopeChange = useCallback((v: boolean) => { setIsScoped(v); }, []);

  const handleHitResult = useCallback((type: 'kill' | 'wrong' | 'miss') => {
    setHitType(type);
    setTimeout(() => setHitType(null), 500);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{ position: [CFG.police.baseX, CFG.police.baseY + 1.65, CFG.police.baseZ], fov: 72 }}
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
      >
        <Suspense fallback={null}>
          <SceneInner
            externalKeys={externalKeys}
            fireSignal={fireSignal}
            playerRef={playerRef}
            onScopeChange={onScopeChange}
            onHitResult={handleHitResult}
          />
        </Suspense>
      </Canvas>

      {/* ── Standard Tactical Crosshair (Visible when not Scoped) ── */}
      {!isScoped && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none', zIndex: 96,
        }}>
          {/* Horizontal Reticle Lines */}
          <div style={{ position: 'absolute', width: 24, height: 2, background: 'rgba(255,255,255,0.85)', top: -1, left: -28, borderRadius: 1 }} />
          <div style={{ position: 'absolute', width: 24, height: 2, background: 'rgba(255,255,255,0.85)', top: -1, left: 4, borderRadius: 1 }} />
          {/* Vertical Reticle Lines */}
          <div style={{ position: 'absolute', width: 2, height: 20, background: 'rgba(255,255,255,0.85)', left: -1, top: -24, borderRadius: 1 }} />
          <div style={{ position: 'absolute', width: 2, height: 20, background: 'rgba(255,255,255,0.85)', left: -1, top: 4, borderRadius: 1 }} />
          {/* Center Red Precision Aim Dot */}
          <div style={{ position: 'absolute', width: 4, height: 4, background: '#ef4444', borderRadius: '50%', top: -2, left: -2, boxShadow: '0 0 6px #ef4444' }} />
        </div>
      )}

      {/* ── Hit Marker (Red X flash on suspect hit) ── */}
      <HitMarker type={hitType} />

      {/* ── Mil-Dot Sniper Scope Overlay (Active during ADS) ── */}
      <ScopeOverlay visible={isScoped} onClose={handleToggleScope} />

      {/* ── 4-Way Mobile Virtual Joystick & Action Buttons ── */}
      <VirtualJoystick
        onChange={handleJoystick}
        onShoot={handleJoyShoot}
        onToggleScope={handleToggleScope}
        isScoped={isScoped}
      />
    </div>
  );
});
GameScene.displayName = 'GameScene';

const CFG = GAME_CONFIG;
