import React, { useEffect, useRef, useState } from "react";

interface HeroSectionProps {
  isActive: boolean;
  onExploreClick: () => void;
}

const HEADING_WORDS = ["WE", "BUILD", "DIGITAL", "EXPERIENCES"];
const SUBTITLE_TEXT = "Where Performance Meets Design.";

export const HeroSection: React.FC<HeroSectionProps> = ({ isActive, onExploreClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  // Left & Right Conic and Linear elements for the signature dual fan spotlights
  const leftConicRef = useRef<HTMLDivElement>(null);
  const rightConicRef = useRef<HTMLDivElement>(null);
  const leftLinearRef = useRef<HTMLDivElement>(null);
  const rightLinearRef = useRef<HTMLDivElement>(null);

  // Center convergence atmospheric bloom
  const centerBloomRef = useRef<HTMLDivElement>(null);
  const atmGlowRef = useRef<HTMLDivElement>(null);

  // Mouse normalized coordinates (0 to 1)
  const mouseNorm = useRef({ x: 0.5, y: 0.45 });
  const isHoveringHero = useRef(false);

  // State for subtitle proximity illumination
  const [subtitleProximity, setSubtitleProximity] = useState<{ [key: number]: number }>({});

  // Detect reduced motion
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(motionQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    motionQuery.addEventListener("change", handler);
    return () => motionQuery.removeEventListener("change", handler);
  }, []);

  // ── SIGNATURE DUAL SPOTLIGHT FAN ANIMATION ──
  // 1. On load: lights start spread wide (~250° / 180°+ wash) and smoothly focus down to fan beam (~165°) over 2.8s.
  // 2. The bottom baseline is locked permanently to a PERFECT straight horizontal line (from 270deg at 50% 50%).
  // 3. Mouse hovering does NOT change, tilt, or alter the bottom line of the light in any way.
  // 4. Color theme: Electric Cyan (#00EEFF), Vibrant Blue (#0077B6, #0096C7), Deep Navy Blue (#020817, #041028, #081E46).
  useEffect(() => {
    if (!isActive) return;

    const lc = leftConicRef.current;
    const rc = rightConicRef.current;
    const ll = leftLinearRef.current;
    const rl = rightLinearRef.current;
    const cb = centerBloomRef.current;
    const ag = atmGlowRef.current;

    if (!lc || !rc || !ll || !rl) return;

    const t0 = Date.now();
    const loadDur = 2800; // 2.8s entrance spread -> focus
    const startArc = 250; // Wide open spread (~180°+ wash across the screen)
    const endArc = 165;   // Focused fan beam
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 2.2);

    let animFrame: number;

    const tick = () => {
      const now = Date.now();
      const elapsed = now - t0;
      const loadProgress = Math.min(1, elapsed / loadDur);
      const easedProgress = easeOut(loadProgress);

      // Arc narrows from wide spread (250) to focused beam (165)
      // NOTE: Strictly driven by load progress. Mouse hover does NOT touch or distort the arc or bottom line!
      const arc = startArc + (endArc - startArc) * easedProgress;

      // Color stops calculation
      const c20 = (arc * 0.22).toFixed(1);
      const c55 = (arc * 0.55).toFixed(1);
      const c80 = (arc * 0.82).toFixed(1);
      const navyL = Math.round(18 + easedProgress * 6);

      // from 270deg at 50% 50%:
      // 270deg is 100% flat horizontal pointing directly along Y = 50%.
      // Left has scaleX(-1), so both meeting rays form a SINGLE, mathematically seamless, razor-sharp horizontal line!
      const conic = `conic-gradient(from 270deg at 50% 50%, #E0F7FF 0.2deg, #00EEFF ${c20}deg, #0077B6 ${c55}deg, hsl(218,80%,${navyL}%) ${c80}deg, #020817 ${arc.toFixed(
        1
      )}deg, #020817 360deg)`;

      const linearMask = `linear-gradient(180deg, #020817 0%, rgba(2,8,23,0.12) 40%, rgba(2,8,23,0.92) 100%)`;

      lc.style.background = conic;
      rc.style.background = conic;
      ll.style.background = linearMask;
      rl.style.background = linearMask;

      // Center Convergence Atmospheric Bloom
      if (cb) {
        const opacity = (0.28 * (0.7 + easedProgress * 0.3)).toFixed(3);
        cb.style.background = `radial-gradient(ellipse 85% 55% at 50% 44%, rgba(0, 238, 255, ${opacity}) 0%, rgba(0, 119, 182, 0.16) 40%, rgba(4, 18, 48, 0.6) 70%, transparent 85%)`;
      }

      // Soft atmospheric background haze
      if (ag) {
        ag.style.background = `radial-gradient(circle 520px at 50% 45%, rgba(0, 238, 255, 0.08) 0%, rgba(0, 119, 182, 0.05) 45%, transparent 75%)`;
      }

      if (loadProgress < 1) {
        animFrame = requestAnimationFrame(tick);
      }
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [isActive]);

  // Handle mouse move across Hero section
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const normY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    mouseNorm.current = { x: normX, y: normY };
    isHoveringHero.current = true;
  };

  const handleHeroMouseLeave = () => {
    isHoveringHero.current = false;
    mouseNorm.current = { x: 0.5, y: 0.45 };
  };

  // ── Interactive Subtitle: Proximity Cyan Illumination ──
  const handleSubtitleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const subtitle = subtitleRef.current;
    if (!subtitle) return;

    const newProximity: { [key: number]: number } = {};
    const charElements = subtitle.querySelectorAll<HTMLElement>("[data-sub-idx]");

    charElements.forEach((el) => {
      const idx = parseInt(el.getAttribute("data-sub-idx") || "0", 10);
      const charRect = el.getBoundingClientRect();
      const charCenterX = charRect.left + charRect.width / 2;
      const dist = Math.abs(e.clientX - charCenterX);

      if (dist < 75) {
        const factor = Math.cos((dist / 75) * (Math.PI / 2));
        newProximity[idx] = Math.max(0, factor);
      } else {
        newProximity[idx] = 0;
      }
    });

    setSubtitleProximity(newProximity);
  };

  const handleSubtitleMouseLeave = () => {
    setSubtitleProximity({});
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
      style={{
        background:
          "radial-gradient(ellipse 100% 85% at 50% 45%, #081E46 0%, #041028 50%, #020817 100%)",
      }}
    >
      {/* ── Wide Symmetrical Dual Conic Fan Spotlights ── */}
      {/* Center 50% 50% with height 100% ensures the 270deg ray is strictly at Y = 50% */}
      <div
        ref={leftConicRef}
        className="absolute inset-y-0 left-0 w-1/2 pointer-events-none z-[1]"
        style={{
          transform: "scaleX(-1)",
          willChange: "background",
        }}
        aria-hidden="true"
      />
      <div
        ref={rightConicRef}
        className="absolute inset-y-0 right-0 w-1/2 pointer-events-none z-[1]"
        style={{
          willChange: "background",
        }}
        aria-hidden="true"
      />

      {/* Layered Vertical Linear Darkening Masks */}
      <div
        ref={leftLinearRef}
        className="absolute inset-y-0 left-0 w-1/2 pointer-events-none z-[2]"
        aria-hidden="true"
      />
      <div
        ref={rightLinearRef}
        className="absolute inset-y-0 right-0 w-1/2 pointer-events-none z-[2]"
        aria-hidden="true"
      />

      {/* ── Central Atmospheric Convergence Bloom Behind Heading ── */}
      <div
        ref={centerBloomRef}
        className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen max-w-[1400px] h-[340px] pointer-events-none z-[2] blur-[55px] will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 85% 55% at 50% 44%, rgba(0, 238, 255, 0.25) 0%, rgba(0, 119, 182, 0.16) 40%, rgba(4, 18, 48, 0.6) 70%, transparent 85%)",
          mixBlendMode: "screen",
        }}
        aria-hidden="true"
      />

      {/* ── Soft Atmospheric Ambient Glow ── */}
      <div
        ref={atmGlowRef}
        className="absolute inset-0 pointer-events-none z-[2] transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(circle 520px at 50% 45%, rgba(0, 238, 255, 0.08) 0%, rgba(0, 119, 182, 0.05) 45%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* ── PERFECT RAZOR-SHARP HORIZONTAL HORIZON LINE ── */}
      {/* Placed at top-1/2 -translate-y-1/2 (50% Y), precisely matching the 270deg spotlight baseline */}
      <div
        className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-[1.5px] pointer-events-none z-[3]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0, 238, 255, 0.3) 15%, #00EEFF 50%, rgba(0, 238, 255, 0.3) 85%, transparent 100%)",
          boxShadow: "0 0 10px rgba(0, 238, 255, 0.5)",
        }}
        aria-hidden="true"
      />

      {/* ── Soft Atmospheric Ambient Floor Reflection (Blends into dark navy) ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 70% 30% at 50% 100%, rgba(0, 238, 255, 0.07) 0%, rgba(0, 119, 182, 0.04) 45%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      {/* ── Main Hero Content ── */}
      <div
        className="relative flex flex-col items-center text-center px-4 w-full z-10"
        style={{
          transform: "translateY(-65px)",
          animation: "heroZoomIn 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
        }}
      >
        {/* ── Main Heading: Clean, Reliable Plain Text ── */}
        <h1
          className="leading-tight select-none cursor-default"
          style={{
            fontFamily: "'Italiana', serif",
            fontSize: "clamp(2.5rem, 8.5vw, 5.8rem)",
            maxWidth: "1200px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.28em",
          }}
        >
          {HEADING_WORDS.map((word) => (
            <span
              key={word}
              style={{
                background: "linear-gradient(180deg, #FFFFFF 15%, #E2F5FF 55%, #88E2FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
                filter:
                  "drop-shadow(0 0 20px rgba(0, 200, 225, 0.35)) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.95))",
                WebkitTextStrokeWidth: "1px",
                WebkitTextStrokeColor: "rgba(255, 255, 255, 0.4)",
                letterSpacing: "0.03em",
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* ── Interactive Subtitle: Proximity Cyan Illumination ── */}
        <div
          ref={subtitleRef}
          onMouseMove={handleSubtitleMouseMove}
          onMouseLeave={handleSubtitleMouseLeave}
          data-cursor="crosshair"
          className="mt-6 cursor-default py-1 px-4 rounded-lg select-none"
          style={{
            fontFamily: "'Jersey 10', sans-serif",
            fontSize: "clamp(1.15rem, 2.5vw, 2.3rem)",
            letterSpacing: "0.18em",
          }}
        >
          {SUBTITLE_TEXT.split("").map((char, idx) => {
            const proximity = subtitleProximity[idx] || 0;
            const isSpace = char === " ";

            if (isSpace) {
              return <span key={idx}>&nbsp;</span>;
            }

            // Interpolate color from muted ice-blue to vibrant cyan highlight
            const color =
              proximity > 0
                ? `rgba(${Math.round(213 - proximity * 98)}, ${Math.round(
                    235 + proximity * 3
                  )}, 255, ${0.75 + proximity * 0.25})`
                : "#D5EBF8";

            const glow =
              proximity > 0
                ? `0 0 ${Math.round(14 + proximity * 12)}px rgba(0, 238, 255, ${
                    0.4 + proximity * 0.5
                  }), 0 2px 8px rgba(0,0,0,0.9)`
                : "0 0 14px rgba(0, 200, 225, 0.35), 0 2px 8px rgba(0,0,0,0.9)";

            return (
              <span
                key={idx}
                data-sub-idx={idx}
                className="inline-block transition-colors duration-200 ease-out"
                style={{
                  color,
                  textShadow: glow,
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Small Description with Minimal Hover Treatment ── */}
      <p className="absolute z-10 bottom-14 text-center px-4 text-slate-400 hover:text-cyan-200 hover:drop-shadow-[0_0_12px_rgba(0,238,255,0.3)] font-sans tracking-wide text-xs sm:text-sm md:text-base select-none transition-colors duration-400 ease-out cursor-default">
        Mobile Applications &amp; Web Systems Built for Modern Businesses.
      </p>

      {/* ── Scroll Indicator Prompt (Explore CTA) ── */}
      <div
        data-cursor="pointer"
        className="absolute left-1/2 z-20 flex flex-col items-center gap-1 cursor-pointer group"
        onClick={onExploreClick}
        style={{
          bottom: "0.9rem",
          transform: "translateX(-50%)",
          animation: "bounce 1.6s ease-in-out infinite",
        }}
      >
        <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-400/80 uppercase group-hover:text-cyan-300 transition-colors">
          EXPLORE
        </span>
        <div
          style={{
            width: 14,
            height: 14,
            borderRight: "1.5px solid #00EEFF",
            borderBottom: "1.5px solid #00EEFF",
            transform: "rotate(45deg)",
            opacity: 0.75,
          }}
        />
      </div>

      {/* ── Minimal Laser Sensor Corner Reticles (Cyan/Navy Framing) ── */}
      <div className="absolute top-6 left-6 w-3 h-3 border-t border-l border-cyan-400/40 pointer-events-none" />
      <div className="absolute top-6 right-6 w-3 h-3 border-t border-r border-cyan-400/40 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-3 h-3 border-b border-l border-cyan-400/40 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-cyan-400/40 pointer-events-none" />
    </div>
  );
};
