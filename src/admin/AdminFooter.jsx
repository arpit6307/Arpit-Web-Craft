import React, { useState, useEffect } from "react";
import { FiCpu, FiDatabase, FiCloud, FiServer, FiActivity } from "react-icons/fi";

export default function AdminFooter({ userEmail, projectCount, contactCount, unreadCount }) {
  const [time, setTime] = useState(new Date());
  const [uptime, setUptime] = useState(0);
  const [cpuLoad, setCpuLoad] = useState(12);
  const [ramLoad, setRamLoad] = useState(48);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update uptime counter
  useEffect(() => {
    const timer = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate slight fluctuation in CPU / RAM load to make it feel alive
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuLoad(Math.floor(8 + Math.random() * 15));
      setRamLoad(Math.floor(45 + Math.random() * 4));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Format uptime (e.g. 02h 45m 12s)
  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}H ${m}M ${s}S`;
  };

  return (
    <footer className="mt-16 border border-white/5 bg-[#070707]/90 rounded-2xl p-6 relative overflow-hidden font-mono text-[9px] uppercase tracking-wider text-gray-500">
      {/* Decorative scanline glow */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse" />
      
      {/* Corner crosshairs for cyberpunk aesthetic */}
      <div className="absolute top-2 left-2 text-white/10 select-none pointer-events-none text-xs">+</div>
      <div className="absolute top-2 right-2 text-white/10 select-none pointer-events-none text-xs">+</div>
      <div className="absolute bottom-2 left-2 text-white/10 select-none pointer-events-none text-xs">+</div>
      <div className="absolute bottom-2 right-2 text-white/10 select-none pointer-events-none text-xs">+</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        
        {/* Core telemetry details */}
        <div className="space-y-2 border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
            <FiServer className="w-3.5 h-3.5 animate-pulse" />
            <span>SYS_CORE_METRICS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">OPERATOR:</span>
            <span className="text-gray-300 font-bold truncate max-w-[120px]" title={userEmail}>
              {userEmail ? userEmail.split('@')[0] : "UNKNOWN"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">CLEARANCE:</span>
            <span className="text-cyan-400/80 font-bold">L5_SEC_ADMIN</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">HOST_NODE:</span>
            <span className="text-gray-400">LOCALHOST</span>
          </div>
        </div>

        {/* Database status and totals */}
        <div className="space-y-2 border-b md:border-b-0 lg:border-r border-white/5 pb-4 md:pb-0 lg:pr-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
            <FiDatabase className="w-3.5 h-3.5" />
            <span>DB_GATEWAY</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">FIRESTORE:</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              ONLINE
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">RECORDS:</span>
            <span className="text-gray-300 font-bold">{projectCount} PROJ / {contactCount} MSG</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">UNREADS:</span>
            <span className={unreadCount > 0 ? "text-amber-400 font-bold animate-pulse" : "text-gray-400"}>
              {unreadCount} PENDING
            </span>
          </div>
        </div>

        {/* System activity & fake loads to bring life to interface */}
        <div className="space-y-2 border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
            <FiCpu className="w-3.5 h-3.5" />
            <span>SYS_HARDWARE</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[8px]">
              <span className="text-gray-600">CPU LOAD:</span>
              <span className="text-gray-300 font-bold">{cpuLoad}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-500 transition-all duration-1000"
                style={{ width: `${cpuLoad}%` }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[8px]">
              <span className="text-gray-600">RAM USAGE:</span>
              <span className="text-gray-300 font-bold">{ramLoad}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-1000"
                style={{ width: `${ramLoad}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cloud services and uptime/clocks */}
        <div className="space-y-2 pb-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
            <FiCloud className="w-3.5 h-3.5" />
            <span>CLOUD_SERVICE</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">CLOUDINARY:</span>
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              READY
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">UPTIME:</span>
            <span className="text-gray-300 font-bold tabular-nums">{formatUptime(uptime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">LOCAL_TIME:</span>
            <span className="text-gray-300 font-bold tabular-nums">{time.toLocaleTimeString()}</span>
          </div>
        </div>

      </div>

      {/* Underline aesthetic elements */}
      <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[7px] text-gray-700">
        <div className="flex items-center gap-2">
          <span>SECURE PROTOCOL ACTIVE // ENCRYPTION AES-256</span>
          <span className="text-white/10">|</span>
          <span className="text-gray-600">MODULE: ADMIN_PANEL_V2</span>
        </div>
        <div>
          <span>© 2026 ARPIT WEBCRAFT // SYSTEM STABLE</span>
        </div>
      </div>
    </footer>
  );
}
