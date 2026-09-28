"use client";

import React, { useState, useEffect } from "react";
import { EventItem } from "@/types";
import { updateEventAction } from "@/actions/events";
import {
  X,
  Sparkles,
  CalendarHeart,
  Link as LinkIcon,
  Clock,
  Image as ImageIcon,
  Check,
  Save,
  Globe,
  EyeOff,
  Trash2,
} from "lucide-react";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem;
  onSaved: (updated: EventItem) => void;
}

const COVER_PRESETS = [
  {
    label: "South Indian Mandap",
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=85",
  },
  {
    label: "Royal Palace Arch",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85",
  },
  {
    label: "Marigold Yellow Haldi",
    url: "https://images.unsplash.com/photo-1609151162377-794fa6ec9a3f?auto=format&fit=crop&w=1920&q=85",
  },
  {
    label: "Sunset Couple Portrait",
    url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1920&q=85",
  },
];

const EVENT_TYPES = [
  "Wedding",
  "Engagement",
  "Haldi",
  "Reception",
  "Sangeet",
  "Pre-Wedding",
  "Birthday",
  "Corporate",
  "Celebration",
];

export function EditEventModal({
  isOpen,
  onClose,
  event,
  onSaved,
}: EditEventModalProps) {
  const [name, setName] = useState(event.name);
  const [customerNames, setCustomerNames] = useState(event.customer_names);
  const [eventType, setEventType] = useState(event.event_type || "Wedding");
  const [eventDate, setEventDate] = useState(
    event.event_date ? event.event_date.split("T")[0] : ""
  );
  const [description, setDescription] = useState(event.description || "");
  const [publicSlug, setPublicSlug] = useState(event.public_slug);
  const [hasCoverPhoto, setHasCoverPhoto] = useState(
    Boolean(event.cover_image_url && event.cover_image_url.trim().length > 0)
  );
  const [coverUrl, setCoverUrl] = useState(
    event.cover_image_url || COVER_PRESETS[0].url
  );
  const [isPublished, setIsPublished] = useState(event.is_published ?? true);
  const [expiryOption, setExpiryOption] = useState<"never" | "custom">(
    event.expires_at ? "custom" : "never"
  );
  const [expiryDate, setExpiryDate] = useState(
    event.expires_at ? event.expires_at.split("T")[0] : ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync state whenever modal opens or event prop changes
  useEffect(() => {
    if (isOpen) {
      setName(event.name);
      setCustomerNames(event.customer_names);
      setEventType(event.event_type || "Wedding");
      setEventDate(event.event_date ? event.event_date.split("T")[0] : "");
      setDescription(event.description || "");
      setPublicSlug(event.public_slug);
      const hasCover = Boolean(
        event.cover_image_url && event.cover_image_url.trim().length > 0
      );
      setHasCoverPhoto(hasCover);
      setCoverUrl(hasCover ? event.cover_image_url : COVER_PRESETS[0].url);
      setIsPublished(event.is_published ?? true);
      setExpiryOption(event.expires_at ? "custom" : "never");
      setExpiryDate(event.expires_at ? event.expires_at.split("T")[0] : "");
      setErrorMsg("");
    }
  }, [isOpen, event]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Event title is required");
      return;
    }
    if (!publicSlug.trim()) {
      setErrorMsg("Public celebration slug is required");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    const finalCoverUrl = hasCoverPhoto ? coverUrl.trim() : "";
    const finalExpiresAt =
      expiryOption === "custom" && expiryDate
        ? new Date(expiryDate).toISOString()
        : null;

    try {
      const updated = await updateEventAction(event.id, {
        name: name.trim(),
        customer_names: customerNames.trim() || name.trim(),
        event_type: eventType,
        event_date: eventDate,
        description: description.trim(),
        cover_image_url: finalCoverUrl,
        public_slug: publicSlug
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, "-")
          .replace(/^-|-$/g, ""),
        expires_at: finalExpiresAt,
        is_published: isPublished,
      });

      if (updated) {
        onSaved(updated);
        onClose();
      } else {
        setErrorMsg("Failed to update event. Please try again.");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setErrorMsg(err.message || "An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#EBE6DF] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EBE6DF] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C59350]/15 border border-[#C59350]/30 flex items-center justify-center text-[#C59350]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-medium text-[#1A1714]">
                Edit Event Details
              </h2>
              <p className="text-xs text-[#7A6F64]">
                Update ceremony information, celebration slug, and cover styling.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 text-[#7A6F64] hover:text-[#1A1714] rounded-xl hover:bg-black/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* 1. Title & Clients */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1714] mb-1.5">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Wedding Gala"
                  className="w-full text-xs bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#C59350] transition font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1714] mb-1.5">
                  Client / Couple Names *
                </label>
                <input
                  type="text"
                  required
                  value={customerNames}
                  onChange={(e) => setCustomerNames(e.target.value)}
                  placeholder="e.g. Arjun & Priya"
                  className="w-full text-xs bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#C59350] transition font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1714] mb-1.5">
                  Ceremony Category
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full text-xs bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#C59350] transition font-sans"
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1714] mb-1.5">
                  Ceremony Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full text-xs bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#C59350] transition font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1714] mb-1.5">
                Welcome Message / Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A warm congratulatory greeting displayed on the luxury gallery masthead..."
                className="w-full text-xs bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl p-3.5 outline-none focus:border-[#C59350] transition font-sans"
              />
            </div>
          </div>

          {/* 2. Public Slug */}
          <div className="p-4 bg-[#FAF8F5] border border-[#EBE6DF] rounded-2xl space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1714]">
              Public Celebration URL Slug *
            </label>
            <div className="flex items-center">
              <span className="text-xs text-[#7A6F64] bg-white border border-r-0 border-[#EBE6DF] px-3 py-2.5 rounded-l-xl select-none font-mono">
                vasavievents.vercel.app/gallery/
              </span>
              <input
                type="text"
                required
                value={publicSlug}
                onChange={(e) =>
                  setPublicSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]+/g, "-")
                  )
                }
                className="flex-1 text-xs bg-white border border-[#EBE6DF] rounded-r-xl px-3 py-2.5 outline-none focus:border-[#C59350] transition font-mono font-medium text-[#1A1714]"
              />
            </div>
            <p className="text-[11px] text-[#7A6F64]">
              Guests access their photo album directly at this zero-login link.
            </p>
          </div>

          {/* 3. Cover Photo Optionality */}
          <div className="p-4 bg-white border border-[#EBE6DF] rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1714] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#C59350]" />
                  Event Cover Photo
                </h4>
                <p className="text-[11px] text-[#7A6F64]">
                  Optional. When omitted, gallery displays a luxury royal velvet emblem pattern.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHasCoverPhoto(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    !hasCoverPhoto
                      ? "bg-[#1A1714] text-[#FAF8F5]"
                      : "bg-[#FAF8F5] text-[#7A6F64] hover:bg-black/5"
                  }`}
                >
                  No Cover Photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHasCoverPhoto(true);
                    if (!coverUrl) setCoverUrl(COVER_PRESETS[0].url);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    hasCoverPhoto
                      ? "bg-[#C59350] text-[#1A1714]"
                      : "bg-[#FAF8F5] text-[#7A6F64] hover:bg-black/5"
                  }`}
                >
                  Has Cover Photo
                </button>
              </div>
            </div>

            {hasCoverPhoto ? (
              <div className="space-y-3 pt-2 border-t border-[#EBE6DF]">
                {/* Presets Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {COVER_PRESETS.map((p) => {
                    const isSelected = coverUrl === p.url;
                    return (
                      <button
                        type="button"
                        key={p.label}
                        onClick={() => setCoverUrl(p.url)}
                        className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition group text-left ${
                          isSelected
                            ? "border-[#C59350] shadow-sm"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={p.url}
                          alt={p.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 p-1.5 flex flex-col justify-end">
                          <span className="text-[10px] text-white font-medium leading-tight drop-shadow-sm">
                            {p.label}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-[#C59350] text-[#1A1714] rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom URL Input */}
                <div>
                  <label className="block text-[11px] text-[#7A6F64] mb-1">
                    Or enter custom image URL:
                  </label>
                  <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-3.5 py-2 outline-none focus:border-[#C59350] transition font-sans"
                  />
                </div>

                {/* Live Preview */}
                {coverUrl && (
                  <div className="relative rounded-xl overflow-hidden aspect-[21/9] border border-[#EBE6DF]">
                    <img
                      src={coverUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-white">
                      Current Preview
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#1A1714] to-[#262320] border border-[#C59350]/30 text-center">
                <Sparkles className="w-6 h-6 text-[#C59350] mx-auto mb-1.5" />
                <p className="text-xs text-[#FAF8F5] font-serif">
                  Royal Velvet Monogram Backdrop Active
                </p>
                <p className="text-[10px] text-[#C59350] font-sans mt-0.5">
                  Clean, minimalist luxury design with golden typography.
                </p>
              </div>
            )}
          </div>

          {/* 4. Expiry & Published Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Expiry */}
            <div className="p-4 bg-[#FAF8F5] border border-[#EBE6DF] rounded-2xl space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1714]">
                Gallery Expiration
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setExpiryOption("never")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                    expiryOption === "never"
                      ? "bg-[#1A1714] text-white"
                      : "bg-white border border-[#EBE6DF] text-[#7A6F64]"
                  }`}
                >
                  Never
                </button>
                <button
                  type="button"
                  onClick={() => setExpiryOption("custom")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                    expiryOption === "custom"
                      ? "bg-[#1A1714] text-white"
                      : "bg-white border border-[#EBE6DF] text-[#7A6F64]"
                  }`}
                >
                  Set Date
                </button>
              </div>
              {expiryOption === "custom" && (
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full text-xs bg-white border border-[#EBE6DF] rounded-xl px-3 py-2 outline-none focus:border-[#C59350] transition mt-2 font-sans"
                />
              )}
            </div>

            {/* Published Toggle */}
            <div className="p-4 bg-[#FAF8F5] border border-[#EBE6DF] rounded-2xl space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1714]">
                Public Visibility
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublished(true)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                    isPublished
                      ? "bg-emerald-700 text-white"
                      : "bg-white border border-[#EBE6DF] text-[#7A6F64]"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  Published
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublished(false)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                    !isPublished
                      ? "bg-[#1A1714] text-white"
                      : "bg-white border border-[#EBE6DF] text-[#7A6F64]"
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  Draft
                </button>
              </div>
              <p className="text-[10px] text-[#7A6F64] mt-1">
                {isPublished
                  ? "Live & accessible via the celebration link."
                  : "Hidden from public guests."}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#EBE6DF] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-[#EBE6DF] hover:bg-[#FAF8F5] text-xs font-medium text-[#1A1714] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1A1714] hover:bg-[#262320] text-xs font-medium text-[#FAF8F5] transition disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-[#C59350]" />
                  Save Event Details
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
