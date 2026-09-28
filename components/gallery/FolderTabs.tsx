"use client";

import React, { useState } from "react";
import { Folder } from "@/types";
import { Heart, Share2, Play, Sparkles } from "lucide-react";

interface FolderTabsProps {
  folders: Folder[];
  activeFolderId: string;
  onSelectFolder: (id: string) => void;
  totalPhotosCount: number;
  eventName: string;
  eventDate: string;
  onOpenShare: () => void;
  onStartSlideshow: () => void;
}

export function FolderTabs({
  folders,
  activeFolderId,
  onSelectFolder,
  totalPhotosCount,
  eventName,
  eventDate,
  onOpenShare,
  onStartSlideshow,
}: FolderTabsProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="sticky top-4 z-30 w-full max-w-7xl mx-auto px-3 sm:px-6 my-2">
      <div className="bg-white/95 backdrop-blur-md border border-[#EBE6DF] shadow-md rounded-2xl px-4 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Left: Event Quick Title & Total Memories */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#C59350] animate-pulse" />
          <span className="font-serif text-sm font-semibold tracking-wider text-[#1A1714] truncate max-w-[200px]">
            {eventName}
          </span>
          <span className="text-[11px] font-sans text-[#8E8478] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#EBE6DF]">
            {totalPhotosCount} Memories
          </span>
        </div>

        {/* Center: Horizontal Folder Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {/* All Photos pill */}
          <button
            onClick={() => onSelectFolder("all")}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl font-sans tracking-wider uppercase text-[11px] font-semibold transition-all ${
              activeFolderId === "all"
                ? "bg-[#1A1714] text-[#FAF8F5] shadow-xs"
                : "text-[#7A6F64] hover:text-[#1A1714] hover:bg-[#FAF8F5]"
            }`}
          >
            All ({totalPhotosCount})
          </button>

          {/* Individual Ceremony Folders */}
          {folders.map((folder) => {
            const isActive = activeFolderId === folder.id;
            return (
              <button
                key={folder.id}
                onClick={() => onSelectFolder(folder.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl font-sans tracking-wider uppercase text-[11px] font-semibold transition-all ${
                  isActive
                    ? "bg-[#1A1714] text-[#FAF8F5] shadow-xs"
                    : "text-[#7A6F64] hover:text-[#1A1714] hover:bg-[#FAF8F5]"
                }`}
              >
                {folder.name}
                {folder.photo_count !== undefined && folder.photo_count > 0 && (
                  <span className="ml-1 opacity-60">({folder.photo_count})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Guest Interaction Icons */}
        <div className="flex items-center gap-1.5 shrink-0 justify-end">
          {/* Favorite Heart */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-xl border border-[#EBE6DF] hover:bg-[#FAF8F5] transition ${
              isLiked ? "text-rose-500 fill-rose-500 border-rose-200" : "text-[#7A6F64]"
            }`}
            title="Favorite Gallery"
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
          </button>

          {/* Share Modal Trigger */}
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EBE6DF] hover:bg-[#FAF8F5] text-[#1A1714] text-xs font-medium transition"
            title="Share with Family"
          >
            <Share2 className="w-3.5 h-3.5 text-[#C59350]" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Slideshow Trigger */}
          <button
            onClick={onStartSlideshow}
            className="p-2 rounded-xl bg-[#1A1714] hover:bg-[#262320] text-[#FAF8F5] transition"
            title="Play Fullscreen Slideshow"
          >
            <Play className="w-3.5 h-3.5 text-[#C59350]" />
          </button>
        </div>

      </div>
    </div>
  );
}
