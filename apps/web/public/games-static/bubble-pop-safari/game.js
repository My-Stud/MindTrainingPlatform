// ============================================================
// BUBBLE POP SAFARI — Full Game with Level Selection + Level 2
// ============================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ── CONFIGURABLE SETTINGS ────────────────────────────────
const LEVEL_MAPS = [
  { 0:'M', 1:'L', 2:'R', 3:'N', 4:'S', 5:'P', 6:'B', 7:'T', 8:'K/J', 9:'G', 10:'A' },
  { 0:'M', 1:'L', 2:'R', 3:'N', 4:'S', 5:'P', 6:'B', 7:'T', 8:'K/J', 9:'G', 10:'A' },
  { 0:'M', 1:'L', 2:'R', 3:'N', 4:'S', 5:'P', 6:'B', 7:'T', 8:'K/J', 9:'G', 10:'A' }
];

function getCurrentMap() { return LEVEL_MAPS[currentLevel]; }
function getCurrentLetterToNumber() {
  const map = getCurrentMap();
  const rev = {};
  for (const [k, v] of Object.entries(map)) { rev[v] = parseInt(k); }
  return rev;
}

const SHOOTER_Y_OFFSET = 80;
const POP_ANIMATION_DURATION = 600;
const LETTER_DISPLAY_TIME = 1500;
const GRAVITY = 0.35;
const FALL_SPEED_CAP = 12;

// ── FONTS ────────────────────────────────────────────────
const FONT_TITLE = "'Baloo 2', cursive";
const FONT_BUTTON = "'Fredoka', sans-serif";
const FONT_LEVEL_CARD = "'Lilita One', cursive";
const FONT_SCORE = "'Nunito', sans-serif";
const FONT_WORDS = "'Baloo 2', cursive";
const FONT_BALLOON = "'Luckiest Guy', cursive";

// ── WORD DATA (from Excel — number.xlsx) ─────────────────
const WORD_LISTS = [
  [],
  ["MAN","MAP","MBA","MAT","LAB","RAAM","RAT","NP","NAG","PM"],
  ["MAN","MAP","MBA","MAT","LAB","RAAM","RAT","NP","NAG","PM"]
];

function getCurrentWords() { return WORD_LISTS[currentLevel]; }

// ── LEVEL CONFIG ─────────────────────────────────────────
const LEVEL_CONFIG = [
  { rows: [5, 4], label: 'Level 1', type: 'shooter' },
  { rows: [6, 5, 5], label: 'Level 2', type: 'words' },
  { rows: [6, 5, 5], label: 'Level 3', type: 'words' }
];

const BUBBLE_COLORS = [
  '#FF6B6B', '#FF8E53', '#FECA57', '#48DBFB',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#01A3A4'
];
const SHOOTER_COLORS = [
  '#FF6B6B', '#FF8E53', '#FECA57', '#48DBFB',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#01A3A4'
];

// ── STATE ────────────────────────────────────────────────
let W, H, dpr;
let bgImage = null;
let backgroundLoaded = false;
let bubbleRadius;
let shooterX, shooterY;

// Game flow
let gameState = 'menu'; // 'menu' | 'levelSelect' | 'playing' | 'levelComplete' | 'gameComplete' | 'wordsComplete'
let currentLevel = 0;
let levelTransitionTime = 0;
let levelTransitionDelay = 2500;

// Progress (persisted)
let progress = { level1Done: false, level2Done: false, level3Done: false, highScore: 0, level2Unlocked: true, level3Unlocked: true };

// ── LEVEL 1 STATE (Bubble Shooter) ──────────────────────
let bubbles = [];
let shooterBubble = null;
let nextBubble = null;
let aimAngle = -Math.PI / 2;
let isAiming = false;
let score = 0;
let totalScore = 0;
let collectedLetters = [];
let popAnimations = [];
let bullet = null;
let bulletTrail = [];
let impactBursts = [];

// ── LEVEL 2 STATE (Magic Bucket Words) ──────────────────
let l2 = {
  wordIndex: 0,
  word: '',
  letters: [],
  numberBalloons: [],
  bucketX: 0,
  bucketY: 0,
  phase: 'idle',
  phaseTime: 0,
  convertIndex: 0,
  convertedLetters: [],
  showWordTime: 0,
  score: 0,
  wordsCompleted: 0,
  fireworks: [],
  sparkleParticles: [],
  bucketGlow: 0,
  wordDisplayAlpha: 0,
  totalWords: 50,
  cauldronSmoke: [],
  cauldronMagic: [],
  cauldronBubbles: [],
  brewTimer: 0,
  risingLetters: [],
  risingLetterAlpha: 0
};

// ── AUDIO ────────────────────────────────────────────────
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}
function playSound(freq, dur, type) {
  ensureAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
}
function shootSound() { playSound(520, 0.12, 'triangle'); }
function popSound() { playSound(880, 0.1, 'sine'); setTimeout(() => playSound(1100, 0.15, 'sine'), 60); }
function bounceSound() { playSound(300, 0.06, 'square'); }
function levelCompleteSound() {
  playSound(523, 0.15, 'sine');
  setTimeout(() => playSound(659, 0.15, 'sine'), 150);
  setTimeout(() => playSound(784, 0.15, 'sine'), 300);
  setTimeout(() => playSound(1047, 0.3, 'sine'), 450);
}
function magicSound() {
  playSound(440, 0.1, 'sine');
  setTimeout(() => playSound(660, 0.1, 'sine'), 80);
  setTimeout(() => playSound(880, 0.15, 'sine'), 160);
}
function fireworkSound() {
  playSound(800, 0.08, 'square');
  setTimeout(() => playSound(1200, 0.1, 'square'), 50);
  setTimeout(() => playSound(1600, 0.12, 'square'), 100);
}
function brewSound() {
  playSound(220, 0.2, 'sine');
  setTimeout(() => playSound(330, 0.15, 'triangle'), 100);
  setTimeout(() => playSound(440, 0.2, 'sine'), 200);
  setTimeout(() => playSound(660, 0.25, 'sine'), 350);
  setTimeout(() => playSound(880, 0.3, 'sine'), 500);
}

// ── PERSISTENCE ──────────────────────────────────────────
function saveProgress() {
  try { localStorage.setItem('bubblePopSafari', JSON.stringify(progress)); } catch (e) {}
}
function loadProgress() {
  try {
    const d = localStorage.getItem('bubblePopSafari');
    if (d) {
      const saved = JSON.parse(d);
      progress = { ...progress, ...saved };
      progress.level3Unlocked = true;
    }
  } catch (e) {}
}

// ── RESIZE ───────────────────────────────────────────────
function resize() {
  dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  shooterX = W / 2;
  shooterY = H - SHOOTER_Y_OFFSET;
  bubbleRadius = Math.min(W, H) * 0.038;
  if (bubbleRadius < 16) bubbleRadius = 16;
  if (bubbleRadius > 36) bubbleRadius = 36;

  // Level 2 bucket position
  l2.bucketX = W / 2;
  l2.bucketY = H * 0.82;
}
window.addEventListener('resize', () => {
  resize();
  if (gameState === 'playing') {
    if (LEVEL_CONFIG[currentLevel].type === 'shooter') resetLevel1();
    else initLevel2();
  }
});

// ── LOAD BACKGROUND ──────────────────────────────────────
let homeImage = null;
let homeLoaded = false;

function loadBackground() {
  bgImage = new Image();
  bgImage.onload = () => { backgroundLoaded = true; };
  bgImage.onerror = () => { backgroundLoaded = false; };
  bgImage.src = 'background.png';

  homeImage = new Image();
  homeImage.onload = () => { homeLoaded = true; };
  homeImage.onerror = () => { homeLoaded = false; };
  homeImage.src = 'homepage.png';
}

// ══════════════════════════════════════════════════════════
// MENU / LEVEL SELECT
// ══════════════════════════════════════════════════════════
let menuBubbles = [];
let menuTime = 0;

function initMenu() {
  gameState = 'menu';
  menuBubbles = [];
  for (let i = 0; i < 15; i++) {
    menuBubbles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 15 + Math.random() * 25,
      color: BUBBLE_COLORS[i % BUBBLE_COLORS.length],
      vy: -(0.3 + Math.random() * 0.5),
      vx: (Math.random() - 0.5) * 0.3,
      num: Math.floor(Math.random() * 10)
    });
  }
}

function updateMenu() {
  menuTime += 16;
  for (const b of menuBubbles) {
    b.y += b.vy;
    b.x += b.vx;
    if (b.y < -50) { b.y = H + 50; b.x = Math.random() * W; }
  }
}

