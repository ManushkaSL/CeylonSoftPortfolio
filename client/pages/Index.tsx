import React, { useEffect, useRef, useState } from "react";

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
  const totalSections = 3;

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
    if (currentSection !== 1) { }
  }, [currentSection]);

  // Pixel detection for hover
  useEffect(() => {
    const loadImages = async () => {
      try {
        const leftImg = leftImgRef.current;
        const rightImg = rightImgRef.current;
        if (!leftImg || !rightImg) return;

        // Load left image
        await new Promise((resolve, reject) => {
          leftImg.onload = resolve;
          leftImg.onerror = reject;
          leftImg.src = "/left.png";
          leftImg.crossOrigin = "anonymous";
        });

        // Load right image
        await new Promise((resolve, reject) => {
          rightImg.onload = resolve;
          rightImg.onerror = reject;
          rightImg.src = "/right.png";
          rightImg.crossOrigin = "anonymous";
        });

        // Create canvases for pixel detection
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
      return imageData.data[3] < 128; // alpha channel
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

    // For left image: positioned at left with 75% size
    const leftImgX = Math.round((x / (rect.width * 0.75)) * leftCanvas.width);
    const leftImgY = Math.round((y / rect.height) * leftCanvas.height);

    // For right image: positioned at right with 78% size
    // Right image starts at: rect.width - (rect.width * 0.78)
    const rightStart = rect.width * (1 - 0.78);
    const rightImgX = Math.round(((x - rightStart) / (rect.width * 0.78)) * rightCanvas.width);
    const rightImgY = Math.round((y / rect.height) * rightCanvas.height);

    const leftTransparent = isPixelTransparent(leftCanvas, leftImgX, leftImgY);
    const rightTransparent = isPixelTransparent(rightCanvas, rightImgX, rightImgY);

    // Prioritize left image if both are non-transparent (since it has higher zIndex)
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
      setTimeout(() => setProjectsType("web"), 500);
    } else if (hoveredImage === "right") {
      setSection2Clicked(true);
      setTimeout(() => setProjectsType("mobile"), 500);
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
    position: "absolute", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: currentSection === idx ? 1 : 0,
    transform: getTransform(idx),
    transition: "opacity 0.75s cubic-bezier(0.4,0,0.2,1), transform 0.75s cubic-bezier(0.4,0,0.2,1)",
    pointerEvents: currentSection === idx ? "auto" : "none",
    zIndex: currentSection === idx ? 20 : 5,
    willChange: "opacity, transform",
  });

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
              <span key={word} style={{ background: "linear-gradient(90deg, #4A5568 0%, #2D3748 40%, #1A202C 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "inline-block", filter: "drop-shadow(0 0 18px rgba(0,229,255,0.2))", WebkitTextStrokeWidth: "1px", WebkitTextStrokeColor: "rgba(74,85,104,0.6)" }}>
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
  <div 
    ref={section2Ref}
    onMouseMove={handleMouseMoveSection2}
    onMouseLeave={handleMouseLeaveSection2}
    onClick={handleSection2Click}
    style={{ ...sectionStyle(1), cursor: hoveredImage === "left" || hoveredImage === "right" ? "pointer" : "default" }}
  >
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
            : (currentSection === 1 && !hasReturnedFromProjects ? "slideFromBottom 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both" : "none"),
        zIndex: 4,
        pointerEvents: "none",
        filter: hoveredImage === "left" ? "brightness(1.15)" : "brightness(1)",
        transform: hoveredImage === "left" ? "scale(1.05)" : "scale(1)",
        transition: "filter 0.3s ease-out, transform 0.3s ease-out",
      }}
    />
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
            : (currentSection === 1 && !hasReturnedFromProjects ? "slideFromTop 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both" : "none"),
        zIndex: 3,
        pointerEvents: "none",
        filter: hoveredImage === "right" ? "brightness(1.15)" : "brightness(1)",
        transform: hoveredImage === "right" ? "scale(1.05)" : "scale(1)",
        transition: "filter 0.3s ease-out, transform 0.3s ease-out",
      }}
    />

    {/* Hidden images for pixel detection */}
    <img ref={leftImgRef} style={{ display: "none" }} alt="left" />
    <img ref={rightImgRef} style={{ display: "none" }} alt="right" />
    <canvas ref={leftCanvasRef} style={{ display: "none" }} />
    <canvas ref={rightCanvasRef} style={{ display: "none" }} />
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

      {/* ── PROJECTS MODAL ── */}
      {projectsType && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(5, 13, 31, 0.95)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: isClosingProjects ? "fadeOut 0.4s ease-out" : "fadeIn 0.6s ease-out",
          backdropFilter: "blur(4px)",
        }}>
          <div style={{
            width: "100vw",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: "6rem",
            animation: "popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
            <h1 style={{
              textAlign: "center",
              color: "#00F2FF",
              fontFamily: "'Italiana', serif",
              fontSize: "clamp(2rem, 6vw, 4rem)",
              marginBottom: "3rem",
              animation: "slideDown 0.8s ease-out",
            }}>
              {projectsType === "web" ? "Web Projects" : "Mobile Projects"}
            </h1>

            <div style={{
              position: "relative",
              width: "100%",
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}>
              {(projectsType === "web"
                ? [
                    { title: "E-Commerce Platform", desc: "Full-stack React & Node.js" },
                    { title: "Analytics Dashboard", desc: "Real-time data visualization" },
                    { title: "CMS System", desc: "Headless content management" },
                    { title: "Admin Dashboard", desc: "User management system" },
                    { title: "Blog Engine", desc: "SEO-optimized publishing" },
                  ]
                : [
                    { title: "Fitness Tracker App", desc: "React Native cross-platform" },
                    { title: "Social Feed App", desc: "Real-time messaging system" },
                    { title: "Weather Forecast", desc: "Live weather updates" },
                    { title: "Music Streaming", desc: "Audio streaming platform" },
                    { title: "Task Manager", desc: "Productivity & collaboration" },
                  ]
              ).map((project, idx) => {
                // Final positions: Card1(left), Card3(center-left), Card5(center), Card4(center-right), Card2(right)
                // Index mapping: 0=Card1, 1=Card2, 2=Card3, 3=Card4, 4=Card5
                const finalOrder = [0, 2, 4, 3, 1]; // Order they appear in final layout
                const finalPosition = finalOrder.indexOf(idx);
                const cardSpacing = 320; // pixels between each card center
                const centerOffset = (finalPosition - 2) * cardSpacing; // -2 to center Card5

                let animationName = "";
                if (idx === 0 || idx === 1) {
                  animationName = "cardStage1";
                } else if (idx === 2 || idx === 3) {
                  animationName = "cardStage2";
                } else if (idx === 4) {
                  animationName = "cardStage3";
                }

                let startOffset = centerOffset;
                // For first stage cards, calculate starting position close to center
                // Using same spacing as final layout (320px between cards)
                if (idx === 0 || idx === 2) {
                  startOffset = -160; // Card 1 & 3 start with 320px spacing
                } else if (idx === 1 || idx === 3) {
                  startOffset = 160; // Card 2 & 4 start with 320px spacing
                }

                return (
                    <div
                      key={idx}
                      style={{
                        position: "absolute",
                        width: "300px",
                        height: "260px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, rgba(0, 242, 255, 0.1), rgba(26, 111, 255, 0.1))",
                        border: "1px solid rgba(0, 242, 255, 0.2)",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        boxSizing: "border-box",
                        animation: `${animationName} 4.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                        transition: "all 0.3s ease-out",
                        cursor: "pointer",
                        "--startX": `${startOffset}px`,
                        "--finalX": `${centerOffset}px`,
                      } as React.CSSProperties & { "--startX": string; "--finalX": string }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#00F2FF";
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(0, 242, 255, 0.2), rgba(26, 111, 255, 0.2))";
                      e.currentTarget.style.transform = "translateY(-10px)";
                      e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 242, 255, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(0, 242, 255, 0.2)";
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(0, 242, 255, 0.1), rgba(26, 111, 255, 0.1))";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                      <h2 style={{ color: "#00F2FF", marginBottom: "0.5rem", fontFamily: "'Italiana', serif", fontSize: "1.5rem" }}>
                        {project.title}
                      </h2>
                      <p style={{ color: "#C0C0C0", fontFamily: "Calibri, 'Segoe UI', Arial", fontSize: "0.95rem" }}>
                        {project.desc}
                      </p>
                    </div>
                  );
              })}
            </div>
            
            <button
              onClick={closeProjectsModal}
              style={{
                position: "absolute",
                bottom: "3rem",
                left: "50%",
                transform: "translateX(-50%)",
                background: "linear-gradient(135deg, rgba(0, 242, 255, 0.15), rgba(26, 111, 255, 0.15))",
                border: "2px solid #00F2FF",
                color: "#00F2FF",
                padding: "0.75rem 2rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontFamily: "'Italiana', serif",
                fontWeight: "bold",
                letterSpacing: "0.1em",
                transition: "all 0.3s ease-out",
                marginTop: "2rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(0, 242, 255, 0.3), rgba(26, 111, 255, 0.3))";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 242, 255, 0.4)";
                e.currentTarget.style.transform = "translateX(-50%) scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(0, 242, 255, 0.15), rgba(26, 111, 255, 0.15))";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateX(-50%) scale(1)";
              }}
            >
              Change Platform
            </button>
          </div>
        </div>
      )}

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
          0%   { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slideDown {
          0%   { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          0%   { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardStage1 {
          0% {
            opacity: 0;
            transform: scale(0.4) translateX(var(--startX));
          }
          10% {
            opacity: 1;
            transform: scale(1) translateX(var(--startX));
          }
          35% {
            transform: scale(1) translateX(var(--startX));
          }
          100% {
            transform: scale(1) translateX(var(--finalX));
          }
        }
        @keyframes cardStage2 {
          0% {
            opacity: 0;
            transform: scale(0.4) translateX(var(--startX));
          }
          35% {
            opacity: 0;
            transform: scale(0.4) translateX(var(--startX));
          }
          50% {
            opacity: 1;
            transform: scale(1) translateX(var(--startX));
          }
          100% {
            transform: scale(1) translateX(var(--finalX));
          }
        }
        @keyframes cardStage3 {
          0% {
            opacity: 0;
            transform: scale(0.4) translateX(0);
          }
          75% {
            opacity: 0;
            transform: scale(0.4) translateX(0);
          }
          90% {
            opacity: 1;
            transform: scale(1) translateX(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateX(0);
          }
        }
      `}</style>
    </div>
  );
}