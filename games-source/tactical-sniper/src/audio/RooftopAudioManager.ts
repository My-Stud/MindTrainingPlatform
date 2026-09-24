// ─────────────────────────────────────────────────────────────────
//  ROOFTOP PURSUIT REALISTIC AUDIO SYNTHESIS (Web Audio API)
// ─────────────────────────────────────────────────────────────────

import { useGameStore } from '../game/gameStore';

class AudioManagerImpl {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public play(type: 'gunshot' | 'hit_body' | 'hit_concrete' | 'radio' | 'casing' | 'streak_surge' | 'victory') {
    if (useGameStore.getState().muted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      switch (type) {
        case 'gunshot': {
          // 1. High-Caliber Supersonic Crack (White Noise Transient)
          const bufferSize = ctx.sampleRate * 0.08;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(1200, now);

          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.7, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          whiteNoise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(ctx.destination);
          whiteNoise.start(now);

          // 2. Heavy Sub-Bass Gunshot Thump
          const subOsc = ctx.createOscillator();
          const subGain = ctx.createGain();
          subOsc.type = 'triangle';
          subOsc.frequency.setValueAtTime(180, now);
          subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.28);

          subGain.gain.setValueAtTime(0.8, now);
          subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

          subOsc.connect(subGain);
          subGain.connect(ctx.destination);
          subOsc.start(now);
          subOsc.stop(now + 0.28);

          // 3. Urban Canyon Reverb Echo Tail
          const echoOsc = ctx.createOscillator();
          const echoGain = ctx.createGain();
          echoOsc.type = 'sawtooth';
          echoOsc.frequency.setValueAtTime(95, now + 0.04);
          echoOsc.frequency.exponentialRampToValueAtTime(40, now + 0.65);

          echoGain.gain.setValueAtTime(0.2, now + 0.04);
          echoGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

          echoOsc.connect(echoGain);
          echoGain.connect(ctx.destination);
          echoOsc.start(now + 0.04);
          echoOsc.stop(now + 0.65);

          // 4. Brass Shell Casing Ping
          setTimeout(() => {
            if (this.ctx) {
              const cNow = this.ctx.currentTime;
              const pOsc = this.ctx.createOscillator();
              const pGain = this.ctx.createGain();
              pOsc.type = 'sine';
              pOsc.frequency.setValueAtTime(2400, cNow);
              pGain.gain.setValueAtTime(0.08, cNow);
              pGain.gain.exponentialRampToValueAtTime(0.001, cNow + 0.06);
              pOsc.connect(pGain);
              pGain.connect(this.ctx.destination);
              pOsc.start(cNow);
              pOsc.stop(cNow + 0.06);
            }
          }, 180);
          break;
        }

        case 'hit_body': {
          // Direct Tactical Impact + Thud
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + 0.2);

          gain.gain.setValueAtTime(0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        case 'hit_concrete': {
          // Concrete Ricochet Zip
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400, now);
          osc.frequency.linearRampToValueAtTime(280, now + 0.15);

          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }

        case 'radio': {
          // Police Dispatch Radio Beep / Squelch
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.setValueAtTime(1180, now + 0.04);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }

        case 'casing': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(2800, now);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }

        case 'streak_surge': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.linearRampToValueAtTime(680, now + 0.3);

          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        }

        case 'victory': {
          [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
            const noteTime = now + i * 0.1;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, noteTime);
            gain.gain.setValueAtTime(0.2, noteTime);
            gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(noteTime);
            osc.stop(noteTime + 0.3);
          });
          break;
        }
      }
    } catch {
      // Ignore on un-interacted browsers
    }
  }
}

export const RooftopAudio = new AudioManagerImpl();