function drawMenu() {
  drawHomeBackground();

  // Floating bubbles
  for (const b of menuBubbles) {
    ctx.globalAlpha = 0.4;
    drawBubble(b.x, b.y, b.r, b.color, String(b.num), '#fff');
  }
  ctx.globalAlpha = 1;

  // Dark overlay
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(0, 0, W, H);

  // Title
  const titleY = H * 0.22;
  ctx.fillStyle = '#FECA57';
  ctx.font = `bold ${Math.min(W * 0.08, 48)}px ${FONT_TITLE}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  ctx.fillText('Bubble Pop Safari', W / 2, titleY);
  ctx.shadowBlur = 0;

  // Play button
  const btnW = 200, btnH = 55;
  const btnX = W / 2 - btnW / 2, btnY = H * 0.52;
  const pulse = 1 + 0.03 * Math.sin(menuTime / 300);

  ctx.save();
  ctx.translate(W / 2, btnY + btnH / 2);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = '#FF6B6B';
  ctx.beginPath();
  ctx.roundRect(-btnW / 2, -btnH / 2, btnW, btnH, 27);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = "bold 24px 'Fredoka', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PLAY', 0, 0);
  ctx.restore();

  // Store button bounds
  window._menuBtn = { x: btnX, y: btnY, w: btnW, h: btnH };
}

function drawLevelSelect() {
  drawHomeBackground();
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.fillStyle = '#FECA57';
  ctx.font = `bold ${Math.min(W * 0.06, 36)}px ${FONT_TITLE}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 8;
  ctx.fillText('SELECT LEVEL', W / 2, H * 0.18);
  ctx.shadowBlur = 0;

  const cardW = Math.min(W * 0.7, 340);
  const cardH = 100;
  const gap = 24;
  const startY = H * 0.3;

  // Level 1 card
  const y1 = startY;
  drawLevelCard(W / 2 - cardW / 2, y1, cardW, cardH,
    'Level 1', 'Bubble Shooter', progress.level1Done, true);
  window._lvl1Btn = { x: W / 2 - cardW / 2, y: y1, w: cardW, h: cardH };

  // Level 2 card
  const y2 = y1 + cardH + gap;
  const unlocked = progress.level1Done || progress.level2Unlocked;
  drawLevelCard(W / 2 - cardW / 2, y2, cardW, cardH,
    'Level 2', 'Magic Bucket Words', progress.level2Done, unlocked);
  window._lvl2Btn = { x: W / 2 - cardW / 2, y: y2, w: cardW, h: cardH };

  // Level 3 card
  const y3 = y2 + cardH + gap;
  const unlocked3 = progress.level2Done || progress.level3Unlocked;
  drawLevelCard(W / 2 - cardW / 2, y3, cardW, cardH,
    'Level 3', "Wizard's Cauldron", progress.level3Done, unlocked3);
  window._lvl3Btn = { x: W / 2 - cardW / 2, y: y3, w: cardW, h: cardH };

  // Back button
  const backBtnW = 140, backBtnH = 40;
  const backBtnX = W / 2 - backBtnW / 2;
  const backBtnY = y3 + cardH + 40;
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath();
  ctx.roundRect(backBtnX, backBtnY, backBtnW, backBtnH, 20);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = "bold 16px 'Fredoka', sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText('Back', W / 2, backBtnY + backBtnH / 2);
  window._backBtn = { x: backBtnX, y: backBtnY, w: backBtnW, h: backBtnH };
}

function drawLevelCard(x, y, w, h, title, subtitle, completed, unlocked) {
  ctx.save();

  // Card background
  if (!unlocked) {
    ctx.fillStyle = 'rgba(60,60,60,0.7)';
  } else if (completed) {
    ctx.fillStyle = 'rgba(30,100,50,0.85)';
  } else {
    ctx.fillStyle = 'rgba(40,80,120,0.85)';
  }
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 16);
  ctx.fill();

  // Border
  ctx.strokeStyle = completed ? '#4CAF50' : unlocked ? '#FECA57' : '#666';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Icon
  const iconX = x + 45;
  const iconY = y + h / 2;
  if (!unlocked) {
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔒', iconX, iconY);
  } else if (completed) {
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✅', iconX, iconY);
  } else {
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', iconX, iconY);
  }

  // Title
  ctx.fillStyle = '#fff';
  ctx.font = "bold 20px 'Fredoka', sans-serif";
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(title, x + 80, y + 18);

  // Subtitle
  ctx.fillStyle = unlocked ? '#ccc' : '#888';
  ctx.font = "14px 'Fredoka', sans-serif";
  if (!unlocked) {
    ctx.fillText('Complete Level 1 to Unlock', x + 80, y + 48);
  } else {
    ctx.fillText(subtitle, x + 80, y + 48);
  }

  if (completed) {
    ctx.fillStyle = '#4CAF57';
    ctx.font = "bold 13px 'Fredoka', sans-serif";
    ctx.fillText('Completed!', x + 80, y + 72);
  }

  ctx.restore();
}

// ══════════════════════════════════════════════════════════
// LEVEL 1 — BUBBLE SHOOTER
// ══════════════════════════════════════════════════════════
function resetLevel1() {
  bubbles = [];
  popAnimations = [];
  collectedLetters = [];
  score = 0;
  bullet = null;
  bulletTrail = [];
  impactBursts = [];
  shooterBubble = null;
  nextBubble = null;

  const config = LEVEL_CONFIG[0];
  const r = bubbleRadius;
  const spacingX = r * 2.5;
  const spacingY = spacingX * 0.87;
  const topY = H * 0.22;

  for (let row = 0; row < config.rows.length; row++) {
    const count = config.rows[row];
    const offset = (row % 2 === 1) ? spacingX / 2 : 0;
    const rowWidth = (count - 1) * spacingX;
    const startX = (W - rowWidth) / 2;
    for (let col = 0; col < count; col++) {
      const bx = startX + offset + col * spacingX;
      const by = topY + row * spacingY;
      const num = Math.floor(Math.random() * 10);
      bubbles.push({
        x: bx, y: by, number: num,
        color: BUBBLE_COLORS[num % BUBBLE_COLORS.length],
        popped: false, popping: false, popStart: 0,
        falling: false, vy: 0, radius: bubbleRadius
      });
    }
  }
  spawnShooterBubble();
  spawnNextBubble();
}

function liveBubbles() { return bubbles.filter(b => !b.popped && !b.falling && !b.popping); }

function makeBubble(x, y, palette) {
  const num = Math.floor(Math.random() * 10);
  return { x, y, number: num, color: palette[num % palette.length], popped: false, popping: false, popStart: 0, falling: false, vy: 0, radius: bubbleRadius };
}

function spawnShooterBubble() {
  if (nextBubble) { shooterBubble = nextBubble; shooterBubble.radius = bubbleRadius; spawnNextBubble(); }
  else { shooterBubble = makeBubble(0, 0, SHOOTER_COLORS); spawnNextBubble(); }
}
function spawnNextBubble() { nextBubble = makeBubble(0, 0, SHOOTER_COLORS); }

function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

function findNearestSlot(bx, by) {
  let bestDist = Infinity, bestX = bx, bestY = by, found = false;
  const r = bubbleRadius, spacingX = r * 2.5, spacingY = spacingX * 0.87;
  const hexN = [
    { dx: spacingX, dy: 0 }, { dx: -spacingX, dy: 0 },
    { dx: spacingX / 2, dy: spacingY }, { dx: -spacingX / 2, dy: spacingY },
    { dx: spacingX / 2, dy: -spacingY }, { dx: -spacingX / 2, dy: -spacingY }
  ];
  const live = liveBubbles();
  for (const b of live) {
    for (const n of hexN) {
      const nx = b.x + n.dx, ny = b.y + n.dy;
      if (nx < r || nx > W - r || ny < r * 2) continue;
      let overlap = false;
      for (const ob of live) { if (dist({ x: nx, y: ny }, ob) < r * 2.0) { overlap = true; break; } }
      if (overlap) continue;
      const d = dist({ x: nx, y: ny }, { x: bx, y: by });
      if (d < bestDist) { bestDist = d; bestX = nx; bestY = ny; found = true; }
    }
  }
  if (!found && live.length > 0) {
    let closest = live[0], cDist = Infinity;
    for (const b of live) { const d = dist({ x: bx, y: by }, b); if (d < cDist) { cDist = d; closest = b; } }
    for (const n of hexN) {
      const nx = closest.x + n.dx, ny = closest.y + n.dy;
      if (nx < r || nx > W - r || ny < r * 2) continue;
      let overlap = false;
      for (const ob of live) { if (dist({ x: nx, y: ny }, ob) < r * 2.0) { overlap = true; break; } }
      if (!overlap) { bestX = nx; bestY = ny; break; }
    }
  }
  return { x: bestX, y: bestY };
}

function stickBullet() {
  if (!bullet) return;
  impactBursts.push({ x: bullet.x, y: bullet.y, start: performance.now(), color: bullet.color });
  bounceSound();
  const slot = findNearestSlot(bullet.x, bullet.y);
  bubbles.push({ x: slot.x, y: slot.y, number: bullet.number, color: bullet.color, popped: false, popping: false, popStart: 0, falling: false, vy: 0, radius: bubbleRadius });
  bullet = null; bulletTrail = [];
  checkMatches1(bubbles[bubbles.length - 1]);
  cleanupBubbles();
  if (!shooterBubble) spawnShooterBubble();
}

function checkMatches1(nb) {
  const matched = [], visited = new Set(), live = liveBubbles();
  function flood(b) {
    const id = bubbles.indexOf(b);
    if (visited.has(id) || b.popped || b.popping || b.falling || b.number !== nb.number) return;
    visited.add(id); matched.push(b);
    for (const o of live) { if (o !== b && dist(b, o) <= bubbleRadius * 2.55) flood(o); }
  }
  flood(nb);
  if (matched.length >= 2) {
    for (const b of matched) {
      b.popping = true; b.popStart = performance.now(); popSound(); score += 10;
      const letter = getCurrentMap()[b.number] || '?';
      popAnimations.push({ x: b.x, y: b.y, letter, color: b.color, start: performance.now() });
      collectedLetters.push({ letter, time: performance.now() });
    }
  }
}

