"use client";

import React, { useState, useRef } from "react";
import { Folder, Photo } from "@/types";
import { SHOWCASE_EVENT_ID } from "@/lib/constants";
import {
  createShowcaseFolderAction,
  updateShowcaseFolderAction,
  deleteShowcaseFolderAction,
  addShowcasePhotoAction,
  deleteShowcasePhotoAction,
  moveShowcasePhotoAction,
} from "@/actions/showcase";
import { uploadPhotoFile } from "@/lib/storage/uploader";
import {
  FolderPlus,
  UploadCloud,
  Trash2,
  Edit2,
  ExternalLink,
  Image as ImageIcon,
  FolderTree,
  Check,
  X,
  FolderInput,
  Sparkles,
  Plus,
  Eye,
  Layers,
} from "lucide-react";

interface ShowcaseStudioClientProps {
  initialFolders: Folder[];
  initialPhotos: Photo[];
}

export function ShowcaseStudioClient({
  initialFolders,
  initialPhotos,
}: ShowcaseStudioClientProps) {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("all");

  // Folder modal state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderNameInput, setFolderNameInput] = useState("");
  const [folderDescInput, setFolderDescInput] = useState("");
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

  // Upload state
  const [targetUploadFolderId, setTargetUploadFolderId] = useState<string>(
    folders[0]?.id || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Bulk photo selection
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [targetMoveFolderId, setTargetMoveFolderId] = useState<string>("");

  const filteredPhotos =
    selectedFolderId === "all"
      ? photos
      : photos.filter((p) => p.folder_id === selectedFolderId);

  // 1. Folder Management Handlers
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

  const handleSaveFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderNameInput.trim()) return;

    if (editingFolder) {
      await updateShowcaseFolderAction(
        editingFolder.id,
        folderNameInput.trim(),
        folderDescInput.trim() || undefined
      );
      setFolders((prev) =>
        prev.map((f) =>
          f.id === editingFolder.id
            ? { ...f, name: folderNameInput.trim(), description: folderDescInput.trim() || undefined }
            : f
        )
      );
    } else {
      const created = await createShowcaseFolderAction(
        folderNameInput.trim(),
        folderDescInput.trim() || undefined
      );
      setFolders((prev) => [...prev, created]);
      if (!targetUploadFolderId) setTargetUploadFolderId(created.id);
    }

    setIsFolderModalOpen(false);
    setEditingFolder(null);
    setFolderNameInput("");
    setFolderDescInput("");
  };

  const handleDeleteFolder = async (folder: Folder) => {
    if (
      !confirm(
        `Are you sure you want to delete folder "${folder.name}"? All photos in this folder will also be removed.`
      )
    ) {
      return;
    }

    await deleteShowcaseFolderAction(folder.id);
    setFolders((prev) => prev.filter((f) => f.id !== folder.id));
    setPhotos((prev) => prev.filter((p) => p.folder_id !== folder.id));

    if (selectedFolderId === folder.id) {
      setSelectedFolderId("all");
    }
  };

  // 2. Photo Upload Handler
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const folderId = targetUploadFolderId || folders[0]?.id;
    if (!folderId) {
      alert("Please create a folder first before uploading photos.");
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    const newUploadedPhotos: Photo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const uploadRes = await uploadPhotoFile(file, SHOWCASE_EVENT_ID, folderId);
        const added = await addShowcasePhotoAction({
          event_id: SHOWCASE_EVENT_ID,
          folder_id: folderId,
          storage_path: uploadRes.storagePath,
          public_url: uploadRes.publicUrl,
          filename: uploadRes.filename,
          file_size: uploadRes.fileSize,
          sort_order: photos.length + i,
        });
        newUploadedPhotos.push(added);
      } catch (err) {
        console.error("Upload error for file:", file.name, err);
      }
      setUploadProgress({ current: i + 1, total: files.length });
    }

    setPhotos((prev) => [...newUploadedPhotos, ...prev]);
    setIsUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 3. Photo Deletion & Movement Handlers
  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Are you sure you want to remove this photo from the showcase?")) return;
    await deleteShowcasePhotoAction(photoId);
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const handleBulkDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${selectedPhotoIds.length} selected photos?`
      )
    ) {
      return;
    }
    for (const pId of selectedPhotoIds) {
      await deleteShowcasePhotoAction(pId);
    }
    setPhotos((prev) => prev.filter((p) => !selectedPhotoIds.includes(p.id)));
    setSelectedPhotoIds([]);
  };

  const handleBulkMove = async () => {
    if (!targetMoveFolderId) return;
    for (const pId of selectedPhotoIds) {
      await moveShowcasePhotoAction(pId, targetMoveFolderId);
    }
    setPhotos((prev) =>
      prev.map((p) =>
        selectedPhotoIds.includes(p.id) ? { ...p, folder_id: targetMoveFolderId } : p
      )
    );
    setSelectedPhotoIds([]);
    setTargetMoveFolderId("");
  };

  const toggleSelectPhoto = (id: string) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6 font-sans">
      {/* 1. Masthead Studio Banner */}
      <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-[#C59350]/15 text-[#C59350] border border-[#C59350]/30 font-mono">
              SHOWCASE STUDIO
            </span>
            <span className="text-xs text-[#7A6F64]">
              {folders.length} Folders • {photos.length} Total Decoration Photos
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1714] font-medium mt-1.5">
            Decoration Showcase Manager
          </h1>
          <p className="text-xs text-[#7A6F64] mt-1 max-w-xl">
            Create folders for your decor categories (Haldi, Birthday, Mandap, Reception) and upload photos. Guests browse them directly on your public showcase website.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAddFolder}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1714] hover:bg-[#262320] text-xs font-semibold text-[#FAF8F5] transition shadow-xs cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-[#C59350]" />
            <span>Add New Folder</span>
          </button>

          <a
            href="https://vasavievents.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#EBE6DF] hover:bg-[#FAF8F5] text-xs font-medium text-[#1A1714] transition cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-[#C59350]" />
            <span>Preview Public Showcase</span>
          </a>
        </div>
      </div>

      {/* 2. Decoration Folders Card Grid */}
      <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-[#C59350]" />
            <h2 className="font-serif text-lg font-medium text-[#1A1714]">
              Decoration Folders & Categories
            </h2>
          </div>
          <span className="text-xs text-[#7A6F64]">
            Prospective clients see these as filter tabs
          </span>
        </div>

        {folders.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[#EBE6DF] rounded-xl bg-[#FAF8F5]">
            <FolderTree className="w-8 h-8 text-[#C59350] mx-auto mb-2 opacity-60" />
            <p className="font-serif text-sm text-[#1A1714]">No Folders Yet</p>
            <p className="text-xs text-[#7A6F64] mt-0.5">
              Click "Add New Folder" to create your first category (e.g. Haldi Decor, Birthday Themes).
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folders.map((f) => {
              const photoCount = photos.filter((p) => p.folder_id === f.id).length;
              const isSelected = selectedFolderId === f.id;

              return (
                <div
                  key={f.id}
                  className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                    isSelected
                      ? "border-[#C59350] bg-[#C59350]/5 ring-1 ring-[#C59350]/30"
                      : "border-[#EBE6DF] bg-[#FAF8F5] hover:border-[#C59350]/40"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-base font-medium text-[#1A1714] truncate">
                        {f.name}
                      </h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#EBE6DF] text-[#7A6F64] shrink-0">
                        {photoCount} photos
                      </span>
                    </div>
                    {f.description && (
                      <p className="text-[11px] text-[#7A6F64] mt-1 line-clamp-2">
                        {f.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EBE6DF]/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setSelectedFolderId(f.id);
                        setTargetUploadFolderId(f.id);
                      }}
                      className="text-xs text-[#C59350] hover:underline font-medium cursor-pointer"
                    >
                      {isSelected ? "Filtering photos" : "View photos"}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditFolder(f)}
                        className="p-1.5 rounded-lg text-[#7A6F64] hover:text-[#1A1714] hover:bg-white transition"
                        title="Rename Folder"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFolder(f)}
                        className="p-1.5 rounded-lg text-[#7A6F64] hover:text-rose-600 hover:bg-rose-50 transition"
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
      </div>

      {/* 3. Direct Photo Uploader */}
      <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#C59350]" />
            <h2 className="font-serif text-lg font-medium text-[#1A1714]">
              Upload Decoration Photos
            </h2>
          </div>

          {/* Select Target Folder */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#7A6F64] font-medium">Upload to Folder:</label>
            <select
              value={targetUploadFolderId}
              onChange={(e) => setTargetUploadFolderId(e.target.value)}
              className="text-xs bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-3 py-1.5 outline-none focus:border-[#C59350] transition"
            >
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#EBE6DF] hover:border-[#C59350] rounded-2xl p-8 sm:p-12 text-center bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition cursor-pointer group"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFilesSelected}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-[#C59350]/10 border border-[#C59350]/20 text-[#C59350] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h4 className="font-serif text-base font-medium text-[#1A1714]">
            Drag & Drop Decoration Photos Here
          </h4>
          <p className="text-xs text-[#7A6F64] mt-1 max-w-md mx-auto">
            Upload high-resolution camera photos, stage decorations, or theme setups (JPG, PNG, WebP).
          </p>
          <span className="inline-block mt-3 px-4 py-1.5 rounded-xl bg-[#1A1714] text-[#FAF8F5] text-xs font-semibold">
            Choose Photos from Computer
          </span>
        </div>

        {/* Upload Progress Bar */}
        {isUploading && uploadProgress && (
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DF] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#1A1714] font-medium">
              <span>Uploading Photos to Supabase Storage...</span>
              <span>
                {uploadProgress.current} of {uploadProgress.total} completed
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#EBE6DF] overflow-hidden">
              <div
                className="h-full bg-[#C59350] transition-all duration-300"
                style={{
                  width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Photo Manager & Gallery Grid */}
      <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#C59350]" />
            <h2 className="font-serif text-lg font-medium text-[#1A1714]">
              Photos in Showcase ({filteredPhotos.length})
            </h2>
          </div>

          {/* Folder Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedFolderId("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedFolderId === "all"
                  ? "bg-[#1A1714] text-[#FAF8F5]"
                  : "bg-[#FAF8F5] text-[#7A6F64] hover:bg-black/5"
              }`}
            >
              All ({photos.length})
            </button>
            {folders.map((f) => {
              const count = photos.filter((p) => p.folder_id === f.id).length;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFolderId(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                    selectedFolderId === f.id
                      ? "bg-[#1A1714] text-[#FAF8F5]"
                      : "bg-[#FAF8F5] text-[#7A6F64] hover:bg-black/5"
                  }`}
                >
                  {f.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedPhotoIds.length > 0 && (
          <div className="p-3 bg-[#1A1714] text-[#FAF8F5] rounded-xl flex items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
            <span className="font-medium text-[#C59350]">
              {selectedPhotoIds.length} photos selected
            </span>

            <div className="flex items-center gap-2">
              {/* Move selected */}
              <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2 py-1">
                <FolderInput className="w-3.5 h-3.5 text-[#C59350]" />
                <select
                  value={targetMoveFolderId}
                  onChange={(e) => setTargetMoveFolderId(e.target.value)}
                  className="bg-transparent text-xs text-white outline-none"
                >
                  <option value="" className="text-black">
                    Move to folder...
                  </option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id} className="text-black">
                      {f.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleBulkMove}
                  disabled={!targetMoveFolderId}
                  className="px-2 py-0.5 rounded bg-[#C59350] text-[#12100E] font-semibold text-xs disabled:opacity-50 cursor-pointer"
                >
                  Move
                </button>
              </div>

              {/* Bulk Delete */}
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition cursor-pointer"
              >
                Delete Selected
              </button>

              <button
                onClick={() => setSelectedPhotoIds([])}
                className="p-1 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#EBE6DF] rounded-xl bg-[#FAF8F5]">
            <ImageIcon className="w-10 h-10 text-[#C59350] mx-auto mb-2 opacity-50" />
            <p className="font-serif text-base text-[#1A1714]">No Photos in This Folder</p>
            <p className="text-xs text-[#7A6F64] mt-0.5">
              Use the upload area above to add decoration pictures to this folder.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredPhotos.map((photo) => {
              const isSelected = selectedPhotoIds.includes(photo.id);
              const folderObj = folders.find((f) => f.id === photo.folder_id);

              return (
                <div
                  key={photo.id}
                  className={`group relative rounded-xl overflow-hidden border-2 bg-black/5 aspect-[3/4] transition ${
                    isSelected
                      ? "border-[#C59350] ring-2 ring-[#C59350]/30"
                      : "border-[#EBE6DF] hover:border-[#1A1714]/40"
                  }`}
                >
                  <img
                    src={photo.public_url}
                    alt={photo.filename}
                    className="w-full h-full object-cover"
                  />

                  {/* Top Checkbox for multi-select */}
                  <div
                    onClick={() => toggleSelectPhoto(photo.id)}
                    className="absolute top-2 left-2 z-10 cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                        isSelected
                          ? "bg-[#C59350] text-[#12100E]"
                          : "bg-black/50 text-white hover:bg-black/80"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-3" />}
                    </div>
                  </div>

                  {/* Bottom Folder Tag & Actions */}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-[10px] text-white/90 truncate max-w-[90px]">
                      {folderObj?.name || "Decor"}
                    </span>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-1 rounded bg-black/60 hover:bg-rose-600 text-white transition"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Add / Edit Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#EBE6DF] p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-[#1A1714]">
                {editingFolder ? "Rename Folder" : "Create New Decoration Folder"}
              </h3>
              <button
                onClick={() => setIsFolderModalOpen(false)}
                className="p-1 text-[#7A6F64] hover:text-[#1A1714]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFolder} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#1A1714] font-medium mb-1">
                  Folder Name *
                </label>
                <input
                  type="text"
                  required
                  value={folderNameInput}
                  onChange={(e) => setFolderNameInput(e.target.value)}
                  placeholder="e.g. Haldi Decor, Birthday Themes, Wedding Mandaps"
                  className="w-full bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#C59350] transition text-xs"
                />
              </div>

              <div>
                <label className="block text-[#1A1714] font-medium mb-1">
                  Optional Description
                </label>
                <input
                  type="text"
                  value={folderDescInput}
                  onChange={(e) => setFolderDescInput(e.target.value)}
                  placeholder="e.g. Traditional yellow florals and brass urlis"
                  className="w-full bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#C59350] transition text-xs"
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
                  className="px-4 py-2 rounded-xl bg-[#1A1714] text-[#FAF8F5] text-xs font-medium hover:bg-[#262320]"
                >
                  {editingFolder ? "Save Changes" : "Create Folder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
