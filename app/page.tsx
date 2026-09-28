import React from "react";
import Link from "next/link";
import { BrandEmblem } from "@/components/common/BrandEmblem";
import { getEvents } from "@/lib/db/events";
import {
  ArrowRight,
  ShieldCheck,
  FolderTree,
  QrCode,
  Sparkles,
  ExternalLink,
  Lock,
} from "lucide-react";

export default async function HomePage() {
  const events = await getEvents();
  const featuredEvent = events[0] || null;

  return (
    <div className="min-h-screen bg-[#12100E] text-[#FAF8F5] flex flex-col justify-between selection:bg-[#C59350]/30 selection:text-[#FAF8F5]">
      {/* Top Navigation */}
      <header className="border-b border-[#262320]/60 px-6 py-4 backdrop-blur-md sticky top-0 z-40 bg-[#12100E]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif tracking-[0.2em] text-lg font-bold text-[#FAF8F5] uppercase">
              Vasavi Events
            </span>
            <span className="text-[10px] tracking-widest uppercase bg-[#C59350]/15 text-[#C59350] px-2 py-0.5 rounded-full border border-[#C59350]/30">
              Subbu Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 text-xs text-[#FAF8F5]/80 hover:text-white px-3.5 py-1.5 rounded-lg border border-[#383430] hover:border-[#C59350] transition font-sans"
            >
              <Lock className="w-3.5 h-3.5 text-[#C59350]" />
              Admin Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C59350]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <BrandEmblem size="lg" subtitle="LUXURY WEDDING MEMORIES" theme="dark" />

          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#FAF8F5] mt-6 max-w-3xl mx-auto leading-tight">
            Your Celebrations.{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#DFBF94] via-[#F4E3C7] to-[#C99C5D]">
              Timelessly Delivered.
            </span>
          </h2>

          <p className="mt-6 text-sm sm:text-base text-[#FAF8F5]/70 max-w-xl mx-auto font-sans leading-relaxed">
            The private digital memory platform for wedding halls and event organizers.
            Deliver exquisite high-resolution galleries to clients with instant, zero-login shareable links.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {featuredEvent && (
              <Link
                href={`/gallery/${featuredEvent.public_slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C59350] to-[#D1A870] hover:from-[#B58340] hover:to-[#C59350] text-[#12100E] font-medium text-sm transition shadow-lg shadow-[#C59350]/20"
              >
                <Sparkles className="w-4 h-4" />
                Experience Live Demo Gallery ({featuredEvent.name})
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link
              href="/admin/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1A1714] hover:bg-[#262320] border border-[#383430] text-[#FAF8F5] font-medium text-sm transition"
            >
              Open Subbu Admin Portal
            </Link>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-[#1A1714]/80 border border-[#262320] backdrop-blur-xs">
              <div className="p-2.5 rounded-xl bg-[#C59350]/10 text-[#C59350] w-fit mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#FAF8F5] mb-2">Zero-Login Client Sharing</h3>
              <p className="text-xs text-[#FAF8F5]/60 leading-relaxed font-sans">
                Guests tap your WhatsApp link and immediately browse. No password friction or app installs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1A1714]/80 border border-[#262320] backdrop-blur-xs">
              <div className="p-2.5 rounded-xl bg-[#C59350]/10 text-[#C59350] w-fit mb-4">
                <FolderTree className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#FAF8F5] mb-2">Instant Folder Tabs</h3>
              <p className="text-xs text-[#FAF8F5]/60 leading-relaxed font-sans">
                Switch between Wedding Highlights, Haldi, Couple Shoot, and Reception with zero page reloads.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1A1714]/80 border border-[#262320] backdrop-blur-xs">
              <div className="p-2.5 rounded-xl bg-[#C59350]/10 text-[#C59350] w-fit mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#FAF8F5] mb-2">Hall QR Displays & Expiry</h3>
              <p className="text-xs text-[#FAF8F5]/60 leading-relaxed font-sans">
                Download printable vector QR codes for the entrance, and configure custom link expiry periods.
              </p>
            </div>
          </div>

          {/* Current Live Galleries Quick View */}
          <div className="mt-16 pt-12 border-t border-[#262320]/80">
            <h4 className="font-serif text-xl text-[#FAF8F5] mb-6">Recent Event Galleries</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {events.map((evt) => (
                <Link
                  key={evt.id}
                  href={`/gallery/${evt.public_slug}`}
                  className="group block relative overflow-hidden rounded-xl bg-[#1A1714] border border-[#262320] hover:border-[#C59350]/50 transition text-left"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden relative">
                    <img
                      src={evt.cover_image_url}
                      alt={evt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-3 text-[10px] tracking-wider uppercase font-semibold text-[#C59350]">
                      {evt.event_type}
                    </span>
                  </div>
                  <div className="p-4">
                    <h5 className="font-serif text-base text-[#FAF8F5] group-hover:text-[#C59350] transition truncate">
                      {evt.name}
                    </h5>
                    <p className="text-[11px] text-[#FAF8F5]/60 font-sans mt-0.5">
                      {evt.customer_names} • {evt.event_date}
                    </p>
                    <div className="flex items-center justify-between mt-3 text-[10px] text-[#FAF8F5]/50">
                      <span>{evt.photos?.length || 0} Photos</span>
                      <span className="flex items-center gap-1 text-[#C59350]">
                        View Gallery <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#262320]/60 py-8 px-6 text-center text-xs text-[#FAF8F5]/40 font-sans">
        <p className="tracking-widest uppercase font-serif text-[#FAF8F5]/70">
          Vasavi Events • Subbu Wedding Solutions
        </p>
        <p className="mt-1">
          Designed for modern wedding halls, photographers, and celebratory venues.
        </p>
      </footer>
    </div>
  );
}
