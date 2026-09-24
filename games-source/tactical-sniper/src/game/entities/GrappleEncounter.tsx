import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { distToSegment3D } from '../../utils/math';
import type { SuspectHandle } from './SuspectThief';

interface Props {
  origin: THREE.Vector3;
  velocity: THREE.Vector3;
  sessionId: number;
  suspectHandles: React.MutableRefObject<(SuspectHandle | null)[]>;
  suspectTargetIds: string[];
  onHitSuspect: (suspectId: string) => void;
  onHitRooftop: (impactPos: THREE.Vector3) => void;
  onDestroy: () => void;
}

const _vForward = new THREE.Vector3(0, 0, 1);
const _dirVec = new THREE.Vector3();
const SUSPECT_HIT_RADIUS = 1.6;

export function GrappleEncounter({
  origin,
  velocity,
  sessionId,
  suspectHandles,
  suspectTargetIds,
  onHitSuspect,
  onHitRooftop,
  onDestroy,
}: Props) {
  const meshRef = useRef<THREE.Group>(null);
  const pos = useRef(origin.clone());
  const prevPos = useRef(origin.clone());
  const vel = useRef(velocity.clone());
  const resolved = useRef(false);
  const age = useRef(0);
  const mySession = useRef(sessionId);

  // Electric particle trail
  const TRAIL_LEN = 32;
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

    vel.current.y -= 9.81 * dt;
    pos.current.x += vel.current.x * dt;
    pos.current.y += vel.current.y * dt;
    pos.current.z += vel.current.z * dt;

    if (meshRef.current) {
      meshRef.current.position.copy(pos.current);
      _dirVec.copy(vel.current).normalize();
      meshRef.current.quaternion.setFromUnitVectors(_vForward, _dirVec);
    }

    // Update sparkling electric trail
    const ti = (trailIdx.current % TRAIL_LEN) * 3;
    trailPos.current[ti] = pos.current.x;
    trailPos.current[ti + 1] = pos.current.y;
    trailPos.current[ti + 2] = pos.current.z;
    trailIdx.current++;
    if (trailRef.current) {
      (trailRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    // ── 1. COLLISION DETECTION AGAINST SUSPECTS ──
    for (let i = 0; i < suspectHandles.current.length; i++) {
      const handle = suspectHandles.current[i];
      if (!handle) continue;
      const sPos = handle.getPosition();

      const sweptDist = distToSegment3D(
        sPos.x, sPos.y + 0.9, sPos.z,
        prevPos.current.x, prevPos.current.y, prevPos.current.z,
        pos.current.x, pos.current.y, pos.current.z
      );

      if (sweptDist < SUSPECT_HIT_RADIUS && !resolved.current) {
        resolved.current = true;
        const id = suspectTargetIds[i] ?? `suspect-${i}`;
        onHitSuspect(id);
        onDestroy();
        return;
      }
    }

    // ── 2. ROOFTOP GROUND COLLISION ──
    if (pos.current.y <= 0.35 && !resolved.current) {
      resolved.current = true;
      onHitRooftop(pos.current.clone());
      onDestroy();
      return;
    }

    // Timeout
    if (age.current > 3.0 && !resolved.current) {
      resolved.current = true;
      onDestroy();
    }
  });

  return (
    <group>
      {/* Electrified Grapple Net Hook */}
      <group ref={meshRef} position={origin.toArray()}>
        <mesh>
          <sphereGeometry args={[0.32, 10, 10]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.18, 0.28, 0.6, 8]} />
          <meshLambertMaterial color="#0284c7" />
        </mesh>
        <pointLight color="#38bdf8" intensity={1.8} distance={6} />
      </group>

      {/* Spark Particle Trail */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailPos.current, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.45}
          color="#38bdf8"
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
