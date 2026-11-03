import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const harness = vi.hoisted(() => ({
  rendered: [] as any[],
  contexts: [] as any[],
}));

vi.mock("./pixelSoundDesign", async (importOriginal) => {
  const original = await importOriginal<typeof import("./pixelSoundDesign")>();
  const parameter = () => ({
    value: 1,
    setTargetAtTime: vi.fn(),
    cancelAndHoldAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
  });
  return {
    ...original,
    createPixelOutput: vi.fn(() => ({
      input: {},
      master: { gain: parameter() },
      nodes: [],
    })),
    synthesizePixelSound: vi.fn((context, _output, sound, start) => {
      const design = original.PIXEL_SOUND_DESIGNS[sound];
      const voice = {
        gain: { gain: parameter() },
        sources: design.notes.map(() => ({ stop: vi.fn(), onended: null })),
        nodes: [{ disconnect: vi.fn() }],
        endsAt: start + design.duration,
      };
      harness.rendered.push({ sound, voice });
      return voice;
    }),
  };
});

class FakeContext {
  state = "suspended";
  currentTime = 1;
  resume = vi.fn(async () => {
    this.state = "running";
  });
  suspend = vi.fn(async () => {
    this.state = "suspended";
  });
  close = vi.fn(async () => {
    this.state = "closed";
  });
  constructor() {
    harness.contexts.push(this);
  }
}

describe("PixelSoundEngine playback policy", () => {
  let engine: import("./pixelAudio").PixelSoundEngine;
  let singleton: import("./pixelAudio").PixelSoundEngine;
  let clock: number;
  let page: EventTarget & { hidden: boolean };
  let storage: {
    getItem: ReturnType<typeof vi.fn>;
    setItem: ReturnType<typeof vi.fn>;
  };
  let browser: EventTarget & {
    AudioContext?: typeof FakeContext;
    webkitAudioContext?: typeof FakeContext;
  };

  const finishVoices = () => {
    harness.rendered.forEach(({ voice }) =>
      voice.sources.forEach((source) => {
        const ended = source.onended;
        source.onended = null;
        ended?.();
      }),
    );
    harness.contexts.forEach((context) => {
      context.currentTime += 2;
    });
  };
  const enable = async () => {
    engine.setSoundEnabled(true);
    await Promise.resolve();
    await Promise.resolve();
    finishVoices();
    clock += 1000;
  };

  beforeEach(async () => {
    vi.resetModules();
    harness.rendered.length = 0;
    harness.contexts.length = 0;
    clock = 10000;
    vi.spyOn(performance, "now").mockImplementation(() => clock);
    page = Object.assign(new EventTarget(), { hidden: false });
    browser = Object.assign(new EventTarget(), { AudioContext: FakeContext });
    storage = { getItem: vi.fn(() => null), setItem: vi.fn() };
    vi.stubGlobal("window", browser);
    vi.stubGlobal("document", page);
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("navigator", { userActivation: { isActive: true } });
    const module = await import("./pixelAudio");
    singleton = module.pixelAudio;
    engine = new module.PixelSoundEngine();
  });

  afterEach(() => {
    engine.dispose();
    singleton.dispose();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("starts muted and never constructs or queues audio for visual reactions", () => {
    expect(engine.getSoundEnabled()).toBe(false);
    ["notice", "happy", "pop", "angry", "dizzy"].forEach((sound) => {
      expect(engine.play(sound as any)).toBe(false);
    });
    expect(harness.contexts).toHaveLength(0);
    expect(harness.rendered).toHaveLength(0);
  });

  it("waits for user activation even after an opt-in is requested", async () => {
    (navigator.userActivation as { isActive: boolean }).isActive = false;
    engine.setSoundEnabled(true);
    await Promise.resolve();
    expect(engine.play("happy")).toBe(false);
    expect(harness.contexts).toHaveLength(0);
    (navigator.userActivation as { isActive: boolean }).isActive = true;
    await enable();
    expect(engine.play("happy")).toBe(true);
    expect(harness.contexts).toHaveLength(1);
  });

  it("reuses one context and bounds master volume", async () => {
    await enable();
    engine.play("happy");
    finishVoices();
    engine.play("curious");
    engine.setVolume(3);
    expect(engine.getVolume()).toBe(0.5);
    engine.setVolume(Number.NaN);
    expect(engine.getVolume()).toBe(0.5);
    engine.setVolume(-1);
    expect(engine.getVolume()).toBe(0);
    engine.setSoundEnabled(false);
    finishVoices();
    await enable();
    expect(harness.contexts).toHaveLength(1);
  });

  it("lets anger replace a quieter voice but rejects clicks and repeated anger", async () => {
    await enable();
    expect(engine.play("happy", "happy-bounce")).toBe(true);
    const happy = harness.rendered[harness.rendered.length - 1].voice;
    expect(engine.play("angry", "angry-shake")).toBe(true);
    expect(happy.gain.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
      0,
      expect.any(Number),
    );
    expect(engine.play("click")).toBe(false);
    expect(engine.play("happy")).toBe(false);
    expect(engine.play("pop", "new-cloud")).toBe(true);
    expect(engine.play("pop", "same-frame-cloud")).toBe(false);
    finishVoices();
    clock += 5000;
    expect(engine.play("angry", "new-burst")).toBe(false);
    clock += 1001;
    expect(engine.play("angry", "later-burst")).toBe(true);
    expect(engine.play("angry", "later-burst")).toBe(false);
  });

  it("cancels scheduled notes on mute and suspends only after the release", async () => {
    await enable();
    engine.play("thinking");
    const voice = harness.rendered[harness.rendered.length - 1].voice;
    const context = harness.contexts[0];
    engine.setSoundEnabled(false);
    voice.sources.forEach((source) => expect(source.stop).toHaveBeenCalled());
    expect(context.state).toBe("running");
    expect(engine.play("angry")).toBe(false);
    finishVoices();
    expect(context.state).toBe("suspended");
    expect(voice.nodes[0].disconnect).toHaveBeenCalled();
  });

  it("stops hidden-tab audio, returns silently, and never replays old cues", async () => {
    await enable();
    engine.play("dizzy", "dizzy-entry");
    page.hidden = true;
    page.dispatchEvent(new Event("visibilitychange"));
    finishVoices();
    expect(harness.contexts[0].state).toBe("suspended");
    expect(engine.play("happy", "hidden-happy")).toBe(false);
    page.hidden = false;
    page.dispatchEvent(new Event("visibilitychange"));
    expect(engine.play("happy")).toBe(false);
    await enable();
    expect(engine.play("happy", "hidden-happy")).toBe(false);
    expect(engine.play("happy", "fresh-happy")).toBe(true);
  });

  it("keeps working when storage is blocked and supports the prefixed context", async () => {
    storage.getItem.mockImplementation(() => {
      throw new Error("Storage blocked");
    });
    storage.setItem.mockImplementation(() => {
      throw new Error("Storage blocked");
    });
    const { PixelSoundEngine } = await import("./pixelAudio");
    engine.dispose();
    engine = new PixelSoundEngine();
    browser.webkitAudioContext = FakeContext;
    browser.AudioContext = undefined;
    await enable();
    expect(engine.play("curious")).toBe(true);
    expect(harness.contexts).toHaveLength(1);
  });
});
