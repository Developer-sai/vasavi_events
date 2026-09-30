"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Folder, Photo } from "@/types";
import { SHOWCASE_EVENT_ID } from "@/lib/constants";
import {
  createShowcaseFolderAction,
  updateShowcaseFolderAction,
  deleteShowcaseFolderAction,
  addShowcasePhotoAction,
  deleteShowcasePhotoAction,
  moveShowcasePhotoAction,
  refreshLiveWebsiteAction,
} from "@/actions/showcase";
import { uploadPhotoFile } from "@/lib/storage/uploader";
import { clearAdminSessionAction } from "@/actions/auth";
import { createClient as createBrowserSupabase } from "@/lib/supabase/client";
import {
  FolderPlus,
  UploadCloud,
  Trash2,
  Edit3,
  ExternalLink,
  LogOut,
  FolderTree,
  Sparkles,
  Check,
  X,
  FolderInput,
  Eye,
  RefreshCw,
  Folder as FolderIcon,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  FolderCheck,
} from "lucide-react";

interface ShowcaseStudioClientProps {
  initialFolders: Folder[];
  initialPhotos: Photo[];
}

export function ShowcaseStudioClient({
  initialFolders,
  initialPhotos,
}: ShowcaseStudioClientProps) {
  const router = useRouter();

  // Core Data State
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);

  // Active View Filter
  // Default to first folder if available, or "all"
  const [selectedFolderId, setSelectedFolderId] = useState<string>(
    initialFolders.length > 0 ? initialFolders[0].id : "all"
  );

  // Folder CRUD Modal State
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderNameInput, setFolderNameInput] = useState("");
  const [folderDescInput, setFolderDescInput] = useState("");
  const [isFolderSubmitting, setIsFolderSubmitting] = useState(false);

  // Move Photo Modal State
  const [movingPhoto, setMovingPhoto] = useState<Photo | null>(null);
  const [targetMoveFolderId, setTargetMoveFolderId] = useState<string>("");
  const [isMovingSubmitting, setIsMovingSubmitting] = useState(false);

  // Photo Preview Modal
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Top Bar "Update Live Website" State & Status Banner
  const [isRefreshingLive, setIsRefreshingLive] = useState(false);
  const [hasPendingUpdates, setHasPendingUpdates] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Logout state
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Computed Photos for Active View
  const displayedPhotos =
    selectedFolderId === "all"
      ? photos
      : photos.filter((p) => p.folder_id === selectedFolderId);

  const activeFolder =
    selectedFolderId === "all"
      ? null
      : folders.find((f) => f.id === selectedFolderId) || null;

  // Target folder for new uploads (defaults to currently selected folder, or first folder)
  const currentUploadFolderId =
    selectedFolderId !== "all"
      ? selectedFolderId
      : folders[0]?.id || "";

  // ----------------------------------------------------------------
  // 1. TOP BAR ACTIONS: Logout & Update Live Website
  // ----------------------------------------------------------------
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await clearAdminSessionAction();
      const supabase = createBrowserSupabase();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }

    if (typeof document !== "undefined") {
      document.cookie =
        "vasavi_admin_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("vasavi_admin_session");
    }

    router.push("/admin/login");
  };

  const handleUpdateLiveWebsite = async () => {
    setIsRefreshingLive(true);
    try {
      await refreshLiveWebsiteAction();
      setHasPendingUpdates(false);
      setStatusMessage("✅ Live website successfully updated with latest changes!");
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshingLive(false);
    }
  };

  // ----------------------------------------------------------------
  // 2. FOLDER CRUD ACTIONS
  // ----------------------------------------------------------------
  const handleOpenAddFolder = () => {
    setEditingFolder(null);
    setFolderNameInput("");
    setFolderDescInput("");
    setIsFolderModalOpen(true);
  };

  const handleOpenEditFolder = (f: Folder) => {
    setEditingFolder(f);
    setFolderNameInput(f.name);
    setFolderDescInput(f.description || "");
    setIsFolderModalOpen(true);
  };

  const handleSaveFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderNameInput.trim()) return;

    setIsFolderSubmitting(true);
    try {
      if (editingFolder) {
        // Edit / Rename Folder
        await updateShowcaseFolderAction(
          editingFolder.id,
          folderNameInput.trim(),
          folderDescInput.trim() || undefined
        );
        setFolders((prev) =>
          prev.map((f) =>
            f.id === editingFolder.id
              ? {
                  ...f,
                  name: folderNameInput.trim(),
                  description: folderDescInput.trim() || undefined,
                }
              : f
          )
        );
        setStatusMessage(`✅ Folder renamed to "${folderNameInput.trim()}"`);
      } else {
        // Add New Folder
        const created = await createShowcaseFolderAction(
          folderNameInput.trim(),
          folderDescInput.trim() || undefined
        );
        setFolders((prev) => [...prev, created]);
        setSelectedFolderId(created.id);
        setStatusMessage(`✅ New folder "${created.name}" created!`);
      }

      setHasPendingUpdates(true);
      setIsFolderModalOpen(false);
      setEditingFolder(null);
      setFolderNameInput("");
      setFolderDescInput("");
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      console.error(err);
      alert("Error saving folder. Please try again.");
    } finally {
      setIsFolderSubmitting(false);
    }
  };

  const handleDeleteFolder = async (folder: Folder) => {
    const photoCount = photos.filter((p) => p.folder_id === folder.id).length;
    const confirmText =
      photoCount > 0
        ? `Are you sure you want to delete "${folder.name}"? This folder contains ${photoCount} photos which will also be removed.`
        : `Delete folder "${folder.name}"?`;

    if (!confirm(confirmText)) return;

    try {
      await deleteShowcaseFolderAction(folder.id);
      setFolders((prev) => prev.filter((f) => f.id !== folder.id));
      setPhotos((prev) => prev.filter((p) => p.folder_id !== folder.id));

      if (selectedFolderId === folder.id) {
        setSelectedFolderId(folders.find((f) => f.id !== folder.id)?.id || "all");
      }

      setHasPendingUpdates(true);
      setStatusMessage(`🗑️ Folder "${folder.name}" deleted.`);
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      console.error(err);
      alert("Error deleting folder.");
    }
  };

  // ----------------------------------------------------------------
  // 3. IMAGE CRUD ACTIONS (Upload, Delete, Move)
  // ----------------------------------------------------------------
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!currentUploadFolderId) {
      alert("Please create or select a folder first before uploading images.");
      return;
    }

    const targetFolder = folders.find((f) => f.id === currentUploadFolderId);
    const targetFolderName = targetFolder ? targetFolder.name : "Showcase";

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    const newUploadedPhotos: Photo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const uploadRes = await uploadPhotoFile(
          file,
          SHOWCASE_EVENT_ID,
          currentUploadFolderId
        );

        const added = await addShowcasePhotoAction({
          event_id: SHOWCASE_EVENT_ID,
          folder_id: currentUploadFolderId,
          storage_path: uploadRes.storagePath,
          public_url: uploadRes.publicUrl,
          filename: uploadRes.filename,
          file_size: uploadRes.fileSize,
          sort_order: photos.length + i,
        });

        newUploadedPhotos.push(added);
      } catch (err) {
        console.error("Failed uploading photo:", file.name, err);
      }
      setUploadProgress({ current: i + 1, total: files.length });
    }

    if (newUploadedPhotos.length > 0) {
      setPhotos((prev) => [...prev, ...newUploadedPhotos]);
      setHasPendingUpdates(true);
      setStatusMessage(
        `🎉 Successfully uploaded ${newUploadedPhotos.length} photo(s) to "${targetFolderName}"! Click "Update Live Website" on top to sync.`
      );
      setTimeout(() => setStatusMessage(null), 7000);
    }

    setIsUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeletePhoto = async (photo: Photo) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      await deleteShowcasePhotoAction(photo.id);
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      setHasPendingUpdates(true);
      setStatusMessage("🗑️ Photo deleted.");
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error(err);
      alert("Error deleting photo.");
    }
  };

  const handleOpenMovePhoto = (photo: Photo) => {
    setMovingPhoto(photo);
    setTargetMoveFolderId(photo.folder_id || folders[0]?.id || "");
  };

  const handleConfirmMovePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movingPhoto || !targetMoveFolderId) return;

    setIsMovingSubmitting(true);
    try {
      await moveShowcasePhotoAction(movingPhoto.id, targetMoveFolderId);
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === movingPhoto.id ? { ...p, folder_id: targetMoveFolderId } : p
        )
      );

      const destFolder = folders.find((f) => f.id === targetMoveFolderId);
      setStatusMessage(`🔄 Photo moved to folder "${destFolder?.name || targetMoveFolderId}".`);
      setHasPendingUpdates(true);
      setMovingPhoto(null);
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error(err);
      alert("Error moving photo.");
    } finally {
      setIsMovingSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      {/* ========================================================= */}
      {/* 1. CRYSTAL-CLEAR TOP NAVIGATION BAR                       */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-[#12100E] border-b border-[#262320] text-[#FAF8F5] px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Brand Emblem & Studio Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#C59350] to-[#EBD8BD] flex items-center justify-center text-[#12100E] font-serif font-bold text-base shadow-xs">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif tracking-widest text-sm uppercase font-bold text-[#FAF8F5]">
                  Vasavi Events
                </h1>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-[#C59350]/20 text-[#C59350] border border-[#C59350]/40">
                  Admin Studio
                </span>
              </div>
              <p className="text-[11px] text-[#FAF8F5]/60 font-light">
                Folder &amp; Photo Management
              </p>
            </div>
          </div>

          {/* Action Buttons: Go to Client Page, Update Live Website, Logout */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Go to Clients Page */}
            <a
              href="https://vasavievents.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-[#FAF8F5] font-medium border border-white/10 transition cursor-pointer"
              title="Open public website in a new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C59350]" />
              <span>Go to Clients Page</span>
            </a>

            {/* Update Live Website Button (Prominent & highlighted when changes exist) */}
            <button
              onClick={handleUpdateLiveWebsite}
              disabled={isRefreshingLive}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shadow-md cursor-pointer ${
                hasPendingUpdates
                  ? "bg-gradient-to-r from-[#C59350] to-[#D1A870] text-[#12100E] ring-2 ring-[#C59350] animate-pulse"
                  : "bg-[#C59350] hover:brightness-110 text-[#12100E]"
              } disabled:opacity-50`}
              title="Publish all folder and photo updates immediately to the live client site"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshingLive ? "animate-spin" : ""}`}
              />
              <span>
                {isRefreshingLive
                  ? "Updating Site..."
                  : hasPendingUpdates
                  ? "⚡ Update Live Website"
                  : "Update Live Website"}
              </span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-medium border border-rose-500/20 transition cursor-pointer disabled:opacity-50"
              title="Sign out of Admin Studio"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "Signing Out..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. REAL-TIME NOTIFICATION BANNER                          */}
      {/* ========================================================= */}
      {statusMessage && (
        <div className="bg-[#1A1714] text-[#EED9B9] border-b border-[#C59350]/30 px-6 py-2.5 text-center text-xs flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <Sparkles className="w-4 h-4 text-[#C59350] shrink-0" />
          <span>{statusMessage}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="ml-3 p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MAIN DASHBOARD CONTENT (FOLDERS & PHOTOS CRUD)         */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-8">
        {/* ------------------------------------------------------- */}
        {/* SECTION A: FOLDER MANAGEMENT (CRUD)                    */}
        {/* ------------------------------------------------------- */}
        <section className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#C59350]" />
                <h2 className="font-serif text-xl font-medium text-[#1A1714]">
                  Decoration Folders (Categories)
                </h2>
              </div>
              <p className="text-xs text-[#7A6F64] mt-0.5">
                Create folders for each decor style (Haldi, Birthday, Mandap, Reception). Clients see these as category filter tabs.
              </p>
            </div>

            {/* Add New Folder Button */}
            <button
              onClick={handleOpenAddFolder}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1714] hover:bg-[#262320] text-xs font-semibold text-[#FAF8F5] transition shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <FolderPlus className="w-4 h-4 text-[#C59350]" />
              <span>+ Add New Folder</span>
            </button>
          </div>

          {/* Folder Cards Grid */}
          {folders.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[#EBE6DF] rounded-xl bg-[#FAF8F5]">
              <FolderTree className="w-8 h-8 text-[#C59350] mx-auto mb-2 opacity-60" />
              <p className="font-serif text-sm text-[#1A1714] font-medium">
                No folders created yet
              </p>
              <p className="text-xs text-[#7A6F64] mt-1 max-w-md mx-auto">
                Click <strong>"+ Add New Folder"</strong> to create your first category (e.g. <em>Haldi Celebrations</em> or <em>Birthday Themes</em>).
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pt-1">
              {folders.map((f) => {
                const photoCount = photos.filter((p) => p.folder_id === f.id).length;
                const isSelected = selectedFolderId === f.id;

                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFolderId(f.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? "border-[#C59350] bg-[#C59350]/5 ring-2 ring-[#C59350]/30 shadow-xs"
                        : "border-[#EBE6DF] bg-[#FAF8F5] hover:border-[#C59350]/60 hover:bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FolderIcon
                            className={`w-4 h-4 ${
                              isSelected ? "text-[#C59350]" : "text-[#7A6F64]"
                            }`}
                          />
                          <h3 className="font-serif text-base font-semibold text-[#1A1714] truncate">
                            {f.name}
                          </h3>
                        </div>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#EBE6DF] text-[#7A6F64] shrink-0 font-medium">
                          {photoCount}
                        </span>
                      </div>
                      {f.description ? (
                        <p className="text-[11px] text-[#7A6F64] mt-1.5 line-clamp-2">
                          {f.description}
                        </p>
                      ) : (
                        <p className="text-[11px] text-[#A69C90] mt-1.5 italic">
                          Click to view or upload photos
                        </p>
                      )}
                    </div>

                    {/* Actions: Select, Rename, Delete */}
                    <div className="mt-4 pt-3 border-t border-[#EBE6DF] flex items-center justify-between text-xs">
                      <span
                        className={`text-xs font-medium flex items-center gap-1 ${
                          isSelected ? "text-[#C59350] font-semibold" : "text-[#7A6F64]"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C59350]" />
                            <span>Active Folder</span>
                          </>
                        ) : (
                          <span>Click to Open</span>
                        )}
                      </span>

                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Edit / Rename Folder */}
                        <button
                          onClick={() => handleOpenEditFolder(f)}
                          className="p-1.5 rounded-lg text-[#7A6F64] hover:text-[#1A1714] hover:bg-white border border-transparent hover:border-[#EBE6DF] transition"
                          title="Rename Folder"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Folder */}
                        <button
                          onClick={() => handleDeleteFolder(f)}
                          className="p-1.5 rounded-lg text-[#7A6F64] hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                          title="Delete Folder"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ------------------------------------------------------- */}
        {/* SECTION B: UPLOAD PHOTOS INTO CURRENT FOLDER            */}
        {/* ------------------------------------------------------- */}
        <section className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#C59350]" />
                <h2 className="font-serif text-xl font-medium text-[#1A1714]">
                  Upload Decoration Photos
                </h2>
              </div>
              <p className="text-xs text-[#7A6F64] mt-0.5">
                Drag &amp; drop photos from your camera or phone. They will be added to the selected folder.
              </p>
            </div>

            {/* Target Folder Selector */}
            <div className="flex items-center gap-2 bg-[#FAF8F5] p-2 rounded-xl border border-[#EBE6DF]">
              <span className="text-xs text-[#7A6F64] font-medium shrink-0">
                Target Folder:
              </span>
              <select
                value={currentUploadFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                className="text-xs font-semibold bg-white border border-[#EBE6DF] rounded-lg px-3 py-1.5 outline-none focus:border-[#C59350] transition text-[#1A1714]"
              >
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#EBE6DF] hover:border-[#C59350] rounded-2xl p-8 sm:p-10 text-center bg-[#FAF8F5]/70 hover:bg-[#FAF8F5] transition cursor-pointer group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesSelected}
              className="hidden"
            />

            <div className="w-12 h-12 rounded-2xl bg-[#C59350]/10 border border-[#C59350]/20 text-[#C59350] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition">
              <UploadCloud className="w-6 h-6" />
            </div>

            <h4 className="font-serif text-base font-semibold text-[#1A1714]">
              Click to choose photos or drag them here
            </h4>
            <p className="text-xs text-[#7A6F64] mt-1 max-w-sm mx-auto">
              Uploading directly into folder:{" "}
              <strong className="text-[#C59350]">
                {activeFolder ? activeFolder.name : folders[0]?.name || "Select Folder"}
              </strong>
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A1714] text-[#FAF8F5] text-xs font-semibold group-hover:bg-[#262320] transition shadow-xs">
                <span>Browse Files</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C59350]" />
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          {isUploading && uploadProgress && (
            <div className="p-4 rounded-xl bg-[#1A1714] text-[#FAF8F5] border border-[#262320] space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-[#C59350] animate-spin" />
                  Uploading decoration photos to cloud storage...
                </span>
                <span className="font-mono text-[#C59350]">
                  {uploadProgress.current} / {uploadProgress.total}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C59350] to-[#EBD8BD] transition-all duration-300"
                  style={{
                    width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </section>

        {/* ------------------------------------------------------- */}
        {/* SECTION C: PHOTOS CRUD IN SELECTED FOLDER              */}
        {/* ------------------------------------------------------- */}
        <section className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs space-y-4">
          {/* Header & Folder Filter Switcher Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBE6DF]">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#C59350]" />
              <h2 className="font-serif text-xl font-medium text-[#1A1714]">
                {selectedFolderId === "all" ? (
                  "All Showcase Photos"
                ) : (
                  <>
                    Photos in:{" "}
                    <span className="text-[#C59350] font-semibold">
                      {activeFolder?.name || "Folder"}
                    </span>
                  </>
                )}
              </h2>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#EBE6DF] text-[#7A6F64]">
                {displayedPhotos.length} photos
              </span>
            </div>

            {/* Folder Navigation Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setSelectedFolderId("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  selectedFolderId === "all"
                    ? "bg-[#1A1714] text-[#FAF8F5] shadow-xs"
                    : "bg-[#FAF8F5] text-[#7A6F64] hover:bg-[#EBE6DF]"
                }`}
              >
                All Folders ({photos.length})
              </button>
              {folders.map((f) => {
                const count = photos.filter((p) => p.folder_id === f.id).length;
                const isSelected = selectedFolderId === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFolderId(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? "bg-[#C59350] text-[#12100E] font-semibold shadow-xs"
                        : "bg-[#FAF8F5] text-[#7A6F64] hover:bg-[#EBE6DF]"
                    }`}
                  >
                    {f.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photos Grid */}
          {displayedPhotos.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-[#EBE6DF] rounded-xl bg-[#FAF8F5]">
              <ImageIcon className="w-10 h-10 text-[#C59350] mx-auto mb-2 opacity-50" />
              <p className="font-serif text-base text-[#1A1714] font-medium">
                No photos in this folder yet
              </p>
              <p className="text-xs text-[#7A6F64] mt-1 max-w-sm mx-auto">
                Use the upload section above to add photos directly into{" "}
                <strong>{activeFolder?.name || "this category"}</strong>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
              {displayedPhotos.map((photo) => {
                const folder = folders.find((f) => f.id === photo.folder_id);

                return (
                  <div
                    key={photo.id}
                    className="relative group bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => setPreviewPhoto(photo)}
                      className="relative aspect-square w-full overflow-hidden bg-black/5 cursor-pointer"
                    >
                      <img
                        src={photo.public_url}
                        alt={photo.filename || "Decoration Photo"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Hover Overlay with Preview Icon */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <span className="p-2 rounded-full bg-white/90 text-[#1A1714] shadow-md">
                          <Eye className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Card Footer: Folder Tag & Quick Actions */}
                    <div className="p-2.5 bg-white border-t border-[#EBE6DF] flex items-center justify-between gap-1 text-xs">
                      <span className="text-[10px] text-[#7A6F64] font-medium truncate max-w-[90px]" title={folder?.name}>
                        📁 {folder ? folder.name : "Uncategorized"}
                      </span>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Move to another folder button */}
                        <button
                          onClick={() => handleOpenMovePhoto(photo)}
                          className="p-1.5 rounded-lg text-[#7A6F64] hover:text-[#1A1714] hover:bg-[#FAF8F5] border border-[#EBE6DF] transition"
                          title="Move to another folder"
                        >
                          <FolderInput className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete photo button */}
                        <button
                          onClick={() => handleDeletePhoto(photo)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ========================================================= */}
      {/* 4. MODALS (Add/Edit Folder, Move Photo, Image Preview)     */}
      {/* ========================================================= */}

      {/* Modal: Add or Edit Folder */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#EBE6DF] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBE6DF]">
              <h3 className="font-serif text-lg font-medium text-[#1A1714] flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#C59350]" />
                <span>{editingFolder ? "Rename Folder" : "Add New Folder"}</span>
              </h3>
              <button
                onClick={() => setIsFolderModalOpen(false)}
                className="p-1 rounded-lg text-[#7A6F64] hover:text-[#1A1714]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFolderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#7A6F64] uppercase tracking-wider mb-1">
                  Folder Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haldi Celebrations, Birthday Themes, Mandap & Stages"
                  value={folderNameInput}
                  onChange={(e) => setFolderNameInput(e.target.value)}
                  className="w-full text-sm bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-4 py-2.5 outline-none focus:border-[#C59350] transition"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A6F64] uppercase tracking-wider mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Short note about what decorations belong in this folder..."
                  value={folderDescInput}
                  onChange={(e) => setFolderDescInput(e.target.value)}
                  className="w-full text-sm bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-4 py-2 outline-none focus:border-[#C59350] transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EBE6DF] text-xs font-medium text-[#7A6F64] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isFolderSubmitting || !folderNameInput.trim()}
                  className="px-5 py-2 rounded-xl bg-[#1A1714] hover:bg-[#262320] text-xs font-semibold text-[#FAF8F5] transition disabled:opacity-50"
                >
                  {isFolderSubmitting
                    ? "Saving..."
                    : editingFolder
                    ? "Save Changes"
                    : "Create Folder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Move Photo to Another Folder */}
      {movingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-[#EBE6DF] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EBE6DF]">
              <h3 className="font-serif text-lg font-medium text-[#1A1714] flex items-center gap-2">
                <FolderInput className="w-5 h-5 text-[#C59350]" />
                <span>Move Photo</span>
              </h3>
              <button
                onClick={() => setMovingPhoto(null)}
                className="p-1 rounded-lg text-[#7A6F64] hover:text-[#1A1714]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmMovePhoto} className="space-y-4">
              <div className="flex items-center gap-3 p-2 bg-[#FAF8F5] rounded-xl border border-[#EBE6DF]">
                <img
                  src={movingPhoto.public_url}
                  alt=""
                  className="w-12 h-12 object-cover rounded-lg shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#1A1714] truncate">
                    {movingPhoto.filename || "Photo"}
                  </p>
                  <p className="text-[10px] text-[#7A6F64]">
                    Current folder:{" "}
                    {folders.find((f) => f.id === movingPhoto.folder_id)?.name || "None"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A6F64] uppercase tracking-wider mb-1">
                  Select Destination Folder
                </label>
                <select
                  value={targetMoveFolderId}
                  onChange={(e) => setTargetMoveFolderId(e.target.value)}
                  className="w-full text-xs font-medium bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-3 py-2.5 outline-none focus:border-[#C59350] transition"
                >
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMovingPhoto(null)}
                  className="px-4 py-2 rounded-xl border border-[#EBE6DF] text-xs font-medium text-[#7A6F64] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isMovingSubmitting || !targetMoveFolderId}
                  className="px-5 py-2 rounded-xl bg-[#C59350] hover:brightness-110 text-xs font-semibold text-[#12100E] transition disabled:opacity-50"
                >
                  {isMovingSubmitting ? "Moving..." : "Move Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Fullscreen Photo Preview */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] bg-[#12100E] rounded-2xl overflow-hidden border border-[#262320] shadow-2xl flex flex-col"
          >
            <div className="p-3 bg-black/50 flex items-center justify-between text-xs text-white/80 border-b border-white/10">
              <span className="font-mono truncate max-w-xs">
                {previewPhoto.filename || "Decoration Photo"}
              </span>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center p-2">
              <img
                src={previewPhoto.public_url}
                alt=""
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
