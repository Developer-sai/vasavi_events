import React from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getEvents, getAnalyticsSummary } from "@/lib/db/events";
import { formatDate } from "@/lib/utils/format";
import {
  CalendarHeart,
  FolderTree,
  Image as ImageIcon,
  Eye,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { EventItem } from "@/types";

export default async function AdminDashboardPage() {
  const events = await getEvents();
  const analytics = await getAnalyticsSummary();

  const stats = [
    {
      label: "Total Events",
      value: analytics.total_events,
      icon: CalendarHeart,
      detail: `${analytics.active_events} active • ${analytics.expired_events} expired`,
    },
    {
      label: "Total Folders",
      value: analytics.total_folders,
      icon: FolderTree,
      detail: "Organized by ceremony",
    },
    {
      label: "Photos Uploaded",
      value: analytics.total_photos,
      icon: ImageIcon,
      detail: "Cloud CDN delivered",
    },
    {
      label: "Public Gallery Views",
      value: analytics.total_views,
      icon: Eye,
      detail: "WhatsApp & direct guests",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#FAF8F5]">
      <AdminHeader
        title="Executive Studio Dashboard"
        subtitle="Manage celebration galleries, ceremonial folders, and public share links."
        action={{
          label: "Create New Event",
          href: "/admin/events/new",
          icon: PlusCircle,
        }}
      />

      <div className="p-6 max-w-7xl w-full mx-auto space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#EBE6DF] rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#7A6F64] font-medium font-sans">
                    {stat.label}
                  </span>
                  <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EBE6DF] text-[#C59350]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="font-serif text-3xl text-[#1A1714] font-medium">
                    {stat.value}
                  </div>
                  <p className="text-[11px] text-[#A69C90] mt-1 font-sans">
                    {stat.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Events Section */}
        <div className="bg-white border border-[#EBE6DF] rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EBE6DF] flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-medium text-[#1A1714]">
                Recent Event Galleries
              </h2>
              <p className="text-xs text-[#7A6F64]">
                Quick access to your active events and photo collections.
              </p>
            </div>
            <Link
              href="/admin/events"
              className="text-xs font-medium text-[#C59350] hover:text-[#A9753C] flex items-center gap-1 font-sans"
            >
              View All Events <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-[#EBE6DF]">
            {events.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#C59350]/10 text-[#C59350] flex items-center justify-center mx-auto mb-3">
                  <CalendarHeart className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg text-[#1A1714]">No Events Created Yet</h3>
                <p className="text-xs text-[#7A6F64] mt-1 max-w-sm mx-auto">
                  Begin by creating your first wedding or celebration gallery to upload photos and generate share links.
                </p>
                <Link
                  href="/admin/events/new"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[#1A1714] text-[#FAF8F5] text-xs font-medium hover:bg-[#262320] transition shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 text-[#C59350]" />
                  Create Your First Event
                </Link>
              </div>
            ) : (
              events.map((evt: EventItem) => {
                const isExpired = evt.expires_at ? new Date(evt.expires_at) < new Date() : false;

                return (
                  <div
                    key={evt.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5]/60 transition"
                  >
                    <div className="flex items-center gap-4">
                      {evt.cover_image_url ? (
                        <img
                          src={evt.cover_image_url}
                          alt={evt.name}
                          className="w-16 h-16 rounded-xl object-cover border border-[#EBE6DF] shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-[#1A1714] border border-[#EBE6DF] flex items-center justify-center text-[#C59350] font-serif font-bold text-lg shrink-0">
                          VE
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-lg text-[#1A1714] font-medium">
                            {evt.name}
                          </h3>
                          <span
                            className={`text-[10px] font-sans px-2 py-0.5 rounded-full font-medium ${
                              isExpired
                                ? "bg-rose-100 text-rose-700"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {isExpired ? "Expired" : "Active"}
                          </span>
                        </div>
                        <p className="text-xs text-[#7A6F64] mt-0.5">
                          {evt.customer_names} • Ceremony: {formatDate(evt.event_date)}
                        </p>
                        <div className="flex items-center gap-4 text-[11px] text-[#A69C90] mt-1 font-mono">
                          <span>{evt.folders?.length || 0} folders</span>
                          <span>•</span>
                          <span>{evt.photos?.length || 0} photos</span>
                          <span>•</span>
                          <span>{evt.view_count || 0} views</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/gallery/${evt.public_slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EBE6DF] hover:border-[#1A1714] text-xs font-sans text-[#1A1714] transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#C59350]" />
                        Public View
                      </Link>

                      <Link
                        href={`/admin/events/${evt.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1A1714] hover:bg-[#262320] text-xs font-sans text-[#FAF8F5] transition"
                      >
                        Manage Studio
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Workflow Tips */}
        <div className="p-5 rounded-2xl bg-[#C59350]/10 border border-[#C59350]/20 flex items-start gap-4">
          <div className="p-2 rounded-xl bg-[#C59350]/20 text-[#A9753C] shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold text-[#1A1714]">
              Studio Workflow Guide
            </h4>
            <p className="text-xs text-[#7A6F64] mt-0.5 leading-relaxed">
              When a client books an event, create the event here, add ceremonies like <strong>Wedding Highlights, Haldi, Couple Shoot, and Reception</strong>, and upload photos in batches. Once published, click <strong>"Copy Link"</strong> or <strong>"Download QR"</strong> to share directly with the family!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
