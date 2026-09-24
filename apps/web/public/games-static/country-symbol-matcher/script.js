// ============ DATA ============
let data = [];
let countryFlag = {};
let symbolIcon = {};
// ============ STATE ============
let score = 0;
let lives = 3;
let selectedTiles = [];
let locked = false;
let totalTiles = 0;
let matchedCount = 0;
let soundOn = true;

let cols = 10;
let rows = 8;
let grid = [];

// ============ DOM ============
const scoreEl = document.getElementById('scoreVal');
const livesEl = document.getElementById('livesVal');
const board = document.getElementById('board');
const boardOuter = document.getElementById('boardOuter');
const connectorLayer = document.getElementById('connectorLayer');
const overlay = document.getElementById('overlay');
const modalEmoji = document.getElementById('modalEmoji');
const modalTitle = document.getElementById('modalTitle');
const modalSub = document.getElementById('modalSub');
const finalScoreEl = document.getElementById('finalScore');
const muteBtn = document.getElementById('muteBtn');
const rulesBtn = document.getElementById('rulesBtn');
const rulesOverlay = document.getElementById('rulesOverlay');
const gotItBtn = document.getElementById('gotItBtn');

// ============ SOUND ============
let audioCtx = null;
function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, start, duration, type = 'sine', peakVol = 0.22) {
  if (!soundOn) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  gain.gain.setValueAtTime(0, ctx.currentTime + start);
  gain.gain.linearRampToValueAtTime(peakVol, ctx.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.05);
}

function playMatchSound() { tone(660, 0, 0.14, 'triangle'); tone(880, 0.1, 0.18, 'triangle'); }
function playClearSound() { tone(1046, 0, 0.12, 'sine', 0.15); }
function playWrongSound() { tone(180, 0, 0.25, 'sawtooth', 0.18); tone(120, 0.12, 0.25, 'sawtooth', 0.15); }
function playWinSound() { [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.14, 0.3, 'triangle', 0.2)); }

muteBtn.addEventListener('click', () => {
  soundOn = !soundOn;
  muteBtn.textContent = soundOn ? '🔊' : '🔇';
});

rulesBtn.addEventListener('click', () => {
  rulesOverlay.classList.add('show');
});

gotItBtn.addEventListener('click', () => {
  rulesOverlay.classList.remove('show');
});

// ============ BUILD & SHUFFLE ============
function buildTiles(entries) {
  const tiles = [];
  entries.forEach((e) => {
    tiles.push({ type: 'country', text: e.country, symbol: e.symbol, icon: countryFlag[e.country] || '🏳️' });
    tiles.push({ type: 'symbol', text: e.symbol, symbol: e.symbol, icon: symbolIcon[e.symbol] || '✨' });
  });
  return tiles;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ============ PATHFINDING (ONET LOGIC) ============
// BFS to find a path with max 2 turns (3 straight segments)
function findPath(r1, c1, r2, c2) {
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const q = [{ r: r1, c: c1, path: [{ r: r1, c: c1 }], dir: -1, turns: 0 }];

  // Track min turns to reach a cell going in a specific direction
  const minTurns = Array(rows + 2).fill(0).map(() => Array(cols + 2).fill(0).map(() => Array(4).fill(Infinity)));

  while (q.length > 0) {
    const { r, c, path, dir, turns } = q.shift();

    if (r === r2 && c === c2) return path;

    for (let d = 0; d < 4; d++) {
      const nr = r + dirs[d][0];
      const nc = c + dirs[d][1];

      // Allow moving through padding layer (0 and max+1) around the board
      if (nr >= 0 && nr < rows + 2 && nc >= 0 && nc < cols + 2) {
        // Must be empty space, unless it's the target tile
        if ((nr !== r2 || nc !== c2) && grid[nr][nc] !== null) continue;

        const nextTurns = (dir !== -1 && dir !== d) ? turns + 1 : turns;
        if (nextTurns <= 2) {
          if (nextTurns < minTurns[nr][nc][d]) {
            minTurns[nr][nc][d] = nextTurns;
            q.push({
              r: nr, c: nc,
              path: [...path, { r: nr, c: nc }],
              dir: d,
              turns: nextTurns
            });
          }
        }
      }
    }
  }
  return null;
}

// Checks if the current board has at least one valid, playable match
function hasAvailableMatch() {
  const tiles = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      if (grid[r][c] !== null) tiles.push(grid[r][c]);
    }
  }

  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      const a = tiles[i];
      const b = tiles[j];
      if (a.symbol === b.symbol && a.type !== b.type) {
        if (findPath(a.r, a.c, b.r, b.c) !== null) return true;
      }
    }
  }
  return false;
}

