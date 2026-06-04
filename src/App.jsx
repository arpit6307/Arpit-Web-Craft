import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, ProtectedRoute } from './hooks/useAuth.jsx';

gsap.registerPlugin(ScrollTrigger);

// Lazy load non-critical sections for performance
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const Projects = lazy(() => import('./components/Projects'));
const AllProjects = lazy(() => import('./pages/AllProjects'));
const FrameScrollAnimation = lazy(() => import('./components/FrameScrollAnimation'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

// Admin pages — eagerly loaded to prevent navigation delay and layout suspension
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

// Reusable Home Layout Component
const Home = ({ openAllProjects }) => {
  return (
    <>
      <Hero />
      <FrameScrollAnimation frameCount={240} />
      {/* Wrapper ensures these sections stack ABOVE Contact's pinned canvas */}
      <div className="relative z-[5]">
        <About />
        <Projects openAllProjects={openAllProjects} />
        <Services />
      </div>
      {/* Contact has its own stacking context at z-[1] so its pinned canvas stays below the sections above */}
      <div className="relative z-[1]">
        <Contact />
      </div>
      <div className="relative z-[5]">
        <Footer />
      </div>
    </>
  );
};

function AppContent() {
  const location = useLocation();
  const [isAllProjectsOpen, setIsAllProjectsOpen] = useState(false);

  useEffect(() => {
    // Kill all active GSAP ScrollTriggers to release pinned scroll states
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Reset body style properties that might be locked by GSAP pinning
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.documentElement.style.overflow = '';

    if (location.pathname === '/') {
      if (location.hash) {
        const scrollTarget = location.hash;
        setTimeout(() => {
          const element = document.querySelector(scrollTarget);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  // Check if we're on an admin route — hide Navbar and ScrollToTop
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <ScrollToTop />}
      
      <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div></div>}>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <FrameScrollAnimation frameCount={240} />
              {/* Wrapper ensures these sections stack ABOVE Contact's pinned canvas */}
              <div className="relative z-[5]">
                <About />
                <Projects openAllProjects={() => setIsAllProjectsOpen(true)} />
                <Services />
              </div>
              {/* Contact has its own stacking context at z-[1] so its pinned canvas stays below the sections above */}
              <div className="relative z-[1]">
                <Contact />
              </div>
              <div className="relative z-[5]">
                <Footer />
              </div>
            </>
          } />
          <Route path="/projects" element={<AllProjects />} />

          {/* Admin Standalone Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>

      {/* Fullscreen Projects Overlay Modal */}
      <AnimatePresence>
        {isAllProjectsOpen && (
          <motion.div 
            key="all-projects-overlay-modal"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[1000] overflow-y-auto bg-[#020202] w-screen h-screen scrollbar-none"
          >
            <AllProjects onClose={() => setIsAllProjectsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
