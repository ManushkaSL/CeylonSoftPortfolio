import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X, Sparkles, Code2, GraduationCap, Compass, Layers } from "lucide-react";

interface VerticalDynamicIslandProps {
  currentSection: number;
  onNavigate: (sectionIndex: number) => void;
}

const SECTIONS = [
  { id: 0, label: "HERO", title: "Systems Command", icon: Compass },
  { id: 1, label: "PROJECTS", title: "Web & Mobile Deck", icon: Layers },
  { id: 2, label: "ABOUT", title: "Manushka · CS @ UOJ", icon: GraduationCap },
  { id: 3, label: "CONTACT", title: "Let's Connect", icon: Sparkles },
];

const FUN_FACTS = [
  "🎓 CS Undergrad @ University of Jaffna",
  "🎮 Passionate about Game & Interactive Tech",
  "⚡ Building Full-Stack Web & Mobile Systems",
  "💡 Loves turning bold ideas into reality",
];

export const VerticalDynamicIsland: React.FC<VerticalDynamicIslandProps> = ({
  currentSection,
  onNavigate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [faceMood, setFaceMood] = useState<"idle" | "blink" | "happy" | "wink" | "curious">("idle");
  const [factIndex, setFactIndex] = useState(0);
  const islandRef = useRef<HTMLDivElement>(null);

  // Blinking and random expression loop for the cute cyber companion
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setFaceMood((prev) => {
        if (prev === "idle") {
          // 70% normal blink, 15% wink, 15% curious
          const rand = Math.random();
          if (rand < 0.65) return "blink";
          if (rand < 0.85) return "wink";
          return "curious";
        }
        return "idle";
      });

      // Reset back to idle after quick expression
      setTimeout(() => {
        setFaceMood("idle");
      }, 250);
    }, 3600);

    return () => clearInterval(blinkInterval);
  }, []);

  // Rotate fun facts periodically
  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % FUN_FACTS.length);
    }, 4500);
    return () => clearInterval(factInterval);
  }, []);

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  const activeSection = SECTIONS[currentSection] || SECTIONS[0];

  const handleSelectSection = (idx: number) => {
    setFaceMood("happy");
    onNavigate(idx);
    setTimeout(() => {
      setIsExpanded(false);
      setFaceMood("idle");
    }, 280);
  };

  return (
    <div
      ref={islandRef}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50 select-none"
    >
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 28,
          mass: 0.8,
        }}
        onClick={() => {
          if (!isExpanded) {
            setIsExpanded(true);
            setFaceMood("happy");
          }
        }}
        className={`relative bg-[#020614]/95 backdrop-blur-2xl border border-cyan-400/30 border-l-0 shadow-[4px_0_30px_rgba(0,238,255,0.18)] cursor-pointer overflow-hidden transition-colors ${
          isExpanded
            ? "w-[270px] min-h-[390px] rounded-r-3xl p-5"
            : "w-[48px] h-[280px] rounded-r-2xl py-3.5 flex flex-col items-center justify-between hover:border-cyan-400/50 hover:shadow-[6px_0_35px_rgba(0,238,255,0.28)]"
        }`}
      >
        {/* Luminous laser accent border along the curved right edge */}
        <div className="absolute right-0 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-transparent via-[#00EEFF] to-transparent pointer-events-none opacity-60" />

        {/* ── COLLAPSED VIEW (Hugging left screen border) ── */}
        {!isExpanded ? (
          <div className="h-full flex flex-col items-center justify-between w-full">
            {/* Top Head: Animated Cute Cyber Face */}
            <div
              className="flex flex-col items-center group/head cursor-pointer"
              title="Click to expand Island"
            >
              {/* Cute Cyber Ears / Antennas */}
              <div className="flex gap-2.5 mb-0.5">
                <span className="w-1 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="w-1 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              {/* Face Visor Container */}
              <div className="w-8 h-7 rounded-xl bg-cyan-950/70 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,238,255,0.3)] group-hover/head:scale-110 transition-transform">
                {/* Dynamic Cyber Eyes */}
                {faceMood === "blink" ? (
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-0.5 bg-cyan-300 rounded-full" />
                    <span className="w-1.5 h-0.5 bg-cyan-300 rounded-full" />
                  </div>
                ) : faceMood === "wink" ? (
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_6px_#00EEFF]" />
                    <span className="w-1.5 h-0.5 bg-cyan-300 rounded-full" />
                  </div>
                ) : faceMood === "happy" ? (
                  <div className="flex gap-1 items-center text-[10px] text-cyan-300 font-bold">
                    <span>^</span>
                    <span className="text-[7px] text-cyan-400 mb-0.5">‿</span>
                    <span>^</span>
                  </div>
                ) : faceMood === "curious" ? (
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_6px_#00EEFF]" />
                    <span className="w-1 h-1 bg-cyan-300 rounded-full" />
                  </div>
                ) : (
                  /* Idle Open Eyes with smile */
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#00EEFF]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#00EEFF]" />
                    </div>
                    <span className="w-2 h-0.5 rounded-full bg-cyan-400/60" />
                  </div>
                )}
              </div>
            </div>

            {/* Vertical Spine: Active Section Label */}
            <div
              className="flex-1 my-3 flex items-center justify-center"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              <span className="text-[11px] font-mono tracking-[0.24em] text-cyan-300 uppercase font-semibold drop-shadow-[0_0_8px_rgba(0,238,255,0.4)]">
                {activeSection.label}
              </span>
            </div>

            {/* Bottom Status Dot */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-mono text-cyan-400/60">
                0{currentSection + 1}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00EEFF] shadow-[0_0_8px_#00EEFF] animate-pulse" />
            </div>
          </div>
        ) : (
          /* ── EXPANDED DYNAMIC ISLAND ── */
          <div className="relative flex flex-col justify-between h-full space-y-4">
            {/* Top Bar: Cute Companion Expanded + Title + Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <div className="flex items-center gap-3">
                {/* Expanded Cute Face */}
                <div className="w-10 h-9 rounded-xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_14px_rgba(0,238,255,0.35)]">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#00EEFF]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#00EEFF]" />
                    </div>
                    <span className="w-2.5 h-0.5 rounded-full bg-cyan-400" />
                  </div>
                </div>

                <div>
                  <div className="text-white font-medium text-sm leading-tight flex items-center gap-1.5">
                    <span>MANUSHKA</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00EEFF] animate-ping" />
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400/80">
                    DYNAMIC SYSTEM NAV
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="w-7 h-7 rounded-lg bg-cyan-950/50 border border-cyan-400/30 flex items-center justify-center text-cyan-300 hover:text-white hover:border-cyan-400 transition-colors"
                aria-label="Collapse island"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Navigation Menu Links */}
            <div className="space-y-1.5">
              {SECTIONS.map((sec) => {
                const IconComponent = sec.icon;
                const isActive = sec.id === currentSection;

                return (
                  <button
                    key={sec.id}
                    onClick={() => handleSelectSection(sec.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                      isActive
                        ? "bg-cyan-950/70 border border-cyan-400/50 text-white shadow-[0_0_15px_rgba(0,238,255,0.2)]"
                        : "text-slate-300 hover:bg-white/[0.04] hover:text-cyan-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-cyan-400/20 text-cyan-300"
                            : "bg-white/[0.04] text-slate-400 group-hover:text-cyan-300"
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-medium tracking-wide">
                          {sec.label}
                        </div>
                        <div className="text-[10px] text-slate-400 group-hover:text-cyan-200/70">
                          {sec.title}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-cyan-400/60">
                        0{sec.id + 1}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00EEFF] shadow-[0_0_6px_#00EEFF]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Rotating Micro Fun-Fact */}
            <div className="pt-2.5 border-t border-cyan-500/15">
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400/70 uppercase tracking-wider mb-1">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                <span>LIVE TELEMETRY // FACT</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={factIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.35 }}
                  className="text-[11px] text-slate-300 font-sans leading-tight line-clamp-2"
                >
                  {FUN_FACTS[factIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