// Reshuffles all remaining tiles in place until a valid match is possible
function shuffleRemaining() {
  const activeCells = [];
  const tiles = [];

  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      if (grid[r][c] !== null) {
        tiles.push(grid[r][c]);
        activeCells.push({ r, c });
        grid[r][c] = null;
      }
    }
  }

  if (tiles.length === 0) return;

  let valid = false;
  let attempts = 0;
  while (!valid && attempts < 150) {
    shuffle(tiles);
    // Temp place on grid
    for (let i = 0; i < tiles.length; i++) {
      const pos = activeCells[i];
      grid[pos.r][pos.c] = tiles[i];
      tiles[i].r = pos.r;
      tiles[i].c = pos.c;
    }
    if (hasAvailableMatch()) valid = true;
    attempts++;
  }

  // Apply physically to DOM
  const cellEls = board.children;
  for (let i = 0; i < tiles.length; i++) {
    const pos = activeCells[i];
    const cellIdx = (pos.r - 1) * cols + (pos.c - 1);
    cellEls[cellIdx].appendChild(tiles[i].el);
  }
}

// ============ RENDER ============
function renderBoard() {
  score = 0; lives = 3; selectedTiles = []; locked = false; matchedCount = 0;
  scoreEl.textContent = score; livesEl.textContent = lives;
  overlay.classList.remove('show');
  clearConnector();

  cols = 10;
  rows = 8;
  const cellCount = cols * rows; // 80 cells
  const pairsNeeded = 30; // 60 tiles, 20 empty spaces

  const subsetData = shuffle([...data]).slice(0, pairsNeeded);
  const tiles = shuffle(buildTiles(subsetData));
  totalTiles = tiles.length;

  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  board.innerHTML = '';

  grid = Array(rows + 2).fill(null).map(() => Array(cols + 2).fill(null));

  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    board.appendChild(cell);
  }

  const positions = shuffle([...Array(cellCount).keys()]);
  const cellEls = board.children;

  tiles.forEach((tile, idx) => {
    const pos = positions[idx];
    const r = Math.floor(pos / cols) + 1;
    const c = (pos % cols) + 1;

    const tileEl = document.createElement('div');
    tileEl.className = `tile ${tile.type}`;
    tileEl.dataset.type = tile.type;
    tileEl.innerHTML = `<div class="icon">${tile.icon}</div><div class="label">${tile.text}</div>`;

    tile.el = tileEl;
    tile.r = r;
    tile.c = c;
    grid[r][c] = tile;

    tileEl.addEventListener('click', () => onTileClick(tile));
    cellEls[pos].appendChild(tileEl);
  });

  // Guarantee a valid move exists immediately
  if (!hasAvailableMatch()) {
    shuffleRemaining();
  }
}

// ============ INTERACTION ============
function onTileClick(tile) {
  if (locked) return;
  if (tile.el.classList.contains('matched-pop')) return;

  getCtx(); // unlock audio

  // Deselect if clicking the same tile
  if (tile.el.classList.contains('selected')) {
    tile.el.classList.remove('selected');
    selectedTiles = [];
    return;
  }

  // If one tile is already selected and we click the same type, swap the selection
  if (selectedTiles.length === 1 && selectedTiles[0].type === tile.type) {
    selectedTiles[0].el.classList.remove('selected');
    selectedTiles = [tile];
    tile.el.classList.add('selected');
    return;
  }

  tile.el.classList.add('selected');
  selectedTiles.push(tile);

  if (selectedTiles.length === 2) {
    locked = true;
    evaluateSelection();
  }
}

function evaluateSelection() {
  const [a, b] = selectedTiles;
  const isMatch = a.symbol === b.symbol && a.type !== b.type;
  let path = null;

  if (isMatch) {
    path = findPath(a.r, a.c, b.r, b.c);
  }

  if (path !== null) {
    playMatchSound();
    drawConnector(path);
    setTimeout(() => {
      clearConnector();
      playClearSound();

      a.el.classList.remove('selected');
      b.el.classList.remove('selected');
      a.el.classList.add('matched-pop');
      b.el.classList.add('matched-pop');

      // Remove from logical grid so they become empty spaces
      grid[a.r][a.c] = null;
      grid[b.r][b.c] = null;

      score += 100;
      scoreEl.textContent = score;
      matchedCount += 2;
      selectedTiles = [];
      locked = false;

      if (matchedCount >= totalTiles) {
        setTimeout(() => showEnd(true), 400);
      } else {
        // If there are no moves left, reshuffle automatically
        if (!hasAvailableMatch()) {
          setTimeout(() => {
            shuffleRemaining();
          }, 200);
        }
      }
    }, 800);
  } else {
    playWrongSound();
    a.el.classList.add('wrong');
    b.el.classList.add('wrong');
    score -= 10;
    scoreEl.textContent = score;
    lives -= 1;
    livesEl.textContent = Math.max(lives, 0);
    setTimeout(() => {
      a.el.classList.remove('selected', 'wrong');
      b.el.classList.remove('selected', 'wrong');
      selectedTiles = [];
      locked = false;
      if (lives <= 0) showEnd(false);
    }, 550);
  }
}

