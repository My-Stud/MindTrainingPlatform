import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { Option, CactusStatus } from '../../types';

interface CactusProps {
  index: number;
  position: [number, number, number];
  option: Option;
  onClick: (clientX: number, clientY: number, nutColors: [string, string]) => void;
  status: CactusStatus;
}

export function Cactus({ index, position, option, onClick, status }: CactusProps) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const targetScale = hovered ? 1.05 : 1;
  const targetColor = status === 'wrong' ? '#ff6b6b' : '#4ade80';

  const faceColor = '#5c3a21';

  useFrame((state) => {
    if (group.current) {
      group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      if (status === 'wrong') {
        group.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 30) * 0.1;
      } else {
        group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, position[0], 0.1);
      }
    }
  });

  const allNutColors = [
    '#ff4757', '#1e90ff',
    '#2ed573', '#ffa502',
    '#9b59b6', '#00cec9',
    '#e84393', '#fdcb6e'
  ];
  const myNutColors: [string, string] = [
    allNutColors[(index * 2) % 8],
    allNutColors[(index * 2 + 1) % 8]
  ];

  const textColors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502'];
  const textColor = textColors[index % 4];

  const spikes = [
    { pos: [0.6, 1.2, 0.5], rot: [0, 0, -Math.PI / 4] },
    { pos: [-0.6, 1.4, 0.4], rot: [0, 0, Math.PI / 4] },
    { pos: [0.3, 1.6, 0.7], rot: [Math.PI / 6, 0, 0] },
    { pos: [-0.3, 0.8, 0.8], rot: [-Math.PI / 6, 0, 0] },
    { pos: [0, 1.8, 0.4], rot: [Math.PI / 4, 0, 0] },
    { pos: [0.8, 0.8, 0], rot: [0, 0, -Math.PI / 2] },
    { pos: [-0.8, 0.8, -0.2], rot: [0, 0, Math.PI / 2] }
  ];

  const textY = 3.0;

  return (
    <group
      ref={group}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e.nativeEvent.clientX, e.nativeEvent.clientY, myNutColors);
      }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <Html
        position={[0, textY, 0]}
        center
        zIndexRange={[100, 0]}
      >
        <div
          className="cactus-option-text"
          style={{ color: textColor }}
        >
          {option.word}
        </div>
      </Html>

      <mesh position={[0, 1.2, 0]} castShadow>
        <capsuleGeometry args={[0.85, 1.1, 16, 32]} />
        <meshStandardMaterial color={targetColor} roughness={0.6} />
      </mesh>

      <mesh position={[-0.8, 1.2, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <capsuleGeometry args={[0.35, 0.5, 16, 16]} />
        <meshStandardMaterial color={targetColor} roughness={0.6} />
      </mesh>

      <mesh position={[0.8, 1.4, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <capsuleGeometry args={[0.4, 0.4, 16, 16]} />
        <meshStandardMaterial color={targetColor} roughness={0.6} />
      </mesh>

      {spikes.map((s, i) => (
        <mesh key={i} position={s.pos as any} rotation={s.rot as any}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#2d5a27" />
        </mesh>
      ))}

      <mesh position={[-0.3, 1.3, 0.82]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={faceColor} />
      </mesh>
      <mesh position={[0.3, 1.3, 0.82]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={faceColor} />
      </mesh>

      <mesh position={[0, 1.15, 0.85]} rotation={[Math.PI, 0, 0]}>
        <torusGeometry args={[0.08, 0.03, 16, 32, Math.PI]} />
        <meshBasicMaterial color={faceColor} />
      </mesh>

      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.9, 0.7, 1.0, 32]} />
        <meshStandardMaterial color="#ffd700" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.9, 0.15, 16, 32]} />
        <meshStandardMaterial color="#ffc107" roughness={0.8} />
      </mesh>

      {status !== 'correct' && (
        <group>
          <group position={[-0.4, -0.4, 0.75]} rotation={[0, -0.5, 0]}>
            <mesh castShadow scale={[1, 1, 0.5]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={myNutColors[0]} roughness={0.4} />
            </mesh>
            <Html position={[0, 0, 0.08]} center zIndexRange={[100, 0]}>
              <div style={{ fontSize: '15px', color: 'white', textShadow: '0px 0px 2px #000, 0px 0px 2px #000' }}>+</div>
            </Html>
          </group>

          <group position={[0.4, -0.4, 0.75]} rotation={[0, 0.5, 0]}>
            <mesh castShadow scale={[1, 1, 0.5]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={myNutColors[1]} roughness={0.4} />
            </mesh>
            <Html position={[0, 0, 0.08]} center zIndexRange={[100, 0]}>
              <div style={{ fontSize: '15px', color: 'white', textShadow: '0px 0px 2px #000, 0px 0px 2px #000' }}>+</div>
            </Html>
          </group>
        </group>
      )}

    </group>
  );
}
