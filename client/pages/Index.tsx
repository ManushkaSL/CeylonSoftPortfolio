import React, { useEffect, useRef, useState } from "react";

export default function Index() {
  const leftConicRef  = useRef<HTMLDivElement>(null);
  const rightConicRef = useRef<HTMLDivElement>(null);
  const leftLinearRef  = useRef<HTMLDivElement>(null);
  const rightLinearRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating]       = useState(false);
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
  <div style={{ ...sectionStyle(1) }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        backgroundImage: "url('/left.png')",
        backgroundSize: "75% 100%",
        backgroundPosition: "left",
        backgroundRepeat: "no-repeat",
        animation: currentSection === 1 ? "slideFromBottom 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both" : "none",
        zIndex: 4,
        pointerEvents: "none",
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
        animation: currentSection === 1 ? "slideFromTop 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both" : "none",
        zIndex: 3,
        pointerEvents: "none",
      }}
  />
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