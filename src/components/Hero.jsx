import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  
  const textContainerRef = useRef(null);
  const roleWrapperRef = useRef(null);
  const subtitleWrapperRef = useRef(null);
  const highlightWrapperRef = useRef(null);

  const frameCount = 240;
  const currentFrame = (index) => `/images/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;
  
  const imagesRef = useRef([]);
  // We use an object to track the frame so GSAP can animate the value smoothly
  const seqRef = useRef({ frame: 0 });

  useEffect(() => {
    // Preload sequence
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

  // Detect scroll to hide the scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1920;
    canvas.height = 1080;

    const render = () => {
        if (!canvasRef.current || !imagesRef.current.length) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Clamp frame just in case
        let frameIdx = Math.round(seqRef.current.frame);
        if (frameIdx >= frameCount) frameIdx = frameCount - 1;
        
        const img = imagesRef.current[frameIdx];
        if (img && img.complete && img.naturalHeight !== 0) {
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }

        // Update state only if threshold is crossed to minimize re-renders
        setCurrentFrameIdx(frameIdx);
    };

    render(); // Draw initial 0th frame

    const gContext = gsap.context(() => {
      // --- 1. SYSTEM BOOT OPENING EXPERIENCE (Runs on Mount) ---
      const bootTl = gsap.timeline({ delay: 0.5 });

      // Boot visuals
      bootTl.fromTo('.noise-overlay', { opacity: 0 }, { opacity: 0.15, duration: 1, ease: "none" }, 0);
      bootTl.fromTo('.center-glow', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.5, ease: "power1.inOut" }, 0.2);
      
      // Navbar slide in
      bootTl.fromTo('nav', { y: -50, opacity: 0, filter: 'blur(10px)' }, { y: 0, opacity: 1, filter: 'blur(0)', duration: 1, ease: "power2.out" }, 0.5);

      // Initial Face Reveal
      bootTl.fromTo(canvas, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }, 0.8);
      // Slowly play initial frames immediately
      bootTl.to(seqRef.current, { frame: 10, snap: "frame", duration: 1.5, ease: "power1.inOut", onUpdate: render }, 0.8);

      // HUD Elements sequence
      bootTl.fromTo('.hud-element', { opacity: 0 }, { opacity: 1, duration: 0.1, stagger: 0.1, ease: "none" }, 1.2);

      // Robotic Text Sequence
      if (textContainerRef.current) {
          // LEESHARK chars glitch/stagger in
          bootTl.to('.title-char', { opacity: 1, x: 0, duration: 0.05, stagger: 0.05, ease: "none" }, 1.5);
          
          // Full Stack Developer
          bootTl.fromTo(roleWrapperRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: "none" }, 2.0);
          bootTl.fromTo('.role-underline', { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.3, ease: "none" }, 2.2);

          // Right Content
          bootTl.fromTo(subtitleWrapperRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.3, ease: "none" }, 2.4);
          bootTl.fromTo(highlightWrapperRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.2, ease: "none" }, 2.6);

          // Social Icons Bottom Left
          bootTl.fromTo('.social-icon', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.1, ease: "none" }, 2.8);
      }

      // --- 2. MAIN SCROLL CONTINUATION ---
      // User scroll takes over from whatever frame bootTl left off at, up to 239.
      const tlScroll = gsap.timeline({
          scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "+=4000",
              scrub: 0.5,
              pin: true,
              anticipatePin: 1
          }
      });
      scrollTriggerRef.current = tlScroll.scrollTrigger;

      tlScroll.to(seqRef.current, {
          frame: frameCount - 1,
          snap: "frame",
          ease: "none",
          duration: 1, 
          onUpdate: render
      });

      // Content stays fixed. No aggressive re-animations. 
      // Just a clean sharp fade out at the very end of the scroll.
      tlScroll.fromTo('.portfolio-ui', 
          { opacity: 1, filter: "blur(0px)" },
          { opacity: 0, filter: "blur(5px)", duration: 0.1, ease: "none" }, 
          0.9
      );
      
      tlScroll.fromTo(canvas, 
          { opacity: 1, filter: "blur(0px)" },
          { opacity: 0, filter: "blur(10px)", duration: 0.1, ease: "none" }, 
          0.9
      );
    }, containerRef);

    return () => {
      gContext.revert();
    };
  }, [loaded]);

  const handleScrollDown = () => {
    if (scrollTriggerRef.current) {
      window.scrollTo({
        top: scrollTriggerRef.current.end - 100,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: window.innerHeight * 2,
        behavior: 'smooth'
      });
    }
  };

  const titleText = "Arpit Web Craft";

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#020202] overflow-hidden flex items-center justify-center font-sans tracking-wide">
        
        {/* Loading State */}
        {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#020202]">
                <div className="text-gray-500 font-mono text-xs uppercase tracking-[0.3em] mb-4">&gt; INITIALIZING_CORE_SYSTEM</div>
                <div className="w-64 h-[1px] bg-white/10 overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${loadingProgress}%` }}></div>
                </div>
            </div>
        )}

        {/* --- BACKGROUND EFFECTS --- */}
        {/* Subtle grid lines */}
        <div className="portfolio-ui absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        {/* Static noise grain */}
        <div className="portfolio-ui noise-overlay absolute inset-0 z-0 pointer-events-none mix-blend-overlay opacity-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        {/* Center Subdued Blue Glow */}
        <div className="portfolio-ui center-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none opacity-0 mix-blend-screen z-[1]"></div>

        {/* --- HUD ELEMENTS --- */}
        <div className="portfolio-ui absolute top-20 left-4 sm:top-28 sm:left-8 md:top-32 md:left-12 z-[60] font-mono text-[8px] sm:text-[10px] text-blue-400 tracking-widest flex flex-col space-y-1.5 pointer-events-none">
            <span className="hud-element opacity-0">&gt; SYSTEM ONLINE</span>
            <span className="hud-element opacity-0">&gt; INITIALIZING PORTFOLIO v2.0</span>
            <span className="hud-element opacity-0">&gt; NEURAL LINK ESTABLISHED</span>
        </div>
        <div className="portfolio-ui absolute bottom-28 sm:bottom-12 right-4 sm:right-8 md:bottom-12 md:right-12 z-[60] font-mono text-[8px] sm:text-[10px] text-gray-600 tracking-widest text-right flex flex-col space-y-1.5 pointer-events-none">
            <span className="hud-element opacity-0">SECURE SYS_ID: REACT_GSAP</span>
            <span className="hud-element opacity-0">COORD: 34.0522 N / 118.2437 W</span>
        </div>

        {/* --- SOCIAL LINKS --- */}
        <div className="portfolio-ui absolute bottom-28 sm:bottom-12 left-4 sm:left-8 md:left-12 z-[60] flex flex-col space-y-4 sm:space-y-5">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon opacity-0 text-gray-500 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all p-1">
                {/* GitHub */}
                <svg className="w-5 h-5 sm:w-[18px] sm:h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon opacity-0 text-gray-500 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all p-1">
                {/* LinkedIn */}
                <svg className="w-5 h-5 sm:w-[18px] sm:h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
        </div>

        {/* --- CANVAS --- */}
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full object-cover z-10 opacity-0 scale-95"
        />

        {/* --- PORTFOLIO TEXT OVERLAY --- */}
            {loaded && (
                <div className="portfolio-ui absolute inset-0 z-[50] pointer-events-none flex items-end">
                    {/* Bottom content bar */}
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 pb-16 sm:pb-20 md:pb-14">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 sm:gap-8 md:gap-12">
                    
                            {/* LEFT: Name and Role */}
                            <div className="flex flex-col items-start">
                                {currentFrameIdx >= 100 && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="mb-4 relative"
                                    >
                                        {/* Decorative top line */}
                                        <motion.div 
                                            className="h-[2px] mb-3 bg-gradient-to-r from-cyan-500 via-blue-400 to-transparent"
                                            initial={{ scaleX: 0, originX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                                        />
                                        
                                        {/* Main title - single line layout */}
                                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-sans font-extrabold uppercase leading-[1.1] tracking-wide">
                                            {"Arpit".split("").map((char, i) => (
                                                <motion.span
                                                    key={`a-${i}`}
                                                    initial={{ opacity: 0, y: 40, rotateX: -90 }}
                                                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                                    className="inline-block text-white"
                                                    style={{ textShadow: "0 0 30px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.5)" }}
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                            <span className="inline-block w-3"></span>
                                            {"Web".split("").map((char, i) => (
                                                <motion.span
                                                    key={`w-${i}`}
                                                    initial={{ opacity: 0, y: 40, rotateX: -90 }}
                                                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                                    transition={{ duration: 0.6, delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                                    className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                                                    style={{ filter: "drop-shadow(0 0 20px rgba(6,182,212,0.5))" }}
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                            <span className="inline-block w-3"></span>
                                            {"Craft".split("").map((char, i) => (
                                                <motion.span
                                                    key={`c-${i}`}
                                                    initial={{ opacity: 0, y: 40, rotateX: -90 }}
                                                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                                    transition={{ duration: 0.6, delay: 0.8 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                                    className="inline-block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                                                    style={{ filter: "drop-shadow(0 0 20px rgba(99,102,241,0.4))" }}
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                        </h1>
                                    </motion.div>
                                )}
                                
                                {currentFrameIdx >= 150 && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                                        className="relative"
                                    >
                                        {/* Cyber badge container */}
                                        <div className="relative inline-flex items-center gap-3 px-5 py-2.5 border border-white/15 bg-white/5 backdrop-blur-md rounded-sm overflow-hidden">
                                            {/* Scanning line animation */}
                                            <motion.div 
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
                                                animate={{ x: ["-100%", "200%"] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                                            />
                                            {/* Corner accents */}
                                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400/60"></div>
                                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/60"></div>
                                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400/60"></div>
                                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400/60"></div>
                                            
                                            {/* Status dot */}
                                            <div className="relative flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                <div className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping" style={{ animationDuration: '2s' }}></div>
                                            </div>
                                            
                                            {/* Role text */}
                                            <h2 className="text-xs md:text-sm font-mono text-white/90 tracking-[0.25em] uppercase relative z-10">
                                                Full Stack Developer
                                            </h2>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* RIGHT: Description and Button */}
                            <div className="max-w-sm flex flex-col items-start gap-5">
                                {currentFrameIdx >= 200 && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="relative pl-4 border-l-2 border-cyan-500/40"
                                    >
                                        <p className="text-sm md:text-base font-light tracking-wide leading-relaxed text-gray-300">
                                            Crafting{' '}
                                            <span className="text-white font-medium" style={{ textShadow: '0 0 12px rgba(6,182,212,0.4)' }}>modern</span>
                                            ,{' '}
                                            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-medium">scalable</span>
                                            {' '}and{' '}
                                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">high-performance</span>
                                            {' '}web applications with{' '}
                                            <span className="text-white font-medium" style={{ textShadow: '0 0 12px rgba(99,102,241,0.4)' }}>precision engineering</span>
                                            {' '}and{' '}
                                            <span className="text-cyan-300 font-medium">seamless user experience</span>.
                                        </p>
                                    </motion.div>
                                )}

                                {currentFrameIdx >= 240 && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                        className="pointer-events-auto"
                                    >
                                        <div className="w-full sm:w-auto inline-flex items-center gap-3 px-6 py-3 border border-white/15 bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer rounded-sm backdrop-blur-md group justify-center">
                                            <span className="text-white/80 font-mono tracking-widest uppercase text-xs group-hover:text-white transition-colors">Explore Work</span>
                                            <svg className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        {/* closing portfolio overlay */}

        {/* --- SCROLL TO EXPLORE INDICATOR --- */}
            {loaded && !hasScrolled && (
                <motion.div
                    key="scroll-indicator"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30, transition: { duration: 0.5 } }}
                    transition={{ duration: 1, ease: "easeOut", delay: 2.5 }}
                    className="absolute bottom-0 left-0 right-0 z-[70] flex flex-col items-center pointer-events-none pb-8"
                >
                    <div 
                        className="flex flex-col items-center pointer-events-auto cursor-pointer group select-none"
                        onClick={handleScrollDown}
                    >
                        {/* Mouse icon with scrolling dot */}
                        <div className="relative w-[26px] h-[42px] rounded-full border-2 border-white/60 flex justify-center mb-3 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300"
                            style={{ boxShadow: '0 0 15px rgba(255,255,255,0.1), inset 0 0 10px rgba(255,255,255,0.05)' }}
                        >
                            {/* Scrolling dot */}
                            <motion.div
                                className="w-[3px] h-[8px] bg-white group-hover:bg-cyan-400 rounded-full mt-[8px]"
                                animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>

                        {/* Text with side lines */}
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-white/40"></div>
                            <span className="font-mono text-[10px] text-white/90 tracking-[0.25em] uppercase whitespace-nowrap group-hover:text-cyan-400 transition-colors">
                                Scroll Down
                            </span>
                            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-white/40"></div>
                        </div>

                        {/* Animated triple chevrons */}
                        <div className="mt-3 flex flex-col items-center gap-[2px]">
                            {[0, 1, 2].map((i) => (
                                <motion.svg
                                    key={i}
                                    className="w-3 h-3 text-white/50 group-hover:text-cyan-400 transition-colors"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    animate={{ opacity: [0.2, 0.8, 0.2], y: [0, 3, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </motion.svg>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

    </div>
  );
}