function detectDisconnected() {
  const live = liveBubbles();
  if (live.length === 0) return;
  const topY = H * 0.22, spacingY = bubbleRadius * 2.5 * 0.87;
  const connected = new Set(), queue = [];
  for (const b of live) { if (b.y < topY + spacingY * 1.2) { connected.add(bubbles.indexOf(b)); queue.push(b); } }
  while (queue.length > 0) { const c = queue.shift(); for (const o of live) { const id = bubbles.indexOf(o); if (!connected.has(id) && dist(c, o) < bubbleRadius * 2.55) { connected.add(id); queue.push(o); } } }
  for (const b of live) { if (!connected.has(bubbles.indexOf(b))) { b.falling = true; b.vy = 0; score += 5; } }
}

function cleanupBubbles() {
  bubbles = bubbles.filter(b => !(b.popped || (b.falling && b.y > H + 100)));
  const seen = new Set();
  bubbles = bubbles.filter(b => {
    if (b.popped || b.falling) return true;
    const key = `${Math.round(b.x)}_${Math.round(b.y)}`;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
}

function shoot() {
  if (bullet || !shooterBubble) return;
  shootSound();
  const speed = Math.min(W, H) * 0.012;
  bullet = { x: shooterX, y: shooterY, vx: Math.cos(aimAngle) * speed, vy: Math.sin(aimAngle) * speed, number: shooterBubble.number, color: shooterBubble.color, radius: bubbleRadius };
  bulletTrail = []; shooterBubble = null;
}

function getPointerPos(e) { const t = e.touches ? e.touches[0] : e; return { x: t.clientX, y: t.clientY }; }

function updateAimAngle(p) {
  const dx = p.x - shooterX, dy = p.y - shooterY;
  let a = Math.atan2(dy, dx);
  if (a > -0.15) a = -0.15; if (a < -Math.PI + 0.15) a = -Math.PI + 0.15;
  aimAngle = a;
}

function updateLevel1() {
  const now = performance.now();
  collectedLetters = collectedLetters.filter(l => now - l.time < LETTER_DISPLAY_TIME);
  for (const b of bubbles) { if (b.popping && now - b.popStart > POP_ANIMATION_DURATION) b.popped = true; }
  const justPopped = bubbles.some(b => b.popping && (now - b.popStart > POP_ANIMATION_DURATION * 0.5));
  if (justPopped) detectDisconnected();
  for (const b of bubbles) { if (b.falling) { b.vy = Math.min(b.vy + GRAVITY, FALL_SPEED_CAP); b.y += b.vy; b.x += (Math.random() - 0.5) * 0.5; } }
  popAnimations = popAnimations.filter(p => now - p.start < POP_ANIMATION_DURATION);
  impactBursts = impactBursts.filter(b => now - b.start < 400);
  bulletTrail = bulletTrail.filter(t => now - t.time < 200);
  cleanupBubbles();
  const liveCount = liveBubbles().length;
  if (liveCount === 0 && !bubbles.some(b => b.popping || b.falling) && !bullet && !popAnimations.length) {
    gameState = 'levelComplete';
    levelTransitionTime = now;
    totalScore += score;
    progress.level1Done = true;
    saveProgress();
    levelCompleteSound();
  }
  if (bullet) {
    bulletTrail.push({ x: bullet.x, y: bullet.y, time: now });
    if (bulletTrail.length > 15) bulletTrail.shift();
    bullet.x += bullet.vx; bullet.y += bullet.vy;
    if (bullet.x - bullet.radius < 0) { bullet.x = bullet.radius; bullet.vx *= -1; bounceSound(); }
    if (bullet.x + bullet.radius > W) { bullet.x = W - bullet.radius; bullet.vx *= -1; bounceSound(); }
    if (bullet.y - bullet.radius < 0) { bullet.y = bullet.radius; stickBullet(); }
    if (bullet) { for (const b of liveBubbles()) { if (dist(bullet, b) < bullet.radius + b.radius - 2) { stickBullet(); break; } } }
    if (bullet && (bullet.y > H + 100 || bullet.y < -200)) { bullet = null; if (!shooterBubble) spawnShooterBubble(); }
  }
}

// ══════════════════════════════════════════════════════════
// LEVEL 2 — MAGIC BUCKET WORDS
// ══════════════════════════════════════════════════════════
function initLevel2() {
  l2.wordIndex = 0;
  l2.score = 0;
  l2.wordsCompleted = 0;
  l2.fireworks = [];
  l2.sparkleParticles = [];
  l2.cauldronSmoke = [];
  l2.cauldronMagic = [];
  l2.cauldronBubbles = [];
  l2.risingLetters = [];
  l2.totalWords = getCurrentWords().length;
  startNextWord();
}

function startNextWord() {
  if (l2.wordIndex >= getCurrentWords().length) {
    gameState = 'wordsComplete';
    if (currentLevel === 1) { progress.level2Done = true; progress.level3Unlocked = true; }
    else if (currentLevel === 2) { progress.level3Done = true; }
    saveProgress();
    levelCompleteSound();
    return;
  }
  l2.word = getCurrentWords()[l2.wordIndex].trim().toUpperCase();
  l2.letters = l2.word.split('');
  l2.phase = 'reveal';
  l2.phaseTime = performance.now();
  l2.letterIndex = 0;
  l2.convertedLetters = [];
  l2.showWordTime = 0;
  l2.wordDisplayAlpha = 0;
  l2.revealAlpha = 0;
  l2.bucketGlow = 0;
  l2.numberBalloons = [];
  l2.feedbackAlpha = 0;
  l2.feedbackText = '';
  l2.feedbackColor = '#fff';
  l2.correctBalloon = null;
  l2.flyToBucket = null;

  const ltr2num = getCurrentLetterToNumber();
  const mappedLetters = l2.letters.filter(ch => ltr2num[ch] !== undefined);

  const playTop = H * 0.22;
  const playBot = l2.bucketY - 80;

  l2._balloonData = [];
  for (let i = 0; i < mappedLetters.length; i++) {
    const ch = mappedLetters[i];
    const num = ltr2num[ch];
    const r = 30;
    l2._balloonData.push({
      letter: ch, number: num,
      color: BUBBLE_COLORS[num % BUBBLE_COLORS.length],
      x: r + 40 + Math.random() * (W - 2 * r - 80),
      y: playTop + r + Math.random() * (playBot - playTop - 2 * r),
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: r, alpha: 0, tapped: false,
      wiggle: Math.random() * Math.PI * 2
    });
  }
  const curMap = getCurrentMap();
  const allNums = Object.keys(curMap).map(Number);
  const neededNums = new Set(mappedLetters.map(ch => ltr2num[ch]));
  const decoys = allNums.filter(n => !neededNums.has(n));
  const numDecoys = Math.min(4, decoys.length);
  for (let i = 0; i < numDecoys; i++) {
    const num = decoys[i];
    const r = 30;
    l2._balloonData.push({
      letter: '?', number: num,
      color: BUBBLE_COLORS[num % BUBBLE_COLORS.length],
      x: r + 40 + Math.random() * (W - 2 * r - 80),
      y: playTop + r + Math.random() * (playBot - playTop - 2 * r),
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: r, alpha: 0, tapped: false,
      wiggle: Math.random() * Math.PI * 2, decoy: true
    });
  }
}

function updateLevel2() {
  const now = performance.now();

  // Reveal phase — show the word, then spawn balloons
  if (l2.phase === 'reveal') {
    l2.revealAlpha = Math.min(1, (now - l2.phaseTime) / 400);
    if (now - l2.phaseTime > 2000) {
      l2.phase = 'playing';
      l2.phaseTime = now;
      l2.numberBalloons = l2._balloonData;
      for (const b of l2.numberBalloons) b.alpha = 1;
    }
  }

  // Float balloons gently
  if (l2.phase === 'playing') {
    const playTop = H * 0.22;
    const playBot = l2.bucketY - 80;
    for (const b of l2.numberBalloons) {
      if (b.tapped) continue;
      b.wiggle += 0.03;
      b.x += b.vx + Math.sin(b.wiggle) * 0.3;
      b.y += b.vy + Math.cos(b.wiggle * 0.7) * 0.2;
      // Bounce off edges
      if (b.x - b.radius < 10) { b.x = b.radius + 10; b.vx = Math.abs(b.vx); }
      if (b.x + b.radius > W - 10) { b.x = W - b.radius - 10; b.vx = -Math.abs(b.vx); }
      if (b.y - b.radius < playTop) { b.y = b.radius + playTop; b.vy = Math.abs(b.vy); }
      if (b.y + b.radius > playBot) { b.y = playBot - b.radius; b.vy = -Math.abs(b.vy); }
    }
  }

  // Fly correct balloon to cauldron/bucket
  if (l2.flyToBucket) {
    const fb = l2.flyToBucket;
    const targetY = l2.bucketY - (currentLevel === 2 ? 40 : 20);
    const dx = l2.bucketX - fb.x;
    const dy = targetY - fb.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 10) {
      l2.flyToBucket = null;
      l2.bucketGlow = 1;
      magicSound();

      if (currentLevel === 2) {
        // Level 3 — start brewing
        l2.phase = 'brewing';
        l2.phaseTime = now;
        l2.brewTimer = 0;
        l2._brewLetter = fb.letter;
        brewSound();
        // Initial cauldron smoke burst
        for (let i = 0; i < 20; i++) {
          l2.cauldronSmoke.push({
            x: l2.bucketX + (Math.random() - 0.5) * 60,
            y: l2.bucketY - 30,
            vx: (Math.random() - 0.5) * 3,
            vy: -(2 + Math.random() * 5),
            life: 1,
            size: 8 + Math.random() * 15,
            color: `hsl(${Math.random() * 60 + 220}, 80%, 60%)`
          });
        }
        // Magic sparkles
        for (let i = 0; i < 25; i++) {
          l2.cauldronMagic.push({
            x: l2.bucketX + (Math.random() - 0.5) * 80,
            y: l2.bucketY - 20 + (Math.random() - 0.5) * 40,
            vx: (Math.random() - 0.5) * 6,
            vy: -(1 + Math.random() * 6),
            life: 1,
            size: 2 + Math.random() * 4,
            color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
            type: Math.random() < 0.5 ? 'star' : 'sparkle'
          });
        }
        // Cauldron bubbles
        for (let i = 0; i < 8; i++) {
          l2.cauldronBubbles.push({
            x: l2.bucketX + (Math.random() - 0.5) * 50,
            y: l2.bucketY - 10,
            vy: -(1 + Math.random() * 3),
            life: 1,
            size: 3 + Math.random() * 8,
            color: `hsl(${Math.random() * 360}, 70%, 70%)`
          });
        }
      } else {
        // Level 2 — direct letter conversion
        l2.convertedLetters.push(fb.letter);
        l2.letterIndex++;
        for (let i = 0; i < 15; i++) {
          l2.sparkleParticles.push({
            x: l2.bucketX + (Math.random() - 0.5) * 80,
            y: l2.bucketY - 20 + (Math.random() - 0.5) * 40,
            vx: (Math.random() - 0.5) * 5,
            vy: -(2 + Math.random() * 4),
            life: 1,
            color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)]
          });
        }
        if (l2.letterIndex >= l2.letters.length) {
          l2.phase = 'showWord';
          l2.phaseTime = now;
          l2.showWordTime = now;
        }
      }
    } else {
      fb.x += (dx / d) * 12;
      fb.y += (dy / d) * 12;
    }
  }

  // Level 3 — brewing animation
  if (currentLevel === 2 && l2.phase === 'brewing') {
    l2.brewTimer++;
    // Continuous smoke
    if (l2.brewTimer % 3 === 0) {
      l2.cauldronSmoke.push({
        x: l2.bucketX + (Math.random() - 0.5) * 40,
        y: l2.bucketY - 35,
        vx: (Math.random() - 0.5) * 2,
        vy: -(1.5 + Math.random() * 3),
        life: 1,
        size: 6 + Math.random() * 12,
        color: `hsl(${220 + Math.random() * 60}, 80%, 60%)`
      });
    }
    // Continuous magic sparkles
    if (l2.brewTimer % 2 === 0) {
      l2.cauldronMagic.push({
        x: l2.bucketX + (Math.random() - 0.5) * 70,
        y: l2.bucketY - 25 + (Math.random() - 0.3) * 30,
        vx: (Math.random() - 0.5) * 4,
        vy: -(1 + Math.random() * 5),
        life: 1,
        size: 2 + Math.random() * 4,
        color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
        type: Math.random() < 0.5 ? 'star' : 'sparkle'
      });
    }
    // Continuous cauldron bubbles
    if (l2.brewTimer % 5 === 0) {
      l2.cauldronBubbles.push({
        x: l2.bucketX + (Math.random() - 0.5) * 40,
        y: l2.bucketY - 5,
        vy: -(1 + Math.random() * 2.5),
        life: 1,
        size: 2 + Math.random() * 6,
        color: `hsl(${Math.random() * 360}, 70%, 70%)`
      });
    }
    // After brew, rising letters emerge
    if (l2.brewTimer > 60) {
      l2.convertedLetters.push(l2._brewLetter);
      l2.letterIndex++;
      l2.risingLetters.push({
        letter: l2._brewLetter,
        x: l2.bucketX + (Math.random() - 0.5) * 30,
        y: l2.bucketY - 30,
        vy: -(2 + Math.random() * 2),
        alpha: 1,
        size: 28 + Math.random() * 10,
        color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)]
      });
      // Big sparkle burst
      for (let i = 0; i < 20; i++) {
        l2.sparkleParticles.push({
          x: l2.bucketX + (Math.random() - 0.5) * 80,
          y: l2.bucketY - 40 + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 7,
          vy: -(2 + Math.random() * 5),
          life: 1,
          color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)]
        });
      }
      if (l2.letterIndex >= l2.letters.length) {
        l2.phase = 'showWord';
        l2.phaseTime = now;
        l2.showWordTime = now;
      } else {
        l2.phase = 'playing';
      }
    }
  }

  l2.bucketGlow = Math.max(0, l2.bucketGlow - 0.03);

  // Show the completed word
  if (l2.phase === 'showWord') {
    l2.wordDisplayAlpha = Math.min(1, (now - l2.phaseTime) / 400);
    if (now - l2.phaseTime > 2200) {
      l2.wordIndex++;
      l2.wordsCompleted++;
      l2.score += 20;
      startNextWord();
    }
  }

  // Feedback fade
  l2.feedbackAlpha = Math.max(0, l2.feedbackAlpha - 0.02);

  // Sparkle particles
  l2.sparkleParticles = l2.sparkleParticles.filter(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life -= 0.02;
    return p.life > 0;
  });

  // Cauldron smoke
  l2.cauldronSmoke = l2.cauldronSmoke.filter(p => {
    p.x += p.vx; p.y += p.vy; p.life -= 0.015; p.size += 0.3;
    return p.life > 0;
  });

  // Cauldron magic particles
  l2.cauldronMagic = l2.cauldronMagic.filter(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.life -= 0.018;
    return p.life > 0;
  });

  // Cauldron bubbles
  l2.cauldronBubbles = l2.cauldronBubbles.filter(p => {
    p.x += Math.sin(p.y * 0.05) * 0.3; p.y += p.vy; p.life -= 0.02;
    return p.life > 0;
  });

  // Rising letters (Level 3)
  l2.risingLetters = l2.risingLetters.filter(p => {
    p.y += p.vy; p.vy *= 0.98; p.alpha -= 0.008;
    return p.alpha > 0;
  });

  l2.fireworks = l2.fireworks.filter(f => {
    f.age += 0.02;
    return f.age < 1;
  });
}

