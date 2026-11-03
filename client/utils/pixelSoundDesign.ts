import type { PixelEmotion } from "@/types/pixel";

export type PixelSound =
  | "notice"
  | "happy"
  | "angry"
  | "dizzy"
  | "curious"
  | "surprised"
  | "excited"
  | "sleepy"
  | "thinking"
  | "pop"
  | "click";

interface PixelNote {
  at: number;
  duration: number;
  pitch: readonly (readonly [number, number])[];
  level: number;
  timbre?: "sine" | "round";
  attack?: number;
  wobble?: { rate: number; cents: number };
  air?: boolean;
}

interface PixelSoundDesign {
  duration: number;
  cooldown: number;
  priority: number;
  notes: readonly PixelNote[];
}

// This shared beat places the second bloop at the peak of the happy SVG bounce.
export const PIXEL_HAPPY_BEAT = 0.17;

// Original miniature robot motifs. Times are seconds on the audio clock, pitches
// are Hz, and the quiet airy transient is synthesized rather than sampled audio.
export const PIXEL_SOUND_DESIGNS: Record<PixelSound, PixelSoundDesign> = {
  notice: {
    duration: 0.32,
    cooldown: 4000,
    priority: 60,
    notes: [
      {
        at: 0,
        duration: 0.11,
        pitch: [
          [0, 330],
          [0.045, 395],
          [0.11, 370],
        ],
        level: 0.32,
      },
      {
        at: 0.14,
        duration: 0.18,
        pitch: [
          [0, 380],
          [0.07, 535],
          [0.18, 470],
        ],
        level: 0.36,
        timbre: "round",
      },
    ],
  },
  happy: {
    duration: 0.33,
    cooldown: 1200,
    priority: 30,
    notes: [
      {
        at: 0,
        duration: 0.14,
        pitch: [
          [0, 390],
          [0.05, 465],
          [0.14, 425],
        ],
        level: 0.36,
      },
      {
        at: PIXEL_HAPPY_BEAT,
        duration: 0.16,
        pitch: [
          [0, 510],
          [0.055, 625],
          [0.16, 565],
        ],
        level: 0.38,
      },
    ],
  },
  angry: {
    duration: 0.47,
    cooldown: 6000,
    priority: 90,
    notes: [
      {
        at: 0,
        duration: 0.32,
        pitch: [
          [0, 185],
          [0.12, 142],
          [0.23, 165],
          [0.32, 128],
        ],
        level: 0.42,
        timbre: "round",
        wobble: { rate: 19, cents: 90 },
      },
      {
        at: 0.35,
        duration: 0.12,
        pitch: [
          [0, 530],
          [0.045, 705],
          [0.12, 585],
        ],
        level: 0.26,
      },
    ],
  },
  dizzy: {
    duration: 0.63,
    cooldown: 9000,
    priority: 80,
    notes: [
      {
        at: 0,
        duration: 0.63,
        pitch: [
          [0, 510],
          [0.3, 325],
          [0.63, 175],
        ],
        level: 0.34,
        attack: 0.018,
        wobble: { rate: 6.5, cents: 185 },
      },
    ],
  },
  curious: {
    duration: 0.27,
    cooldown: 900,
    priority: 25,
    notes: [
      {
        at: 0,
        duration: 0.095,
        pitch: [
          [0, 405],
          [0.04, 460],
          [0.095, 430],
        ],
        level: 0.28,
      },
      {
        at: 0.135,
        duration: 0.135,
        pitch: [
          [0, 465],
          [0.07, 505],
          [0.135, 635],
        ],
        level: 0.29,
      },
    ],
  },
  surprised: {
    duration: 0.2,
    cooldown: 1000,
    priority: 40,
    notes: [
      {
        at: 0,
        duration: 0.2,
        pitch: [
          [0, 240],
          [0.055, 650],
          [0.14, 460],
          [0.2, 525],
        ],
        level: 0.36,
        timbre: "round",
        attack: 0.005,
      },
    ],
  },
  excited: {
    duration: 0.44,
    cooldown: 1500,
    priority: 35,
    notes: [
      {
        at: 0,
        duration: 0.105,
        pitch: [
          [0, 375],
          [0.04, 450],
          [0.105, 410],
        ],
        level: 0.3,
        timbre: "round",
      },
      {
        at: 0.13,
        duration: 0.12,
        pitch: [
          [0, 480],
          [0.045, 575],
          [0.12, 525],
        ],
        level: 0.34,
      },
      {
        at: 0.28,
        duration: 0.16,
        pitch: [
          [0, 650],
          [0.065, 795],
          [0.16, 720],
        ],
        level: 0.32,
      },
    ],
  },
  sleepy: {
    duration: 0.58,
    cooldown: 8000,
    priority: 10,
    notes: [
      {
        at: 0,
        duration: 0.58,
        pitch: [
          [0, 330],
          [0.22, 240],
          [0.58, 145],
        ],
        level: 0.23,
        attack: 0.028,
      },
    ],
  },
  thinking: {
    duration: 0.42,
    cooldown: 1600,
    priority: 15,
    notes: [
      {
        at: 0,
        duration: 0.105,
        pitch: [
          [0, 365],
          [0.045, 420],
          [0.105, 390],
        ],
        level: 0.13,
      },
      {
        at: 0.28,
        duration: 0.14,
        pitch: [
          [0, 405],
          [0.14, 495],
        ],
        level: 0.12,
      },
    ],
  },
  pop: {
    duration: 0.12,
    cooldown: 220,
    priority: 20,
    notes: [
      {
        at: 0,
        duration: 0.12,
        pitch: [
          [0, 330],
          [0.045, 170],
          [0.12, 115],
        ],
        level: 0.34,
        attack: 0.004,
      },
      {
        at: 0.005,
        duration: 0.07,
        pitch: [[0, 1400]],
        level: 0.045,
        attack: 0.004,
        air: true,
      },
    ],
  },
  click: {
    duration: 0.16,
    cooldown: 350,
    priority: 20,
    notes: [
      {
        at: 0,
        duration: 0.16,
        pitch: [
          [0, 255],
          [0.045, 480],
          [0.105, 310],
          [0.16, 265],
        ],
        level: 0.3,
        timbre: "round",
      },
    ],
  },
};

