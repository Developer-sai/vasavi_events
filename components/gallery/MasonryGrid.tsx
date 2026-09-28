"use client";

import React, { useState } from "react";
import { Photo } from "@/types";
import { Maximize2, Image as ImageIcon } from "lucide-react";

interface MasonryGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

export function MasonryGrid({ photos, onPhotoClick }: MasonryGridProps) {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  if (photos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex p-4 rounded-full bg-[#EBE6DF]/50 text-[#C59350] mb-4">
          <ImageIcon className="w-8 h-8 stroke-1" />
        </div>
        <h3 className="font-serif text-2xl text-[#1A1714]">No Photos in This Folder</h3>
        <p className="text-xs text-[#7A6F64] mt-1 max-w-sm mx-auto">
          No photos have been added to this collection yet. Check back soon or select "All Photos".
        </p>
      </div>
    );
  }

  // We group photos into 3 or 4 columns for balanced CSS masonry
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 sm:gap-3 [column-fill:_balance]">
        {photos.map((photo, index) => {
          const isLoaded = loadedImages[photo.id];

          return (
            <div
              key={photo.id}
              onClick={() => onPhotoClick(index)}
              className="relative group mb-2 sm:mb-3 break-inside-avoid overflow-hidden rounded-xs cursor-pointer bg-[#EBE6DF]/30"
            >
              {/* Shimmer placeholder before load */}
              {!isLoaded && (
                <div className="w-full aspect-[3/4] skeleton-shimmer" />
              )}

              {/* Photo Image */}
              <img
                src={photo.public_url}
                alt={photo.filename || `Photo ${index + 1}`}
                loading="lazy"
                onLoad={() =>
                  setLoadedImages((prev) => ({ ...prev, [photo.id]: true }))
                }
                className={`w-full h-auto object-cover transition-all duration-500 ease-out group-hover:scale-[1.02] ${
                  isLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
                }`}
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="p-2.5 rounded-full bg-black/60 text-[#FAF8F5] transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
