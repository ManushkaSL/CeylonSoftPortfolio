import {
  createPixelOutput,
  PIXEL_SOUND_DESIGNS,
  synthesizePixelSound,
  type PixelSound,
  type PixelVoice,
} from "./pixelSoundDesign";

type ActiveVoice = PixelVoice & { sound: PixelSound; cancelled: boolean };

/** One lazily unlocked context, one character voice and one quiet cloud foley. */
export class PixelSoundEngine {
  private context: AudioContext | null = null;
  private output: ReturnType<typeof createPixelOutput> | null = null;
  private enabled = false;
  private volume = 0.24;
  private unlocked = false;
  private disposed = false;
  private generation = 0;
  private listeners = new Set<() => void>();
  private lastPlayed = new Map<PixelSound, number>();
  private seenEvents = new Set<string>();
  private active = new Set<ActiveVoice>();
  private channels = new Map<"voice" | "foley", ActiveVoice>();

  constructor() {
    if (typeof window === "undefined") return;
    try {
      this.enabled = localStorage.getItem("pixel_sound_enabled") === "true";
    } catch {
      /* Storage is optional. */
    }
    window.addEventListener("pointerdown", this.onGesture, { passive: true });
    window.addEventListener("keydown", this.onGesture);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  public getSoundEnabled = () => this.enabled;
  public getVolume = () => this.volume;
  public subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public setVolume(volume: number): void {
    if (!Number.isFinite(volume)) return;
    this.volume = Math.max(0, Math.min(0.5, volume));
    if (this.context && this.output) {
      this.output.master.gain.setTargetAtTime(
        this.volume,
        this.context.currentTime,
        0.015,
      );
    }
  }

  public toggleSound(): boolean {
    this.setSoundEnabled(!this.enabled);
    return this.enabled;
  }

  /** Called by the visible toggle; loading a saved preference never starts audio. */
  public setSoundEnabled(enabled: boolean): void {
    if (this.disposed) return;
    this.enabled = enabled;
    const generation = ++this.generation;
    try {
      localStorage.setItem("pixel_sound_enabled", String(enabled));
    } catch {
      /* Private browsing is supported. */
    }
    this.listeners.forEach((listener) => listener());
    if (!enabled) {
      this.unlocked = false;
      this.stopAll();
      return;
    }
    if (
      typeof navigator !== "undefined" &&
      navigator.userActivation &&
      !navigator.userActivation.isActive
    )
      return;
    void this.unlock().then((ready) => {
      if (ready && generation === this.generation && this.enabled)
        this.play("click", `sound-enabled-${generation}`);
    });
  }

  private onGesture = (event: Event) => {
    if (
      event.isTrusted &&
      this.enabled &&
      (!this.unlocked || this.context?.state !== "running")
    )
      void this.unlock();
  };

  private async unlock(): Promise<boolean> {
    if (
      !this.enabled ||
      this.disposed ||
      typeof window === "undefined" ||
      document.hidden
    )
      return false;
    try {
      if (!this.context || this.context.state === "closed") {
        const AudioConstructor =
          window.AudioContext ||
          (window as Window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioConstructor) return false;
        this.context = new AudioConstructor({ latencyHint: "interactive" });
        this.output = createPixelOutput(this.context, this.volume);
      }
      if (this.context.state !== "running") await this.context.resume();
      this.unlocked =
        this.enabled && !document.hidden && this.context.state === "running";
      if (!this.unlocked) this.stopAll();
      return this.unlocked;
    } catch {
      return false;
    }
  }

  /** No backlog: unavailable, hidden, muted or busy low-priority cues are dropped. */
  public play(sound: PixelSound, eventId?: string): boolean {
    if (eventId) {
      const key = `${sound}:${eventId}`;
      if (this.seenEvents.has(key)) return false;
      this.seenEvents.add(key);
      if (this.seenEvents.size > 128)
        this.seenEvents.delete(this.seenEvents.values().next().value);
    }
    const context = this.context;
    if (
      !this.enabled ||
      !this.unlocked ||
      this.disposed ||
      !context ||
      context.state !== "running" ||
      !this.output ||
      document.hidden
    )
      return false;
    const now = performance.now();
    const design = PIXEL_SOUND_DESIGNS[sound];
    if (
      this.lastPlayed.has(sound) &&
      now - this.lastPlayed.get(sound)! < design.cooldown
    )
      return false;

    const channel = sound === "pop" ? "foley" : "voice";
    const current = this.channels.get(channel);
    const busy =
      current && !current.cancelled && current.endsAt > context.currentTime;
    if (
      busy &&
      (channel === "foley" ||
        PIXEL_SOUND_DESIGNS[current.sound].priority >= design.priority)
    )
      return false;
    if (
      sound === "click" &&
      this.channels.get("voice")?.sound === "angry" &&
      busy
    )
      return false;

    try {
      if (busy) this.fadeOut(current);
      // A replacement starts after the previous voice's release, avoiding a hard cut.
      const start = context.currentTime + (busy ? 0.022 : 0.006);
      const voice: ActiveVoice = {
        ...synthesizePixelSound(
          context,
          this.output.input,
          sound,
          start,
          sound === "pop" && this.channels.has("voice") ? 0.65 : 1,
        ),
        sound,
        cancelled: false,
      };
      this.channels.set(channel, voice);
      this.active.add(voice);
      this.lastPlayed.set(sound, now);
      let remaining = voice.sources.length;
      voice.sources.forEach((source) => {
        source.onended = () => {
          if (--remaining) return;
          voice.nodes.forEach((node) => node.disconnect());
          this.active.delete(voice);
          if (this.channels.get(channel) === voice)
            this.channels.delete(channel);
          this.suspendIfIdle();
        };
      });
      return true;
    } catch {
      return false;
    }
  }

  private fadeOut(voice: ActiveVoice): void {
    if (voice.cancelled || !this.context) return;
    voice.cancelled = true;
    const time = this.context.currentTime;
    const gain = voice.gain.gain;
    if (typeof gain.cancelAndHoldAtTime === "function")
      gain.cancelAndHoldAtTime(time);
    else {
      gain.cancelScheduledValues(time);
      gain.setValueAtTime(gain.value, time);
    }
    gain.linearRampToValueAtTime(0, time + 0.018);
    voice.sources.forEach((source) => {
      try {
        source.stop(time + 0.02);
      } catch {
        /* Already ended. */
      }
    });
  }

  public stopAll(): void {
    this.active.forEach((voice) => this.fadeOut(voice));
    this.channels.clear();
    this.suspendIfIdle();
  }

  private suspendIfIdle(): void {
    if (
      !this.active.size &&
      this.context?.state === "running" &&
      (!this.enabled || document.hidden)
    ) {
      void this.context.suspend().catch(() => {});
    }
  }

  private onVisibilityChange = () => {
    if (document.hidden) {
      this.unlocked = false;
      this.stopAll();
    }
    // Return silently. A fresh user gesture resumes the context, never old cues.
  };

  public dispose(): void {
    this.disposed = true;
    this.generation++;
    this.stopAll();
    if (typeof window !== "undefined") {
      window.removeEventListener("pointerdown", this.onGesture);
      window.removeEventListener("keydown", this.onGesture);
      document.removeEventListener("visibilitychange", this.onVisibilityChange);
    }
    this.listeners.clear();
    if (this.context && this.context.state !== "closed")
      void this.context.close().catch(() => {});
  }
}

export const pixelAudio = new PixelSoundEngine();
if (import.meta.hot) import.meta.hot.dispose(() => pixelAudio.dispose());
