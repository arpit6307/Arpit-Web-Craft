import React, { useState, useRef } from 'react';
import { FiAward, FiBookOpen, FiCode, FiDownload, FiX, FiCheckCircle, FiArrowRight, FiUser, FiActivity } from "react-icons/fi";
import { 
  SiReact, 
  SiTailwindcss, 
  SiGit,
  SiVite,
  SiBootstrap,
  SiFirebase,
  SiGithub
} from "react-icons/si";

export default function About() {
  // State to control Resume Popup Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to control active Tab information
  const [activeTab, setActiveTab] = useState("languages");

  // State for image spotlight effect
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const TabsData = {
    languages: {
      title: "Languages",
      icon: <FiCode size={14} />,
      content: (
        <div className="space-y-4">
          <p className="text-cyan-400/70 text-[9px] font-mono uppercase tracking-[0.3em] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> &gt; Core Technologies
          </p>
          <div className="flex flex-wrap gap-2">
            {["React js", "Vite", "Bootstrap CSS", "Firebase", "HTML", "CSS", "JS"].map((lang, idx) => (
              <span key={idx} className="group/tag flex items-center space-x-2 px-3 py-1.5 bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 text-gray-300 hover:text-white rounded-lg text-xs font-mono transition-all duration-300 cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover/tag:shadow-[0_0_8px_rgba(6,182,212,0.6)]"></span>
                <span>{lang}</span>
              </span>
            ))}
          </div>
        </div>
      )
    },
    education: {
      title: "Education",
      icon: <FiBookOpen size={14} />,
      content: (
        <div className="space-y-4">
          <p className="text-purple-400/70 text-[9px] font-mono uppercase tracking-[0.3em] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> &gt; Academic Timeline
          </p>
          <div className="relative pl-6 border-l border-white/5 space-y-4">
            <div className="relative">
              <span className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></span>
              <h5 className="text-white text-xs font-bold tracking-wide uppercase">10th Standard Passing</h5>
              <p className="text-cyan-400/60 font-mono text-[9px] mt-0.5">National Institute of Open Schooling (NIOS)</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
              <h5 className="text-white text-xs font-bold tracking-wide uppercase">Diploma in Computer Science</h5>
              <p className="text-purple-400/60 font-mono text-[9px] mt-0.5">Maharishi University of Information Technology (MUIT) — Finished</p>
            </div>
          </div>
        </div>
      )
    },
    projects: {
      title: "Projects",
      icon: <FiAward size={14} />,
      content: (
        <div className="space-y-4">
          <p className="text-emerald-400/70 text-[9px] font-mono uppercase tracking-[0.3em] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> &gt; Production Deployments
          </p>
          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold"
                style={{ boxShadow: '0 0 15px rgba(6,182,212,0.15)' }}
              >5+</div>
              <span className="text-white text-xs font-medium uppercase tracking-wide font-mono">Architectures Deployed</span>
            </div>
            {/* Visual Metrics Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] font-mono text-gray-500">
                <span>PROJECT COMPLETION RATE</span>
                <span className="text-cyan-400">100%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ boxShadow: '0 0 8px rgba(6,182,212,0.4)' }}></div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  const Tools = [
    { icon: <SiReact size={20} />, title: "React js", glow: "hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:border-cyan-500/40 hover:text-cyan-400" },
    { icon: <SiVite size={20} />, title: "Vite", glow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:border-purple-500/40 hover:text-purple-400" },
    { icon: <SiBootstrap size={20} />, title: "Bootstrap CSS", glow: "hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:border-violet-500/40 hover:text-violet-400" },
    { icon: <SiFirebase size={20} />, title: "Firebase", glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:border-amber-500/40 hover:text-amber-400" },
    { icon: <SiGithub size={20} />, title: "GitHub", glow: "hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:border-white/30 hover:text-white" },
    { icon: <SiGit size={20} />, title: "Git", glow: "hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:border-red-500/40 hover:text-red-400" },
    { icon: <SiTailwindcss size={20} />, title: "Tailwind CSS", glow: "hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:border-sky-500/40 hover:text-sky-400" },
  ];

  return (
    <div id="about" className="relative w-full min-h-screen bg-[#020202] overflow-hidden flex items-center justify-center font-sans tracking-wide py-16 sm:py-24 px-4 sm:px-6 md:px-12">
        
        {/* --- BG EFFECTS --- */}
        <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <div className="absolute inset-0 z-[15] pointer-events-none" style={{ background: "radial-gradient(circle at 30% 50%, transparent 20%, rgba(0,0,0,0.9) 100%)" }}></div>
        {/* Subtle cyan glow behind content */}
        <div className="absolute top-1/3 right-[20%] w-[400px] h-[400px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

        {/* --- DYNAMIC SPOTLIGHT IMAGE (LEFT 45%) --- */}
        <div 
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="absolute inset-y-0 left-0 w-[45%] z-10 pointer-events-auto overflow-hidden hidden lg:block select-none" 
            style={{ WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)', maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)' }}
        >
            {/* Base Grayscale Image */}
            <img 
               src="/images/ezgif-frame-240.jpg" 
               alt="About Profile Base" 
               className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale brightness-[60%]" 
            />
            {/* Colored Spotlight Image */}
            <img 
               src="/images/ezgif-frame-240.jpg" 
               alt="About Profile Color" 
               className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 brightness-110 contrast-125 saturate-150"
               style={{
                   opacity: isHovered ? 1 : 0,
                   WebkitMaskImage: `radial-gradient(circle 220px at ${cursorPos.x}px ${cursorPos.y}px, black 0%, rgba(0,0,0,0.8) 40%, transparent 100%)`,
                   maskImage: `radial-gradient(circle 220px at ${cursorPos.x}px ${cursorPos.y}px, black 0%, rgba(0,0,0,0.8) 40%, transparent 100%)`
               }}
            />

            {/* Diagnostic Scope Target Tracking System */}
            {isHovered && (
              <div 
                className="absolute pointer-events-none z-20 font-mono text-[7px] text-cyan-400/80 mix-blend-screen"
                style={{
                  left: `${cursorPos.x}px`,
                  top: `${cursorPos.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-16 h-16 rounded-full border border-cyan-500/30 flex items-center justify-center relative">
                  <div className="w-8 h-8 rounded-full border border-dashed border-cyan-500/25 animate-spin" style={{ animationDuration: '8s' }} />
                  <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyan-500/20" />
                  <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-cyan-500/20" />
                </div>
                <div className="absolute top-0 left-20 whitespace-nowrap bg-black/85 px-2.5 py-1.5 border border-cyan-500/25 rounded-md backdrop-blur-md space-y-0.5 text-left">
                  <div>COORD: X_{Math.round(cursorPos.x)} / Y_{Math.round(cursorPos.y)}</div>
                  <div>SECURITY_LEVEL: L5_SYS</div>
                  <div>BIOMETRIC_CHECK: MATCHED</div>
                </div>
              </div>
            )}
        </div>

        {/* --- CONTENT (RIGHT 55%) --- */}
        <div className="relative z-[50] w-full lg:w-[85%] flex flex-col md:flex-row items-center justify-end pointer-events-none">
            
            {/* Visual Gap for the face mask area */}
            <div className="hidden lg:block w-[32%] h-full"></div>

            {/* Main Content Pane */}
            <div className="w-full lg:w-[68%] flex flex-col space-y-6 pointer-events-auto relative">
                
                {/* HUD Tech Borders */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-500/30 rounded-tl-xl z-20" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-500/30 rounded-tr-xl z-20" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-500/30 rounded-bl-xl z-20" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-500/30 rounded-br-xl z-20" />

                {/* Glassmorphic card background */}
                <div className="absolute inset-0 bg-black/55 backdrop-blur-md border border-white/[0.06] rounded-2xl" style={{ boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}></div>
                
                <div className="relative z-10 p-5 sm:p-8 lg:p-10 space-y-6">

                    {/* Header */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-[1px] w-6 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                                <p className="text-cyan-400 font-mono text-[9px] uppercase tracking-[0.4em] leading-none">SYSTEM_INFO</p>
                            </div>
                            <span className="hidden sm:inline font-mono text-[7px] text-gray-600 uppercase tracking-widest">LOC: IN.LKO.05 // REF: OP_ARPIT</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-2">
                            <span className="text-white">About </span>
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Me</span>
                            <span className="text-indigo-500">.</span>
                        </h2>
                        <div className="h-[2px] w-20 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"></div>
                    </div>

                    {/* Bio Paragraph */}
                    <div>
                        <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
                            I am a passionate{' '}
                            <span className="text-white font-bold" style={{ textShadow: '0 0 10px rgba(6,182,212,0.25)' }}>Full Stack Web Developer</span>
                            {' '}specializing in the modern JavaScript ecosystem. My expertise lies in engineering{' '}
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">high-performance</span>,{' '}
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">secure server nodes</span>
                            {' '}with modular layout architectures.
                        </p>
                    </div>

                    {/* --- MODERN INTERACTIVE TABS SYSTEM --- */}
                    <div className="flex flex-col sm:flex-row gap-5 border border-white/[0.05] p-4 bg-white/[0.01] rounded-xl relative overflow-hidden">
                      {/* Background scanning line */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/[0.02] to-transparent animate-pulse pointer-events-none"></div>
                      
                      {/* Tabs Controller Nav */}
                      <div className="flex sm:flex-col overflow-x-auto sm:overflow-x-visible scrollbar-none border-b sm:border-b-0 sm:border-r border-white/[0.05] pb-2 sm:pb-0 sm:pr-4 gap-1.5 w-full sm:w-[150px] shrink-0">
                        {Object.keys(TabsData).map((tabKey) => (
                          <button
                            key={tabKey}
                            onClick={() => setActiveTab(tabKey)}
                            className={`relative flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer ${
                              activeTab === tabKey
                                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25"
                                : "text-gray-500 hover:text-white hover:bg-white/5 border border-transparent"
                            }`}
                          >
                            <span className="relative z-10">{TabsData[tabKey].icon}</span>
                            <span className="relative z-10">{TabsData[tabKey].title}</span>
                          </button>
                        ))}
                      </div>

                      {/* Active Tab Showcase Pane */}
                      <div className="flex-1 min-h-[120px] flex flex-col justify-center relative z-10">
                        {TabsData[activeTab].content}
                      </div>
                    </div>

                    {/* Tech Dock */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-[1px] w-4 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                            <h4 className="text-[9px] font-mono text-gray-500 tracking-[0.3em] uppercase">Core Tech Stack</h4>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {Tools.map((tool) => (
                                <div key={tool.title} className={`group relative p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center justify-center transition-all duration-300 cursor-help ${tool.glow}`}>
                                    <div className="text-gray-500 group-hover:text-inherit transition-colors duration-300">
                                        {tool.icon}
                                    </div>
                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 text-white text-[8px] font-mono py-1 px-2.5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[70] whitespace-nowrap shadow-xl">
                                        {tool.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-[10px] font-mono uppercase tracking-[0.25em] transition-all duration-300 rounded-xl cursor-pointer overflow-hidden shadow-lg shadow-cyan-600/10"
                        >
                            {/* Button shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <FiDownload className="relative z-10 w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                            <span className="relative z-10">Access Resume</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* --- SAME SCREEN RESUME POPUP MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-lg">
            <div className="relative w-full max-w-4xl h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl" style={{ boxShadow: '0 0 60px rgba(6,182,212,0.1)' }}>
              
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/80 rounded-tl-md" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/80 rounded-tr-md" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/80 rounded-bl-md" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/80 rounded-br-md" />

              {/* Modal Header Controls */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] relative z-10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] animate-pulse"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">Document Viewer</span>
                    <h3 className="text-white font-bold text-xs sm:text-sm">resume.pdf</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 border border-transparent rounded-lg transition-all duration-300 cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* PDF Container Frame */}
              <div className="flex-1 w-full h-full bg-[#1a1a1a] relative z-10">
                <iframe 
                  src="/resume.pdf" 
                  title="Resume PDF Viewer"
                  className="w-full h-full border-none"
                />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}