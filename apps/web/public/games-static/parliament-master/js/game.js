/* ═══════════════════════════════════════════════════════
   Parliament Master – Game Engine
   ═══════════════════════════════════════════════════════ */

// ── Canvas & Context ──
let canvas, ctx;
let W, H;

// ── Game State ──
let gameState = 'menu';
let coins = 0;
let streak = 0;
let bestStreak = 0;
let currentQuestion = 0;
const questionsPerLevel = 10;
let correctCount = 0;
let levelQuestions = [];

// ── Archer ──
let archer = {};

// ── Arrow ──
let arrow = null;
let isAiming = false;
let aimStart = null;
let aimEnd = null;
let bowDraw = 0;
let answered = false;

// ── Platforms ──
let platforms = [];
let correctPlatformIdx = -1;

// ── Visual Effects ──
let clouds = [];
let confetti = [];
let sparkles = [];
let coinAnims = [];
let cameraShake = { x: 0, y: 0, intensity: 0 };

// ── Feedback ──
let feedbackState = 'none';
let feedbackTimer = 0;

// ── Animation ──
let animFrame = 0;
let lastTime = 0;

// ── Audio ──
let audioCtx = null;
const soundEnabled = true;

// ── Device ──
const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/* ═══════════════════════════════════════════════════════
   roundRect Polyfill
   ═══════════════════════════════════════════════════════ */

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
    else r = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, r);
    this.beginPath();
    this.moveTo(x + r.tl, y);
    this.lineTo(x + w - r.tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    this.lineTo(x + w, y + h - r.br);
    this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    this.lineTo(x + r.bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    this.lineTo(x, y + r.tl);
    this.quadraticCurveTo(x, y, x + r.tl, y);
    this.closePath();
    return this;
  };
}

/* ═══════════════════════════════════════════════════════
   Audio System
   ═══════════════════════════════════════════════════════ */

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(type) {
  if (!audioCtx || !soundEnabled) return;
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const t = audioCtx.currentTime;

    switch (type) {
      case 'bow':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.15);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.start(t); osc.stop(t + 0.2);
        break;

      case 'shoot':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(200, t + 0.15);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.start(t); osc.stop(t + 0.15);
        break;

      case 'correct':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, t);
        osc.frequency.setValueAtTime(659, t + 0.1);
        osc.frequency.setValueAtTime(784, t + 0.2);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        osc.start(t); osc.stop(t + 0.4);
        break;

      case 'wrong':
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.3);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        osc.start(t); osc.stop(t + 0.3);
        break;

      case 'coin':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.setValueAtTime(1600, t + 0.05);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        osc.start(t); osc.stop(t + 0.12);
        break;

      case 'victory':
        [523, 659, 784, 1047].forEach((f, i) => {
          const o2 = audioCtx.createOscillator();
          const g2 = audioCtx.createGain();
          o2.connect(g2); g2.connect(audioCtx.destination);
          o2.type = 'sine';
          o2.frequency.setValueAtTime(f, t + i * 0.15);
          g2.gain.setValueAtTime(0.2, t + i * 0.15);
          g2.gain.exponentialRampToValueAtTime(0.01, t + i * 0.15 + 0.3);
          o2.start(t + i * 0.15); o2.stop(t + i * 0.15 + 0.3);
        });
        return;

      case 'levelcomplete':
        [440, 554, 659, 880].forEach((f, i) => {
          const o2 = audioCtx.createOscillator();
          const g2 = audioCtx.createGain();
          o2.connect(g2); g2.connect(audioCtx.destination);
          o2.type = 'triangle';
          o2.frequency.setValueAtTime(f, t + i * 0.2);
          g2.gain.setValueAtTime(0.2, t + i * 0.2);
          g2.gain.exponentialRampToValueAtTime(0.01, t + i * 0.2 + 0.4);
          o2.start(t + i * 0.2); o2.stop(t + i * 0.2 + 0.4);
        });
        return;
    }
  } catch (e) { /* silent */ }
}

/* ═══════════════════════════════════════════════════════
   Utilities
   ═══════════════════════════════════════════════════════ */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ═══════════════════════════════════════════════════════
   Resize
   ═══════════════════════════════════════════════════════ */

