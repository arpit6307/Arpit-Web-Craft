import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import { FiLock, FiMail, FiEye, FiEyeOff, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      setSuccess(true);
      setTimeout(() => navigate("/admin/dashboard", { replace: true }), 800);
    } catch (err) {
      const msg =
        err.code === "auth/invalid-credential"
          ? "INVALID CREDENTIALS — ACCESS DENIED"
          : err.code === "auth/too-many-requests"
          ? "TOO MANY ATTEMPTS — SYSTEM LOCKED"
          : "AUTHENTICATION FAILURE";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center px-4 font-mono relative overflow-hidden">
      {/* Background grid lines */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="relative w-full max-w-md z-10">
        {/* Corner brackets */}
        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg" />
        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-lg" />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg" />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg" />

        <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/30 border border-cyan-800/30 rounded-full mb-4">
              <FiLock className="w-3 h-3 text-cyan-400" />
              <span className="text-[8px] text-cyan-400 uppercase tracking-[0.3em]">
                SECURE_TERMINAL
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-widest">
              ADMIN<span className="text-cyan-400">.</span>ACCESS
            </h1>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mt-2">
              AUTHORIZATION REQUIRED — LEVEL_5 CLEARANCE
            </p>
          </div>

          {/* Success animation */}
          {success && (
            <div className="flex flex-col items-center gap-3 py-8">
              <FiCheckCircle className="w-12 h-12 text-green-400 animate-pulse" />
              <span className="text-green-400 text-xs uppercase tracking-[0.3em]">
                ACCESS GRANTED
              </span>
              <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse" />
            </div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-[8px] text-gray-500 uppercase tracking-[0.25em] mb-1.5 block">
                  IDENTIFIER
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@email.com"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[8px] text-gray-500 uppercase tracking-[0.25em] mb-1.5 block">
                  ACCESS_KEY
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-cyan-500/50 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <FiAlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="text-[9px] text-red-400 uppercase tracking-wider">{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed overflow-hidden"
              >
                {/* Scan line on button */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border border-white/50 border-t-transparent rounded-full animate-spin" />
                      AUTHENTICATING...
                    </>
                  ) : (
                    <>
                      <FiLock className="w-3.5 h-3.5" />
                      INITIATE ACCESS
                    </>
                  )}
                </span>
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[7px] text-gray-600 uppercase tracking-wider">
              PROTOCOL: AES-256
            </span>
            <span className="text-[7px] text-gray-600 uppercase tracking-wider">
              NODE: SEC.AUTH.01
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
