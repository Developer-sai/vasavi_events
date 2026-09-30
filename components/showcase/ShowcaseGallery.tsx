"use client";

import React, { useState } from "react";
import { Folder, Photo } from "@/types";
import { ShowcaseLightbox } from "@/components/showcase/ShowcaseLightbox";
import { ShowcaseSelectionDock } from "@/components/showcase/ShowcaseSelectionDock";
import {
  Maximize2,
  Sparkles,
  MessageCircle,
  Image as ImageIcon,
  Check,
  CheckSquare2,
  Square,
  Layers,
  X,
} from "lucide-react";

interface ShowcaseGalleryProps {
  folders: Folder[];
  photos: Photo[];
}

export function ShowcaseGallery({ folders, photos }: ShowcaseGalleryProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Multi-Photo Selection State (persists across all folders/categories)
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Filter photos for active category tab
  const filteredPhotos =
    selectedFolderId === "all"
      ? photos
      : photos.filter((p) => p.folder_id === selectedFolderId);

  // Active folder object
  const activeFolder = folders.find((f) => f.id === selectedFolderId);

  // All selected photo objects across all folders
  const selectedPhotos = photos.filter((p) => selectedPhotoIds.includes(p.id));

  // Toggle individual photo selection
  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  // Remove individual photo from selection dock
  const removePhotoFromSelection = (photoId: string) => {
    setSelectedPhotoIds((prev) => prev.filter((id) => id !== photoId));
  };

  // Clear all selections
  const clearAllSelection = () => {
    setSelectedPhotoIds([]);
    setIsSelectionMode(false);
  };

  // Click on a photo card
  const handlePhotoClick = (photo: Photo, index: number) => {
    if (isSelectionMode) {
      // In selection mode, click toggles selection
      togglePhotoSelection(photo.id);
    } else {
      // In normal mode, click opens high-res Lightbox
      setLightboxIndex(index);
      setLightboxOpen(true);
    }
  };

  return (
    <div className="w-full relative">
      {/* 1. Category Filter Tabs Bar & Selection Mode Control (Sticky Luxury Plaque) */}
      <div className="sticky top-16 z-30 max-w-7xl mx-auto px-4 sm:px-6 my-6">
        <div className="bg-[#1A1714]/90 backdrop-blur-md border border-[#262320] rounded-2xl p-2 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3 overflow-hidden">
          {/* Category Tabs Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 w-full md:w-auto flex-1">
            {/* All Photos Pill */}
            <button
              onClick={() => setSelectedFolderId("all")}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-medium font-sans transition-all flex items-center gap-2 cursor-pointer ${
                selectedFolderId === "all"
                  ? "bg-[#C59350] text-[#12100E] font-semibold shadow-md"
                  : "text-[#FAF8F5]/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>All Decorations</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedFolderId === "all"
                    ? "bg-[#12100E]/20 text-[#12100E]"
                    : "bg-white/10 text-[#FAF8F5]/60"
                }`}
              >
                {photos.length}
              </span>
            </button>

            {/* Individual Category Folders */}
            {folders.map((folder) => {
              const count = photos.filter((p) => p.folder_id === folder.id).length;
              const isSelected = selectedFolderId === folder.id;

              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-medium font-sans transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-[#C59350] text-[#12100E] font-semibold shadow-md"
                      : "text-[#FAF8F5]/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{folder.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-[#12100E]/20 text-[#12100E]"
                        : "bg-white/10 text-[#FAF8F5]/60"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selection Mode Toggle Button */}
          <div className="shrink-0 flex items-center gap-2 self-end md:self-auto w-full md:w-auto justify-end border-t md:border-t-0 border-[#262320]/60 pt-2 md:pt-0">
            <button
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer border ${
                isSelectionMode || selectedPhotoIds.length > 0
                  ? "bg-[#C59350]/20 text-[#EED9B9] border-[#C59350]/50"
                  : "bg-white/5 text-[#FAF8F5]/70 border-white/10 hover:text-white hover:bg-white/10"
              }`}
              title="Toggle multi-photo selection mode to send items on WhatsApp or Email"
            >
              <CheckSquare2 className="w-3.5 h-3.5 text-[#C59350]" />
              <span>
                {isSelectionMode ? "Exit Select Mode" : "Select Photos"}
              </span>
              {selectedPhotoIds.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#C59350] text-[#12100E] font-bold text-[10px]">
                  {selectedPhotoIds.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Description Banner */}
        {activeFolder?.description && (
          <div className="mt-3 text-center">
            <p className="text-xs text-[#C59350] font-sans tracking-wide italic">
              ✦ {activeFolder.description}
            </p>
          </div>
        )}
      </div>

      {/* 2. Masonry Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28">
        {filteredPhotos.length === 0 ? (
          <div className="py-24 text-center bg-[#1A1714]/40 border border-[#262320] rounded-3xl p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#C59350]/10 text-[#C59350] flex items-center justify-center mx-auto mb-3">
              <ImageIcon className="w-6 h-6 stroke-1" />
            </div>
            <h3 className="font-serif text-xl text-[#FAF8F5]">
              No Photos in This Category Yet
            </h3>
            <p className="text-xs text-[#FAF8F5]/60 mt-1 leading-relaxed">
              We are adding new decoration setups to this folder soon. Check out our other categories or message us on WhatsApp for custom themes.
            </p>
            <button
              onClick={() => setSelectedFolderId("all")}
              className="mt-4 px-4 py-2 rounded-xl bg-[#C59350] text-[#12100E] text-xs font-semibold hover:brightness-110 transition cursor-pointer"
            >
              Browse All Decorations
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {filteredPhotos.map((photo, index) => {
              const folder = folders.find((f) => f.id === photo.folder_id);
              const isSelected = selectedPhotoIds.includes(photo.id);

              return (
                <div
                  key={photo.id}
                  onClick={() => handlePhotoClick(photo, index)}
                  className={`relative group mb-4 break-inside-avoid overflow-hidden rounded-2xl cursor-pointer bg-[#1A1714] border transition-all duration-300 ${
                    isSelected
                      ? "border-[#C59350] ring-3 ring-[#C59350]/70 shadow-2xl scale-[1.01]"
                      : "border-[#262320] hover:border-[#C59350]/50 shadow-md hover:shadow-2xl"
                  }`}
                >
                  {/* Photo Image */}
                  <img
                    src={photo.public_url}
                    alt={photo.filename || folder?.name || "Decoration photo"}
                    className="w-full h-auto block object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Checkbox Trigger (Top-Right): Always allows toggling selection */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePhotoSelection(photo.id);
                    }}
                    className={`absolute top-3 right-3 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                      isSelected
                        ? "bg-[#C59350] text-[#12100E] ring-2 ring-white/80 scale-110"
                        : isSelectionMode
                        ? "bg-black/60 text-white/70 border border-white/40 hover:bg-black/90 hover:scale-105"
                        : "bg-black/40 text-white/50 border border-white/20 opacity-0 group-hover:opacity-100 hover:bg-black/80"
                    }`}
                    title={isSelected ? "Unselect this decoration" : "Select this decoration"}
                  >
                    {isSelected ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full border border-white/70" />
                    )}
                  </button>

                  {/* Category Pill (Top-Left) */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded-full bg-black/70 text-[#EED9B9] backdrop-blur-md border border-[#C59350]/30 shadow-md">
                      {folder?.name || "Decoration"}
                    </span>
                  </div>

                  {/* Hover Glass Overlay (Only when not in selection mode) */}
                  {!isSelectionMode && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#FAF8F5] font-serif tracking-wide drop-shadow-md">
                          View Full Details
                        </span>
                        <div className="p-2 rounded-full bg-[#C59350] text-[#12100E] shadow-lg">
                          <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Selection Banner when Selected */}
                  {isSelected && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#C59350]/90 via-[#C59350]/40 to-transparent p-3 pt-6 flex items-center justify-between text-[#12100E] font-medium text-xs">
                      <span className="font-semibold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        Selected for Inquiry
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Floating Bottom Selection Dock (Cross-Folder Shortlist & Dispatch) */}
      <ShowcaseSelectionDock
        selectedPhotos={selectedPhotos}
        folders={folders}
        onRemovePhoto={removePhotoFromSelection}
        onClearAll={clearAllSelection}
      />

      {/* 4. Fullscreen Lightbox with Selection Toggle */}
      <ShowcaseLightbox
        photos={filteredPhotos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        folders={folders}
        selectedPhotoIds={selectedPhotoIds}
        onToggleSelectPhoto={togglePhotoSelection}
      />
    </div>
  );
}