function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
  archer.x = W * 0.1;
  archer.y = H * 0.72;
  archer.width = 60;
  archer.height = 90;
}

/* ═══════════════════════════════════════════════════════
   Clouds
   ═══════════════════════════════════════════════════════ */

function initClouds() {
  clouds = [];
  for (let i = 0; i < 6; i++) {
    clouds.push({
      x: Math.random() * W * 1.5 - W * 0.25,
      y: Math.random() * H * 0.25 + 10,
      w: 60 + Math.random() * 80,
      speed: 0.15 + Math.random() * 0.3,
      opacity: 0.4 + Math.random() * 0.4
    });
  }
}

/* ═══════════════════════════════════════════════════════
   Level Generation
   ═══════════════════════════════════════════════════════ */

function generateLevel() {
  const shuffled = shuffle(QUESTIONS);
  levelQuestions = shuffled.slice(0, questionsPerLevel);
  currentQuestion = 0;
  correctCount = 0;
  streak = 0;
  bestStreak = 0;
}

function spawnPlatforms() {
  platforms = [];
  const q = levelQuestions[currentQuestion];
  const opts = shuffle(q.options);
  const correctIdx = opts.indexOf(q.correct);
  const margin = 120;
  const usableW = W - margin * 2;
  const usableH = H * 0.25;
  const topY = H * 0.32;
  const positions = [];

  for (let i = 0; i < 4; i++) {
    let px, py, tries = 0;
    do {
      px = margin + (usableW / 4) * i + Math.random() * (usableW / 4 - 80);
      py = topY + Math.random() * usableH;
      tries++;
    } while (tries < 20 && positions.some(p => Math.abs(p.x - px) < 100 && Math.abs(p.y - py) < 60));
    positions.push({ x: px, y: py });

    const diff = currentQuestion;
    let speedX = 0, speedY = 0;
    if (diff >= 3 && diff < 7) {
      speedX = 0.3 + Math.random() * 0.4;
    } else if (diff >= 7) {
      speedX = 0.6 + Math.random() * 0.6;
      speedY = 0.15 + Math.random() * 0.25;
    }

    platforms.push({
      x: px, y: py, w: 140, h: 50,
      text: opts[i],
      isCorrect: i === correctIdx,
      speedX, speedY,
      dirX: Math.random() > 0.5 ? 1 : -1,
      dirY: Math.random() > 0.5 ? 1 : -1,
      hit: false,
      bouncePhase: Math.random() * Math.PI * 2,
      highlighted: false,
      highlightTimer: 0
    });
  }
  correctPlatformIdx = platforms.findIndex(p => p.isCorrect);
}

/* ═══════════════════════════════════════════════════════
   Arrow Physics
   ═══════════════════════════════════════════════════════ */

function getAngleFromArcher(targetX, targetY) {
  const dx = targetX - archer.x;
  const dy = targetY - archer.y;
  return Math.atan2(dy, dx);
}

function shootArrow(targetX, targetY) {
  if (arrow || answered) return;
  initAudio();
  answered = true;
  const angle = getAngleFromArcher(targetX, targetY);
  const speed = 12;
  arrow = {
    x: archer.x + 30,
    y: archer.y - 10,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    angle, trail: [], alive: true, lifetime: 0
  };
  bowDraw = 1;
  playSound('shoot');
}

function checkArrowCollision() {
  if (!arrow || !arrow.alive) return;
  for (let i = 0; i < platforms.length; i++) {
    const p = platforms[i];
    if (p.hit) continue;
    if (arrow.x > p.x && arrow.x < p.x + p.w && arrow.y > p.y && arrow.y < p.y + p.h) {
      arrow.alive = false;
      handleArrowImpact(i);
      return;
    }
  }
  if (arrow.lifetime > 120) {
    arrow.alive = false;
    arrow = null;
    answered = false;
  }
}

function updateArrow() {
  if (!arrow || !arrow.alive) return;
  arrow.trail.push({ x: arrow.x, y: arrow.y });
  if (arrow.trail.length > 15) arrow.trail.shift();
  arrow.x += arrow.vx;
  arrow.y += arrow.vy;
  arrow.vy += 0.08;
  arrow.angle = Math.atan2(arrow.vy, arrow.vx);
  arrow.lifetime++;
  checkArrowCollision();
}

