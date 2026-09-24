import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  position: THREE.Vector3;
  normal: THREE.Vector3;
  type: 'blood' | 'concrete';
  onComplete: () => void;
}

const PARTICLE_COUNT = 45;

export function ImpactEffect({ position, normal, type, onComplete }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const age = useRef(0);
  const duration = 1.2;

  // Initialize particles physics
  const particles = useMemo(() => {
    const arr = [];
    const color = new THREE.Color(type === 'blood' ? '#991b1b' : '#94a3b8');

    // Create a spread cone based on the normal vector (bullet momentum or surface normal)
    const baseDir = normal.clone().normalize();
    const up = Math.abs(baseDir.y) > 0.99 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(baseDir, up).normalize();
    const realUp = new THREE.Vector3().crossVectors(right, baseDir).normalize();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spread = Math.random() * (type === 'blood' ? 0.6 : 0.8);

      const dir = baseDir.clone()
        .add(right.clone().multiplyScalar(Math.cos(angle) * spread))
        .add(realUp.clone().multiplyScalar(Math.sin(angle) * spread))
        .normalize();

      const speed = (type === 'blood' ? 4 : 2) + Math.random() * (type === 'blood' ? 8 : 4);

      arr.push({
        position: new THREE.Vector3(0, 0, 0),
        velocity: dir.multiplyScalar(speed),
        scale: Math.random() * 0.5 + 0.5,
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        angularVel: new THREE.Euler(Math.random() * 5, Math.random() * 5, 0),
        color: color.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.1) // slight color variation
      });
    }
    return arr;
  }, [normal, type]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Set initial colors
  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      meshRef.current.setColorAt(i, particles[i].color);
    }
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [particles]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.05);
    age.current += dt;

    if (age.current >= duration) {
      onComplete();
      return;
    }

    const t = age.current / duration;
    const gravity = type === 'blood' ? 9.8 : 5.0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      p.velocity.y -= gravity * dt; // Gravity pulls particles down
      p.position.addScaledVector(p.velocity, dt);

      // Air resistance
      p.velocity.multiplyScalar(0.95);

      p.rotation.x += p.angularVel.x * dt;
      p.rotation.y += p.angularVel.y * dt;

      dummy.position.copy(p.position);
      dummy.rotation.copy(p.rotation);

      // Shrink over time
      const s = p.scale * (1 - t * 0.8);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;

    // Fade out material
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 1.0 - Math.pow(t, 2);
  });

  return (
    <group position={position.toArray()}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        {type === 'blood' ? (
          // Blood droplets
          <dodecahedronGeometry args={[0.08, 0]} />
        ) : (
          // Concrete chunks
          <boxGeometry args={[0.12, 0.12, 0.12]} />
        )}
        <meshStandardMaterial
          transparent
          roughness={type === 'blood' ? 0.2 : 0.9}
          metalness={type === 'blood' ? 0.1 : 0.0}
        />
      </instancedMesh>
    </group>
  );
}
