import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SuspectTarget, SuspectLifecycle } from '../gameTypes';
import { useGameStore } from '../gameStore';
import { GAME_CONFIG } from '../gameConfig';

export interface SuspectHandle {
  triggerHit: () => void;
  getPosition: () => THREE.Vector3;
  getTargetId: () => string;
  getOptionIndex: () => number;
}

interface SuspectProps {
  target: SuspectTarget;
  paused: boolean;
  onLifecycleChange?: (id: string, lifecycle: SuspectLifecycle) => void;
}

// ── Vibrant High-Contrast Palettes ────────────────────────────────
export const SUSPECT_PALETTES = [
  { jacket: '#ef4444', pants: '#090d16', skin: '#f59e0b', accent: '#ef4444', letter: 'A', name: 'Red Thief' },
  { jacket: '#3b82f6', pants: '#090d16', skin: '#f59e0b', accent: '#60a5fa', letter: 'B', name: 'Blue Thief' },
  { jacket: '#f59e0b', pants: '#090d16', skin: '#d97706', accent: '#fbbf24', letter: 'C', name: 'Amber Thief' },
  { jacket: '#a855f7', pants: '#090d16', skin: '#f59e0b', accent: '#c084fc', letter: 'D', name: 'Purple Thief' },
];

// ── Floating Target Badge Texture ─────────────────────────────────
const badgeCache = new Map<string, THREE.CanvasTexture>();
function getBadgeTexture(letter: string, color: string): THREE.CanvasTexture {
  const key = `tgt_${letter}_${color}`;
  if (badgeCache.has(key)) return badgeCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;
  const cx = 80, cy = 80;

  // Outer Pulsing Glow
  const glow = ctx.createRadialGradient(cx, cy, 25, cx, cy, 76);
  glow.addColorStop(0, color + 'f0');
  glow.addColorStop(1, color + '00');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, 76, 0, Math.PI * 2);
  ctx.fill();

  // Dark High-Contrast Background Circle
  ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
  ctx.beginPath();
  ctx.arc(cx, cy, 54, 0, Math.PI * 2);
  ctx.fill();

  // Vibrant Outer Ring
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, 54, 0, Math.PI * 2);
  ctx.stroke();

  // Inner Accent Ring
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 46, 0, Math.PI * 2);
  ctx.stroke();

  // Bold Target Letter
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 64px "Orbitron", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  ctx.fillText(letter, cx, cy + 3);

  const tex = new THREE.CanvasTexture(canvas);
  badgeCache.set(key, tex);
  return tex;
}

