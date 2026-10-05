// ==========================================
// CINEMATIC LUXURY SOUND & SPATIAL AUDIO SYNTHESIZERS
// ==========================================

export class UISoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
  }

  // Soft subtle glass tap on hover (Volume: 0.08)
  playHoverClick() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";

      // Glassy double overtone (1200Hz & 2400Hz)
      osc1.frequency.setValueAtTime(1200, now);
      osc1.frequency.exponentialRampToValueAtTime(800, now + 0.03);

      osc2.frequency.setValueAtTime(2400, now);
      osc2.frequency.exponentialRampToValueAtTime(1600, now + 0.03);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.03);
      osc2.stop(now + 0.03);
    } catch (e) {}
  }

  // Luxurious smooth camera transition glide (Volume: 0.18)
  playCameraSwoosh() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;

      // Pitch glide chord (C5 to E5 to G5 pitch swell)
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq * 0.7, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.1, now + 0.22);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.35);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06 - idx * 0.015, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch (e) {}
  }
}

export class MultiTrackAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.filter = null;
    this.lfo = null;
    this.lfoGain = null;
    this.oscillators = [];
    this.audioElement = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.currentConfig = null;
  }

  configure(config) {
    this.currentConfig = config;
    if (this.isPlaying && !this.isMuted) {
      this.play(config);
    }
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    this.lfo = this.ctx.createOscillator();
    this.lfoGain = this.ctx.createGain();
    this.lfo.type = "sine";
    this.lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
    this.lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);

    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.filter.frequency);

    this.filter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  play(config = this.currentConfig) {
    if (config) this.currentConfig = config;
    const activeConfig = this.currentConfig || {};

    if (activeConfig.enabled === false) {
      this.mute();
      return;
    }

    const vol = activeConfig.volume !== undefined ? activeConfig.volume : 0.3;

    // Custom MP3 Audio File
    if (activeConfig.sourceType === "custom" && activeConfig.customAudioUrl) {
      if (!this.audioElement || this.audioElement.src !== activeConfig.customAudioUrl) {
        if (this.audioElement) {
          try { this.audioElement.pause(); } catch (e) {}
        }
        this.audioElement = new Audio(activeConfig.customAudioUrl);
        this.audioElement.loop = true;
      }
      this.audioElement.volume = this.isMuted ? 0 : vol;
      this.audioElement.play().catch(() => {});
      this.isPlaying = true;
      return;
    }

    // Preset Audio Synthesizer
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const presetId = activeConfig.presetId || "luxury_piano";
    let freqs = [174.61, 220.0, 261.63, 329.63];
    if (presetId === "hotel_lounge") freqs = [138.59, 174.61, 207.65, 261.63];
    if (presetId === "ocean_breeze") freqs = [110.0, 164.81, 220.0, 246.94];
    if (presetId === "nature_birds") freqs = [220.0, 277.18, 329.63, 440.0];
    if (presetId === "lofi_chill") freqs = [146.83, 174.61, 220.0, 261.63];

    if (!this.isPlaying) {
      try {
        this.oscillators = freqs.map((freq) => {
          const osc = this.ctx.createOscillator();
          const oscGain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          oscGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
          osc.connect(oscGain);
          oscGain.connect(this.filter);
          osc.start();
          return osc;
        });
        this.lfo.start();
      } catch (e) {}
      this.isPlaying = true;
    }

    if (!this.isMuted) {
      this.masterGain.gain.setTargetAtTime(vol * 0.4, this.ctx.currentTime, 0.3);
    }
  }

  pause() {
    this.mute();
  }

  mute() {
    this.isMuted = true;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
    }
    if (this.audioElement) {
      try { this.audioElement.pause(); } catch (e) {}
    }
  }

  unmute() {
    this.isMuted = false;
    this.play();
  }
}

export const uiSound = new UISoundEngine();
export const spatialAudio = new MultiTrackAudioEngine();
