import React, { useEffect, useRef, useState } from "react";
import mobileImg from "@/assets/mobile.png";
import laptopImg from "@/assets/laptop.png";

const projects = [
  { title: "Project Alpha", desc: "E-commerce platform with real-time inventory", tags: ["React", "Node.js", "MongoDB"] },
  { title: "Project Beta",  desc: "AI-powered dashboard for analytics",           tags: ["Next.js", "Python", "TensorFlow"] },
  { title: "Project Gamma", desc: "Cross-platform mobile banking app",            tags: ["Flutter", "Firebase", "Dart"] },
  { title: "Project Delta", desc: "Real-time collaboration tool for teams",       tags: ["Vue.js", "WebSockets", "Redis"] },
];

const webProjects = [
  { title: "Web Alpha",  desc: "SaaS landing page with conversion optimization",  tags: ["React", "Tailwind", "Framer"] },
  { title: "Web Beta",   desc: "Admin dashboard with real-time data streams",     tags: ["Next.js", "Chart.js", "Prisma"] },
  { title: "Web Gamma",  desc: "Multi-tenant CRM system for enterprise clients",  tags: ["TypeScript", "PostgreSQL", "Redis"] },
  { title: "Web Delta",  desc: "Interactive portfolio with 3D animations",        tags: ["Three.js", "GSAP", "Vite"] },
];

function ProjectCard({ proj, idx }: { proj: typeof projects[0]; idx: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, minWidth: 0, height: "72vh", borderRadius: "14px",
        background: "linear-gradient(160deg, rgba(5,18,50,0.95) 0%, rgba(2,10,30,0.98) 100%)",
        border: hovered ? "1px solid rgba(0,229,255,0.7)" : "1px solid rgba(0,229,255,0.15)",
        boxShadow: hovered
          ? "0 0 24px rgba(0,229,255,0.25), 0 16px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
        transform: hovered ? "translateY(-6px) scale(1.02)" : "translateY(0px) scale(1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
        animation: `dealCard 0.5s cubic-bezier(0.22,1,0.36,1) ${0.1 + idx * 0.12}s both`,
        position: "relative", overflow: "hidden",
        cursor: "pointer",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "16px 12px",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px",
        background: hovered ? "linear-gradient(90deg, transparent, #00EEFF, transparent)" : "linear-gradient(90deg, transparent, rgba(0,229,255,0.3), transparent)",
        transition: "background 0.3s ease" }} />
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem",
        color: hovered ? "rgba(0,229,255,0.15)" : "rgba(255,255,255,0.04)",
        lineHeight: 1, transition: "color 0.3s ease", userSelect: "none" }}>
        0{idx + 1}
      </div>
      <div>
        <p style={{ fontFamily: "'Italiana', serif", fontSize: "clamp(0.8rem, 1.2vw, 1rem)",
          color: hovered ? "#FFFFFF" : "#D0D0D0", fontWeight: "700", margin: "0 0 6px",
          transition: "color 0.3s ease", lineHeight: 1.2 }}>{proj.title}</p>
        <p style={{ fontFamily: "Calibri, sans-serif", fontSize: "clamp(0.6rem, 0.9vw, 0.75rem)",
          color: "#808080", margin: "0 0 10px", lineHeight: 1.4 }}>{proj.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {proj.tags.map((tag, t) => (
            <span key={t} style={{ fontFamily: "Calibri, sans-serif", fontSize: "0.55rem",
              color: "#00EEFF", border: "1px solid rgba(0,229,255,0.3)",
              borderRadius: "3px", padding: "1px 5px", letterSpacing: "0.05em" }}>{tag}</span>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
        background: hovered ? "radial-gradient(ellipse at 50% 100%, rgba(0,229,255,0.08) 0%, transparent 70%)" : "none",
        transition: "background 0.3s ease", pointerEvents: "none" }} />
    </div>
  );
}

