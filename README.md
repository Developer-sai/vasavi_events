# Vasavi Events — Digital Memory Delivery Platform

A bespoke, editorial digital photo gallery platform designed for wedding halls, event managers, and professional photography studios. Built specifically for **Subbu** to organize memories and deliver high-resolution albums to clients like **Sai & Nithya** via zero-login shareable links.

---

## 🌟 Key Features

### 1. Zero-Login Public Client Experience (`/gallery/[slug]`)
- **No Password or Login Friction**: Guests opening links shared via WhatsApp immediately view memories.
- **Regal Editorial Header**: Displaying ceremony date, couple names, and tailored welcoming notes.
- **Ceremonial Folder Navigation**: Instant switching between `All Photos`, `Wedding Highlights`, `Couple Shoot`, `Engagement`, `Haldhi`, `Birthday Shoot`, `Half Saree Ceremony`, and `Engagement Teasers` without page reloads.
- **Dynamic Masonry Layout**: Responsive multi-column layout preserving natural image aspect ratios.
- **Luxury Lightbox**: Fullscreen darkroom mode with touch swipe gestures, keyboard arrow keys, image counter, download button, and autoplay slideshow.
- **Hall QR Codes & WhatsApp Sharing**: Instant QR code generator for wedding hall entrance displays and 1-click WhatsApp messaging.
- **Link Expiry Control**: Set galleries to "Never Expires" or custom date/time with a dignified expired notice.

### 2. Subbu Admin Studio (`/admin`)
- **Protected Supabase Authentication**: Email/password login with secure session cookies.
- **Telemetry & Analytics**: Privacy-safe view tracking, visitor acquisition breakdown (WhatsApp, Hall QR, Direct), and views timeline.
- **Ceremonial Folder CRUD**: Create, rename, delete, and re-order ceremony albums.
- **Batch Drag & Drop Uploader**: Upload multiple high-resolution photos with individual progress bars directly to Supabase Storage.
- **Bulk Photo Management**: Multi-select photos to move between folders or bulk delete.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 16 (App Router with React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom luxury editorial tokens
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Auth**: Supabase Auth (Cookie-based session via `@supabase/ssr`)
- **Storage**: Supabase Storage (`event-media` bucket)
- **Deployment**: Vercel

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone repository
git clone https://github.com/Developer-sai/vasavi_events.git
cd vasavi_events

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the homepage and live demo gallery (`/gallery/sai-weds-nithya`).
Open [http://localhost:3000/admin](http://localhost:3000/admin) to explore Subbu's management studio.

---

## 🗄️ Supabase Database & Storage Setup

1. Create a project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** and run the migration scripts in order:
   - `supabase/migrations/001_initial_schema.sql` (Creates profiles, events, folders, photos, gallery_views and RLS policies)
   - `supabase/migrations/002_storage_setup.sql` (Creates `event-media` storage bucket and access rules)
3. Copy your **Project URL** and **Anon Public Key** from Supabase Settings -> API into `.env.local` or your Vercel Environment Variables.

---

## 🌐 Vercel Deployment

Configure the following environment variables in your Vercel Project Settings:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
- `NEXT_PUBLIC_APP_URL`: Your production URL (e.g. `https://vasavi-events.vercel.app`)

---

## 📄 License
Private project for Vasavi Events and Subbu.
