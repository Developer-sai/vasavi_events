"use client";

import React from "react";
import { Photo } from "@/types";
import { Maximize2, Image as ImageIcon } from "lucide-react";

interface MasonryGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

export function MasonryGrid({ photos, onPhotoClick }: MasonryGridProps) {
  if (photos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex p-4 rounded-full bg-[#EBE6DF]/50 text-[#C59350] mb-4">
          <ImageIcon className="w-8 h-8 stroke-1" />
        </div>
        <h3 className="font-serif text-2xl text-[#1A1714]">No Photos in This Folder</h3>
        <p className="text-xs text-[#7A6F64] mt-1 max-w-sm mx-auto">
          No photos have been added to this collection yet. Check back soon or select "All".
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 [column-fill:_balance]">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => onPhotoClick(index)}
            className="relative group mb-3 sm:mb-4 break-inside-avoid overflow-hidden rounded-2xl cursor-pointer bg-[#FAF8F5] border border-[#EBE6DF] shadow-xs hover:shadow-xl transition-all duration-300"
          >
            {/* Photo Image - renders immediately with natural aspect ratio */}
            <img
              src={photo.public_url}
              alt={photo.filename || `Photo ${index + 1}`}
              className="w-full h-auto block object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />

            {/* Haute-Couture Hover Glass Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 pointer-events-none">
              <div className="self-end p-2 rounded-full bg-black/60 text-[#C59350] backdrop-blur-md shadow-md transform translate-y-1 group-hover:translate-y-0 transition-transform">
                <Maximize2 className="w-4 h-4" />
              </div>
              {photo.filename && (
                <div className="bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg self-start">
                  <span className="text-[11px] text-[#FAF8F5] truncate font-sans">
                    {photo.filename}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