/* ═══════════════════════════════════════════════════════
   Impact & Scoring
   ═══════════════════════════════════════════════════════ */

function handleArrowImpact(platformIdx) {
  const p = platforms[platformIdx];
  p.hit = true;

  if (p.isCorrect) {
    coins += 10;
    streak++;
    if (streak > bestStreak) bestStreak = streak;
    correctCount++;
    if (streak >= 5) {
      coins += 50;
      spawnCoinAnim(W / 2, H / 2 - 30);
    }
    playSound('correct');
    spawnConfetti(p.x + p.w / 2, p.y + p.h / 2);
    spawnSparkles(p.x + p.w / 2, p.y + p.h / 2);
    spawnCoinAnim(p.x + p.w / 2, p.y - 20);
    spawnStarBurst(p.x + p.w / 2, p.y + p.h / 2);
    feedbackState = 'correct';
    feedbackTimer = 60;
  } else {
    streak = 0;
    playSound('wrong');
    triggerCameraShake(15);
    p.highlighted = true;
    p.highlightTimer = 120;
    platforms[correctPlatformIdx].highlighted = true;
    platforms[correctPlatformIdx].highlightTimer = 120;
    feedbackState = 'wrong';
    feedbackTimer = 90;
  }

  updateHUD();
  setTimeout(() => {
    arrow = null;
    nextQuestion();
  }, p.isCorrect ? 1000 : 2000);
}

/* ═══════════════════════════════════════════════════════
   Platform Movement
   ═══════════════════════════════════════════════════════ */

function updatePlatforms() {
  platforms.forEach(p => {
    if (p.hit) return;
    if (p.speedX !== 0) {
      p.x += p.speedX * p.dirX;
      if (p.x < 20 || p.x + p.w > W - 20) p.dirX *= -1;
    }
    if (p.speedY !== 0) {
      p.y += p.speedY * p.dirY;
      if (p.y < H * 0.25 || p.y > H * 0.65) p.dirY *= -1;
    }
    p.bouncePhase += 0.02;
  });
}

/* ═══════════════════════════════════════════════════════
   Particle Effects
   ═══════════════════════════════════════════════════════ */

function spawnConfetti(x, y) {
  for (let i = 0; i < 60; i++) {
    confetti.push({
      x, y,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 10 - 3,
      color: ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#ff6b35', '#4a9eff'][Math.floor(Math.random() * 7)],
      size: 4 + Math.random() * 6,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.3,
      life: 1,
      decay: 0.008 + Math.random() * 0.01
    });
  }
}

function spawnSparkles(x, y) {
  for (let i = 0; i < 25; i++) {
    sparkles.push({
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 40,
      size: 2 + Math.random() * 5,
      life: 1, decay: 0.02 + Math.random() * 0.02,
      color: ['#ffd700', '#fff', '#ff6'][Math.floor(Math.random() * 3)]
    });
  }
}

function spawnCoinAnim(x, y) {
  coinAnims.push({ x, y, text: '+10', life: 1, vy: -2 });
  playSound('coin');
}

function spawnStarBurst(x, y) {
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 / 12) * i;
    sparkles.push({
      x, y,
      vx: Math.cos(angle) * 4,
      vy: Math.sin(angle) * 4,
      size: 3 + Math.random() * 4,
      life: 1, decay: 0.015,
      color: '#ffd700', isStar: true
    });
  }
}

function updateParticles() {
  confetti = confetti.filter(p => {
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.15; p.rot += p.rotSpeed;
    p.life -= p.decay;
    return p.life > 0;
  });
  sparkles = sparkles.filter(p => {
    p.x += (p.vx || 0); p.y += (p.vy || 0);
    p.life -= p.decay;
    return p.life > 0;
  });
  coinAnims = coinAnims.filter(c => {
    c.y += c.vy; c.life -= 0.015;
    return c.life > 0;
  });
}

/* ═══════════════════════════════════════════════════════
   Camera Shake
   ═══════════════════════════════════════════════════════ */

function triggerCameraShake(intensity) {
  cameraShake.intensity = intensity;
}

