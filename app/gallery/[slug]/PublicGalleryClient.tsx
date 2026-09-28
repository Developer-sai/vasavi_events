"use client";

import React, { useState, useMemo } from "react";
import { EventItem } from "@/types";
import { GalleryHero } from "@/components/gallery/GalleryHero";
import { FolderTabs } from "@/components/gallery/FolderTabs";
import { MasonryGrid } from "@/components/gallery/MasonryGrid";
import { Lightbox } from "@/components/gallery/Lightbox";
import { ShareModal } from "@/components/gallery/ShareModal";

interface PublicGalleryClientProps {
  initialEvent: EventItem;
}

export function PublicGalleryClient({ initialEvent }: PublicGalleryClientProps) {
  const [event] = useState<EventItem>(initialEvent);
  const [activeFolderId, setActiveFolderId] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);

  // All photos array
  const allPhotos = useMemo(() => event.photos || [], [event.photos]);

  // Filtered photos based on active tab
  const displayedPhotos = useMemo(() => {
    if (activeFolderId === "all") {
      return allPhotos;
    }
    return allPhotos.filter((p) => p.folder_id === activeFolderId);
  }, [allPhotos, activeFolderId]);

  const handleOpenPhoto = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const handleStartSlideshow = () => {
    if (displayedPhotos.length > 0) {
      setCurrentPhotoIndex(0);
      setLightboxOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* 1. Hero Masthead (Regal Gold / Dark banner) */}
      <GalleryHero event={event} />

      {/* 2. Folder Navigation Bar (Sticky with All Photos + Subbu's Folders) */}
      <FolderTabs
        folders={event.folders || []}
        activeFolderId={activeFolderId}
        onSelectFolder={setActiveFolderId}
        totalPhotosCount={allPhotos.length}
        eventName={event.name}
        eventDate={event.event_date}
        onOpenShare={() => setShareModalOpen(true)}
        onStartSlideshow={handleStartSlideshow}
      />

      {/* 3. Fluid Responsive Masonry Photo Grid */}
      <main className="flex-1">
        <MasonryGrid
          photos={displayedPhotos}
          onPhotoClick={handleOpenPhoto}
        />
      </main>

      {/* 4. Elegant Minimal Footer */}
      <footer className="py-10 border-t border-[#EBE6DF] bg-white text-center text-xs text-[#7A6F64]">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-serif tracking-widest uppercase text-sm text-[#1A1714] font-medium mb-1">
            Vasavi Events
          </p>
          <p className="text-[11px] text-[#A69C90]">
            Crafting and delivering timeless celebration memories for Subbu & clients.
          </p>
          <div className="mt-3 text-[10px] text-[#C59350] tracking-wider uppercase">
            Powered by Vasavi Events Digital Memories
          </div>
        </div>
      </footer>

      {/* 5. Lightbox Modal */}
      <Lightbox
        photos={displayedPhotos}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentPhotoIndex}
        folders={event.folders}
      />

      {/* 6. Share & QR Code Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        eventTitle={event.name}
        slug={event.public_slug}
      />
    </div>
  );
}
