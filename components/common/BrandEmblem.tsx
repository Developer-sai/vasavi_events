"use client";

import React from "react";

interface BrandEmblemProps {
  size?: "sm" | "md" | "lg";
  subtitle?: string;
  theme?: "dark" | "light";
}

export function BrandEmblem({
  size = "md",
  subtitle = "DIGITAL MEMORY ARCHIVES",
  theme = "dark",
}: BrandEmblemProps) {
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col items-center justify-center text-center select-none py-4">
      {/* Bespoke Geometric Monogram Crest (Distinct from Golden Promise) */}
      <div className="relative flex items-center justify-center mb-3">
        <div
          className={`relative flex items-center justify-center border transition-all ${
            size === "sm"
              ? "w-10 h-10 rounded-xl"
              : size === "lg"
              ? "w-16 h-16 rounded-2xl"
              : "w-12 h-12 rounded-xl"
          } ${
            isDark
              ? "border-[#C59350]/40 bg-gradient-to-b from-[#1E1A17] to-[#12100E] shadow-lg shadow-black/40"
              : "border-[#C59350]/30 bg-white shadow-xs"
          }`}
        >
          {/* Subtle Inner Border */}
          <div className="absolute inset-1 border border-[#C59350]/20 rounded-lg pointer-events-none" />

          {/* Interlocking Monogram VE Vector */}
          <svg
            viewBox="0 0 40 40"
            className={
              size === "sm"
                ? "w-6 h-6"
                : size === "lg"
                ? "w-10 h-10"
                : "w-7 h-7"
            }
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top delicate crest diamond */}
            <path
              d="M20 4L22.5 8L20 12L17.5 8Z"
              fill="#D1A870"
            />
            {/* Elegant Monogram V */}
            <path
              d="M12 15L20 31L28 15"
              stroke="#D1A870"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Fine Horizontal Accent Bar */}
            <line
              x1="15"
              y1="22"
              x2="25"
              y2="22"
              stroke="#FAF8F5"
              strokeOpacity={isDark ? "0.9" : "0.3"}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Subtle bottom crown dots */}
            <circle cx="20" cy="35" r="1" fill="#C59350" />
          </svg>
        </div>
      </div>

      {/* Brand Title with High-Fashion Editorial Spacing */}
      <h1
        className={`font-serif tracking-[0.28em] uppercase font-light leading-none ${
          isDark
            ? "text-transparent bg-clip-text bg-gradient-to-r from-[#EED9B9] via-[#FAF8F5] to-[#D1A870]"
            : "text-[#1A1714]"
        } ${
          size === "sm"
            ? "text-lg"
            : size === "lg"
            ? "text-3xl md:text-5xl"
            : "text-2xl md:text-3xl"
        }`}
      >
        Vasavi Events
      </h1>

      {/* Clean Minimal Subtitle */}
      <p
        className={`tracking-[0.42em] uppercase text-[9px] md:text-[10px] font-sans mt-2.5 font-medium ${
          isDark ? "text-[#C59350]/80" : "text-[#8E8478]"
        }`}
      >
        {subtitle}
      </p>
    </div>
  );
}
