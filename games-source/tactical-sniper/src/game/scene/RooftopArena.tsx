import { useMemo } from 'react';
import * as THREE from 'three';
import { GAME_CONFIG } from '../gameConfig';

// ─────────────────────────────────────────────────────────────────
//  CENTRALIZED ARENA — 4 Distinct Suspect Skyscrapers
//  Uniform Height & Distance: 100% Direct Sightline, Zero Occlusion
// ─────────────────────────────────────────────────────────────────

let _winTex: THREE.CanvasTexture | null = null;
function getWindowTexture(): THREE.CanvasTexture {
  if (_winTex) return _winTex;
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#060a14';
  ctx.fillRect(0, 0, 256, 512);
  const rng = (a: number, b: number) => Math.random() * (b - a) + a;
  for (let row = 0; row < 32; row++) {
    for (let col = 0; col < 8; col++) {
      if (Math.random() < 0.28) continue;
      const warm = Math.random() > 0.45;
      ctx.fillStyle = warm
        ? `rgba(255,${170 + Math.random() * 60 | 0},40,${rng(0.65, 0.95)})`
        : `rgba(96,165,250,${rng(0.55, 0.90)})`;
      ctx.fillRect(4 + col * 31, 6 + row * 16, 24, 10);
    }
  }
  _winTex = new THREE.CanvasTexture(canvas);
  return _winTex;
}

