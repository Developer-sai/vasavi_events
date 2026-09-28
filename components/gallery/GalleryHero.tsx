"use client";

import React from "react";
import { BrandEmblem } from "@/components/common/BrandEmblem";
import { EventItem } from "@/types";
import { formatDate } from "@/lib/utils/format";
import { Calendar, MapPin, Sparkles } from "lucide-react";

interface GalleryHeroProps {
  event: EventItem;
}

export function GalleryHero({ event }: GalleryHeroProps) {
  return (
    <div className="relative w-full min-h-[480px] sm:min-h-[540px] flex items-center justify-center bg-[#12100E] text-[#FAF8F5] overflow-hidden">
      {/* Background Image Layer with Cinematic Vignette */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000 ease-out"
        style={{ backgroundImage: `url(${event.cover_image_url})` }}
      />
      
      {/* Soft Multi-Stop Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#12100E]/70 to-[#12100E]/90" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#12100E]/40 to-[#12100E]" />

      {/* Main Luxury Content Plaque */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center text-center">
        {/* Brand Monogram */}
        <BrandEmblem size="md" subtitle="COLLECTION ARCHIVES" theme="dark" />

        {/* Delicate Golden Accent */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C59350] to-transparent my-3" />

        {/* Event Name */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#FAF8F5] leading-tight drop-shadow-sm">
          {event.name}
        </h1>

        {/* Event Metadata Ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-sans text-[#FAF8F5]/85 mt-4 font-normal">
          <span className="flex items-center gap-1.5 text-[#EED9B9]">
            <Calendar className="w-3.5 h-3.5 text-[#C59350]" />
            {formatDate(event.event_date)}
          </span>
          <span className="text-[#C59350]/60">•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C59350]" />
            {event.customer_names}
          </span>
          <span className="text-[#C59350]/60">•</span>
          <span className="flex items-center gap-1.5 text-[#FAF8F5]/75">
            <MapPin className="w-3.5 h-3.5 text-[#C59350]" />
            Vasavi Events
          </span>
        </div>

        {/* Welcoming Subtitle */}
        {event.description && (
          <p className="max-w-xl text-xs sm:text-sm font-serif italic text-[#FAF8F5]/75 mt-5 leading-relaxed tracking-wide">
            "{event.description}"
          </p>
        )}
      </div>
    </div>
  );
}
