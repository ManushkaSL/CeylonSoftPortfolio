import React, { useEffect, useRef, useState } from "react";
import { ProjectCard3D, ProjectData } from "@/components/ProjectCard3D";
import { AboutSection } from "@/components/AboutSection";
import { VerticalDynamicIsland } from "@/components/VerticalDynamicIsland";
import { X, ArrowRight, Layers } from "lucide-react";
import { motion } from "framer-motion";

const WEB_PROJECTS: ProjectData[] = [
  {
    id: "web-1",
    title: "PulseSetter",
    desc: "Integrated healthcare & educational platform connecting patients, doctors, and students with online channeling and book marketplace.",
    category: "web",
    type: "Client Project",
    tags: ["React", "Razorpay", "REST APIs", "HealthTech"],
    mockup: "/images/web_pulsesetter.jpg",
  },
  {
    id: "web-2",
    title: "Matrix Digital Solutions",
    desc: "Modern corporate portfolio website designed to showcase company services, brand identity, interactive animations, and client work.",
    category: "web",
    type: "Client Project",
    tags: ["React", "TypeScript", "Vite", "Vercel"],
    mockup: "/images/web_matrix.jpg",
  },
  {
    id: "web-3",
    title: "LAW.LK",
    desc: "Legal information & regulatory journal platform with statute publishing, user authentication, and nested community discussions.",
    category: "web",
    type: "Client Project",
    tags: ["React", "TypeScript", "Firebase", "Firestore"],
    mockup: "/images/web_lawlk.jpg",
  },
  {
    id: "web-4",
    title: "TripShare",
    desc: "Shared tour booking platform connecting passengers and drivers with tour discovery, date filtering, and interactive map routing.",
    category: "web",
    type: "Personal Project",
    tags: ["React", "Firebase", "OpenStreetMap", "Full-Stack"],
    mockup: "/images/web_tripshare.jpg",
  },
  {
    id: "web-5",
    title: "SC Courier",
    desc: "Logistics courier management system coordinating customers, riders, and administrators with parcel tracking and automated reporting.",
    category: "web",
    type: "Academic Group Project",
    tags: ["React", "PostgreSQL", "REST APIs", "Map Tracking"],
    mockup: "/images/web_sccourier.jpg",
  },
];

const MOBILE_PROJECTS: ProjectData[] = [
  {
    id: "mob-1",
    title: "TripShare Mobile",
    desc: "Mobile application for travellers to discover shared tours, connect with drivers, and coordinate journeys with live in-app chat.",
    category: "mobile",
    type: "Personal Project",
    tags: ["Flutter", "Firebase", "OpenStreetMap", "Dart"],
    mockup: "/images/mobile_tripshare.jpg",
  },
  {
    id: "mob-2",
    title: "SC Courier Rider App",
    desc: "Delivery management mobile application for courier riders to manage assigned parcels, update statuses, and track live locations.",
    category: "mobile",
    type: "Academic Group Project",
    tags: ["Flutter", "PostgreSQL", "REST APIs", "Google Maps"],
    mockup: "/images/mobile_sccourier.jpg",
  },
];

