"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { EventItem, Folder, Photo } from "@/types";
import { formatDate, formatDateTime, formatFileSize } from "@/lib/utils/format";
import {
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Plus,
  Trash2,
  FolderTree,
  UploadCloud,
  Image as ImageIcon,
  FolderInput,
  Edit2,
  X,
  Share2,
  Calendar,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { ShareModal } from "@/components/gallery/ShareModal";
import { EditEventModal } from "@/components/admin/EditEventModal";
import {
  createFolderAction,
  updateFolderAction,
  deleteFolderAction,
  addPhotoAction,
  deletePhotoAction,
  movePhotoAction,
  updateEventAction,
} from "@/actions/events";
import { uploadPhotoFile } from "@/lib/storage/uploader";

interface EventStudioClientProps {
  initialEvent: EventItem;
}

export function EventStudioClient({ initialEvent }: EventStudioClientProps) {
  const [event, setEvent] = useState<EventItem>(initialEvent);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("all");
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Folder modal state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Multi-select photos
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [targetMoveFolderId, setTargetMoveFolderId] = useState<string>("");

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/gallery/${event.public_slug}`
      : `/gallery/${event.public_slug}`;

  const allPhotos = event.photos || [];
  const folders = event.folders || [];

  const currentFolderPhotos =
    selectedFolderId === "all"
      ? allPhotos
      : allPhotos.filter((p) => p.folder_id === selectedFolderId);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add / Edit Folder
  const handleSaveFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    if (editingFolder) {
      await updateFolderAction(editingFolder.id, newFolderName);
      setEvent((prev) => ({
        ...prev,
        folders: prev.folders?.map((f) =>
          f.id === editingFolder.id ? { ...f, name: newFolderName } : f
        ),
      }));
    } else {
      const created = await createFolderAction(event.id, newFolderName);
      setEvent((prev) => ({
        ...prev,
        folders: [...(prev.folders || []), created],
      }));
      setSelectedFolderId(created.id);
    }

    setNewFolderName("");
    setEditingFolder(null);
    setIsFolderModalOpen(false);
  };

  // Delete Folder
  const handleDeleteFolder = async (folder: Folder) => {
    if (
      !confirm(
        `Are you sure you want to delete folder "${folder.name}"? Photos in this folder will also be removed.`
      )
    ) {
      return;
    }

    await deleteFolderAction(folder.id);
    setEvent((prev) => ({
      ...prev,
      folders: prev.folders?.filter((f) => f.id !== folder.id),
      photos: prev.photos?.filter((p) => p.folder_id !== folder.id),
    }));
    if (selectedFolderId === folder.id) {
      setSelectedFolderId("all");
    }
  };

  // File Upload Handler (Multiple files)
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Must have a specific folder or default to first folder
    const targetFolderId =
      selectedFolderId === "all"
        ? folders[0]?.id || "fld-default"
        : selectedFolderId;

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    const newUploadedPhotos: Photo[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const uploadRes = await uploadPhotoFile(file, event.id, targetFolderId);
        const added = await addPhotoAction({
          event_id: event.id,
          folder_id: targetFolderId,
          storage_path: uploadRes.storagePath,
          public_url: uploadRes.publicUrl,
          filename: uploadRes.filename,
          file_size: uploadRes.fileSize,
          sort_order: (event.photos?.length || 0) + i,
        });
        newUploadedPhotos.push(added);
      } catch (err) {
        console.error("Upload error for file:", file.name, err);
      }
      setUploadProgress({ current: i + 1, total: files.length });
    }

    setEvent((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), ...newUploadedPhotos],
      folders: prev.folders?.map((f) =>
        f.id === targetFolderId
          ? { ...f, photo_count: (f.photo_count || 0) + newUploadedPhotos.length }
          : f
      ),
    }));

    setIsUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Delete Single Photo
  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Remove this photo from the gallery?")) return;
    await deletePhotoAction(photoId);
    setEvent((prev) => ({
      ...prev,
      photos: prev.photos?.filter((p) => p.id !== photoId),
    }));
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${selectedPhotoIds.length} selected photos?`
      )
    ) {
      return;
    }
    for (const pId of selectedPhotoIds) {
      await deletePhotoAction(pId);
    }
    setEvent((prev) => ({
      ...prev,
      photos: prev.photos?.filter((p) => !selectedPhotoIds.includes(p.id)),
    }));
    setSelectedPhotoIds([]);
  };

  // Bulk Move
  const handleBulkMove = async () => {
    if (!targetMoveFolderId) return;
    for (const pId of selectedPhotoIds) {
      await movePhotoAction(pId, targetMoveFolderId);
    }
    setEvent((prev) => ({
      ...prev,
      photos: prev.photos?.map((p) =>
        selectedPhotoIds.includes(p.id) ? { ...p, folder_id: targetMoveFolderId } : p
      ),
    }));
    setSelectedPhotoIds([]);
    setTargetMoveFolderId("");
  };

  const toggleSelectPhoto = (id: string) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
      {/* 1. Event Masthead Studio Header */}
      <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {event.cover_image_url ? (
            <img
              src={event.cover_image_url}
              alt={event.name}
              className="w-20 h-20 rounded-2xl object-cover border border-[#EBE6DF] shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1A1714] to-[#262320] border border-[#C59350]/30 flex flex-col items-center justify-center text-[#C59350] shrink-0 shadow-inner">
              <Sparkles className="w-6 h-6 mb-0.5 text-[#C59350]" />
              <span className="font-serif text-[9px] uppercase tracking-widest text-[#EED9B9]">VE</span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#C59350]/15 text-[#C59350] border border-[#C59350]/30">
                {event.event_type}
              </span>
              <span className="text-xs text-[#7A6F64]">
                Ceremony Date: {formatDate(event.event_date)}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1714] font-medium mt-1">
              {event.name}
            </h1>
            <p className="text-xs text-[#7A6F64] mt-0.5">
              Client: <span className="font-medium text-[#1A1714]">{event.customer_names}</span> •{" "}
              {allPhotos.length} total photos across {folders.length} folders
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Edit Event Details */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#C59350]/40 bg-[#C59350]/10 hover:bg-[#C59350]/20 text-xs font-medium text-[#1A1714] transition"
          >
            <Edit2 className="w-4 h-4 text-[#C59350]" />
            Edit Event Details
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition ${
              copied
                ? "bg-emerald-600 text-white border-emerald-600"
                : "border-[#EBE6DF] hover:bg-[#FAF8F5] text-[#1A1714]"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Link Copied!" : "Copy WhatsApp Link"}
          </button>

          {/* QR Code */}
          <button
            onClick={() => setShareModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#EBE6DF] hover:bg-[#FAF8F5] text-xs font-medium text-[#1A1714] transition"
          >
            <QrCode className="w-4 h-4 text-[#C59350]" />
            Hall QR Code
          </button>

          {/* Open Public */}
          <Link
            href={`/gallery/${event.public_slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A1714] hover:bg-[#262320] text-xs font-medium text-[#FAF8F5] transition"
          >
            <ExternalLink className="w-4 h-4 text-[#C59350]" />
            Preview Public Gallery
          </Link>
        </div>
      </div>

      {/* 2. Folder Navigation & Management Bar */}
      <div className="bg-white border border-[#EBE6DF] rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#EBE6DF]">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-[#C59350]" />
            <h2 className="font-serif text-base text-[#1A1714] font-medium">
              Ceremonial Folders
            </h2>
            <span className="text-xs text-[#7A6F64]">({folders.length} folders)</span>
          </div>

          <button
            onClick={() => {
              setEditingFolder(null);
              setNewFolderName("");
              setIsFolderModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1714] hover:bg-[#262320] text-xs font-medium text-[#FAF8F5] transition w-fit"
          >
            <Plus className="w-3.5 h-3.5 text-[#C59350]" />
            Add Folder
          </button>
        </div>

        {/* Folder Pills with Context Actions */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3">
          {/* All Photos pill */}
          <button
            onClick={() => setSelectedFolderId("all")}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-medium font-sans transition ${
              selectedFolderId === "all"
                ? "bg-[#1A1714] text-[#FAF8F5] shadow-xs"
                : "bg-[#FAF8F5] hover:bg-[#EBE6DF]/70 text-[#7A6F64]"
            }`}
          >
            All Photos ({allPhotos.length})
          </button>

          {/* Individual Folders */}
          {folders.map((folder) => {
            const count = allPhotos.filter((p) => p.folder_id === folder.id).length;
            const isSelected = selectedFolderId === folder.id;

            return (
              <div
                key={folder.id}
                className={`shrink-0 group flex items-center gap-1 pl-3 pr-1 py-1 rounded-xl text-xs font-medium border transition ${
                  isSelected
                    ? "bg-[#1A1714] text-[#FAF8F5] border-[#1A1714]"
                    : "bg-[#FAF8F5] text-[#7A6F64] border-[#EBE6DF] hover:border-[#1A1714]/30"
                }`}
              >
                <button
                  onClick={() => setSelectedFolderId(folder.id)}
                  className="py-1 pr-1 font-sans"
                >
                  {folder.name} ({count})
                </button>

                {/* Edit Folder Name */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFolder(folder);
                    setNewFolderName(folder.name);
                    setIsFolderModalOpen(true);
                  }}
                  className={`p-1 rounded-md opacity-60 hover:opacity-100 ${
                    isSelected ? "hover:bg-white/20 text-[#FAF8F5]" : "hover:bg-black/10 text-[#7A6F64]"
                  }`}
                  title="Rename Folder"
                >
                  <Edit2 className="w-3 h-3" />
                </button>

                {/* Delete Folder */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder);
                  }}
                  className={`p-1 rounded-md opacity-60 hover:opacity-100 ${
                    isSelected ? "hover:bg-rose-500/30 text-rose-300" : "hover:bg-rose-100 text-rose-600"
                  }`}
                  title="Delete Folder"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Drag-and-Drop Batch Photo Uploader */}
      <div className="bg-white border-2 border-dashed border-[#EBE6DF] hover:border-[#C59350] rounded-2xl p-8 text-center transition cursor-pointer bg-gradient-to-b from-[#FAF8F5]/30 to-white">
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFilesSelected}
          className="hidden"
          id="photo-upload-input"
        />

        <label
          htmlFor="photo-upload-input"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <div className="p-3.5 rounded-full bg-[#C59350]/10 text-[#C59350] mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="font-serif text-lg font-medium text-[#1A1714]">
            Drag & Drop photos here, or click to upload
          </h3>
          <p className="text-xs text-[#7A6F64] mt-1 max-w-md">
            Uploading to folder:{" "}
            <span className="font-semibold text-[#1A1714]">
              {selectedFolderId === "all"
                ? folders[0]?.name || "Primary Folder"
                : folders.find((f) => f.id === selectedFolderId)?.name}
            </span>
          </p>
          <p className="text-[11px] text-[#A69C90] mt-1 font-mono">
            Supported formats: JPG, PNG, WebP • Multi-selection supported
          </p>
        </label>

        {isUploading && uploadProgress && (
          <div className="mt-4 max-w-sm mx-auto p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DF]">
            <div className="flex items-center justify-between text-xs text-[#1A1714] font-medium mb-1.5">
              <span>Uploading Photos...</span>
              <span>
                {uploadProgress.current} of {uploadProgress.total}
              </span>
            </div>
            <div className="w-full bg-[#EBE6DF] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#C59350] h-full transition-all duration-300"
                style={{
                  width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Multi-Select Actions Toolbar */}
      {selectedPhotoIds.length > 0 && (
        <div className="bg-[#1A1714] text-[#FAF8F5] p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg animate-fade-in">
          <div className="text-xs font-sans">
            <span className="font-semibold text-[#C59350]">
              {selectedPhotoIds.length}
            </span>{" "}
            photos selected
          </div>

          <div className="flex items-center gap-2">
            {/* Move to folder */}
            <div className="flex items-center gap-1.5 bg-black/40 rounded-xl px-2.5 py-1 border border-white/10">
              <FolderInput className="w-3.5 h-3.5 text-[#C59350]" />
              <select
                value={targetMoveFolderId}
                onChange={(e) => setTargetMoveFolderId(e.target.value)}
                className="text-xs bg-transparent outline-none text-[#FAF8F5] font-sans"
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
                className="px-2 py-0.5 rounded-lg bg-[#C59350] text-[#12100E] font-semibold text-xs disabled:opacity-50"
              >
                Apply
              </button>
            </div>

            {/* Bulk Delete */}
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-medium transition"
            >
              Delete Selected
            </button>

            {/* Clear Selection */}
            <button
              onClick={() => setSelectedPhotoIds([])}
              className="p-1.5 text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Photo Manager Grid */}
      <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-medium text-[#1A1714]">
            Photos in Collection ({currentFolderPhotos.length})
          </h3>
          <span className="text-xs text-[#7A6F64]">
            Select photos to move or delete in bulk
          </span>
        </div>

        {currentFolderPhotos.length === 0 ? (
          <div className="py-16 text-center">
            <ImageIcon className="w-10 h-10 text-[#C59350] mx-auto mb-2 opacity-60" />
            <p className="font-serif text-base text-[#1A1714]">No Photos Found</p>
            <p className="text-xs text-[#7A6F64] mt-0.5">
              Drag & drop photos above to add to this folder.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {currentFolderPhotos.map((photo) => {
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

                  {/* Top Folder badge */}
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-md bg-black/60 text-[#FAF8F5] backdrop-blur-xs max-w-[80px] truncate block">
                      {folderObj?.name || "Folder"}
                    </span>
                  </div>

                  {/* Bottom Hover Actions */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 opacity-0 group-hover:opacity-100 transition flex items-center justify-between text-white">
                    <span className="text-[10px] font-mono truncate max-w-[90px]">
                      {photo.filename}
                    </span>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-1 rounded-md hover:bg-rose-500/80 text-rose-300 hover:text-white transition"
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

      {/* 6. Folder Modal (Create / Rename) */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] border border-[#EBE6DF] rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-serif text-lg font-medium text-[#1A1714]">
              {editingFolder ? "Rename Folder" : "Create Ceremonial Folder"}
            </h3>
            <p className="text-xs text-[#7A6F64] mt-0.5">
              Examples: Wedding Highlights, Haldi, Couple Shoot, Sangeet
            </p>

            <form onSubmit={handleSaveFolder} className="mt-4 space-y-4">
              <input
                type="text"
                required
                autoFocus
                placeholder="Folder Name (e.g. Haldi)"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full text-sm bg-white border border-[#EBE6DF] rounded-xl px-4 py-2.5 outline-none focus:border-[#C59350]"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EBE6DF] text-xs font-medium text-[#7A6F64]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1A1714] text-xs font-medium text-[#FAF8F5]"
                >
                  {editingFolder ? "Save Name" : "Create Folder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. QR Code / Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        eventTitle={event.name}
        slug={event.public_slug}
      />

      {/* 8. Edit Details Modal */}
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={event}
        onSaved={(updated) => setEvent((prev) => ({ ...prev, ...updated }))}
      />
    </div>
  );
}
