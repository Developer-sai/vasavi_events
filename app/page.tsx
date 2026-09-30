import React from "react";
import { BrandEmblem } from "@/components/common/BrandEmblem";
import { getShowcaseFolders, getShowcasePhotos } from "@/lib/db/showcase";
import { ShowcaseGallery } from "@/components/showcase/ShowcaseGallery";
import {
  Sparkles,
  MessageCircle,
  Phone,
  MapPin,
  Heart,
  CheckCircle2,
  CalendarHeart,
} from "lucide-react";

export const revalidate = 0; // Dynamic server rendering for fresh showcase photos

export default async function HomePage() {
  const folders = await getShowcaseFolders();
  const photos = await getShowcasePhotos();

  return (
    <div className="min-h-screen bg-[#12100E] text-[#FAF8F5] flex flex-col justify-between selection:bg-[#C59350]/30 selection:text-[#FAF8F5]">
      {/* 1. Haute-Couture Top Navbar */}
      <header className="border-b border-[#262320]/80 px-6 py-4 backdrop-blur-md sticky top-0 z-40 bg-[#12100E]/90">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif tracking-[0.24em] text-lg sm:text-xl font-light text-[#FAF8F5] uppercase">
              Vasavi Events
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://api.whatsapp.com/send?text=Hi%20Vasavi%20Events!%20I%20would%20like%20to%20enquire%20about%20event%20decorations."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Enquiries</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero Brand Showcase Masthead */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-8 px-4 text-center">
        {/* Subtle radial gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C59350]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Brand Monogram */}
          <BrandEmblem size="lg" subtitle="DECORATION & EVENT STYLING SHOWCASE" theme="dark" />

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#FAF8F5] mt-6 max-w-3xl mx-auto leading-tight">
            Sacred Traditions.{" "}
            <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#EED9B9] via-[#FAF8F5] to-[#D1A870]">
              Majestic Celebrations.
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-[#FAF8F5]/75 max-w-2xl mx-auto font-sans leading-relaxed font-light">
            Explore our signature decoration setups — from intimate Haldi & vibrant Mehendi rituals to regal Wedding Mandaps and custom Birthday themes. Browse our portfolio and get in touch to design your dream event.
          </p>

          {/* Quick Contact & Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://api.whatsapp.com/send?text=Hi%20Vasavi%20Events!%20I%20am%20planning%20an%20event%20and%20would%20love%20to%20discuss%20decorations."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C59350] to-[#D1A870] hover:brightness-110 text-[#12100E] font-semibold text-xs tracking-wider uppercase transition shadow-xl cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-[#12100E]" />
              <span>Book / Enquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. The Interactive Showcase Gallery */}
      <main className="flex-1">
        <ShowcaseGallery folders={folders} photos={photos} />
      </main>

      {/* 4. Specialties Showcase Section */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-[#262320]/60 mt-12">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#C59350] font-semibold font-mono">
            WHAT WE CREATE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5] font-light mt-1">
            Bespoke Celebration Styling
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-[#1A1714]/80 border border-[#262320] backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-[#C59350]/15 text-[#C59350] flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#FAF8F5] mb-1 font-medium">
              Haldi & Mehendi Themes
            </h3>
            <p className="text-xs text-[#FAF8F5]/60 leading-relaxed font-light">
              Traditional yellow drapes, brass urlis, marigold floral cascades, and cozy seating for auspicious beginnings.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1A1714]/80 border border-[#262320] backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-[#C59350]/15 text-[#C59350] flex items-center justify-center mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#FAF8F5] mb-1 font-medium">
              Birthday Celebrations
            </h3>
            <p className="text-xs text-[#FAF8F5]/60 leading-relaxed font-light">
              Themed backdrops, organic balloon arches, light-up numbers, and custom cake table arrangements for all ages.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1A1714]/80 border border-[#262320] backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-[#C59350]/15 text-[#C59350] flex items-center justify-center mb-3">
              <CalendarHeart className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#FAF8F5] mb-1 font-medium">
              Mandap & Sacred Stages
            </h3>
            <p className="text-xs text-[#FAF8F5]/60 leading-relaxed font-light">
              Regal temple-inspired wedding mandaps, auspicious flower canopies, and celestial muhurtham settings.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1A1714]/80 border border-[#262320] backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-[#C59350]/15 text-[#C59350] flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#FAF8F5] mb-1 font-medium">
              Reception Backdrops
            </h3>
            <p className="text-xs text-[#FAF8F5]/60 leading-relaxed font-light">
              Modern crystal chandeliers, fairy light curtains, botanical gardens, and glamorous evening reception styling.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Contact & Booking Banner */}
      <section className="py-12 px-4 max-w-4xl mx-auto w-full text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1E1A17] via-[#1A1714] to-[#12100E] border border-[#C59350]/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] font-light">
              Ready to Design Your Event?
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/70 mt-2 max-w-lg mx-auto">
              Message us on WhatsApp to discuss your date, theme ideas, and receive custom decor packages.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://api.whatsapp.com/send?text=Hi%20Vasavi%20Events!%20I%20would%20like%20to%20get%20a%20quote%20for%20an%20event%20decoration."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wider uppercase transition shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-[#262320]/80 py-8 px-6 text-center text-xs text-[#FAF8F5]/40 font-sans">
        <p className="tracking-widest uppercase font-serif text-[#FAF8F5]/70">
          Vasavi Events • Luxury Event Styling & Decoration Portfolio
        </p>
        <p className="mt-1 font-light">
          Creating timeless celebrations, sacred rituals, and unforgettable themes.
        </p>
      </footer>
    </div>
  );
}
