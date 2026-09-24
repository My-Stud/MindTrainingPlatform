import { useEffect, useRef } from 'react';
import { useGameStore } from '../game/gameStore';

export interface KeyState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

export function useKeyboard() {
  const keys = useRef<KeyState>({ left: false, right: false, up: false, down: false });
  const oneShot = useRef<{ space: boolean }>({ space: false });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Strictly prevent Enter key from interfering
      if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        e.preventDefault();
        return;
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keys.current.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keys.current.right = true;
      }
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        keys.current.up = true;
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        keys.current.down = true;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        oneShot.current.space = true;
      }
      if (e.code === 'KeyP' || e.code === 'Escape') {
        const p = useGameStore.getState().phase;
        if (p === 'playing' || p === 'aiming') {
          useGameStore.getState().setPhase('paused');
        } else if (p === 'paused') {
          useGameStore.getState().setPhase('playing');
        }
      }
      if (e.code === 'KeyM') {
        useGameStore.getState().toggleMute();
      }
      if (e.code === 'KeyH') {
        const v = useGameStore.getState().hintVisible;
        useGameStore.getState().setHintVisible(!v);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keys.current.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keys.current.right = false;
      }
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        keys.current.up = false;
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        keys.current.down = false;
      }
      if (e.code === 'Space') {
        oneShot.current.space = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return { keys, oneShot };
}
