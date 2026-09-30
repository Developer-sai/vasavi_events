-- ==============================================================================
-- VASAVI EVENTS - SHOWCASE PORTFOLIO SCHEMA ENHANCEMENTS
-- ==============================================================================

-- 1. Ensure master showcase event exists for foreign key compatibility
INSERT INTO public.events (
  id,
  name,
  customer_names,
  event_type,
  event_date,
  description,
  cover_image_url,
  public_slug,
  is_published
)
VALUES (
  '4f8e6401-e66e-4f80-a0b5-47dfb209cbe8',
  'Vasavi Events Showcase',
  'Portfolio',
  'Showcase',
  '2026-01-01',
  'Master portfolio showcase for decoration collections',
  '',
  'showcase',
  true
)
ON CONFLICT (id) DO NOTHING;

-- 2. Ensure initial decoration folders exist if none exist yet
INSERT INTO public.folders (event_id, name, description, sort_order)
VALUES 
  ('4f8e6401-e66e-4f80-a0b5-47dfb209cbe8', 'Haldi & Mehendi Decor', 'Vibrant traditional marigold, floral and yellow drape setups', 0),
  ('4f8e6401-e66e-4f80-a0b5-47dfb209cbe8', 'Birthday & Balloon Themes', 'Themed kids birthdays, balloon arches, backdrops and cake tables', 1),
  ('4f8e6401-e66e-4f80-a0b5-47dfb209cbe8', 'Mandap & Sacred Stages', 'Royal wedding mandaps, temple bells, florals and sacred muhurtham settings', 2),
  ('4f8e6401-e66e-4f80-a0b5-47dfb209cbe8', 'Reception & Grand Backdrops', 'Modern LED illumination, fairytale crystal chandeliers and evening receptions', 3)
ON CONFLICT DO NOTHING;

-- 3. Ensure public read access on folders and photos for public showcase
DROP POLICY IF EXISTS "Public can view showcase folders" ON public.folders;
CREATE POLICY "Public can view showcase folders"
  ON public.folders FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can view showcase photos" ON public.photos;
CREATE POLICY "Public can view showcase photos"
  ON public.photos FOR SELECT
  USING (true);

-- 4. Ensure admin full management on folders and photos
DROP POLICY IF EXISTS "Authenticated can insert folders" ON public.folders;
CREATE POLICY "Authenticated can insert folders"
  ON public.folders FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update folders" ON public.folders;
CREATE POLICY "Authenticated can update folders"
  ON public.folders FOR UPDATE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can delete folders" ON public.folders;
CREATE POLICY "Authenticated can delete folders"
  ON public.folders FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can insert photos" ON public.photos;
CREATE POLICY "Authenticated can insert photos"
  ON public.photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update photos" ON public.photos;
CREATE POLICY "Authenticated can update photos"
  ON public.photos FOR UPDATE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can delete photos" ON public.photos;
CREATE POLICY "Authenticated can delete photos"
  ON public.photos FOR DELETE
  TO authenticated
  USING (true);
