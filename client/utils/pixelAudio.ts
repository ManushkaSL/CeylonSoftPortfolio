// Original cartoon sound effect synthesizer using Web Audio API

class PixelSoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private lastPlayTime: Record<string, number> = {};

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pixel_sound_enabled");
      this.isEnabled = saved === "true";
    }
  }

  public getSoundEnabled(): boolean {
    return this.isEnabled;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("pixel_sound_enabled", String(enabled));
      if (enabled && !this.ctx) {
        this.initContext();
      }
    }
  }

  public toggleSound(): boolean {
    this.setSoundEnabled(!this.isEnabled);
    if (this.isEnabled) {
      this.play("pip");
    }
    return this.isEnabled;
  }

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public play(type: "pop" | "happy" | "angry" | "dizzy" | "boop" | "chime" | "pip"): void {
    if (!this.isEnabled) return;

    // Cooldown check: prevent sound spamming
    const now = Date.now();
    const minCooldown = type === "dizzy" ? 800 : type === "angry" ? 600 : 250;
    if (this.lastPlayTime[type] && now - this.lastPlayTime[type] < minCooldown) {
      return;
    }
    this.lastPlayTime[type] = now;

    const ctx = this.initContext();
    if (!ctx) return;

    try {
      switch (type) {
        case "pop":
          this.synthesizePop(ctx);
          break;
        case "happy":
          this.synthesizeHappy(ctx);
          break;
        case "angry":
          this.synthesizeAngry(ctx);
          break;
        case "dizzy":
          this.synthesizeDizzy(ctx);
          break;
        case "boop":
          this.synthesizeBoop(ctx);
          break;
        case "chime":
          this.synthesizeChime(ctx);
          break;
        case "pip":
          this.synthesizePip(ctx);
          break;
      }
    } catch {
      // Audio failed gracefully
    }
  }

  // Soft cartoon bubble pop
  private synthesizePop(ctx: AudioContext): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = ctx.currentTime;

    osc.type = "sine";
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.08);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Two-tone cheerful bloop
  private synthesizeHappy(ctx: AudioContext): void {
    const t = ctx.currentTime;

    // First tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(440, t);
    osc1.frequency.exponentialRampToValueAtTime(587, t + 0.1);
    gain1.gain.setValueAtTime(0.12, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.11);

    // Second cheerful tone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(659, t + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(880, t + 0.22);
    gain2.gain.setValueAtTime(0.14, t + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.08);
    osc2.stop(t + 0.25);
  }

  // Cute cartoon grumble (low pitched brrp)
  private synthesizeAngry(ctx: AudioContext): void {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(130, t + 0.18);

    // Filter to make it cute and muffled, not harsh
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, t);

    gain.gain.setValueAtTime(0.16, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  // Wobbly descending electronic flutter
  private synthesizeDizzy(ctx: AudioContext): void {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const gain = ctx.createGain();

    // LFO for wobbly pitch vibrato
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(12, t);
    lfoGain.gain.setValueAtTime(50, t);

    osc.type = "sine";
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.35);

    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);

    lfo.start(t);
    osc.start(t);
    lfo.stop(t + 0.4);
    osc.stop(t + 0.4);
  }

  // Short high-pitched boop for surprise
  private synthesizeBoop(ctx: AudioContext): void {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.exponentialRampToValueAtTime(950, t + 0.08);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Bright cheerful digital chime
  private synthesizeChime(ctx: AudioContext): void {
    const t = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = idx * 0.06;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + delay);

      gain.gain.setValueAtTime(0.08, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + delay);
      osc.stop(t + delay + 0.28);
    });
  }

  // Tiny playful wink chirp
  private synthesizePip(ctx: AudioContext): void {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.linearRampToValueAtTime(920, t + 0.04);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.06);
  }
}

export const pixelAudio = new PixelSoundEngine();

