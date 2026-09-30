"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import { Photo, Folder } from "@/types";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Play,
  Pause,
  Maximize,
  Minimize,
  MessageCircle,
  Share2,
  Check,
  Plus,
} from "lucide-react";

interface ShowcaseLightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  folders?: Folder[];
  selectedPhotoIds?: string[];
  onToggleSelectPhoto?: (photoId: string) => void;
}

export function ShowcaseLightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  folders = [],
  selectedPhotoIds = [],
  onToggleSelectPhoto,
}: ShowcaseLightboxProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const currentPhoto = photos[currentIndex];
  const currentFolder = folders.find((f) => f.id === currentPhoto?.folder_id);
  const folderName = currentFolder?.name || "Event Decoration";

  const handleNext = useCallback(() => {
    if (photos.length === 0) return;
    onNavigate((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  const handlePrev = useCallback(() => {
    if (photos.length === 0) return;
    onNavigate((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Slideshow interval
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3500);
    return () => clearInterval(timer);
  }, [isOpen, isPlaying, handleNext]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleWhatsAppEnquiry = () => {
    if (!currentPhoto) return;
    const message = `Hi Vasavi Events! ✨ I saw this ${folderName} setup on your portfolio and I love the decoration.\n\nCould you please share details, pricing and availability for an upcoming event?\n${currentPhoto.public_url}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (!isOpen || !currentPhoto) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#12100E]/95 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-b from-black/80 to-transparent z-30">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-[#C59350]/20 text-[#C59350] border border-[#C59350]/40">
            {folderName}
          </span>
          <span className="text-xs text-[#FAF8F5]/60 font-mono">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Select / Shortlist Button */}
          {onToggleSelectPhoto && currentPhoto && (
            <button
              onClick={() => onToggleSelectPhoto(currentPhoto.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                selectedPhotoIds.includes(currentPhoto.id)
                  ? "bg-[#C59350] text-[#12100E] shadow-sm"
                  : "bg-white/10 hover:bg-white/20 text-[#FAF8F5] border border-white/20"
              }`}
              title={
                selectedPhotoIds.includes(currentPhoto.id)
                  ? "Remove from selected shortlist"
                  : "Add to multi-photo inquiry shortlist"
              }
            >
              {selectedPhotoIds.includes(currentPhoto.id) ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Selected</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Select</span>
                </>
              )}
            </button>
          )}

          {/* WhatsApp Enquiry Button */}
          <button
            onClick={handleWhatsAppEnquiry}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-lg"
            title="Enquire on WhatsApp for this Decor"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span className="hidden sm:inline">Enquire on WhatsApp</span>
          </button>

          {/* Slideshow Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-full transition ${
              isPlaying
                ? "bg-[#C59350] text-[#12100E]"
                : "text-[#FAF8F5]/80 hover:text-white hover:bg-white/10"
            }`}
            title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-[#FAF8F5]/80 hover:text-white hover:bg-white/10 rounded-full transition hidden sm:inline-flex"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Download Button */}
          <a
            href={currentPhoto.public_url}
            download={currentPhoto.filename || "vasavi-events-decor.jpg"}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#FAF8F5]/80 hover:text-white hover:bg-white/10 rounded-full transition"
            title="Download Photo"
          >
            <Download className="w-4 h-4" />
          </a>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-[#FAF8F5]/80 hover:text-white hover:bg-white/10 rounded-full transition ml-1"
            title="Close Lightbox (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Area with Prev/Next buttons */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Prev Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 z-20 p-3 text-[#FAF8F5]/70 hover:text-white bg-black/40 hover:bg-black/70 rounded-full backdrop-blur-xs transition"
          aria-label="Previous decoration photo"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* The Photo */}
        <div className="relative max-w-full max-h-[80vh] flex items-center justify-center">
          <img
            key={currentPhoto.id}
            src={currentPhoto.public_url}
            alt={currentPhoto.filename || folderName}
            className="max-h-[78vh] max-w-[94vw] object-contain shadow-2xl rounded-lg transition-all duration-300"
          />
        </div>

        {/* Next Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 z-20 p-3 text-[#FAF8F5]/70 hover:text-white bg-black/40 hover:bg-black/70 rounded-full backdrop-blur-xs transition"
          aria-label="Next decoration photo"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Bottom Filmstrip Thumbnails */}
      <div className="px-6 py-3 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center">
        <div className="flex items-center gap-2 overflow-x-auto max-w-2xl py-1 no-scrollbar">
          {photos.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => onNavigate(idx)}
              className={`relative shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition ${
                idx === currentIndex
                  ? "border-[#C59350] scale-105 opacity-100 ring-2 ring-[#C59350]/50"
                  : "border-transparent opacity-40 hover:opacity-80"
              }`}
            >
              <img
                src={photo.public_url}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