function drawLevel2() {
  drawBackground();

  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0, 0, W, H);

  // Title bar
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath(); ctx.roundRect(W / 2 - 140, 8, 280, 38, 19); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = "bold 18px 'Fredoka', sans-serif";
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const titleText = currentLevel === 1 ? 'Level 2 — Magic Bucket' : 'Level 3 — Wizard\'s Cauldron';
  ctx.fillText(titleText, W / 2, 27);

  // Progress bar
  const progY = 52, progW = W * 0.6, progH = 18;
  const progX = W / 2 - progW / 2;
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath(); ctx.roundRect(progX, progY, progW, progH, 9); ctx.fill();
  const fill = Math.min(1, l2.wordsCompleted / l2.totalWords);
  ctx.fillStyle = '#4CAF50';
  ctx.beginPath(); ctx.roundRect(progX, progY, progW * fill, progH, 9); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = "bold 11px 'Fredoka', sans-serif";
  ctx.fillText(`${l2.wordsCompleted} / ${l2.totalWords}`, W / 2, progY + progH / 2);

  // Score
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.beginPath(); ctx.roundRect(12, 12, 110, 32, 16); ctx.fill();
  ctx.fillStyle = '#FECA57';
  ctx.font = "bold 16px 'Fredoka', sans-serif";
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('⭐ ' + l2.score, 26, 28);

  // Word queue — top-left corner showing upcoming words
  const wqX = 10, wqY = 55, wqW = 130, wqH = 10;
  const visibleCount = Math.min(6, getCurrentWords().length - l2.wordIndex);
  const wqBoxH = 22 + visibleCount * wqH + 10;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.beginPath(); ctx.roundRect(wqX, wqY, wqW, wqBoxH, 10); ctx.fill();
  ctx.fillStyle = '#FECA57';
  ctx.font = "bold 10px 'Fredoka', sans-serif";
  ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText('Words', wqX + 8, wqY + 5);
  for (let i = 0; i < visibleCount; i++) {
    const wi = l2.wordIndex + i;
    const wText = getCurrentWords()[wi];
    if (i === 0) {
      ctx.fillStyle = '#4CAF50';
      ctx.font = "bold 11px 'Fredoka', sans-serif";
      ctx.fillText('▶ ' + wText, wqX + 8, wqY + 18 + i * wqH);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = "10px 'Fredoka', sans-serif";
      ctx.fillText('  ' + wText, wqX + 8, wqY + 18 + i * wqH);
    }
  }

  // Letter slots at bottom (what we've built so far)
  const slotY = l2.bucketY + 90;
  const slotSize = 38;
  const totalSlotW = l2.letters.length * slotSize;
  const slotStartX = W / 2 - totalSlotW / 2;
  for (let i = 0; i < l2.letters.length; i++) {
    const sx = slotStartX + i * slotSize + slotSize / 2;
    const isFilled = i < l2.convertedLetters.length;
    const isNext = i === l2.letterIndex && !isFilled;

    // Slot background
    ctx.fillStyle = isFilled ? 'rgba(254,202,87,0.9)' : isNext ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.roundRect(sx - 16, slotY - 16, 32, 32, 8); ctx.fill();

    if (isNext) {
      ctx.strokeStyle = '#FECA57';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.fillStyle = isFilled ? '#333' : isNext ? '#FECA57' : 'rgba(255,255,255,0.4)';
  ctx.font = `bold 20px ${FONT_LEVEL_CARD}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(isFilled ? l2.convertedLetters[i] : (isNext ? '?' : '_'), sx, slotY + 1);
  }

  // Hint: "Tap the number for: ?"
  if (l2.phase === 'playing' && l2.letterIndex < l2.letters.length) {
    const nextLetter = l2.letters[l2.letterIndex];
    const nextNum = getCurrentLetterToNumber()[nextLetter];
    if (nextNum !== undefined) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath(); ctx.roundRect(W / 2 - 110, slotY + 28, 220, 28, 14); ctx.fill();
      ctx.fillStyle = '#FECA57';
      ctx.font = "bold 14px 'Fredoka', sans-serif";
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(currentLevel === 2 ? `Tap the number ${nextNum}!` : `Tap the number ${nextNum} bubble!`, W / 2, slotY + 42);
    }
  }

  // Magic Bucket or Wizard's Cauldron
  if (currentLevel === 2) {
    drawCauldron();
  } else {
    drawMagicBucket();
  }

  // Number balloons
  for (const b of l2.numberBalloons) {
    if (b.tapped && b !== l2.flyToBucket) continue;
    ctx.globalAlpha = b.alpha;
    drawBubble(b.x, b.y, b.radius, b.color, String(b.number), '#fff');
    ctx.globalAlpha = 1;
  }

  // Sparkle particles
  for (const p of l2.sparkleParticles) {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Feedback text (correct/wrong)
  if (l2.feedbackAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = l2.feedbackAlpha;
    ctx.fillStyle = l2.feedbackColor;
    ctx.font = "bold 28px 'Fredoka', sans-serif";
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(l2.feedbackText, W / 2, H * 0.42);
    ctx.restore();
  }

  // Full word display
  if (l2.phase === 'showWord') {
    ctx.save();
    ctx.globalAlpha = l2.wordDisplayAlpha;
    const cardW = Math.max(200, l2.word.length * 42 + 40);
    const cardH = 70;
    const cardX = W / 2 - cardW / 2;
    const cardY = H * 0.35;
    ctx.fillStyle = 'rgba(20,60,20,0.9)';
    ctx.beginPath(); ctx.roundRect(cardX, cardY, cardW, cardH, 16); ctx.fill();
    ctx.strokeStyle = '#FECA57'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#FECA57';
    ctx.font = `bold ${Math.min(36, W * 0.06)}px 'Fredoka', sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(l2.word, W / 2, cardY + cardH / 2);
    ctx.restore();
  }

  // Reveal phase — show the target word big at top
  if (l2.phase === 'reveal') {
    ctx.save();
    ctx.globalAlpha = l2.revealAlpha;
    const cardW = Math.max(200, l2.word.length * 48 + 50);
    const cardH = 80;
    const cardX = W / 2 - cardW / 2;
    const cardY = H * 0.15;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.beginPath(); ctx.roundRect(cardX, cardY, cardW, cardH, 16); ctx.fill();
    ctx.strokeStyle = '#FECA57'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#FECA57';
    ctx.font = `bold ${Math.min(42, W * 0.08)}px 'Fredoka', sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(l2.word, W / 2, cardY + cardH / 2 - 5);
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.min(16, W * 0.03)}px 'Fredoka', sans-serif`;
    ctx.fillText(currentLevel === 2 ? 'Tap the numbers to brew!' : 'Spell this word!', W / 2, cardY + cardH + 20);
    ctx.restore();
  }
}

