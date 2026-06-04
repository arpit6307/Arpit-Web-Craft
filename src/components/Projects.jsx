import React, { useState } from "react";
import { FiGithub, FiExternalLink, FiX, FiLayers, FiActivity, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";

export default function Projects({ openAllProjects }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [liveDemoUrl, setLiveDemoUrl] = useState(null);
  const { projects, loading } = useProjects();

  if (loading) {
    return (
      <section id="portfolio" className="relative bg-[#020202] py-20 sm:py-32 overflow-hidden w-full flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <span className="text-[9px] text-cyan-400 uppercase tracking-[0.3em] font-mono">
            SYNCING ARCHITECTURES...
          </span>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section id="portfolio" className="relative bg-[#020202] py-20 sm:py-32 overflow-hidden w-full">
        {/* --- BACKGROUND EFFECTS --- */}
        <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-cyan-600/10 blur-[150px] pointer-events-none rounded-full z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 text-center mb-10 relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-cyan-500"></div>
            <p className="text-cyan-400 font-mono tracking-[0.4em] uppercase text-[10px]">Project Showcase</p>
            <div className="h-[1px] w-8 bg-gradient-to-r from-cyan-500 to-transparent"></div>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">
            Selected <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Works</span>
            <span className="text-purple-500">.</span>
          </h2>
          <div className="h-[2px] w-[80px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full mb-12"></div>
          <div className="p-8 border border-white/5 bg-white/[0.01] rounded-2xl max-w-md w-full backdrop-blur-md">
            <FiLayers className="w-10 h-10 text-cyan-500/40 mx-auto mb-3 animate-pulse" />
            <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">NO PROJECTS DEPLOYED YET</p>
            <p className="text-[10px] text-gray-600 mt-2">Check back soon or login to administration to add systems.</p>
          </div>
        </div>
      </section>
    );
  }

  // Home page only shows 4 projects
  const featuredProjects = projects.slice(0, 4);
  // Duplicate for the mobile infinite marquee
  const marqueeProjects = [...featuredProjects, ...featuredProjects];

  const ProjectCard = ({ project, index }) => (
    <div
      key={`${project.title}-${index}`}
      className="group relative rounded-2xl bg-white/[0.01] border border-white/[0.05] hover:border-cyan-500/30 transition-all duration-500 flex flex-col justify-between cursor-pointer overflow-hidden backdrop-blur-sm h-full w-full"
      onClick={() => setSelectedProject(project)}
      style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}
    >
      {/* Card Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 via-cyan-500/0 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

      <div>
        {/* Aspect ratio set to aspect-video (16:9) to display screenshots perfectly */}
        <div className="relative overflow-hidden aspect-video rounded-t-2xl bg-[#080808]">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-contain bg-[#030303] transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Neon scanline accent sweep */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-y-[100%] transition-all duration-[1500ms] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/30 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500"></div>
          
          <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0 hidden sm:block">
            <span className="flex items-center gap-2 text-[9px] font-mono text-cyan-400 bg-black/75 border border-cyan-500/30 px-3 py-1.5 rounded-full backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
              DECRYPTING BLUEPRINT
            </span>
          </div>
        </div>

        {/* Info panel */}
        <div className="p-4 sm:p-5 relative z-10 sm:-mt-6">
          <h3 className="text-sm sm:text-lg font-black text-white mb-2 sm:mb-3 tracking-tight group-hover:text-cyan-400 transition-colors duration-300 line-clamp-1">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[7px] sm:text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 bg-white/[0.03] border border-white/10 text-gray-300 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Call-to-action specs footer */}
      <div className="px-4 sm:px-5 pb-4 mt-auto relative z-20">
        <div className="w-full flex items-center justify-between py-2.5 px-3 border border-white/5 bg-white/[0.02] group-hover:border-cyan-500/20 group-hover:bg-cyan-500/[0.02] rounded-xl transition-all duration-300 text-gray-500 group-hover:text-cyan-400 font-mono text-[8px] sm:text-[9px] uppercase tracking-widest">
          <span className="font-bold">SPECIFICATIONS</span>
          <span className="flex items-center gap-1">
            VIEW DETAILS
            <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section id="portfolio" className="relative bg-[#020202] py-20 sm:py-32 overflow-hidden w-full">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-cyan-600/10 blur-[150px] pointer-events-none rounded-full z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] pointer-events-none rounded-full z-0" />

      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 text-center mb-10 sm:mb-20 relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-cyan-500"></div>
          <p className="text-cyan-400 font-mono tracking-[0.4em] uppercase text-[10px]">Project Showcase</p>
          <div className="h-[1px] w-8 bg-gradient-to-r from-cyan-500 to-transparent"></div>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter"
        >
          Selected <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Works</span>
          <span className="text-purple-500">.</span>
        </motion.h2>
        
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "80px" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"
        ></motion.div>
      </div>

      {/* --- DESKTOP GRID (Hidden on Mobile) --- */}
      <div className="hidden sm:grid max-w-7xl mx-auto px-6 md:px-12 lg:px-24 grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {featuredProjects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
          >
            <ProjectCard project={project} index={index} />
          </motion.div>
        ))}
      </div>

      {/* --- MOBILE INFINITE AUTO-MOVING CAROUSEL (Hidden on Desktop) --- */}
      <div className="sm:hidden relative z-10 w-full overflow-hidden py-4">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="flex w-max"
        >
          {marqueeProjects.map((project, index) => (
            <div key={`${project.title}-${index}-mob`} className="w-[70vw] px-2 flex-shrink-0 h-full">
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* --- SHOW MORE BUTTON -> OPENS OVERLAY MODAL --- */}
      <div className="max-w-7xl mx-auto text-center mt-12 sm:mt-24 relative z-10">
        <button 
          onClick={openAllProjects}
          className="relative inline-flex items-center space-x-4 px-8 sm:px-10 py-4 bg-transparent border border-cyan-500/30 text-white hover:text-cyan-300 hover:border-cyan-500/60 transition-all duration-300 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] rounded-xl cursor-pointer overflow-hidden group"
        >
          <div className="absolute inset-0 bg-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <FiLayers className="text-cyan-500 group-hover:rotate-180 transition-transform duration-700" size={16} />
          <span className="relative z-10 font-bold">Explore All Works</span>
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse relative z-10 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
        </button>
      </div>

      {/* --- POPUP MODAL 1: DETAILED PROJECT INFORMATION PROFILE VIEW --- */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md" onClick={() => setSelectedProject(null)}>
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              style={{ boxShadow: '0 0 60px rgba(6,182,212,0.1)' }}
            >
              {/* Close Bar */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">Project Blueprint</span>
                    <h3 className="text-white font-bold text-xs sm:text-sm">{selectedProject.title}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 border border-transparent rounded-lg transition-all duration-300 cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Modal Core Contents */}
              <div className="overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-none flex-1">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#030303]">
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-contain bg-[#030303]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                  <h3 className="absolute bottom-6 left-6 text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">{selectedProject.title}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono uppercase py-1.5 px-3 bg-white/[0.05] border border-white/10 text-gray-300 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
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

              {/* Modal Control Action Triggers */}
              <div className="p-4 sm:p-6 border-t border-white/[0.06] bg-[#0c0c0c] flex flex-col sm:flex-row gap-3">
                <a 
                  href={selectedProject.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center space-x-3 py-3.5 bg-white/[0.03] hover:bg-white/[0.06] text-white text-xs uppercase font-mono tracking-wider rounded-xl border border-white/10 transition-all cursor-pointer"
                >
                  <FiGithub size={16} />
                  <span>Repository Source</span>
                </a>
                <button 
                  onClick={() => {
                    setLiveDemoUrl(selectedProject.link);
                    setSelectedProject(null);
                  }}
                  className="flex-1 inline-flex items-center justify-center space-x-3 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs uppercase font-bold tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-600/20 group/modalbtn relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/modalbtn:translate-x-full transition-transform duration-700"></div>
                  <FiExternalLink size={16} className="relative z-10" />
                  <span className="relative z-10">Launch Live Site</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- POPUP MODAL 2: FLOATING SAME-SCREEN LIVE DEMO IFRAME VIEW --- */}
      <AnimatePresence>
        {liveDemoUrl && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-6xl h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
              style={{ boxShadow: '0 0 80px rgba(6,182,212,0.15)' }}
            >
              {/* Deployed Web Sandbox Header Controls panel */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] animate-pulse"></div>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 pr-4">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">Live Cloud Deployment Environment</span>
                    <h3 className="text-white font-bold text-xs sm:text-sm truncate font-mono mt-0.5">{liveDemoUrl}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setLiveDemoUrl(null)}
                  className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-red-500/20 hover:border-red-500/30 border border-transparent rounded-lg transition-all duration-300 cursor-pointer shrink-0"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Embedded Sandbox Deployed Site Frame */}
              <div className="flex-1 w-full h-full bg-[#181818] relative">
                <iframe 
                  src={liveDemoUrl} 
                  title="Live App Deployment Frame Preview"
                  className="w-full h-full border-none bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
