import React, { useRef, useCallback } from 'react';

export interface JoystickOutput {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

interface Props {
  onChange:       (out: JoystickOutput) => void;
  onShoot:        () => void;
  onToggleScope:  () => void;
  isScoped:       boolean;
}

const MAX_R = 48;

export function VirtualJoystick({ onChange, onShoot, onToggleScope, isScoped }: Props) {
  const knobRef  = useRef<HTMLDivElement>(null);
  const ptrId    = useRef<number | null>(null);
  const basePos  = useRef({ x: 0, y: 0 });

  const reset = useCallback(() => {
    if (knobRef.current) knobRef.current.style.transform = 'translate(-50%, -50%)';
    ptrId.current = null;
    onChange({ left: false, right: false, up: false, down: false });
  }, [onChange]);

  const onDown = useCallback((e: React.PointerEvent) => {
    if (ptrId.current !== null) return;
    ptrId.current = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    basePos.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerId !== ptrId.current) return;
    const dx = e.clientX - basePos.current.x;
    const dy = e.clientY - basePos.current.y;
    const dist = Math.min(Math.hypot(dx, dy), MAX_R);
    const angle = Math.atan2(dy, dx);
    const kx = Math.cos(angle) * dist;
    const ky = Math.sin(angle) * dist;
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;
    }
    // 4-directional analog detection
    onChange({
      left:  dx < -10,
      right: dx >  10,
      up:    dy < -10, // Dragging UP moves forward
      down:  dy >  10, // Dragging DOWN moves backward
    });
  }, [onChange]);

  const onUp = useCallback((e: React.PointerEvent) => {
    if (e.pointerId !== ptrId.current) return;
    reset();
  }, [reset]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 110 }}>

      {/* ── LEFT 4-WAY JOYSTICK BASE (Natural thumb position like BGMI) ── */}
      <div
        className="joystick-zone"
        style={{
          position: 'absolute', left: 'max(4vw, 24px)', bottom: 'max(6vh, 48px)',
          width: 130, height: 130,
          pointerEvents: 'all', touchAction: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          style={{
            position: 'relative', width: 118, height: 118, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(15,23,42,0.85) 0%, rgba(2,6,23,0.94) 100%)',
            border: '2px solid rgba(148,163,184,0.45)',
            boxShadow: '0 0 24px rgba(0,0,0,0.8), inset 0 0 12px rgba(56,189,248,0.15)',
            cursor: 'grab',
          }}
        >
          {/* Directional Arrow Hints */}
          <span style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>▲</span>
          <span style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>▼</span>
          <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>◄</span>
          <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>►</span>

          {/* Crosshair guide lines */}
          <div style={{ position: 'absolute', top: '50%', left: 18, right: 18, height: 1, background: 'rgba(255,255,255,0.12)' }} />
          <div style={{ position: 'absolute', left: '50%', top: 18, bottom: 18, width: 1, background: 'rgba(255,255,255,0.12)' }} />

          {/* Draggable Knob */}
          <div ref={knobRef} style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 50, height: 50, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.95) 0%, rgba(2,132,199,0.9) 100%)',
            border: '2px solid rgba(191,219,254,0.95)',
            boxShadow: '0 0 18px rgba(56,189,248,0.7)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* ── SCOPE (ADS) BUTTON — TAP TO TOGGLE (BGMI Style) ── */}
      <button
        onPointerDown={(e) => {
          e.stopPropagation();
          onToggleScope();
        }}
        style={{
          position: 'absolute', right: 'max(12vw, 110px)', bottom: 'max(12vh, 80px)',
          width: 68, height: 68, borderRadius: '50%',
          border: `3px solid ${isScoped ? '#fbbf24' : 'rgba(56,189,248,0.85)'}`,
          background: isScoped
            ? 'radial-gradient(circle, rgba(251,191,36,0.95) 0%, rgba(180,130,20,0.9) 100%)'
            : 'radial-gradient(circle, rgba(30,58,138,0.9) 0%, rgba(15,23,42,0.85) 100%)',
          color: isScoped ? '#0f172a' : '#f8fafc',
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: 1,
          fontFamily: '"Orbitron", system-ui, sans-serif',
          cursor: 'pointer',
          pointerEvents: 'all',
          touchAction: 'none',
          boxShadow: isScoped
            ? '0 0 24px rgba(251,191,36,0.85)'
            : '0 0 16px rgba(56,189,248,0.5)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 2,
          transition: 'all 0.12s ease',
          userSelect: 'none',
        }}
        aria-label="Toggle Sniper Scope"
      >
        <span style={{ fontSize: 18 }}>🔭</span>
        <span>{isScoped ? 'EXIT' : 'SCOPE'}</span>
      </button>

      {/* ── SHOOT FIRE BUTTON (Dedicated Tap to Shoot) ── */}
      <button
        onPointerDown={(e) => {
          e.stopPropagation();
          onShoot();
        }}
        style={{
          position: 'absolute', right: 'max(4vw, 24px)', bottom: 'max(6vh, 40px)',
          width: 84, height: 84, borderRadius: '50%',
          border: '3px solid rgba(248,113,113,0.95)',
          background: 'radial-gradient(circle at 35% 35%, #ef4444 0%, #dc2626 55%, #991b1b 100%)',
          color: '#ffffff',
          fontSize: 13,
          fontWeight: 900,
          letterSpacing: 1.5,
          fontFamily: '"Orbitron", system-ui, sans-serif',
          cursor: 'pointer',
          pointerEvents: 'all',
          touchAction: 'none',
          boxShadow: '0 0 28px rgba(239,68,68,0.7), inset 0 2px 4px rgba(255,255,255,0.4)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 2,
          transition: 'transform 0.08s ease',
          userSelect: 'none',
        }}
        aria-label="Fire Sniper Weapon"
        onPointerEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1.0)')}
      >
        <span style={{ fontSize: 26, lineHeight: 1 }}>🔫</span>
        <span>FIRE</span>
      </button>

    </div>
  );
}