function updateCamera() {
  if (cameraShake.intensity > 0) {
    cameraShake.x = (Math.random() - 0.5) * cameraShake.intensity;
    cameraShake.y = (Math.random() - 0.5) * cameraShake.intensity;
    cameraShake.intensity *= 0.88;
    if (cameraShake.intensity < 0.5) cameraShake.intensity = 0;
  } else {
    cameraShake.x = 0;
    cameraShake.y = 0;
  }
}

/* ═══════════════════════════════════════════════════════
   Drawing – Background
   ═══════════════════════════════════════════════════════ */

function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#87CEEB');
  grad.addColorStop(0.5, '#B0E0FF');
  grad.addColorStop(0.85, '#7BC67E');
  grad.addColorStop(1, '#4A8C4A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // rolling hills
  ctx.fillStyle = '#5DA85D';
  ctx.beginPath();
  ctx.moveTo(0, H * 0.78);
  for (let x = 0; x <= W; x += 30) {
    ctx.lineTo(x, H * 0.78 + Math.sin(x * 0.01 + animFrame * 0.005) * 8);
  }
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();

  ctx.fillStyle = '#4A8C4A';
  ctx.beginPath();
  ctx.moveTo(0, H * 0.82);
  for (let x = 0; x <= W; x += 25) {
    ctx.lineTo(x, H * 0.82 + Math.sin(x * 0.015 + 1) * 6);
  }
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
}

function drawClouds() {
  clouds.forEach(c => {
    c.x += c.speed;
    if (c.x > W + c.w) c.x = -c.w * 2;
    ctx.globalAlpha = c.opacity;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.w * 0.5, c.w * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x - c.w * 0.2, c.y + 5, c.w * 0.35, c.w * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x + c.w * 0.25, c.y + 3, c.w * 0.3, c.w * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

/* ═══════════════════════════════════════════════════════
   Drawing – Archer
   ═══════════════════════════════════════════════════════ */

function drawArcher() {
  const ax = archer.x;
  const ay = archer.y;
  const bounce = Math.sin(animFrame * 0.05) * 2;

  ctx.save();
  ctx.translate(ax, ay + bounce);

  // legs
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(-8, -10, 16, 50);
  ctx.fillStyle = '#654321';
  ctx.beginPath(); ctx.arc(0, 42, 10, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(18, 42, 10, 0, Math.PI * 2); ctx.fill();

  // head
  ctx.fillStyle = '#FFD5B4';
  ctx.beginPath(); ctx.arc(0, -35, 18, 0, Math.PI * 2); ctx.fill();

  // eyes
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(-5, -37, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, -37, 2.5, 0, Math.PI * 2); ctx.fill();

  // smile
  ctx.fillStyle = '#FF6347';
  ctx.beginPath(); ctx.arc(0, -30, 4, 0, Math.PI); ctx.fill();

  // body
  ctx.fillStyle = '#C0392B';
  ctx.fillRect(-15, -17, 30, 22);
  ctx.fillStyle = '#E74C3C';
  ctx.fillRect(-12, -14, 24, 16);

  // quiver
  ctx.fillStyle = '#654321';
  ctx.fillRect(-4, -55, 2, 40);
  ctx.beginPath();
  ctx.moveTo(-2, -55); ctx.lineTo(-2, -15);
  ctx.quadraticCurveTo(20, -15, 2, -55);
  ctx.strokeStyle = '#8B6914'; ctx.lineWidth = 2; ctx.stroke();

  // bow
  const bowAngle = isAiming ? -0.3 : 0;
  ctx.save();
  ctx.translate(10, -15);
  ctx.rotate(bowAngle);
  ctx.beginPath();
  ctx.moveTo(0, -25);
  ctx.quadraticCurveTo(25, 0, 0, 25);
  ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 3; ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -25); ctx.lineTo(0, 25);
  ctx.strokeStyle = '#D4A574'; ctx.lineWidth = 1; ctx.stroke();
  ctx.restore();

  ctx.restore();
}

/* ═══════════════════════════════════════════════════════
   Drawing – Platforms
   ═══════════════════════════════════════════════════════ */

function drawPlatform(p) {
  const bounceY = Math.sin(p.bouncePhase) * 4;
  const px = p.x;
  const py = p.y + bounceY;

  ctx.save();
  ctx.translate(px + p.w / 2, py + p.h / 2);

  if (p.highlighted) {
    const pulse = Math.sin(animFrame * 0.3) * 0.3 + 0.7;
    ctx.shadowColor = p.isCorrect ? '#0f0' : '#f00';
    ctx.shadowBlur = 20 * pulse;
  }

  // wood body
  const grad = ctx.createLinearGradient(-p.w / 2, -p.h / 2, -p.w / 2, p.h / 2);
  grad.addColorStop(0, '#C4A265');
  grad.addColorStop(0.5, '#B8934A');
  grad.addColorStop(1, '#A07830');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 10); ctx.fill();

  // border
  ctx.strokeStyle = '#8B6914'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 10); ctx.stroke();

  // wood grain lines
  for (let i = 0; i < 3; i++) {
    const lineY = -p.h / 2 + (p.h / 4) * (i + 1);
    ctx.beginPath();
    ctx.moveTo(-p.w / 2 + 5, lineY);
    ctx.lineTo(p.w / 2 - 5, lineY);
    ctx.strokeStyle = 'rgba(139,105,20,0.3)'; ctx.lineWidth = 1; ctx.stroke();
  }

  // highlight overlays
  if (p.hit && p.isCorrect) {
    ctx.fillStyle = 'rgba(46,204,113,0.4)';
    ctx.beginPath(); ctx.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 10); ctx.fill();
  } else if (p.highlighted && !p.isCorrect && feedbackState === 'wrong') {
    const pulse = Math.sin(animFrame * 0.4) * 0.3 + 0.3;
    ctx.fillStyle = `rgba(231,76,60,${pulse})`;
    ctx.beginPath(); ctx.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 10); ctx.fill();
  } else if (p.highlighted && p.isCorrect && feedbackState === 'wrong') {
    ctx.fillStyle = 'rgba(46,204,113,0.35)';
    ctx.beginPath(); ctx.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 10); ctx.fill();
  }

  // label
  ctx.fillStyle = '#FFF8DC';
  ctx.font = 'bold 15px "Segoe UI", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 3;
  ctx.fillText(p.text, 0, 0);
  ctx.shadowBlur = 0;

  ctx.restore();
}

