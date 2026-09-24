import React, { useRef, useState, useEffect } from 'react';
import { playShootSound, playCorrectSound, playWrongSound } from '../utils/audio';
import { spawnConfetti } from '../utils/confetti';
import { QuizQuestion } from '../types/api';

const BALL_POSITIONS = [
  { x: 0.22, y: 0.22 },
  { x: 0.78, y: 0.22 },
  { x: 0.22, y: 0.78 },
  { x: 0.78, y: 0.78 }
];

interface PlayAreaProps {
  currentQuestion: QuizQuestion | null;
  currentOptions: string[];
  fiftyRemoved: number[];
  isPaused: boolean;
  onAnswer: (index: number, isCorrect: boolean) => void;
}

interface ToastState {
  msg: string;
  type: 'correct' | 'wrong';
  id: number;
}

interface PhysicsState {
  isAiming: boolean;
  joystickCenterX: number;
  joystickCenterY: number;
  maxDragDist: number;
  currentDragDist: number;
  currentAngleRad: number;
  animFrame: number | null;
  isShooting: boolean;
  isPaused: boolean;
  options: string[];
  question: QuizQuestion | null;
  removedBalls: Set<number>;
  onAnswer: (index: number, isCorrect: boolean) => void;
}

export default function PlayArea({ currentQuestion, currentOptions, fiftyRemoved, isPaused, onAnswer }: PlayAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const joystickOuterRef = useRef<HTMLDivElement>(null);
  const joystickInnerRef = useRef<HTMLDivElement>(null);
  const joystickArrowRef = useRef<HTMLDivElement>(null);
  const bulletRef = useRef<HTMLDivElement>(null);

  // Array of refs for the balls
  const ballRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isShooting, setIsShooting] = useState<boolean>(false);
  const [joystickActive, setJoystickActive] = useState<boolean>(false);

  // Toast state
  const [toast, setToast] = useState<ToastState | null>(null);

  const [ballStates, setBallStates] = useState<string[]>(['', '', '', '']);
  const [showBullet, setShowBullet] = useState<boolean>(false);
  const [joystickShake, setJoystickShake] = useState<boolean>(false);

  const stateRef = useRef<PhysicsState>({
    isAiming: false,
    joystickCenterX: 0,
    joystickCenterY: 0,
    maxDragDist: 45,
    currentDragDist: 0,
    currentAngleRad: 0,
    animFrame: null,
    isShooting: false,
    isPaused: false,
    options: [],
    question: null,
    removedBalls: new Set(),
    onAnswer: onAnswer
  });

  useEffect(() => {
    stateRef.current.isPaused = isPaused;
    stateRef.current.options = currentOptions;
    stateRef.current.question = currentQuestion;
    stateRef.current.onAnswer = onAnswer;
  }, [isPaused, currentOptions, currentQuestion, onAnswer]);

  useEffect(() => {
    stateRef.current.removedBalls = new Set(fiftyRemoved);
  }, [fiftyRemoved]);

  useEffect(() => {
    setBallStates(['', '', '', '']);
    setShowBullet(false);
    setJoystickShake(false);
    setIsShooting(false);
    stateRef.current.isShooting = false;
  }, [currentQuestion]);

  useEffect(() => {
    const computeJoystickCenter = () => {
      if (!joystickOuterRef.current) return;
      const rect = joystickOuterRef.current.getBoundingClientRect();
      stateRef.current.joystickCenterX = rect.left + rect.width / 2;
      stateRef.current.joystickCenterY = rect.top + rect.height / 2;
      stateRef.current.maxDragDist = rect.width * 0.375;
    };

    window.addEventListener('resize', computeJoystickCenter);
    setTimeout(computeJoystickCenter, 100);
    return () => window.removeEventListener('resize', computeJoystickCenter);
  }, []);

  // When a new question loads, reset states
  useEffect(() => {
    setIsShooting(false);
    stateRef.current.isShooting = false;
    setBallStates(['', '', '', '']);
    setShowBullet(false);
    setJoystickShake(false);
  }, [currentQuestion]);

  const showToast = (msg: string, type: 'correct' | 'wrong') => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 1000);
  };

  const handleDragStart = (e: { clientX: number; clientY: number }) => {
    if (stateRef.current.isShooting || stateRef.current.isPaused) return;

    const rect = joystickOuterRef.current!.getBoundingClientRect();
    stateRef.current.joystickCenterX = rect.left + rect.width / 2;
    stateRef.current.joystickCenterY = rect.top + rect.height / 2;
    stateRef.current.maxDragDist = rect.width * 0.375;

    stateRef.current.isAiming = true;
    setJoystickActive(true);
    updateJoystickDrag(e);
  };

  const handleDragMove = (e: { clientX: number; clientY: number }) => {
    if (!stateRef.current.isAiming || stateRef.current.isShooting || stateRef.current.isPaused) return;
    updateJoystickDrag(e);
  };

  const handleDragRelease = () => {
    if (!stateRef.current.isAiming) return;
    stateRef.current.isAiming = false;
    setJoystickActive(false);

    if (joystickInnerRef.current) joystickInnerRef.current.style.transform = 'translate(0px, 0px)';

    if (stateRef.current.isShooting || stateRef.current.isPaused) return;

    if (stateRef.current.currentDragDist > 10) {
      fireBullet(
        stateRef.current.joystickCenterX,
        stateRef.current.joystickCenterY,
        stateRef.current.currentAngleRad
      );
    }
  };

  // Set up global listeners for drag/release
  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (stateRef.current.isAiming) {
        if ('touches' in e) e.preventDefault();
        handleDragMove('touches' in e ? e.touches[0] : e);
      }
    };
    const onUp = () => {
      if (stateRef.current.isAiming) {
        handleDragRelease();
      }
    };

    window.addEventListener('mousemove', onMove, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp, { passive: false });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  const updateJoystickDrag = (e: { clientX: number; clientY: number }) => {
    const mx = e.clientX;
    const my = e.clientY;
    let dx = mx - stateRef.current.joystickCenterX;
    let dy = my - stateRef.current.joystickCenterY;
    let dist = Math.hypot(dx, dy);

    if (dist > stateRef.current.maxDragDist) {
      dx = (dx / dist) * stateRef.current.maxDragDist;
      dy = (dy / dist) * stateRef.current.maxDragDist;
      dist = stateRef.current.maxDragDist;
    }

    stateRef.current.currentDragDist = dist;
    stateRef.current.currentAngleRad = Math.atan2(dy, dx);

    if (joystickInnerRef.current) {
      joystickInnerRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    if (joystickArrowRef.current) {
      const angleDeg = (stateRef.current.currentAngleRad + Math.PI / 2) * (180 / Math.PI);
      joystickArrowRef.current.style.transform = `translateX(-50%) rotate(${angleDeg}deg)`;
    }
  };

  const fireBullet = (startX: number, startY: number, angleRad: number) => {
    playShootSound();
    setIsShooting(true);
    stateRef.current.isShooting = true;

    const paRect = containerRef.current!.getBoundingClientRect();

    // Bounds relative to viewport
    const wallLeft = paRect.left;
    const wallRight = paRect.right;
    const wallTop = paRect.top + 6;
    const wallBottom = paRect.bottom;

    const SPEED = 11;
    let vx = Math.cos(angleRad) * SPEED;
    let vy = Math.sin(angleRad) * SPEED;
    const R = 8;

    let bx = startX - R, by = startY - R;

    setShowBullet(true);
    bulletRef.current!.style.position = 'absolute';

    let bulletStepCount = 0;

    const step = () => {
      bx += vx;
      by += vy;

      if (bx < wallLeft) { bx = wallLeft; vx = Math.abs(vx); }
      if (bx > wallRight - R * 2) { bx = wallRight - R * 2; vx = -Math.abs(vx); }
      if (by < wallTop) { by = wallTop; vy = Math.abs(vy); }
      if (by > wallBottom - R * 2) { by = wallBottom - R * 2; vy = -Math.abs(vy); }

      // Map to PlayArea coordinates for CSS
      bulletRef.current!.style.left = (bx - paRect.left) + 'px';
      bulletRef.current!.style.top = (by - paRect.top) + 'px';

      const bcx = bx + R, bcy = by + R;

      for (let i = 0; i < 4; i++) {
        if (stateRef.current.removedBalls.has(i)) continue;
        const ball = ballRefs.current[i];
        if (!ball || ball.classList.contains('hidden')) continue;

        const br = ball.getBoundingClientRect();
        const ballCX = br.left + br.width / 2;
        const ballCY = br.top + br.height / 2;
        const ballRadius = br.width / 2;

        if (Math.hypot(bcx - ballCX, bcy - ballCY) < ballRadius + R + 2) {
          endBullet(true);
          checkAnswer(i);
          return;
        }
      }

      bulletStepCount++;
      if (bulletStepCount > 400) {
        endBullet(false);
        return;
      }

      stateRef.current.animFrame = requestAnimationFrame(step);
    };
    stateRef.current.animFrame = requestAnimationFrame(step);
  };

  const endBullet = (hit: boolean) => {
    setShowBullet(false);
    if (!hit) {
      showToast('MISS!', 'wrong');
      setIsShooting(false);
      stateRef.current.isShooting = false;
    }
  };

  const checkAnswer = (index: number) => {
    const isCorrect = stateRef.current.options[index] === stateRef.current.question?.answer;

    const exitClasses = ['exit-left', 'exit-right', 'exit-up'];

    if (isCorrect) {
      setBallStates(prev => {
        const next = [...prev];
        for (let i = 0; i < 4; i++) {
          if (i === index) next[i] = 'popping';
          else if (!next[i] && !fiftyRemoved.includes(i)) next[i] = exitClasses[i % 3];
        }
        return next;
      });
      spawnConfetti(document.getElementById('game-container')!);
      playCorrectSound();
      showToast('+100 CORRECT!', 'correct');
    } else {
      setJoystickShake(false);
      setTimeout(() => setJoystickShake(true), 10);

      setBallStates(prev => {
        const next = [...prev];
        for (let i = 0; i < 4; i++) {
          if (i === index) next[i] = exitClasses[index % 3];
          else if (!next[i] && !fiftyRemoved.includes(i)) next[i] = exitClasses[i % 3];
        }
        return next;
      });
      playWrongSound();
      showToast('-10 WRONG!', 'wrong');
    }

    stateRef.current.onAnswer(index, isCorrect);
  };

  const getBallStyles = (index: number): React.CSSProperties => {
    if (!containerRef.current) return {};

    return {
      left: `calc(${BALL_POSITIONS[index].x * 100}% - clamp(27px, 9vmin, 40px))`,
      top: `calc(${BALL_POSITIONS[index].y * 100}% - clamp(27px, 9vmin, 40px))`,
      animationDelay: `${index * 0.08}s`
    };
  };

  const ballColors = ['color-red', 'color-green', 'color-gold', 'color-blue'];

  return (
    <div id="play-area" style={{ pointerEvents: 'none' }} ref={containerRef}>
      <div id="upper-wall"></div>

      {currentOptions.map((opt, i) => {
        let classNames = `ball ${ballColors[i]} entering`;
        if (fiftyRemoved.includes(i)) {
          classNames = `ball ${ballColors[i]} exit-left hidden`;
        } else if (ballStates[i]) {
          classNames = `ball ${ballColors[i]} ${ballStates[i]}`;
        } else if (!isShooting) {
          classNames = `ball ${ballColors[i]} floating`;
        }

        return (
          <div
            key={`${currentQuestion?.question}-${i}`}
            className={classNames}
            style={getBallStyles(i)}
            ref={el => ballRefs.current[i] = el}
          >
            <span className="ball-text">{opt}</span>
          </div>
        );
      })}

      <div id="joystick-container" className={joystickActive ? 'active' : ''} style={{ pointerEvents: 'auto' }}>
        <div id="joystick-outer" ref={joystickOuterRef} className={joystickShake ? 'joystick-shake' : ''}>
          <div id="joystick-arrow" ref={joystickArrowRef}></div>
          <div
            id="joystick-inner"
            ref={joystickInnerRef}
            onMouseDown={handleDragStart}
            onTouchStart={(e) => handleDragStart(e.touches[0])}
          ></div>
        </div>
      </div>

      <svg id="trajectory-svg" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 20 }}></svg>

      {/* Put bullet in game container instead of play area for absolute coords */}
      <div id="bullet" className={showBullet ? '' : 'hidden'} ref={bulletRef}></div>

      {toast && (
        <div className={`feedback-popup ${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
