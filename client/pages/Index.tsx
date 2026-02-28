export default function Index() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0B0F1A] flex flex-col items-center justify-center">
      {/* Conic gradient left half - flipped horizontally */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 pointer-events-none"
        style={{
          background:
            "conic-gradient(from 270deg at 50% 50%, #FFF 0.3deg, #5519F8 128.3deg, #180034 360deg)",
          height: "120%",
          top: "-10%",
          transform: "scaleX(-1)",
        }}
      />
      {/* Conic gradient right half - flipped horizontally */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
        style={{
          background:
            "conic-gradient(from 270deg at 50% 50%, #FFF 0.3deg, #5519F8 128.3deg, #180034 360deg)",
          height: "120%",
          top: "-10%",
        }}
      />
      {/* Linear gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #0D0026 0%, rgba(24, 0, 70, 0.00) 49.86%, #10002F 86.47%)",
        }}
      />

      {/* Animated light beam at the bottom */}
      <div
        className="absolute left-0 right-0 pointer-events-none light-beam-glow"
        style={{
          bottom: "0",
          height: "2px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.1) 80%, transparent 100%)",
        }}
      />

      {/* Sweep highlight traveling across the beam */}
      <div
        className="absolute left-0 right-0 pointer-events-none overflow-hidden"
        style={{ bottom: "0", height: "4px" }}
      >
        <div
          className="light-beam-sweep"
          style={{
            width: "30%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
            boxShadow: "0 0 30px 10px rgba(85, 25, 248, 0.4)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full">
        {/* Main headline */}
        <h1
          className="text-[#00C2FF] leading-tight"
          style={{
            fontFamily: "'Italiana', serif",
            fontSize: "clamp(2.5rem, 10vw, 6rem)",
            WebkitTextStrokeWidth: "1px",
            WebkitTextStrokeColor: "#00C2FF",
            maxWidth: "1183px",
          }}
        >
          WE BUILD DIGITAL EXPERIENCES
        </h1>

        {/* Subtitle */}
        <p
          className="mt-6 text-[#1F2A44]"
          style={{
            fontFamily: "'Jersey 10', sans-serif",
            fontSize: "clamp(1rem, 2.5vw, 2.25rem)",
            letterSpacing: "0.15em",
          }}
        >
          W h e r e &nbsp; P e r f o r m a n c e &nbsp; M e e t s &nbsp; D e s i g n .
        </p>


        {/* Bottom tagline */}
        <p
          className="mt-24 text-white"
          style={{
            fontFamily: "Calibri, 'Segoe UI', Arial, sans-serif",
            fontSize: "clamp(0.9rem, 2vw, 1.5rem)",
          }}
        >
          Mobile Applications &amp; Web Systems Built for Modern Businesses.
        </p>
      </div>
    </div>
  );
}