export const SuspectThief = forwardRef<SuspectHandle, SuspectProps>(
  ({ target, paused, onLifecycleChange }, ref) => {
    const { phase } = useGameStore();

    const groupRef    = useRef<THREE.Group>(null);
    const bodyRef     = useRef<THREE.Group>(null);
    const headRef     = useRef<THREE.Group>(null);
    const torsoRef    = useRef<THREE.Group>(null);
    const lArmRef     = useRef<THREE.Group>(null);
    const rArmRef     = useRef<THREE.Group>(null);
    const lLegRef     = useRef<THREE.Group>(null);
    const rLegRef     = useRef<THREE.Group>(null);
    const badgeRef    = useRef<THREE.Sprite>(null);

    const cfg = GAME_CONFIG.suspects[target.optionIndex % GAME_CONFIG.suspects.length];
    const palette = SUSPECT_PALETTES[target.optionIndex % SUSPECT_PALETTES.length];
    const badgeTex = useMemo(() => getBadgeTexture(palette.letter, palette.accent), [palette]);

    // ── Death Ragdoll State ─────────────────────────────────────────
    const lifecycle    = useRef<SuspectLifecycle>('running');
    const deathTimer   = useRef(0);
    const deathPhase   = useRef<'impact' | 'fall' | 'abyss'>('impact');
    const deathVel     = useRef(new THREE.Vector3());
    const deathRotVel  = useRef(new THREE.Vector3());

    useImperativeHandle(ref, () => ({
      triggerHit: () => {
        if (lifecycle.current !== 'running') return;
        lifecycle.current = 'tackled';
        deathPhase.current = 'impact';
        deathTimer.current = 0.25;

        // Launch suspect backward and off the rooftop into abyss
        const sideKick = (Math.random() - 0.5) * 3.0;
        deathVel.current.set(sideKick, 3.8, -5.2);
        deathRotVel.current.set(4.2, sideKick * 1.6, sideKick * 0.9);
        onLifecycleChange?.(target.id, 'tackled');
      },
      getPosition: () =>
        groupRef.current
          ? groupRef.current.position.clone()
          : new THREE.Vector3(cfg.posX, cfg.roofY + 1.2, cfg.posZ),
      getTargetId:    () => target.id,
      getOptionIndex: () => target.optionIndex,
    }));

    useFrame((_, delta) => {
      const grp = groupRef.current;
      if (!grp) return;
      const dt = Math.min(delta, 0.05);

      // ── 1. CINEMATIC RAGDOLL DEATH ON SNIPER HIT ────────────────
      if (lifecycle.current === 'tackled') {
        deathTimer.current -= dt;

        if (deathPhase.current === 'impact') {
          // Bullet shock: violent backward recoil (whiplash)
          if (torsoRef.current) {
            torsoRef.current.rotation.x = THREE.MathUtils.lerp(torsoRef.current.rotation.x, -2.0, dt * 25);
          }
          if (headRef.current) {
            headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -1.8, dt * 30);
          }
          if (lArmRef.current) lArmRef.current.rotation.x = THREE.MathUtils.lerp(lArmRef.current.rotation.x, -3.1, dt * 25);
          if (rArmRef.current) rArmRef.current.rotation.x = THREE.MathUtils.lerp(rArmRef.current.rotation.x, -3.1, dt * 25);

          if (deathTimer.current <= 0) {
            deathPhase.current = 'fall';
            deathTimer.current = 2.8;
          }
        } else if (deathPhase.current === 'fall') {
          // Tumble & roll off distant skyscraper edge
          deathVel.current.y -= 18.0 * dt; // gravity
          grp.position.x += deathVel.current.x * dt;
          grp.position.y += deathVel.current.y * dt;
          grp.position.z += deathVel.current.z * dt;

          grp.rotation.x += deathRotVel.current.x * dt;
          grp.rotation.y += deathRotVel.current.y * dt;
          grp.rotation.z += deathRotVel.current.z * dt;

          // Flailing limbs during free-fall
          if (lLegRef.current) lLegRef.current.rotation.x = Math.sin(deathTimer.current * 9) * 1.2;
          if (rLegRef.current) rLegRef.current.rotation.x = -Math.sin(deathTimer.current * 9) * 1.2;
          if (lArmRef.current) lArmRef.current.rotation.x = Math.sin(deathTimer.current * 7) * 1.5;
          if (rArmRef.current) rArmRef.current.rotation.x = -Math.sin(deathTimer.current * 7) * 1.5;

          if (deathTimer.current <= 0) {
            deathPhase.current = 'abyss';
          }
        } else if (deathPhase.current === 'abyss') {
          deathVel.current.y -= 25.0 * dt;
          grp.position.y += deathVel.current.y * dt;
          if (badgeRef.current) {
            const sp = badgeRef.current.material as THREE.SpriteMaterial;
            sp.opacity = Math.max(0, sp.opacity - dt * 2.5);
          }
        }
        return;
      }

      if (paused) return;

      // ── 2. STATIONARY LOOKOUT IDLE POSTURE (NO ERRATIC RUNNING) ──
      // Thief stands firmly in place, looking around the city skyline
      const t = Date.now() * 0.0015 + target.optionIndex * 1.8;
      const breath = Math.sin(t * 1.4) * 0.03;

      // Stationary position on top of rooftop floor (full legs and shoes visible)
      grp.position.set(cfg.posX, cfg.roofY + 0.65 + breath, cfg.posZ);

      // Subtle natural breathing chest rise & fall
      if (torsoRef.current) {
        torsoRef.current.rotation.x = Math.sin(t * 1.4) * 0.04;
      }

      // Head slowly scanning the city on lookout
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 0.8) * 0.45;
        headRef.current.rotation.x = Math.sin(t * 1.2) * 0.08 - 0.05;
      }

      // Arms resting on waist / holding lookout stance
      if (lArmRef.current) lArmRef.current.rotation.z = -0.35 + Math.sin(t * 1.4) * 0.03;
      if (rArmRef.current) rArmRef.current.rotation.z =  0.35 - Math.sin(t * 1.4) * 0.03;

      // Floating Letter Badge hover
      if (badgeRef.current) {
        badgeRef.current.position.y = 4.4 + Math.sin(t * 2.0) * 0.12;
      }
    });

    const showBadge =
      lifecycle.current === 'running' &&
      ['playing', 'aiming', 'firing', 'resolving', 'countdown'].includes(phase);

    const J = palette.jacket;
    const P = palette.pants;
    const S = palette.skin;
    const A = palette.accent;

    return (
      <group ref={groupRef} position={[cfg.posX, cfg.roofY + 0.65, cfg.posZ]} scale={[2.5, 2.5, 2.5]}>
        <group ref={bodyRef}>
          {/* ── UPPER BODY & TORSO ── */}
          <group ref={torsoRef} position={[0, 1.10, 0]}>
            {/* Hoodie Jacket Body */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.36, 0.28, 0.76, 12]} />
              <meshStandardMaterial color={J} emissive={J} emissiveIntensity={0.85} roughness={0.5} />
            </mesh>

            {/* Broad Shoulders */}
            <mesh position={[0, 0.24, 0]} castShadow>
              <boxGeometry args={[0.92, 0.24, 0.44]} />
              <meshStandardMaterial color={J} emissive={J} emissiveIntensity={0.85} />
            </mesh>

            {/* Back Stencil Letter Badge */}
            <mesh position={[0, 0.12, 0.23]}>
              <planeGeometry args={[0.38, 0.38]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Glowing Accent Stripe across Chest/Back */}
            <mesh position={[0, 0.06, 0]}>
              <boxGeometry args={[0.78, 0.08, 0.46]} />
              <meshBasicMaterial color={A} />
            </mesh>

            {/* Hooded Head on Lookout (Scans Horizon) */}
            <group ref={headRef} position={[0, 0.64, 0]}>
              {/* Head / Face */}
              <mesh castShadow>
                <sphereGeometry args={[0.24, 16, 14]} />
                <meshStandardMaterial color={S} roughness={0.6} />
              </mesh>
              {/* Hood Shell */}
              <mesh position={[0, 0.06, -0.06]} rotation={[0.3, 0, 0]}>
                <cylinderGeometry args={[0.26, 0.29, 0.14, 14]} />
                <meshStandardMaterial color={J} emissive={J} emissiveIntensity={0.25} />
              </mesh>
              {/* Tactical Mask */}
              <mesh position={[0, -0.06, -0.16]}>
                <boxGeometry args={[0.22, 0.14, 0.14]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
            </group>

            {/* Loot Backpack */}
            <mesh position={[0, 0.08, 0.32]} rotation={[0.15, 0, 0]} castShadow>
              <boxGeometry args={[0.55, 0.65, 0.30]} />
              <meshStandardMaterial color="#78350f" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.08, 0.48]}>
              <boxGeometry args={[0.40, 0.06, 0.02]} />
              <meshBasicMaterial color="#fbbf24" />
            </mesh>

            {/* Left Arm on Lookout */}
            <group ref={lArmRef} position={[-0.48, 0.28, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.13, 8, 8]} />
                <meshStandardMaterial color={J} />
              </mesh>
              <mesh position={[0, -0.22, 0]} castShadow>
                <cylinderGeometry args={[0.10, 0.09, 0.46, 8]} />
                <meshStandardMaterial color={J} />
              </mesh>
              <mesh position={[0, -0.48, 0]} castShadow>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshStandardMaterial color={S} />
              </mesh>
            </group>

            {/* Right Arm on Lookout */}
            <group ref={rArmRef} position={[0.48, 0.28, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.13, 8, 8]} />
                <meshStandardMaterial color={J} />
              </mesh>
              <mesh position={[0, -0.22, 0]} castShadow>
                <cylinderGeometry args={[0.10, 0.09, 0.46, 8]} />
                <meshStandardMaterial color={J} />
              </mesh>
              <mesh position={[0, -0.48, 0]} castShadow>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshStandardMaterial color={S} />
              </mesh>
            </group>
          </group>

          {/* ── LOWER BODY & LEGS (Standing Firmly on Rooftop) ── */}
          <group position={[0, 0.74, 0]}>
            {/* Left Leg */}
            <group ref={lLegRef} position={[-0.20, 0, 0]}>
              <mesh position={[0, -0.24, 0]} castShadow>
                <cylinderGeometry args={[0.13, 0.11, 0.48, 8]} />
                <meshStandardMaterial color={P} />
              </mesh>
              <mesh position={[0, -0.48, 0]}>
                <sphereGeometry args={[0.11, 8, 8]} />
                <meshStandardMaterial color={P} />
              </mesh>
              <mesh position={[0, -0.72, 0]} castShadow>
                <cylinderGeometry args={[0.10, 0.08, 0.46, 8]} />
                <meshStandardMaterial color={P} />
              </mesh>
              {/* Sneaker */}
              <mesh position={[0, -0.96, -0.08]} castShadow>
                <boxGeometry args={[0.18, 0.14, 0.34]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.3} />
              </mesh>
            </group>

            {/* Right Leg */}
            <group ref={rLegRef} position={[0.20, 0, 0]}>
              <mesh position={[0, -0.24, 0]} castShadow>
                <cylinderGeometry args={[0.13, 0.11, 0.48, 8]} />
                <meshStandardMaterial color={P} />
              </mesh>
              <mesh position={[0, -0.48, 0]}>
                <sphereGeometry args={[0.11, 8, 8]} />
                <meshStandardMaterial color={P} />
              </mesh>
              <mesh position={[0, -0.72, 0]} castShadow>
                <cylinderGeometry args={[0.10, 0.08, 0.46, 8]} />
                <meshStandardMaterial color={P} />
              </mesh>
              {/* Sneaker */}
              <mesh position={[0, -0.96, -0.08]} castShadow>
                <boxGeometry args={[0.18, 0.14, 0.34]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.3} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ── FLOATING TARGET IDENTIFIER BADGE (A, B, C, D) ── */}
        {showBadge && (
          <sprite
            ref={badgeRef}
            position={[0, 4.8, 0]}
            scale={[4.8, 4.8, 1]}
            renderOrder={999}
          >
            <spriteMaterial
              map={badgeTex}
              transparent
              depthTest={false}
              depthWrite={false}
              toneMapped={false}
            />
          </sprite>
        )}
      </group>
    );
  }
);

SuspectThief.displayName = 'SuspectThief';
