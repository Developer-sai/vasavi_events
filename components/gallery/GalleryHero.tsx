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
    <div className="relative w-full bg-[#12100E] text-[#FAF8F5] overflow-hidden border-b border-[#262320]">
      {/* Background Ambience Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity filter blur-xs"
        style={{ backgroundImage: `url(${event.cover_image_url})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#12100E]/70 via-[#12100E]/90 to-[#12100E]" />

      {/* Main Luxury Brand Masthead */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 flex flex-col items-center justify-center text-center">
        {/* Emblem */}
        <BrandEmblem size="lg" subtitle="PHOTOGRAPHY & MEMORIES" theme="dark" />

        {/* Divider hairline */}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C59350] to-transparent my-4" />

        {/* Couple / Event Title */}
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide text-[#FAF8F5] mt-2">
          {event.name}
        </h2>

        {/* Customer Names & Subtext */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-sans text-[#FAF8F5]/80 mt-3 font-medium">
          <span className="flex items-center gap-1.5 text-[#C59350]">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(event.event_date)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D1A870]" />
            {event.customer_names}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-[#FAF8F5]/70">
            <MapPin className="w-3.5 h-3.5 text-[#C59350]" />
            Vasavi Kalyana Mandapam
          </span>
        </div>

        {event.description && (
          <p className="max-w-2xl text-xs sm:text-sm font-serif italic text-[#FAF8F5]/70 mt-4 leading-relaxed">
            "{event.description}"
          </p>
        )}
      </div>
    </div>
  );
}
