-- ==============================================================================
-- VASAVI EVENTS - PRODUCTION POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. Profiles Table (tied to Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT DEFAULT 'Subbu',
  business_name TEXT DEFAULT 'Vasavi Events',
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  customer_names TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'Wedding',
  event_date DATE NOT NULL,
  description TEXT,
  cover_image_url TEXT NOT NULL,
  public_slug TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ, -- NULL means never expires
  is_published BOOLEAN DEFAULT true NOT NULL,
  view_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Folders Table
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Photos Table
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  folder_id UUID NOT NULL REFERENCES public.folders(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_size BIGINT,
  width INTEGER,
  height INTEGER,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Gallery Views Analytics Table
CREATE TABLE IF NOT EXISTS public.gallery_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  session_hash TEXT NOT NULL,
  folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
  referrer TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR HIGH-THROUGHPUT GALLERY TRAFFIC
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(public_slug);
CREATE INDEX IF NOT EXISTS idx_events_owner ON public.events(owner_id);
CREATE INDEX IF NOT EXISTS idx_events_published_expires ON public.events(is_published, expires_at);
CREATE INDEX IF NOT EXISTS idx_folders_event ON public.folders(event_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_photos_event_folder ON public.photos(event_id, folder_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_views_event_time ON public.gallery_views(event_id, viewed_at);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_views ENABLE ROW LEVEL SECURITY;

-- Profiles: Authenticated users can read and update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Events:
-- Public can read ONLY published, non-expired events
CREATE POLICY "Public can view published and active events"
  ON public.events FOR SELECT
  USING (
    is_published = true AND (expires_at IS NULL OR expires_at > NOW())
  );

-- Authenticated admins can do full CRUD on events
CREATE POLICY "Admins can view all their events"
  ON public.events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  TO authenticated
  USING (true);

-- Folders:
-- Public can read folders of published, non-expired events
CREATE POLICY "Public can view folders for published events"
  ON public.folders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = folders.event_id
        AND events.is_published = true
        AND (events.expires_at IS NULL OR events.expires_at > NOW())
    )
  );

CREATE POLICY "Admins can manage folders"
  ON public.folders FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Photos:
-- Public can view photos of published, non-expired events
CREATE POLICY "Public can view photos for published events"
  ON public.photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = photos.event_id
        AND events.is_published = true
        AND (events.expires_at IS NULL OR events.expires_at > NOW())
    )
  );

CREATE POLICY "Admins can manage photos"
  ON public.photos FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Gallery Views:
-- Anyone can insert a view (anonymous tracking)
CREATE POLICY "Public can log views"
  ON public.gallery_views FOR INSERT
  WITH CHECK (true);

-- Only authenticated admins can read analytics
CREATE POLICY "Admins can view analytics"
  ON public.gallery_views FOR SELECT
  TO authenticated
  USING (true);