function handleLevel2Tap(pos) {
  if (l2.phase !== 'playing' || l2.flyToBucket) return;
  if (l2.letterIndex >= l2.letters.length) return;

  const nextLetter = l2.letters[l2.letterIndex];
  const nextNum = getCurrentLetterToNumber()[nextLetter];

  for (const b of l2.numberBalloons) {
    if (b.tapped) continue;
    const dx = pos.x - b.x;
    const dy = pos.y - b.y;
    if (Math.sqrt(dx * dx + dy * dy) < b.radius + 10) {
      b.tapped = true;
      if (!b.decoy && b.number === nextNum) {
        // Correct!
        l2.feedbackText = '✨ Correct!';
        l2.feedbackColor = '#4CAF50';
        l2.feedbackAlpha = 1;
        l2.flyToBucket = b;
        popSound();
      } else {
        // Wrong
        l2.feedbackText = 'Try again!';
        l2.feedbackColor = '#FF6B6B';
        l2.feedbackAlpha = 1;
        // Bounce back after a delay
        setTimeout(() => { b.tapped = false; }, 400);
        bounceSound();
      }
      return;
    }
  }
}

function drawMagicBucket() {
  const bx = l2.bucketX, by = l2.bucketY;
  const bw = 100, bh = 70;

  ctx.save();

  // Glow effect
  if (l2.bucketGlow > 0) {
    ctx.shadowColor = '#FECA57';
    ctx.shadowBlur = 30 * l2.bucketGlow;
  }

  // Bucket body
  const grad = ctx.createLinearGradient(bx - bw / 2, by, bx + bw / 2, by + bh);
  grad.addColorStop(0, '#8B5E3C');
  grad.addColorStop(0.5, '#6B4226');
  grad.addColorStop(1, '#4A2E18');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(bx - bw / 2, by);
  ctx.lineTo(bx - bw / 2 + 10, by + bh);
  ctx.lineTo(bx + bw / 2 - 10, by + bh);
  ctx.lineTo(bx + bw / 2, by);
  ctx.closePath();
  ctx.fill();

  // Bucket rim
  ctx.fillStyle = '#A0724A';
  ctx.beginPath();
  ctx.ellipse(bx, by, bw / 2 + 5, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4A2E18';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Bucket highlight
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bx - bw / 4, by + 10);
  ctx.lineTo(bx - bw / 4 + 5, by + bh - 10);
  ctx.stroke();

  // Magic stars on bucket
  ctx.fillStyle = '#FECA57';
  ctx.font = "14px sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText('✨', bx - 15, by + 35);
  ctx.fillText('⭐', bx + 15, by + 45);

  ctx.shadowBlur = 0;
  ctx.restore();

  // Label
  ctx.fillStyle = '#FECA57';
  ctx.font = "bold 12px 'Fredoka', sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText('Magic Bucket', bx, by + bh + 18);
}

