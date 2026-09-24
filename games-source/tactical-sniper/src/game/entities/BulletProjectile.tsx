import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { distToSegment3D } from '../../utils/math';
import type { SuspectHandle } from './SuspectThief';
import { GAME_CONFIG } from '../gameConfig';

interface Props {
  origin: THREE.Vector3;
  velocity: THREE.Vector3;
  sessionId: number;
  suspectHandles: React.MutableRefObject<(SuspectHandle | null)[]>;
  suspectTargetIds: string[];
  onHitSuspect: (suspectId: string, hitPos: THREE.Vector3, hitVel: THREE.Vector3) => void;
  onHitConcrete: (impactPos: THREE.Vector3, hitVel: THREE.Vector3) => void;
  onDestroy: () => void;
}

const _vForward = new THREE.Vector3(0, 0, 1);
const _dirVec = new THREE.Vector3();

export function BulletProjectile({
  origin,
  velocity,
  sessionId,
  suspectHandles,
  suspectTargetIds,
  onHitSuspect,
  onHitConcrete,
  onDestroy,
}: Props) {
  const meshRef = useRef<THREE.Group>(null);
  const pos = useRef(origin.clone());
  const prevPos = useRef(origin.clone());
  const vel = useRef(velocity.clone());
  const resolved = useRef(false);
  const age = useRef(0);
  const mySession = useRef(sessionId);

  // Supersonic Tracer Trail
  const TRAIL_LEN = 24;
  const trailPos = useRef<Float32Array>(new Float32Array(TRAIL_LEN * 3).fill(9999));
  const trailIdx = useRef(0);
  const trailRef = useRef<THREE.Points>(null);

  useEffect(() => {
    return () => { resolved.current = true; };
  }, []);

  useFrame((_, delta) => {
    if (resolved.current) return;
    if (mySession.current !== sessionId) {
      resolved.current = true;
      return;
    }

    const dt = Math.min(delta, 0.035);
    age.current += dt;

    prevPos.current.copy(pos.current);

    // Ballistic Bullet Drop
    vel.current.y -= GAME_CONFIG.gun.gravity * dt;
    pos.current.x += vel.current.x * dt;
    pos.current.y += vel.current.y * dt;
    pos.current.z += vel.current.z * dt;

    if (meshRef.current) {
      meshRef.current.position.copy(pos.current);
      _dirVec.copy(vel.current).normalize();
      meshRef.current.quaternion.setFromUnitVectors(_vForward, _dirVec);
    }

    // Tracer line
    const ti = (trailIdx.current % TRAIL_LEN) * 3;
    trailPos.current[ti]     = pos.current.x;
    trailPos.current[ti + 1] = pos.current.y;
    trailPos.current[ti + 2] = pos.current.z;
    trailIdx.current++;
    if (trailRef.current) {
      (trailRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    // ── 1. CONTINUOUS COLLISION DETECTION WITH SUSPECTS ON ROOFTOPS ──
    for (let i = 0; i < suspectHandles.current.length; i++) {
      const handle = suspectHandles.current[i];
      if (!handle) continue;
      const sPos = handle.getPosition();

      // Create a vertical capsule hitbox (from feet to head)
      // Note: SuspectThief group is scaled by 2.5x, so its visual height is ~4.75m (1.9 * 2.5)
      const closestY = Math.max(sPos.y, Math.min(sPos.y + 4.75, pos.current.y));

      const sweptDist = distToSegment3D(
        sPos.x, closestY, sPos.z,
        prevPos.current.x, prevPos.current.y, prevPos.current.z,
        pos.current.x, pos.current.y, pos.current.z
      );

      if (sweptDist < GAME_CONFIG.gun.hitRadius && !resolved.current) {
        resolved.current = true;
        handle.triggerHit();
        const id = suspectTargetIds[i] ?? `suspect-${i}`;
        onHitSuspect(id, pos.current.clone(), vel.current.clone());
        onDestroy();
        return;
      }
    }

    // ── 2. MISS — hit a building rooftop or ground ──
    // With multi-height buildings, miss when bullet drops far below lowest suspect or flies past them
    if (pos.current.y < -5.0 || pos.current.z < -160.0) {
      if (!resolved.current) {
        resolved.current = true;
        onHitConcrete(pos.current.clone(), vel.current.clone());
        onDestroy();
        return;
      }
    }

    if (age.current > (GAME_CONFIG.gun.maxAge ?? 4.5) && !resolved.current) {
      resolved.current = true;
      onDestroy();
    }
  });

  return (
    <group>
      {/* High-Velocity Sniper Bullet (Copper/Lead) */}
      <group ref={meshRef} position={origin.toArray()}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.025, 0.15, 8]} />
          <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.9} />
        </mesh>
      </group>

      {/* Subtle Smoke / Vapor Trail */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[trailPos.current, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.6} color="#cbd5e1" transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}
