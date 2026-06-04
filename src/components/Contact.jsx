import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSend, FiUser, FiMail, FiMessageSquare } from "react-icons/fi";
import { addContact } from "../config/firebase";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const formRef = useRef();
  const scrollTriggerRef = useRef(null);
  
  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Form values state for live input feedback
  const [formValues, setFormValues] = useState({ name: "", email: "", message: "" });

  const frameCount = 160;
  const imagesRef = useRef([]);
  const seqRef = useRef({ frame: 0 });

  const currentFrame = (index) => `/image3/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

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

  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Dynamic canvas resolution for crisp rendering on all devices
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    const render = () => {
      if (!canvasRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let frameIdx = Math.round(seqRef.current.frame);
      if (frameIdx >= frameCount) frameIdx = frameCount - 1;
      if (frameIdx < 0) frameIdx = 0;
      
      // Monitor scroll to trigger form reveal
      setHasScrolled(frameIdx > 100);

      const img = imagesRef.current[frameIdx];
      if (img && img.complete && img.naturalHeight !== 0) {
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
      setCurrentFrameIdx(frameIdx);
    };

    // Set initial canvas size
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gContext = gsap.context(() => {
      // Responsive scroll distance
      const isMobile = window.innerWidth < 768;
      const scrollEnd = isMobile ? "+=2000" : "+=4000";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: scrollEnd,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1
        }
      });

      scrollTriggerRef.current = tl.scrollTrigger;

      tl.to(seqRef.current, { frame: frameCount - 1, snap: "frame", ease: "none", onUpdate: render });
    }, containerRef);
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      gContext.revert();
    };
  }, [loaded]);

  const handleScrollToForm = () => {
    if (scrollTriggerRef.current) {
      const targetScroll = scrollTriggerRef.current.start + (scrollTriggerRef.current.end - scrollTriggerRef.current.start) * 0.75;
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth"
      });
    } else if (containerRef.current) {
      const startPos = containerRef.current.offsetTop;
      // Scroll the window down inside the GSAP scroll-pinned track to immediately reveal the form
      window.scrollTo({
        top: startPos + 2600,
        behavior: "smooth"
      });
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);

    // Save to Firebase Firestore (non-blocking)
    addContact({
      name: formValues.name,
      email: formValues.email,
      message: formValues.message,
    }).catch((err) => console.warn("Firebase save failed:", err));

    // Send via EmailJS
    emailjs.sendForm("service_ezep6zg", "template_6fbergt", formRef.current, "0GSfZwE2fSCw9lqcZ")
      .then(() => {
        toast.success("TRANSMISSION_COMPLETE ");
        setIsSending(false);
        setFormValues({ name: "", email: "", message: "" });
        formRef.current.reset();
      })
      .catch(() => {
        toast.error("CONNECTION_FAILURE ");
        setIsSending(false);
      });
  };

  return (
    <div ref={containerRef} id="contact" className="relative w-full h-screen bg-[#020202] overflow-hidden flex items-center justify-center font-mono select-none px-2 sm:px-0">
      
      {!loaded && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#020202]">
          <div className="text-cyan-400 text-[10px] uppercase tracking-[0.5em] mb-4 animate-pulse">INITIATING_CORE {loadingProgress}%</div>
        </div>
      )}

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0" />
      
      {/* Interactive Scroll HUD Controller (matches Hero scroll design) */}
      {!hasScrolled && loaded && (
        <motion.div 
          key="scroll-indicator-contact"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30, transition: { duration: 0.5 } }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="absolute bottom-10 left-0 right-0 z-30 flex flex-col items-center pointer-events-none select-none"
        >
          <div 
            className="flex flex-col items-center pointer-events-auto cursor-pointer group"
            onClick={handleScrollToForm}
          >
            {/* Mouse icon with scrolling dot */}
            <div 
              className="relative w-[26px] h-[42px] rounded-full border-2 border-white/60 flex justify-center mb-3 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300"
              style={{ boxShadow: '0 0 15px rgba(255,255,255,0.1), inset 0 0 10px rgba(255,255,255,0.05)' }}
            >
              {/* Scrolling dot */}
              <motion.div
                className="w-[3px] h-[8px] bg-cyan-400 rounded-full mt-[8px]"
                animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Text with side lines */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-white/40"></div>
              <span className="font-mono text-[8px] sm:text-[9px] text-white/90 tracking-[0.15em] sm:tracking-[0.25em] uppercase whitespace-nowrap group-hover:text-cyan-400 transition-colors">
                Scroll to contact form
              </span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-white/40"></div>
            </div>

            {/* Animated triple chevrons */}
            <div className="mt-3 flex flex-col items-center gap-[2px]">
              {[0, 1, 2].map((i) => (
                <motion.svg
                  key={i}
                  className="w-3 h-3 text-cyan-400/70 group-hover:text-cyan-400 transition-colors"
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

      {/* Main Contact UI — always mounted, CSS-controlled visibility */}
      <div
        style={{
          opacity: hasScrolled ? 1 : 0,
          transform: hasScrolled ? "translateY(0) scale(1)" : "translateY(50px) scale(0.95)",
          pointerEvents: hasScrolled ? "auto" : "none",
          transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
        }}
        className="relative z-50 w-full max-w-xl px-3 sm:px-6"
          >
            {/* The Sci-Fi Chassis panel */}
            <div 
              className="relative bg-black/55 backdrop-blur-xl border border-white/10 p-6 sm:p-10 rounded-2xl overflow-hidden shadow-2xl"
              style={{ boxShadow: '0 0 50px rgba(6,182,212,0.12)' }}
            >
              {/* Corner targeting brackets */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-500/80 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan-500/80 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyan-500/80 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-500/80 rounded-br-lg" />
              
              {/* Tech background status grids */}
              <div className="absolute top-4 right-4 text-[7px] text-gray-600 font-mono tracking-wider text-right uppercase pointer-events-none hidden sm:block select-none">
                SYS.TYPE: DATA_IN<br/>
                LOC: SEC.NODE.84<br/>
                PORT: COM_SSL_256
              </div>

              <form ref={formRef} onSubmit={sendEmail} className="space-y-6 select-text">
                {/* Title */}
                <div>
                  <h2 className="text-white text-lg sm:text-2xl font-black uppercase tracking-widest border-b border-white/10 pb-3 flex items-center justify-between select-none">
                    <span>TRANSMIT_REQUEST</span>
                    <span className="flex items-center gap-1.5 text-[8px] sm:text-[9px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2 py-0.5 rounded uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                      Secure Link
                    </span>
                  </h2>
                </div>
                
                {/* Inputs Stack */}
                <div className="space-y-5">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <div className="relative flex items-center">
                      <FiUser className="absolute left-4 text-cyan-500/70 w-4 h-4 pointer-events-none" />
                      <input 
                        name="name" 
                        type="text" 
                        placeholder="IDENTIFIER (NAME)" 
                        required 
                        value={formValues.name}
                        onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 focus:border-cyan-500/50 p-3.5 pl-11 text-white text-xs outline-none focus:outline-none transition-all rounded-lg font-mono focus:shadow-[0_0_15px_rgba(6,182,212,0.06)]" 
                      />
                    </div>
                    {/* Live input logger log */}
                    <div className="text-[8px] font-mono text-cyan-500/40 pl-2 uppercase tracking-widest select-none">
                      {formValues.name ? `[ INPUT: "${formValues.name.slice(0, 15)}..." REGISTERED ]` : "> WAITING FOR NAME INPUT..."}
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <div className="relative flex items-center">
                      <FiMail className="absolute left-4 text-cyan-500/70 w-4 h-4 pointer-events-none" />
                      <input 
                        name="email" 
                        type="email" 
                        placeholder="COMM_CHANNEL (EMAIL)" 
                        required 
                        value={formValues.email}
                        onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 focus:border-cyan-500/50 p-3.5 pl-11 text-white text-xs outline-none focus:outline-none transition-all rounded-lg font-mono focus:shadow-[0_0_15px_rgba(6,182,212,0.06)]" 
                      />
                    </div>
                    {/* Live input logger log */}
                    <div className="text-[8px] font-mono text-cyan-500/40 pl-2 uppercase tracking-widest select-none">
                      {formValues.email ? `[ ADDR: "${formValues.email.slice(0, 18)}" ACQUIRED ]` : "> WAITING FOR COM ADDRESS..."}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="space-y-1.5">
                    <div className="relative flex">
                      <FiMessageSquare className="absolute left-4 top-4 text-cyan-500/70 w-4 h-4 pointer-events-none" />
                      <textarea 
                        name="message" 
                        placeholder="PROJECT_SPECIFICATIONS (MESSAGE)..." 
                        required 
                        value={formValues.message}
                        onChange={(e) => setFormValues({ ...formValues, message: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 focus:border-cyan-500/50 p-3.5 pl-11 text-white text-xs outline-none focus:outline-none transition-all min-h-[110px] rounded-lg font-mono resize-none focus:shadow-[0_0_15px_rgba(6,182,212,0.06)]" 
                      />
                    </div>
                    {/* Live input logger log */}
                    <div className="text-[8px] font-mono text-cyan-500/40 pl-2 uppercase tracking-widest select-none">
                      {formValues.message ? `[ PAYLOAD: ${formValues.message.length} BYTES STAGED ]` : "> WAITING FOR CORE PAYLOAD DESCRIPTION..."}
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <button 
                  disabled={isSending}
                  type="submit" 
                  className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-[10px] uppercase tracking-[0.4em] transition-all rounded-lg shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 relative overflow-hidden group/submit cursor-pointer"
                >
                  {/* Laser sweep line overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/submit:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                  
                  <span className="relative z-10 flex items-center justify-center gap-2 select-none">
                    <FiSend className="w-3.5 h-3.5 animate-pulse" />
                    {isSending ? "TRANSMITTING DATA_PACKETS..." : "INITIATE BROADCAST"}
                  </span>
                </button>
              </form>
          </div>
        </div>

      <ToastContainer position="bottom-right" theme="dark" toastClassName="bg-black/80 text-xs font-mono" />
    </div>
  );
};

export default Contact;