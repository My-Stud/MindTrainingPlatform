import { useState, useEffect } from 'react';
import { useGameStore } from '../../game/gameStore';

export function CountdownOverlay() {
  const phase = useGameStore((s) => s.phase);
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (phase === 'countdown') {
      setCount(3);
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phase]);

  if (phase !== 'countdown') return null;

  return (
    <div className="countdown-overlay">
      <div className="countdown-ring">
        <div key={count} className="countdown-number">
          {count > 0 ? count : 'GO!'}
        </div>
      </div>
      <div className="countdown-label">PURSUIT COMMENCING</div>
    </div>
  );
}
