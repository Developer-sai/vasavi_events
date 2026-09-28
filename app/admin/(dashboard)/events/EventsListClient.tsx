"use client";

import React, { useState } from "react";
import Link from "next/link";
import { EventItem } from "@/types";
import { formatDate } from "@/lib/utils/format";
import {
  Search,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Calendar,
  FolderTree,
  Image as ImageIcon,
  Eye,
  PlusCircle,
  Edit2,
  Sparkles,
} from "lucide-react";
import { deleteEventAction } from "@/actions/events";
import { EditEventModal } from "@/components/admin/EditEventModal";

interface EventsListClientProps {
  initialEvents: EventItem[];
}

export function EventsListClient({ initialEvents }: EventsListClientProps) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const now = new Date();

  const filteredEvents = events.filter((evt) => {
    const isExpired = evt.expires_at ? new Date(evt.expires_at) < now : false;

    if (filter === "active" && isExpired) return false;
    if (filter === "expired" && !isExpired) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = evt.name.toLowerCase().includes(q);
      const matchCouple = evt.customer_names.toLowerCase().includes(q);
      const matchType = evt.event_type.toLowerCase().includes(q);
      return matchName || matchCouple || matchType;
    }

    return true;
  });

  const handleCopyLink = async (slug: string, id: string) => {
    const url = `${window.location.origin}/gallery/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" and all its photos?`)) {
      return;
    }
    setDeletingId(id);
    await deleteEventAction(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EBE6DF]">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6F64]" />
          <input
            type="text"
            placeholder="Search events or couples..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-[#FAF8F5] border border-[#EBE6DF] rounded-xl pl-9 pr-4 py-2 outline-none focus:border-[#C59350] transition font-sans"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition ${
              filter === "all"
                ? "bg-[#1A1714] text-[#FAF8F5]"
                : "text-[#7A6F64] hover:bg-black/5"
            }`}
          >
            All ({events.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition ${
              filter === "active"
                ? "bg-emerald-800 text-white"
                : "text-[#7A6F64] hover:bg-black/5"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("expired")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition ${
              filter === "expired"
                ? "bg-rose-800 text-white"
                : "text-[#7A6F64] hover:bg-black/5"
            }`}
          >
            Expired
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white border border-[#EBE6DF] rounded-2xl p-16 text-center">
          <h3 className="font-serif text-xl text-[#1A1714]">No Events Found</h3>
          <p className="text-xs text-[#7A6F64] mt-1 max-w-sm mx-auto">
            {search
              ? "Try adjusting your search query."
              : "Create your first wedding or celebratory event to start delivering memories."}
          </p>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[#1A1714] text-xs font-medium text-[#FAF8F5]"
          >
            <PlusCircle className="w-4 h-4 text-[#C59350]" />
            Create Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const isExpired = evt.expires_at ? new Date(evt.expires_at) < now : false;

            return (
              <div
                key={evt.id}
                className="bg-white border border-[#EBE6DF] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Event Cover Photo with Status Tag */}
                  <div className="relative aspect-[16/10] w-full bg-black/5 overflow-hidden">
                    {evt.cover_image_url ? (
                      <img
                        src={evt.cover_image_url}
                        alt={evt.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1A1714] via-[#262320] to-[#12100E] flex flex-col items-center justify-center text-center p-4">
                        <div className="w-10 h-10 rounded-full border border-[#C59350]/40 flex items-center justify-center mb-1.5 bg-[#C59350]/10">
                          <Sparkles className="w-5 h-5 text-[#C59350]" />
                        </div>
                        <span className="font-serif text-sm text-[#FAF8F5] tracking-wide line-clamp-1">{evt.name}</span>
                        <span className="text-[9px] text-[#C59350] tracking-widest uppercase mt-0.5">Vasavi Collection</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-black/60 text-[#FAF8F5] backdrop-blur-xs">
                        {evt.event_type}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[10px] font-sans px-2.5 py-0.5 rounded-full font-medium shadow-xs ${
                          isExpired
                            ? "bg-rose-100 text-rose-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isExpired ? "Expired" : "Active"}
                      </span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5">
                    <h3 className="font-serif text-xl font-medium text-[#1A1714] truncate">
                      {evt.name}
                    </h3>
                    <p className="text-xs text-[#7A6F64] mt-0.5">{evt.customer_names}</p>

                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#EBE6DF] text-center font-mono text-[11px] text-[#7A6F64]">
                      <div className="p-2 rounded-xl bg-[#FAF8F5]">
                        <span className="block font-semibold text-[#1A1714]">
                          {evt.folders?.length || 0}
                        </span>
                        Folders
                      </div>
                      <div className="p-2 rounded-xl bg-[#FAF8F5]">
                        <span className="block font-semibold text-[#1A1714]">
                          {evt.photos?.length || 0}
                        </span>
                        Photos
                      </div>
                      <div className="p-2 rounded-xl bg-[#FAF8F5]">
                        <span className="block font-semibold text-[#1A1714]">
                          {evt.view_count || 0}
                        </span>
                        Views
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-[#FAF8F5] border-t border-[#EBE6DF] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Copy Link */}
                    <button
                      onClick={() => handleCopyLink(evt.public_slug, evt.id)}
                      className={`p-2 rounded-lg border text-xs transition ${
                        copiedId === evt.id
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "border-[#EBE6DF] hover:bg-white text-[#7A6F64]"
                      }`}
                      title="Copy Public WhatsApp Link"
                    >
                      {copiedId === evt.id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Edit Details */}
                    <button
                      onClick={() => setEditingEvent(evt)}
                      className="p-2 rounded-lg border border-[#EBE6DF] hover:border-[#C59350]/40 hover:bg-[#C59350]/10 text-[#7A6F64] hover:text-[#1A1714] transition"
                      title="Edit Event Details"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#C59350]" />
                    </button>

                    {/* View Public */}
                    <Link
                      href={`/gallery/${evt.public_slug}`}
                      target="_blank"
                      className="p-2 rounded-lg border border-[#EBE6DF] hover:bg-white text-[#7A6F64] transition"
                      title="Open Public Gallery"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#C59350]" />
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(evt.id, evt.name)}
                      disabled={deletingId === evt.id}
                      className="p-2 rounded-lg border border-[#EBE6DF] hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 text-[#7A6F64] transition disabled:opacity-50"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Manage Studio */}
                  <Link
                    href={`/admin/events/${evt.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1A1714] hover:bg-[#262320] text-[#FAF8F5] text-xs font-medium transition"
                  >
                    Manage Event
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Event Details Modal */}
      {editingEvent && (
        <EditEventModal
          isOpen={Boolean(editingEvent)}
          onClose={() => setEditingEvent(null)}
          event={editingEvent}
          onSaved={(updated) => {
            setEvents((prev) =>
              prev.map((e) => (e.id === updated.id ? { ...e, ...updated } : e))
            );
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
}
