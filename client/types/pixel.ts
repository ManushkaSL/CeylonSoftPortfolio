export type PixelEmotion =
  | "neutral"
  | "happy"
  | "angry"
  | "dizzy"
  | "curious"
  | "excited"
  | "sleepy"
  | "thinking"
  | "surprised"
  | "playful"
  | "confused"
  | "speaking";

export interface PixelSpeechMessage {
  id: string;
  text: string;
  emotion: PixelEmotion;
  durationMs?: number;
  isSpontaneous?: boolean;
}

export interface PixelChatMessage {
  id: string;
  sender: "user" | "pixel";
  text: string;
  emotion?: PixelEmotion;
  timestamp: number;
}

export interface PixelEmotionColors {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  cheek: string;
}

export const PIXEL_EMOTION_COLORS: Record<PixelEmotion, PixelEmotionColors> = {
  neutral: {
    primary: "#63EAF2",
    secondary: "#73F3C4",
    accent: "#EDFFFE",
    glow: "rgba(0, 238, 255, 0.45)",
    cheek: "#81FAD4",
  },
  happy: {
    primary: "#80F5CD",
    secondary: "#35DDA6",
    accent: "#E0FFF2",
    glow: "rgba(0, 245, 160, 0.55)",
    cheek: "#80FFCB",
  },
  angry: {
    primary: "#FF887F",
    secondary: "#F36378",
    accent: "#FFE8EC",
    glow: "rgba(255, 71, 87, 0.6)",
    cheek: "#FF9F9A",
  },
  dizzy: {
    primary: "#C5B4FF",
    secondary: "#A68AE6",
    accent: "#F3E5F5",
    glow: "rgba(165, 94, 234, 0.55)",
    cheek: "#D4C5FF",
  },
  curious: {
    primary: "#A5EAFF",
    secondary: "#70C8F1",
    accent: "#E8F4FD",
    glow: "rgba(0, 210, 211, 0.45)",
    cheek: "#ADEEFF",
  },
  excited: {
    primary: "#FFE28A",
    secondary: "#FFBD69",
    accent: "#FFF9E6",
    glow: "rgba(255, 211, 42, 0.6)",
    cheek: "#FFCE86",
  },
  sleepy: {
    primary: "#9CCDDC",
    secondary: "#89B6CF",
    accent: "#E1F8FF",
    glow: "rgba(87, 96, 111, 0.3)",
    cheek: "#B3E4ED",
  },
  thinking: {
    primary: "#00D2D3",
    secondary: "#9C88FF",
    accent: "#F5F0FF",
    glow: "rgba(156, 136, 255, 0.5)",
    cheek: "rgba(0, 210, 211, 0.4)",
  },
  surprised: {
    primary: "#00EEFF",
    secondary: "#FED330",
    accent: "#FFFFFF",
    glow: "rgba(0, 238, 255, 0.6)",
    cheek: "rgba(254, 211, 48, 0.55)",
  },
  playful: {
    primary: "#2ED573",
    secondary: "#FF9FF3",
    accent: "#FFF0F8",
    glow: "rgba(255, 159, 243, 0.5)",
    cheek: "rgba(255, 159, 243, 0.65)",
  },
  confused: {
    primary: "#48DBFB",
    secondary: "#FF9F43",
    accent: "#FFF5EB",
    glow: "rgba(255, 159, 67, 0.45)",
    cheek: "rgba(255, 159, 67, 0.45)",
  },
  speaking: {
    primary: "#00EEFF",
    secondary: "#00B4D8",
    accent: "#E0F7FF",
    glow: "rgba(0, 238, 255, 0.55)",
    cheek: "rgba(0, 238, 255, 0.45)",
  },
};
