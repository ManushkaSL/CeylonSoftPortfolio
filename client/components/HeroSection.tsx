import React, { useEffect, useRef, useState, useMemo } from "react";

interface HeroSectionProps {
  isActive: boolean;
  onExploreClick: () => void;
}

const HEADING_WORDS = ["WE", "BUILD", "DIGITAL", "EXPERIENCES"];

// Subtitle character definitions preserving original spacing
const SUBTITLE_TEXT = "Where Performance Meets Design.";

export const HeroSection: React.FC<HeroSectionProps> = ({ isActive, onExploreClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  // Spotlight and atmospheric animation references
  const svgRef = useRef<SVGSVGElement>(null);
  const leftBeamPathRef = useRef<SVGPathElement>(null);
  const rightBeamPathRef = useRef<SVGPathElement>(null);
  const centerBloomRef = useRef<SVGEllipseElement>(null);
  const atmGlowRef = useRef<HTMLDivElement>(null);
  const parallaxHeadingRef = useRef<HTMLDivElement>(null);

  // Heading reflection overlay ref
  const headingReflectionRef = useRef<HTMLDivElement>(null);

  // Mouse normalized coordinates (0 to 1)
  const mouseNorm = useRef({ x: 0.5, y: 0.45 });
  const mouseScreen = useRef({ x: 0, y: 0 });
  const isHoveringHero = useRef(false);
  const isHoveringHeading = useRef(false);

  // Lerped spotlight physics state
  const focusState = useRef({
    currentX: 50,
    currentY: 44,
    targetX: 50,
    targetY: 44,
    currentIntensity: 1.0,
    targetIntensity: 1.0,
    currentAtmX: 50,
    currentAtmY: 45,
    targetAtmX: 50,
    targetAtmY: 45,
    headingParallaxX: 0,
    headingParallaxY: 0,
  });

  // State for character lifts in heading (character index -> lift in px)
  const [charLifts, setCharLifts] = useState<{ [key: string]: number }>({});
  // State for character illuminations in subtitle (character index -> 0 to 1 intensity)
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

  // Main 60fps lerp loop for spotlight convergence, volumetric beams, and atmospheric depth
  useEffect(() => {
    if (!isActive) return;

    let animFrame: number;

    const tick = () => {
      const state = focusState.current;
      const lerpSpeed = isReducedMotion ? 1 : 0.055;
      const atmSpeed = isReducedMotion ? 1 : 0.035;

      // Lerp spotlight convergence focus point
      state.currentX += (state.targetX - state.currentX) * lerpSpeed;
      state.currentY += (state.targetY - state.currentY) * lerpSpeed;
      state.currentIntensity += (state.targetIntensity - state.currentIntensity) * lerpSpeed;

      // Lerp atmospheric glow position
      state.currentAtmX += (state.targetAtmX - state.currentAtmX) * atmSpeed;
      state.currentAtmY += (state.targetAtmY - state.currentAtmY) * atmSpeed;

      // Parallax offsets (max 3px for heading, disabled if reduced motion)
      const targetParallaxX = isReducedMotion ? 0 : (mouseNorm.current.x - 0.5) * 6;
      const targetParallaxY = isReducedMotion ? 0 : (mouseNorm.current.y - 0.5) * 4;
      state.headingParallaxX += (targetParallaxX - state.headingParallaxX) * lerpSpeed;
      state.headingParallaxY += (targetParallaxY - state.headingParallaxY) * lerpSpeed;

      // Apply subtle heading parallax
      if (parallaxHeadingRef.current) {
        parallaxHeadingRef.current.style.transform = `translate3d(${state.headingParallaxX.toFixed(
          2
        )}px, calc(-65px + ${state.headingParallaxY.toFixed(2)}px), 0)`;
      }

      // Update atmospheric background glow
      if (atmGlowRef.current) {
        atmGlowRef.current.style.background = `radial-gradient(circle 460px at ${state.currentAtmX.toFixed(
          1
        )}% ${state.currentAtmY.toFixed(1)}%, rgba(0, 217, 242, 0.08) 0%, rgba(7, 22, 36, 0.04) 50%, transparent 75%)`;
      }

      // Update Volumetric SVG Beams
      if (svgRef.current && leftBeamPathRef.current && rightBeamPathRef.current && centerBloomRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const width = svgRect.width || window.innerWidth;
        const height = svgRect.height || window.innerHeight;

        // Convergence point in SVG coordinate pixels
        const focusPixelX = (state.currentX / 100) * width;
        const focusPixelY = (state.currentY / 100) * height;

        // Left anchored light source
        const leftOriginX = 0;
        const leftOriginY = height * 0.38;

        // Right anchored light source
        const rightOriginX = width;
        const rightOriginY = height * 0.38;

        // Dynamic cone beam opening width at focus point
        const beamHalfHeight = Math.max(140, height * 0.22);

        // Path for Left Volumetric Light Beam
        const leftPath = `M ${leftOriginX} ${leftOriginY - 8}
          L ${focusPixelX} ${focusPixelY - beamHalfHeight}
          Q ${focusPixelX + 60} ${focusPixelY} ${focusPixelX} ${focusPixelY + beamHalfHeight}
          L ${leftOriginX} ${leftOriginY + 8}
          Z`;
        leftBeamPathRef.current.setAttribute("d", leftPath);

        // Path for Right Volumetric Light Beam
        const rightPath = `M ${rightOriginX} ${rightOriginY - 8}
          L ${focusPixelX} ${focusPixelY - beamHalfHeight}
          Q ${focusPixelX - 60} ${focusPixelY} ${focusPixelX} ${focusPixelY + beamHalfHeight}
          L ${rightOriginX} ${rightOriginY + 8}
          Z`;
        rightBeamPathRef.current.setAttribute("d", rightPath);

        // Center Convergence Atmospheric Bloom
        centerBloomRef.current.setAttribute("cx", focusPixelX.toFixed(1));
        centerBloomRef.current.setAttribute("cy", focusPixelY.toFixed(1));
        centerBloomRef.current.setAttribute("rx", (width * 0.28).toFixed(1));
        centerBloomRef.current.setAttribute("ry", (height * 0.24).toFixed(1));
        centerBloomRef.current.setAttribute(
          "fill-opacity",
          (0.22 * state.currentIntensity).toFixed(3)
        );
      }

      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animFrame);
  }, [isActive, isReducedMotion]);

  // Handle mouse move across Hero section
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const normY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    mouseNorm.current = { x: normX, y: normY };
    mouseScreen.current = { x: e.clientX, y: e.clientY };
    isHoveringHero.current = true;

    // Shift beam focus gently (max +/- 8% from center horizontally, +/- 6% vertically)
    focusState.current.targetX = 50 + (normX - 0.5) * 16;
    focusState.current.targetY = 44 + (normY - 0.5) * 12;

    // Shift atmospheric haze
    focusState.current.targetAtmX = 50 + (normX - 0.5) * 22;
    focusState.current.targetAtmY = 45 + (normY - 0.5) * 16;

    // Center intensity boost: moving toward center increases overlapping light naturally
    const distCenter = Math.hypot(normX - 0.5, normY - 0.45);
    const centerBoost = Math.max(0, 1 - distCenter * 2.2) * 0.28;
    const headingBoost = isHoveringHeading.current ? 0.18 : 0;
    focusState.current.targetIntensity = 1.0 + centerBoost + headingBoost;
  };

  // Reset lighting smoothly when cursor leaves Hero
  const handleHeroMouseLeave = () => {
    isHoveringHero.current = false;
    isHoveringHeading.current = false;
    mouseNorm.current = { x: 0.5, y: 0.45 };
    focusState.current.targetX = 50;
    focusState.current.targetY = 44;
    focusState.current.targetAtmX = 50;
    focusState.current.targetAtmY = 45;
    focusState.current.targetIntensity = 1.0;
  };

  // ── Interactive Main Heading: Metallic Light Reflection & Character Lift ──
  const handleHeadingMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    isHoveringHeading.current = true;
    focusState.current.targetIntensity = 1.25;

    const heading = headingRef.current;
    if (!heading) return;

    const rect = heading.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    // Update metallic specular reflection overlay position
    if (headingReflectionRef.current) {
      headingReflectionRef.current.style.opacity = "1";
      headingReflectionRef.current.style.background = `radial-gradient(circle 220px at ${relX}px ${relY}px, rgba(255, 255, 255, 0.95) 0%, rgba(115, 233, 245, 0.8) 35%, transparent 70%)`;
    }

    // Compute proximity lift for each character (1-2.5px lift for letters near cursor)
    const newLifts: { [key: string]: number } = {};
    const charElements = heading.querySelectorAll<HTMLElement>("[data-char-key]");

    charElements.forEach((el) => {
      const charRect = el.getBoundingClientRect();
      const charCenterX = charRect.left + charRect.width / 2;
      const dist = Math.abs(e.clientX - charCenterX);
      const key = el.getAttribute("data-char-key") || "";

      if (dist < 85) {
        // Cosine falloff for silky smooth letter lift
        const lift = Math.cos((dist / 85) * (Math.PI / 2)) * 2.5;
        newLifts[key] = Math.max(0, lift);
      } else {
        newLifts[key] = 0;
      }
    });

    setCharLifts(newLifts);
  };

  const handleHeadingMouseLeave = () => {
    isHoveringHeading.current = false;
    if (headingReflectionRef.current) {
      headingReflectionRef.current.style.opacity = "0";
    }
    setCharLifts({});
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
      style={{ background: "#02050D" }}
    >
      {/* ── Volumetric Dual Spotlights (SVG Layer with Soft Layered Gradients) ── */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        style={{ mixBlendMode: "screen" }}
        aria-hidden="true"
      >
        <defs>
          {/* Left Volumetric Light Gradient */}
          <linearGradient id="leftBeamGrad" x1="0%" y1="38%" x2="50%" y2="44%">
            <stop offset="0%" stopColor="#EAFBFF" stopOpacity="0.85" />
            <stop offset="14%" stopColor="#73E9F5" stopOpacity="0.45" />
            <stop offset="48%" stopColor="#00D9F2" stopOpacity="0.22" />
            <stop offset="78%" stopColor="#071624" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#02050D" stopOpacity="0" />
          </linearGradient>

          {/* Right Volumetric Light Gradient */}
          <linearGradient id="rightBeamGrad" x1="100%" y1="38%" x2="50%" y2="44%">
            <stop offset="0%" stopColor="#EAFBFF" stopOpacity="0.85" />
            <stop offset="14%" stopColor="#73E9F5" stopOpacity="0.45" />
            <stop offset="48%" stopColor="#00D9F2" stopOpacity="0.22" />
            <stop offset="78%" stopColor="#071624" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#02050D" stopOpacity="0" />
          </linearGradient>

          {/* Central Atmospheric Convergence Bloom */}
          <radialGradient id="centerBloomGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#73E9F5" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#00D9F2" stopOpacity="0.35" />
            <stop offset="65%" stopColor="#071624" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#02050D" stopOpacity="0" />
          </radialGradient>

          {/* Soft Blur Filter for Atmospheric Light Diffusion */}
          <filter id="softDiffusion" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" />
          </filter>
        </defs>

        {/* Central Atmospheric Convergence Bloom Behind Typography */}
        <ellipse
          ref={centerBloomRef}
          cx="50%"
          cy="44%"
          rx="380"
          ry="240"
          fill="url(#centerBloomGrad)"
          filter="url(#softDiffusion)"
          fillOpacity="0.22"
        />

        {/* Left Volumetric Light Beam */}
        <path
          ref={leftBeamPathRef}
          fill="url(#leftBeamGrad)"
          filter="url(#softDiffusion)"
        />

        {/* Right Volumetric Light Beam */}
        <path
          ref={rightBeamPathRef}
          fill="url(#rightBeamGrad)"
          filter="url(#softDiffusion)"
        />
      </svg>

      {/* ── Anchored Light Origin Projectors (Left & Right Edges) ── */}
      <div
        className="absolute left-0 top-[38%] -translate-y-1/2 w-2 h-16 pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse at left, rgba(234, 251, 255, 0.9) 0%, rgba(0, 217, 242, 0.4) 40%, transparent 80%)",
          filter: "drop-shadow(0 0 16px #00D9F2)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-[38%] -translate-y-1/2 w-2 h-16 pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse at right, rgba(234, 251, 255, 0.9) 0%, rgba(0, 217, 242, 0.4) 40%, transparent 80%)",
          filter: "drop-shadow(0 0 16px #00D9F2)",
        }}
        aria-hidden="true"
      />

      {/* ── Soft Mouse-Following Atmospheric Glow Behind Content ── */}
      <div
        ref={atmGlowRef}
        className="absolute inset-0 pointer-events-none z-[2] transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(circle 460px at 50% 45%, rgba(0, 217, 242, 0.08) 0%, rgba(7, 22, 36, 0.04) 50%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* ── Subtle Stationary 1px Horizon Separator (Replaces moving laser line) ── */}
      <div
        className="absolute top-[52%] inset-x-0 h-[1px] pointer-events-none z-[3]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0, 217, 242, 0.04) 20%, rgba(0, 217, 242, 0.16) 50%, rgba(0, 217, 242, 0.04) 80%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Soft Atmospheric Ambient Floor Reflection (Replaces bottom wave) ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 70% 30% at 50% 100%, rgba(0, 217, 242, 0.045) 0%, rgba(7, 22, 36, 0.02) 50%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      {/* ── Main Hero Content with Parallax & Proximity Interactions ── */}
      <div
        ref={parallaxHeadingRef}
        className="relative flex flex-col items-center text-center px-4 w-full z-10 will-change-transform"
        style={{
          transform: "translateY(-65px)",
          animation: "heroZoomIn 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
        }}
      >
        {/* ── Interactive Main Heading ("WE BUILD DIGITAL EXPERIENCES") ── */}
        <div className="relative group/heading">
          <h1
            ref={headingRef}
            onMouseMove={handleHeadingMouseMove}
            onMouseLeave={handleHeadingMouseLeave}
            data-cursor="heading"
            aria-label="WE BUILD DIGITAL EXPERIENCES"
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
            {HEADING_WORDS.map((word, wordIdx) => (
              <span
                key={word}
                className="inline-flex"
                style={{
                  background:
                    "linear-gradient(180deg, #FFFFFF 15%, #E2F5FF 55%, #88E2FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter:
                    "drop-shadow(0 0 20px rgba(0, 200, 225, 0.35)) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.95))",
                  WebkitTextStrokeWidth: "1px",
                  WebkitTextStrokeColor: "rgba(255, 255, 255, 0.4)",
                  letterSpacing: "0.03em",
                }}
              >
                {word.split("").map((char, charIdx) => {
                  const key = `${wordIdx}-${charIdx}`;
                  const lift = charLifts[key] || 0;
                  return (
                    <span
                      key={key}
                      data-char-key={key}
                      className="inline-block transition-transform duration-200 ease-out"
                      style={{
                        transform: lift > 0 ? `translate3d(0, -${lift.toFixed(2)}px, 0)` : "none",
                      }}
                      aria-hidden="true"
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          {/* Polished Metallic Specular Light Reflection Overlay */}
          <div
            ref={headingReflectionRef}
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 mix-blend-color-dodge select-none"
            style={{
              filter: "blur(2px)",
            }}
            aria-hidden="true"
          />
        </div>

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

            // Interpolate color from muted ice-blue to cyan highlight
            const color =
              proximity > 0
                ? `rgba(${Math.round(213 - proximity * 98)}, ${Math.round(
                    235 + proximity * 3
                  )}, 255, ${0.75 + proximity * 0.25})`
                : "#D5EBF8";

            const glow =
              proximity > 0
                ? `0 0 ${Math.round(14 + proximity * 12)}px rgba(0, 217, 242, ${
                    0.35 + proximity * 0.45
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
      <p
        className="absolute z-10 bottom-14 text-center px-4 text-slate-400 hover:text-slate-200 hover:drop-shadow-[0_0_12px_rgba(115,233,245,0.25)] font-sans tracking-wide text-xs sm:text-sm md:text-base select-none transition-colors duration-400 ease-out cursor-default"
      >
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
        <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-400/70 uppercase group-hover:text-cyan-300 transition-colors">
          EXPLORE
        </span>
        <div
          style={{
            width: 14,
            height: 14,
            borderRight: "1.5px solid #00EEFF",
            borderBottom: "1.5px solid #00EEFF",
            transform: "rotate(45deg)",
            opacity: 0.7,
          }}
        />
      </div>

      {/* ── Minimal Laser Sensor Corner Reticles (Atmospheric Framing) ── */}
      <div className="absolute top-6 left-6 w-3 h-3 border-t border-l border-cyan-400/30 pointer-events-none" />
      <div className="absolute top-6 right-6 w-3 h-3 border-t border-r border-cyan-400/30 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-3 h-3 border-b border-l border-cyan-400/30 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-cyan-400/30 pointer-events-none" />
    </div>
  );
};
