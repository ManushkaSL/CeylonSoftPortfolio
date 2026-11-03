import { useState, useEffect, useRef, useCallback } from "react";
import { PixelEmotion, PixelSpeechMessage } from "@/types/pixel";
import { pixelAudio } from "@/utils/pixelAudio";
import { PixelSound } from "@/utils/pixelSoundDesign";
import {
  DIZZY_MESSAGES,
  ANGRY_MESSAGES,
  HAPPY_MESSAGES,
  CURIOUS_MESSAGES,
  SECTION_GREETINGS,
  SPONTANEOUS_FUN_FACTS,
} from "@/utils/pixelKnowledge";

interface UsePixelBehaviorOptions {
  currentSection: number;
  isChatOpen: boolean;
  projectsType?: "web" | "mobile" | null;
  characterRef?: React.RefObject<HTMLElement>;
}

export function usePixelBehavior({
  currentSection,
  isChatOpen,
  projectsType,
  characterRef,
}: UsePixelBehaviorOptions) {
  const [emotion, setEmotion] = useState<PixelEmotion>("neutral");
  const [animationId, setAnimationId] = useState(0);
  const [eyeLook, setEyeLook] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [speech, setSpeech] = useState<PixelSpeechMessage | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spontaneousEnabled, setSpontaneousEnabled] = useState(true);

  // References for physics and timers
  const pixelPos = useRef<{ x: number; y: number }>({ x: 24, y: window.innerHeight / 2 });
  const lastMousePos = useRef<{ x: number; y: number; time: number }>({
    x: 0,
    y: 0,
    time: Date.now(),
  });
  const recentSpeeds = useRef<number[]>([]);
  const fastSpeedStart = useRef<number | null>(null);
  const dizzyCooldown = useRef<number>(0);

  // Click tracking
  const clickTimestamps = useRef<number[]>([]);
  const angryCooldown = useRef<number>(0);

  // Speech and recovery timers
  const speechTimer = useRef<number | null>(null);
  const recoveryTimer = useRef<number | null>(null);
  const idleTimer = useRef<number | null>(null);
  const spontaneousTimer = useRef<number | null>(null);

  // Priority lock to prevent low-priority events from overriding dizzy or angry
  const isLocked = useRef<boolean>(false);

  // Animation controller hooks
  const onExpressionStart = useCallback((emo: PixelEmotion, _id: number) => {
    // Expression transition started in Framer Motion
  }, []);

  const onExpressionComplete = useCallback((_emo: PixelEmotion, _id: number) => {
    // Expression transition finished
  }, []);

  const onCloudInflate = useCallback((_id: string) => {
    pixelAudio.play("pop");
  }, []);

  const onCloudSettled = useCallback((_id: string) => {
    // Cloud settled
  }, []);

  // Helper to trigger speech with custom duration and optional cartoon voice cue
  const speak = useCallback(
    (text: string, emo: PixelEmotion, durationMs: number = 3800, voiceCue?: PixelSound) => {
      if (speechTimer.current) window.clearTimeout(speechTimer.current);

      setEmotion(emo);
      setAnimationId((prev) => prev + 1);
      setIsSpeaking(true);
      setSpeech({
        id: `msg-${Date.now()}`,
        text,
        emotion: emo,
        durationMs,
      });

      // Play the airy cloud pop foley
      pixelAudio.play("pop");

      // Play voice sound if specified (spaced slightly after pop)
      if (voiceCue && voiceCue !== "pop") {
        window.setTimeout(() => {
          pixelAudio.play(voiceCue);
        }, 110);
      }

      // Stop speaking animation after 1.4s
      setTimeout(() => setIsSpeaking(false), 1400);

      // Auto dismiss cloud
      speechTimer.current = window.setTimeout(() => {
        setSpeech(null);
      }, durationMs);
    },
    []
  );

  const dismissSpeech = useCallback(() => {
    if (speechTimer.current) window.clearTimeout(speechTimer.current);
    setSpeech(null);
    setIsSpeaking(false);
  }, []);

  // ── FIRST VISITOR GREETING SEQUENCE (Runs only once per session) ──
  useEffect(() => {
    let alreadyGreeted = false;
    try {
      alreadyGreeted = sessionStorage.getItem("pixel_visitor_greeted") === "true";
    } catch {
      // Fallback in case storage is restricted
    }

    if (alreadyGreeted) return;

    try {
      sessionStorage.setItem("pixel_visitor_greeted", "true");
    } catch {
      // Ignore storage errors
    }

    isLocked.current = true;

    // 1. Pixel notices the visitor (delayed by 950ms so page hero mounts smoothly)
    const t1 = window.setTimeout(() => {
      // 2. Eyes widen in surprise & 3. Antennae spring upward
      setEmotion("surprised");
      setAnimationId((prev) => prev + 1);
      setEyeLook({ x: 0.6, y: -0.2 });
      pixelAudio.play("notice"); // Sound 1: Soft rising electronic bip-bwoop (~320ms)

      // 4. Pixel makes a tiny excited bounce
      const t2 = window.setTimeout(() => {
        setEmotion("excited");
        setAnimationId((prev) => prev + 1);

        // 5. White cloud pops up with pop sound
        const t3 = window.setTimeout(() => {
          pixelAudio.play("pop"); // Sound 2: Light airy cartoon pop (~120ms)
          setIsSpeaking(true);
          setSpeech({
            id: `first-visit-${Date.now()}`,
            text: "Ohhh, a visitor!! 👀✨",
            emotion: "happy",
            durationMs: 4200,
          });

          // 6. Face transitions into happy mint-green glow with bloop-bloop!
          const t4 = window.setTimeout(() => {
            setEmotion("happy");
            setAnimationId((prev) => prev + 1);
            setEyeLook({ x: 0, y: 0 });
            pixelAudio.play("happy"); // Sound 3: Cheerful two-note bloop-bloop (~330ms)

            // 7. Gradual return to natural idle behavior
            const t5 = window.setTimeout(() => {
              setEmotion("neutral");
              setAnimationId((prev) => prev + 1);
              setIsSpeaking(false);
              isLocked.current = false;
            }, 3800);

            return () => window.clearTimeout(t5);
          }, 360);

          return () => window.clearTimeout(t4);
        }, 360);

        return () => window.clearTimeout(t3);
      }, 340);

      return () => window.clearTimeout(t2);
    }, 950);

    return () => {
      window.clearTimeout(t1);
    };
  }, []);

  // ── FAST CURSOR DIZZINESS TRACKER ──
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = Math.max(1, now - lastMousePos.current.time);
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const dist = Math.hypot(dx, dy);
      const speed = (dist / dt) * 1000; // px / sec

      lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };

      // Update eye look vector relative to Pixel's resting position
      const relX = e.clientX - pixelPos.current.x;
      const relY = e.clientY - pixelPos.current.y;
      const lookDist = Math.max(1, Math.hypot(relX, relY));
      if (!isLocked.current) {
        setEyeLook({
          x: Math.max(-1, Math.min(1, relX / Math.min(300, lookDist))),
          y: Math.max(-1, Math.min(1, relY / Math.min(300, lookDist))),
        });
      }

      // Track rolling speeds
      recentSpeeds.current.push(speed);
      if (recentSpeeds.current.length > 6) recentSpeeds.current.shift();
      const avgSpeed = recentSpeeds.current.reduce((a, b) => a + b, 0) / recentSpeeds.current.length;

      // Check fast threshold (> 3400 px/sec sustained)
      if (avgSpeed > 3400) {
        if (!fastSpeedStart.current) fastSpeedStart.current = now;
        const sustainedDuration = now - fastSpeedStart.current;

        if (
          sustainedDuration > 320 &&
          now > dizzyCooldown.current &&
          !isLocked.current &&
          !isChatOpen
        ) {
          isLocked.current = true;
          dizzyCooldown.current = now + 9000; // 9s cooldown
          fastSpeedStart.current = null;

          setEmotion("dizzy");
          setAnimationId((prev) => prev + 1);
          pixelAudio.play("dizzy"); // Sound D: Descending wobbly tone "woo-oo-oo..."

          const msg = DIZZY_MESSAGES[Math.floor(Math.random() * DIZZY_MESSAGES.length)];
          speak(msg, "dizzy", 4200);

          // Gradual dizzy recovery sequence
          if (recoveryTimer.current) window.clearTimeout(recoveryTimer.current);
          recoveryTimer.current = window.setTimeout(() => {
            setEmotion("surprised");
            setAnimationId((prev) => prev + 1);
            pixelAudio.play("surprised"); // Sound F: Quick rising "BWOP!"

            setTimeout(() => {
              setEmotion("neutral");
              setAnimationId((prev) => prev + 1);
              isLocked.current = false;
            }, 1200);
          }, 3200);
        }
      } else {
        fastSpeedStart.current = null;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [speak, isChatOpen]);

  // ── REPEATED CLICK BURST ANGER TRACKER ──
  const handlePixelClick = useCallback(() => {
    const now = Date.now();
    // Clean old clicks outside 1500ms
    clickTimestamps.current = clickTimestamps.current.filter((t) => now - t < 1500);
    clickTimestamps.current.push(now);

    const burstCount = clickTimestamps.current.length;

    // 1st click: friendly greeting / playful remark with normal click sound
    if (burstCount === 1 && !isLocked.current) {
      pixelAudio.play("click"); // Sound K: Normal robot click "boink!"
      setEmotion("happy");
      setAnimationId((prev) => prev + 1);
      const msg = HAPPY_MESSAGES[Math.floor(Math.random() * HAPPY_MESSAGES.length)];
      speak(msg, "happy", 3200, "happy");
      return;
    }

    // 2nd click: curious glance & questioning remark
    if (burstCount === 2 && !isLocked.current) {
      pixelAudio.play("curious"); // Sound E: Questioning "bip-bip?"
      setEmotion("curious");
      setAnimationId((prev) => prev + 1);
      const msg = CURIOUS_MESSAGES[Math.floor(Math.random() * CURIOUS_MESSAGES.length)];
      speak(msg, "curious", 3200);
      return;
    }

    // 3+ rapid clicks: trigger ANGRY!
    if (burstCount >= 3 && now > angryCooldown.current) {
      isLocked.current = true;
      angryCooldown.current = now + 6000; // 6s cooldown
      clickTimestamps.current = [];

      setEmotion("angry");
      setAnimationId((prev) => prev + 1);
      pixelAudio.play("angry"); // Sound C: Rubbery electronic grumble "brrrp-eep!"
      const msg = ANGRY_MESSAGES[Math.floor(Math.random() * ANGRY_MESSAGES.length)];
      speak(msg, "angry", 3800);

      // Smooth recovery sequence: angry -> confused/pout -> neutral
      if (recoveryTimer.current) window.clearTimeout(recoveryTimer.current);
      recoveryTimer.current = window.setTimeout(() => {
        setEmotion("confused");
        setAnimationId((prev) => prev + 1);
        setTimeout(() => {
          setEmotion("neutral");
          setAnimationId((prev) => prev + 1);
          isLocked.current = false;
        }, 1400);
      }, 3000);
    }
  }, [speak]);

  // ── HOVER REACTIONS ON PIXEL ──
  const handlePixelHover = useCallback(() => {
    if (isLocked.current || isChatOpen) return;
    const rand = Math.random();
    if (rand < 0.5) {
      setEmotion("happy");
      setAnimationId((prev) => prev + 1);
      pixelAudio.play("happy");
    } else {
      setEmotion("playful");
      setAnimationId((prev) => prev + 1);
      pixelAudio.play("click");
    }
  }, [isChatOpen]);

  const handlePixelLeave = useCallback(() => {
    if (isLocked.current || isChatOpen) return;
    setEmotion("neutral");
  }, [isChatOpen]);

  // ── CONTEXT-AWARE SECTION CHANGES ──
  const lastSection = useRef<number>(currentSection);
  useEffect(() => {
    if (currentSection !== lastSection.current) {
      lastSection.current = currentSection;
      if (isLocked.current || isChatOpen) return;

      const greetings = SECTION_GREETINGS[currentSection] || SECTION_GREETINGS[0];
      const pick = greetings[Math.floor(Math.random() * greetings.length)];
      speak(pick.text, pick.emotion, 3600, pick.emotion === "excited" ? "excited" : "happy");
    }
  }, [currentSection, isChatOpen, speak]);

  // ── REACT TO PROJECT CATEGORY (WEB OR MOBILE 3D DECK) ──
  const lastProjectsType = useRef<"web" | "mobile" | null>(null);
  useEffect(() => {
    if (projectsType && projectsType !== lastProjectsType.current) {
      lastProjectsType.current = projectsType;
      if (isLocked.current || isChatOpen) return;

      if (projectsType === "web") {
        speak("5 Web platforms and systems built by Manushka!", "excited", 3800, "excited");
      } else if (projectsType === "mobile") {
        speak("Mobile apps built with React Native & Flutter!", "happy", 3800, "happy");
      }
    } else if (!projectsType) {
      lastProjectsType.current = null;
    }
  }, [projectsType, isChatOpen, speak]);

  // ── IDLE BEHAVIOR ENGINE ──
  useEffect(() => {
    const runIdleCycle = () => {
      if (isLocked.current || isChatOpen || speech) {
        idleTimer.current = window.setTimeout(runIdleCycle, 3000);
        return;
      }

      const roll = Math.random();
      if (roll < 0.35) {
        // Soft smile
        setEmotion("happy");
        setAnimationId((prev) => prev + 1);
        setTimeout(() => setEmotion("neutral"), 1200);
      } else if (roll < 0.55) {
        // Look around playfully
        setEyeLook({ x: (Math.random() - 0.5) * 1.5, y: (Math.random() - 0.5) * 0.8 });
        setTimeout(() => setEyeLook({ x: 0, y: 0 }), 1600);
      } else if (roll < 0.72) {
        // Playful wink
        setEmotion("playful");
        setAnimationId((prev) => prev + 1);
        setTimeout(() => setEmotion("neutral"), 1000);
      } else if (roll < 0.85) {
        // Curious tilt
        setEmotion("curious");
        setAnimationId((prev) => prev + 1);
        setTimeout(() => setEmotion("neutral"), 1400);
      } else {
        // Sleepy slow blink
        setEmotion("sleepy");
        setAnimationId((prev) => prev + 1);
        pixelAudio.play("sleepy"); // Sound H: Soft descending "boooop..."
        setTimeout(() => setEmotion("neutral"), 1800);
      }

      // Schedule next idle action between 4.5s and 8s
      const nextDelay = 4500 + Math.random() * 3500;
      idleTimer.current = window.setTimeout(runIdleCycle, nextDelay);
    };

    idleTimer.current = window.setTimeout(runIdleCycle, 5000);
    return () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [isChatOpen, speech]);

  // ── SPONTANEOUS FUN FACTS (Non-spammy, every 45-65s) ──
  useEffect(() => {
    if (!spontaneousEnabled) return;

    const scheduleFact = () => {
      const delay = 45000 + Math.random() * 20000;
      spontaneousTimer.current = window.setTimeout(() => {
        if (!isLocked.current && !isChatOpen && !speech && spontaneousEnabled) {
          const fact = SPONTANEOUS_FUN_FACTS[Math.floor(Math.random() * SPONTANEOUS_FUN_FACTS.length)];
          speak(fact.text, fact.emotion, 4500, fact.emotion === "excited" ? "excited" : "happy");
        }
        scheduleFact();
      }, delay);
    };

    scheduleFact();
    return () => {
      if (spontaneousTimer.current) window.clearTimeout(spontaneousTimer.current);
    };
  }, [spontaneousEnabled, isChatOpen, speech, speak]);

  return {
    emotion,
    setEmotion,
    animationId,
    onExpressionStart,
    onExpressionComplete,
    onCloudInflate,
    onCloudSettled,
    eyeLook,
    speech,
    isSpeaking,
    spontaneousEnabled,
    setSpontaneousEnabled,
    handlePixelClick,
    handlePixelHover,
    handlePixelLeave,
    speak,
    dismissSpeech,
  };
}