/* ═══════════════════════════════════════════════════════
   Drawing – Arrow
   ═══════════════════════════════════════════════════════ */

function drawArrowTrail() {
  if (!arrow || !arrow.trail.length) return;
  ctx.beginPath();
  ctx.moveTo(arrow.trail[0].x, arrow.trail[0].y);
  arrow.trail.forEach(t => ctx.lineTo(t.x, t.y));
  ctx.strokeStyle = 'rgba(139,69,19,0.4)'; ctx.lineWidth = 2; ctx.stroke();
}

function drawArrow() {
  if (!arrow || !arrow.alive) return;
  ctx.save();
  ctx.translate(arrow.x, arrow.y);
  ctx.rotate(arrow.angle);

  ctx.fillStyle = '#8B4513';
  ctx.fillRect(-20, -2, 30, 4);

  ctx.fillStyle = '#C0C0C0';
  ctx.beginPath();
  ctx.moveTo(15, 0); ctx.lineTo(25, -4); ctx.lineTo(25, 4); ctx.fill();

  ctx.fillStyle = '#E74C3C';
  ctx.beginPath();
  ctx.moveTo(-20, 0); ctx.lineTo(-28, -5); ctx.lineTo(-28, 5); ctx.fill();

  ctx.restore();
}

/* ═══════════════════════════════════════════════════════
   Drawing – Effects
   ═══════════════════════════════════════════════════════ */

function drawConfetti() {
  confetti.forEach(p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.globalAlpha = 1;
    ctx.restore();
  });
}

function drawStar(cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    const innerAngle = angle + Math.PI / 5;
    ctx.lineTo(cx + Math.cos(innerAngle) * r * 0.4, cy + Math.sin(innerAngle) * r * 0.4);
  }
  ctx.closePath(); ctx.fill();
}

function drawSparkles() {
  sparkles.forEach(p => {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    if (p.isStar) drawStar(p.x, p.y, p.size);
    else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1;
  });
}

function drawCoinAnims() {
  coinAnims.forEach(c => {
    ctx.globalAlpha = c.life;
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 22px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 4;
    ctx.fillText(c.text, c.x, c.y);
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  });
}

