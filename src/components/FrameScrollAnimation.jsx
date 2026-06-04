import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FrameScrollAnimation = ({ frameCount = 240 }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const seqRef = useRef({ frame: 0 });
  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);

  // Generate frame path from public folder (same approach as Hero)
  const currentFrame = (index) =>
    `/image2/ezgif-frame-${(index + 1).toString().padStart(3, "0")}.jpg`;

  // Preload all frames
  useEffect(() => {
    let loadedCount = 0;
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        setLoadingProgress(Math.floor((loadedCount / frameCount) * 100));
        if (loadedCount === frameCount) setLoaded(true);
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === frameCount) setLoaded(true);
      };
      imagesRef.current.push(img);
    }
  }, []);

  // GSAP scroll-driven frame animation (same reliable method as Hero)
  useEffect(() => {
    if (!loaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Set canvas resolution to match window for crisp rendering
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    const render = () => {
      if (!canvasRef.current || !imagesRef.current.length) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let frameIdx = Math.round(seqRef.current.frame);
      if (frameIdx >= frameCount) frameIdx = frameCount - 1;
      if (frameIdx < 0) frameIdx = 0;

      const img = imagesRef.current[frameIdx];
      if (img && img.complete && img.naturalHeight !== 0) {
        // Cover-fit: fill the canvas maintaining aspect ratio
        const scale = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }

      setCurrentFrameIdx(frameIdx);
    };

    // Initial render
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gContext = gsap.context(() => {
      // Responsive scroll distance: shorter on mobile for snappy feel
      const isMobile = window.innerWidth < 768;
      const scrollEnd = isMobile ? "+=2500" : "+=4000";

      // GSAP ScrollTrigger for frame scrubbing
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: scrollEnd,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(seqRef.current, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: render,
      });

      // Fade out canvas near the end of scroll
      tl.fromTo(
        canvas,
        { opacity: 1, filter: "blur(0px)" },
        { opacity: 0, filter: "blur(10px)", duration: 0.1, ease: "none" },
        0.9
      );
    }, containerRef);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      gContext.revert();
    };
  }, [loaded]);

  return (
    <div
      ref={containerRef}
      className="relative bg-[#020202]"
      style={{ height: "100vh" }} /* container height managed by GSAP pin */
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Loading Overlay — always mounted, CSS-controlled visibility */}
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#020202]"
          style={{
            opacity: loaded ? 0 : 1,
            pointerEvents: loaded ? "none" : "auto",
            transition: "opacity 0.6s ease",
          }}
        >
          <div className="text-blue-500 font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.5em] mb-4">
            Syncing Core Frames... {loadingProgress}%
          </div>
          <div className="w-3/5 sm:w-1/3 md:w-1/4 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>

        {/* Frame Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full object-cover z-10"
        />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-40 z-20" />

        {/* Transitional Text Overlay — always mounted, CSS-controlled */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-30 px-4"
          style={{
            opacity: loaded && currentFrameIdx > 60 && currentFrameIdx < 200 ? 1 : 0,
            transform: loaded && currentFrameIdx > 60 && currentFrameIdx < 200 ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          <h3 className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-2 drop-shadow-2xl text-white">
            Welcome to my{" "}
            <span className="text-blue-500">Portfolio</span>
          </h3>
          <p className="text-blue-400 font-mono tracking-[0.2em] sm:tracking-[0.4em] md:tracking-[0.6em] uppercase text-[9px] sm:text-[11px] md:text-[12px] opacity-70">
            Core System Interface
          </p>
        </div>
      </div>
    </div>
  );
};

export default FrameScrollAnimation;
