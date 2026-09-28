"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { slugify } from "@/lib/utils/slugify";
import { createEventAction, createFolderAction } from "@/actions/events";
import {
  CalendarHeart,
  Sparkles,
  Link as LinkIcon,
  Clock,
  ArrowRight,
  Image as ImageIcon,
  Check,
} from "lucide-react";

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

export default function NewEventPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [customerNames, setCustomerNames] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState(COVER_PRESETS[0].url);
  const [slug, setSlug] = useState("");
  const [slugModified, setSlugModified] = useState(false);
  const [expiryOption, setExpiryOption] = useState<"never" | "custom">("never");
  const [expiryDate, setExpiryDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!slugModified) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    const finalSlug = slug.trim() ? slug : slugify(name);
    const expiresAt = expiryOption === "custom" && expiryDate ? new Date(expiryDate).toISOString() : null;

    try {
      const created = await createEventAction({
        name,
        customer_names: customerNames || name,
        event_type: eventType,
        event_date: eventDate,
        description,
        cover_image_url: coverUrl,
        public_slug: finalSlug,
        expires_at: expiresAt,
        is_published: true,
      });

      // Populate default ceremonial folders
      const defaultFolders = [
        "Wedding Highlights",
        "Couple Shoot",
        "Engagement",
        "Haldhi",
        "Reception",
      ];

      for (const fName of defaultFolders) {
        await createFolderAction(created.id, fName);
      }

      router.push(`/admin/events/${created.id}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF8F5]">
      <AdminHeader
        title="Create New Event Gallery"
        subtitle="Set up event details, public share slug, and ceremonial folders."
      />

      <div className="p-6 max-w-4xl w-full mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Basic Details */}
          <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#1A1714] flex items-center gap-2">
              <CalendarHeart className="w-5 h-5 text-[#C59350]" />
              Event & Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#7A6F64] uppercase tracking-wider mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Wedding Celebration"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full text-sm bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-4 py-2.5 outline-none focus:border-[#C59350] transition font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#7A6F64] uppercase tracking-wider mb-1">
                  Couple / Customer Names
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ananya & Siddharth"
                  value={customerNames}
                  onChange={(e) => setCustomerNames(e.target.value)}
                  className="w-full text-sm bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-4 py-2.5 outline-none focus:border-[#C59350] transition font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#7A6F64] uppercase tracking-wider mb-1">
                  Event Category
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full text-sm bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-4 py-2.5 outline-none focus:border-[#C59350] transition font-sans"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Haldi">Haldi / Sangeet</option>
                  <option value="Reception">Reception</option>
                  <option value="Birthday Shoot">Birthday Shoot</option>
                  <option value="Half Saree Ceremony">Half Saree Ceremony</option>
                  <option value="Couple Shoot">Couple Shoot</option>
                  <option value="Engagement Teasers">Engagement Teasers</option>
                  <option value="Other">Other Celebration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#7A6F64] uppercase tracking-wider mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full text-sm bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-4 py-2.5 outline-none focus:border-[#C59350] transition font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#7A6F64] uppercase tracking-wider mb-1">
                Event Description / Welcoming Note
              </label>
              <textarea
                rows={2}
                placeholder="A warm greeting to be displayed on top of the gallery for friends and family..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-4 py-2.5 outline-none focus:border-[#C59350] transition font-sans"
              />
            </div>
          </div>

          {/* 2. Cover Photo Selection */}
          <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#1A1714] flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#C59350]" />
              Cover Image Selection
            </h3>

            <p className="text-xs text-[#7A6F64]">
              Pick from our luxury South Indian wedding presets or paste an image URL:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {COVER_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setCoverUrl(preset.url)}
                  className={`relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                    coverUrl === preset.url
                      ? "border-[#C59350] ring-2 ring-[#C59350]/30"
                      : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-full object-cover"
                  />
                  {coverUrl === preset.url && (
                    <div className="absolute top-2 right-2 p-1 rounded-full bg-[#C59350] text-[#12100E]">
                      <Check className="w-3 h-3 stroke-3" />
                    </div>
                  )}
                  <span className="absolute bottom-1.5 left-2 text-[10px] text-white font-medium drop-shadow-md truncate">
                    {preset.label}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#7A6F64] uppercase tracking-wider mb-1">
                Custom Cover URL
              </label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-4 py-2 outline-none focus:border-[#C59350] transition"
              />
            </div>
          </div>

          {/* 3. Public Slug & Expiry */}
          <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-medium text-[#1A1714] flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-[#C59350]" />
              Public URL Slug & Expiry Settings
            </h3>

            <div>
              <label className="block text-xs font-medium text-[#7A6F64] uppercase tracking-wider mb-1">
                Shareable Link Slug
              </label>
              <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-3 py-2">
                <span className="text-xs text-[#7A6F64] font-mono shrink-0">
                  /gallery/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugModified(true);
                  }}
                  placeholder="royal-wedding-celebration"
                  className="w-full text-xs font-mono bg-transparent outline-none text-[#1A1714]"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-[#7A6F64] uppercase tracking-wider mb-2">
                Link Expiration
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                    expiryOption === "never"
                      ? "border-[#C59350] bg-[#C59350]/5"
                      : "border-[#EBE6DF] bg-[#FAF8F5]"
                  }`}
                >
                  <input
                    type="radio"
                    name="expiry"
                    checked={expiryOption === "never"}
                    onChange={() => setExpiryOption("never")}
                    className="accent-[#C59350]"
                  />
                  <div>
                    <span className="text-xs font-medium text-[#1A1714] block">
                      Never Expires
                    </span>
                    <span className="text-[10px] text-[#7A6F64]">
                      Permanent lifetime access for the family
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                    expiryOption === "custom"
                      ? "border-[#C59350] bg-[#C59350]/5"
                      : "border-[#EBE6DF] bg-[#FAF8F5]"
                  }`}
                >
                  <input
                    type="radio"
                    name="expiry"
                    checked={expiryOption === "custom"}
                    onChange={() => setExpiryOption("custom")}
                    className="accent-[#C59350]"
                  />
                  <div>
                    <span className="text-xs font-medium text-[#1A1714] block">
                      Custom Expiry Date
                    </span>
                    <span className="text-[10px] text-[#7A6F64]">
                      Gallery automatically closes after this date
                    </span>
                  </div>
                </label>
              </div>

              {expiryOption === "custom" && (
                <div className="mt-3">
                  <input
                    type="datetime-local"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required={expiryOption === "custom"}
                    className="w-full sm:w-72 text-xs bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl px-4 py-2 outline-none focus:border-[#C59350] transition"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl border border-[#EBE6DF] hover:bg-white text-xs font-medium text-[#7A6F64] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1A1714] hover:bg-[#262320] text-xs font-medium text-[#FAF8F5] transition disabled:opacity-50 cursor-pointer shadow-md"
            >
              {isSubmitting ? (
                <span>Creating Gallery Studio...</span>
              ) : (
                <>
                  <span>Create & Launch Studio</span>
                  <ArrowRight className="w-4 h-4 text-[#C59350]" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
