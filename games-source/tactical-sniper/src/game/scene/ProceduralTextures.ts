import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────
//  HIGH-FIDELITY PROCEDURAL TEXTURE GENERATORS (Zero-Asset WebGL)
// ─────────────────────────────────────────────────────────────────

const textureCache = new Map<string, THREE.CanvasTexture>();

/** Generates wet weathered concrete rooftop texture with dark puddles & asphalt grain */
export function getWetConcreteTexture(): THREE.CanvasTexture {
  const key = 'wet_concrete';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Base dark concrete
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 512, 512);

    // Asphalt noise grain
    for (let i = 0; i < 20000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const gray = Math.floor(20 + Math.random() * 35);
      ctx.fillStyle = `rgba(${gray}, ${gray + 4}, ${gray + 8}, 0.25)`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Wet puddle patches with dark glossy sheen
    for (let p = 0; p < 8; p++) {
      const px = Math.random() * 400 + 50;
      const py = Math.random() * 400 + 50;
      const pr = Math.random() * 60 + 30;
      const grad = ctx.createRadialGradient(px, py, 5, px, py, pr);
      grad.addColorStop(0, 'rgba(10, 15, 26, 0.7)');
      grad.addColorStop(0.7, 'rgba(15, 23, 42, 0.4)');
      grad.addColorStop(1, 'rgba(30, 41, 59, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Concrete grid seams
    ctx.strokeStyle = 'rgba(10, 14, 22, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 512);
    ctx.moveTo(0, 256);
    ctx.lineTo(512, 256);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  textureCache.set(key, texture);
  return texture;
}

/** Generates brushed galvanized metal texture for AC ducts & chiller boxes */
export function getGalvanizedMetalTexture(): THREE.CanvasTexture {
  const key = 'galvanized_metal';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 0, 256, 256);

    // Brushed metal streaks
    for (let i = 0; i < 4000; i++) {
      const y = Math.random() * 256;
      const len = Math.random() * 60 + 20;
      const x = Math.random() * 256;
      const tone = Math.floor(70 + Math.random() * 60);
      ctx.fillStyle = `rgba(${tone}, ${tone + 4}, ${tone + 10}, 0.15)`;
      ctx.fillRect(x, y, len, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  textureCache.set(key, texture);
  return texture;
}

/** Generates illuminated skyscraper window facade */
export function getSkyscraperWindowTexture(tint: string): THREE.CanvasTexture {
  const key = `skyscraper_windows_${tint}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 256, 512);

    const rows = 28;
    const cols = 12;
    const w = 12;
    const h = 10;
    const padX = 8;
    const padY = 8;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isLit = Math.random() > 0.42;
        if (isLit) {
          const brightness = Math.random() * 0.4 + 0.6;
          ctx.fillStyle = tint;
          ctx.globalAlpha = brightness;
          ctx.fillRect(c * (w + padX) + 10, r * (h + padY) + 12, w, h);
        }
      }
    }
    ctx.globalAlpha = 1.0;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set(key, texture);
  return texture;
}

/** Generates bold crisp "POLICE" tactical back patch texture */
export function getPolicePatchTexture(): THREE.CanvasTexture {
  const key = 'police_patch';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Dark ballistic fabric background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, 256, 96);

    // Stitched Border
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 88);

    // Bold Crisp "POLICE" Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px "Orbitron", sans-serif, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 6;
    ctx.fillText('POLICE', 128, 48);
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}
