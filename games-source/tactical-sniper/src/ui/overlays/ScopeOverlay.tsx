import { useEffect, useRef } from 'react';

interface Props {
  visible: boolean;
  onClose?: () => void;
}

export function ScopeOverlay({ visible }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const W = canvas.width = window.innerWidth;
      const H = canvas.height = window.innerHeight;
      const cx = W / 2, cy = H / 2;
      const r = Math.min(W, H) * 0.38;

      ctx.clearRect(0, 0, W, H);

      if (!visible) return;

      // ── Black Vignette (Full screen except circular scope lens) ──
      ctx.save();
      ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
      ctx.fillRect(0, 0, W, H);

      // Cut out transparent circular scope lens
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();

      // ── Scope Outer Heavy Bezel Ring ─────────────────────────────
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.98)';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Lens Rim
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // ── Crisp Sniper Reticle Lines ───────────────────────────────
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.92)';
      ctx.lineWidth = 2.0;

      const gap = 16;
      const L = r - 10;

      // Horizontal lines
      ctx.beginPath(); ctx.moveTo(cx - L, cy); ctx.lineTo(cx - gap, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + gap, cy); ctx.lineTo(cx + L, cy); ctx.stroke();

      // Vertical lines
      ctx.beginPath(); ctx.moveTo(cx, cy - L); ctx.lineTo(cx, cy - gap); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy + gap * 1.5); ctx.lineTo(cx, cy + L); ctx.stroke();

      // ── Mil-Dots Along Reticle ──────────────────────────────────
      const milDots = [r * 0.25, r * 0.50, r * 0.75];
      for (const d of milDots) {
        for (const [dx, dy] of [[d, 0], [-d, 0], [0, d], [0, -d]]) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
          ctx.beginPath();
          ctx.arc(cx + dx, cy + dy, 3.0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Ranging Tick Marks
      for (const d of milDots) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.lineWidth = 1.5;
        const tickW = d < r * 0.4 ? 12 : 8;
        ctx.beginPath(); ctx.moveTo(cx - tickW, cy + d); ctx.lineTo(cx + tickW, cy + d); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - tickW * 0.6, cy - d); ctx.lineTo(cx + tickW * 0.6, cy - d); ctx.stroke();
      }

      // ── Center Red Aim Point ─────────────────────────────────────
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // ── High-Tech Scope HUD Panel ────────────────────────────────
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1;
      ctx.fillRect(cx + r + 16, cy - 32, 130, 68);
      ctx.strokeRect(cx + r + 16, cy - 32, 130, 68);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '900 12px "Orbitron", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('SNIPER 4×', cx + r + 24, cy - 14);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('WIND  1.8 m/s', cx + r + 24, cy + 6);
      ctx.fillText('ELEV  -21.5 m', cx + r + 24, cy + 22);
    };

    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 95, pointerEvents: 'none' }}>
      {/* 2D Canvas Scope Mask */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}
