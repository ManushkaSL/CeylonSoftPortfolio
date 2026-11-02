import React, { useMemo } from "react";
import { motion, AnimatePresence, TargetAndTransition } from "framer-motion";
import { PixelEmotion, PIXEL_EMOTION_COLORS } from "@/types/pixel";

interface PixelCharacterProps {
  emotion: PixelEmotion;
  isSpeaking?: boolean;
  eyeLook?: { x: number; y: number }; // normalized -1 to +1
  size?: number; // size in pixels, default 38
  className?: string;
}

export const PixelCharacter: React.FC<PixelCharacterProps> = ({
  emotion = "neutral",
  isSpeaking = false,
  eyeLook = { x: 0, y: 0 },
  size = 38,
  className = "",
}) => {
  const colors = PIXEL_EMOTION_COLORS[emotion] || PIXEL_EMOTION_COLORS.neutral;

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
          transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" as const },
        };
      case "angry":
        return {
          x: [0, -2, 2, -1.5, 1.5, 0],
          rotate: [-4, 4, -3, 3, 0],
          scaleY: [1, 0.95, 1.03, 1],
          transition: { repeat: Infinity, duration: 0.6, ease: "easeInOut" as const },
        };
      case "dizzy":
        return {
          rotate: [-14, 14, -10, 10, -6, 6, 0],
          y: [-1, 2, -2, 1, 0],
          scaleX: [1, 1.05, 0.95, 1],
          transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" as const },
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
          transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" as const },
        };
      case "sleepy":
        return {
          y: [0, 2, 0],
          rotate: [0, 3, 0],
          scaleY: [1, 0.96, 1],
          transition: { repeat: Infinity, duration: 3.2, ease: "easeInOut" as const },
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
          transition: { repeat: Infinity, duration: 1.6, ease: "easeInOut" as const },
        };
      default:
        return {
          y: [0, -1, 0],
          scaleY: [1, 1.01, 1],
          transition: { repeat: Infinity, duration: 2.8, ease: "easeInOut" as const },
        };
    }
  }, [emotion]);

  // Antenna secondary motion variants
  const antennaVariants = useMemo(() => {
    switch (emotion) {
      case "angry":
        return {
          rotateLeft: [-16, 8, -14, 0],
          rotateRight: [16, -8, 14, 0],
          transition: { repeat: Infinity, duration: 0.5, ease: "easeInOut" as const },
        };
      case "dizzy":
        return {
          rotateLeft: [-20, 20, -15, 0],
          rotateRight: [20, -20, 15, 0],
          transition: { repeat: Infinity, duration: 0.9, ease: "easeInOut" as const },
        };
      case "excited":
        return {
          rotateLeft: [-10, 10, -5, 0],
          rotateRight: [10, -10, 5, 0],
          transition: { repeat: Infinity, duration: 0.7, ease: "easeInOut" as const },
        };
      case "happy":
        return {
          rotateLeft: [-6, 6, 0],
          rotateRight: [6, -6, 0],
          transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" as const },
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
          transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" as const },
        };
    }
  }, [emotion]);

  return (
    <div
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size * 0.92 }}
    >
      <motion.svg
        viewBox="0 0 100 92"
        className="w-full h-full overflow-visible drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        animate={headVariants}
      >
        <defs>
          {/* Facial Visor Glow Filter */}
          <filter id={`pixelGlow-${size}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Visor Gradient with Emotion Colors */}
          <linearGradient id={`visorGrad-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0A1828" />
            <stop offset="100%" stopColor="#020814" />
          </linearGradient>

          {/* Head Shell Metallic Gradient */}
          <linearGradient id={`shellGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0E233E" />
            <stop offset="45%" stopColor="#07172B" />
            <stop offset="100%" stopColor="#030C19" />
          </linearGradient>
        </defs>

        {/* ── LEFT & RIGHT ANTENNAE with Glowing Balls ── */}
        <motion.g
          animate={{ rotate: antennaVariants.rotateLeft }}
          transition={antennaVariants.transition}
          style={{ originX: "34px", originY: "18px" }}
        >
          {/* Left Antenna Stem */}
          <path
            d="M 34 18 Q 30 10 27 5"
            stroke={colors.primary}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left Glowing Tip */}
          <circle
            cx="27"
            cy="5"
            r="3.5"
            fill={colors.accent}
            stroke={colors.primary}
            strokeWidth="1"
            filter={`url(#pixelGlow-${size})`}
          />
        </motion.g>

        <motion.g
          animate={{ rotate: antennaVariants.rotateRight }}
          transition={antennaVariants.transition}
          style={{ originX: "66px", originY: "18px" }}
        >
          {/* Right Antenna Stem */}
          <path
            d="M 66 18 Q 70 10 73 5"
            stroke={colors.primary}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right Glowing Tip */}
          <circle
            cx="73"
            cy="5"
            r="3.5"
            fill={colors.accent}
            stroke={colors.primary}
            strokeWidth="1"
            filter={`url(#pixelGlow-${size})`}
          />
        </motion.g>

        {/* ── HEAD SHELL (Softly Rounded Cartoon Proportions) ── */}
        <rect
          x="14"
          y="14"
          width="72"
          height="62"
          rx="24"
          ry="24"
          fill={`url(#shellGrad-${size})`}
          stroke={colors.primary}
          strokeWidth="1.8"
          strokeOpacity="0.7"
        />

        {/* Shell Top Specular Reflection Highlight */}
        <path
          d="M 28 20 Q 50 16 72 20"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left & Right Ear Studs */}
        <circle cx="12" cy="45" r="3.5" fill="#0A1E35" stroke={colors.primary} strokeWidth="1" />
        <circle cx="88" cy="45" r="3.5" fill="#0A1E35" stroke={colors.primary} strokeWidth="1" />

        {/* ── FACE VISOR PANEL ── */}
        <rect
          x="20"
          y="22"
          width="60"
          height="46"
          rx="18"
          ry="18"
          fill={`url(#visorGrad-${size})`}
          stroke={colors.primary}
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        {/* Visor Interior Ambient Glow */}
        <ellipse
          cx="50"
          cy="45"
          rx="25"
          ry="18"
          fill={colors.glow}
          opacity="0.35"
          filter={`url(#pixelGlow-${size})`}
        />

        {/* ── ROSY ILLUMINATED CHEEKS ── */}
        <motion.ellipse
          cx="28"
          cy="52"
          rx="4.5"
          ry="2.5"
          fill={colors.cheek}
          filter={`url(#pixelGlow-${size})`}
          animate={{
            opacity: emotion === "happy" || emotion === "playful" || emotion === "angry" ? 0.9 : 0.4,
            scale: emotion === "happy" || emotion === "excited" ? 1.25 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.ellipse
          cx="72"
          cy="52"
          rx="4.5"
          ry="2.5"
          fill={colors.cheek}
          filter={`url(#pixelGlow-${size})`}
          animate={{
            opacity: emotion === "happy" || emotion === "playful" || emotion === "angry" ? 0.9 : 0.4,
            scale: emotion === "happy" || emotion === "excited" ? 1.25 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* ── DYNAMIC EXPRESSIVE EYES ── */}
        <g>
          {/* HAPPY: Cute smiling crescents (^ ^) */}
          {emotion === "happy" ? (
            <>
              <path
                d="M 32 44 Q 38 35 44 44"
                stroke={colors.accent}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                filter={`url(#pixelGlow-${size})`}
              />
              <path
                d="M 56 44 Q 62 35 68 44"
                stroke={colors.accent}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                filter={`url(#pixelGlow-${size})`}
              />
            </>
          ) : emotion === "angry" ? (
            /* ANGRY: Adorably angled eyebrows & intense cute narrowed eyes */
            <>
              {/* Inward angled eyebrows */}
              <path
                d="M 30 35 L 45 40"
                stroke={colors.primary}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M 70 35 L 55 40"
                stroke={colors.primary}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              {/* Angry Narrowed Eyes */}
              <ellipse
                cx="38"
                cy="44"
                rx="6"
                ry="4"
                fill={colors.accent}
                filter={`url(#pixelGlow-${size})`}
              />
              <ellipse
                cx="62"
                cy="44"
                rx="6"
                ry="4"
                fill={colors.accent}
                filter={`url(#pixelGlow-${size})`}
              />
              {/* Pupils */}
              <circle cx="39" cy="44" r="2.2" fill="#0A1828" />
              <circle cx="61" cy="44" r="2.2" fill="#0A1828" />
            </>
          ) : emotion === "dizzy" ? (
            /* DIZZY: Swirling crossed spiral eyes */
            <>
              {/* Left X / Spiral */}
              <g transform="translate(38, 42)">
                <line x1="-5" y1="-5" x2="5" y2="5" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
                <line x1="5" y1="-5" x2="-5" y2="5" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
              </g>
              {/* Right X / Spiral */}
              <g transform="translate(62, 42)">
                <line x1="-5" y1="-5" x2="5" y2="5" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
                <line x1="5" y1="-5" x2="-5" y2="5" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
              </g>
            </>
          ) : emotion === "playful" ? (
            /* PLAYFUL: One wink (^), one shining open eye with pupil! */
            <>
              {/* Left Wink */}
              <path
                d="M 32 44 Q 38 36 44 44"
                stroke={colors.accent}
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right Wide Open Eye */}
              <ellipse
                cx="62"
                cy="42"
                rx="7"
                ry="8"
                fill={colors.accent}
                filter={`url(#pixelGlow-${size})`}
              />
              <circle cx={62 + pupilOffsetX} cy={42 + pupilOffsetY} r="4" fill="#051224" />
              <circle cx={60 + pupilOffsetX} cy={40 + pupilOffsetY} r="1.8" fill="#FFFFFF" />
            </>
          ) : emotion === "sleepy" ? (
            /* SLEEPY: Drooping half-closed eyelids */
            <>
              <path
                d="M 31 43 Q 38 48 45 43"
                stroke={colors.accent}
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 55 43 Q 62 48 69 43"
                stroke={colors.accent}
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            /* DEFAULT / CURIOUS / EXCITED / SURPRISED: Large expressive tracking eyes */
            <>
              {/* Left Eye Shell */}
              <ellipse
                cx="38"
                cy="42"
                rx={emotion === "surprised" ? "8" : "7"}
                ry={emotion === "surprised" ? "9" : "8"}
                fill={colors.accent}
                filter={`url(#pixelGlow-${size})`}
              />
              {/* Left Pupil (Tracks Cursor) */}
              <circle
                cx={38 + pupilOffsetX}
                cy={42 + pupilOffsetY}
                r={emotion === "curious" ? "3.6" : "4.2"}
                fill="#041022"
              />
              {/* Left Specular Highlights */}
              <circle
                cx={36 + pupilOffsetX * 0.7}
                cy={40 + pupilOffsetY * 0.7}
                r="1.8"
                fill="#FFFFFF"
              />
              <circle
                cx={40 + pupilOffsetX * 0.7}
                cy={43 + pupilOffsetY * 0.7}
                r="0.9"
                fill="#FFFFFF"
              />

              {/* Right Eye Shell */}
              <ellipse
                cx="62"
                cy="42"
                rx={emotion === "surprised" ? "8" : "7"}
                ry={emotion === "surprised" ? "9" : "8"}
                fill={colors.accent}
                filter={`url(#pixelGlow-${size})`}
              />
              {/* Right Pupil (Tracks Cursor) */}
              <circle
                cx={62 + pupilOffsetX}
                cy={42 + pupilOffsetY}
                r={emotion === "curious" ? "3.6" : "4.2"}
                fill="#041022"
              />
              {/* Right Specular Highlights */}
              <circle
                cx={60 + pupilOffsetX * 0.7}
                cy={40 + pupilOffsetY * 0.7}
                r="1.8"
                fill="#FFFFFF"
              />
              <circle
                cx={64 + pupilOffsetX * 0.7}
                cy={43 + pupilOffsetY * 0.7}
                r="0.9"
                fill="#FFFFFF"
              />

              {/* Curious Eyebrow Lift */}
              {emotion === "curious" && (
                <path
                  d="M 56 31 Q 62 26 68 30"
                  stroke={colors.primary}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </>
          )}
        </g>

        {/* ── EXPRESSIVE MOUTH ── */}
        <g>
          {isSpeaking ? (
            /* Speaking animation mouth (opens & closes softly) */
            <motion.ellipse
              cx="50"
              cy="58"
              rx="4.5"
              fill={colors.accent}
              filter={`url(#pixelGlow-${size})`}
              animate={{ ry: [2, 4.5, 2] }}
              transition={{ repeat: Infinity, duration: 0.28, ease: "easeInOut" }}
            />
          ) : emotion === "happy" || emotion === "excited" ? (
            /* Big Cheerful Smile */
            <path
              d="M 43 55 Q 50 63 57 55"
              stroke={colors.accent}
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
              filter={`url(#pixelGlow-${size})`}
            />
          ) : emotion === "angry" ? (
            /* Cute Pout */
            <path
              d="M 44 59 Q 50 54 56 59"
              stroke={colors.accent}
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
              filter={`url(#pixelGlow-${size})`}
            />
          ) : emotion === "dizzy" ? (
            /* Wobbly Squiggle Mouth */
            <path
              d="M 43 57 Q 46 60 50 57 Q 54 54 57 57"
              stroke={colors.accent}
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
          ) : emotion === "surprised" ? (
            /* Surprised O */
            <ellipse
              cx="50"
              cy="57"
              rx="3.5"
              ry="4.5"
              fill="none"
              stroke={colors.accent}
              strokeWidth="2.4"
              filter={`url(#pixelGlow-${size})`}
            />
          ) : emotion === "thinking" ? (
            /* Thoughtful small line shifted to right */
            <path
              d="M 46 58 Q 51 57 55 58"
              stroke={colors.accent}
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            /* Neutral gentle smile */
            <path
              d="M 45 56 Q 50 59 55 56"
              stroke={colors.accent}
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </g>
      </motion.svg>
    </div>
  );
};
