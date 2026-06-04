import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiDownload, FiMail, FiMessageCircle, FiCpu, FiTerminal } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#portfolio' },
  { name: 'Services', href: '#services' },
  { name: 'Contact', href: '#contact' }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Check if scroll is beyond threshold for scrolled header styling
      setIsScrolled(window.scrollY > 50);

      // Force highlight 'Projects' if on projects page or modal is open
      if (location.pathname === '/projects' || document.getElementById('all-projects-page')) {
        setActiveLink('Projects');
        return;
      }

      // Check if user has scrolled to the very bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (isAtBottom) {
        setActiveLink('Contact');
        return;
      }

      // Viewport target line for active section detection (30% from top)
      const targetY = window.innerHeight * 0.3;
      let currentSection = '';

      const aboutEl = document.getElementById('about');
      const servicesEl = document.getElementById('services');
      const portfolioEl = document.getElementById('portfolio');
      const contactEl = document.getElementById('contact');

      const elements = [
        { name: 'About', el: aboutEl },
        { name: 'Services', el: servicesEl },
        { name: 'Projects', el: portfolioEl },
        { name: 'Contact', el: contactEl }
      ];

      for (const item of elements) {
        if (item.el) {
          const rect = item.el.getBoundingClientRect();
          if (rect.top <= targetY && rect.bottom >= targetY) {
            currentSection = item.name;
            break;
          }
        }
      }

      setActiveLink(currentSection);
    };

    handleScroll(); // Initial run
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    // Snappy active link highlight on click feedback
    const targetLink = navLinks.find(link => link.href === href);
    if (targetLink) {
      setActiveLink(targetLink.name);
    }
    
    if (location.pathname !== '/') {
      // Navigate back to home route first
      navigate('/');
      // Delay slightly to let the home page mount, then scroll to section
      setTimeout(() => {
        if (href === '#') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    } else {
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <div>
      <nav className={`fixed top-0 left-0 w-full z-[200] transition-all duration-500 border-b ${isScrolled ? 'py-3.5 bg-black/60 backdrop-blur-xl border-white/5 shadow-lg shadow-black/10' : 'py-6 bg-transparent border-transparent'}`}>
        {/* Subtle border bottom highlight on scroll */}
        {isScrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none" />
        )}
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center relative">
          
          {/* Logo Brand Console */}
          <div className="cursor-pointer flex items-center gap-2 select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-white text-sm sm:text-base font-black tracking-[0.25em] uppercase relative z-10 group">
              ARPITWEBCRAFT
              <span className="text-cyan-400 group-hover:text-blue-500 transition-colors">.</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-[7px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2 py-0.5 rounded uppercase tracking-wider leading-none">
              <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping"></span>
              SYS_ON
            </span>
          </div>
 
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-5 relative">
              {navLinks.map((link) => {
                const isActive = activeLink === link.name;
                return (
                  <li key={link.name} className="relative py-1 flex items-center">
                    <a 
                      href={link.href} 
                      onClick={(e) => handleNavClick(e, link.href)} 
                      className={`relative z-10 text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-300 px-4 py-2 rounded-lg select-none ${isActive ? 'text-white font-extrabold' : 'text-white/40 hover:text-white'}`}
                    >
                      <span>{link.name}</span>
                    </a>
                    
                    {/* Sliding active box accent */}
                    {isActive && (
                      <motion.div 
                        layoutId="navActiveIndicator"
                        className="absolute inset-0 bg-white/[0.04] border border-white/10 rounded-lg -z-0"
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                        style={{ boxShadow: '0 0 15px rgba(255,255,255,0.02), inset 0 0 5px rgba(255,255,255,0.02)' }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
            
            {/* Action Port Button */}
            <div className="flex items-center border-l border-white/10 pl-8 h-6 relative select-none gap-4">
              <button 
                onClick={() => {
                  ScrollTrigger.getAll().forEach(t => t.revert());
                  document.body.style.overflow = '';
                  document.body.style.position = '';
                  document.body.style.top = '';
                  document.body.style.width = '';
                  document.documentElement.style.overflow = '';
                  navigate('/admin');
                }} 
                className="relative px-4 py-2 overflow-hidden border border-white/15 text-white/60 hover:text-cyan-400 font-mono text-[9px] uppercase tracking-[0.25em] bg-white/[0.02] hover:bg-cyan-950/20 rounded-lg transition-all duration-300 group/admin cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <FiTerminal className="text-white/40 group-hover/admin:text-cyan-400 group-hover/admin:animate-pulse" />
                  ADMIN
                </span>
              </button>

              <button 
                onClick={() => setIsHireModalOpen(true)} 
                className="relative px-5 py-2 overflow-hidden border border-cyan-500/30 text-white hover:text-cyan-400 font-mono text-[9px] uppercase tracking-[0.25em] bg-cyan-950/20 hover:bg-cyan-950/40 rounded-lg transition-all duration-300 group/hire shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/15 cursor-pointer"
              >
                {/* Micro bracket accents */}
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-400/60" />
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-cyan-400/60" />
                
                <span className="relative z-10 flex items-center gap-1.5">
                  <FiCpu className="text-cyan-400 animate-pulse group-hover/hire:rotate-180 transition-transform duration-700" />
                  HIRE ME
                </span>
              </button>
            </div>
          </div>
 
          {/* Mobile menu trigger */}
          <button 
            className="md:hidden text-white/80 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md cursor-pointer transition-colors" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>
 
      {/* Redesigned Sci-Fi dossier modal */}
      <AnimatePresence>
        {isHireModalOpen && (
          <motion.div 
            key="hire-modal-overlay-backdrop"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-mono select-none" 
            onClick={() => setIsHireModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 15 }} 
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative bg-[#050505]/90 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 w-full max-w-sm rounded-2xl space-y-6 overflow-hidden shadow-2xl" 
              style={{ boxShadow: '0 0 50px rgba(6,182,212,0.12)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner Targeting brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/80 rounded-tl-md" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/80 rounded-tr-md" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/80 rounded-bl-md" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/80 rounded-br-md" />
 
              {/* Dossier Header */}
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <h2 className="text-white text-xs font-black uppercase tracking-[0.25em] flex items-center gap-2">
                  <FiCpu className="text-cyan-400 animate-pulse" /> DOSSIER_RECORD
                </h2>
                <span className="text-[7px] text-gray-500 uppercase tracking-widest font-mono">
                  REF: DEV_ARPIT_01
                </span>
              </div>
 
              {/* Avatar details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg border border-white/10 overflow-hidden bg-white/[0.02] flex items-center justify-center shrink-0">
                    <FiTerminal className="text-cyan-400 text-lg animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-black uppercase tracking-wider">Arpit Singh Yadav</h3>
                    <p className="text-[8px] text-cyan-400/60 uppercase tracking-widest mt-0.5">Full Stack Web Architect</p>
                  </div>
                </div>
 
                <p className="text-gray-400 text-[10px] leading-relaxed border border-white/[0.05] bg-white/[0.01] p-3 rounded-lg select-text font-sans">
                  Specialized in engineering robust digital systems, high-performance visual pipelines (Three.js/GSAP), and responsive layouts with modular coding standards.
                </p>
                
                {/* Telemetry data grid */}
                <div className="grid grid-cols-2 gap-2 text-[8px] text-gray-500 uppercase tracking-widest border-t border-b border-white/[0.05] py-2">
                  <div>AVAILABILITY: <span className="text-emerald-400 font-bold">100%</span></div>
                  <div>LOCATION: <span className="text-white">INDIA</span></div>
                </div>
                
                {/* Social port buttons */}
                <div className="flex flex-col gap-2 pt-1 font-mono text-[9px] select-text">
                  <a href="mailto:arpitsinghyadav@email.com" className="group flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 rounded-lg hover:text-cyan-400 transition-all text-gray-400">
                    <span className="flex items-center gap-2"><FiMail className="text-cyan-500/80 group-hover:scale-110 transition-transform" /> SYS.EMAIL</span>
                    <span className="text-[7px] text-gray-600 group-hover:text-cyan-400/60 transition-colors">arpitsinghyadav@email.com</span>
                  </a>
                  <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 rounded-lg hover:text-emerald-400 transition-all text-gray-400">
                    <span className="flex items-center gap-2"><FiMessageCircle className="text-emerald-500/80 group-hover:scale-110 transition-transform" /> SYS.WHATSAPP</span>
                    <span className="text-[7px] text-gray-600 group-hover:text-emerald-400/60 transition-colors">wa.me/91XXXXXXXXXX</span>
                  </a>
                </div>
              </div>
              
              <a href="/resume.pdf" download className="relative block w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-center text-[9px] font-bold uppercase tracking-[0.25em] rounded-lg mt-4 transition-all shadow-lg shadow-cyan-600/10 hover:shadow-cyan-600/25 overflow-hidden group/cvbtn">
                {/* Laser sweep line overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/cvbtn:translate-x-full transition-transform duration-700 pointer-events-none" />
                <span className="relative z-10 flex items-center justify-center gap-2"><FiDownload className="animate-pulse" /> Launch Dossier (CV)</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* Cinematic Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            key="mobile-menu-overlay-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[190] md:hidden flex flex-col items-center justify-between p-8 font-mono select-none"
          >
            {/* Subtle grid background */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            {/* Decorative corner brackets for mobile overlay */}
            <div className="absolute top-28 left-6 w-4 h-4 border-t border-l border-white/20" />
            <div className="absolute top-28 right-6 w-4 h-4 border-t border-r border-white/20" />
            <div className="absolute bottom-28 left-6 w-4 h-4 border-b border-l border-white/20" />
            <div className="absolute bottom-28 right-6 w-4 h-4 border-b border-r border-white/20" />
 
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 mt-20 relative z-10">
              <span className="text-[8px] text-cyan-400 tracking-[0.4em] uppercase">SYSTEM_INDEX</span>
              <span className="text-[8px] text-gray-500">PORT: MOBILE_SSL</span>
            </div>
 
            <ul className="flex flex-col space-y-8 text-center my-auto relative z-10">
              {navLinks.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, ease: 'easeOut' }}
                >
                  <a 
                    href={link.href} 
                    onClick={(e) => handleNavClick(e, link.href)} 
                    className="group flex flex-col items-center"
                  >
                    <span className={`text-xl font-black transition-all uppercase tracking-widest ${activeLink === link.name ? 'text-cyan-400 font-extrabold scale-110' : 'text-white/60 hover:text-white'}`}>
                      {link.name}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
 
            {/* Mobile footer system status */}
            <div className="w-full border-t border-white/10 pt-4 flex flex-col items-center gap-2 relative z-10">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setIsHireModalOpen(true); }} 
                className="w-full max-w-xs py-3 border border-white/20 text-white font-mono text-[9px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all rounded-lg"
              >
                Hire Me
              </button>
               <button 
                onClick={() => { 
                  setIsMobileMenuOpen(false); 
                  ScrollTrigger.getAll().forEach(t => t.revert());
                  document.body.style.overflow = '';
                  document.body.style.position = '';
                  document.body.style.top = '';
                  document.body.style.width = '';
                  document.documentElement.style.overflow = '';
                  navigate('/admin'); 
                }} 
                className="w-full max-w-xs py-3 border border-white/10 text-white/60 hover:text-white font-mono text-[9px] uppercase tracking-[0.3em] bg-white/[0.02] rounded-lg mt-1"
              >
                Admin Panel
              </button>
              <div className="text-[7px] text-gray-600 tracking-widest uppercase mt-2">
                © 2026 ARPITWEBCRAFT // OPERATOR_PORT
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}