import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  FiLayout, 
  FiServer, 
  FiCloud, 
  FiZap, 
  FiBriefcase, 
  FiArrowRight,
  FiX,
  FiCpu,
  FiTrendingUp,
  FiActivity,
  FiShield,
  FiTerminal
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const sidebarRef = useRef(null);

  // State to hold open service modal target details
  const [activeModal, setActiveModal] = useState(null);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);

  const mainServices = [
    {
      id: "frontend",
      icon: <FiLayout size={24} />,
      title: "Frontend Development",
      p: "Engineering pixel-perfect, lightning-fast interfaces using React.js and Vite. Structured implementation of production-grade utility frames like Tailwind CSS and Bootstrap CSS to optimize modular user workflow layouts.",
      capabilities: [
        "Component-Driven Clean Architecture (React, Vite)",
        "Advanced Responsive Breakpoints (Tailwind, Bootstrap)",
        "State Optimization & Real-Time DOM Synchronization",
        "Interactive Animations using High-Performance Frameworks"
      ],
      glowColor: "rgba(59, 130, 246, 0.15)", // Blue
      borderColor: "group-hover:border-blue-500/50",
      accentText: "text-blue-400",
      telemetry: "FPS: 60.0 // DOM_SYNC: OK",
      diagnostic: "UI_THREAD: ACTIVE // RENDER_PIPELINE: VITE_V8"
    },
    {
      id: "backend",
      icon: <FiServer size={24} />,
      title: "Backend & API Design",
      p: "Architecting enterprise-grade server infrastructure and custom secure API layers. Designing robust document schemas in MongoDB paired with high-performance routing matrices in Node.js, Express, and FastAPI systems.",
      capabilities: [
        "RESTful API Route Optimization & Security Hardening",
        "Structured Database Schemas (MongoDB Atlas)",
        "Secure Session JSON Web Tokens (JWT)",
        "Asynchronous Microservices Engineering"
      ],
      glowColor: "rgba(6, 182, 212, 0.15)", // Cyan
      borderColor: "group-hover:border-cyan-500/50",
      accentText: "text-cyan-400",
      telemetry: "PING: 14ms // JWT: SECURE",
      diagnostic: "THREAD_POOL: 16 // DB_CONN: MONGO_POOL_OK"
    },
    {
      id: "deployment",
      icon: <FiCloud size={24} />,
      title: "Deployment & Hosting",
      p: "Managing seamless cloud pipeline infrastructure deployments across Vercel and production environments. Integrating safe domain names, custom SSL handshakes, repository version pipeline hooks, and secure secrets token rotations.",
      capabilities: [
        "Automated CI/CD Workflows via GitHub Hooks",
        "Edge Infrastructure Configurations on Vercel",
        "DNS routing, SSL Certification, and Custom Domain Bindings",
        "Environment Secret Management & Variables Protection"
      ],
      glowColor: "rgba(16, 185, 129, 0.15)", // Emerald
      borderColor: "group-hover:border-emerald-500/50",
      accentText: "text-emerald-400",
      telemetry: "EDGE_SYNC: 100% // SSL: ACTIVE",
      diagnostic: "DEPLOY_HOST: VERCEL_EDGE // SSL_CERT: EXPIRES_365D"
    },
    {
      id: "realtime",
      icon: <FiZap size={24} />,
      title: "Real-Time Solutions",
      p: "Building immersive multi-user channels utilizing persistent WebSocket connections. Engineered for sub-millisecond status notification cascades, chat server networks, and interactive real-time data visual synchronization.",
      capabilities: [
        "Persistent Bi-directional Socket Connections",
        "Instant System Notification Engines",
        "Real-time Chat Application Architectures",
        "Dynamic Multi-user State Synchronization Logs"
      ],
      glowColor: "rgba(245, 158, 11, 0.15)", // Amber
      borderColor: "group-hover:border-amber-500/50",
      accentText: "text-amber-400",
      telemetry: "SOCKET: LIVE // CHANNELS: 8",
      diagnostic: "WS_LATENCY: 0.8ms // STATE_SYNC: SYNC_IN_FLIGHT"
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // 1. Header Animation
      tl.fromTo(headerRef.current.children, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: "none", stagger: 0.1 }
      );

      // 2. Main Services Grid Stagger
      tl.fromTo(".service-card", 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 0.3, ease: "none", stagger: 0.1 },
        "-=0.2"
      );

      // 3. Experience Sidebar Slide
      tl.fromTo(sidebarRef.current, 
        { opacity: 0, x: 50 }, 
        { opacity: 1, x: 0, duration: 0.5, ease: "none" },
        "-=0.3"
      );

      // UI corner lines animation for sidebar
      tl.fromTo(".corner-line",
        { scale: 0 },
        { scale: 1, duration: 0.3, ease: "none", stagger: 0.05 },
        "-=0.2"
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Hacking ledger logic simulation trigger
  useEffect(() => {
    if (!showLogsModal) {
      setTerminalLogs([]);
      return;
    }

    const logsList = [
      "ACCESSING HAPINEST FINANCIAL DATABASE DATABASE...",
      "ESTABLISHING CRYPTOGRAPHIC PORT TO LEDGER_DB...",
      "LEDGER POOL CONNECTION: STABLE (0x0F4A2B)",
      "SSL HANDSHAKE VERIFIED: TLS_v1.3 // ALG: AES-256-GCM",
      "INTEGRITY STATUS: 100% CORRELATION SECURED",
      "PARSING BILLING MATRIX & CUSTOM DATA ENTRY RECORDS...",
      "AUDITING LEDGER ENTRIES FOR DATA GAP MITIGATION...",
      "0 TRANSACTION INCONSISTENCIES FOUND IN PARSED DATASTREAM.",
      "INVENTORY LEDGER LOAD: VERIFIED SECURE (100.0%)",
      "SYS_DAEMON: BILLING INTERFACE PIPELINES OPERATIONAL.",
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logsList.length) {
        setTerminalLogs((prev) => [...prev, logsList[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [showLogsModal]);

  // Spotlight card component with coordinate tracking
  const ServiceCard = ({ service }) => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [isFocused, setIsFocused] = useState(false);

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    return (
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
        className="service-card group p-6 sm:p-10 bg-[#0a0a0a]/90 border border-white/[0.05] hover:border-transparent rounded-2xl transition-all duration-500 cursor-default flex flex-col items-start justify-between relative overflow-hidden backdrop-blur-sm shadow-xl"
        style={{ boxShadow: '0 0 30px rgba(0,0,0,0.5)' }}
      >
        {/* Dynamic spot light radial background */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-0"
          style={{
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${service.glowColor}, transparent 40%)`,
          }}
        />

        {/* Dynamic spotlight border */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10"
          style={{
            background: `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, ${service.glowColor.replace("0.15", "0.45")}, transparent 55%)`,
            maskImage: 'linear-gradient(black, black)',
            WebkitMaskImage: 'linear-gradient(black, black)',
            maskClip: 'content-box, border-box',
            WebkitMaskClip: 'content-box, border-box',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'destination-out',
            border: '1px solid transparent',
            borderRadius: 'inherit'
          }}
        />

        <div className="relative z-20 w-full">
          {/* Card telemetry indicator */}
          <div className="flex justify-between items-center w-full mb-6 font-mono text-[7px] text-gray-600 tracking-wider">
            <span>MODULE::{service.id.toUpperCase()}</span>
            <span className="group-hover:text-cyan-400/60 transition-colors">{service.telemetry}</span>
          </div>

          <div className={`mb-6 sm:mb-8 inline-block p-4 bg-white/5 border border-white/10 rounded-xl text-gray-300 group-hover:text-white group-hover:scale-105 group-hover:border-white/20 transition-all duration-300`}>
            {service.icon}
          </div>
          
          <h3 className="text-lg sm:text-xl font-black text-white mb-3 tracking-tight uppercase group-hover:text-white transition-colors">
            {service.title}
          </h3>
          <p className="text-gray-500 font-light text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
            {service.p}
          </p>
        </div>

        <button 
          onClick={() => setActiveModal(service)}
          className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400 group-hover:text-white group/btn transition-colors mt-auto cursor-pointer relative z-20"
        >
          <span>View Details</span> 
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  };

  return (
    <section 
      id="services" 
      ref={containerRef}
      className="relative py-20 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-[#000] text-white overflow-hidden scroll-mt-24 w-full"
    >
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      
      {/* Subtle Glow Accents */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0"></div>
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

      {/* Header */}
      <div ref={headerRef} className="max-w-7xl mx-auto text-center mb-16 sm:mb-24 relative z-10">
        <div className="inline-block px-3.5 py-1.5 border border-blue-500/30 bg-blue-500/5 rounded-full mb-4">
          <p className="text-blue-400 font-mono text-[9px] uppercase tracking-[0.4em] leading-none">SERVICES MODULE</p>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">
          My Services<span className="text-blue-500">.</span>
        </h2>
        <div className="w-20 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full mx-auto mb-6 sm:mb-8"></div>
        <p className="max-w-2xl mx-auto text-gray-500 font-light text-sm sm:text-base leading-relaxed">
          Deploying production-ready application pipelines, optimizing asynchronous database nodes, and implementing enterprise system interfaces.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative z-10">
        
        {/* Main Services Grid */}
        <div ref={gridRef} className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {mainServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* --- UPGRADED FUTURISTIC EXPERIENCE SIDEBAR --- */}
        <div ref={sidebarRef} className="lg:col-span-4 h-full relative w-full">
          <div className="sticky top-32 p-6 sm:p-8 bg-[#0a0a0a]/90 backdrop-blur-md border border-blue-500/20 rounded-2xl group overflow-hidden shadow-2xl">
            
            {/* HUD Tech Corner Lines */}
            <div className="corner-line absolute top-3 left-3 w-4 h-4 border-t border-l border-blue-500/40"></div>
            <div className="corner-line absolute top-3 right-3 w-4 h-4 border-t border-r border-blue-500/40"></div>
            <div className="corner-line absolute bottom-3 left-3 w-4 h-4 border-b border-l border-blue-500/40"></div>
            <div className="corner-line absolute bottom-3 right-3 w-4 h-4 border-b border-r border-blue-500/40"></div>

            <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/5 blur-[80px] group-hover:bg-blue-600/10 transition-all duration-1000" />
            
            <div className="relative z-10 flex flex-col h-full space-y-6">
              
              {/* Sidebar Header with Corporate Branding Logo */}
              <div className="flex items-center justify-between border-b border-white/5 pb-5">
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                    <FiBriefcase size={20} />
                  </div>
                  <div>
                    <h3 className="text-white text-base sm:text-lg font-black tracking-widest uppercase">Experience</h3>
                    <span className="text-[7px] font-mono text-blue-500 block tracking-[0.3em] mt-0.5">CORE MODULE ACTIVE</span>
                  </div>
                </div>
                {/* Happinest Corporate Vector Logo Container */}
                <div className="w-11 h-11 rounded-full p-0.5 bg-[#0e2715] border border-emerald-500/30 overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0 animate-pulse">
                  <img 
                    src="/happinestindia_logo.jpg" 
                    alt="Happinest Poultry Products Logo" 
                    className="w-full h-full object-cover rounded-full transform scale-105"
                  />
                </div>
              </div>

              {/* Company Identity Tags */}
              <div className="space-y-1">
                <h4 className="text-white text-sm font-bold tracking-wide uppercase">Happinest Poultry Products Pvt. Ltd.</h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[8px] font-mono font-bold px-2.5 py-0.5 bg-white text-black rounded-md uppercase tracking-tight">Fintech Operations</span>
                  <span className="text-[8px] font-mono px-2.5 py-0.5 border border-white/10 text-gray-400 rounded-md uppercase tracking-wider">Data Architecture</span>
                </div>
              </div>

              {/* Professional Financial Data & Ledger Logic Copywriting */}
              <p className="text-gray-400 font-light text-xs sm:text-sm leading-relaxed border-l-2 border-blue-500/30 pl-4 py-1">
                Operating as an enterprise <span className="text-white font-medium">Billing Accountant & Data Entry Specialist</span>. Engineered high-fidelity structural data capture layouts, audit log validation pipelines, and optimized ledger inventory tracking matrix records—transforming algorithmic precision directly into clean business systems processing.
              </p>

              {/* Live Telemetry Display */}
              <div className="grid grid-cols-2 gap-2 text-[8px] text-gray-500 uppercase tracking-widest bg-white/[0.01] border border-white/5 p-3 rounded-xl font-mono">
                <div>AUDITED_RECORDS: <span className="text-white font-bold">148,932</span></div>
                <div className="flex items-center gap-1.5">INTEGRITY: <span className="text-emerald-400 font-bold uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> PASS</span></div>
                <div>SYS_LATENCY: <span className="text-cyan-400 font-bold">12ms</span></div>
                <div>PRECISION: <span className="text-blue-400 font-bold">100.0%</span></div>
              </div>

              {/* Work Showcase Container Engineered To Strict 16:9 Aspect Ratio */}
              <div className="space-y-4 pt-1">
                <div className="relative overflow-hidden rounded-xl border border-white/5 group/img aspect-video w-full shadow-2xl">
                  <div className="absolute inset-0 bg-blue-600/5 z-10 mix-blend-overlay"></div>
                  <img 
                    className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 transform scale-100 group-hover:scale-105" 
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800" 
                    alt="Analytical Infrastructure Network Visual" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-4 font-mono text-[8px] text-gray-500 tracking-[0.2em] uppercase">SYSTEM_DATA_STREAM_01</div>
                </div>
                
                <button 
                  onClick={() => setShowLogsModal(true)}
                  className="w-full relative py-3.5 bg-white/5 border border-white/10 hover:border-blue-500/30 text-white font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600/10 transition-all duration-300 rounded-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <FiTerminal className="w-3.5 h-3.5 text-blue-400" />
                  View Architecture Logs
                </button>
              </div>
            </div>
          </div>

          {/* Micro HUD Footer */}
          <div className="mt-4 flex justify-between items-center font-mono text-[8px] sm:text-[9px] text-gray-700 tracking-[0.2em] px-2 opacity-50">
            <span>&gt; DATABASE MAPPING SECURE</span>
            <span>0x4D32B</span>
          </div>
        </div>

      </div>

      {/* --- FLOATING CYBERPUNK MODAL: SERVICE SPECIFICATION PREVIEW --- */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: '0 0 50px rgba(59,130,246,0.1)' }}
          >
            {/* Modal Corner Brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/80 rounded-tl-md" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500/80 rounded-tr-md" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500/80 rounded-bl-md" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/80 rounded-br-md" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center space-x-3">
                <div className="text-blue-400 p-2 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                  {activeModal.icon}
                </div>
                <div>
                  <span className="text-[8px] font-mono text-blue-500 tracking-[0.3em] block uppercase">SPECIFICATION MATRIX</span>
                  <h3 className="text-white text-lg font-black uppercase tracking-tight">{activeModal.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body / Scope of Work Details */}
            <div className="space-y-4">
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-light">
                {activeModal.p}
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center space-x-2 text-gray-500 font-mono text-[9px] tracking-wider uppercase">
                  <FiCpu className="text-blue-500" />
                  <span>Deployment Deliverables & Core Capabilities:</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {activeModal.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                      <FiTrendingUp className="text-blue-400 shrink-0 mt-0.5" size={12} />
                      <span className="text-gray-300 text-xs font-light">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Diagnostic readout */}
            <div className="text-[8px] font-mono text-gray-600 bg-white/[0.01] border border-white/5 p-2 rounded-lg">
              &gt; {activeModal.diagnostic}
            </div>

            {/* Modal Action Footer */}
            <div className="pt-4 border-t border-white/5 flex">
              <a 
                href="#contact"
                onClick={() => setActiveModal(null)}
                className="w-full text-center py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-mono uppercase tracking-[0.2em] font-bold rounded-xl transition-all shadow-lg shadow-blue-600/10"
              >
                Initiate Project Contract
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- FLOATING LEDGER TERMINAL LOGS MODAL --- */}
      {showLogsModal && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setShowLogsModal(false)}
        >
          <div 
            className="relative w-full max-w-xl bg-black border border-emerald-500/20 rounded-2xl p-6 sm:p-8 flex flex-col space-y-6 shadow-2xl font-mono"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: '0 0 50px rgba(16,185,129,0.1)' }}
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500/80 rounded-tl-md" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500/80 rounded-tr-md" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500/80 rounded-bl-md" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500/80 rounded-br-md" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center space-x-3">
                <div className="text-emerald-400 p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                  <FiTerminal size={20} />
                </div>
                <div>
                  <span className="text-[8px] text-emerald-500 tracking-[0.3em] block uppercase">TERMINAL SECURE REPORT</span>
                  <h3 className="text-white text-sm font-black uppercase tracking-tight">HAPINEST_LEDGER_REPORT</h3>
                </div>
              </div>
              <button 
                onClick={() => setShowLogsModal(false)}
                className="p-1.5 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Terminal screen body */}
            <div className="bg-[#050505] border border-white/5 p-4 rounded-xl space-y-1.5 min-h-[220px] max-h-[300px] overflow-y-auto select-text scrollbar-none text-[9px] sm:text-xs">
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex gap-2 text-emerald-400">
                  <span className="text-emerald-600 font-bold shrink-0">&gt;&gt;</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
              {terminalLogs.length < 10 && (
                <div className="flex gap-2 text-emerald-500/60 animate-pulse">
                  <span className="text-emerald-600 font-bold shrink-0">&gt;&gt;</span>
                  <span>RUNNING SYSTEM AUDITS...</span>
                </div>
              )}
            </div>

            <div className="text-[7px] text-gray-600 flex justify-between uppercase">
              <span>REPORT_REF: EXP_0x9A</span>
              <span>STATE: VERIFIED_SAFE</span>
            </div>

            {/* Modal Action Footer */}
            <div className="pt-2 flex">
              <button 
                onClick={() => setShowLogsModal(false)}
                className="w-full text-center py-3.5 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-[0.2em] font-bold rounded-xl transition-all"
              >
                CLOSE TERMINAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Lines Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/[0.03] z-10"></div>
      <div className="absolute top-0 right-1/2 w-[1px] h-full bg-white/[0.03] z-10"></div>
    </section>
  );
}