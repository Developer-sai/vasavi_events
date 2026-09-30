"use client";

import React, { useState } from "react";
import { Folder, Photo } from "@/types";
import { ShowcaseLightbox } from "@/components/showcase/ShowcaseLightbox";
import { Maximize2, Sparkles, MessageCircle, Image as ImageIcon } from "lucide-react";

interface ShowcaseGalleryProps {
  folders: Folder[];
  photos: Photo[];
}

export function ShowcaseGallery({ folders, photos }: ShowcaseGalleryProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Filter photos
  const filteredPhotos =
    selectedFolderId === "all"
      ? photos
      : photos.filter((p) => p.folder_id === selectedFolderId);

  // Active folder object
  const activeFolder = folders.find((f) => f.id === selectedFolderId);

  const handleOpenPhoto = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full">
      {/* 1. Category Filter Tabs Bar (Sticky Luxury Plaque) */}
      <div className="sticky top-16 z-30 max-w-7xl mx-auto px-4 sm:px-6 my-6">
        <div className="bg-[#1A1714]/90 backdrop-blur-md border border-[#262320] rounded-2xl p-2 shadow-xl flex items-center justify-between gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 w-full">
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
        </div>

        {/* Category Description Banner (if active folder has description) */}
        {activeFolder?.description && (
          <div className="mt-3 text-center">
            <p className="text-xs text-[#C59350] font-sans tracking-wide italic">
              ✦ {activeFolder.description}
            </p>
          </div>
        )}
      </div>

      {/* 2. Masonry Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
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

              return (
                <div
                  key={photo.id}
                  onClick={() => handleOpenPhoto(index)}
                  className="relative group mb-4 break-inside-avoid overflow-hidden rounded-2xl cursor-pointer bg-[#1A1714] border border-[#262320] hover:border-[#C59350]/50 shadow-md hover:shadow-2xl transition-all duration-300"
                >
                  {/* Photo Image */}
                  <img
                    src={photo.public_url}
                    alt={photo.filename || folder?.name || "Decoration photo"}
                    className="w-full h-auto block object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Haute-Couture Hover Glass Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
                    {/* Top Category Badge */}
                    <div className="self-start">
                      <span className="text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded-full bg-black/60 text-[#EED9B9] backdrop-blur-md border border-[#C59350]/30">
                        {folder?.name || "Decoration"}
                      </span>
                    </div>

                    {/* Bottom Action Pill */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#FAF8F5] font-serif tracking-wide drop-shadow-md">
                        View Full Details
                      </span>
                      <div className="p-2 rounded-full bg-[#C59350] text-[#12100E] shadow-lg">
                        <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Fullscreen Lightbox */}
      <ShowcaseLightbox
        photos={filteredPhotos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        folders={folders}
      />
    </div>
  );
}
