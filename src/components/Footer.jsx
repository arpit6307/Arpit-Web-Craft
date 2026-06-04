import React, { useState, useEffect } from 'react';
import { 
  FiGithub, 
  FiLinkedin, 
  FiInstagram, 
  FiMessageCircle, 
  FiCpu, 
  FiTerminal, 
  FiActivity, 
  FiGlobe, 
  FiClock, 
  FiDatabase,
  FiHardDrive
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = ({ onClose }) => {
  const [systemTime, setSystemTime] = useState('');
  const [uptime, setUptime] = useState(0);
  const [ping, setPing] = useState(28);
  const [memUsage, setMemUsage] = useState(14.8);
  const [activeDiagnostic, setActiveDiagnostic] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Uptime and clock ticker
  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      // Indian Standard Time (IST) clock format
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-US', { 
        timeZone: 'Asia/Kolkata', 
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
      
      // Calculate uptime in seconds with single decimal precision
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      setUptime(elapsed);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Jittering telemetry metrics for realistic dashboard look
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(prev => {
        const diff = (Math.random() - 0.5) * 4;
        const next = Math.round(prev + diff);
        return Math.max(18, Math.min(42, next));
      });
      setMemUsage(prev => {
        const diff = (Math.random() - 0.5) * 0.4;
        const next = parseFloat((prev + diff).toFixed(1));
        return Math.max(13.2, Math.min(16.5, next));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const socialLinks = [
    { icon: <FiGithub />, label: 'GITHUB', url: 'https://github.com/arpit6307', color: 'hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]', port: 'PORT_01' },
    { icon: <FiLinkedin />, label: 'LINKEDIN', url: 'https://linkedin.com', color: 'hover:text-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]', port: 'PORT_02' },
    { icon: <FiMessageCircle />, label: 'WHATSAPP', url: 'https://wa.me/91XXXXXXXXXX', color: 'hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]', port: 'PORT_03' },
    { icon: <FiInstagram />, label: 'INSTAGRAM', url: 'https://instagram.com', color: 'hover:text-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.4)]', port: 'PORT_04' },
  ];

  const navLinks = [
    { name: 'About', href: '#about', file: 'src/components/About.jsx' },
    { name: 'Services', href: '#services', file: 'src/components/Services.jsx' },
    { name: 'Projects', href: '#portfolio', file: 'src/components/Projects.jsx' },
    { name: 'Contact', href: '#contact', file: 'src/components/Contact.jsx' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (onClose) {
      onClose(); // Close projects modal if open
    }
    if (location.pathname !== '/') {
      navigate('/' + href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="w-full bg-[#020202] text-white pt-16 sm:pt-24 pb-8 sm:pb-12 font-sans border-t border-white/10 relative overflow-hidden select-none">
      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Subtle Glow Accents */}
      <div className="absolute bottom-0 left-1/4 -translate-x-1/2 w-[350px] h-[350px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0"></div>
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[350px] h-[350px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-20">
          
          {/* Brand Col */}
          <div className="relative p-4 sm:p-6 bg-white/[0.01] border border-white/[0.05] rounded-xl overflow-hidden shadow-xl" style={{ boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02)' }}>
            {/* Design accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/50" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/50" />
            
            <h3 className="text-sm font-black uppercase tracking-[0.25em] flex items-center gap-2 text-cyan-400">
              <FiCpu className="animate-spin" style={{ animationDuration: '6s' }} /> ARPIT WEB CRAFT
            </h3>
            <div className="text-[7px] text-cyan-500/40 uppercase tracking-widest font-mono mt-1 select-none">
              DIGITAL ENGINE v2.0.4
            </div>
            <p className="text-gray-400 text-[10px] font-light leading-relaxed mt-4 max-w-[240px]">
              Engineering high-performance web applications, fluid WebGL graphics, and custom reactive micro-architectures with pixel precision.
            </p>
            <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[8px] text-gray-500">
              <span>CORE_INTEGRITY: 100%</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                LINKED
              </span>
            </div>
          </div>

          {/* Links Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span>[ NAV_PORTS ]</span>
            </h4>
            <div className="flex flex-col gap-3 text-xs text-gray-400">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.href)} 
                  onMouseEnter={() => setActiveDiagnostic(link)}
                  onMouseLeave={() => setActiveDiagnostic(null)}
                  className="hover:text-white transition-all flex items-center gap-2 group w-fit cursor-pointer"
                >
                  <span className="text-cyan-500/0 group-hover:text-cyan-500 transition-all font-bold group-hover:pl-1">
                    &gt;
                  </span>
                  <span className="tracking-[0.1em]">{link.name}</span>
                </a>
              ))}
              
              {/* Admin Panel Link */}
              <a 
                onClick={() => {
                  ScrollTrigger.getAll().forEach(t => t.revert());
                  document.body.style.overflow = '';
                  document.body.style.position = '';
                  document.body.style.top = '';
                  document.body.style.width = '';
                  document.documentElement.style.overflow = '';
                  navigate('/admin');
                }} 
                onMouseEnter={() => setActiveDiagnostic({ href: '/admin', file: 'src/admin/AdminDashboard.jsx' })}
                onMouseLeave={() => setActiveDiagnostic(null)}
                className="hover:text-cyan-400 transition-all flex items-center gap-2 group w-fit cursor-pointer text-gray-500"
              >
                <span className="text-cyan-500/0 group-hover:text-cyan-500 transition-all font-bold group-hover:pl-1">
                  &gt;
                </span>
                <span className="tracking-[0.1em] font-mono text-[11px] uppercase">SYS_ADMIN_PANEL</span>
              </a>
            </div>

            {/* Diagnostic Console Box */}
            <div className="mt-4 p-3 bg-black/60 border border-white/5 rounded-md min-h-[48px] flex flex-col justify-center">
              {activeDiagnostic ? (
                <>
                  <div className="text-[7px] text-cyan-500 font-mono tracking-widest uppercase">
                    &gt; SELECT PATH: {activeDiagnostic.href}
                  </div>
                  <div className="text-[8px] text-gray-500 font-mono truncate">
                    {activeDiagnostic.file}
                  </div>
                </>
              ) : (
                <div className="text-[8px] text-gray-600 font-mono tracking-widest animate-pulse">
                  &gt; WAITING FOR COM LINK SELECT...
                </div>
              )}
            </div>
          </div>

          {/* Telemetry Console Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em]">
              [ SYSTEM_DIAGNOSTICS ]
            </h4>
            <div className="text-[9px] sm:text-[10px] text-gray-400 space-y-3 font-mono bg-white/[0.01] border border-white/[0.03] p-3 sm:p-4 rounded-xl">
              <div className="flex items-center justify-between border-b border-white/[0.03] pb-1.5">
                <span className="flex items-center gap-2 text-gray-500">
                  <FiGlobe size={11} className="text-cyan-500/60" /> TIME (IST):
                </span> 
                <span className="text-white font-bold tracking-wider">{systemTime || '00:00:00'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/[0.03] pb-1.5">
                <span className="flex items-center gap-2 text-gray-500">
                  <FiClock size={11} className="text-cyan-500/60" /> UPTIME:
                </span> 
                <span className="text-white font-bold">{uptime}s</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/[0.03] pb-1.5">
                <span className="flex items-center gap-2 text-gray-500">
                  <FiDatabase size={11} className="text-cyan-500/60" /> LATENCY:
                </span> 
                <span className={`font-bold ${ping > 35 ? 'text-amber-400' : 'text-emerald-400'}`}>{ping} ms</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/[0.03] pb-1.5">
                <span className="flex items-center gap-2 text-gray-500">
                  <FiHardDrive size={11} className="text-cyan-500/60" /> RAM_LOAD:
                </span> 
                <span className="text-white font-bold">{memUsage} MB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-500">
                  <FiActivity size={11} className="text-cyan-500/60" /> STATUS:
                </span> 
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-widest text-[9px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  ONLINE
                </span>
              </div>
            </div>
          </div>

          {/* Social Ports Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em]">
              [ BROADCAST_PORTS ]
            </h4>
            <div className="grid grid-cols-2 gap-3.5">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`flex flex-col items-center justify-center p-3.5 bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 rounded-xl transition-all group cursor-pointer relative overflow-hidden`}
                >
                  {/* Subtle inner card light sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                  
                  <div className="text-lg text-gray-400 group-hover:text-cyan-400 transition-colors duration-300">
                    {social.icon}
                  </div>
                  
                  <span className="text-[7px] text-gray-500 group-hover:text-white transition-colors duration-300 font-mono tracking-widest uppercase mt-2">
                    {social.label}
                  </span>
                  
                  <div className="absolute top-1 right-1.5 text-[6px] text-gray-600 font-mono group-hover:text-cyan-500/60 transition-colors">
                    {social.port}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom Console logs */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-[8px] sm:text-[9px] text-gray-600 uppercase tracking-[0.15em] sm:tracking-[0.2em]">
          <div className="flex items-center gap-2 select-text">
            <span className="text-cyan-500/60 font-bold">&gt;&gt;&gt;</span>
            <p>DESIGNED & ENGINEERED BY <span className="text-white hover:text-cyan-400 transition-colors font-bold duration-300">ARPIT SINGH YADAV</span></p>
          </div>
          
          <div className="flex items-center gap-3 select-text bg-[#080808]/80 border border-white/[0.03] px-4 py-2 rounded-lg">
             <FiTerminal className="text-cyan-500 animate-pulse" />
             <span className="text-gray-500">© 2026 ARPIT WEB CRAFT.</span>
             <span className="text-cyan-500/60 font-bold">ALL_RIGHTS_SECURED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;