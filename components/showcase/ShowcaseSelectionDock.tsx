"use client";

import React, { useState } from "react";
import { Photo, Folder } from "@/types";
import {
  MessageCircle,
  Mail,
  Copy,
  Check,
  Trash2,
  X,
  Layers,
  Sparkles,
} from "lucide-react";

interface ShowcaseSelectionDockProps {
  selectedPhotos: Photo[];
  folders: Folder[];
  onRemovePhoto: (photoId: string) => void;
  onClearAll: () => void;
}

export function ShowcaseSelectionDock({
  selectedPhotos,
  folders,
  onRemovePhoto,
  onClearAll,
}: ShowcaseSelectionDockProps) {
  const [copied, setCopied] = useState(false);

  if (selectedPhotos.length === 0) return null;

  // Format message text with categories and high-resolution photo links
  const generateMessageBody = () => {
    const header = `Hi Vasavi Events! I am planning an event and I'm interested in these ${selectedPhotos.length} decoration setup${
      selectedPhotos.length > 1 ? "s" : ""
    } from your showcase:\n\n`;

    const items = selectedPhotos
      .map((photo, idx) => {
        const folder = folders.find((f) => f.id === photo.folder_id);
        const folderName = folder ? folder.name : "Event Decoration";
        return `${idx + 1}. [${folderName}] - ${photo.public_url}`;
      })
      .join("\n\n");

    const footer = `\n\nCould you please share pricing and availability?`;
    return `${header}${items}${footer}`;
  };

  // WhatsApp Sender
  const handleSendWhatsApp = () => {
    const message = generateMessageBody();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // Email Sender (mailto:)
  const handleSendEmail = () => {
    const subject = `Event Decoration Inquiry (${selectedPhotos.length} Selected Setups) — Vasavi Events`;
    const body = generateMessageBody();
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  // Copy to Clipboard
  const handleCopyLinks = async () => {
    try {
      await navigator.clipboard.writeText(generateMessageBody());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl animate-in slide-in-from-bottom-6 duration-300">
      <div className="bg-[#1A1714]/95 backdrop-blur-xl border border-[#C59350]/40 rounded-3xl p-3 sm:p-4 shadow-2xl text-[#FAF8F5] flex flex-col gap-3">
        {/* Top Row: Counter, Mini Thumbnails (with individual delete 'x'), Clear All */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#262320]">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#C59350] text-[#12100E] font-bold text-xs">
              {selectedPhotos.length}
            </span>
            <span className="font-serif text-sm sm:text-base font-medium text-[#FAF8F5]">
              Decoration{selectedPhotos.length > 1 ? "s" : ""} Selected
            </span>
            <span className="text-[11px] text-[#C59350] hidden md:inline-block">
              (Ready to send to WhatsApp or Email)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLinks}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#FAF8F5]/80 hover:text-white transition cursor-pointer border border-white/10"
              title="Copy details & links to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#C59350]" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={onClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs text-rose-300 hover:text-rose-200 transition cursor-pointer border border-rose-500/20"
              title="Unselect all photos"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Selected Photos Scroll Strip: Individual one-by-one delete */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {selectedPhotos.map((photo) => {
            const folder = folders.find((f) => f.id === photo.folder_id);

            return (
              <div
                key={photo.id}
                className="relative group shrink-0 w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden border-2 border-[#C59350]/60 bg-black/40 shadow-md"
              >
                <img
                  src={photo.public_url}
                  alt=""
                  className="w-full h-full object-cover"
                />

                {/* Individual remove button 'X' */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemovePhoto(photo.id);
                  }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 hover:bg-rose-600 text-white flex items-center justify-center transition cursor-pointer shadow-md"
                  title="Remove this photo from selection"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Category label tooltip on hover */}
                {folder && (
                  <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-[#EED9B9] px-1 py-0.5 truncate text-center font-mono">
                    {folder.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Row: Instant Dispatch Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          <p className="text-[11px] text-[#FAF8F5]/60 font-light hidden sm:block">
            💡 Send all {selectedPhotos.length} setups in one message with photos &amp; categories.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* WhatsApp Send Button */}
            <button
              onClick={handleSendWhatsApp}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-wider transition shadow-lg cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span>Send to WhatsApp ({selectedPhotos.length})</span>
            </button>

            {/* Email Send Button */}
            <button
              onClick={handleSendEmail}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C59350] to-[#D1A870] hover:brightness-110 text-[#12100E] text-xs font-semibold uppercase tracking-wider transition shadow-lg cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Send via Email ({selectedPhotos.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
