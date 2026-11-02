import React, { useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Quote, Sparkles, ArrowRight, Code2, GraduationCap } from "lucide-react";

interface AboutSectionProps {
  onContactClick?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onContactClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Spring-Tilt Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 180, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);

  const glareX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useTransform(smoothX, [-0.5, 0, 0.5], [0.28, 0.06, 0.28]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const techStack = ["React", "TypeScript", "Flutter", "Node.js", "Firebase", "Supabase"];

  return (
    <div className="relative w-full max-w-6xl mx-auto px-6 py-8 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14 z-20">
      {/* ── LEFT COLUMN: 3D Mask Emergence Portrait Card ── */}
      <div className="w-full lg:w-5/12 flex justify-center">
        <div
          className="relative w-full max-w-[370px] select-none"
          style={{ perspective: 1200 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Backlight Halo Glow behind Portrait */}
          <div
            className="absolute -inset-4 rounded-3xl opacity-25 blur-2xl pointer-events-none transition-opacity duration-700"
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
            className="relative rounded-2xl bg-[#040A18] border border-cyan-500/25 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] cursor-pointer group flex flex-col justify-between overflow-visible transition-colors duration-300 hover:border-cyan-400/60"
          >
            {/* Dynamic 3D Specular Sheen (Tracks mouse cursor) */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 z-30"
              style={{
                background:
                  "radial-gradient(circle 350px at 50% 50%, rgba(255,255,255,0.22), transparent 75%)",
                left: glareX,
                top: glareY,
                transform: "translate(-50%, -50%)",
                opacity: glareOpacity,
              }}
              aria-hidden="true"
            />

            {/* Portrait Frame with Laser Emergence Curtain */}
            <div
              style={{ transform: "translateZ(15px)" }}
              className="relative w-full aspect-[4/5] rounded-t-2xl overflow-hidden bg-[#020714] border-b border-cyan-500/15"
            >
              {/* Portrait Image */}
              <motion.img
                src="/images/manushka.png"
                alt="Manushka D. Dissanayake"
                initial={{ scale: 1.15, opacity: 0.4 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 1.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full h-full object-cover object-center select-none transition-transform duration-700 group-hover:scale-105"
              />

              {/* Laser Line Curtain Sweep */}
              <motion.div
                initial={{ y: "0%" }}
                animate={{ y: "-100%" }}
                transition={{
                  duration: 1.2,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute inset-0 bg-[#020714] pointer-events-none z-10 flex flex-col justify-end"
                aria-hidden="true"
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#00EEFF] to-transparent shadow-[0_0_24px_#00EEFF,0_0_8px_#FFFFFF]" />
              </motion.div>

              {/* Vignette lighting overlay */}
              <div
                className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#040A18] via-transparent to-black/30 opacity-80 z-[5]"
                aria-hidden="true"
              />
            </div>

            {/* Bottom Integrated Identity Plaque (Floating in 3D: translateZ 45px) */}
            <div
              style={{ transform: "translateZ(45px)" }}
              className="relative p-5 rounded-b-2xl bg-[#040A18]/95 z-20 border-t border-white/[0.06]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className="text-white text-lg sm:text-xl font-medium tracking-tight"
                    style={{ fontFamily: "'Italiana', serif" }}
                  >
                    Manushka D. Dissanayake
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-cyan-300/80 font-mono mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CS Undergraduate · UOJ</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Sub-metrics */}
              <div className="mt-3.5 pt-2.5 border-t border-cyan-500/15 flex items-center justify-between text-[11px] font-mono text-cyan-300/70">
                <span>FULL-STACK DEV</span>
                <span className="text-cyan-500/40">·</span>
                <span>CREATIVE TECH</span>
              </div>
            </div>

            {/* Corner Tech Brackets (translateZ 25px) */}
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
      </div>

      {/* ── RIGHT COLUMN: Manushka's Story & Philosophy ── */}
      <div className="w-full lg:w-7/12 space-y-4 text-left">
        {/* Header Indicator */}
        <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">
          <Quote className="w-4 h-4 rotate-180 text-cyan-400" />
          <span>ABOUT ME</span>
        </div>

        {/* Section Headline */}
        <h2
          className="text-white text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight leading-[1.15]"
          style={{ fontFamily: "'Italiana', serif" }}
        >
          Turning Ideas Into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400">
            Meaningful Digital Experiences.
          </span>
        </h2>

        {/* Bio Paragraphs */}
        <p className="text-slate-300 text-sm leading-relaxed">
          I'm a Computer Science undergraduate at the <span className="text-white font-medium">University of Jaffna</span>, passionate about turning ideas into meaningful digital experiences.
        </p>

        <p className="text-slate-300 text-sm leading-relaxed">
          I enjoy building things from the ground up — from sleek, interactive web applications to mobile platforms and full-stack systems. My experience spans across frontend and backend development.
        </p>

        {/* Tech Stack Dot-Separated Line (No Capsules) */}
        <div className="py-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-cyan-300/85">
          <span className="text-slate-400 uppercase text-[10px] tracking-wider mr-1">Stack:</span>
          {techStack.map((tech, idx) => (
            <span key={tech} className="flex items-center gap-2">
              <span>{tech}</span>
              {idx < techStack.length - 1 && <span className="text-cyan-500/40">·</span>}
            </span>
          ))}
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          Beyond writing code, I love exploring new technologies, experimenting with creative ideas, and finding better ways to solve problems. I'm particularly interested in <span className="text-cyan-300">game development</span>, <span className="text-cyan-300">interactive experiences</span>, and the intersection of technology and creativity.
        </p>

        {/* Core Philosophy Box */}
        <div className="relative p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 via-blue-950/15 to-transparent border-l-2 border-l-cyan-400 border-y border-r border-white/[0.05]">
          <p className="text-white font-serif italic text-sm sm:text-base leading-relaxed">
            "I believe the best things are built through curiosity, experimentation, and a willingness to keep learning. I'm here to build, break, learn, and create things that matter."
          </p>
        </div>

        {/* Closing Action */}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">
            Available for Engineering &amp; Creative Projects
          </div>

          {onContactClick && (
            <button
              onClick={onContactClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold font-mono text-xs tracking-wider shadow-[0_0_20px_rgba(0,238,255,0.35)] hover:shadow-[0_0_30px_rgba(0,238,255,0.5)] hover:scale-105 transition-all"
            >
              <span>LET'S CONNECT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
