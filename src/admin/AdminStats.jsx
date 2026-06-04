import React from "react";
import { FiFolder, FiMessageSquare, FiEye, FiClock } from "react-icons/fi";

export default function AdminStats({ projectCount, contactCount, unreadCount }) {
  const stats = [
    {
      label: "TOTAL_PROJECTS",
      value: projectCount,
      icon: FiFolder,
      color: "cyan",
      gradient: "from-cyan-500/20 to-blue-500/20",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
    },
    {
      label: "TOTAL_MESSAGES",
      value: contactCount,
      icon: FiMessageSquare,
      color: "blue",
      gradient: "from-blue-500/20 to-indigo-500/20",
      border: "border-blue-500/20",
      text: "text-blue-400",
    },
    {
      label: "UNREAD_MSGS",
      value: unreadCount,
      icon: FiEye,
      color: "amber",
      gradient: "from-amber-500/20 to-orange-500/20",
      border: "border-amber-500/20",
      text: unreadCount > 0 ? "text-amber-400" : "text-gray-500",
    },
    {
      label: "SYS_STATUS",
      value: "ONLINE",
      icon: FiClock,
      color: "green",
      gradient: "from-green-500/20 to-emerald-500/20",
      border: "border-green-500/20",
      text: "text-green-400",
      isStatus: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`relative bg-[#0a0a0a]/80 backdrop-blur-xl border ${stat.border} rounded-xl p-4 sm:p-5 overflow-hidden`}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-30`} />

          {/* Corner bracket */}
          <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${stat.border} rounded-tl`} />
          <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${stat.border} rounded-br`} />

          <div className="relative z-10">
            <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.text} mb-2 sm:mb-3`} />
            <div className={`text-xl sm:text-2xl font-black ${stat.text} tracking-wide`}>
              {stat.isStatus ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm sm:text-base">{stat.value}</span>
                </span>
              ) : (
                stat.value
              )}
            </div>
            <div className="text-[7px] sm:text-[8px] text-gray-500 uppercase tracking-[0.2em] mt-1">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
