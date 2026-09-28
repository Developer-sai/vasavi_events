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
} from "lucide-react";

export default async function HomePage() {
  const events = await getEvents();
  const featuredEvent = events[0] || null;

  return (
    <div className="min-h-screen bg-[#12100E] text-[#FAF8F5] flex flex-col justify-between selection:bg-[#C59350]/30 selection:text-[#FAF8F5]">
      {/* Top Client Navigation Header (NO ADMIN BUTTONS) */}
      <header className="border-b border-[#262320]/60 px-6 py-4 backdrop-blur-md sticky top-0 z-40 bg-[#12100E]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif tracking-[0.24em] text-lg font-light text-[#FAF8F5] uppercase">
              Vasavi Events
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans text-[#FAF8F5]/60">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Private Memory Delivery</span>
          </div>
        </div>
      </header>

      {/* Hero Showcase Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 relative overflow-hidden">
        {/* Subtle radial ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C59350]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Brand Emblem */}
          <BrandEmblem size="lg" subtitle="HAUTE COUTURE MEMORIES & ARCHIVES" theme="dark" />

          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#FAF8F5] mt-6 max-w-3xl mx-auto leading-tight">
            Sacred Traditions.{" "}
            <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#EED9B9] via-[#FAF8F5] to-[#D1A870]">
              Timelessly Captured.
            </span>
          </h2>

          <p className="mt-6 text-sm sm:text-base text-[#FAF8F5]/70 max-w-xl mx-auto font-sans leading-relaxed font-light">
            Private digital memory collections for weddings and grand celebrations.
            Delivering high-resolution albums directly to families with effortless, zero-login shareable links.
          </p>

          {/* Primary Client CTA */}
          <div className="mt-10 flex items-center justify-center">
            {featuredEvent && (
              <Link
                href={`/gallery/${featuredEvent.public_slug}`}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#C59350] via-[#D1A870] to-[#C59350] hover:brightness-110 text-[#12100E] font-medium text-sm transition shadow-xl shadow-[#C59350]/20"
              >
                <Sparkles className="w-4 h-4 text-[#12100E]" />
                Explore Featured Gallery ({featuredEvent.name})
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Feature Pillars */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-[#1A1714]/80 border border-[#262320] backdrop-blur-xs">
              <div className="p-2.5 rounded-xl bg-[#C59350]/10 text-[#C59350] w-fit mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#FAF8F5] mb-2 font-medium">Instant Guest Access</h3>
              <p className="text-xs text-[#FAF8F5]/60 leading-relaxed font-sans font-light">
                Simply open the shared link on any phone or browser. No login, password, or application required.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1A1714]/80 border border-[#262320] backdrop-blur-xs">
              <div className="p-2.5 rounded-xl bg-[#C59350]/10 text-[#C59350] w-fit mb-4">
                <FolderTree className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#FAF8F5] mb-2 font-medium">Ceremonial Chapters</h3>
              <p className="text-xs text-[#FAF8F5]/60 leading-relaxed font-sans font-light">
                Browse every moment effortlessly — Haldi, Sangeet, Muhurtham, and Reception organized into dedicated folders.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1A1714]/80 border border-[#262320] backdrop-blur-xs">
              <div className="p-2.5 rounded-xl bg-[#C59350]/10 text-[#C59350] w-fit mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#FAF8F5] mb-2 font-medium">Hall QR & WhatsApp Delivery</h3>
              <p className="text-xs text-[#FAF8F5]/60 leading-relaxed font-sans font-light">
                Scan entrance QR displays directly at the venue to access live photo galleries and download original frames.
              </p>
            </div>
          </div>

          {/* Current Event Galleries Showcase */}
          <div className="mt-16 pt-12 border-t border-[#262320]/80">
            <h4 className="font-serif text-xl text-[#FAF8F5] mb-6 font-light">Recent Curated Galleries</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {events.map((evt) => (
                <Link
                  key={evt.id}
                  href={`/gallery/${evt.public_slug}`}
                  className="group block relative overflow-hidden rounded-2xl bg-[#1A1714] border border-[#262320] hover:border-[#C59350]/50 transition text-left"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden relative">
                    <img
                      src={evt.cover_image_url}
                      alt={evt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 left-3 text-[10px] tracking-wider uppercase font-semibold text-[#C59350]">
                      {evt.event_type}
                    </span>
                  </div>
                  <div className="p-4">
                    <h5 className="font-serif text-base text-[#FAF8F5] group-hover:text-[#C59350] transition truncate font-medium">
                      {evt.name}
                    </h5>
                    <p className="text-[11px] text-[#FAF8F5]/60 font-sans mt-0.5">
                      {evt.customer_names} • {evt.event_date}
                    </p>
                    <div className="flex items-center justify-between mt-3 text-[10px] text-[#FAF8F5]/50">
                      <span>{evt.photos?.length || 0} Memories</span>
                      <span className="flex items-center gap-1 text-[#C59350] font-medium">
                        Open Collection <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Clean Client Footer */}
      <footer className="border-t border-[#262320]/60 py-8 px-6 text-center text-xs text-[#FAF8F5]/40 font-sans">
        <p className="tracking-widest uppercase font-serif text-[#FAF8F5]/70">
          Vasavi Events • Luxury Digital Memory Delivery
        </p>
        <p className="mt-1 font-light">
          Private, high-performance wedding album delivery for clients and celebratory guests.
        </p>
      </footer>
    </div>
  );
}