function drawAimLine() {
  if (!isAiming || !aimStart || !aimEnd) return;
  const dx = aimStart.x - aimEnd.x;
  const dy = aimStart.y - aimEnd.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const power = Math.min(dist / 150, 1);
  const angle = Math.atan2(dy, dx);

  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(archer.x + 30, archer.y - 10);
  const lineLen = 200 * power;
  ctx.lineTo(archer.x + 30 + Math.cos(angle) * lineLen, archer.y - 10 + Math.sin(angle) * lineLen);
  ctx.strokeStyle = `rgba(255,255,255,${0.5 * power})`;
  ctx.lineWidth = 2; ctx.stroke();
  ctx.setLineDash([]);
}

function drawFeedback() {
  if (feedbackState === 'correct' && feedbackTimer > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(feedbackTimer / 30, 1);
    ctx.fillStyle = '#2ecc71';
    ctx.font = 'bold 48px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 8;
    ctx.fillText('\u2713 Correct!', W / 2, H / 2 + 80);
    ctx.shadowBlur = 0; ctx.globalAlpha = 1; ctx.restore();
  } else if (feedbackState === 'wrong' && feedbackTimer > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(feedbackTimer / 45, 1);
    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 48px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 8;
    ctx.fillText('\u2717 Wrong!', W / 2, H / 2 + 80);
    ctx.shadowBlur = 0; ctx.globalAlpha = 1; ctx.restore();
  }
}

/* ═══════════════════════════════════════════════════════
   Main Draw & Update
   ═══════════════════════════════════════════════════════ */

function draw() {
  ctx.save();
  ctx.translate(cameraShake.x, cameraShake.y);

  drawBackground();
  drawClouds();

  if (gameState === 'playing') {
    platforms.forEach(p => drawPlatform(p));
    drawArrowTrail();
    drawArrow();
    drawArcher();
    drawAimLine();
    drawConfetti();
    drawSparkles();
    drawCoinAnims();
    drawFeedback();
  }

  ctx.restore();
}

function update() {
  if (gameState !== 'playing') return;
  animFrame++;
  updatePlatforms();
  updateArrow();
  updateParticles();
  updateCamera();
  if (bowDraw > 0) bowDraw *= 0.9;
  if (feedbackTimer > 0) feedbackTimer--;
  platforms.forEach(p => {
    if (p.highlightTimer > 0) {
      p.highlightTimer--;
      if (p.highlightTimer <= 0) p.highlighted = false;
    }
  });
}

function gameLoop(time) {
  lastTime = time;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

/* ═══════════════════════════════════════════════════════
   Input Handling
   ═══════════════════════════════════════════════════════ */

function getPointerPos(e) {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches ? e.touches[0] : e;
  return {
    x: (touch.clientX - rect.left) * (W / rect.width),
    y: (touch.clientY - rect.top) * (H / rect.height)
  };
}

function onPointerDown(e) {
  if (gameState !== 'playing' || answered) return;
  initAudio();
  const pos = getPointerPos(e);
  const dx = pos.x - archer.x;
  const dy = pos.y - archer.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 150 || isMobile) {
    isAiming = true;
    aimStart = pos;
    aimEnd = pos;
    bowDraw = 1;
    playSound('bow');
  }
}

function onPointerMove(e) {
  if (!isAiming) return;
  e.preventDefault();
  aimEnd = getPointerPos(e);
}

function onPointerUp() {
  if (!isAiming) return;
  isAiming = false;
  const pos = aimEnd || aimStart;
  if (aimStart && aimEnd) shootArrow(pos.x, pos.y);
  aimStart = null;
  aimEnd = null;
}

/* ═══════════════════════════════════════════════════════
   UI Helpers
   ═══════════════════════════════════════════════════════ */

function updateCountryDisplay() {
  const q = levelQuestions[currentQuestion];
  document.getElementById('country-flag').textContent = q.flag;
  document.getElementById('country-name').textContent = q.country.toUpperCase();
  document.getElementById('country-display').classList.remove('hidden');
}

