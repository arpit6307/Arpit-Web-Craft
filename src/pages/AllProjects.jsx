import React, { useState, useEffect, useMemo } from "react";
import { FiGithub, FiExternalLink, FiX, FiActivity, FiArrowRight, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useProjects } from "../hooks/useProjects";
import ParticleBackground from "../components/ParticleBackground";
import Footer from "../components/Footer";

export default function AllProjects({ onClose }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [liveDemoUrl, setLiveDemoUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const { projects, loading } = useProjects();

  // Scroll to top when page mounts, and handle scroll lock if opened as modal
  useEffect(() => {
    window.scrollTo(0, 0);
    if (onClose) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  // ESC key to close
  useEffect(() => {
    if (!onClose) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const categories = ["All", "Full Stack", "Frontend", "Next.js & AI", "APIs & Web3"];

  // Handle loading state inside the component
  const filteredProjects = useMemo(() => {
    if (loading) return [];
    return projects.filter((project) => {
      // Search matching
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Category matching
      if (activeCategory === "All") return true;
      
      const tags = project.tags.map(t => t.toLowerCase());
      
      if (activeCategory === "Full Stack") {
        return tags.some(t => ["fastapi", "mongodb", "node.js", "express", "graphql", "firebase", "postgresql", "prisma"].includes(t));
      }
      if (activeCategory === "Frontend") {
        return tags.some(t => ["react", "tailwind", "tailwind css", "gsap animations", "gsap", "chart.js", "vite", "framer motion", "bootstrap css"].includes(t));
      }
      if (activeCategory === "Next.js & AI") {
        return tags.some(t => ["next.js", "openai api", "next"].includes(t));
      }
      if (activeCategory === "APIs & Web3") {
        return tags.some(t => ["web3 api", "stripe", "socket.io"].includes(t));
      }

      return true;
    });
  }, [projects, searchQuery, activeCategory, loading]);

  const ProjectCard = ({ project }) => (
    <div
      className="group relative rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/40 hover:scale-[1.02] transition-all duration-500 flex flex-col justify-between cursor-pointer overflow-hidden backdrop-blur-md h-full shadow-2xl"
      onClick={() => setSelectedProject(project)}
      style={{ transformStyle: 'preserve-3d', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}
    >
      {/* Cybernetic glowing background on card hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 via-cyan-500/0 to-cyan-500/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

      <div>
        {/* Aspect ratio set to aspect-video (16:9) to display screenshots perfectly */}
        <div className="relative overflow-hidden aspect-video rounded-t-xl sm:rounded-t-2xl bg-[#080808]">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-contain bg-[#030303] transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Neon scanline accent sweep */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-y-[100%] transition-all duration-[1500ms] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/40 to-transparent opacity-95 group-hover:opacity-75 transition-opacity duration-500"></div>
          
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0 hidden sm:block">
            <span className="flex items-center gap-2 text-[8px] sm:text-[9px] font-mono text-cyan-400 bg-black/75 border border-cyan-500/30 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
              DECRYPTING BLUEPRINT
            </span>
          </div>
        </div>

        {/* Info panel */}
        <div className="p-3 sm:p-5 relative z-10 sm:-mt-6">
          <h3 className="text-sm sm:text-lg font-black text-white mb-1.5 sm:mb-3 tracking-tight group-hover:text-cyan-400 transition-colors duration-300 line-clamp-1">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-1.5 mb-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[7px] sm:text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 bg-white/[0.04] border border-white/10 text-gray-300 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Call-to-action specs footer */}
      <div className="px-3 sm:px-5 pb-4 mt-auto relative z-20">
        <div className="w-full flex items-center justify-between py-2 px-3 border border-white/5 bg-white/[0.02] group-hover:border-cyan-500/20 group-hover:bg-cyan-500/[0.02] rounded-xl transition-all duration-300 text-gray-500 group-hover:text-cyan-400 font-mono text-[8px] sm:text-[9px] uppercase tracking-widest">
          <span className="font-bold">SPECIFICATIONS</span>
          <span className="flex items-center gap-1">
            VIEW DETAILS
            <FiArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#020202] text-white flex items-center justify-center font-mono">
        <ParticleBackground />
        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <span className="text-[9px] text-cyan-400 uppercase tracking-[0.3em]">
            SYNCING ARCHIVES...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#020202] text-white overflow-hidden font-sans pt-20 sm:pt-24 pb-0">
      
      {/* --- 3D PARTICLE SWARM BACKGROUND --- */}
      <ParticleBackground />

      {/* --- CLOSE MECHANISM --- */}
      {onClose && (
        <>
          {/* DESKTOP: Sci-fi exit capsule at top-right */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
            className="fixed top-6 right-6 z-[200] hidden sm:block"
          >
            <button 
              onClick={onClose}
              className="group relative flex items-center gap-3 px-5 py-3 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 hover:border-red-500/40 rounded-xl transition-all duration-500 cursor-pointer overflow-hidden shadow-2xl hover:shadow-red-500/10"
            >
              {/* Corner targeting brackets */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyan-500/50 group-hover:border-red-500/70 transition-colors duration-500 rounded-tl" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cyan-500/50 group-hover:border-red-500/70 transition-colors duration-500 rounded-tr" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cyan-500/50 group-hover:border-red-500/70 transition-colors duration-500 rounded-bl" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyan-500/50 group-hover:border-red-500/70 transition-colors duration-500 rounded-br" />

              {/* Scan line sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

              {/* X icon */}
              <div className="relative w-5 h-5 flex items-center justify-center">
                <FiX className="w-4 h-4 text-gray-400 group-hover:text-red-400 group-hover:rotate-90 transition-all duration-500" />
                <div className="absolute inset-0 rounded-full border border-cyan-500/20 group-hover:border-red-500/30 group-hover:scale-150 group-hover:opacity-0 transition-all duration-700" />
              </div>

              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-gray-500 group-hover:text-red-400 transition-colors duration-300 select-none">
                EXIT_CATALOG
              </span>

              <span className="flex items-center gap-1 text-[7px] font-mono text-gray-600 group-hover:text-red-400/60 bg-white/[0.03] border border-white/[0.06] group-hover:border-red-500/20 px-1.5 py-0.5 rounded transition-all duration-300 select-none">
                ESC
              </span>
            </button>
          </motion.div>

          {/* MOBILE: Top pull-down bar indicator */}
          <div className="fixed top-0 left-0 right-0 z-[200] flex justify-center sm:hidden">
            <button
              onClick={onClose}
              className="mt-2 flex flex-col items-center gap-1 px-6 py-2 touch-manipulation active:scale-95 transition-transform"
            >
              {/* Pull pill indicator */}
              <div className="w-10 h-1 rounded-full bg-white/20 active:bg-red-400/60 transition-colors" />
              <span className="text-[7px] font-mono uppercase tracking-[0.2em] text-white/30">
                tap to close
              </span>
            </button>
          </div>

          {/* MOBILE: Bottom floating close bar — thumb friendly */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.5 }}
            className="fixed bottom-0 left-0 right-0 z-[200] sm:hidden pb-[env(safe-area-inset-bottom)]"
          >
            <div className="mx-3 mb-3">
              <button
                onClick={onClose}
                className="group w-full flex items-center justify-center gap-2.5 py-3 bg-[#0a0a0a]/85 backdrop-blur-2xl border border-white/10 active:border-red-500/50 rounded-2xl transition-all duration-300 shadow-2xl shadow-black/50 touch-manipulation active:scale-[0.98]"
              >
                {/* X icon */}
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <FiX className="w-4 h-4 text-gray-400 group-active:text-red-400 transition-colors" />
                </div>

                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 group-active:text-red-400 transition-colors select-none">
                  EXIT CATALOG
                </span>

                {/* Status dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-active:bg-red-400 animate-pulse transition-colors" />
              </button>
            </div>
          </motion.div>
        </>
      )}

      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 mb-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400 uppercase tracking-[0.4em] block mb-2">Project Repository</span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter">
              All <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">Works</span>
              <span className="text-purple-500">.</span>
            </h1>
            <div className="h-[2px] w-32 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full mt-4"></div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-gray-400 font-mono text-[10px] sm:text-xs uppercase tracking-widest max-w-sm mb-2">
              A complete archive of engineering architectures, applications, and interactive web environments.
            </p>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-3 py-1 rounded-full backdrop-blur-md">
              Showing {filteredProjects.length} of {projects.length} architectures
            </span>
          </div>
        </motion.div>
      </div>

      {/* --- SEARCH & CATEGORY FILTER PANEL --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 mb-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white/[0.01] border border-white/[0.05] p-3 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-md">
          {/* Categories Tab Group */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-3.5 py-2 text-[8px] sm:text-[10px] font-mono uppercase tracking-wider rounded-lg transition-colors duration-300 select-none ${
                    isActive ? "text-white font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryHighlight"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg -z-10 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {category}
                </button>
              );
            })}
          </div>

          {/* Glowing Search Bar */}
          <div className="relative w-full lg:w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Filter by title, tag, stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2 bg-white/[0.02] border border-white/10 focus:border-cyan-500/50 rounded-lg text-[10px] sm:text-xs text-white placeholder-gray-500 focus:outline-none transition-all duration-300 font-mono"
              style={{ boxShadow: searchQuery ? "0 0 20px rgba(6,182,212,0.08)" : "none" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- ALL PROJECTS GRID WITH MOTION TRANSITIONS --- */}
      <LayoutGroup>
        <motion.div 
          layout
          className="max-w-7xl mx-auto px-2 sm:px-6 md:px-12 lg:px-24 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 relative z-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* Empty State */}
      <AnimatePresence>
        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="max-w-md mx-auto text-center py-24 relative z-10 font-mono"
          >
            <p className="text-gray-500 text-xs sm:text-sm">No architectures matched your search parameters.</p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-5 px-4 py-2 border border-white/10 hover:border-cyan-500/40 text-cyan-400 hover:text-white text-[10px] uppercase tracking-wider rounded-lg transition-all"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-20 sm:h-28"></div>

      {/* --- POPUP MODAL 1: DETAILED PROJECT INFORMATION PROFILE VIEW --- */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            key="allprojects-details-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md" 
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              style={{ boxShadow: '0 0 60px rgba(6,182,212,0.1)' }}
            >
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">Project Blueprint</span>
                    <h3 className="text-white font-bold text-xs sm:text-sm">{selectedProject.title}</h3>
                  </div>
                </div>
                <button onClick={() => setSelectedProject(null)} className="p-2 text-gray-400 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-500/30 rounded-lg transition-all cursor-pointer">
                  <FiX size={18} />
                </button>
              </div>

              <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 scrollbar-none">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#030303]">
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-contain bg-[#030303]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                  <h3 className="absolute bottom-6 left-6 text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">{selectedProject.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono uppercase py-1.5 px-3 bg-white/[0.05] border border-white/10 text-gray-300 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <FiActivity size={12} /> System Architecture Description
                  </h4>
                  <p className="text-gray-400 text-sm sm:text-base font-light leading-relaxed bg-white/[0.02] border border-white/[0.05] p-5 rounded-xl">
                    {selectedProject.desc}
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-white/[0.06] bg-[#0c0c0c] flex flex-col sm:flex-row gap-3">
                <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center space-x-3 py-3.5 bg-white/[0.03] hover:bg-white/[0.06] text-white text-xs uppercase font-mono tracking-wider rounded-xl border border-white/10 transition-all cursor-pointer">
                  <FiGithub size={16} />
                  <span>Repository Source</span>
                </a>
                <button onClick={() => { setLiveDemoUrl(selectedProject.link); setSelectedProject(null); }} className="flex-1 inline-flex items-center justify-center space-x-3 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs uppercase font-bold tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-600/20 group/modalbtn relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/modalbtn:translate-x-full transition-transform duration-700"></div>
                  <FiExternalLink size={16} className="relative z-10" />
                  <span className="relative z-10">Launch Live Site</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- POPUP MODAL 2: FLOATING SAME-SCREEN LIVE DEMO IFRAME VIEW --- */}
      <AnimatePresence>
        {liveDemoUrl && (
          <motion.div 
            key="allprojects-live-demo-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-6xl h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
              style={{ boxShadow: '0 0 80px rgba(6,182,212,0.15)' }}
            >
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] animate-pulse"></div>
                  <div className="flex flex-col min-w-0 flex-1 pr-4">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">Live Cloud Deployment Environment</span>
                    <h3 className="text-white font-bold text-xs sm:text-sm truncate font-mono mt-0.5">{liveDemoUrl}</h3>
                  </div>
                </div>
                <button onClick={() => setLiveDemoUrl(null)} className="p-2 text-gray-400 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-500/30 rounded-lg transition-all cursor-pointer shrink-0">
                  <FiX size={18} />
                </button>
              </div>
              <div className="flex-1 w-full h-full bg-[#181818] relative">
                <iframe src={liveDemoUrl} title="Live Demo" className="w-full h-full border-none bg-white" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" loading="lazy" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FOOTER SECTION --- */}
      <div className="relative z-10">
        <Footer onClose={onClose} />
      </div>
    </div>
  );
}
