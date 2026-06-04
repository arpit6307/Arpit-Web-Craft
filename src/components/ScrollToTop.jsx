import React, { useState, useEffect, useRef, useCallback } from "react";

export default function ScrollToTop() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isCharged, setIsCharged] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const chargeTimerRef = useRef(null);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      setScrollPercent(percent);
      setIsVisible(scrollTop > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Charge up effect on hover
  useEffect(() => {
    if (isHovering) {
      chargeTimerRef.current = setTimeout(() => setIsCharged(true), 400);
    } else {
      clearTimeout(chargeTimerRef.current);
      setIsCharged(false);
    }
    return () => clearTimeout(chargeTimerRef.current);
  }, [isHovering]);

  // Warp speed star-lines animation on canvas
  const startWarpAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const starCount = window.innerWidth < 768 ? 100 : 200;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 4 + Math.random() * 20,
      length: 10 + Math.random() * 60,
      opacity: 0.3 + Math.random() * 0.7,
    }));

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let frame = 0;
    const maxFrames = 40;

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const progress = frame / maxFrames;
      const intensity = Math.sin(progress * Math.PI);

      stars.forEach((star) => {
        const dx = star.x - centerX;
        const dy = star.y - centerY;
        const angle = Math.atan2(dy, dx);
        const lineLen = star.length * intensity * 3;

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(
          star.x + Math.cos(angle) * lineLen,
          star.y + Math.sin(angle) * lineLen
        );

        const gradient = ctx.createLinearGradient(
          star.x, star.y,
          star.x + Math.cos(angle) * lineLen,
          star.y + Math.sin(angle) * lineLen
        );
        gradient.addColorStop(0, `rgba(6, 182, 212, ${star.opacity * intensity})`);
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${star.opacity * intensity * 0.8})`);
        gradient.addColorStop(1, `rgba(6, 182, 212, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        star.x += Math.cos(angle) * star.speed * intensity;
        star.y += Math.sin(angle) * star.speed * intensity;
      });

      if (intensity > 0.3) {
        const flashGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 300 * intensity);
        flashGrad.addColorStop(0, `rgba(6, 182, 212, ${0.15 * intensity})`);
        flashGrad.addColorStop(1, "transparent");
        ctx.fillStyle = flashGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (frame < maxFrames) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    animate();
  }, []);

  const handleWarp = () => {
    if (isWarping) return;
    setIsWarping(true);
    setIsTapped(true);
    startWarpAnimation();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setIsWarping(false);
      setIsTapped(false);
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (scrollPercent / 100) * circumference;

  const active = isHovering || isTapped;

  return (
    <>
      {/* Warp speed canvas overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[9998] pointer-events-none"
        style={{
          opacity: isWarping ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* The button — responsive: 50px mobile, 64px desktop */}
      <div
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[9999] pointer-events-none"
        style={{
          opacity: isVisible && !isWarping ? 1 : 0,
          transform: isVisible && !isWarping ? "translateY(0) scale(1)" : "translateY(40px) scale(0.5)",
          transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <button
          onClick={handleWarp}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={() => setIsHovering(true)}
          onTouchEnd={() => { setIsHovering(false); }}
          className="group relative w-[50px] h-[50px] sm:w-[64px] sm:h-[64px] flex items-center justify-center cursor-pointer pointer-events-auto touch-manipulation"
          title="Warp to top"
        >
          {/* Outer glow pulse */}
          <div
            className="absolute inset-0 rounded-full transition-all duration-500"
            style={{
              background: active ? "rgba(6,182,212,0.12)" : "transparent",
              boxShadow: active ? "0 0 25px rgba(6,182,212,0.25)" : "none",
              transform: active ? "scale(1.2)" : "scale(1)",
            }}
          />

          {/* Orbiting ring — hidden on mobile to reduce visual clutter */}
          <div
            className="absolute inset-[-5px] rounded-full border border-dashed hidden sm:block"
            style={{
              borderColor: isHovering ? "rgba(34,211,238,0.3)" : "transparent",
              animation: isHovering ? "spin 3s linear infinite" : "none",
              transition: "border-color 0.5s ease",
            }}
          />

          {/* Background plate */}
          <div
            className="absolute inset-0 rounded-full bg-[#0a0a0a]/90 backdrop-blur-xl border transition-all duration-400 shadow-2xl"
            style={{
              borderColor: active ? "rgba(6,182,212,0.4)" : "rgba(255,255,255,0.1)",
            }}
          />

          {/* Progress ring SVG */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
            <circle
              cx="30" cy="30" r={radius}
              fill="none"
              stroke="url(#warpProgressGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-300 ease-out"
            />
            <defs>
              <linearGradient id="warpProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <svg
              className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] transition-colors duration-300"
              style={{ color: active ? "#22d3ee" : "#9ca3af" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>

            <span
              className="text-[6px] sm:text-[8px] font-mono mt-0.5 select-none tracking-wider transition-colors duration-300"
              style={{ color: active ? "rgba(34,211,238,0.8)" : "#6b7280" }}
            >
              {scrollPercent}%
            </span>
          </div>

          {/* Corner accent dots */}
          <div
            className="absolute -top-0.5 sm:-top-1 left-1/2 -translate-x-1/2 w-[3px] h-[3px] sm:w-1 sm:h-1 rounded-full transition-all duration-500"
            style={{
              backgroundColor: active ? "#22d3ee" : "rgba(6,182,212,0.4)",
              boxShadow: active ? "0 0 6px rgba(6,182,212,0.6)" : "none",
            }}
          />
          <div
            className="absolute -bottom-0.5 sm:-bottom-1 left-1/2 -translate-x-1/2 w-[3px] h-[3px] sm:w-1 sm:h-1 rounded-full transition-all duration-500"
            style={{
              backgroundColor: active ? "#22d3ee" : "rgba(6,182,212,0.4)",
              boxShadow: active ? "0 0 6px rgba(6,182,212,0.6)" : "none",
            }}
          />

          {/* Tooltip label — DESKTOP ONLY */}
          <div
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none hidden sm:block"
            style={{
              opacity: isHovering ? 1 : 0,
              transform: isHovering ? "translateX(0)" : "translateX(10px)",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
          >
            <div className="relative flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a]/90 backdrop-blur-xl border border-cyan-500/20 rounded-lg">
              <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-500/60 rounded-tl" />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyan-500/60 rounded-br" />
              <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-cyan-400 select-none">
                {isCharged ? "WARP_READY" : "ENGAGE_WARP"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: isCharged ? "#06b6d4" : "#6b7280" }}
              />
            </div>
          </div>
        </button>
      </div>

      <style>{`
        @keyframes warpBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </>
  );
}
