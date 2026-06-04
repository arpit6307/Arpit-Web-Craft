import React, { useState, useRef } from "react";
import {
  FiPlus, FiTrash2, FiEdit3, FiX, FiUploadCloud, FiImage,
  FiGithub, FiExternalLink, FiCheck, FiLoader
} from "react-icons/fi";
import { addProject, updateProject, deleteProject, uploadToCloudinary } from "../config/firebase";

const CATEGORIES = ["Full Stack", "Frontend", "Next.js & AI", "APIs & Web3"];

const emptyForm = {
  title: "",
  desc: "",
  tags: "",
  category: "Full Stack",
  link: "",
  github: "",
  image: "",
};

export default function AdminProjects({ projects, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImagePreview("");
    setShowForm(true);
  };

  const openEdit = (project) => {
    setForm({
      title: project.title || "",
      desc: project.desc || "",
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : project.tags || "",
      category: project.category || "Full Stack",
      link: project.link || "",
      github: project.github || "",
      image: project.image || "",
    });
    setEditingId(project.id);
    setImagePreview(project.image || "");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setImagePreview("");
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Only image files allowed");
    if (file.size > 10 * 1024 * 1024) return alert("File too large (max 10MB)");

    setUploading(true);
    setUploadProgress(0);

    // Simulate progress since fetch doesn't support progress events
    const progressInterval = setInterval(() => {
      setUploadProgress((p) => Math.min(p + 15, 90));
    }, 200);

    try {
      const url = await uploadToCloudinary(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setForm((f) => ({ ...f, image: url }));
      setImagePreview(url);
      setTimeout(() => setUploadProgress(0), 500);
    } catch (err) {
      clearInterval(progressInterval);
      alert("Upload failed: " + err.message);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.desc) return alert("Title and description required");

    setSaving(true);
    const data = {
      title: form.title.trim(),
      desc: form.desc.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      category: form.category,
      link: form.link.trim(),
      github: form.github.trim(),
      image: form.image,
    };

    try {
      if (editingId) {
        await updateProject(editingId, data);
      } else {
        await addProject(data);
      }
      closeForm();
      onRefresh();
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("DELETE this project permanently?")) return;
    setDeletingId(id);
    try {
      await deleteProject(id);
      onRefresh();
    } catch {
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
            PROJECT<span className="text-cyan-400">.</span>CATALOG
          </h2>
          <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mt-1">
            {projects.length} ENTRIES IN DATABASE
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 rounded-xl text-[9px] font-mono uppercase tracking-wider text-cyan-400 transition-all cursor-pointer"
        >
          <FiPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">ADD PROJECT</span>
          <span className="sm:hidden">ADD</span>
        </button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((project) => (
          <div
            key={project.id || project.title}
            className="group relative bg-[#0a0a0a]/80 border border-white/5 hover:border-cyan-500/20 rounded-xl overflow-hidden transition-all duration-300"
          >
            {/* Image */}
            <div className="h-36 bg-white/[0.02] overflow-hidden">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiImage className="w-8 h-8 text-gray-700" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3.5">
              <h3 className="text-sm font-bold text-white truncate mb-1">
                {project.title}
              </h3>
              <p className="text-[9px] text-gray-500 line-clamp-2 leading-relaxed mb-2">
                {project.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {(Array.isArray(project.tags) ? project.tags : []).slice(0, 3).map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 text-[7px] font-mono text-cyan-400/70 bg-cyan-500/10 border border-cyan-500/10 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(project)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[8px] font-mono uppercase bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 rounded-lg text-gray-400 hover:text-cyan-400 transition-all cursor-pointer"
                >
                  <FiEdit3 className="w-3 h-3" />
                  EDIT
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={deletingId === project.id}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[8px] font-mono uppercase bg-red-500/5 border border-red-500/10 hover:border-red-500/30 rounded-lg text-gray-500 hover:text-red-400 transition-all cursor-pointer disabled:opacity-50"
                >
                  <FiTrash2 className="w-3 h-3" />
                  {deletingId === project.id ? "..." : "DELETE"}
                </button>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer"
                    className="ml-auto text-gray-600 hover:text-blue-400 transition-colors">
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16">
          <FiFolder className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-xs text-gray-600 uppercase tracking-wider">NO PROJECTS IN DATABASE</p>
          <button onClick={openAdd} className="mt-4 text-cyan-400 text-[9px] uppercase tracking-wider hover:underline cursor-pointer">
            + ADD FIRST PROJECT
          </button>
        </div>
      )}

      {/* ── ADD/EDIT MODAL ── */}
      <div
        style={{
          opacity: showForm ? 1 : 0,
          pointerEvents: showForm ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        className="fixed inset-0 z-[500] flex items-start sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      >
        <div
          className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl my-8"
          style={{
            transform: showForm ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
            transition: "transform 0.3s ease",
          }}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/5">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {editingId ? "EDIT" : "ADD"}<span className="text-cyan-400">.</span>PROJECT
              </h3>
              <p className="text-[7px] text-gray-500 uppercase tracking-wider mt-0.5">
                {editingId ? "MODIFY EXISTING ENTRY" : "CREATE NEW DATABASE ENTRY"}
              </p>
            </div>
            <button
              onClick={closeForm}
              className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-all cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Image upload zone */}
            <div>
              <label className="text-[8px] text-gray-500 uppercase tracking-[0.25em] mb-1.5 block">
                PROJECT_IMAGE
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 ${
                  dragOver
                    ? "border-cyan-400/50 bg-cyan-500/5"
                    : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                }`}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview("");
                        setForm((f) => ({ ...f, image: "" }));
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-red-500/60 transition-colors cursor-pointer"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="py-6">
                    <FiUploadCloud className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">
                      {uploading ? "UPLOADING..." : "DROP IMAGE OR CLICK TO BROWSE"}
                    </p>
                  </div>
                )}

                {/* Upload progress */}
                {uploadProgress > 0 && (
                  <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-[8px] text-gray-500 uppercase tracking-[0.25em] mb-1.5 block">
                PROJECT_TITLE *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="e.g. Share-Sphere Chat App"
                className="w-full bg-white/[0.03] border border-white/10 focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] focus:bg-cyan-950/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[8px] text-gray-500 uppercase tracking-[0.25em] mb-1.5 block">
                DESCRIPTION *
              </label>
              <textarea
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                required
                rows={3}
                placeholder="Describe the project..."
                className="w-full bg-white/[0.03] border border-white/10 focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] focus:bg-cyan-950/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 resize-none"
              />
            </div>

            {/* Tags + Category row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[8px] text-gray-500 uppercase tracking-[0.25em] mb-1.5 block">
                  TECH_TAGS (comma separated)
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] focus:bg-cyan-950/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-[8px] text-gray-500 uppercase tracking-[0.25em] mb-1.5 block">
                  CATEGORY
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-white/10 focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] focus:bg-cyan-950/5 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all duration-300 cursor-pointer appearance-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Links row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[8px] text-gray-500 uppercase tracking-[0.25em] mb-1.5 block flex items-center gap-1">
                  <FiExternalLink className="w-3 h-3" /> LIVE_LINK
                </label>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] focus:bg-cyan-950/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-[8px] text-gray-500 uppercase tracking-[0.25em] mb-1.5 block flex items-center gap-1">
                  <FiGithub className="w-3 h-3" /> GITHUB_REPO
                </label>
                <input
                  type="url"
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] focus:bg-cyan-950/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {saving ? (
                  <><FiLoader className="w-3.5 h-3.5 animate-spin" /> SAVING...</>
                ) : (
                  <><FiCheck className="w-3.5 h-3.5" /> {editingId ? "UPDATE PROJECT" : "ADD PROJECT"}</>
                )}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-3 text-[10px] font-mono uppercase tracking-wider text-gray-400 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-xl transition-all cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Needed for the empty state icon
function FiFolder(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}
