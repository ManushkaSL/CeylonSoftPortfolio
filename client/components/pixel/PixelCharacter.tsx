import React, { useEffect, useId, useMemo, useRef } from "react";
import {
  motion,
  TargetAndTransition,
  useAnimationControls,
} from "framer-motion";
import { PixelEmotion, PIXEL_EMOTION_COLORS } from "@/types/pixel";
import { PIXEL_HAPPY_BEAT } from "@/utils/pixelSoundDesign";

interface PixelCharacterProps {
  emotion: PixelEmotion;
  isSpeaking?: boolean;
  eyeLook?: { x: number; y: number }; // normalized -1 to +1
  size?: number;
  className?: string;
  animationId?: number;
  onExpressionStart?: (emotion: PixelEmotion, id: number) => void;
  onExpressionComplete?: (emotion: PixelEmotion, id: number) => void;
}

export const PixelCharacter: React.FC<PixelCharacterProps> = ({
  emotion = "neutral",
  isSpeaking = false,
  eyeLook = { x: 0, y: 0 },
  size = 48,
  className = "",
  animationId = 0,
  onExpressionStart,
  onExpressionComplete,
}) => {
  const colors = PIXEL_EMOTION_COLORS[emotion] || PIXEL_EMOTION_COLORS.neutral;
  const id = useId().replace(/:/g, "");
  const controls = useAnimationControls();
  const announcedAnimation = useRef<number | null>(null);

  // Eye look constraints
  const pupilOffsetX = Math.max(-3.5, Math.min(3.5, eyeLook.x * 3.5));
  const pupilOffsetY = Math.max(-2.5, Math.min(2.5, eyeLook.y * 2.5));

  // Emotion-specific head animation variants (Squash & Stretch, Wobble, Tilt)
  const headVariants = useMemo<TargetAndTransition>(() => {
    switch (emotion) {
      case "happy":
        return {
          y: [0, -3, 0],
          scaleY: [1, 1.08, 0.96, 1],
          scaleX: [1, 0.94, 1.04, 1],
          rotate: [0, -2, 2, 0],
          transition: {
            repeat: Infinity,
            duration: 1.8,
            ease: "easeInOut" as const,
          },
        };
      case "angry":
        return {
          x: [0, -2, 2, -1.5, 1.5, 0],
          rotate: [-4, 4, -3, 3, 0],
          scaleY: [1, 0.95, 1.03, 1],
          transition: {
            repeat: Infinity,
            duration: 0.6,
            ease: "easeInOut" as const,
          },
        };
      case "dizzy":
        return {
          rotate: [-14, 14, -10, 10, -6, 6, 0],
          y: [-1, 2, -2, 1, 0],
          scaleX: [1, 1.05, 0.95, 1],
          transition: {
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut" as const,
          },
        };
      case "curious":
        return {
          rotate: -8,
          y: -1.5,
          scaleY: 1.04,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        };
      case "excited":
        return {
          y: [0, -4, 0],
          scaleY: [1, 1.12, 0.92, 1],
          scaleX: [1, 0.9, 1.06, 1],
          transition: {
            repeat: Infinity,
            duration: 0.8,
            ease: "easeInOut" as const,
          },
        };
      case "sleepy":
        return {
          y: [0, 2, 0],
          rotate: [0, 3, 0],
          scaleY: [1, 0.96, 1],
          transition: {
            repeat: Infinity,
            duration: 3.2,
            ease: "easeInOut" as const,
          },
        };
      case "thinking":
        return {
          rotate: 6,
          y: -1,
          transition: { type: "spring", stiffness: 250, damping: 22 },
        };
      case "surprised":
        return {
          y: -3,
          scaleY: 1.12,
          scaleX: 0.92,
          transition: { type: "spring", stiffness: 450, damping: 15 },
        };
      case "playful":
        return {
          rotate: [-4, 4, 0],
          scaleY: [1, 1.05, 1],
          transition: {
            repeat: Infinity,
            duration: 1.6,
            ease: "easeInOut" as const,
          },
        };
      default:
        return {
          y: [0, -1, 0],
          scaleY: [1, 1.01, 1],
          transition: {
            repeat: Infinity,
            duration: 2.8,
            ease: "easeInOut" as const,
          },
        };
    }
  }, [emotion]);

  useEffect(() => {
    if (!onExpressionStart) return;
    let cancelled = false;
    const lively = [
      "happy",
      "excited",
      "angry",
      "dizzy",
      "sleepy",
      "playful",
    ].includes(emotion);
    const duration =
      emotion === "happy"
        ? PIXEL_HAPPY_BEAT * 2
        : emotion === "excited"
          ? 0.44
          : emotion === "dizzy"
            ? 0.63
            : emotion === "sleepy"
              ? 0.58
              : 0.47;
    const entrance: TargetAndTransition = lively
      ? {
          ...headVariants,
          transition: { duration, repeat: 0, ease: "easeInOut" },
        }
      : headVariants;
    // The happy cue and the actual first bounce share the same 170ms beat.
    // Continuous idle motion resumes afterwards without repeating any sound.
    void controls.start(entrance).then(() => {
      if (cancelled) return;
      onExpressionComplete?.(emotion, animationId);
      if (lively) void controls.start(headVariants);
    });
    return () => {
      cancelled = true;
      controls.stop();
    };
  }, [
    emotion,
    animationId,
    headVariants,
    controls,
    onExpressionStart,
    onExpressionComplete,
  ]);

  // Antenna secondary motion variants
  const antennaVariants = useMemo(() => {
    switch (emotion) {
      case "angry":
        return {
          rotateLeft: [-16, 8, -14, 0],
          rotateRight: [16, -8, 14, 0],
          transition: {
            repeat: Infinity,
            duration: 0.5,
            ease: "easeInOut" as const,
          },
        };
      case "dizzy":
        return {
          rotateLeft: [-20, 20, -15, 0],
          rotateRight: [20, -20, 15, 0],
          transition: {
            repeat: Infinity,
            duration: 0.9,
            ease: "easeInOut" as const,
          },
        };
      case "excited":
        return {
          rotateLeft: [-10, 10, -5, 0],
          rotateRight: [10, -10, 5, 0],
          transition: {
            repeat: Infinity,
            duration: 0.7,
            ease: "easeInOut" as const,
          },
        };
      case "happy":
        return {
          rotateLeft: [-6, 6, 0],
          rotateRight: [6, -6, 0],
          transition: {
            repeat: Infinity,
            duration: 1.8,
            ease: "easeInOut" as const,
          },
        };
      case "surprised":
        return {
          rotateLeft: [-16, 4, -8, 0],
          rotateRight: [16, -4, 8, 0],
          transition: { type: "spring" as const, stiffness: 450, damping: 10 },
        };
      default:
        return {
          rotateLeft: [-2, 2, 0],
          rotateRight: [2, -2, 0],
          transition: {
            repeat: Infinity,
            duration: 2.5,
            ease: "easeInOut" as const,
          },
        };
    }
  }, [emotion]);

  // Matching cubic segments let the eyes and mouth morph between every expression.
  const openEye = "M -9 0 C -9 -14 9 -14 9 0 C 9 14 -9 14 -9 0 Z";
  const smileEye = "M -9 1 C -7 -8 7 -8 9 1 C 6 -3 -6 -3 -9 1 Z";
  const sleepyEye = "M -9 0 C -4 3 4 3 9 0 C 5 7 -5 7 -9 0 Z";
  const angryEye = "M -9 -3 C -3 -2 4 1 9 2 C 7 11 -9 9 -9 -3 Z";
  const leftEye =
    emotion === "happy" || emotion === "playful"
      ? smileEye
      : emotion === "sleepy"
        ? sleepyEye
        : emotion === "angry"
          ? angryEye
          : openEye;
  const rightEye =
    emotion === "happy"
      ? smileEye
      : emotion === "sleepy"
        ? sleepyEye
        : emotion === "angry"
          ? "M -9 2 C -4 1 3 -2 9 -3 C 9 9 -7 11 -9 2 Z"
          : openEye;
  const hasPupils = !["happy", "sleepy", "dizzy"].includes(emotion);
  const mouth =
    emotion === "angry"
      ? "M 43 66 C 47 61 53 61 57 66"
      : emotion === "dizzy"
        ? "M 41 63 C 46 72 53 57 59 65"
        : emotion === "thinking" || emotion === "confused"
          ? "M 46 65 C 49 63 53 64 57 64"
          : emotion === "happy" || emotion === "excited"
            ? "M 41 61 C 45 71 55 71 59 61"
            : "M 43 63 C 47 68 53 68 57 63";

  return (
    <div
      className={`pixel-character relative flex shrink-0 select-none items-center justify-center ${className}`}
      data-emotion={emotion}
      style={{ width: size, height: size * 0.92 }}
    >
      <motion.svg
        viewBox="0 0 100 92"
        className="h-full w-full overflow-visible [&_stop]:transition-[stop-color] [&_stop]:duration-500"
        animate={onExpressionStart ? controls : headVariants}
        onAnimationStart={() => {
          if (announcedAnimation.current !== animationId) {
            announcedAnimation.current = animationId;
            onExpressionStart?.(emotion, animationId);
          }
        }}
        role="img"
        aria-label={`Pixel feeling ${emotion}`}
      >
        <defs>
          <linearGradient
            id={`${id}-shell`}
            x1="12%"
            y1="0%"
            x2="80%"
            y2="100%"
          >
            <stop offset="0%" stopColor={colors.accent} />
            <stop offset="52%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
          <linearGradient id={`${id}-face`} x1="0%" y1="0%" x2="20%" y2="100%">
            <stop offset="0%" stopColor="#126B80" />
            <stop offset="100%" stopColor="#073C58" />
          </linearGradient>
          <linearGradient
            id={`${id}-reflection`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Solid, bright shapes carry the silhouette even with every shadow disabled. */}
        {(["left", "right"] as const).map((side) => (
          <motion.g
            key={side}
            animate={{
              rotate:
                side === "left"
                  ? antennaVariants.rotateLeft
                  : antennaVariants.rotateRight,
            }}
            transition={antennaVariants.transition}
            style={{
              originX: side === "left" ? "31px" : "69px",
              originY: "23px",
            }}
          >
            <motion.path
              d={
                side === "left"
                  ? "M 31 23 Q 27 15 24 9"
                  : "M 69 23 Q 73 15 76 9"
              }
              animate={{ stroke: colors.primary }}
              transition={{ duration: 0.5 }}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <motion.circle
              cx={side === "left" ? 24 : 76}
              cy="8"
              r="4.5"
              animate={{ fill: colors.secondary, stroke: colors.accent }}
              transition={{ duration: 0.5 }}
              strokeWidth="1.7"
            />
            <circle
              cx={side === "left" ? 23 : 75}
              cy="6.5"
              r="1.3"
              fill="#FFFFFF"
            />
          </motion.g>
        ))}

        {/* Mint ear cushions and a generous, rounded cyan shell. */}
        <motion.rect
          x="2"
          y="40"
          width="13"
          height="23"
          rx="6.5"
          animate={{ fill: colors.secondary, stroke: colors.accent }}
          transition={{ duration: 0.5 }}
          strokeWidth="1.5"
        />
        <motion.rect
          x="85"
          y="40"
          width="13"
          height="23"
          rx="6.5"
          animate={{ fill: colors.secondary, stroke: colors.accent }}
          transition={{ duration: 0.5 }}
          strokeWidth="1.5"
        />
        <rect
          x="9"
          y="20"
          width="82"
          height="64"
          rx="25"
          fill={`url(#${id}-shell)`}
          stroke="#D9FFF9"
          strokeWidth="1.4"
        />
        <path
          d="M 23 30 C 32 23 59 23 71 27"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.8"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect
          x="16"
          y="29"
          width="68"
          height="46"
          rx="18"
          fill={`url(#${id}-face)`}
          stroke="#064759"
          strokeWidth="1.2"
        />
        <path
          d="M 22 45 C 21 30 46 31 65 33 C 48 33 30 39 22 45 Z"
          fill={`url(#${id}-reflection)`}
        />

        {/* Cheeks are lit with color, without blurring the eyes or mouth. */}
        {[25, 75].map((x) => (
          <motion.ellipse
            key={x}
            cx={x}
            cy="60"
            rx="5"
            ry="3"
            animate={{
              fill: colors.cheek,
              opacity: emotion === "angry" ? 1 : 0.85,
              scale: emotion === "happy" || emotion === "excited" ? 1.12 : 1,
            }}
            transition={{ duration: 0.5 }}
          />
        ))}

        {/* Wide eyes, dark tracking pupils and crisp highlights stay readable at 1x. */}
        {[36, 64].map((x, index) => (
          <g key={x} transform={`translate(${x} 47)`}>
            <motion.path
              initial={false}
              animate={{
                d: index === 0 ? leftEye : rightEye,
                fill: colors.accent,
                opacity: emotion === "dizzy" ? 0 : 1,
                scaleY:
                  emotion === "surprised"
                    ? 1.12
                    : emotion === "curious" && index === 1
                      ? 1.08
                      : 1,
              }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            />
            <motion.g
              animate={{
                x: pupilOffsetX,
                y: pupilOffsetY,
                opacity:
                  hasPupils && !(emotion === "playful" && index === 0) ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
            >
              <circle cy="0.5" r="4.8" fill="#052A43" />
              <circle cx="-1.7" cy="-2" r="1.9" fill="#FFFFFF" />
              <circle cx="1.6" cy="2" r="0.9" fill="#B6FFF2" />
            </motion.g>
            <motion.path
              d="M -6 -6 L 6 6 M 6 -6 L -6 6"
              fill="none"
              stroke="#F7F0FF"
              strokeWidth="3.4"
              strokeLinecap="round"
              animate={{ opacity: emotion === "dizzy" ? 1 : 0 }}
              transition={{ duration: 0.25 }}
            />
          </g>
        ))}

        <motion.path
          d="M 25 35 Q 31 30 39 33 M 61 33 Q 69 28 75 32"
          fill="none"
          stroke="#C6F9FF"
          strokeWidth="2.4"
          strokeLinecap="round"
          animate={{
            opacity: emotion === "curious" || emotion === "confused" ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          d="M 25 35 L 42 40 M 75 35 L 58 40"
          fill="none"
          stroke="#FFD6D3"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ opacity: emotion === "angry" ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <motion.path
          initial={false}
          fill="none"
          strokeWidth="2.8"
          strokeLinecap="round"
          animate={{
            d: mouth,
            stroke: colors.accent,
            opacity: isSpeaking || emotion === "surprised" ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        />
        <motion.ellipse
          cx="50"
          cy="64"
          rx="4.5"
          fill="#EAFFFF"
          animate={{
            opacity: isSpeaking || emotion === "surprised" ? 1 : 0,
            ry: isSpeaking ? [2.5, 5, 2.5] : 4.5,
          }}
          transition={{
            ry: {
              repeat: isSpeaking ? Infinity : 0,
              duration: 0.3,
              ease: "easeInOut",
            },
            opacity: { duration: 0.2 },
          }}
        />
        <rect x="43" y="78" width="14" height="2.5" rx="1.25" fill="#E3FFF7" />
      </motion.svg>
    </div>
  );
};
