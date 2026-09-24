import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────
//  RAIN PARTICLE SYSTEM — cinematic city rain falling past the tower
// ─────────────────────────────────────────────────────────────────

const RAIN_COUNT = 2400;
const _dummy = new THREE.Object3D();

export function RainSystem() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const positions = useRef<Float32Array>(new Float32Array(RAIN_COUNT * 3));
  const velocities = useRef<Float32Array>(new Float32Array(RAIN_COUNT));

  useEffect(() => {
    const pos = positions.current;
    const vel = velocities.current;
    for (let i = 0; i < RAIN_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = Math.random() * 80 - 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120 - 20;
      vel[i]         = 28 + Math.random() * 18;
    }
  }, []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dt = Math.min(delta, 0.05);
    const pos = positions.current;
    const vel = velocities.current;

    for (let i = 0; i < RAIN_COUNT; i++) {
      pos[i * 3 + 1] -= vel[i] * dt;
      // Slight diagonal wind drift
      pos[i * 3]     += 1.5 * dt;
      pos[i * 3 + 2] -= 0.5 * dt;
      // Reset above when falling below city
      if (pos[i * 3 + 1] < -110) {
        pos[i * 3]     = (Math.random() - 0.5) * 120;
        pos[i * 3 + 1] = 80;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 120 - 20;
      }
      _dummy.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
      _dummy.scale.set(0.04, 0.55 + Math.random() * 0.35, 0.04);
      _dummy.rotation.set(0.12, 0, 0.04);
      _dummy.updateMatrix();
      mesh.setMatrixAt(i, _dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, RAIN_COUNT]} renderOrder={2}>
      <cylinderGeometry args={[1, 1, 1, 3]} />
      <meshBasicMaterial color="#93c5fd" transparent opacity={0.30} depthWrite={false} />
    </instancedMesh>
  );
}

// ─────────────────────────────────────────────────────────────────
//  SCREEN SHAKE — camera trauma system used on gunfire / hits
// ─────────────────────────────────────────────────────────────────

export function useScreenShake() {
  const trauma = useRef(0);

  const addTrauma = (amount: number) => {
    trauma.current = Math.min(1, trauma.current + amount);
  };

  useFrame(({ camera }, delta) => {
    if (trauma.current <= 0) return;
    const dt = Math.min(delta, 0.05);
    const shake = trauma.current * trauma.current;
    const t = Date.now() * 0.01;
    const ox = Math.sin(t * 1.7) * Math.cos(t * 2.3) * shake * 0.08;
    const oy = Math.sin(t * 2.1) * Math.cos(t * 1.9) * shake * 0.08;
    camera.position.x += ox;
    camera.position.y += oy;
    trauma.current = Math.max(0, trauma.current - dt * 2.8);
  });

  return addTrauma;
}

// ─────────────────────────────────────────────────────────────────
//  HIT MARKER — Red X indicator on screen center on bullet hit
// ─────────────────────────────────────────────────────────────────

interface HitMarkerProps {
  type: 'kill' | 'wrong' | 'miss' | null;
}

export function HitMarker({ type }: HitMarkerProps) {
  if (!type) return null;

  const color = type === 'kill' ? '#ef4444' : type === 'wrong' ? '#f97316' : '#94a3b8';
  const size  = type === 'kill' ? 24 : 18;

  return (
    <div
      key={`hm-${Date.now()}`}
      style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none', zIndex: 100,
      }}
    >
      <svg width={size * 2} height={size * 2} style={{ display: 'block' }}>
        <line x1={size * 0.25} y1={size * 0.25} x2={size * 1.75} y2={size * 1.75}
          stroke={color} strokeWidth={type === 'kill' ? 3.5 : 2.5} strokeLinecap="round" />
        <line x1={size * 1.75} y1={size * 0.25} x2={size * 0.25} y2={size * 1.75}
          stroke={color} strokeWidth={type === 'kill' ? 3.5 : 2.5} strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  WIND INDICATOR — tactical HUD compass showing wind speed
