# Vasavi Events — Database Setup & Admin Walkthrough Guide

This guide provides step-by-step instructions for attaching your **Supabase Free Database**, setting up your dedicated **Admin Subdomain** on Vercel, and managing client galleries.

---

## 🗄️ Part 1: How to Attach & Connect Supabase Database (100% Free Tier)

Currently, the application is live with its high-speed built-in demo memory store. Follow these 4 simple steps to connect your persistent PostgreSQL database:

### Step 1: Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **"New Project"**.
3. Choose your organization, name your project (e.g. `vasavi-events`), set a database password, and select your preferred region (e.g. `South Asia (Mumbai)` or closest to your clients).
4. Select the **Free Tier** ($0/month) and click **"Create New Project"**.

---

### Step 2: Run the Database & Storage Migration
1. In your Supabase dashboard, click on **SQL Editor** (the terminal/code icon in the left sidebar).
2. Click **"New Query"**.
3. Open [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql) in this repository, copy all the code, paste it into the Supabase SQL editor, and click **"Run"** (green button).
   - *This creates the `profiles`, `events`, `folders`, `photos`, and `gallery_views` tables with strict Row-Level Security (RLS).*
4. Click **"New Query"** again, copy the contents of [`supabase/migrations/002_storage_setup.sql`](./supabase/migrations/002_storage_setup.sql), paste it, and click **"Run"**.
   - *This creates the `event-media` Storage bucket for photos and cover images with public read and authenticated write access.*

---

### Step 3: Copy Your Supabase API Credentials
1. In your Supabase dashboard, click on the **Project Settings** (gear icon at the bottom of the left sidebar).
2. Click **"API"** under Configuration.
3. You will see two keys:
   - **Project URL** (looks like `https://xyzabcdefghijklm.supabase.co`)
   - **Project API Keys** -> `anon` / `public` key (long string starting with `eyJhbGci...`)

---

### Step 4: Add the Keys to Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click on the **`vasavi_events`** project.
3. Go to **Settings** -> **Environment Variables**.
4. Add the following two variables:
   - Key: `NEXT_PUBLIC_SUPABASE_URL` | Value: *[Your Supabase Project URL]*
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Value: *[Your Supabase anon key]*
5. Click **Save**.
6. Go to the **Deployments** tab in Vercel, click on the three dots `...` next to the latest deployment, and click **"Redeploy"**.
7. **Done!** Your application is now permanently connected to your live Supabase database and cloud storage!

---

## 🌐 Part 2: How to Configure the Dedicated Admin Subdomain (`admin.vasavievents.vercel.app`)

We have already configured `middleware.ts` to automatically detect and route the `admin.` subdomain directly to the protected Admin Studio.

### To attach the subdomain on Vercel:
1. In your [Vercel Dashboard](https://vercel.com/dashboard), open the **`vasavi_events`** project.
2. Go to **Settings** -> **Domains**.
3. In the input box, enter:
   ```
   admin.vasavievents.vercel.app
   ```
4. Click **Add**.
5. Vercel will instantly issue an SSL certificate for `admin.vasavievents.vercel.app`.
6. Now, whenever you visit `https://admin.vasavievents.vercel.app`, it will automatically open the Admin Portal!
7. The public URL `https://vasavievents.vercel.app` remains 100% clean and client-facing with no admin links visible to visitors.

---

## 📱 Part 3: How to Use Vasavi Events (Event Manager Workflow)

### 1. Logging into the Admin Portal
- Open `https://admin.vasavievents.vercel.app` (or `https://vasavievents.vercel.app/admin/login`).
- Enter your admin credentials:
  - **Email**: `admin@vasavievents.com`
  - **Password**: `admin123` (or your Supabase Auth account)

### 2. Creating a Client Gallery
1. In the Admin Dashboard, click **"+ Create New Event"**.
2. Enter the event details:
   - **Event Title**: e.g., *Siddharth Weds Ananya*
   - **Client Names**: e.g., *Siddharth & Ananya*
   - **Category**: *Wedding*, *Engagement*, *Haldi*, *Reception*, etc.
   - **Ceremony Date**: Pick date
   - **Cover Photo**: Select a curated preset or paste a custom high-res URL
   - **Shareable Link Slug**: Auto-generates clean URL (e.g. `/gallery/siddharth-weds-ananya`)
   - **Expiration**: Choose **"Never Expires"** or pick a custom date/time.
3. Click **"Create & Launch Studio"**.
4. The system automatically creates your ceremonial folders (*Wedding Highlights, Couple Shoot, Engagement, Haldhi, Reception*).

### 3. Uploading & Organizing Photos
1. Inside the **Event Studio**, click on any folder (e.g. *Wedding Highlights*).
2. Drag and drop high-resolution photos into the upload box (or click to browse multiple files).
3. The real-time progress bar will upload and display the images immediately.
4. You can create custom folders at any time (*e.g. "Mehendi Ceremony", "Sangeet Night"*).
5. **Bulk Operations**: Click photos to multi-select, then move them to another folder or delete in one click.

### 4. Delivering to the Client
1. Click **"Copy WhatsApp Link"** to copy the zero-login public gallery URL.
2. Click **"Hall QR Code"** to view and download the high-resolution vector QR code.
3. Print the QR code on a standee or welcome board at the venue entrance.
4. Guests simply open the link or scan the QR code to immediately view the photos, switch ceremonial folders, open the high-res lightbox, and play slideshows without ever having to log in!
