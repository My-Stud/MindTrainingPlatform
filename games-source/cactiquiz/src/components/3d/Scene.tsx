import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { Cactus } from './Cactus';
import { useGameStore } from '../../gameStore';
import { CactusStatus } from '../../types';

interface SceneProps {
  onOptionSelect: (index: number, isCorrect: boolean, clientX: number, clientY: number, nutColors: [string, string]) => void;
  cactusStatuses: CactusStatus[];
}

export function Scene({ onOptionSelect, cactusStatuses }: SceneProps) {
  const { questions, currentQuestionIndex } = useGameStore();
  const currentQuestion = questions[currentQuestionIndex];

  const [positions, setPositions] = useState<[number, number, number][]>([
    [-4.5, -1, 0], [-1.5, -1, 0], [1.5, -1, 0], [4.5, -1, 0]
  ]);

  const [camPosition, setCamPosition] = useState<[number, number, number]>([0, 1.5, 10]);

  const [shadowY, setShadowY] = useState(-3.8);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPositions([
          [-1.5, 0.0, 0], [1.5, 0.0, 0],
          [-1.5, -4.5, 0], [1.5, -4.5, 0]
        ]);
        setCamPosition([0, 0, 32]);
        setShadowY(-4.9);
      } else {
        setPositions([
          [-4.5, -3, 0], [-1.5, -3, 0], [1.5, -3, 0], [4.5, -3, 0]
        ]);
        setCamPosition([0, 0.5, 25]);
        setShadowY(-3.8);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!currentQuestion) return null;

  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={camPosition} fov={25} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />

      <Environment preset="city" />

      {currentQuestion.options.map((option, index) => (
        <Cactus
          key={option.id}
          index={index}
          position={positions[index]}
          option={option}
          status={cactusStatuses[index]}
          onClick={(clientX, clientY, nutColors) => onOptionSelect(index, option.isCorrect, clientX, clientY, nutColors)}
        />
      ))}

      <ContactShadows position={[0, shadowY, 0]} opacity={0.4} scale={30} blur={2} far={4} />
    </Canvas>
  );
}
