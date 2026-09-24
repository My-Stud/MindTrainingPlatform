class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.confetti = [];
    this.running = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.initParticles();
    this.animate();
  }

  initParticles() {
    this.particles = [];
    const count = Math.min(60, Math.floor(this.canvas.width / 20));
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const types = ['star', 'bubble', 'sparkle', 'dot'];
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3 - 0.15,
      opacity: Math.random() * 0.5 + 0.1,
      type: types[Math.floor(Math.random() * types.length)],
      hue: Math.random() * 360,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01
    };
  }

  animate() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;
      const pulseFactor = Math.sin(p.pulse) * 0.3 + 0.7;

      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.canvas.height + 10;
      if (p.y > this.canvas.height + 10) p.y = -10;

      this.ctx.globalAlpha = p.opacity * pulseFactor;

      if (p.type === 'star') {
        this.drawStar(p.x, p.y, p.size * pulseFactor, p.hue);
      } else if (p.type === 'bubble') {
        this.drawBubble(p.x, p.y, p.size * 2 * pulseFactor, p.hue);
      } else if (p.type === 'sparkle') {
        this.drawSparkle(p.x, p.y, p.size * pulseFactor, p.hue);
      } else {
        this.drawDot(p.x, p.y, p.size * pulseFactor, p.hue);
      }
    });

    this.confetti = this.confetti.filter(c => {
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.05;
      c.rotation += c.rotSpeed;
      c.life -= 0.008;

      if (c.life <= 0) return false;

      this.ctx.globalAlpha = c.life;
      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate(c.rotation);
      this.ctx.fillStyle = c.color;
      this.ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      this.ctx.restore();

      return true;
    });

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }

  drawStar(x, y, size, hue) {
    this.ctx.fillStyle = `hsla(${hue}, 80%, 70%, 0.8)`;
    this.ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const method = i === 0 ? 'moveTo' : 'lineTo';
      this.ctx[method](x + Math.cos(angle) * size, y + Math.sin(angle) * size);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawBubble(x, y, size, hue) {
    this.ctx.strokeStyle = `hsla(${hue}, 70%, 70%, 0.5)`;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.fillStyle = `hsla(${hue}, 70%, 80%, 0.1)`;
    this.ctx.fill();
  }

  drawSparkle(x, y, size, hue) {
    this.ctx.fillStyle = `hsla(${hue}, 90%, 80%, 0.9)`;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - size);
    this.ctx.lineTo(x + size * 0.3, y);
    this.ctx.lineTo(x, y + size);
    this.ctx.lineTo(x - size * 0.3, y);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.moveTo(x - size, y);
    this.ctx.lineTo(x, y + size * 0.3);
    this.ctx.lineTo(x + size, y);
    this.ctx.lineTo(x, y - size * 0.3);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawDot(x, y, size, hue) {
    this.ctx.fillStyle = `hsla(${hue}, 60%, 70%, 0.6)`;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  spawnConfetti(count = 50) {
    const colors = ['#E74C3C', '#F39C12', '#2ECC71', '#3498DB', '#9B59B6', '#FD79A8', '#FECA57', '#00CEC9'];
    for (let i = 0; i < count; i++) {
      this.confetti.push({
        x: Math.random() * this.canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2 + 1,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        life: 1
      });
    }
  }

  spawnCoinBurst(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      this.confetti.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3 - 2,
        w: 6,
        h: 6,
        color: '#FECA57',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        life: 1
      });
    }
  }

  stop() {
    this.running = false;
  }
}

const particleSystem = new ParticleSystem('particleCanvas');