let _concreteTex: THREE.CanvasTexture | null = null;
function getConcreteTexture(): THREE.CanvasTexture {
  if (_concreteTex) return _concreteTex;
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 3000; i++) {
    const v = Math.random() > 0.5 ? 160 : 40;
    ctx.fillStyle = `rgba(${v},${v + 8},${v + 16},0.12)`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 4 + 1, Math.random() * 4 + 1);
  }
  for (let i = 0; i < 6; i++) {
    const px = Math.random() * 400 + 50, py = Math.random() * 400 + 50, pr = Math.random() * 60 + 30;
    const grd = ctx.createRadialGradient(px, py, pr * 0.2, px, py, pr);
    grd.addColorStop(0, 'rgba(15,23,42,0.85)');
    grd.addColorStop(1, 'rgba(30,41,59,0.0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  _concreteTex = new THREE.CanvasTexture(canvas);
  _concreteTex.wrapS = _concreteTex.wrapT = THREE.RepeatWrapping;
  _concreteTex.repeat.set(2, 2);
  return _concreteTex;
}

interface SuspectBuildingProps {
  x: number;
  z: number;
  roofY: number;
  width: number;
  depth: number;
  accentColor: string;
  rotationY?: number;
}

function SuspectSkyscraper({ x, z, roofY, width, depth, accentColor, rotationY = 0 }: SuspectBuildingProps) {
  const winTex = useMemo(() => getWindowTexture(), []);
  const concreteTex = useMemo(() => getConcreteTexture(), []);
  const groundY = -100;
  const height = roofY - groundY;
  const bodyY = groundY + height / 2;

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      {/* Tower Concrete Core */}
      <mesh position={[0, bodyY, 0]} receiveShadow castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#080e1a" roughness={0.9} />
      </mesh>

      {/* Window Panels */}
      {[-1, 1].map(side => (
        <mesh key={`win-fb-${side}`} position={[0, bodyY, side * (depth / 2 + 0.05)]}>
          <planeGeometry args={[width - 0.8, height - 2]} />
          <meshBasicMaterial map={winTex} transparent opacity={0.92} side={THREE.FrontSide} />
        </mesh>
      ))}
      {[-1, 1].map(side => (
        <mesh key={`win-lr-${side}`} position={[side * (width / 2 + 0.05), bodyY, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[depth - 0.8, height - 2]} />
          <meshBasicMaterial map={winTex} transparent opacity={0.92} side={THREE.FrontSide} />
        </mesh>
      ))}

      {/* Dark Slate Rooftop Slab (No Paint) */}
      <mesh position={[0, roofY + 0.05, 0]} receiveShadow>
        <boxGeometry args={[width, 0.25, depth]} />
        <meshStandardMaterial map={concreteTex} roughness={0.45} metalness={0.15} color="#475569" />
      </mesh>

      {/* Low Parapet Ledge (0.35m high — does not block legs from above) */}
      <mesh position={[0, roofY + 0.20, depth / 2]} receiveShadow castShadow>
        <boxGeometry args={[width, 0.35, 0.30]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[0, roofY + 0.20, -depth / 2]} receiveShadow castShadow>
        <boxGeometry args={[width, 0.35, 0.30]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[width / 2, roofY + 0.20, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.30, 0.35, depth]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[-width / 2, roofY + 0.20, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.30, 0.35, depth]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Subtle Color Accent Rim on Facade */}
      <mesh position={[0, roofY + 0.38, -depth / 2 + 0.05]}>
        <boxGeometry args={[width, 0.05, 0.05]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
    </group>
  );
}

// ── Police Vantage Point (Safe Area with Railing) ────────────────
function PoliceVantageTower() {
  const concreteTex = useMemo(() => getConcreteTexture(), []);
  const winTex = useMemo(() => getWindowTexture(), []);
  const roofY = GAME_CONFIG.police.baseY; // 38.0
  const groundY = -100;
  const height = roofY - groundY;
  const bodyY = groundY + height / 2;
  const width = 14.0;
  const depth = 14.0;

  return (
    <group position={[0, 0, 2.0]}>
      {/* Tower Main Core */}
      <mesh position={[0, bodyY, 0]} receiveShadow castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#080e1a" roughness={0.9} />
      </mesh>

      {/* Window Facades */}
      {[-1, 1].map(side => (
        <mesh key={`pwin-fb-${side}`} position={[0, bodyY, side * (depth / 2 + 0.05)]}>
          <planeGeometry args={[width - 1, height - 2]} />
          <meshBasicMaterial map={winTex} transparent opacity={0.90} side={THREE.FrontSide} />
        </mesh>
      ))}

      {/* Rooftop Dark Concrete Surface */}
      <mesh position={[0, roofY + 0.05, 0]} receiveShadow>
        <boxGeometry args={[width, 0.25, depth]} />
        <meshStandardMaterial map={concreteTex} roughness={0.4} metalness={0.2} color="#64748b" />
      </mesh>

      {/* Front Steel Handrail Tube (0.80m high) */}
      <mesh position={[0, roofY + 0.80, -depth / 2 + 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, width - 1.0, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Mid Rail */}
      <mesh position={[0, roofY + 0.40, -depth / 2 + 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, width - 1.0, 10]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>
      {/* Vertical Railing Posts */}
      {[-5.5, -3.5, -1.5, 0.5, 2.5, 4.5].map((px, i) => (
        <mesh key={`post-${i}`} position={[px, roofY + 0.40, -depth / 2 + 0.5]}>
          <cylinderGeometry args={[0.04, 0.04, 0.80, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
      ))}

      {/* Back Wall (Behind Player) */}
      <mesh position={[0, roofY + 1.2, depth / 2 - 0.2]} receiveShadow castShadow>
        <boxGeometry args={[width, 2.4, 0.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Side Parapets */}
      <mesh position={[-width / 2 + 0.2, roofY + 0.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 1.2, depth]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      <mesh position={[width / 2 - 0.2, roofY + 0.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 1.2, depth]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Helipad Marking on Rooftop behind player */}
      <mesh position={[0, roofY + 0.08, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.3, 32]} />
        <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, roofY + 0.08, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 0.35]} />
        <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, roofY + 0.08, 2.0]} rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
        <planeGeometry args={[1.6, 0.35]} />
        <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} />
      </mesh>

      {/* Rooftop Antenna Mast with Red Aviation Beacon */}
      <mesh position={[5.0, roofY + 3.5, 3.5]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 7, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} />
      </mesh>
      <mesh position={[5.0, roofY + 7.1, 3.5]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <pointLight position={[5.0, roofY + 7.1, 3.5]} color="#ef4444" intensity={2.5} distance={12} />
    </group>
  );
}

// ── Suspect Rooftop Overhead Spotlights ───────────────────────────
function SuspectSpotlight({ suspect }: { suspect: typeof GAME_CONFIG.suspects[0] }) {
  const { posX: x, roofY, posZ: z, id } = suspect;

  return (
    <group position={[x, roofY, z]}>
      <spotLight
        position={[0, 16.0, 2.0]}
        target-position={[0, 0, 0]}
        angle={Math.PI / 3.0}
        penumbra={0.2}
        intensity={12.0}
        color={['#fca5a5', '#93c5fd', '#fde68a', '#d8b4fe'][['A', 'B', 'C', 'D'].indexOf(id)]}
        distance={40}
      />
    </group>
  );
}

// ── City Ground Abyss ─────────────────────────────────────────────
function CityGround() {
  return (
    <group position={[0, -100, -50]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[400, 300]} />
        <meshBasicMaterial color="#020617" />
      </mesh>
      {[-60, -30, 0, 30, 60].map((x, i) => (
        <mesh key={`grid-${i}`} position={[x, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.0, 280]} />
          <meshBasicMaterial color="#1e3a5f" transparent opacity={0.6} />
        </mesh>
      ))}
      {[[-35, -30], [0, -50], [35, -30]].map(([x, z], i) => (
        <pointLight key={`st-${i}`} position={[x, 20, z]} color="#f59e0b" intensity={5} distance={50} />
      ))}
    </group>
  );
}

// ── Main Arena Export ─────────────────────────────────────────────
export function RooftopArena() {
  const SUSPECTS = GAME_CONFIG.suspects;
  const accentColors = ['#ef4444', '#3b82f6', '#f59e0b', '#a855f7'];

  return (
    <group>
      <ambientLight intensity={1.5} color="#e0f2fe" />
      <directionalLight position={[0, 100, -200]} intensity={2.0} color="#bae6fd" />
      <directionalLight position={[100, 50, 0]} intensity={0.5} color="#cbd5e1" />

      <CityGround />

      {/* ── 1. POLICE SNIPER VANTAGE TOWER (Safe Area with Railing) ── */}
      <PoliceVantageTower />

      {/* ── 2. FOUR SUSPECT SKYSCRAPERS (100% Direct Sightline, NO Overlapping Blockers) ── */}
      {SUSPECTS.map((s, i) => (
        <SuspectSkyscraper
          key={`tower-${s.id}`}
          x={s.posX}
          z={s.posZ}
          roofY={s.roofY}
          width={28.0}
          depth={22.0}
          accentColor={accentColors[i]}
          rotationY={s.rotY}
        />
      ))}

      {/* ── 3. SUSPECT OVERHEAD SPOTLIGHTS ── */}
      {SUSPECTS.map(s => (
        <SuspectSpotlight key={`spot-${s.id}`} suspect={s} />
      ))}
    </group>
  );
}
