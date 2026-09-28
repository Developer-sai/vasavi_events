-- ==============================================================================
-- VASAVI EVENTS - STORAGE BUCKET CONFIGURATION & POLICIES
-- ==============================================================================

-- 1. Create the 'event-media' storage bucket for photos and cover images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-media',
  'event-media',
  true,
  26214400, -- 25MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 26214400,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic'];

-- 2. Storage Policies
-- Public can read images from event-media
CREATE POLICY "Public Read Access on event-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-media');

-- Authenticated admins can upload images
CREATE POLICY "Authenticated Admin Upload Access"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-media');

-- Authenticated admins can update images
CREATE POLICY "Authenticated Admin Update Access"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'event-media');

-- Authenticated admins can delete images
CREATE POLICY "Authenticated Admin Delete Access"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'event-media');
