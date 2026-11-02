import React, { useEffect, useRef, useState } from "react";
import { ProjectCard3D, ProjectData } from "@/components/ProjectCard3D";
import { AboutSection } from "@/components/AboutSection";
import { VerticalDynamicIsland } from "@/components/VerticalDynamicIsland";
import { HeroSection } from "@/components/HeroSection";
import { CustomCursor } from "@/components/CustomCursor";
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

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    let raf: number;
    const t0 = Date.now();
    function tick() {
      const t = (Date.now() - t0) / 1000;
      const p = (Math.sin(t * (Math.PI / 6)) + 1) / 2;
      const r = Math.round(2 + p * 2.5);
      const g = Math.round(8 + p * 4.5);
      const b = Math.round(24 + p * 8);
      bg.style.background = `radial-gradient(ellipse 100% 85% at 50% 45%, rgb(${r + 4},${g + 12},${b + 28}) 0%, rgb(${r},${g},${b}) 55%, #020817 100%)`;
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
      <CustomCursor />
      <div ref={bgRef} className="absolute inset-0" style={{ background: "#020817", zIndex: 0 }} />

      {/* ── SECTION 1: HERO (PREMIUM CINEMATIC DUAL SPOTLIGHT HERO) ── */}
      <div style={sectionStyle(0)}>
        <HeroSection
          isActive={currentSection === 0}
          onExploreClick={() => {
            if (!isAnimating) {
              setIsAnimating(true);
              setCurrentSection(1);
              setTimeout(() => setIsAnimating(false), 900);
            }
          }}
        />
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

      {/* ── LEFT-EDGE VERTICAL DYNAMIC ISLAND (Always on top across all sections & project deck) ── */}
      <VerticalDynamicIsland
        currentSection={currentSection}
        projectsType={projectsType}
        onNavigate={(idx) => {
          if (projectsType) {
            closeProjectsModal();
          }
          if (!isAnimating && idx !== currentSection) {
            setIsAnimating(true);
            setCurrentSection(idx);
            setTimeout(() => setIsAnimating(false), 900);
          }
        }}
      />

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.8; }
          50%       { transform: translateX(-50%) translateY(6px); opacity: 0.3; }
        }
        @keyframes heroZoomIn {
          0%   { opacity: 0; transform: scale(0.97) translateY(-75px); }
          100% { opacity: 1; transform: scale(1) translateY(-65px); }
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
