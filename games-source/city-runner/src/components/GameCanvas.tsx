import React, { useEffect, useRef } from 'react';
import type { QuizQuestion } from '../types/api';

interface GameCanvasProps {
  question: QuizQuestion | null;
  onAnswer: (isCorrect: boolean) => void;
  gameState: 'playing' | 'paused' | 'gameover' | 'menu';
  removedOptions: string[];
  playSound: (type: 'jump' | 'correct' | 'wrong') => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ question, onAnswer, gameState, removedOptions, playSound }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const removedRef = useRef(removedOptions);

  useEffect(() => {
    removedRef.current = removedOptions;
  }, [removedOptions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const skylineImg = new Image();
    skylineImg.src = './city_skyline.jpg';
    const treeImg = new Image();
    treeImg.src = './tree_sprite.png';
    const stoneWheelImg = new Image();
    stoneWheelImg.src = './stone_wheel.png';

    let animationFrameId: number;

    const gravity = 0.55;
    const jumpPower = -15.5;
    const playerSpeed = 4.5;

    const isMobile = window.innerWidth <= 767;
    const sizeScale = isMobile ? 1.2 : 1;

    let BASE_GROUND = canvas.height * 0.75;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      BASE_GROUND = canvas.height * 0.75;
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial sizing

    const getGroundY = (worldX: number): number => {
      // Big rolling terrain
      const largeHills = Math.sin(worldX * 0.0015) * 50;
      // Medium slopes
      const mediumHills = Math.sin(worldX * 0.004 + 1.2) * 35;
      // Small bumpy details
      const smallBumps = Math.sin(worldX * 0.012 + 0.5) * 12;

      // Unevenness multiplier (makes some areas very hilly and some areas flatter)
      const unevenness = (Math.sin(worldX * 0.0008) + 1.6) * 0.5;

      return BASE_GROUND + (largeHills + mediumHills + smallBumps) * unevenness;
    };

    const getGroundSlope = (worldX: number): number => {
      const dx = 1;
      return Math.atan2(getGroundY(worldX + dx) - getGroundY(worldX), dx);
    };

    const PW = 42 * sizeScale;
    const PH = 88 * sizeScale;

    let player = {
      x: 100,
      y: 0,
      width: PW,
      height: PH,
      vy: 0,
      vx: 0,
      isGrounded: false,
      isEaten: false,
      isWaitingForNext: false,
      fadeAlpha: 1,
      scaleY: 1,
      runFrame: 0,
      isFallingDeath: false,
      slopeAngle: 0,
      hairAngle: Math.PI / 2,
      hairVel: 0,
    };

    player.y = getGroundY(player.x) - player.height;

    let cameraX = 0;
    const keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false };

    let boxes: {
      x: number; y: number; width: number; height: number;
      text: string; isCorrect: boolean; isFading: boolean;
      alpha: number; scale: number; color: string;
      wheelRotation: number;
      optValue: string;
    }[] = [];
    let pits: { x: number; width: number; type?: 'wheel' | 'gap' }[] = [];
    let floatingTexts: { x: number; y: number; text: string; color: string; alpha: number; vy: number }[] = [];
    let treePositions: number[] = [];

    const initLevel = () => {
      player.x = 100;
      player.y = getGroundY(100) - player.height;
      player.vy = 0; player.vx = 0;
      player.isEaten = false; player.isWaitingForNext = false;
      player.isFallingDeath = false;
      player.fadeAlpha = 1; player.scaleY = 1;
      player.runFrame = 0; player.slopeAngle = 0;
      player.hairAngle = Math.PI / 2; player.hairVel = 0;

      boxes = []; pits = []; floatingTexts = []; treePositions = [];
      cameraX = 0;

      if (question) {
        // Each option is ~700px apart (roughly 2/3 of a screen width)
        const startX = 500;
        const gap = 700;
        const colors = ['#c0392b', '#2980b9', '#27ae60', '#f39c12'];
        const letters = ['A', 'B', 'C', 'D'];

        let validIdx = 0;
        question.options.forEach((opt, index) => {
          const boxCX = Math.floor(startX + validIdx * gap); // center X of wheel
          const radius = 52 * sizeScale; // bigger wheel
          const groundY = getGroundY(boxCX);

          // Wheel is half-buried: center sits AT ground level
          // So top of wheel is at groundY - radius (visible above ground)
          // Bottom is underground
          boxes.push({
            x: boxCX - radius,
            y: groundY - radius, // center at ground level
            width: radius * 2,
            height: radius * 2,
            text: letters[index] || '?',
            isCorrect: opt === question.answer,
            isFading: false,
            alpha: 1,
            scale: 1,
            color: colors[index] || '#8b5a2b',
            wheelRotation: 0,
            optValue: opt,
          });

          // Pit under every wheel (the hole it sits in)
          pits.push({ x: boxCX - radius - 10, width: radius * 2 + 20, type: 'wheel' });

          // Extra gap pit between options
          if (validIdx < 3 && Math.random() > 0.4) {
            const midX = boxCX + gap / 2;
            pits.push({ x: midX - 35, width: 70, type: 'gap' });
          }
          validIdx++;
        });

        if (Math.random() > 0.3) {
          pits.push({ x: startX + question.options.length * gap + 50, width: 70, type: 'gap' });
        }
      }

      // Spread trees across the level, but check for collisions
      // Decrease frequency: space them by ~600px instead of 320px
      for (let i = 0; i < 10; i++) {
        const tx = 150 + i * 600 + Math.sin(i * 17.3) * 150;

        // Tree trunk is about 20px wide. Check if it falls inside a pit or near a wheel.
        const treeWidth = 40;
        let overlaps = false;

        for (const pit of pits) {
          // If the tree falls anywhere near the pit
          if (tx + treeWidth > pit.x - 40 && tx - treeWidth < pit.x + pit.width + 40) {
            overlaps = true;
            break;
          }
        }

        if (!overlaps) {
          treePositions.push(tx);
        }
      }
    };

    initLevel();

    let jumpRequested = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.code === 'Space') {
        if (gameState === 'playing' && player.isGrounded && !player.isEaten && !player.isWaitingForNext) {
          jumpRequested = true;
        }
      }
      if (e.key === 'ArrowLeft') keys.ArrowLeft = true;
      if (e.key === 'ArrowRight') keys.ArrowRight = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keys.ArrowLeft = false;
      if (e.key === 'ArrowRight') keys.ArrowRight = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const update = () => {
      if (gameState !== 'playing') return;

      if (jumpRequested) {
        player.vy = jumpPower;
        player.isGrounded = false;
        playSound('jump');
        jumpRequested = false;
      }

      if (!player.isEaten && !player.isWaitingForNext) {
        if (keys.ArrowLeft) { player.vx = -playerSpeed; player.runFrame = (player.runFrame + 1) % 10; }
        else if (keys.ArrowRight) { player.vx = playerSpeed; player.runFrame = (player.runFrame + 1) % 10; }
        else { player.vx = 0; player.runFrame = 0; }

        player.x += player.vx;
        if (player.x < 0) player.x = 0;

        player.vy += gravity;
        player.y += player.vy;

        const playerCenterX = player.x + player.width / 2;
        const overPit = pits.some(pit => playerCenterX > pit.x && playerCenterX < pit.x + pit.width);
        const groundY = getGroundY(playerCenterX);

        if (!overPit && player.y + player.height >= groundY) {
          player.y = groundY - player.height;
          player.vy = 0;
          player.isGrounded = true;
          player.slopeAngle = getGroundSlope(playerCenterX);
        } else {
          player.isGrounded = false;
          player.slopeAngle *= 0.85;
        }

        // Hair physics
        let hairTargetAngle: number;
        if (player.isGrounded && player.vx !== 0) {
          hairTargetAngle = player.vx > 0 ? Math.PI : 0;
        } else if (!player.isGrounded) {
          hairTargetAngle = player.vx > 0 ? Math.PI - 0.3 : Math.PI * 0.3;
          if (Math.abs(player.vx) < 0.5) hairTargetAngle = Math.PI / 2;
        } else {
          hairTargetAngle = Math.PI / 2;
        }

        const angleDiff = hairTargetAngle - player.hairAngle;
        const normalizedDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
        player.hairVel += normalizedDiff * 0.08;
        player.hairVel *= 0.75;
        player.hairAngle += player.hairVel;

        if (player.y > canvas.height + 100 && !player.isEaten && !player.isWaitingForNext && !player.isFallingDeath) {
          player.isFallingDeath = true;
          floatingTexts.push({ x: player.x, y: player.y - 60, text: '-10', color: '#ff4444', alpha: 1, vy: -2.5 });
          setTimeout(() => { onAnswer(false); initLevel(); }, 400);
        }

        if (!player.isEaten && !player.isWaitingForNext && !player.isFallingDeath) {
          const correctBox = boxes.find(b => b.isCorrect);
          if (correctBox && player.x > correctBox.x + correctBox.width + 15 && player.isGrounded) {
            player.isFallingDeath = true;
            floatingTexts.push({ x: player.x, y: player.y - 20, text: '-10', color: '#ff4444', alpha: 1, vy: -2.5 });
            setTimeout(() => { onAnswer(false); initLevel(); }, 400);
          }
        }

        boxes.forEach(box => {
          if (box.isFading) return;
          const radius = box.width / 2;
          const cx = box.x + radius;
          const cy = box.y + radius;
          const dx = playerCenterX - cx;
          const dy = (player.y + player.height * 0.6) - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const prevDy = (player.y + player.height * 0.6 - player.vy) - cy;

          if (dist < radius + player.width * 0.4) {
            if (prevDy < 0 && dy >= 0 || prevDy < -radius * 0.6) {
              if (box.isCorrect) {
                player.isWaitingForNext = true;
                player.y = box.y - player.height + 4;
                player.vy = 0; player.vx = 0;
                floatingTexts.push({ x: player.x, y: player.y - 30, text: '+100', color: '#44ff88', alpha: 1, vy: -2.5 });
                setTimeout(() => { onAnswer(true); initLevel(); }, 500);
              } else {
                player.isEaten = true;
                box.isFading = true;
                player.y = box.y - player.height + 4;
                player.vy = 0; player.vx = 0;
                floatingTexts.push({ x: player.x, y: player.y - 20, text: '-10', color: '#ff4444', alpha: 1, vy: -2.5 });
                setTimeout(() => { onAnswer(false); initLevel(); }, 500);
              }
            }
          }
        });

      } else if (player.isEaten) {
        player.y += 2;
        player.fadeAlpha = Math.max(0, player.fadeAlpha - 0.04);
        player.scaleY = Math.max(0, player.scaleY - 0.04);
      }

      cameraX = player.x - canvas.width / 3;
      if (cameraX < 0) cameraX = 0;

      boxes.forEach(box => {
        if (removedRef.current.includes(box.optValue) && !box.isFading) {
          box.isFading = true;
        }
        if (box.isFading) box.alpha = Math.max(0, box.alpha - 0.035);
      });
    };

    const drawPlayer = () => {
      ctx.save();
      const footX = player.x + player.width / 2;
      const footY = player.y + player.height;

      ctx.translate(footX, footY);
      ctx.rotate(player.slopeAngle);
      ctx.scale(1, player.scaleY);
      ctx.globalAlpha = player.fadeAlpha;

      const s = player.height / 46;
      const headR = 7 * s;
      const bodyH = 13 * s;
      const armL = 11 * s;
      const legL = 13 * s;
      const limbThick = 2.8 * s;

      const running = player.vx !== 0 && player.isGrounded && !player.isEaten;
      const runPhase = (player.runFrame / 10) * Math.PI * 2;

      let armA1 = 0.1, armA2 = -0.1, legA1 = 0.1, legA2 = -0.1;
      if (!player.isGrounded) {
        armA1 = -Math.PI * 0.35; armA2 = Math.PI * 0.35;
        legA1 = Math.PI * 0.25; legA2 = -Math.PI * 0.25;
      } else if (running) {
        armA1 = Math.sin(runPhase) * 0.55;
        armA2 = -Math.sin(runPhase) * 0.55;
        legA1 = -Math.sin(runPhase) * 0.65;
        legA2 = Math.sin(runPhase) * 0.65;
      }

      if (player.vx < 0) ctx.scale(-1, 1);

      const drawLimb = (startX: number, startY: number, angle: number, length: number) => {
        const endX = startX + Math.sin(angle) * length;
        const endY = startY + Math.cos(angle) * length;
        ctx.save();
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = limbThick * 2 + 1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = limbThick * 2 - 1;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(endX, endY, limbThick * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      };

      const shoulderY = -player.height + headR * 2.1;
      const hipY = shoulderY + bodyH;

      drawLimb(0, shoulderY, armA2, armL);
      drawLimb(0, hipY, legA2, legL);

      ctx.save();
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = (limbThick * 2 + 1) * 1.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, shoulderY); ctx.lineTo(0, hipY);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = limbThick * 2.5;
      ctx.beginPath();
      ctx.moveTo(0, shoulderY); ctx.lineTo(0, hipY);
      ctx.stroke();
      ctx.restore();

      drawLimb(0, shoulderY, armA1, armL);
      drawLimb(0, hipY, legA1, legL);

      // Hair
      const headCY = -player.height + headR;
      ctx.save();
      ctx.translate(-headR * 0.6, headCY - headR * 0.3);
      ctx.rotate(player.hairAngle - Math.PI / 2);

      const strandData = [
        { col: '#ffffff', len: 18 * s, curve: 4 * s, rotOff: 0 },
        { col: '#dddddd', len: 22 * s, curve: -5 * s, rotOff: 0.1 },
        { col: '#eeeeee', len: 16 * s, curve: 6 * s, rotOff: -0.1 },
      ];
      strandData.forEach(sd => {
        ctx.save();
        ctx.rotate(sd.rotOff);
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 3 * s + 1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(sd.curve, sd.len * 0.5, sd.curve * 0.5, sd.len);
        ctx.stroke();
        ctx.strokeStyle = sd.col;
        ctx.lineWidth = 2.5 * s;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(sd.curve, sd.len * 0.5, sd.curve * 0.5, sd.len);
        ctx.stroke();
        ctx.restore();
      });
      ctx.restore();

      // Head
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 2;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, headCY, headR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#222222';
      ctx.beginPath();
      ctx.arc(headR * 0.4, headCY - headR * 0.1, headR * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(headR * 0.48, headCY - headR * 0.18, headR * 0.07, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const draw = () => {
      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#1a3a6e');
      skyGrad.addColorStop(0.6, '#4a87d5');
      skyGrad.addColorStop(1, '#7ab5e8');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Background Image (City Skyline)
      if (skylineImg.complete && skylineImg.naturalHeight > 0) {
        // Parallax effect
        const bgX = -(cameraX * 0.15) % canvas.width;
        // Draw twice for seamless horizontal scrolling
        ctx.drawImage(skylineImg, bgX, 0, canvas.width, canvas.height);
        ctx.drawImage(skylineImg, bgX + canvas.width, 0, canvas.width, canvas.height);

        // Atmospheric Perspective Fog Layer
        // Pushes the city into the background so the foreground pops
        ctx.fillStyle = 'rgba(26, 58, 110, 0.4)'; // matches sky blue
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Sun
      const sunX = canvas.width - 140;
      const sunY = 90;
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 55);
      sunGrad.addColorStop(0, 'rgba(255,255,255,1)');
      sunGrad.addColorStop(0.3, 'rgba(255,255,230,0.85)');
      sunGrad.addColorStop(1, 'rgba(255,255,200,0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 55, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 75, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      [{ t: 0.35, r: 8 }, { t: 0.55, r: 14 }, { t: 0.72, r: 5 }].forEach(({ t, r }) => {
        const fx = sunX + (canvas.width / 2 - sunX) * t;
        const fy = sunY + (canvas.height / 2 - sunY) * t;
        const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, r);
        fg.addColorStop(0, 'rgba(200,220,255,0.45)');
        fg.addColorStop(1, 'rgba(200,220,255,0)');
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(fx, fy, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // World space
      ctx.save();
      ctx.translate(-cameraX, 0);

      // Trees — using the real image asset with transparent background
      treePositions.forEach(tx => {
        const ty = getGroundY(tx);
        const tH = 340 * sizeScale; // Match the large size from before
        const tW = tH * 0.7; // Approximate aspect ratio of the tree image
        ctx.save();
        ctx.translate(tx, ty);

        // Ground shadow
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 45 * sizeScale, 12 * sizeScale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw the real tree image, anchored at bottom center
        if (treeImg.complete && treeImg.naturalHeight > 0) {
          ctx.drawImage(treeImg, -tW / 2, -tH, tW, tH);
        }

        ctx.restore();
      });

      // Curved ground
      const startX = cameraX - 10;
      const endX = cameraX + canvas.width + 10;
      const step = 6;

      const groundGrad = ctx.createLinearGradient(0, canvas.height * 0.75 - 40, 0, canvas.height);
      groundGrad.addColorStop(0, '#6b3c1c');
      groundGrad.addColorStop(0.15, '#5a3012');
      groundGrad.addColorStop(1, '#2e1506');
      ctx.fillStyle = groundGrad;
      ctx.beginPath();
      ctx.moveTo(startX, canvas.height);
      for (let x = startX; x <= endX; x += step) {
        ctx.lineTo(x, getGroundY(x));
      }
      ctx.lineTo(endX, canvas.height);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = startX; x <= endX; x += step) {
        if (x === startX) ctx.moveTo(x, getGroundY(x));
        else ctx.lineTo(x, getGroundY(x));
      }
      ctx.stroke();

      // Dirt texture
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      for (let i = 0; i < 80; i++) {
        const tx2 = startX + ((i * 127.3) % (canvas.width + 20));
        const ty2 = getGroundY(tx2) + 6 + ((i * 37.1) % 50);
        ctx.fillRect(tx2, ty2, 3, 3);
      }

      // Pits
      pits.forEach(pit => {
        if (pit.x + pit.width < cameraX || pit.x > cameraX + canvas.width) return;
        ctx.save();
        if (pit.type === 'wheel') {
          // Dark dirt trench for the wheel to sit in
          const pitGrad = ctx.createLinearGradient(0, canvas.height * 0.75 - 20, 0, canvas.height);
          pitGrad.addColorStop(0, '#3a1e08');
          pitGrad.addColorStop(0.25, '#2a1506');
          pitGrad.addColorStop(1, '#150a03');
          ctx.fillStyle = pitGrad;
        } else {
          // Open gap — sky visible
          const pitGrad2 = ctx.createLinearGradient(0, canvas.height * 0.75, 0, canvas.height);
          pitGrad2.addColorStop(0, '#4a87d5');
          pitGrad2.addColorStop(1, '#1a3a6e');
          ctx.fillStyle = pitGrad2;
        }
        ctx.beginPath();
        ctx.moveTo(pit.x, canvas.height);
        for (let x = pit.x; x <= pit.x + pit.width; x += 4) {
          ctx.lineTo(x, getGroundY(x));
        }
        ctx.lineTo(pit.x + pit.width, canvas.height);
        ctx.closePath();
        ctx.fill();

        // Pit wall edges (border)
        ctx.strokeStyle = '#150a03';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(pit.x, canvas.height);
        ctx.lineTo(pit.x, getGroundY(pit.x));
        ctx.moveTo(pit.x + pit.width, canvas.height);
        ctx.lineTo(pit.x + pit.width, getGroundY(pit.x + pit.width));
        ctx.stroke();

        ctx.restore();
      });

      // Stone wheel options — fully canvas-drawn, half-buried in ground pit
      boxes.forEach(box => {
        if (box.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = box.alpha;
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2; // cy = ground level (wheel center)
        const radius = box.width / 2;

        // Remove clip so the full wheel is visible sitting in the trench


        // Glowing Aura (Visual Juice)
        const glowRad = radius * 1.8;
        const glow = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, glowRad);
        // Extract RGB from hex string (assuming format #rrggbb)
        const hex = box.color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        glow.addColorStop(0, `rgba(${r},${g},${b},0.4)`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, glowRad, 0, Math.PI * 2);
        ctx.fill();

        ctx.translate(cx, cy);
        ctx.rotate(box.wheelRotation);

        // Draw the real stone wheel image
        if (stoneWheelImg.complete && stoneWheelImg.naturalHeight > 0) {
          ctx.drawImage(stoneWheelImg, -radius * 1.3, -radius * 1.3, radius * 2.6, radius * 2.6);
        }

        // Colored letter perfectly centered
        ctx.save();
        // Removed duplicate translate here; we are already translated to (cx, cy)
        ctx.globalAlpha = box.alpha;

        if (box.isFading) {
          const mouth = radius * (1.1 - box.alpha) * 1.8;
          ctx.fillStyle = 'rgba(0,0,0,0.9)';
          ctx.beginPath();
          ctx.arc(0, 0, Math.min(mouth, radius), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = box.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(3, Math.round(5 * sizeScale));
        ctx.font = `900 ${Math.round(44 * sizeScale)}px "Outfit", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw the letter directly in the center over the hub
        ctx.strokeText(box.text, 0, 0);
        ctx.fillText(box.text, 0, 0);

        ctx.restore();

        ctx.restore(); // globalAlpha
      });

      drawPlayer();

      // Floating texts
      floatingTexts.forEach(ft => {
        ft.y += ft.vy;
        ft.alpha -= 0.035;
        if (ft.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = ft.alpha;
          ctx.font = 'bold 36px "Courier New"';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 5;
          ctx.strokeText(ft.text, ft.x, ft.y);
          ctx.fillStyle = ft.color;
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.restore();
        }
      });

      ctx.restore();
    };

    const loop = () => {
      update();
      draw();
      animationFrameId = window.requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [question, gameState, onAnswer, playSound]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
};