// ─────────────────────────────────────────────────────────────────

interface WindProps {
  speed: number;
  angle: number;
  visible?: boolean;
}

export function WindIndicator({ speed, angle, visible = true }: WindProps) {
  if (!visible) return null;
  const deg = ((angle * 180) / Math.PI).toFixed(0);
  const arrowLen = Math.min(speed / 12, 1) * 36;

  return (
    <div style={{
      position: 'absolute', top: 70, right: 16,
      background: 'rgba(2,6,23,0.85)',
      border: '1px solid rgba(148,163,184,0.3)',
      borderRadius: 8, padding: '6px 10px',
      display: 'flex', flexDirection: 'column', gap: 4,
      pointerEvents: 'none', zIndex: 91,
      fontFamily: '"Orbitron", monospace',
    }}>
      <div style={{ color: '#38bdf8', fontSize: 9, letterSpacing: 1 }}>WIND</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width={48} height={48}>
          <circle cx={24} cy={24} r={20} fill="none" stroke="rgba(148,163,184,0.3)" strokeWidth={1} />
          {['N','E','S','W'].map((d, i) => {
            const a = i * Math.PI / 2 - Math.PI / 2;
            const x = 24 + Math.cos(a) * 16, y = 24 + Math.sin(a) * 16;
            return <text key={d} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              fill="rgba(148,163,184,0.55)" fontSize={6} fontFamily="monospace">{d}</text>;
          })}
          <line
            x1={24} y1={24}
            x2={24 + Math.cos(angle) * arrowLen}
            y2={24 + Math.sin(angle) * arrowLen}
            stroke="#38bdf8" strokeWidth={2} strokeLinecap="round"
          />
          <circle cx={24 + Math.cos(angle) * arrowLen} cy={24 + Math.sin(angle) * arrowLen} r={2.5} fill="#38bdf8" />
        </svg>
        <div>
          <div style={{ color: '#f8fafc', fontSize: 11, fontWeight: 700 }}>{speed.toFixed(1)}<span style={{ color: '#64748b', fontSize: 8 }}> m/s</span></div>
          <div style={{ color: '#64748b', fontSize: 8 }}>{deg}°</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  AMMO COUNTER — magazine HUD element with bullet pips
// ─────────────────────────────────────────────────────────────────

interface AmmoProps {
  current: number;
  max: number;
  isReloading: boolean;
}

export function AmmoCounter({ current, max, isReloading }: AmmoProps) {
  return (
    <div style={{
      position: 'absolute', right: 112, bottom: 130,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
      pointerEvents: 'none', zIndex: 91,
      fontFamily: '"Orbitron", monospace',
    }}>
      {isReloading ? (
        <div style={{ color: '#fbbf24', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>
          RELOADING...
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ color: current <= 3 ? '#ef4444' : '#f8fafc', fontSize: 26, fontWeight: 900, lineHeight: 1 }}>
              {String(current).padStart(2, '0')}
            </span>
            <span style={{ color: '#475569', fontSize: 13, fontWeight: 400 }}>/ {max}</span>
          </div>
          <div style={{ display: 'flex', gap: 3, marginTop: 4, flexWrap: 'wrap-reverse', justifyContent: 'flex-end', maxWidth: 120 }}>
            {Array.from({ length: max }).map((_, i) => (
              <div key={i} style={{
                width: 6, height: 14, borderRadius: 2,
                background: i < current ? (i < 4 ? '#ef4444' : '#38bdf8') : 'rgba(71,85,105,0.4)',
                transition: 'background 0.15s ease',
              }} />
            ))}
          </div>
          <div style={{ color: '#475569', fontSize: 8, letterSpacing: 1, marginTop: 2 }}>AMMO</div>
        </>
      )}
    </div>
  );
}
