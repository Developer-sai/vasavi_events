"use client";

import React from "react";
import { Folder } from "@/types";
import { Heart, Share2, Play } from "lucide-react";

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
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <div className="sticky top-0 z-30 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EBE6DF] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Left Metadata Branding */}
          <div className="flex items-center gap-3 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm tracking-[0.16em] uppercase font-bold text-[#1A1714]">
                  {eventName.replace(/\s+/g, "_")}
                </span>
                <span className="text-[11px] font-sans font-medium text-[#7A6F64] tracking-wider">
                  {eventDate}
                </span>
              </div>
              <div className="text-[9px] tracking-[0.25em] uppercase font-sans text-[#C59350] font-semibold">
                VASAVI_EVENTS
              </div>
            </div>
          </div>

          {/* Center: Horizontal Folder Navigation */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
            {/* All Photos tab */}
            <button
              onClick={() => onSelectFolder("all")}
              className={`shrink-0 px-3 py-1.5 rounded-full font-sans tracking-[0.12em] uppercase text-[11px] font-semibold transition-all ${
                activeFolderId === "all"
                  ? "bg-[#1A1714] text-[#FAF8F5] shadow-xs"
                  : "text-[#7A6F64] hover:text-[#1A1714] hover:bg-black/5"
              }`}
            >
              All Photos ({totalPhotosCount})
            </button>

            {/* Individual Folders */}
            {folders.map((folder) => {
              const isActive = activeFolderId === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() => onSelectFolder(folder.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full font-sans tracking-[0.12em] uppercase text-[11px] font-semibold transition-all ${
                    isActive
                      ? "bg-[#1A1714] text-[#FAF8F5] shadow-xs"
                      : "text-[#7A6F64] hover:text-[#1A1714] hover:bg-black/5"
                  }`}
                >
                  {folder.name}
                  {folder.photo_count !== undefined && folder.photo_count > 0 && (
                    <span className="ml-1 opacity-70">({folder.photo_count})</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 shrink-0 justify-end">
            {/* Favorite / Heart */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full border border-[#EBE6DF] hover:bg-black/5 transition ${
                isLiked ? "text-rose-500 fill-rose-500 border-rose-200" : "text-[#7A6F64]"
              }`}
              title="Add to Favorites"
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
            </button>

            {/* Share */}
            <button
              onClick={onOpenShare}
              className="p-2 rounded-full border border-[#EBE6DF] text-[#7A6F64] hover:text-[#1A1714] hover:bg-black/5 transition"
              title="Share Gallery"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Slideshow */}
            <button
              onClick={onStartSlideshow}
              className="p-2 rounded-full border border-[#EBE6DF] text-[#7A6F64] hover:text-[#1A1714] hover:bg-black/5 transition"
              title="Play Slideshow"
            >
              <Play className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