export default function Index() {
  const leftConicRef  = useRef<HTMLDivElement>(null);
  const rightConicRef = useRef<HTMLDivElement>(null);
  const leftLinearRef  = useRef<HTMLDivElement>(null);
  const rightLinearRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating]       = useState(false);
  const [leftClicked, setLeftClicked]       = useState(false);
  const [rightClicked, setRightClicked]     = useState(false);
  const [hoverEdgeLabel, setHoverEdgeLabel] = useState(false);  // hovering the edge label
  const [hoverExitedImg, setHoverExitedImg] = useState(false);  // hovering the exited image zone
  const totalSections = 3;

  /* ── Snap scroll ── */
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
    const onWheel = (e: WheelEvent) => { e.preventDefault(); if (e.deltaY > 30) goTo(currentSection + 1); else if (e.deltaY < -30) goTo(currentSection - 1); };
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const onTouchEnd   = (e: TouchEvent) => { const d = touchStartY - e.changedTouches[0].clientY; if (d > 40) goTo(currentSection + 1); else if (d < -40) goTo(currentSection - 1); };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend",   onTouchEnd,   { passive: true });
    return () => { window.removeEventListener("wheel", onWheel); window.removeEventListener("touchstart", onTouchStart); window.removeEventListener("touchend", onTouchEnd); };
  }, [currentSection, isAnimating]);

  /* ── Conic spread-to-focus intro ── */
  useEffect(() => {
    const lc = leftConicRef.current, rc = rightConicRef.current;
    const ll = leftLinearRef.current, rl = rightLinearRef.current;
    if (!lc || !rc || !ll || !rl) return;
    const startArc = 185, endArc = 115, dur = 1400, t0 = Date.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    function tick() {
      const p = ease(Math.min(1, (Date.now() - t0) / dur));
      const arc = startArc + (endArc - startArc) * p;
      const c20 = (arc * 0.18).toFixed(1), c55 = (arc * 0.55).toFixed(1);
      const midL = (38 + p * 8).toFixed(0);
      const conic = `conic-gradient(from 270deg at 50% 50%, #FFFFFF 0.3deg, #00EEFF ${c20}deg, hsl(215,100%,${midL}%) ${c55}deg, #020A1E ${arc.toFixed(1)}deg, #050D1F 360deg)`;
      const linear = `linear-gradient(180deg, #050D1F 0%, rgba(5,13,31,0) 35%, rgba(5,13,31,0) 100%)`;
      lc.style.background = rc.style.background = conic;
      ll.style.background = rl.style.background = linear;
      if (p < 1) requestAnimationFrame(tick);
    }
    tick();
  }, []);

  /* ── Slowly cycling background ── */
  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    let raf: number;
    const t0 = Date.now();
    function tick() {
      const t = (Date.now() - t0) / 1000;
      const p = (Math.sin(t * (Math.PI / 6)) + 1) / 2;
      const r = Math.round(5  + p * 2);
      const g = Math.round(13 + p * 7);
      const b = Math.round(31 + p * 9);
      bg.style.background = `rgb(${r},${g},${b})`;
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (currentSection !== 1) { setLeftClicked(false); setRightClicked(false); }
  }, [currentSection]);

  const getTransform = (idx: number) => {
    if (currentSection === idx) return "translateY(0px) scale(1)";
    if (currentSection > idx)   return "translateY(-70px) scale(0.96)";
    return "translateY(70px) scale(0.96)";
  };

  const sectionStyle = (idx: number): React.CSSProperties => ({
    position: "absolute", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: currentSection === idx ? 1 : 0,
    transform: getTransform(idx),
    transition: "opacity 0.75s cubic-bezier(0.4,0,0.2,1), transform 0.75s cubic-bezier(0.4,0,0.2,1)",
    pointerEvents: currentSection === idx ? "auto" : "none",
    zIndex: currentSection === idx ? 20 : 5,
    willChange: "opacity, transform",
  });

  const lineLeft = leftClicked ? "calc(100% - 48px)" : rightClicked ? "48px" : "50%";

  const labelChars = (str: string, size: string, align: "left" | "right") =>
    str.split("").map((char, i) => (
      <span key={i} style={{
        fontFamily: "'Bebas Neue', sans-serif", fontSize: size, fontWeight: "700",
        display: "inline-block", transform: "scaleX(1.5)",
        letterSpacing: "0.25em", lineHeight: 1.05, whiteSpace: "pre",
        background: "linear-gradient(135deg, #C8D8E8 0%, #A8C4D8 40%, #90B8D0 70%, #B0C8DC 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        animation: currentSection === 1 ? `letterDrop 0.4s cubic-bezier(0.22,1,0.36,1) ${0.5 + i * 0.055}s both` : "none",
      }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      <div ref={bgRef} className="absolute inset-0" style={{ background: "#050D1F", zIndex: 0 }} />

      {/* ── SECTION 1: HERO ── */}
      <div style={sectionStyle(0)}>
        <div ref={leftConicRef} className="absolute inset-y-0 left-0 w-1/2 pointer-events-none"
          style={{ background: "conic-gradient(from 270deg at 50% 50%, #FFFFFF 0.3deg, #00EEFF 33deg, #1A6FFF 101deg, #020A1E 185deg, #050D1F 360deg)", height: "120%", top: "-10%", transform: "scaleX(-1)" }} />
        <div ref={rightConicRef} className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
          style={{ background: "conic-gradient(from 270deg at 50% 50%, #FFFFFF 0.3deg, #00EEFF 33deg, #1A6FFF 101deg, #020A1E 185deg, #050D1F 360deg)", height: "120%", top: "-10%" }} />
        <div ref={leftLinearRef} className="absolute inset-y-0 left-0 w-1/2 pointer-events-none"
          style={{ background: "linear-gradient(180deg, #050D1F 0%, rgba(5,13,31,0) 35%, rgba(5,13,31,0) 100%)" }} />
        <div ref={rightLinearRef} className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
          style={{ background: "linear-gradient(180deg, #050D1F 0%, rgba(5,13,31,0) 35%, rgba(5,13,31,0) 100%)" }} />

        <div className="relative flex flex-col items-center text-center px-4 w-full"
          style={{ transform: "translateY(-90px)", zIndex: 10, animation: "heroZoomIn 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both" }}>
          <h1 className="leading-tight" style={{ fontFamily: "'Italiana', serif", fontSize: "clamp(2.5rem, 10vw, 6rem)", maxWidth: "1183px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.25em" }}>
            {["WE", "BUILD", "DIGITAL", "EXPERIENCES"].map((word) => (
              <span key={word} style={{ background: "linear-gradient(90deg, #FFFFFF 0%, #A8EDFF 40%, #C4B5FD 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "inline-block", filter: "drop-shadow(0 0 18px rgba(0,229,255,0.35))", WebkitTextStrokeWidth: "1px", WebkitTextStrokeColor: "rgba(168,237,255,0.6)" }}>
                {word}
              </span>
            ))}
          </h1>
          <p className="mt-6 text-[#C0C0C0]" style={{ fontFamily: "'Jersey 10', sans-serif", fontSize: "clamp(1rem, 2.5vw, 2.25rem)", letterSpacing: "0.15em" }}>
            W h e r e &nbsp; P e r f o r m a n c e &nbsp; M e e t s &nbsp; D e s i g n .
          </p>
        </div>

        <p className="absolute z-10 text-white text-center px-4" style={{ fontFamily: "Calibri, 'Segoe UI', Arial, sans-serif", fontSize: "clamp(0.9rem, 2vw, 1.5rem)", bottom: "3.5rem" }}>
          Mobile Applications &amp; Web Systems Built for Modern Businesses.
        </p>

        <div className="absolute left-1/2 z-20" style={{ bottom: "1.2rem", transform: "translateX(-50%)", animation: "bounce 1.4s ease-in-out infinite" }}>
          <div style={{ width: 20, height: 20, borderRight: "1.5px solid #00EEFF", borderBottom: "1.5px solid #00EEFF", transform: "rotate(45deg)", opacity: 0.7 }} />
        </div>
      </div>

      {/* ── SECTION 2 ── */}
      <div style={{ ...sectionStyle(1) }}>
        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>

          {/* ── DARK OVERLAY left→right sweep ── */}
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: 0,
            width: leftClicked ? "calc(100% - 48px)" : "0%",
            background: "rgba(2,8,24,0.88)",
            transition: "width 0.65s cubic-bezier(0.4,0,0.2,1)",
            pointerEvents: "none", zIndex: 8,
          }} />
          {/* ── DARK OVERLAY right→left sweep ── */}
          <div style={{
            position: "absolute", top: 0, bottom: 0, right: 0,
            width: rightClicked ? "calc(100% - 48px)" : "0%",
            background: "rgba(2,8,24,0.88)",
            transition: "width 0.65s cubic-bezier(0.4,0,0.2,1)",
            pointerEvents: "none", zIndex: 8,
          }} />

          {/* ── NEON LINE ── */}
          <div style={{
            position: "absolute", top: 0,
            left: lineLeft,
            transform: "translateX(-50%)",
            width: "1px", height: "100%",
            background: "linear-gradient(180deg, transparent 0%, #00E5FF 20%, #00E5FF 80%, transparent 100%)",
            boxShadow: "0 0 6px 1px rgba(0,229,255,0.6), 0 0 18px 2px rgba(0,229,255,0.25)",
            transition: "left 0.65s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 16, pointerEvents: "none",
          }} />

          {/* ── CARD ROW — full width from left edge to neon line (LEFT clicked) ── */}
          {leftClicked && (
            <div style={{
              position: "absolute", top: 0, bottom: 0,
              left: 0,
              width: "calc(100% - 48px)",
              display: "flex", flexDirection: "row", alignItems: "center",
              gap: "10px", padding: "0 12px",
              zIndex: 18, pointerEvents: "none",
            }}>
              {/* Mobile image — natural size */}
              <div style={{
                flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "dealCard 0.4s cubic-bezier(0.22,1,0.36,1) 0s both",
              }}>
                <img src="/src/assets/mobile.png" alt="Mobile app" style={{
                  height: "72vh", width: "auto", objectFit: "contain",
                  filter: "drop-shadow(0 20px 50px rgba(0,200,255,0.3))",
                  pointerEvents: "none", display: "block",
                }} />
              </div>

              {/* 4 Project cards — fill remaining space to neon line */}
              <div style={{ flex: 1, display: "flex", gap: "10px", height: "72vh", pointerEvents: "auto" }}>
                {projects.map((proj, idx) => <ProjectCard key={idx} proj={proj} idx={idx} />)}
              </div>
            </div>
          )}

          {/* ── CARD ROW — full width from neon line to right edge (RIGHT clicked) ── */}
          {rightClicked && (
            <div style={{
              position: "absolute", top: 0, bottom: 0,
              right: 0,
              width: "calc(100% - 48px)",
              display: "flex", flexDirection: "row", alignItems: "center",
              gap: "10px", padding: "0 0 0 12px",
              zIndex: 18, pointerEvents: "none",
            }}>
              {/* 4 Web project cards — fill space from neon line to laptop image */}
              <div style={{ flex: 1, display: "flex", gap: "10px", height: "72vh", pointerEvents: "auto" }}>
                {webProjects.map((proj, idx) => <ProjectCard key={idx} proj={proj} idx={idx} />)}
              </div>

              {/* Laptop image — natural size, on the right */}
              <div style={{
                flexShrink: 0,
                position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "dealCardRight 0.4s cubic-bezier(0.22,1,0.36,1) 0s both",
              }}>
                <img src="/src/assets/laptop.png" alt="Laptop app" style={{
                  height: "65vh", width: "auto", objectFit: "contain",
                  filter: "drop-shadow(0 20px 50px rgba(100,150,255,0.3))",
                  pointerEvents: "none", display: "block",
                }} />
                {/* New overlay text on image when rightClicked */}
                <div style={{
                  position: "absolute", top: "31%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#000080",
                  fontWeight: "700",
                  fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                  pointerEvents: "none",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "textIn 0.6s ease both",
                }}>
                  ON EVERY SCREEN
                </div>
              </div>
            </div>
          )}

          {/* ── LEFT HALF ── */}
          <div
            style={{ flex: 1, height: "100%", cursor: rightClicked ? "default" : "pointer", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => { if (rightClicked) return; setLeftClicked(prev => !prev); setRightClicked(false); }}
          >
            {/* Left image wrapper — when not clicked: centered. When clicked: becomes card row */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              transform: rightClicked ? "translateX(-130%)" : "translateX(0%)",
              transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
              zIndex: 2,
            }}>

              {/* ── DEFAULT STATE: centered mobile image ── */}
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: leftClicked ? 0 : 1,
                transition: "opacity 0.4s ease",
                pointerEvents: "none",
              }}>
                <img src="/src/assets/mobile.png" alt="Mobile app" style={{
                  height: "72vh", width: "auto", objectFit: "contain",
                  animation: currentSection === 1 ? "slideFromBottom 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both" : "none",
                  filter: "drop-shadow(0 20px 50px rgba(0,200,255,0.3))",
                  pointerEvents: "none", display: "block",
                }} />
              </div>


            </div>

            {/* "IN YOUR POCKET" normal label */}
            <div style={{
              position: "absolute", top: "50%", left: "35px",
              transform: "translateY(-50%)",
              display: "flex", flexDirection: "column", alignItems: "flex-start",
              pointerEvents: "none",
              opacity: leftClicked || rightClicked ? 0 : 1,
              transition: "opacity 0.35s ease",
              zIndex: 17,
            }}>
              {labelChars("IN YOUR POCKET", "2.6rem", "right")}
            </div>
          </div>

          {/* ── RIGHT HALF ── */}
          <div
            style={{ flex: 1, height: "100%", cursor: leftClicked ? "default" : "pointer", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => { if (leftClicked) return; setRightClicked(prev => !prev); setLeftClicked(false); }}
          >
            {/* Right image wrapper */}
            <div style={{
              position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
              width: "100%", height: "100%",
              transform: rightClicked ? "translateX(130%)" : leftClicked ? "translateX(130%)" : "translateX(0%)",
              transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
              zIndex: 2,
            }}>
              <img src="/src/assets/laptop.png" alt="Laptop app" style={{
                height: "65vh", width: "auto", objectFit: "contain",
                animation: currentSection === 1 ? "slideFromTop 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both" : "none",
                filter: "drop-shadow(0 20px 50px rgba(100,150,255,0.3))",
                pointerEvents: "none", display: "block", position: "relative", zIndex: 2,
              }} />
              {/* Overlay text on right image */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                opacity: rightClicked ? 0 : 1,
                transition: "opacity 0.6s ease 0.25s",
                pointerEvents: "none", zIndex: 10,
                textAlign: "center", width: "100%", padding: "2rem 1.5rem",
              }}>
              </div>
            </div>

            {/* "ON EVERY SCREEN" normal label */}
            <div style={{
              position: "absolute", top: "50%", right: "43px",
              transform: "translateY(-50%)",
              display: "flex", flexDirection: "column", alignItems: "flex-end",
              pointerEvents: "none",
              opacity: leftClicked || rightClicked ? 0 : 1,
              transition: "opacity 0.35s ease",
              zIndex: 17,
            }}>
              {labelChars("ON EVERY SCREEN", "2.6rem", "left")}
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              EDGE LABEL: "ON EVERY SCREEN" at right edge
              — visible when LEFT clicked
              — clickable: switches to right state
              ══════════════════════════════════════════════ */}
          <div
            onClick={(e) => { e.stopPropagation(); setRightClicked(true); setLeftClicked(false); }}
            onMouseEnter={() => setHoverEdgeLabel(true)}
            onMouseLeave={() => setHoverEdgeLabel(false)}
            style={{
              position: "absolute", top: "50%", right: "10px",
              transform: `translateY(-50%) ${leftClicked && hoverEdgeLabel ? "translateX(-4px)" : "translateX(0px)"}`,
              display: "flex", flexDirection: "column", alignItems: "flex-end",
              cursor: leftClicked ? "pointer" : "default",
              opacity: leftClicked ? 1 : 0,
              transition: "opacity 0.5s ease 0.35s, transform 0.3s ease, filter 0.3s ease",
              filter: leftClicked && hoverEdgeLabel ? "drop-shadow(0 0 10px rgba(0,229,255,0.9)) brightness(1.4)" : "none",
              zIndex: 25,
            }}
          >
            {"ON EVERY SCREEN".split("").map((char, i) => (
              <span key={i} style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.05rem", fontWeight: "700",
                display: "inline-block", transform: "scaleX(1.5)",
                letterSpacing: "0.2em", lineHeight: 1.1, whiteSpace: "pre",
                background: "linear-gradient(135deg, #C8D8E8 0%, #A8C4D8 40%, #90B8D0 70%, #B0C8DC 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
            {/* Hover hint arrow */}
            {leftClicked && (
              <div style={{
                marginTop: "6px",
                opacity: hoverEdgeLabel ? 1 : 0,
                transition: "opacity 0.2s ease",
                display: "flex", justifyContent: "flex-end",
              }}>
                <div style={{ width: 10, height: 10, borderRight: "1.5px solid #00EEFF", borderBottom: "1.5px solid #00EEFF", transform: "rotate(-45deg)", opacity: 0.85 }} />
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════
              EDGE LABEL: "IN YOUR POCKET" at left edge
              — visible when RIGHT clicked
              — clickable: switches to left state
              ══════════════════════════════════════════════ */}
          <div
            onClick={(e) => { e.stopPropagation(); setLeftClicked(true); setRightClicked(false); }}
            onMouseEnter={() => setHoverEdgeLabel(true)}
            onMouseLeave={() => setHoverEdgeLabel(false)}
            style={{
              position: "absolute", top: "50%", left: "10px",
              transform: `translateY(-50%) ${rightClicked && hoverEdgeLabel ? "translateX(4px)" : "translateX(0px)"}`,
              display: "flex", flexDirection: "column", alignItems: "flex-start",
              cursor: rightClicked ? "pointer" : "default",
              opacity: rightClicked ? 1 : 0,
              transition: "opacity 0.5s ease 0.35s, transform 0.3s ease, filter 0.3s ease",
              filter: rightClicked && hoverEdgeLabel ? "drop-shadow(0 0 10px rgba(0,229,255,0.9)) brightness(1.4)" : "none",
              zIndex: 25,
            }}
          >
            {/* Hover hint arrow */}
            {rightClicked && (
              <div style={{
                marginBottom: "6px",
                opacity: hoverEdgeLabel ? 1 : 0,
                transition: "opacity 0.2s ease",
              }}>
                <div style={{ width: 10, height: 10, borderLeft: "1.5px solid #00EEFF", borderTop: "1.5px solid #00EEFF", transform: "rotate(-45deg)", opacity: 0.85 }} />
              </div>
            )}
            {"IN YOUR POCKET".split("").map((char, i) => (
              <span key={i} style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.05rem", fontWeight: "700",
                display: "inline-block", transform: "scaleX(1.5)",
                letterSpacing: "0.2em", lineHeight: 1.1, whiteSpace: "pre",
                background: "linear-gradient(135deg, #C8D8E8 0%, #A8C4D8 40%, #90B8D0 70%, #B0C8DC 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>

          {/* ══════════════════════════════════════════════
              EXITED IMAGE ZONE (right side when left clicked)
              — hoverable + clickable to reset
              ══════════════════════════════════════════════ */}
          {leftClicked && (
            <div
              onClick={(e) => { e.stopPropagation(); setLeftClicked(false); setRightClicked(false); }}
              onMouseEnter={() => setHoverExitedImg(true)}
              onMouseLeave={() => setHoverExitedImg(false)}
              style={{
                position: "absolute", top: 0, right: 0,
                width: "48px", height: "100%",
                cursor: "pointer",
                zIndex: 24,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {/* Pulsing glow hint on hover */}
              <div style={{
                width: "2px", height: "60%",
                background: "linear-gradient(180deg, transparent, rgba(0,229,255,0.6), transparent)",
                opacity: hoverExitedImg ? 1 : 0,
                transition: "opacity 0.3s ease",
                animation: hoverExitedImg ? "pulseGlow 1.2s ease-in-out infinite" : "none",
                borderRadius: "2px",
              }} />
            </div>
          )}

          {/* ══════════════════════════════════════════════
              EXITED IMAGE ZONE (left side when right clicked)
              — hoverable + clickable to reset
              ══════════════════════════════════════════════ */}
          {rightClicked && (
            <div
              onClick={(e) => { e.stopPropagation(); setLeftClicked(false); setRightClicked(false); }}
              onMouseEnter={() => setHoverExitedImg(true)}
              onMouseLeave={() => setHoverExitedImg(false)}
              style={{
                position: "absolute", top: 0, left: 0,
                width: "48px", height: "100%",
                cursor: "pointer",
                zIndex: 24,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <div style={{
                width: "2px", height: "60%",
                background: "linear-gradient(180deg, transparent, rgba(0,229,255,0.6), transparent)",
                opacity: hoverExitedImg ? 1 : 0,
                transition: "opacity 0.3s ease",
                animation: hoverExitedImg ? "pulseGlow 1.2s ease-in-out infinite" : "none",
                borderRadius: "2px",
              }} />
            </div>
          )}

        </div>
      </div>

      {/* ── SECTION 3 ── */}
      <div style={{ ...sectionStyle(2) }}>
        <div className="text-center px-8">
          <h2 className="text-[#00F2FF] mb-4" style={{ fontFamily: "'Italiana', serif", fontSize: "clamp(2rem, 6vw, 4rem)" }}>Let's Create Together</h2>
          <p className="text-[#C0C0C0] max-w-xl mx-auto" style={{ fontFamily: "Calibri, 'Segoe UI', Arial, sans-serif", fontSize: "1.15rem", lineHeight: 1.7 }}>
            Reach out and let's build something unforgettable for your users.
          </p>
        </div>
      </div>

      {/* ── DOT NAV ── */}
      <div className="fixed right-6 top-1/2 z-50 flex flex-col gap-3" style={{ transform: "translateY(-50%)" }}>
        {[0, 1, 2].map((i) => (
          <button key={i}
            onClick={() => { if (!isAnimating && i !== currentSection) { setIsAnimating(true); setCurrentSection(i); setTimeout(() => setIsAnimating(false), 900); } }}
            style={{ width: i === currentSection ? 10 : 6, height: i === currentSection ? 10 : 6, borderRadius: "50%", background: i === currentSection ? "#00F2FF" : "rgba(255,255,255,0.3)", border: i === currentSection ? "none" : "1px solid rgba(255,255,255,0.2)", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)", cursor: "pointer", padding: 0 }} />
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.7; }
          50%       { transform: translateX(-50%) translateY(6px); opacity: 0.2; }
        }
        @keyframes heroZoomIn {
          0%   { opacity: 0; transform: scale(0.97) translateY(-96px); }
          100% { opacity: 1; transform: scale(1) translateY(-90px); }
        }
        @keyframes slideFromBottom {
          0%   { opacity: 0; transform: translateY(80px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes slideFromTop {
          0%   { opacity: 0; transform: translateY(-80px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes dealCardRight {
          0%   { opacity: 0; transform: translateX(60px) scale(0.92); }
          100% { opacity: 1; transform: translateX(0px) scale(1); }
        }
        @keyframes dealCard {
          0%   { opacity: 0; transform: translateX(-60px) scale(0.92); }
          100% { opacity: 1; transform: translateX(0px) scale(1); }
        }
        @keyframes letterDrop {
          0%   { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes textIn {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes textOut {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scaleY(0.9); }
          50%       { opacity: 1;   transform: scaleY(1.1); }
        }
      `}</style>
    </div>
  );
}