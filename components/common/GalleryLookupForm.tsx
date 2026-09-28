"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

export function GalleryLookupForm() {
  const router = useRouter();
  const [slugInput, setSlugInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slugInput.trim()) return;

    let clean = slugInput.trim();
    if (clean.includes("/gallery/")) {
      clean = clean.split("/gallery/")[1];
    }
    clean = clean.replace(/[^a-zA-Z0-9-_]/g, "").toLowerCase();

    if (clean) {
      router.push(`/gallery/${clean}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center bg-[#1A1714] border border-[#262320] focus-within:border-[#C59350] rounded-2xl p-1.5 shadow-2xl transition group">
        <Search className="w-4 h-4 text-[#7A6F64] ml-3 shrink-0 group-focus-within:text-[#C59350] transition" />
        <input
          type="text"
          value={slugInput}
          onChange={(e) => setSlugInput(e.target.value)}
          placeholder="Enter celebration code or link (e.g. arjun-weds-priya)"
          className="w-full bg-transparent text-xs sm:text-sm text-[#FAF8F5] placeholder-[#7A6F64] px-3 py-2.5 outline-none font-sans"
        />
        <button
          type="submit"
          className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C59350] to-[#D1A870] hover:brightness-110 text-[#12100E] font-medium text-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>View Album</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-[11px] text-[#FAF8F5]/40 mt-2 font-sans font-light">
        Guests: Paste your invitation link or event slug to open your private album
      </p>
    </form>
  );
}
