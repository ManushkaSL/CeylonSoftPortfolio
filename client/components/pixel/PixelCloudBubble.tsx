import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelEmotion } from "@/types/pixel";

interface PixelCloudBubbleProps {
  text: string;
  emotion?: PixelEmotion;
  isVisible: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const PixelCloudBubble: React.FC<PixelCloudBubbleProps> = ({
  text,
  emotion = "neutral",
  isVisible,
  onDismiss,
  className = "",
}) => {
  // Emotion-specific spring bounce variants
  const getSpringConfig = () => {
    switch (emotion) {
      case "angry":
        return { stiffness: 480, damping: 14 }; // Snappy aggressive pop
      case "dizzy":
        return { stiffness: 260, damping: 12 }; // Wobbly bouncy pop
      case "excited":
        return { stiffness: 400, damping: 15 };
      default:
        return { stiffness: 340, damping: 18 }; // Soft cartoon pop
    }
  };

  const spring = getSpringConfig();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="pixel-cloud"
          initial={{ scale: 0.1, opacity: 0, x: -12, y: 10 }}
          animate={{
            scale: [0.1, 1.06, 0.98, 1],
            opacity: 1,
            x: 0,
            y: 0,
            rotate: emotion === "dizzy" ? [-3, 3, -1, 0] : emotion === "angry" ? [-2, 2, 0] : [0, 0],
          }}
          exit={{ scale: 0.35, opacity: 0, x: -8, transition: { duration: 0.2, ease: "easeIn" } }}
          transition={{
            type: "spring",
            stiffness: spring.stiffness,
            damping: spring.damping,
            duration: 0.42,
          }}
          onClick={onDismiss}
          // Positioned higher up (-top-14) so it sits directly above and beside Pixel's head
          className={`absolute left-full ml-3 -top-14 pointer-events-auto cursor-pointer z-50 select-none ${className}`}
          style={{
            filter: "drop-shadow(0 8px 24px rgba(0, 238, 255, 0.35)) drop-shadow(0 4px 14px rgba(0, 0, 0, 0.75))",
          }}
          role="status"
          aria-live="polite"
        >
          {/* ── GENUINE 2D CARTOON CLOUD (BLACK / DARK BACKGROUND) ── */}
          <div className="relative min-w-[220px] max-w-[290px]">
            {/* SVG Single Unified Closed Path Cloud - ZERO overlapping internal circle lines! */}
            <svg
              viewBox="0 0 260 125"
              preserveAspectRatio="none"
              className="w-full h-auto overflow-visible"
              style={{ minHeight: "95px" }}
            >
              <defs>
                {/* Dark Black / Deep Navy Background Gradient */}
                <linearGradient id="cloudDarkBg" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#051428" />
                  <stop offset="60%" stopColor="#030A17" />
                  <stop offset="100%" stopColor="#01050D" />
                </linearGradient>

                {/* Electric Cyan Glowing Border Gradient */}
                <linearGradient id="cloudCyanBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00EEFF" />
                  <stop offset="50%" stopColor="#00A8E8" />
                  <stop offset="100%" stopColor="#00EEFF" />
                </linearGradient>
              </defs>

              {/* ── SINGLE UNIFIED 2D CLOUD SILHOUETTE ── */}
              {/* One continuous closed vector path creating clean puffy lobes with no inner cuts */}
              <path
                d="M 45 84
                   C 65 94, 98 94, 118 86
                   C 138 95, 178 95, 198 84
                   C 218 90, 238 78, 240 60
                   C 256 46, 252 28, 232 18
                   C 222 3, 192 -2, 172 10
                   C 152 -5, 112 -5, 92 10
                   C 72 -2, 45 6, 36 22
                   C 16 30, 12 50, 28 66
                   C 24 78, 36 86, 45 84 Z"
                fill="url(#cloudDarkBg)"
                stroke="url(#cloudCyanBorder)"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />

              {/* Soft interior upper cyan accent light */}
              <path
                d="M 50 30 Q 130 6 210 24"
                stroke="rgba(0, 238, 255, 0.28)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />

              {/* ── BUBBLE DROPLET TAIL (Descending towards Pixel on the left) ── */}
              <circle
                cx="26"
                cy="92"
                r="6.5"
                fill="url(#cloudDarkBg)"
                stroke="url(#cloudCyanBorder)"
                strokeWidth="1.6"
              />
              <circle
                cx="14"
                cy="102"
                r="4.2"
                fill="url(#cloudDarkBg)"
                stroke="url(#cloudCyanBorder)"
                strokeWidth="1.4"
              />
              <circle
                cx="3"
                cy="110"
                r="2.5"
                fill="url(#cloudDarkBg)"
                stroke="url(#cloudCyanBorder)"
                strokeWidth="1.2"
              />
            </svg>

            {/* ── CRISP ICE-WHITE TEXT CONTENT SAFELY CENTERED ── */}
            <div className="absolute inset-0 flex items-center justify-center px-6 py-2 pb-5 text-center">
              <motion.p
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.22 }}
                className="text-[#EAFBFF] font-sans font-medium text-xs sm:text-[12.5px] leading-snug select-none tracking-normal break-words"
                style={{
                  textShadow: "0 0 10px rgba(0, 238, 255, 0.4), 0 1px 3px rgba(0, 0, 0, 0.9)",
                  maxWidth: "215px",
                }}
              >
                {text}
              </motion.p>
            </div>

            {/* Tiny playful cyan sparkle when excited/happy */}
            {(emotion === "excited" || emotion === "happy") && (
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 1.2, 0.9, 1], rotate: [0, 45, 90] }}
                transition={{ duration: 0.5 }}
                className="absolute top-1 right-3 text-cyan-300 text-xs pointer-events-none select-none drop-shadow-[0_0_8px_#00EEFF]"
              >
                ✦
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
