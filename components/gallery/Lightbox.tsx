"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Photo, Folder } from "@/types";
import { X, ChevronLeft, ChevronRight, Download, Play, Pause, Maximize, Minimize } from "lucide-react";

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  folders?: Folder[];
}

export function Lightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  folders,
}: LightboxProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const currentPhoto = photos[currentIndex];
  const currentFolder = folders?.find((f) => f.id === currentPhoto?.folder_id);

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
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen || !currentPhoto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0e0c0b]/98 backdrop-blur-md select-none animate-fade-in"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#C59350]">
            {currentFolder?.name || "All Photos"}
          </span>
          <span className="text-xs font-mono text-[#FAF8F5]/60">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Slideshow Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2.5 rounded-full transition ${
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
            className="p-2.5 text-[#FAF8F5]/80 hover:text-white hover:bg-white/10 rounded-full transition hidden sm:inline-flex"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>

          {/* Download Button */}
          <a
            href={currentPhoto.public_url}
            download={currentPhoto.filename}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 text-[#FAF8F5]/80 hover:text-white hover:bg-white/10 rounded-full transition"
            title="Download Full Resolution"
          >
            <Download className="w-4 h-4" />
          </a>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2.5 text-[#FAF8F5]/80 hover:text-white hover:bg-white/10 rounded-full transition ml-2"
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
          className="absolute left-3 sm:left-6 z-20 p-3 text-[#FAF8F5]/70 hover:text-white bg-black/30 hover:bg-black/60 rounded-full backdrop-blur-xs transition"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* The Photo */}
        <div className="relative max-w-full max-h-[80vh] flex items-center justify-center">
          <img
            key={currentPhoto.id}
            src={currentPhoto.public_url}
            alt={currentPhoto.filename}
            className="max-h-[78vh] max-w-[94vw] object-contain shadow-2xl rounded-sm transition-all duration-300"
          />
        </div>

        {/* Next Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 z-20 p-3 text-[#FAF8F5]/70 hover:text-white bg-black/30 hover:bg-black/60 rounded-full backdrop-blur-xs transition"
          aria-label="Next photo"
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
              className={`relative shrink-0 w-12 h-12 rounded-sm overflow-hidden border-2 transition ${
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
