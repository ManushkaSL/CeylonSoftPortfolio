import React, { useEffect, useRef, useState } from "react";

export type CursorMode =
  | "default"
  | "pointer"       // buttons, clickable cards, explore prompt
  | "link"          // a tags
  | "heading"       // main heading reflection
  | "crosshair";    // subtitle precision

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Direct ref holders for 60fps rendering without React re-renders
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const crosshairTopRef = useRef<HTMLDivElement>(null);
  const crosshairBottomRef = useRef<HTMLDivElement>(null);
  const crosshairLeftRef = useRef<HTMLDivElement>(null);
  const crosshairRightRef = useRef<HTMLDivElement>(null);

  // Position physics
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const cursorMode = useRef<CursorMode>("default");
  const isMouseDown = useRef(false);
  const isIdle = useRef(false);
  const idleTimer = useRef<number | null>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Detect touch device
    const touchQuery = window.matchMedia("(pointer: coarse)");
    setIsTouchDevice(touchQuery.matches);

    // Detect prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(motionQuery.matches);

    const handleTouchChange = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);

    touchQuery.addEventListener("change", handleTouchChange);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      touchQuery.removeEventListener("change", handleTouchChange);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    // Add class to body to suppress default cursor cleanly
    document.documentElement.classList.add("has-custom-cursor");

    const resetIdle = () => {
      isIdle.current = false;
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        isIdle.current = true;
      }, 2400);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      setIsVisible(true);
      resetIdle();

      // Determine element under cursor
      const target = e.target as HTMLElement | null;
      if (!target) {
        cursorMode.current = "default";
        return;
      }

      // 1. Heading mode
      if (target.closest('[data-cursor="heading"]')) {
        cursorMode.current = "heading";
        return;
      }

      // 2. Subtitle crosshair mode
      if (target.closest('[data-cursor="crosshair"]')) {
        cursorMode.current = "crosshair";
        return;
      }

      // 3. Link mode
      if (target.closest("a")) {
        cursorMode.current = "link";
        return;
      }

      // 4. Pointer / Clickable mode
      if (
        target.closest("button") ||
        target.closest('[role="button"]') ||
        target.closest('[data-cursor="pointer"]') ||
        target.closest(".cursor-pointer") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        cursorMode.current = "pointer";
        return;
      }

      cursorMode.current = "default";
    };

    const handleMouseDown = () => {
      isMouseDown.current = true;
      resetIdle();
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
      resetIdle();
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
      resetIdle();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    // Continuous 60fps physics loop
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const tick = () => {
      const { x: targetX, y: targetY } = mousePos.current;

      // Center dot follows immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }

      // Outer ring lerps smoothly
      const lerpSpeed = isReducedMotion ? 1 : 0.18;
      ringPos.current.x = lerp(ringPos.current.x, targetX, lerpSpeed);
      ringPos.current.y = lerp(ringPos.current.y, targetY, lerpSpeed);

      if (ringRef.current) {
        const mode = cursorMode.current;
        const isClicking = isMouseDown.current;

        // Determine target diameter and styles based on state
        let targetDiameter = 28;
        let ringBorderColor = "rgba(0, 217, 242, 0.45)";
        let ringGlow = "0 0 10px rgba(0, 217, 242, 0.18)";
        let ringBorderWidth = "1px";

        if (isClicking) {
          targetDiameter = 20;
          ringBorderColor = "rgba(0, 238, 255, 0.85)";
          ringGlow = "0 0 14px rgba(0, 238, 255, 0.35)";
        } else if (mode === "heading") {
          targetDiameter = 48;
          ringBorderColor = "rgba(115, 233, 245, 0.65)";
          ringBorderWidth = "0.85px";
          ringGlow = "0 0 16px rgba(115, 233, 245, 0.25)";
        } else if (mode === "pointer") {
          targetDiameter = 42;
          ringBorderColor = "rgba(0, 217, 242, 0.85)";
          ringGlow = "0 0 16px rgba(0, 217, 242, 0.35)";
        } else if (mode === "link") {
          targetDiameter = 38;
          ringBorderColor = "rgba(115, 233, 245, 0.75)";
          ringGlow = "0 0 12px rgba(115, 233, 245, 0.25)";
        } else if (mode === "crosshair") {
          targetDiameter = 30;
          ringBorderColor = "rgba(0, 217, 242, 0.75)";
          ringGlow = "0 0 10px rgba(0, 217, 242, 0.25)";
        }

        const opacity = isIdle.current ? 0.35 : 1;

        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
        ringRef.current.style.width = `${targetDiameter}px`;
        ringRef.current.style.height = `${targetDiameter}px`;
        ringRef.current.style.borderColor = ringBorderColor;
        ringRef.current.style.borderWidth = ringBorderWidth;
        ringRef.current.style.boxShadow = ringGlow;
        ringRef.current.style.opacity = `${opacity}`;

        // Crosshair ticks
        const showCrosshair = mode === "crosshair";
        const crosshairOpacity = showCrosshair ? "0.9" : "0";
        if (crosshairTopRef.current) crosshairTopRef.current.style.opacity = crosshairOpacity;
        if (crosshairBottomRef.current) crosshairBottomRef.current.style.opacity = crosshairOpacity;
        if (crosshairLeftRef.current) crosshairLeftRef.current.style.opacity = crosshairOpacity;
        if (crosshairRightRef.current) crosshairRightRef.current.style.opacity = crosshairOpacity;
      }

      animFrameId.current = requestAnimationFrame(tick);
    };

    animFrameId.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isTouchDevice, isReducedMotion]);

  if (isTouchDevice) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* ── Outer Precision Halo Ring ── */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border border-solid pointer-events-none will-change-transform transition-[width,height,border-color,box-shadow,opacity] duration-200 ease-out"
        style={{
          width: 28,
          height: 28,
          borderColor: "rgba(0, 217, 242, 0.45)",
          boxShadow: "0 0 10px rgba(0, 217, 242, 0.18)",
        }}
      >
        {/* Minimal Precision Crosshair Ticks (Active when hovering subtitle) */}
        <div
          ref={crosshairTopRef}
          className="absolute left-1/2 -top-1.5 -translate-x-1/2 w-[1px] h-[3px] bg-[#00D9F2] pointer-events-none transition-opacity duration-150 opacity-0"
        />
        <div
          ref={crosshairBottomRef}
          className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-[1px] h-[3px] bg-[#00D9F2] pointer-events-none transition-opacity duration-150 opacity-0"
        />
        <div
          ref={crosshairLeftRef}
          className="absolute top-1/2 -left-1.5 -translate-y-1/2 h-[1px] w-[3px] bg-[#00D9F2] pointer-events-none transition-opacity duration-150 opacity-0"
        />
        <div
          ref={crosshairRightRef}
          className="absolute top-1/2 -right-1.5 -translate-y-1/2 h-[1px] w-[3px] bg-[#00D9F2] pointer-events-none transition-opacity duration-150 opacity-0"
        />
      </div>

      {/* ── Tiny Ice-White/Cyan Center Dot ── */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1 h-1 rounded-full bg-[#EAFBFF] pointer-events-none will-change-transform"
        style={{
          boxShadow: "0 0 6px #00D9F2, 0 0 10px rgba(0, 217, 242, 0.5)",
        }}
      />
    </div>
  );
};