// ============ PATH CONNECTOR RENDERING ============
function drawConnector(path) {
  const outerRect = boardOuter.getBoundingClientRect();
  const firstCell = board.children[0].getBoundingClientRect();
  const cellW = firstCell.width;
  const cellH = firstCell.height;
  const gap = 7;

  const boardRect = board.getBoundingClientRect();
  const offsetX = boardRect.left - outerRect.left;
  const offsetY = boardRect.top - outerRect.top;

  let dPath = "";
  for (let i = 0; i < path.length; i++) {
    const pt = path[i];
    const cx = offsetX + (pt.c - 1) * (cellW + gap) + cellW / 2;
    const cy = offsetY + (pt.r - 1) * (cellH + gap) + cellH / 2;

    if (i === 0) dPath += `M ${cx} ${cy} `;
    else dPath += `L ${cx} ${cy} `;
  }

  const svgNS = 'http://www.w3.org/2000/svg';
  const svgPath = document.createElementNS(svgNS, 'path');
  svgPath.setAttribute('d', dPath);
  svgPath.setAttribute('class', 'connector-path');

  connectorLayer.innerHTML = '';
  connectorLayer.appendChild(svgPath);

  const length = svgPath.getTotalLength();
  svgPath.style.strokeDasharray = length;
  svgPath.style.strokeDashoffset = length;
  svgPath.getBoundingClientRect(); // force reflow
  svgPath.style.transition = 'stroke-dashoffset 0.3s ease';
  svgPath.style.strokeDashoffset = 0;
}

function clearConnector() {
  connectorLayer.innerHTML = '';
}

// ============ END STATES ============
function showEnd(won) {
  locked = true;
  if (won) {
    modalEmoji.textContent = '🎉';
    modalTitle.textContent = 'Well Done!';
    modalSub.textContent = 'You cleared the board!';
    playWinSound();
    celebrate();
  } else {
    modalEmoji.textContent = '💔';
    modalTitle.textContent = 'Game Over';
    modalSub.textContent = 'Out of chances — better luck next time!';
  }
  finalScoreEl.textContent = score;
  overlay.classList.add('show');
}

document.getElementById('restartBtn').addEventListener('click', renderBoard);
document.getElementById('newGameBtn').addEventListener('click', renderBoard);

// ============ CONFETTI ============
const confettiCanvas = document.getElementById('confettiCanvas');
const myConfetti = confetti.create(confettiCanvas, { resize: true, useWorker: true });
const snowflakeShape = confetti.shapeFromText({ text: '❄️', scalar: 1.5 });

let snowCount = 0;
(function snowFrame() {
  snowCount++;
  if (snowCount % 4 === 0) {
    myConfetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: 800,
      origin: { x: Math.random(), y: (Math.random() * 0.2) - 0.1 },
      colors: ['#ffffff', '#e0f7fa'],
      shapes: [snowflakeShape],
      gravity: 0.35,
      scalar: Math.random() * 0.5 + 0.5,
      drift: Math.random() * 0.6 - 0.3,
      disableForReducedMotion: true,
      flat: true
    });
  }
  requestAnimationFrame(snowFrame);
})();

function celebrate() {
  const duration = 2500;
  const end = Date.now() + duration;
  (function frame() {
    myConfetti({
      particleCount: 6, angle: 60, spread: 65, origin: { x: 0, y: 0.6 },
      colors: ['#f5a623', '#ffd27a', '#7fd9ff', '#ffffff', '#59a06e']
    });
    myConfetti({
      particleCount: 6, angle: 120, spread: 65, origin: { x: 1, y: 0.6 },
      colors: ['#f5a623', '#ffd27a', '#7fd9ff', '#ffffff', '#59a06e']
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  myConfetti({ particleCount: 150, spread: 110, origin: { y: 0.4 } });
}

// ============ INIT ============
Promise.all([
  fetch('./data/data.json').then(r => r.json()),
  fetch('./data/country-flag.json').then(r => r.json()),
  fetch('./data/symbol-icon.json').then(r => r.json())
]).then(([symbolsData, flagData, iconData]) => {
  data = symbolsData;
  countryFlag = flagData;
  symbolIcon = iconData;
  renderBoard();
}).catch(err => {
  console.error("Failed to load game data:", err);
});