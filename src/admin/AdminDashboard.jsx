import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import { getProjects, getContacts } from "../config/firebase";
import {
  FiGrid, FiFolder, FiMessageSquare, FiLogOut, FiMenu, FiX, FiHome
} from "react-icons/fi";
import AdminStats from "./AdminStats";
import AdminProjects from "./AdminProjects";
import AdminContacts from "./AdminContacts";
import AdminFooter from "./AdminFooter";

const NAV_ITEMS = [
  { id: "overview", label: "OVERVIEW", icon: FiGrid },
  { id: "projects", label: "PROJECTS", icon: FiFolder },
  { id: "contacts", label: "MESSAGES", icon: FiMessageSquare },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (activeTab !== "overview") return;
    
    const initialLogs = [
      `[${new Date().toLocaleTimeString()}] [SYS_INIT] CONTROL CORE ONLINE`,
      `[${new Date().toLocaleTimeString()}] [DB_CONN] FIRESTORE SHIELD ACTIVE`,
      `[${new Date().toLocaleTimeString()}] [CDN_CONN] CLOUDINARY PORT: OPEN`,
    ];
    setLogs(initialLogs);

    const events = [
      "TELEMETRY: System heartbeat OK.",
      "DB_SYNC: Repository hashes matching.",
      "NET_SEC: SSL handshake verified.",
      "HOST_PING: latency response 24ms.",
      "SYS_MEM: RAM load stable.",
      "SYS_LOAD: CPU temperature 42C.",
      "SEC_MONITOR: No intrusion detected.",
      "CONFIG_SYNC: Environment files operational.",
    ];
    
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const randEvent = events[Math.floor(Math.random() * events.length)];
      setLogs(prev => [...prev.slice(-4), `[${time}] [SYS_DAEMON] ${randEvent}`]);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([getProjects(), getContacts()]);
      setProjects(p);
      setContacts(c);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/admin", { replace: true });
  };

  const unreadCount = contacts.filter((c) => !c.read).length;

  const switchTab = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#020202] font-mono flex">
      {/* ── SIDEBAR (desktop) ── */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0a0a0a]/80 border-r border-white/5 shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-black tracking-[0.2em] uppercase">
              ADMIN<span className="text-cyan-400">.</span>PANEL
            </span>
          </div>
          <p className="text-[7px] text-gray-600 uppercase tracking-wider mt-1">
            CONTROL DASHBOARD v2.0
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => switchTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === item.id
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.id === "contacts" && unreadCount > 0 && (
                <span className="ml-auto w-5 h-5 flex items-center justify-center bg-cyan-500/20 text-cyan-400 text-[8px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] uppercase tracking-wider text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] transition-all border border-transparent text-left cursor-pointer"
          >
            <FiHome className="w-4 h-4" />
            VIEW SITE
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] uppercase tracking-wider text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all border border-transparent cursor-pointer"
          >
            <FiLogOut className="w-4 h-4" />
            LOGOUT
          </button>
          <div className="px-3 pt-2 border-t border-white/5">
            <p className="text-[7px] text-gray-700 truncate">{user?.email}</p>
          </div>
        </div>
      </aside>

      {/* ── MOBILE HEADER ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[100] bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <span className="text-white text-xs font-black tracking-[0.2em] uppercase">
          ADMIN<span className="text-cyan-400">.</span>PANEL
        </span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-400 hover:text-white rounded-lg cursor-pointer"
        >
          {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      <div
        className="md:hidden fixed inset-0 z-[90]"
        style={{
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      >
        <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
        <div
          className="absolute top-14 left-0 bottom-0 w-64 bg-[#0a0a0a] border-r border-white/5 p-3 space-y-1"
          style={{
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => switchTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === item.id
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "text-gray-500 hover:text-gray-300 border border-transparent"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.id === "contacts" && unreadCount > 0 && (
                <span className="ml-auto w-5 h-5 flex items-center justify-center bg-cyan-500/20 text-cyan-400 text-[8px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}

          <div className="pt-4 space-y-1">
            <button 
              onClick={() => { setSidebarOpen(false); navigate('/'); }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[10px] uppercase tracking-wider text-gray-500 hover:text-gray-300 transition-all text-left cursor-pointer"
            >
              <FiHome className="w-4 h-4" /> VIEW SITE
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[10px] uppercase tracking-wider text-gray-500 hover:text-red-400 transition-all cursor-pointer">
              <FiLogOut className="w-4 h-4" /> LOGOUT
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 md:pt-6 max-w-6xl">
          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                <span className="text-[9px] text-cyan-400 uppercase tracking-[0.3em]">
                  LOADING DATA...
                </span>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
                      COMMAND<span className="text-cyan-400">.</span>CENTER
                    </h1>
                    <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mt-1">
                      SYSTEM OVERVIEW — ALL MODULES OPERATIONAL
                    </p>
                  </div>
                  <AdminStats
                    projectCount={projects.length}
                    contactCount={contacts.length}
                    unreadCount={unreadCount}
                  />

                  {/* Quick recent items */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    {/* Recent projects */}
                    <div className="bg-[#0a0a0a]/80 border border-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">
                          RECENT PROJECTS
                        </span>
                        <button onClick={() => setActiveTab("projects")} className="text-[8px] text-cyan-400 uppercase tracking-wider hover:underline cursor-pointer">
                          VIEW ALL →
                        </button>
                      </div>
                      {projects.slice(0, 3).map((p) => (
                        <div key={p.id || p.title} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                          <div className="w-8 h-8 rounded-lg bg-white/[0.03] overflow-hidden shrink-0">
                            {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <span className="text-xs text-gray-300 truncate">{p.title}</span>
                        </div>
                      ))}
                    </div>

                    {/* Recent messages */}
                    <div className="bg-[#0a0a0a]/80 border border-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">
                          RECENT MESSAGES
                        </span>
                        <button onClick={() => setActiveTab("contacts")} className="text-[8px] text-cyan-400 uppercase tracking-wider hover:underline cursor-pointer">
                          VIEW ALL →
                        </button>
                      </div>
                      {contacts.slice(0, 3).map((c) => (
                        <div key={c.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${c.read ? "bg-gray-700" : "bg-cyan-400 animate-pulse"}`} />
                          <div className="min-w-0">
                            <span className="text-xs text-gray-300 truncate block">{c.name}</span>
                            <span className="text-[8px] text-gray-600 truncate block">{c.email}</span>
                          </div>
                        </div>
                      ))}
                      {contacts.length === 0 && (
                        <p className="text-[9px] text-gray-600 text-center py-4">NO MESSAGES YET</p>
                      )}
                    </div>

                    {/* Live System Console Logs */}
                    <div className="bg-[#0a0a0a]/90 border border-cyan-500/15 hover:border-cyan-500/30 rounded-xl p-4 lg:col-span-2 font-mono relative overflow-hidden transition-all duration-300">
                      {/* Scanning glow sweep */}
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent pointer-events-none" />
                      <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                        <span className="text-[9px] text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          SYS_DAEMON_LOGS
                        </span>
                        <span className="text-[7px] text-gray-500">DAEMON_PID: 1044</span>
                      </div>
                      <div className="space-y-1.5 text-[8px] text-gray-400 select-text overflow-y-auto max-h-[110px] scrollbar-none">
                        {logs.map((log, i) => (
                          <div key={i} className="flex gap-2 last:text-cyan-400 transition-colors duration-300">
                            <span className="text-gray-600 font-bold">&gt;&gt;</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cyberpunk Admin Panel Session Footer */}
                  <AdminFooter
                    userEmail={user?.email}
                    projectCount={projects.length}
                    contactCount={contacts.length}
                    unreadCount={unreadCount}
                  />
                </div>
              )}

              {activeTab === "projects" && (
                <AdminProjects projects={projects} onRefresh={fetchData} />
              )}

              {activeTab === "contacts" && (
                <AdminContacts contacts={contacts} onRefresh={fetchData} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