function drawCauldron() {
  const bx = l2.bucketX, by = l2.bucketY;
  const bw = 110, bh = 80;

  // Draw cauldron smoke (behind cauldron)
  for (const p of l2.cauldronSmoke) {
    ctx.save();
    ctx.globalAlpha = p.life * 0.5;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Draw cauldron bubbles
  for (const p of l2.cauldronBubbles) {
    ctx.save();
    ctx.globalAlpha = p.life * 0.7;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(255,255,255,${p.life * 0.3})`;
    ctx.fill();
    ctx.restore();
  }

  ctx.save();

  // Glow effect
  if (l2.bucketGlow > 0) {
    ctx.shadowColor = '#A855F7';
    ctx.shadowBlur = 40 * l2.bucketGlow;
  }

  // Cauldron body (dark iron pot shape)
  const bodyGrad = ctx.createLinearGradient(bx - bw / 2, by - 10, bx + bw / 2, by + bh);
  bodyGrad.addColorStop(0, '#2D2D3D');
  bodyGrad.addColorStop(0.3, '#1A1A2E');
  bodyGrad.addColorStop(0.7, '#16213E');
  bodyGrad.addColorStop(1, '#0F0F1A');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(bx, by + bh * 0.3, bw / 2, bh * 0.55, 0, 0, Math.PI);
  ctx.lineTo(bx - bw / 2, by - bh * 0.15);
  ctx.quadraticCurveTo(bx, by - bh * 0.25, bx + bw / 2, by - bh * 0.15);
  ctx.closePath();
  ctx.fill();

  // Cauldron rim (thick top ring)
  const rimGrad = ctx.createLinearGradient(bx - bw / 2 - 5, by - bh * 0.15, bx + bw / 2 + 5, by - bh * 0.05);
  rimGrad.addColorStop(0, '#4A4A5A');
  rimGrad.addColorStop(0.5, '#3D3D4D');
  rimGrad.addColorStop(1, '#2D2D3D');
  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.ellipse(bx, by - bh * 0.12, bw / 2 + 8, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5A5A6A';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Cauldron liquid (glowing purple/green potion)
  const liquidGrad = ctx.createRadialGradient(bx, by - bh * 0.05, 5, bx, by - bh * 0.05, bw / 2 - 5);
  const brewPulse = 0.6 + 0.4 * Math.sin(performance.now() / 300);
  liquidGrad.addColorStop(0, `rgba(168, 85, 247, ${brewPulse})`);
  liquidGrad.addColorStop(0.5, `rgba(139, 92, 246, ${brewPulse * 0.8})`);
  liquidGrad.addColorStop(1, `rgba(88, 28, 135, ${brewPulse * 0.6})`);
  ctx.fillStyle = liquidGrad;
  ctx.beginPath();
  ctx.ellipse(bx, by - bh * 0.05, bw / 2 - 6, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Liquid surface shimmer
  ctx.strokeStyle = `rgba(196, 181, 253, ${brewPulse * 0.5})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = -3; i <= 3; i++) {
    const sx = bx + i * 12;
    const sy = by - bh * 0.05 + Math.sin((performance.now() / 200) + i) * 2;
    ctx.moveTo(sx - 6, sy);
    ctx.quadraticCurveTo(sx, sy - 3, sx + 6, sy);
  }
  ctx.stroke();

  // Handles (left and right)
  ctx.strokeStyle = '#4A4A5A';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  // Left handle
  ctx.beginPath();
  ctx.arc(bx - bw / 2 - 10, by + 10, 12, -Math.PI * 0.3, Math.PI * 0.8);
  ctx.stroke();
  // Right handle
  ctx.beginPath();
  ctx.arc(bx + bw / 2 + 10, by + 10, 12, Math.PI * 0.2, Math.PI * 1.3);
  ctx.stroke();

  // Cauldron feet
  ctx.fillStyle = '#3D3D4D';
  ctx.beginPath();
  ctx.ellipse(bx - bw / 3, by + bh * 0.75, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(bx + bw / 3, by + bh * 0.75, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(bx, by + bh * 0.82, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Magical runes on cauldron
  ctx.fillStyle = `rgba(168, 85, 247, ${brewPulse * 0.6})`;
  ctx.font = "12px sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText('✧', bx - 20, by + 20);
  ctx.fillText('☽', bx + 5, by + 35);
  ctx.fillText('✧', bx + 22, by + 18);

  ctx.shadowBlur = 0;
  ctx.restore();

  // Draw magic sparkles (in front of cauldron)
  for (const p of l2.cauldronMagic) {
    ctx.save();
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    if (p.type === 'star') {
      drawStar(p.x, p.y, p.size, p.size * 0.4, 5);
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Rising letters (Level 3 only)
  for (const p of l2.risingLetters) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.font = `bold ${Math.round(p.size)}px ${FONT_WORDS}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 8;
    ctx.fillText(p.letter, p.x, p.y);
    ctx.restore();
  }

  // Label
  ctx.fillStyle = '#C4B5FD';
  ctx.font = `bold 13px ${FONT_BUTTON}`;
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 4;
  ctx.fillText('Wizard\'s Cauldron', bx, by + bh + 20);
  ctx.shadowBlur = 0;
}

function drawStar(cx, cy, outerR, innerR, points) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

// ══════════════════════════════════════════════════════════
// DRAWING HELPERS
// ══════════════════════════════════════════════════════════
function drawBackground() {
  if (backgroundLoaded && bgImage) {
    const imgRatio = bgImage.width / bgImage.height;
    const canvasRatio = W / H;
    let dw, dh, dx, dy;
    if (canvasRatio > imgRatio) { dw = W; dh = W / imgRatio; } else { dh = H; dw = H * imgRatio; }
    dx = (W - dw) / 2; dy = (H - dh) / 2;
    ctx.drawImage(bgImage, dx, dy, dw, dh);
  } else {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#87CEEB'); grad.addColorStop(0.5, '#98FB98'); grad.addColorStop(1, '#90EE90');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  }
}

function drawHomeBackground() {
  if (homeLoaded && homeImage) {
    const imgRatio = homeImage.width / homeImage.height;
    const canvasRatio = W / H;
    let dw, dh, dx, dy;
    if (canvasRatio > imgRatio) { dw = W; dh = W / imgRatio; } else { dh = H; dw = H * imgRatio; }
    dx = (W - dw) / 2; dy = (H - dh) / 2;
    ctx.drawImage(homeImage, dx, dy, dw, dh);
  } else {
    drawBackground();
  }
}

function drawBubbleShape(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.closePath(); }

function drawBubble(x, y, r, color, text, textColor) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4;
  drawBubbleShape(x, y, r); ctx.fillStyle = color; ctx.fill(); ctx.shadowColor = 'transparent';
  const ig = ctx.createRadialGradient(x - r * 0.25, y - r * 0.3, r * 0.05, x, y, r);
  ig.addColorStop(0, 'rgba(255,255,255,0.4)'); ig.addColorStop(0.5, 'rgba(255,255,255,0.08)'); ig.addColorStop(1, 'rgba(0,0,0,0.12)');
  drawBubbleShape(x, y, r); ctx.fillStyle = ig; ctx.fill();
  ctx.beginPath(); ctx.ellipse(x - r * 0.2, y - r * 0.28, r * 0.35, r * 0.2, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = darkenColor(color, 0.25); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = textColor || '#fff';
  ctx.font = `bold ${Math.round(r * (text.length > 1 ? 0.85 : 1.15))}px ${FONT_BALLOON}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 3; ctx.lineJoin = 'round';
  ctx.strokeText(text, x, y + 1);
  ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 2;
  ctx.fillText(text, x, y + 1);
  ctx.restore();
}

function darkenColor(hex, amount) {
  let r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, Math.floor(r * (1 - amount))); g = Math.max(0, Math.floor(g * (1 - amount))); b = Math.max(0, Math.floor(b * (1 - amount)));
  return `rgb(${r},${g},${b})`;
}

// ── Level 1 specific draws ──
function drawAimLine() {
  if (!isAiming || bullet || gameState !== 'playing' || LEVEL_CONFIG[currentLevel].type !== 'shooter') return;
  const speed = 8; const pts = [];
  let ttx = shooterX, tty = shooterY, tvx = Math.cos(aimAngle), tvy = Math.sin(aimAngle);
  let lx = ttx, ly = tty; pts.push({ x: ttx, y: tty });
  for (let i = 0; i < 40; i++) { ttx += tvx * speed; tty += tvy * speed; if (ttx < 0) { ttx = -ttx; tvx *= -1; } if (ttx > W) { ttx = 2 * W - ttx; tvx *= -1; } if (tty < 0) break; pts.push({ x: ttx, y: tty }); lx = ttx; ly = tty; }
  ctx.save(); ctx.setLineDash([4, 10]);
  ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
  ctx.setLineDash([]);
  const target = findNearestTarget(lx, ly);
  drawCrosshair(target ? target.x : lx, target ? target.y : ly, target ? target.radius : bubbleRadius);
  const as = 10; ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath();
  ctx.moveTo(lx, ly); ctx.lineTo(lx - as * Math.cos(aimAngle - 0.4), ly - as * Math.sin(aimAngle - 0.4));
  ctx.lineTo(lx - as * Math.cos(aimAngle + 0.4), ly - as * Math.sin(aimAngle + 0.4)); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function findNearestTarget(x, y) { let c = null, cd = Infinity; for (const b of liveBubbles()) { const d = dist({ x, y }, b); if (d < b.radius * 2.5 && d < cd) { cd = d; c = b; } } return c; }

function drawCrosshair(cx, cy, r) {
  ctx.save(); const al = r * 1.4, g = r * 0.5, lw = 3;
  const pulse = 0.85 + 0.15 * Math.sin((performance.now() % 1200) / 1200 * Math.PI * 2);
  ctx.beginPath(); ctx.arc(cx, cy, r * 1.2 * pulse, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 6; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, r * 1.2 * pulse, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3; ctx.stroke();
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = lw + 3;
  ctx.beginPath(); ctx.moveTo(cx, cy - g); ctx.lineTo(cx, cy - al); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy + g); ctx.lineTo(cx, cy + al); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - g, cy); ctx.lineTo(cx - al, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + g, cy); ctx.lineTo(cx + al, cy); ctx.stroke();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = lw;
  ctx.beginPath(); ctx.moveTo(cx, cy - g); ctx.lineTo(cx, cy - al); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy + g); ctx.lineTo(cx, cy + al); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - g, cy); ctx.lineTo(cx - al, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + g, cy); ctx.lineTo(cx + al, cy); ctx.stroke();
  const ds = 4; ctx.fillStyle = '#FF8E53'; ctx.fillRect(cx - ds, cy - ds, ds * 2, ds * 2);
  ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1; ctx.strokeRect(cx - ds, cy - ds, ds * 2, ds * 2);
  ctx.restore();
}

function drawShooter() {
  ctx.save();
  const pw = 90, ph = 26, py = shooterY + 20;
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(shooterX, py + ph + 4, pw * 0.55, 6, 0, 0, Math.PI * 2); ctx.fill();
  const pg = ctx.createLinearGradient(shooterX - pw / 2, py, shooterX + pw / 2, py + ph);
  pg.addColorStop(0, '#A0724A'); pg.addColorStop(0.4, '#8B5E3C'); pg.addColorStop(1, '#6B4226');
  ctx.fillStyle = pg; ctx.beginPath(); ctx.roundRect(shooterX - pw / 2, py, pw, ph, 10); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(shooterX - pw / 2 + 10, py + 3); ctx.lineTo(shooterX + pw / 2 - 10, py + 3); ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(shooterX - pw / 2, py, pw, ph, 10); ctx.stroke();
  ctx.save(); ctx.translate(shooterX, shooterY); ctx.rotate(aimAngle);
  const bg = ctx.createLinearGradient(-10, -38, 10, 0);
  bg.addColorStop(0, '#7A5C3A'); bg.addColorStop(0.5, '#5C4033'); bg.addColorStop(1, '#4A3228');
  ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(-10, -38, 20, 38, 5); ctx.fill();
  ctx.fillStyle = '#8B6B4A'; ctx.beginPath(); ctx.roundRect(-12, -42, 24, 8, 3); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-6, -34); ctx.lineTo(-6, -8); ctx.stroke();
  ctx.restore();
  if (shooterBubble) drawBubble(shooterX, shooterY, shooterBubble.radius, shooterBubble.color, String(shooterBubble.number), '#fff');
  ctx.restore();
}

function drawNextBubblePreview() {
  if (!nextBubble || gameState !== 'playing' || LEVEL_CONFIG[currentLevel].type !== 'shooter') return;
  ctx.save();
  ctx.globalAlpha = 0.65;
  drawBubble(shooterX + 55, shooterY - 25, bubbleRadius * 0.55, nextBubble.color, String(nextBubble.number), '#fff');
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.font = "bold 9px 'Fredoka', sans-serif"; ctx.textAlign = 'center';
  ctx.fillText('NEXT', shooterX + 55, shooterY - 25 + bubbleRadius * 0.55 + 12);
  ctx.restore();
}

function drawPopAnimations() {
  const now = performance.now();
  for (const p of popAnimations) {
    const elapsed = now - p.start, progress = elapsed / POP_ANIMATION_DURATION;
    if (progress >= 1) continue;
    ctx.save(); ctx.globalAlpha = 1 - progress;
    ctx.font = `bold ${Math.round(bubbleRadius * 1.4 * (1 + progress * 0.8))}px 'Fredoka', sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = p.color;
    ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 8;
    ctx.fillText(p.letter, p.x, p.y - progress * 40);
    for (let i = 0; i < 6; i++) { const a = (Math.PI * 2 / 6) * i + progress * 2; const pr = bubbleRadius * (1 + progress * 1.5); ctx.beginPath(); ctx.arc(p.x + Math.cos(a) * pr, p.y - progress * 40 + Math.sin(a) * pr, 3 * (1 - progress), 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); }
    ctx.restore();
  }
}

function drawBulletTrail() {
  if (bulletTrail.length < 2) return; const now = performance.now(); ctx.save();
  for (const t of bulletTrail) { const age = now - t.time, alpha = Math.max(0, 1 - age / 200); ctx.globalAlpha = alpha * 0.5; ctx.fillStyle = bullet ? bullet.color : '#fff'; ctx.beginPath(); ctx.arc(t.x, t.y, bubbleRadius * 0.6 * alpha, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

function drawImpactBursts() {
  const now = performance.now(); ctx.save();
  for (const b of impactBursts) { const el = now - b.start, p = el / 400; if (p >= 1) continue; const alpha = 1 - p, r = bubbleRadius * (1 + p * 2); ctx.globalAlpha = alpha * 0.6; ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI * 2); ctx.strokeStyle = b.color || '#fff'; ctx.lineWidth = 3 * (1 - p); ctx.stroke(); for (let i = 0; i < 8; i++) { const a = (Math.PI * 2 / 8) * i + p * 3; const pr = bubbleRadius * (0.5 + p * 2); ctx.globalAlpha = alpha * 0.8; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(b.x + Math.cos(a) * pr, b.y + Math.sin(a) * pr, 2.5 * (1 - p), 0, Math.PI * 2); ctx.fill(); } }
  ctx.restore();
}

function drawCollectedLetters() {
  if (collectedLetters.length === 0) return; ctx.save(); const now = performance.now();
  const visible = collectedLetters.filter(l => now - l.time < LETTER_DISPLAY_TIME);
  if (visible.length === 0) { ctx.restore(); return; }
  const spacing = 34, totalW = visible.length * spacing, tx = W / 2 - totalW / 2, ty = 95;
  ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.roundRect(tx - 10, ty - 16, totalW + 20, 32, 10); ctx.fill();
  for (let i = 0; i < visible.length; i++) { const l = visible[i]; const el = now - l.time; const alpha = el < 200 ? el / 200 : el > LETTER_DISPLAY_TIME - 200 ? (LETTER_DISPLAY_TIME - el) / 200 : 1; const lx = tx + i * spacing + spacing / 2; ctx.globalAlpha = alpha; ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.arc(lx, ty, 13, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#FECA57'; ctx.font = "bold 20px 'Fredoka', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(l.letter, lx, ty + 1); }
  ctx.restore();
}

function drawLegend() {
  ctx.save(); const bw = 110, lh = 16, px = 10, pt = 22, pb = 8;
  const entries = Object.entries(getCurrentMap()); const bh = pt + entries.length * lh + pb;
  const bx = W - bw - 10, by = 10;
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 10); ctx.fill();
  ctx.fillStyle = '#FECA57'; ctx.font = "bold 10px 'Fredoka', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('Number → Letter', bx + bw / 2, by + 5);
  ctx.font = "bold 11px 'Fredoka', sans-serif"; ctx.textAlign = 'left';
  for (let i = 0; i < entries.length; i++) {
    const [n, l] = entries[i];
    ctx.fillStyle = '#fff';
    const display = `${n} = ${l}`;
    ctx.fillText(display, bx + px, by + pt + i * lh);
  }
  ctx.restore();
}

function drawMobileHint() {
  if (!isAiming && !bullet && shooterBubble && gameState === 'playing' && LEVEL_CONFIG[currentLevel].type === 'shooter') {
    ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.roundRect(W / 2 - 130, shooterY - 60, 260, 28, 14); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = "13px 'Fredoka', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Drag to aim, release to shoot!', W / 2, shooterY - 46); ctx.restore();
  }
}

// ── BACK BUTTON (shown during gameplay on all levels) ──
function drawPlayBackButton() {
  const bx = 14, by = 14, bw = 44, bh = 44, br = 22;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.arc(bx + br, by + br, br, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = "bold 22px 'Fredoka', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('\u2190', bx + br, by + br + 1);
  ctx.restore();
  window._playBackBtn = { x: bx, y: by, w: bw, h: bh };
}

// ══════════════════════════════════════════════════════════
// LEVEL COMPLETE / WORDS COMPLETE SCREENS
// ══════════════════════════════════════════════════════════
function drawLevelComplete() {
  if (gameState !== 'levelComplete') return;
  const now = performance.now(), elapsed = now - levelTransitionTime, p = Math.min(elapsed / 400, 1);
  ctx.save(); ctx.globalAlpha = p * 0.7; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = p;
  const cw = 320, ch = 260, cx = W / 2 - cw / 2, cy = H / 2 - ch / 2;
  ctx.fillStyle = 'rgba(20,60,20,0.95)'; ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, 20); ctx.fill();
  ctx.strokeStyle = '#FECA57'; ctx.lineWidth = 3; ctx.stroke();
  const sy = cy + 50;
  ctx.fillStyle = '#FECA57'; ctx.font = "bold 48px 'Fredoka', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('⭐', W / 2, sy);
  ctx.font = "bold 26px 'Fredoka', sans-serif"; ctx.fillText('Level Complete!', W / 2, sy + 50);
  ctx.fillStyle = '#fff'; ctx.font = "bold 18px 'Fredoka', sans-serif"; ctx.fillText('Score: ' + (totalScore + score), W / 2, sy + 90);
  ctx.fillStyle = '#aaa'; ctx.font = "15px 'Fredoka', sans-serif";
  ctx.fillText('Level 2 Unlocked!', W / 2, sy + 120);
  // Play Level 2 button
  const bw = 180, bh = 44, bx = W / 2 - bw / 2, by = sy + 145;
  ctx.fillStyle = '#4CAF50'; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 22); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = "bold 16px 'Fredoka', sans-serif"; ctx.fillText('Play Level 2', W / 2, by + bh / 2);
  window._playLvl2Btn = { x: bx, y: by, w: bw, h: bh };
  ctx.restore();
}

function drawWordsComplete() {
  if (gameState !== 'wordsComplete') return;
  drawBackground();

  // Fireworks
  const now = performance.now();
  if (Math.random() < 0.06) {
    l2.fireworks.push({ x: W * 0.2 + Math.random() * W * 0.6, y: H * 0.1 + Math.random() * H * 0.3, age: 0, color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)] });
    fireworkSound();
  }

  for (const f of l2.fireworks) {
    ctx.save(); ctx.globalAlpha = 1 - f.age;
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * 2 / 12) * i, r = 30 + f.age * 80;
      ctx.fillStyle = f.color;
      ctx.beginPath(); ctx.arc(f.x + Math.cos(a) * r, f.y + Math.sin(a) * r, 3 * (1 - f.age), 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, W, H);
  const cw = 360, ch = 340, cx = W / 2 - cw / 2, cy = H / 2 - ch / 2;
  ctx.fillStyle = 'rgba(20,60,20,0.95)'; ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, 20); ctx.fill();
  ctx.strokeStyle = '#FECA57'; ctx.lineWidth = 3; ctx.stroke();
  const sy = cy + 40;
  const lvlName = currentLevel === 1 ? 'Level 2' : 'Level 3';
  ctx.fillStyle = '#FECA57'; ctx.font = "bold 42px 'Fredoka', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('🎉', W / 2, sy);
  ctx.font = "bold 28px 'Fredoka', sans-serif"; ctx.fillText(lvlName + ' Complete!', W / 2, sy + 45);
  ctx.fillStyle = '#fff'; ctx.font = "bold 20px 'Fredoka', sans-serif";
  ctx.fillText('All ' + l2.totalWords + ' Words Spelled!', W / 2, sy + 85);
  ctx.fillStyle = '#FECA57'; ctx.font = "bold 22px 'Fredoka', sans-serif";
  ctx.fillText('Score: ' + (totalScore + l2.score), W / 2, sy + 120);
  // Stars
  const stars = 3;
  for (let i = 0; i < stars; i++) { ctx.font = "bold 30px sans-serif"; ctx.fillText('⭐', W / 2 - 40 + i * 40, sy + 160); }
  // Buttons
  const bw = 180, bh = 40;
  ctx.fillStyle = '#FF6B6B'; ctx.beginPath(); ctx.roundRect(W / 2 - bw / 2, sy + 195, bw, bh, 20); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = "bold 16px 'Fredoka', sans-serif"; ctx.fillText('Menu', W / 2, sy + 195 + bh / 2);
  window._menuBtn2 = { x: W / 2 - bw / 2, y: sy + 195, w: bw, h: bh };
  ctx.restore();
}

// ══════════════════════════════════════════════════════════
// INPUT
// ══════════════════════════════════════════════════════════
let pointerDown = false;

function onPointerDown(e) {
  e.preventDefault(); ensureAudio();
  const pos = getPointerPos(e);

  if (gameState === 'menu') {
    const btn = window._menuBtn;
    if (btn && pos.x >= btn.x && pos.x <= btn.x + btn.w && pos.y >= btn.y && pos.y <= btn.y + btn.h) {
      gameState = 'levelSelect';
    }
    return;
  }

  if (gameState === 'levelSelect') {
    // Level 1
    const l1 = window._lvl1Btn;
    if (l1 && pos.x >= l1.x && pos.x <= l1.x + l1.w && pos.y >= l1.y && pos.y <= l1.y + l1.h) {
      currentLevel = 0; gameState = 'playing'; score = 0; totalScore = 0; resetLevel1(); return;
    }
    // Level 2
    const l2b = window._lvl2Btn;
    if (l2b && pos.x >= l2b.x && pos.x <= l2b.x + l2b.w && pos.y >= l2b.y && pos.y <= l2b.y + l2b.h) {
      if (progress.level1Done || progress.level2Unlocked) {
        currentLevel = 1; gameState = 'playing'; score = 0; totalScore = 0; initLevel2(); return;
      }
    }
    // Level 3
    const l3 = window._lvl3Btn;
    if (l3 && pos.x >= l3.x && pos.x <= l3.x + l3.w && pos.y >= l3.y && pos.y <= l3.y + l3.h) {
      if (progress.level2Done || progress.level3Unlocked) {
        currentLevel = 2; gameState = 'playing'; score = 0; totalScore = 0; initLevel2(); return;
      }
    }
    // Back
    const bk = window._backBtn;
    if (bk && pos.x >= bk.x && pos.x <= bk.x + bk.w && pos.y >= bk.y && pos.y <= bk.y + bk.h) {
      gameState = 'menu'; return;
    }
    return;
  }

  if (gameState === 'levelComplete') {
    const btn = window._playLvl2Btn;
    if (btn && pos.x >= btn.x && pos.x <= btn.x + btn.w && pos.y >= btn.y && pos.y <= btn.y + btn.h) {
      currentLevel = 1; gameState = 'playing'; score = 0; initLevel2(); return;
    }
    // Also click anywhere to go to level select
    if (!btn || !(pos.x >= btn.x && pos.x <= btn.x + btn.w && pos.y >= btn.y && pos.y <= btn.y + btn.h)) {
      gameState = 'levelSelect'; return;
    }
    return;
  }

  if (gameState === 'wordsComplete') {
    const btn = window._menuBtn2;
    if (btn && pos.x >= btn.x && pos.x <= btn.x + btn.w && pos.y >= btn.y && pos.y <= btn.y + btn.h) {
      gameState = 'levelSelect'; return;
    }
    return;
  }

  if (gameState === 'playing') {
    // Check back button first (shared across all levels)
    const pb = window._playBackBtn;
    if (pb && pos.x >= pb.x && pos.x <= pb.x + pb.w && pos.y >= pb.y && pos.y <= pb.y + pb.h) {
      gameState = 'levelSelect'; return;
    }

    if (LEVEL_CONFIG[currentLevel].type === 'shooter') {
      pointerDown = true; isAiming = true; updateAimAngle(pos);
    } else {
      handleLevel2Tap(pos);
    }
    return;
  }
}

function onPointerMove(e) {
  e.preventDefault();
  if (!pointerDown) return;
  updateAimAngle(getPointerPos(e));
}

function onPointerUp(e) {
  e.preventDefault();
  if (!pointerDown) return;
  pointerDown = false; isAiming = false;
  if (gameState === 'playing' && LEVEL_CONFIG[currentLevel].type === 'shooter') shoot();
}

canvas.addEventListener('mousedown', onPointerDown);
canvas.addEventListener('mousemove', onPointerMove);
canvas.addEventListener('mouseup', onPointerUp);
canvas.addEventListener('touchstart', onPointerDown, { passive: false });
canvas.addEventListener('touchmove', onPointerMove, { passive: false });
canvas.addEventListener('touchend', onPointerUp, { passive: false });

// ══════════════════════════════════════════════════════════
// MAIN LOOP
// ══════════════════════════════════════════════════════════
function gameLoop() {
  ctx.clearRect(0, 0, W, H);

  if (gameState === 'menu') {
    updateMenu(); drawMenu();
  } else if (gameState === 'levelSelect') {
    drawLevelSelect();
  } else if (gameState === 'playing') {
    if (LEVEL_CONFIG[currentLevel].type === 'shooter') {
      updateLevel1();
      drawBackground(); drawAimLine();
      for (const b of bubbles) {
        if (b.popping) { const el = performance.now() - b.popStart, p = Math.min(el / POP_ANIMATION_DURATION, 1); ctx.save(); ctx.globalAlpha = 1 - p; drawBubble(b.x, b.y, bubbleRadius * (1 + p * 0.3), b.color, getCurrentMap()[b.number] || '?', '#fff'); ctx.restore(); }
        else if (b.falling) { const fs = H * 0.5, alpha = b.y > fs ? Math.max(0, 1 - (b.y - fs) / (H * 0.5)) : 1; ctx.save(); ctx.globalAlpha = alpha; drawBubble(b.x, b.y, b.radius, b.color, String(b.number), '#fff'); ctx.restore(); }
        else { drawBubble(b.x, b.y, b.radius, b.color, String(b.number), '#fff'); }
      }
      if (bullet) drawBubble(bullet.x, bullet.y, bullet.radius, bullet.color, String(bullet.number), '#fff');
      drawBulletTrail(); drawImpactBursts(); drawPopAnimations();
      drawShooter(); drawNextBubblePreview();
      drawCollectedLetters(); drawLegend(); drawMobileHint(); drawPlayBackButton();
      // Level badge
      ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.roundRect(W / 2 - 55, 50, 110, 24, 12); ctx.fill();
      ctx.fillStyle = '#ddd'; ctx.font = "bold 12px 'Fredoka', sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Level 1  •  ' + liveBubbles().length + ' left', W / 2, 62); ctx.restore();
      drawLevelComplete();
    } else {
      updateLevel2(); drawLevel2(); drawLegend(); drawPlayBackButton();
    }
  } else if (gameState === 'levelComplete') {
    if (LEVEL_CONFIG[currentLevel].type === 'shooter') {
      drawBackground();
      for (const b of bubbles) drawBubble(b.x, b.y, b.radius, b.color, String(b.number), '#fff');
      drawShooter(); drawLevelComplete();
    }
  } else if (gameState === 'wordsComplete') {
    drawWordsComplete();
  }

  requestAnimationFrame(gameLoop);
}

// ── INIT ─────────────────────────────────────────────────
function init() {
  resize(); loadBackground(); loadProgress(); initMenu(); gameLoop();
}

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (typeof r === 'number') r = [r, r, r, r];
    this.moveTo(x + r[0], y); this.lineTo(x + w - r[1], y); this.quadraticCurveTo(x + w, y, x + w, y + r[1]);
    this.lineTo(x + w, y + h - r[2]); this.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
    this.lineTo(x + r[3], y + h); this.quadraticCurveTo(x, y + h, x, y + h - r[3]);
    this.lineTo(x, y + r[0]); this.quadraticCurveTo(x, y, x + r[0], y); this.closePath();
  };
}

init();
