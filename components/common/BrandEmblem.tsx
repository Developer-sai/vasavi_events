"use client";

import React from "react";

interface BrandEmblemProps {
  size?: "sm" | "md" | "lg";
  subtitle?: string;
  theme?: "dark" | "light";
}

export function BrandEmblem({
  size = "md",
  subtitle = "WEDDING & CELEBRATION MEMORIES",
  theme = "dark",
}: BrandEmblemProps) {
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col items-center justify-center text-center select-none py-6">
      {/* Decorative Gold Emblem Rings */}
      <div className="relative flex items-center justify-center mb-3">
        <svg
          viewBox="0 0 160 80"
          className={
            size === "sm"
              ? "w-24 h-12"
              : size === "lg"
              ? "w-44 h-22"
              : "w-32 h-16"
          }
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Concentric Decorative Arcs */}
          <path
            d="M 10 75 A 70 70 0 0 1 150 75"
            stroke="#D1A870"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />
          <path
            d="M 22 75 A 58 58 0 0 1 138 75"
            stroke="#D1A870"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 32 75 A 48 48 0 0 1 128 75"
            stroke="#C59350"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <path
            d="M 42 75 A 38 38 0 0 1 118 75"
            stroke="#D1A870"
            strokeWidth="1.5"
          />

          {/* Central Ornamental Diamond / Lotus hint */}
          <circle cx="80" cy="36" r="3.5" fill="#D1A870" />
          <circle cx="65" cy="40" r="1.5" fill="#C59350" />
          <circle cx="95" cy="40" r="1.5" fill="#C59350" />
        </svg>
      </div>

      {/* Brand Title */}
      <h1
        className={`font-serif tracking-[0.22em] uppercase font-medium leading-none ${
          isDark
            ? "text-transparent bg-clip-text bg-gradient-to-r from-[#DFBF94] via-[#F4E3C7] to-[#C99C5D]"
            : "text-[#262320]"
        } ${
          size === "sm"
            ? "text-xl"
            : size === "lg"
            ? "text-4xl md:text-5xl"
            : "text-2xl md:text-3xl"
        }`}
      >
        Vasavi Events
      </h1>

      {/* Subtitle */}
      <p
        className={`tracking-[0.38em] uppercase text-[10px] md:text-xs font-sans mt-2 font-medium ${
          isDark ? "text-[#C59350]/90" : "text-[#7A6F64]"
        }`}
      >
        {subtitle}
      </p>
    </div>
  );
}