export const PIXEL_EMOTION_SOUNDS: Partial<Record<PixelEmotion, PixelSound>> = {
  happy: "happy",
  angry: "angry",
  dizzy: "dizzy",
  curious: "curious",
  surprised: "surprised",
  excited: "excited",
  sleepy: "sleepy",
  thinking: "thinking",
  playful: "curious",
  confused: "curious",
};

export interface PixelVoice {
  gain: GainNode;
  sources: AudioScheduledSourceNode[];
  nodes: AudioNode[];
  endsAt: number;
}

export function createPixelOutput(context: BaseAudioContext, volume: number) {
  const input = context.createBiquadFilter();
  input.type = "highpass";
  input.frequency.value = 65;
  input.Q.value = 0.5;
  const warmth = context.createBiquadFilter();
  warmth.type = "lowpass";
  warmth.frequency.value = 2200;
  warmth.Q.value = 0.5;
  const compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.knee.value = 18;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.005;
  compressor.release.value = 0.09;
  const master = context.createGain();
  master.gain.value = volume;
  input.connect(warmth);
  warmth.connect(compressor);
  compressor.connect(master);
  master.connect(context.destination);
  return { input, master, nodes: [input, warmth, compressor, master] };
}

export function synthesizePixelSound(
  context: BaseAudioContext,
  output: AudioNode,
  sound: PixelSound,
  start: number,
  level = 1,
): PixelVoice {
  const design = PIXEL_SOUND_DESIGNS[sound];
  const gain = context.createGain();
  gain.gain.value = level;
  gain.connect(output);
  const voice: PixelVoice = {
    gain,
    sources: [],
    nodes: [gain],
    endsAt: start + design.duration + 0.012,
  };

  for (const note of design.notes) {
    const time = start + note.at;
    const end = time + note.duration;
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(
      note.level,
      time + (note.attack || 0.008),
    );
    envelope.gain.exponentialRampToValueAtTime(0.0001, end - 0.004);
    envelope.gain.linearRampToValueAtTime(0, end);
    envelope.connect(gain);
    voice.nodes.push(envelope);

    let source: OscillatorNode | AudioBufferSourceNode;
    if (note.air) {
      const air = context.createBuffer(
        1,
        Math.ceil(context.sampleRate * note.duration),
        context.sampleRate,
      );
      const samples = air.getChannelData(0);
      // Seeded original noise keeps the tiny breath transient consistent.
      let seed = 173;
      for (let i = 0; i < samples.length; i++) {
        seed = (seed * 16807) % 2147483647;
        samples[i] = (seed / 2147483647) * 2 - 1;
      }
      source = context.createBufferSource();
      source.buffer = air;
      const filter = context.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1350;
      filter.Q.value = 0.65;
      source.connect(filter);
      filter.connect(envelope);
      voice.nodes.push(filter);
    } else {
      const oscillator = context.createOscillator();
      if (note.timbre === "round") {
        oscillator.setPeriodicWave(
          context.createPeriodicWave(
            new Float32Array([0, 0, 0, 0]),
            new Float32Array([0, 1, 0.1, 0.045]),
          ),
        );
      } else oscillator.type = "sine";
      note.pitch.forEach(([offset, hz], index) => {
        if (index === 0) oscillator.frequency.setValueAtTime(hz, time + offset);
        else
          oscillator.frequency.exponentialRampToValueAtTime(hz, time + offset);
      });
      if (note.wobble) {
        const lfo = context.createOscillator();
        const depth = context.createGain();
        lfo.frequency.setValueAtTime(note.wobble.rate, time);
        depth.gain.setValueAtTime(note.wobble.cents, time);
        depth.gain.linearRampToValueAtTime(0, end);
        lfo.connect(depth);
        depth.connect(oscillator.detune);
        lfo.start(time);
        lfo.stop(end + 0.004);
        voice.sources.push(lfo);
        voice.nodes.push(lfo, depth);
      }
      source = oscillator;
      oscillator.connect(envelope);
    }
    source.start(time);
    source.stop(end + 0.004);
    voice.sources.push(source);
    voice.nodes.push(source);
  }
  return voice;
}
