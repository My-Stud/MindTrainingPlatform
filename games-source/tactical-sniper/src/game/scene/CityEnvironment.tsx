import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSkyscraperWindowTexture } from './ProceduralTextures';

// ─────────────────────────────────────────────────────────────────
//  CINEMATIC METROPOLIS NIGHT SKYLINE (Distant Backdrop at Z < -110)
//  Zero obstruction of gameplay towers or suspect sightlines
// ─────────────────────────────────────────────────────────────────

export function CityEnvironment() {
  const beaconsRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // Drifting night clouds across full moon
    if (cloudsRef.current) {
      cloudsRef.current.children.forEach((cloud, i) => {
        cloud.position.x += (0.15 + (i % 3) * 0.08) * delta;
        if (cloud.position.x > 80) cloud.position.x = -80;
      });
    }

    // Flashing red aviation warning beacon lights on distant skyscraper antennas
    if (beaconsRef.current) {
      const flash = (Math.sin(Date.now() * 0.005) + 1) * 0.5;
      beaconsRef.current.children.forEach((b) => {
        const mat = (b as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = flash > 0.4 ? 1.0 : 0.1;
      });
    }
  });

  return (
    <>
      {/* Night Sky Dome */}
      <NightSkyDome />

      {/* Dramatic Full Moon with Volumetric Glow */}
      <group position={[32, 48, -200]}>
        <mesh>
          <sphereGeometry args={[10.0, 24, 24]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0, -1]}>
          <sphereGeometry args={[22.0, 20, 20]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.25} />
        </mesh>
        <mesh position={[0, 0, -2]}>
          <sphereGeometry args={[38.0, 18, 18]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} />
        </mesh>
      </group>

      {/* Drifting Night Clouds */}
      <group ref={cloudsRef}>
        <NightCloudCluster position={[-45, 34, -140]} scale={1.8} />
        <NightCloudCluster position={[-15, 38, -160]} scale={2.2} />
        <NightCloudCluster position={[65, 32, -145]} scale={1.5} />
      </group>

      {/* Distant Background Skyscraper Skyline (Far Behind at Z = -110 to -160) */}
      <DistantSkyline />

      {/* Red Flashing Aviation Beacons on Far Antennas */}
      <group ref={beaconsRef}>
        <AviationBeacon position={[-45, 42, -120]} />
        <AviationBeacon position={[-20, 48, -135]} />
        <AviationBeacon position={[18, 46, -130]} />
        <AviationBeacon position={[52, 40, -125]} />
      </group>
    </>
  );
}

function NightSkyDome() {
  const skyGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(180, 32, 24);
    geo.scale(-1, 1, 1);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const colors: number[] = [];

    const cZenith  = new THREE.Color('#020617'); // Obsidian night sky
    const cMid     = new THREE.Color('#0b1329'); // Deep midnight navy
    const cHorizon = new THREE.Color('#1e293b'); // Atmospheric street glow

    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = Math.max(0, Math.min(1, (y + 20) / 160));
      const col = new THREE.Color();
      if (t > 0.4) {
        col.lerpColors(cMid, cZenith, (t - 0.4) / 0.6);
      } else {
        col.lerpColors(cHorizon, cMid, t / 0.4);
      }
      colors.push(col.r, col.g, col.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, []);

  return (
    <mesh geometry={skyGeo} position={[0, 0, 0]}>
      <meshBasicMaterial vertexColors side={THREE.BackSide} />
    </mesh>
  );
}

function NightCloudCluster({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3.2, 12, 10]} />
        <meshBasicMaterial color="#1e293b" transparent opacity={0.4} depthWrite={false} />
      </mesh>
      <mesh position={[-2.4, -0.3, 0.4]}>
        <sphereGeometry args={[2.4, 10, 8]} />
        <meshBasicMaterial color="#1e293b" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <mesh position={[2.6, 0.2, -0.3]}>
        <sphereGeometry args={[2.5, 10, 8]} />
        <meshBasicMaterial color="#1e293b" transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ── Distant Background Skyscrapers (Z = -120 to -160, Never Block Gameplay) ──
function DistantSkyline() {
  const winWarmMap  = useMemo(() => getSkyscraperWindowTexture('#fbbf24'), []);
  const winCyanMap  = useMemo(() => getSkyscraperWindowTexture('#38bdf8'), []);
  const winWhiteMap = useMemo(() => getSkyscraperWindowTexture('#f8fafc'), []);

  const towers = useMemo(() => {
    const list: Array<{
      pos: [number, number, number];
      size: [number, number, number];
      color: string;
      mapType: number;
    }> = [];

    // Distant background skyscrapers across horizon (Z from -180 to -220)
    for (let i = -14; i <= 14; i++) {
      const x = i * 16.0 + (Math.sin(i * 1.7) * 4.5);
      const z = -180 - Math.abs(i % 5) * 8.0;
      const height = 40 + Math.abs(Math.sin(i * 0.8)) * 35;
      const width = 8.0 + Math.random() * 4.0;
      const depth = 8.0 + Math.random() * 4.0;
      const color = i % 3 === 0 ? '#0f172a' : i % 2 === 0 ? '#111827' : '#090d16';
      const mapType = i % 3;

      list.push({
        pos: [x, height / 2 - 20, z],
        size: [width, height, depth],
        color,
        mapType,
      });
    }
    return list;
  }, []);

  return (
    <group>
      {towers.map((t, idx) => {
        const tex = t.mapType === 0 ? winWarmMap : t.mapType === 1 ? winCyanMap : winWhiteMap;
        return (
          <group key={`dist-tower-${idx}`} position={t.pos}>
            <mesh>
              <boxGeometry args={t.size} />
              <meshStandardMaterial color={t.color} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0, t.size[2] / 2 + 0.05]}>
              <planeGeometry args={[t.size[0] * 0.88, t.size[1] * 0.85]} />
              <meshBasicMaterial map={tex} transparent opacity={0.55} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function AviationBeacon({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.45, 8, 8]} />
      <meshBasicMaterial color="#ef4444" transparent opacity={1.0} />
    </mesh>
  );
}
