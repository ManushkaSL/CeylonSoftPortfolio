import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Compass, Layers, GraduationCap, MessageSquare, Bot } from "lucide-react";
import { PixelCharacter } from "./pixel/PixelCharacter";
import { PixelCloudBubble } from "./pixel/PixelCloudBubble";
import { PixelChatPanel } from "./pixel/PixelChatPanel";
import { usePixelBehavior } from "./pixel/usePixelBehavior";
import { FUN_FACTS } from "@/utils/pixelKnowledge";

interface VerticalDynamicIslandProps {
  currentSection: number;
  onNavigate: (sectionIndex: number) => void;
  projectsType?: "web" | "mobile" | null;
}

const SECTIONS = [
  { id: 0, label: "HERO", title: "Systems Command", icon: Compass },
  { id: 1, label: "PROJECTS", title: "Web & Mobile Deck", icon: Layers },
  { id: 2, label: "ABOUT", title: "Manushka · CS @ UOJ", icon: GraduationCap },
  { id: 3, label: "CONTACT", title: "Let's Connect", icon: Sparkles },
];

export const VerticalDynamicIsland: React.FC<VerticalDynamicIslandProps> = ({
  currentSection,
  onNavigate,
  projectsType,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const islandRef = useRef<HTMLDivElement>(null);

  // Hook into Pixel's comprehensive cartoon behavior engine
  const {
    emotion,
    setEmotion,
    eyeLook,
    speech,
    isSpeaking,
    spontaneousEnabled,
    setSpontaneousEnabled,
    handlePixelClick,
    handlePixelHover,
    handlePixelLeave,
    dismissSpeech,
  } = usePixelBehavior({ currentSection, isChatOpen, projectsType });

  // Rotate fun facts periodically
  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % 4);
    }, 5500);
    return () => clearInterval(factInterval);
  }, []);

  // Click outside to collapse navigation
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
    onNavigate(idx);
    setTimeout(() => {
      setIsExpanded(false);
    }, 280);
  };

  const onCharacterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handlePixelClick();
  };

  return (
    <>
      {/* ── EXPANDABLE AI CHAT PANEL ── */}
      <PixelChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onPixelEmotionChange={(emo) => setEmotion(emo)}
        spontaneousEnabled={spontaneousEnabled}
        onToggleSpontaneous={() => setSpontaneousEnabled(!spontaneousEnabled)}
      />

      {/* ── VERTICAL DYNAMIC ISLAND CAPSULE (Left Edge) ── */}
      <div
        ref={islandRef}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-[110] select-none"
      >
        {/* Fluffy Cartoon Cloud Speech Bubble (Pops out to the right) */}
        {speech && !isChatOpen && (
          <PixelCloudBubble
            text={speech.text}
            emotion={speech.emotion}
            isVisible={true}
            onDismiss={dismissSpeech}
          />
        )}

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
            }
          }}
          className={`relative bg-[#020817]/95 backdrop-blur-2xl border border-cyan-400/35 border-l-0 shadow-[4px_0_30px_rgba(0,238,255,0.18)] cursor-pointer overflow-hidden transition-colors ${
            isExpanded
              ? "w-[275px] min-h-[415px] rounded-r-3xl p-5"
              : "w-[50px] h-[300px] rounded-r-2xl py-3.5 flex flex-col items-center justify-between hover:border-cyan-400/50 hover:shadow-[6px_0_35px_rgba(0,238,255,0.28)]"
          }`}
        >
          {/* Luminous laser accent border along the curved right edge */}
          <div className="absolute right-0 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-transparent via-[#00EEFF] to-transparent pointer-events-none opacity-60" />

          {/* ── COLLAPSED VIEW (Hugging left screen border) ── */}
          {!isExpanded ? (
            <div className="h-full flex flex-col items-center justify-between w-full">
              {/* Top Head: Living Expressive Pixel Robot */}
              <div
                className="flex flex-col items-center cursor-pointer group"
                onClick={onCharacterClick}
                onMouseEnter={handlePixelHover}
                onMouseLeave={handlePixelLeave}
                title="Pixel — Click to interact, poke, or chat!"
              >
                <PixelCharacter
                  emotion={emotion}
                  isSpeaking={isSpeaking}
                  eyeLook={eyeLook}
                  size={36}
                  className="transition-transform group-hover:scale-110"
                />
              </div>

              {/* Vertical Spine: Active Section Label */}
              <div
                className="flex-1 my-3 flex items-center justify-center cursor-pointer"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                onClick={() => setIsExpanded(true)}
              >
                <span className="text-[11px] font-mono tracking-[0.24em] text-cyan-300 uppercase font-semibold drop-shadow-[0_0_8px_rgba(0,238,255,0.4)] hover:text-white transition-colors">
                  {activeSection.label}
                </span>
              </div>

              {/* Bottom Status Dot and Chat Quick Button */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsChatOpen(true);
                  }}
                  className="w-7 h-7 rounded-full bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-300 hover:text-white hover:border-cyan-300 hover:scale-110 transition-all shadow-[0_0_10px_rgba(0,238,255,0.3)]"
                  title="Chat with Pixel"
                  aria-label="Open AI chat"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>

                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-mono text-cyan-400/60">
                    0{currentSection + 1}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00EEFF] shadow-[0_0_8px_#00EEFF] animate-pulse" />
                </div>
              </div>
            </div>
          ) : (
            /* ── EXPANDED DYNAMIC ISLAND VIEW ── */
            <div className="relative flex flex-col justify-between h-full space-y-3.5">
              {/* Top Bar: Pixel Animated Companion + Title + Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={onCharacterClick}
                  onMouseEnter={handlePixelHover}
                  onMouseLeave={handlePixelLeave}
                >
                  <PixelCharacter
                    emotion={emotion}
                    isSpeaking={isSpeaking}
                    eyeLook={eyeLook}
                    size={42}
                    className="group-hover:scale-105 transition-transform"
                  />

                  <div>
                    <div className="text-white font-medium text-sm leading-tight flex items-center gap-1.5">
                      <span>PIXEL &amp; NAV</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00EEFF] animate-ping" />
                    </div>
                    <div className="text-[10px] font-mono text-cyan-400/80">
                      SYSTEM COMPANION
                    </div>
                  </div>
                </div>

                {/* Close Island Button */}
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

              {/* Chat with Pixel CTA Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsChatOpen(true);
                  setIsExpanded(false);
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-400/40 text-cyan-200 font-sans text-xs font-semibold flex items-center justify-between hover:bg-cyan-950/70 hover:border-cyan-300 hover:text-white transition-all shadow-[0_0_15px_rgba(0,238,255,0.15)] group"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                  <span>Chat with Pixel AI</span>
                </div>
                <span className="text-[10px] font-mono bg-cyan-400/20 px-1.5 py-0.5 rounded text-cyan-300">
                  OPEN
                </span>
              </button>

              {/* Navigation Menu Links */}
              <div className="space-y-1">
                {SECTIONS.map((sec) => {
                  const IconComponent = sec.icon;
                  const isActive = sec.id === currentSection;

                  return (
                    <button
                      key={sec.id}
                      onClick={() => handleSelectSection(sec.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all group ${
                        isActive
                          ? "bg-cyan-950/70 border border-cyan-400/50 text-white shadow-[0_0_15px_rgba(0,238,255,0.2)]"
                          : "text-slate-300 hover:bg-white/[0.04] hover:text-cyan-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                            isActive
                              ? "bg-cyan-400/20 text-cyan-300"
                              : "bg-white/[0.04] text-slate-400 group-hover:text-cyan-300"
                          }`}
                        >
                          <IconComponent className="w-3 h-3" />
                        </div>
                        <div>
                          <div className="text-xs font-medium tracking-wide">
                            {sec.label}
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
              <div className="pt-2 border-t border-cyan-500/15">
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400/70 uppercase tracking-wider mb-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  <span>PIXEL LIVE // TELEMETRY</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={factIndex}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
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
    </>
  );
};
