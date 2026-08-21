// Web Audio synthesizer for ambient study sounds & tactile feedback (zero external audio files needed)

class AudioManager {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play pleasant chime on task completion
  playTaskCompleteChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // First note
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.5);

      // Second harmonic chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1174.66, now + 0.08); // D6
      gain2.gain.setValueAtTime(0.08, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.08);
      osc2.stop(now + 0.6);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Play gentle bell for timer finish
  playTimerBell() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const chords = [523.25, 659.25, 783.99, 1046.5]; // C Major chord

      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.8);
      });
    } catch {
      // Audio fallback
    }
  }

  // Start continuous ambient noise (rain, brown noise, soft drone)
  startAmbient(type: 'rain' | 'whitenoise' | 'drone') {
    this.stopAmbient();
    try {
      const ctx = this.getContext();
      this.gainNode = ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
      this.gainNode.connect(ctx.destination);

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Pink-ish filtered noise for rain sound
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        } else if (type === 'drone') {
          // Warm low rumble
          lastOut = (lastOut + 0.005 * white) / 1.005;
          data[i] = lastOut * 5.0;
        } else {
          // Soft white noise
          data[i] = white * 0.15;
        }
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Filter for warm soft acoustic feel
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = type === 'rain' ? 800 : type === 'drone' ? 300 : 1200;

      noise.connect(filter);
      filter.connect(this.gainNode);

      noise.start();
      this.noiseNode = noise;
      this.isPlaying = true;
    } catch {
      // Ignore audio errors
    }
  }

  stopAmbient() {
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
        this.noiseNode.disconnect();
      } catch {
        // Ignore
      }
      this.noiseNode = null;
    }
    this.isPlaying = false;
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const audioManager = new AudioManager();
