class AudioManager {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio not supported');
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, duration, type = 'sine', volume = 0.15) {
    if (!this.soundEnabled || !this.ctx) return;
    this.ensureContext();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playClick() {
    this.playTone(800, 0.08, 'sine', 0.1);
  }

  playKeyPress() {
    this.playTone(600 + Math.random() * 200, 0.06, 'sine', 0.08);
  }

  playCorrect() {
    this.playTone(523, 0.12, 'sine', 0.15);
    setTimeout(() => this.playTone(659, 0.12, 'sine', 0.15), 100);
    setTimeout(() => this.playTone(784, 0.2, 'sine', 0.15), 200);
  }

  playWrong() {
    this.playTone(300, 0.15, 'square', 0.1);
    setTimeout(() => this.playTone(250, 0.2, 'square', 0.1), 100);
  }

  playWin() {
    const notes = [523, 587, 659, 784, 880, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.12), i * 80);
    });
  }

  playGameOver() {
    this.playTone(400, 0.15, 'square', 0.1);
    setTimeout(() => this.playTone(350, 0.15, 'square', 0.1), 150);
    setTimeout(() => this.playTone(300, 0.2, 'square', 0.1), 300);
    setTimeout(() => this.playTone(250, 0.3, 'square', 0.12), 450);
  }

  playHint() {
    const notes = [400, 500, 600, 800];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.12, 'sine', 0.1), i * 60);
    });
  }

  playLevelComplete() {
    const melody = [523, 587, 659, 784, 880, 1047, 1175, 1319];
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.12), i * 100);
    });
  }

  playStart() {
    this.playTone(440, 0.1, 'sine', 0.1);
    setTimeout(() => this.playTone(554, 0.1, 'sine', 0.1), 100);
    setTimeout(() => this.playTone(659, 0.15, 'sine', 0.12), 200);
  }

  playLetterReveal() {
    this.playTone(880, 0.08, 'sine', 0.12);
    setTimeout(() => this.playTone(1100, 0.1, 'sine', 0.1), 50);
  }

  playCombo() {
    this.playTone(800, 0.06, 'sine', 0.1);
    setTimeout(() => this.playTone(1000, 0.06, 'sine', 0.1), 40);
    setTimeout(() => this.playTone(1200, 0.08, 'sine', 0.1), 80);
  }

  playPop() {
    this.playTone(1200, 0.05, 'sine', 0.1);
    setTimeout(() => this.playTone(1600, 0.06, 'sine', 0.08), 30);
  }

  playCoinCollect() {
    this.playTone(1200, 0.08, 'sine', 0.1);
    setTimeout(() => this.playTone(1600, 0.1, 'sine', 0.1), 60);
  }

  playPopup() {
    this.playTone(400, 0.1, 'sine', 0.1);
    setTimeout(() => this.playTone(600, 0.15, 'sine', 0.1), 80);
  }

  playStarEarned() {
    this.playTone(880, 0.1, 'sine', 0.12);
    setTimeout(() => this.playTone(1100, 0.1, 'sine', 0.12), 100);
    setTimeout(() => this.playTone(1320, 0.15, 'sine', 0.15), 200);
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }
}

const audioManager = new AudioManager();