export default function Index() {
  const leftConicRef  = useRef<HTMLDivElement>(null);
  const rightConicRef = useRef<HTMLDivElement>(null);
  const leftLinearRef  = useRef<HTMLDivElement>(null);
  const rightLinearRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const leftImgRef = useRef<HTMLImageElement>(null);
  const rightImgRef = useRef<HTMLImageElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating]       = useState(false);
  const [hoveredImage, setHoveredImage] = useState<"left" | "right" | null>(null);
  const [section2Clicked, setSection2Clicked] = useState(false);
  const [section2SlidingIn, setSection2SlidingIn] = useState(false);
  const [hasReturnedFromProjects, setHasReturnedFromProjects] = useState(false);
  const [projectsType, setProjectsType] = useState<"web" | "mobile" | null>(null);
  const [isClosingProjects, setIsClosingProjects] = useState(false);
  const totalSections = 4; // 0: Hero, 1: Projects, 2: About Me, 3: Contact

  useEffect(() => {
    let touchStartY = 0;
    const goTo = (next: number) => {
      if (isAnimating) return;
      const clamped = Math.min(totalSections - 1, Math.max(0, next));
      if (clamped === currentSection) return;
      setIsAnimating(true);
      setCurrentSection(clamped);
      setTimeout(() => setIsAnimating(false), 900);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 30) goTo(currentSection + 1);
      else if (e.deltaY < -30) goTo(currentSection - 1);
    };
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const onTouchEnd   = (e: TouchEvent) => {
      const d = touchStartY - e.changedTouches[0].clientY;
      if (d > 40) goTo(currentSection + 1);
      else if (d < -40) goTo(currentSection - 1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend",   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, [currentSection, isAnimating]);

  // Wide light sweep: Starts wide at outer left/right and sweeps INWARD to center!
  useEffect(() => {
    const lc = leftConicRef.current, rc = rightConicRef.current;
    const ll = leftLinearRef.current, rl = rightLinearRef.current;
    if (!lc || !rc || !ll || !rl) return;

    const startArc = 260, endArc = 165, dur = 2800, t0 = Date.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 2.2);

    function tick() {
      const p = ease(Math.min(1, (Date.now() - t0) / dur));
      const arc = startArc + (endArc - startArc) * p;
      const c20 = (arc * 0.22).toFixed(1), c55 = (arc * 0.58).toFixed(1);
      const midL = (18 + p * 6).toFixed(0);
      const conic = `conic-gradient(from 270deg at 50% 50%, #C4F1FF 0.2deg, #00D5E8 ${c20}deg, hsl(218,80%,${midL}%) ${c55}deg, #020612 ${arc.toFixed(1)}deg, #020612 360deg)`;
      const linear = `linear-gradient(180deg, #020612 0%, rgba(2,6,18,0.15) 40%, rgba(2,6,18,0.92) 100%)`;
      lc.style.background = rc.style.background = conic;
      ll.style.background = rl.style.background = linear;
      if (p < 1) requestAnimationFrame(tick);
    }
    tick();
  }, []);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    let raf: number;
    const t0 = Date.now();
    function tick() {
      const t = (Date.now() - t0) / 1000;
      const p = (Math.sin(t * (Math.PI / 6)) + 1) / 2;
      const r = Math.round(2 + p * 1.5);
      const g = Math.round(5 + p * 2.5);
      const b = Math.round(14 + p * 4);
      bg.style.background = `rgb(${r},${g},${b})`;
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Pixel detection for hover
  useEffect(() => {
    const loadImages = async () => {
      try {
        const leftImg = leftImgRef.current;
        const rightImg = rightImgRef.current;
        if (!leftImg || !rightImg) return;

        await new Promise((resolve, reject) => {
          leftImg.onload = resolve;
          leftImg.onerror = reject;
          leftImg.src = "/left.png";
          leftImg.crossOrigin = "anonymous";
        });

        await new Promise((resolve, reject) => {
          rightImg.onload = resolve;
          rightImg.onerror = reject;
          rightImg.src = "/right.png";
          rightImg.crossOrigin = "anonymous";
        });

        const leftCanvas = leftCanvasRef.current;
        const rightCanvas = rightCanvasRef.current;
        if (leftCanvas && rightCanvas) {
          leftCanvas.width = leftImg.width;
          leftCanvas.height = leftImg.height;
          rightCanvas.width = rightImg.width;
          rightCanvas.height = rightImg.height;

          const leftCtx = leftCanvas.getContext("2d", { willReadFrequently: true });
          const rightCtx = rightCanvas.getContext("2d", { willReadFrequently: true });
          if (leftCtx && rightCtx) {
            leftCtx.drawImage(leftImg, 0, 0);
            rightCtx.drawImage(rightImg, 0, 0);
          }
        }
      } catch (err) {
        console.error("Failed to load images:", err);
      }
    };

    loadImages();
  }, []);

  const isPixelTransparent = (canvas: HTMLCanvasElement | null, x: number, y: number): boolean => {
    if (!canvas) return true;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return true;
    try {
      const imageData = ctx.getImageData(x, y, 1, 1);
      return imageData.data[3] < 128;
    } catch {
      return true;
    }
  };

  const handleMouseMoveSection2 = (e: React.MouseEvent<HTMLDivElement>) => {
    const section = section2Ref.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;

    if (!leftCanvas || !rightCanvas) return;

    const leftImgX = Math.round((x / (rect.width * 0.75)) * leftCanvas.width);
    const leftImgY = Math.round((y / rect.height) * leftCanvas.height);

    const rightStart = rect.width * (1 - 0.78);
    const rightImgX = Math.round(((x - rightStart) / (rect.width * 0.78)) * rightCanvas.width);
    const rightImgY = Math.round((y / rect.height) * rightCanvas.height);

    const leftTransparent = isPixelTransparent(leftCanvas, leftImgX, leftImgY);
    const rightTransparent = isPixelTransparent(rightCanvas, rightImgX, rightImgY);

    if (!leftTransparent) {
      setHoveredImage("left");
    } else if (!rightTransparent) {
      setHoveredImage("right");
    } else {
      setHoveredImage(null);
    }
  };

  const handleMouseLeaveSection2 = () => {
    setHoveredImage(null);
  };

  const handleSection2Click = () => {
    if (hoveredImage === "left") {
      setSection2Clicked(true);
      setTimeout(() => setProjectsType("web"), 450);
    } else if (hoveredImage === "right") {
      setSection2Clicked(true);
      setTimeout(() => setProjectsType("mobile"), 450);
    }
  };

  const closeProjectsModal = () => {
    setIsClosingProjects(true);
    setSection2Clicked(false);
    setSection2SlidingIn(true);
    setHasReturnedFromProjects(true);
    setHoveredImage(null);
    setTimeout(() => {
      setProjectsType(null);
      setIsClosingProjects(false);
    }, 400);
    setTimeout(() => {
      setSection2SlidingIn(false);
    }, 900);
  };

  const getTransform = (idx: number) => {
    if (currentSection === idx) return "translateY(0px) scale(1)";
    if (currentSection > idx)   return "translateY(-70px) scale(0.96)";
    return "translateY(70px) scale(0.96)";
  };

  const sectionStyle = (idx: number): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: currentSection === idx ? 1 : 0,
    transform: getTransform(idx),
    transition: "opacity 0.75s cubic-bezier(0.4,0,0.2,1), transform 0.75s cubic-bezier(0.4,0,0.2,1)",
    pointerEvents: currentSection === idx ? "auto" : "none",
    zIndex: currentSection === idx ? 20 : 5,
    willChange: "opacity, transform",
  });

  const activeProjects = projectsType === "web" ? WEB_PROJECTS : MOBILE_PROJECTS;

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden font-sans">
      <div ref={bgRef} className="absolute inset-0" style={{ background: "#020612", zIndex: 0 }} />

      {/* ── SECTION 1: HERO (SUPER LASER THEME) ── */}
      <div style={sectionStyle(0)}>
        {/* Wide Dual Symmetrical Conic Lights */}
        <div
          ref={leftConicRef}
          className="absolute inset-y-0 left-0 w-1/2 pointer-events-none"
          style={{
            background:
              "conic-gradient(from 270deg at 50% 50%, #C4F1FF 0.2deg, #00D5E8 35deg, hsl(218,80%,22%) 95deg, #020612 165deg, #020612 360deg)",
            height: "130%",
            top: "-15%",
            transform: "scaleX(-1)",
          }}
        />
        <div
          ref={rightConicRef}
          className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
          style={{
            background:
              "conic-gradient(from 270deg at 50% 50%, #C4F1FF 0.2deg, #00D5E8 35deg, hsl(218,80%,22%) 95deg, #020612 165deg, #020612 360deg)",
            height: "130%",
            top: "-15%",
          }}
        />
        <div
          ref={leftLinearRef}
          className="absolute inset-y-0 left-0 w-1/2 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, #020612 0%, rgba(2,6,18,0.15) 40%, rgba(2,6,18,0.92) 100%)",
          }}
        />
        <div
          ref={rightLinearRef}
          className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, #020612 0%, rgba(2,6,18,0.15) 40%, rgba(2,6,18,0.92) 100%)",
          }}
        />

        {/* ── LASER SUPER ANIMATION 1: RADIANT HORIZONTAL LASER BEAM ── */}
        <div className="absolute top-[52%] inset-x-0 h-px pointer-events-none z-10 overflow-hidden">
          {/* Main Electric Cyan Core Laser */}
          <div
            className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#00EEFF] to-transparent shadow-[0_0_20px_#00EEFF,0_0_6px_#FFFFFF]"
            style={{ animation: "laserPulse 3.5s ease-in-out infinite" }}
          />
          {/* Traveling Laser Pulse Tracer */}
          <div
            className="absolute top-0 h-full w-40 bg-gradient-to-r from-transparent via-white to-transparent"
            style={{
              animation: "laserTravel 4s cubic-bezier(0.4, 0, 0.2, 1) infinite",
              filter: "drop-shadow(0 0 12px #00EEFF)",
            }}
          />
        </div>

        {/* ── LASER SUPER ANIMATION 2: DUAL ANGLED PROJECTOR LASER RAYS ── */}
        <div
          className="absolute bottom-0 left-0 w-[45vw] h-px origin-left pointer-events-none opacity-40"
          style={{
            transform: "rotate(-25deg)",
            background: "linear-gradient(90deg, #00EEFF 0%, rgba(0,238,255,0.4) 60%, transparent 100%)",
            boxShadow: "0 0 16px rgba(0,238,255,0.6)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[45vw] h-px origin-right pointer-events-none opacity-40"
          style={{
            transform: "rotate(25deg)",
            background: "linear-gradient(-90deg, #00EEFF 0%, rgba(0,238,255,0.4) 60%, transparent 100%)",
            boxShadow: "0 0 16px rgba(0,238,255,0.6)",
          }}
        />

        {/* ── LASER SUPER ANIMATION 3: VERTICAL SCANNER BEAM ── */}
        <div
          className="absolute inset-x-0 h-24 pointer-events-none z-10 opacity-30"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(0,238,255,0.12) 50%, #00EEFF 98%, transparent 100%)",
            animation: "verticalLaserScan 6s ease-in-out infinite",
          }}
        />

        {/* Wide Horizon Ambient Glow */}
        <div
          className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen max-w-[1400px] h-[320px] pointer-events-none opacity-20 blur-[100px]"
          style={{
            background:
              "radial-gradient(ellipse 85% 45% at 50% 50%, #00EEFF 0%, #052255 50%, transparent 75%)",
          }}
        />

        {/* Soft bottom dark feathering */}
        <div
          className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none"
          style={{ background: "linear-gradient(0deg, #020612 20%, rgba(2,6,18,0.85) 55%, transparent 100%)" }}
        />

        {/* Main Hero Content */}
        <div
          className="relative flex flex-col items-center text-center px-4 w-full"
          style={{
            transform: "translateY(-65px)",
            zIndex: 10,
            animation: "heroZoomIn 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
          }}
        >
          {/* Luminous Chrome Heading */}
          <h1
            className="leading-tight select-none"
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
            {["WE", "BUILD", "DIGITAL", "EXPERIENCES"].map((word) => (
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

          {/* Subtitle in Glowing Ice Silver */}
          <p
            className="mt-6 text-[#D5EBF8]"
            style={{
              fontFamily: "'Jersey 10', sans-serif",
              fontSize: "clamp(1.15rem, 2.5vw, 2.3rem)",
              letterSpacing: "0.18em",
              textShadow: "0 0 14px rgba(0, 200, 225, 0.35), 0 2px 8px rgba(0,0,0,0.9)",
            }}
          >
            W h e r e &nbsp; P e r f o r m a n c e &nbsp; M e e t s &nbsp; D e s i g n .
          </p>
        </div>

        {/* Bottom Tagline (Clean Text - No Capsule) */}
        <p className="absolute z-10 bottom-14 text-center px-4 text-slate-400 font-sans tracking-wide text-xs sm:text-sm md:text-base select-none">
          Mobile Applications &amp; Web Systems Built for Modern Businesses.
        </p>

        {/* Scroll Indicator Prompt */}
        <div
          className="absolute left-1/2 z-20 flex flex-col items-center gap-1 cursor-pointer group"
          onClick={() => {
            if (!isAnimating) {
              setIsAnimating(true);
              setCurrentSection(1);
              setTimeout(() => setIsAnimating(false), 900);
            }
          }}
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

        {/* ── LASER SENSOR CORNER RETICLES ── */}
        <div className="absolute top-6 left-6 w-3 h-3 border-t border-l border-cyan-400/40 pointer-events-none" />
        <div className="absolute top-6 right-6 w-3 h-3 border-t border-r border-cyan-400/40 pointer-events-none" />
        <div className="absolute bottom-6 left-6 w-3 h-3 border-b border-l border-cyan-400/40 pointer-events-none" />
        <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-cyan-400/40 pointer-events-none" />
      </div>

      {/* ── SECTION 2: WEB VS MOBILE SPLIT SHOWCASE ── */}
      <div
        ref={section2Ref}
        onMouseMove={handleMouseMoveSection2}
        onMouseLeave={handleMouseLeaveSection2}
        onClick={handleSection2Click}
        style={{
          ...sectionStyle(1),
          cursor: hoveredImage === "left" || hoveredImage === "right" ? "pointer" : "default",
        }}
      >
        {/* Left (Web) Showcase */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            backgroundImage: "url('/left.png')",
            backgroundSize: "75% 100%",
            backgroundPosition: "left",
            backgroundRepeat: "no-repeat",
            animation: section2Clicked
              ? "slideOutLeft 5s cubic-bezier(0.22,0.62,0.36,1) forwards"
              : section2SlidingIn
              ? "slideInLeft 0.9s cubic-bezier(0.22,1,0.36,1) both"
              : currentSection === 1 && !hasReturnedFromProjects
              ? "slideFromBottom 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both"
              : "none",
            zIndex: 4,
            pointerEvents: "none",
            filter:
              hoveredImage === "left"
                ? "brightness(1.18) drop-shadow(0 0 30px rgba(0,200,225,0.35))"
                : "brightness(0.95)",
            transform: hoveredImage === "left" ? "scale(1.03)" : "scale(1)",
            transition: "filter 0.35s ease-out, transform 0.35s ease-out",
          }}
        />

        {/* Right (Mobile) Showcase */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            backgroundImage: "url('/right.png')",
            backgroundSize: "78% 100%",
            backgroundPosition: "right",
            backgroundRepeat: "no-repeat",
            mixBlendMode: "darken",
            animation: section2Clicked
              ? "slideOutRight 5s cubic-bezier(0.22,0.62,0.36,1) forwards"
              : section2SlidingIn
              ? "slideInRight 0.9s cubic-bezier(0.22,1,0.36,1) both"
              : currentSection === 1 && !hasReturnedFromProjects
              ? "slideFromTop 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both"
              : "none",
            zIndex: 3,
            pointerEvents: "none",
            filter:
              hoveredImage === "right"
                ? "brightness(1.18) drop-shadow(0 0 30px rgba(0,200,225,0.35))"
                : "brightness(0.95)",
            transform: hoveredImage === "right" ? "scale(1.03)" : "scale(1)",
            transition: "filter 0.35s ease-out, transform 0.35s ease-out",
          }}
        />

        {/* Hidden images & canvases for pixel detection */}
        <img ref={leftImgRef} style={{ display: "none" }} alt="left" />
        <img ref={rightImgRef} style={{ display: "none" }} alt="right" />
        <canvas ref={leftCanvasRef} style={{ display: "none" }} />
        <canvas ref={rightCanvasRef} style={{ display: "none" }} />
      </div>

      {/* ── SECTION 3: ABOUT ME (FOUNDER SHOWCASE) ── */}
      <div style={{ ...sectionStyle(2) }}>
        <AboutSection
          onContactClick={() => {
            if (!isAnimating) {
              setIsAnimating(true);
              setCurrentSection(3);
              setTimeout(() => setIsAnimating(false), 900);
            }
          }}
        />
      </div>

      {/* ── SECTION 4: LET'S CREATE TOGETHER / CONTACT ── */}
      <div style={{ ...sectionStyle(3) }}>
        <div className="relative max-w-2xl mx-auto px-6 text-center z-10">
          <h2
            className="text-white mb-4 leading-tight"
            style={{
              fontFamily: "'Italiana', serif",
              fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
              textShadow: "0 0 25px rgba(0, 200, 225, 0.35)",
            }}
          >
            Let's Create <span className="text-cyan-300">Together</span>
          </h2>

          <p
            className="text-slate-400 mx-auto mb-8 leading-relaxed font-sans"
            style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}
          >
            Reach out to architect high-performance web platforms and bespoke mobile applications built for modern scale.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:contact@ceylonsoft.com"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold font-mono text-sm tracking-wider shadow-[0_0_20px_rgba(0,200,225,0.3)] hover:shadow-[0_0_30px_rgba(0,200,225,0.5)] hover:scale-105 transition-all"
            >
              <span>INITIATE PROJECT</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentSection(1);
                  setTimeout(() => setIsAnimating(false), 900);
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.03] border border-cyan-400/20 text-cyan-300 font-mono text-sm tracking-wider hover:bg-cyan-950/40 hover:border-cyan-400/40 transition-all"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>EXPLORE SHOWCASE</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── LEFT-EDGE VERTICAL DYNAMIC ISLAND ── */}
      <VerticalDynamicIsland
        currentSection={currentSection}
        onNavigate={(idx) => {
          if (!isAnimating && idx !== currentSection) {
            setIsAnimating(true);
            setCurrentSection(idx);
            setTimeout(() => setIsAnimating(false), 900);
          }
        }}
      />

      {/* ── DOT NAVIGATION (4 SECTIONS) ── */}
      <div
        className="fixed right-6 top-1/2 z-50 flex flex-col gap-3.5"
        style={{ transform: "translateY(-50%)" }}
      >
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            aria-label={`Go to section ${i + 1}`}
            onClick={() => {
              if (!isAnimating && i !== currentSection) {
                setIsAnimating(true);
                setCurrentSection(i);
                setTimeout(() => setIsAnimating(false), 900);
              }
            }}
            style={{
              width: i === currentSection ? 10 : 6,
              height: i === currentSection ? 10 : 6,
              borderRadius: "50%",
              background: i === currentSection ? "#00F2FF" : "rgba(255,255,255,0.25)",
              border: i === currentSection ? "none" : "1px solid rgba(255,255,255,0.15)",
              boxShadow: i === currentSection ? "0 0 10px #00F2FF" : "none",
              transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* ── 3D PROJECTS MODAL (Smooth Luxury Deck Deal + Sequential Laser Scanner) ── */}
      {projectsType && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(2, 6, 18, 0.98)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: isClosingProjects ? "fadeOut 0.4s ease-out" : "fadeIn 0.6s ease-out",
            backdropFilter: "blur(14px)",
          }}
        >
          {/* Top-Right Close Button */}
          <button
            onClick={closeProjectsModal}
            className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-cyan-950/60 border border-cyan-400/25 text-cyan-300 hover:text-white hover:border-cyan-400 hover:scale-110 transition-all shadow-lg"
            aria-label="Close projects modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            style={{
              width: "100vw",
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: "4rem",
              paddingBottom: "5rem",
              animation: "popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
              overflowY: "auto",
            }}
          >
            {/* Clean Section Title */}
            <h1
              style={{
                textAlign: "center",
                color: "#FFFFFF",
                fontFamily: "'Italiana', serif",
                fontSize: "clamp(2rem, 5vw, 3.6rem)",
                letterSpacing: "0.03em",
                textShadow: "0 0 25px rgba(0, 200, 225, 0.35)",
                marginBottom: "2.5rem",
              }}
            >
              {projectsType === "web" ? "Web Systems & Platforms" : "Mobile Applications"}
            </h1>

            {/* Stage-Dealt 3D Project Cards Container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                minHeight: "560px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                perspective: 1200,
                transformStyle: "preserve-3d",
              }}
            >
              {activeProjects.map((project, idx) => {
                const total = activeProjects.length;
                const cardSpacing = 370;
                // Dynamically centers any number of cards (e.g. 5 for Web, 2 for Mobile)
                const centerOffset = (idx - (total - 1) / 2) * cardSpacing;

                return (
                  <motion.div
                    key={project.id}
                    initial={{
                      x: 0,
                      scale: 0.8,
                      opacity: 0,
                      rotateZ: (idx - (total - 1) / 2) * 3,
                    }}
                    animate={{
                      x: centerOffset,
                      scale: 1,
                      opacity: 1,
                      rotateZ: 0,
                    }}
                    transition={{
                      duration: 1.4,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.15 + idx * 0.18,
                    }}
                    style={{
                      position: "absolute",
                      width: "350px",
                      height: "520px",
                      zIndex: 10 - Math.abs(idx - Math.floor(total / 2)),
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <ProjectCard3D project={project} index={idx} />
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Change Platform CTA Button */}
            <button
              onClick={closeProjectsModal}
              style={{
                position: "fixed",
                bottom: "2.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                background: "linear-gradient(135deg, rgba(0, 200, 225, 0.15), rgba(2, 43, 105, 0.2))",
                border: "1.5px solid #00EEFF",
                color: "#00EEFF",
                padding: "0.75rem 2.2rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontFamily: "'Italiana', serif",
                fontWeight: "bold",
                letterSpacing: "0.15em",
                transition: "all 0.3s ease-out",
                boxShadow: "0 0 16px rgba(0, 200, 225, 0.25)",
                zIndex: 60,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(0, 200, 225, 0.25), rgba(2, 43, 105, 0.3))";
                e.currentTarget.style.boxShadow = "0 0 25px rgba(0, 200, 225, 0.5)";
                e.currentTarget.style.transform = "translateX(-50%) scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(0, 200, 225, 0.15), rgba(2, 43, 105, 0.2))";
                e.currentTarget.style.boxShadow = "0 0 16px rgba(0, 200, 225, 0.25)";
                e.currentTarget.style.transform = "translateX(-50%) scale(1)";
              }}
            >
              CHANGE PLATFORM
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.8; }
          50%       { transform: translateX(-50%) translateY(6px); opacity: 0.3; }
        }
        @keyframes heroZoomIn {
          0%   { opacity: 0; transform: scale(0.97) translateY(-75px); }
          100% { opacity: 1; transform: scale(1) translateY(-65px); }
        }
        @keyframes laserPulse {
          0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 14px #00EEFF); }
          50%      { opacity: 1;   filter: drop-shadow(0 0 26px #00EEFF); }
        }
        @keyframes laserTravel {
          0%   { left: -20%; opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { left: 120%; opacity: 0; }
        }
        @keyframes verticalLaserScan {
          0%   { top: 10%; opacity: 0; }
          25%  { opacity: 0.35; }
          75%  { opacity: 0.35; }
          100% { top: 85%; opacity: 0; }
        }
        @keyframes slideFromBottom {
          0%   { opacity: 0; transform: translateY(80px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes slideFromTop {
          0%   { opacity: 0; transform: translateY(-80px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes slideOutLeft {
          0%   { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-150%); }
        }
        @keyframes slideOutRight {
          0%   { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(150%); }
        }
        @keyframes slideInLeft {
          0%   { opacity: 0; transform: translateX(-150%); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          0%   { opacity: 0; transform: translateX(150%); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fadeOut {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
