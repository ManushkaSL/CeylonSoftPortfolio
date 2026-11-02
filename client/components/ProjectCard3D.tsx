import React, { useRef, useState, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

export interface ProjectData {
  id: string;
  title: string;
  desc: string;
  category: "web" | "mobile";
  tags: string[];
  mockup: string;
  type?: string;
  demoUrl?: string;
}

interface ProjectCard3DProps {
  project: ProjectData;
  index: number;
}

export const ProjectCard3D: React.FC<ProjectCard3DProps> = ({ project, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt Physics using Motion Values & Springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 180, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Rotate mapping for pronounced 3D perspective
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-16, 16]);

  // Dynamic specular glare position
  const glareX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useTransform(smoothX, [-0.5, 0, 0.5], [0.3, 0.05, 0.3]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // The laser scanner fires gracefully right after each card finishes settling in its slot!
  const scanDelay = 1.1 + index * 0.18;

  return (
    <div
      className="relative w-[320px] sm:w-[350px] h-[520px] select-none"
      style={{ perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Backlight Halo Glow behind Card */}
      <div
        className="absolute -inset-3 rounded-3xl opacity-20 blur-xl pointer-events-none transition-opacity duration-700 group-hover:opacity-50"
        style={{
          background:
            "radial-gradient(circle at center, #00EEFF 0%, #032B69 50%, transparent 75%)",
        }}
      />

      {/* 3D Tilting Card Container */}
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full rounded-2xl bg-[#040A18] border border-cyan-500/25 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] cursor-pointer group flex flex-col justify-between overflow-visible transition-colors duration-300 hover:border-cyan-400/60"
      >
        {/* Dynamic 3D Specular Sheen (Tracks mouse cursor) */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-30"
          style={{
            background:
              "radial-gradient(circle 340px at 50% 50%, rgba(255,255,255,0.22), transparent 75%)",
            left: glareX,
            top: glareY,
            transform: "translate(-50%, -50%)",
            opacity: glareOpacity,
          }}
          aria-hidden="true"
        />

        {/* ── TOP IMAGE AREA (Flush to top, left, right lines - No inner border) ── */}
        <div
          style={{ transform: "translateZ(15px)" }}
          className="relative w-full h-[270px] shrink-0 bg-[#020714] rounded-t-2xl overflow-hidden border-b border-cyan-500/15"
        >
          {/* Mockup Image */}
          <motion.img
            src={project.mockup}
            alt={project.title}
            initial={{ scale: 1.12, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1.0,
              delay: scanDelay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full h-full object-cover object-top select-none transition-transform duration-500 group-hover:scale-106"
          />

          {/* ── SIGNATURE LASER SCANNER LINE EFFECT ── */}
          {/* Sweeps through the image AFTER the card lands in its proper place! */}
          <motion.div
            initial={{ top: "-10%", opacity: 0 }}
            animate={{
              top: ["0%", "105%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.2,
              delay: scanDelay,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#00EEFF] to-transparent shadow-[0_0_24px_#00EEFF,0_0_8px_#FFFFFF] z-20 pointer-events-none"
            aria-hidden="true"
          />

          {/* Holographic light wash behind the laser line */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{
              duration: 1.2,
              delay: scanDelay,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent pointer-events-none z-10"
            aria-hidden="true"
          />

          {/* Re-scan pulse on hover */}
          {isHovered && (
            <motion.div
              initial={{ top: "-5%", opacity: 0 }}
              animate={{ top: "105%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00EEFF] to-transparent shadow-[0_0_18px_#00EEFF] z-20 pointer-events-none"
            />
          )}

          {/* Vignette lighting overlay */}
          <div
            className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#040A18] via-transparent to-transparent opacity-75 z-[5]"
            aria-hidden="true"
          />
        </div>

        {/* ── BOTTOM TEXT PLAQUE (Floating in 3D: translateZ 45px) ── */}
        <div
          style={{ transform: "translateZ(45px)" }}
          className="relative flex-1 p-5 flex flex-col justify-between bg-[#040A18]/95 rounded-b-2xl z-20"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                {project.type || (project.category === "web" ? "Web System" : "Mobile App")}
              </span>
              <span className="text-[11px] font-mono text-cyan-400/70 shrink-0">
                / 0{index + 1}
              </span>
            </div>

            <h3
              className="text-white font-medium text-lg tracking-tight group-hover:text-cyan-300 transition-colors line-clamp-1"
              style={{ fontFamily: "'Italiana', serif" }}
            >
              {project.title}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mt-1">
              {project.desc}
            </p>
          </div>

          <div className="mt-3">
            {/* Clean minimal tech stack line - No capsules */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono text-cyan-300/80 mb-3">
              {project.tags.map((tag, tIdx) => (
                <span key={tag} className="flex items-center gap-1.5">
                  <span>{tag}</span>
                  {tIdx < project.tags.length - 1 && (
                    <span className="text-cyan-500/40">·</span>
                  )}
                </span>
              ))}
            </div>

            {/* Action Bar (translateZ 10px forward) */}
            <div
              style={{ transform: "translateZ(10px)" }}
              className="pt-2.5 flex items-center justify-between text-[11px] font-mono text-cyan-400 border-t border-white/[0.08]"
            >
              <span className="flex items-center gap-1.5 text-slate-400 text-[10px] tracking-wider uppercase group-hover:text-cyan-300 transition-colors">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>EXPLORE ARCHITECTURE</span>
              </span>
              <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>VIEW</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* 3D Corner Tech Brackets (Floating in 3D: translateZ 25px) */}
        <div
          style={{ transform: "translateZ(25px)" }}
          className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60 rounded-tl pointer-events-none"
        />
        <div
          style={{ transform: "translateZ(25px)" }}
          className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60 rounded-br pointer-events-none"
        />
      </motion.div>
    </div>
  );
};
