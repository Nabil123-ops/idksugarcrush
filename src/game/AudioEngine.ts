// Procedural Web Audio API sound effects and polyphonic music engine
// Zero external audio asset dependencies

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbDelay: DelayNode | null = null;
  private sfxEnabled = true;
  private musicEnabled = true;
  private musicTimer: number | null = null;
  private musicStep = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      const ctx = new AudioCtx();
      this.ctx = ctx;

      // Studio dynamics compressor prevents clipping during huge Sugar Crush cascades
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-16, ctx.currentTime);
      compressor.knee.setValueAtTime(18, ctx.currentTime);
      compressor.ratio.setValueAtTime(6, ctx.currentTime);
      compressor.attack.setValueAtTime(0.004, ctx.currentTime);
      compressor.release.setValueAtTime(0.18, ctx.currentTime);

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.88, ctx.currentTime);
      master.connect(compressor);
      compressor.connect(ctx.destination);
      this.masterGain = master;

      // Warm slap-echo reverb bus for shimmering bells & chimes
      const delay = ctx.createDelay(0.6);
      delay.delayTime.setValueAtTime(0.24, ctx.currentTime);
      const fb = ctx.createGain();
      fb.gain.setValueAtTime(0.24, ctx.currentTime);
      const damp = ctx.createBiquadFilter();
      damp.type = 'lowpass';
      damp.frequency.setValueAtTime(1900, ctx.currentTime);
      const wet = ctx.createGain();
      wet.gain.setValueAtTime(0.26, ctx.currentTime);

      delay.connect(damp);
      damp.connect(fb);
      fb.connect(delay);
      damp.connect(wet);
      wet.connect(master);
      this.reverbDelay = delay;
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private connectOut(node: AudioNode, withReverb = false) {
    if (!this.ctx || !this.masterGain) return;
    node.connect(this.masterGain);
    if (withReverb && this.reverbDelay) {
      node.connect(this.reverbDelay);
    }
  }

  public unlock() {
    this.ensureContext();
    if (this.musicEnabled && this.musicTimer === null) {
      this.startMusicLoop();
    }
  }

  public setSettings(sfx: boolean, music: boolean) {
    this.sfxEnabled = sfx;
    this.musicEnabled = music;
    if (music) {
      this.startMusicLoop();
    } else {
      this.stopMusicLoop();
    }
  }

  public playButtonTap() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(640, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.045);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    this.connectOut(gain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  public playSelect() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.065);

    gain.gain.setValueAtTime(0.085, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    this.connectOut(gain, true);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playSwap() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(310, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.085);

    gain.gain.setValueAtTime(0.065, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    this.connectOut(gain);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  public playInvalidSwap() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(135, now + 0.13);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 540;

    gain.gain.setValueAtTime(0.075, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    this.connectOut(gain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playTickUrgent() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(980, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.06);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    this.connectOut(gain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Bubbly pop + crystal chime that shifts upward along a cheerful C-major pentatonic cascade
  public playMatch(comboStep: number) {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98];
    const idx = Math.min(scale.length - 1, Math.max(0, comboStep - 1));
    const baseFreq = scale[idx];
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq * 0.72, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.18, now + 0.08);
    gain1.gain.setValueAtTime(0.115, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc1.connect(gain1);
    this.connectOut(gain1, true);
    osc1.start(now);
    osc1.stop(now + 0.17);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 1.5, now + 0.02);
    gain2.gain.setValueAtTime(0.055, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
    osc2.connect(gain2);
    this.connectOut(gain2, true);
    osc2.start(now + 0.02);
    osc2.stop(now + 0.2);
  }

  public playSpecialCreate() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [659.25, 880, 1174.66, 1567.98];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const t = now + i * 0.038;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.075, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(gain);
      this.connectOut(gain, true);
      osc.start(t);
      osc.stop(t + 0.23);
    });
  }

  public playStripeBlast() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1480, now);
    osc.frequency.exponentialRampToValueAtTime(210, now + 0.23);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1300, now);
    filter.frequency.exponentialRampToValueAtTime(420, now + 0.23);

    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(filter);
    filter.connect(gain);
    this.connectOut(gain, true);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playWrappedBoom() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(175, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.34);
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

    osc.connect(gain);
    this.connectOut(gain, true);
    osc.start(now);
    osc.stop(now + 0.37);

    const bufferSize = Math.floor(ctx.sampleRate * 0.22);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.12, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    noise.connect(filter);
    filter.connect(nGain);
    this.connectOut(nGain);
    noise.start(now);
  }

  public playColorBombZap() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = now + idx * 0.028;
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(f * 1.28, t + 0.28);
      gain.gain.setValueAtTime(0.085, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.34);
      osc.connect(gain);
      this.connectOut(gain, true);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  }

  public playBlockerHit() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.075);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 920;

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(filter);
    filter.connect(gain);
    this.connectOut(gain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playIngredientDrop() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [783.99, 1046.5, 1318.51].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const t = now + i * 0.055;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.105, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      this.connectOut(gain, true);
      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  public playPurchase() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [987.77, 1318.51, 1975.53].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const t = now + i * 0.045;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.095, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
      osc.connect(gain);
      this.connectOut(gain, true);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  public playAdReward() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chime = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    chime.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      const t = now + i * 0.06;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.11, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      this.connectOut(gain, true);
      osc.start(t);
      osc.stop(t + 0.36);
    });
  }

  public playStarEarned(starIndex: number) {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const pitches = [880, 1046.5, 1318.5];
    const f = pitches[Math.min(2, starIndex)] || 1046.5;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, now);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
    osc.connect(gain);
    this.connectOut(gain, true);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playWin() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fanfare = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51];
    const times = [0, 0.09, 0.18, 0.28, 0.42, 0.52, 0.65];

    fanfare.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i === fanfare.length - 1 ? 'triangle' : 'sine';
      const t = now + times[i];
      osc.frequency.setValueAtTime(freq, t);
      const dur = i === fanfare.length - 1 ? 0.65 : 0.22;
      gain.gain.setValueAtTime(0.13, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain);
      this.connectOut(gain, true);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    });
  }

  public playLose() {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [392, 349.23, 329.63, 261.63];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = now + i * 0.16;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
      osc.connect(gain);
      this.connectOut(gain, true);
      osc.start(t);
      osc.stop(t + 0.34);
    });
  }

  private startMusicLoop() {
    if (this.musicTimer !== null || typeof window === 'undefined') return;
    // Polyphonic candy kingdom loop: Fmaj7 -> G6 -> Em7 -> Am7 (32-step cycle)
    const melody = [
      523.25, 659.25, 783.99, 987.77, 880.0, 783.99, 659.25, 587.33,
      587.33, 698.46, 880.0, 1046.5, 987.77, 880.0, 783.99, 659.25,
      659.25, 783.99, 987.77, 1174.66, 1046.5, 987.77, 880.0, 783.99,
      698.46, 880.0, 1046.5, 1318.51, 1174.66, 1046.5, 880.0, 659.25,
    ];
    const bassRoots = [174.61, 196.0, 164.81, 220.0]; // F3, G3, E3, A3

    this.musicTimer = window.setInterval(() => {
      if (!this.musicEnabled || !this.ctx || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const step = this.musicStep % melody.length;
      const freq = melody[step];
      this.musicStep++;

      // Music-box bell lead
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1650;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.022, now + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.56);

      osc.connect(filter);
      filter.connect(gain);
      this.connectOut(gain, true);
      osc.start(now);
      osc.stop(now + 0.58);

      // Warm bass + chord pad pulse every 8 steps (bar boundary)
      if (step % 8 === 0) {
        const root = bassRoots[Math.floor(step / 8) % bassRoots.length];
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(root, now);
        bassGain.gain.setValueAtTime(0.001, now);
        bassGain.gain.linearRampToValueAtTime(0.024, now + 0.12);
        bassGain.gain.exponentialRampToValueAtTime(0.0008, now + 1.8);
        bassOsc.connect(bassGain);
        this.connectOut(bassGain);
        bassOsc.start(now);
        bassOsc.stop(now + 1.85);

        // Soft fifth pad shimmer
        const padOsc = this.ctx.createOscillator();
        const padGain = this.ctx.createGain();
        padOsc.type = 'sine';
        padOsc.frequency.setValueAtTime(root * 1.5, now);
        padGain.gain.setValueAtTime(0.001, now);
        padGain.gain.linearRampToValueAtTime(0.014, now + 0.18);
        padGain.gain.exponentialRampToValueAtTime(0.0008, now + 1.7);
        padOsc.connect(padGain);
        this.connectOut(padGain, true);
        padOsc.start(now);
        padOsc.stop(now + 1.75);
      }
    }, 420);
  }

  private stopMusicLoop() {
    if (this.musicTimer !== null) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const audioEngine = new SoundEngine();
