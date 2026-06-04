import React, { useState } from "react";
import { FiMail, FiTrash2, FiEye, FiEyeOff, FiUser, FiClock, FiMessageSquare, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { deleteContact, markContactRead } from "../config/firebase";

export default function AdminContacts({ contacts, onRefresh }) {
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState("all"); // all | unread | read

  const filteredContacts = contacts.filter((c) => {
    if (filter === "unread") return !c.read;
    if (filter === "read") return c.read;
    return true;
  });

  const unreadCount = contacts.filter((c) => !c.read).length;

  const handleToggleRead = async (contact) => {
    await markContactRead(contact.id, !contact.read);
    onRefresh();
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteContact(id);
      onRefresh();
    } catch {
      alert("DELETE_FAILED");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
            INCOMING<span className="text-cyan-400">.</span>TRANSMISSIONS
          </h2>
          <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mt-1">
            {contacts.length} TOTAL — {unreadCount} UNREAD
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-lg p-0.5">
          {["all", "unread", "read"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[8px] font-mono uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                filter === f
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-gray-500 hover:text-gray-300 border border-transparent"
              }`}
            >
              {f} {f === "unread" && unreadCount > 0 ? `(${unreadCount})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Contact list */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-16">
          <FiMessageSquare className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-xs text-gray-600 uppercase tracking-wider">
            NO {filter === "all" ? "" : filter.toUpperCase()} TRANSMISSIONS FOUND
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredContacts.map((contact) => {
            const isExpanded = expandedId === contact.id;
            return (
              <div
                key={contact.id}
                className={`relative bg-[#0a0a0a]/80 border rounded-xl overflow-hidden transition-all duration-300 ${
                  contact.read
                    ? "border-white/5"
                    : "border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                }`}
              >
                {/* Unread indicator bar */}
                {!contact.read && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l" />
                )}

                {/* Header row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : contact.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer"
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    contact.read ? "bg-white/[0.03] border border-white/10" : "bg-cyan-500/10 border border-cyan-500/20"
                  }`}>
                    <FiUser className={`w-4 h-4 ${contact.read ? "text-gray-600" : "text-cyan-400"}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold truncate ${contact.read ? "text-gray-400" : "text-white"}`}>
                        {contact.name || "Anonymous"}
                      </span>
                      {!contact.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 animate-pulse" />
                      )}
                    </div>
                    <div className="text-[9px] text-gray-500 truncate">{contact.email}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[8px] text-gray-600 font-mono hidden sm:block">
                      {formatDate(contact.timestamp)}
                    </span>
                    {isExpanded ? (
                      <FiChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <FiChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </button>

                {/* Expanded message body */}
                <div
                  style={{
                    maxHeight: isExpanded ? "300px" : "0",
                    opacity: isExpanded ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.3s ease, opacity 0.3s ease",
                  }}
                >
                  <div className="px-4 pb-4 border-t border-white/5 pt-3">
                    {/* Timestamp on mobile */}
                    <div className="text-[8px] text-gray-600 font-mono mb-2 sm:hidden flex items-center gap-1">
                      <FiClock className="w-3 h-3" />
                      {formatDate(contact.timestamp)}
                    </div>

                    {/* Message */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 mb-3">
                      <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                        {contact.message || "No message content."}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleRead(contact)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[8px] font-mono uppercase tracking-wider bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 rounded-lg text-gray-400 hover:text-cyan-400 transition-all cursor-pointer"
                      >
                        {contact.read ? <FiEyeOff className="w-3 h-3" /> : <FiEye className="w-3 h-3" />}
                        {contact.read ? "MARK_UNREAD" : "MARK_READ"}
                      </button>

                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[8px] font-mono uppercase tracking-wider bg-white/[0.03] border border-white/10 hover:border-blue-500/30 rounded-lg text-gray-400 hover:text-blue-400 transition-all"
                      >
                        <FiMail className="w-3 h-3" />
                        REPLY
                      </a>

                      <button
                        onClick={() => handleDelete(contact.id)}
                        disabled={deletingId === contact.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[8px] font-mono uppercase tracking-wider bg-red-500/5 border border-red-500/10 hover:border-red-500/30 rounded-lg text-gray-500 hover:text-red-400 transition-all ml-auto cursor-pointer disabled:opacity-50"
                      >
                        <FiTrash2 className="w-3 h-3" />
                        {deletingId === contact.id ? "DELETING..." : "DELETE"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