function updateHUD() {
  document.getElementById('coins-text').textContent = coins;
  const streakEl = document.getElementById('streak-display');
  const streakText = document.getElementById('streak-text');
  if (streak >= 2) {
    streakEl.classList.remove('hidden');
    streakText.textContent = streak;
  } else {
    streakEl.classList.add('hidden');
  }
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= questionsPerLevel) { showEndScreen(); return; }
  answered = false;
  feedbackState = 'none';
  spawnPlatforms();
  updateCountryDisplay();
  document.getElementById('question-counter').textContent = `${currentQuestion + 1} / ${questionsPerLevel}`;
}

/* ═══════════════════════════════════════════════════════
   Screen Controllers
   ═══════════════════════════════════════════════════════ */

function startGame() {
  initAudio();
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('end-screen').classList.add('hidden');
  document.getElementById('pause-screen').classList.add('hidden');
  document.getElementById('country-display').classList.remove('hidden');
  if (isMobile) document.getElementById('mobile-hint').classList.remove('hidden');
  gameState = 'playing';
  coins = 0; streak = 0; bestStreak = 0;
  generateLevel();
  spawnPlatforms();
  initClouds();
  updateCountryDisplay();
  updateHUD();
  document.getElementById('question-counter').textContent = `1 / ${questionsPerLevel}`;
}

function togglePause() {
  if (gameState === 'playing') {
    gameState = 'paused';
    document.getElementById('pause-screen').classList.remove('hidden');
  } else if (gameState === 'paused') {
    gameState = 'playing';
    document.getElementById('pause-screen').classList.add('hidden');
  }
}

function quitToMenu() {
  gameState = 'menu';
  document.getElementById('pause-screen').classList.add('hidden');
  document.getElementById('end-screen').classList.add('hidden');
  document.getElementById('start-screen').classList.remove('hidden');
  document.getElementById('country-display').classList.add('hidden');
  document.getElementById('mobile-hint').classList.add('hidden');
}

function showEndScreen() {
  gameState = 'ended';
  document.getElementById('country-display').classList.add('hidden');
  document.getElementById('mobile-hint').classList.add('hidden');
  const accuracy = Math.round((correctCount / questionsPerLevel) * 100);
  const stars = accuracy >= 100 ? 3 : accuracy >= 70 ? 2 : accuracy >= 40 ? 1 : 0;
  const starStr = '\u2B50'.repeat(stars) + '\u2606'.repeat(3 - stars);
  const isPerfect = correctCount === questionsPerLevel;

  document.getElementById('end-content').innerHTML = `
    <div class="emoji">${isPerfect ? '\uD83C\uDFC6' : '\uD83C\uDFDB\uFE0F'}</div>
    <h2>Level Complete!</h2>
    <div class="stars">${starStr}</div>
    <div class="stat-row"><span>\uD83E\uDE99 Coins</span><span>${coins}</span></div>
    <div class="stat-row"><span>\uD83C\uDFAF Accuracy</span><span>${accuracy}%</span></div>
    <div class="stat-row"><span>\u2705 Correct</span><span>${correctCount}/${questionsPerLevel}</span></div>
    <div class="stat-row"><span>\uD83D\uDD25 Best Streak</span><span>${bestStreak}</span></div>
    ${isPerfect ? '<p style="color:#ffd700;margin:12px 0">\uD83C\uDFC6 Perfect Parliament Master!</p>' : ''}
    <button class="btn btn-primary" onclick="startGame()">\u25B6\uFE0F Play Again</button>
    <button class="btn btn-secondary" onclick="quitToMenu()">\uD83C\uDFE0 Home</button>
  `;
  document.getElementById('end-screen').classList.remove('hidden');
  playSound('levelcomplete');
  setTimeout(() => spawnConfetti(W / 2, H / 3), 300);
}

/* ═══════════════════════════════════════════════════════
   Initialization
   ═══════════════════════════════════════════════════════ */

function init() {
  canvas = document.getElementById('game');
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);

  canvas.addEventListener('mousedown', onPointerDown);
  canvas.addEventListener('mousemove', onPointerMove);
  canvas.addEventListener('mouseup', onPointerUp);
  canvas.addEventListener('mouseleave', onPointerUp);

  canvas.addEventListener('touchstart', onPointerDown, { passive: false });
  canvas.addEventListener('touchmove', onPointerMove, { passive: false });
  canvas.addEventListener('touchend', onPointerUp);
  canvas.addEventListener('touchcancel', onPointerUp);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' || e.key === 'p') togglePause();
  });

  initClouds();
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
