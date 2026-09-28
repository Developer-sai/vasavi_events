import { EventItem, Folder, Photo, AnalyticsSummary } from "@/types";
import { INITIAL_DEMO_EVENTS } from "@/lib/demo-data";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

// Fallback in-memory store for local development / testing
let localEvents: EventItem[] = [...INITIAL_DEMO_EVENTS];

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("placeholder.supabase.co"));
}

export async function getEvents(): Promise<EventItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          folders (*),
          photos (*)
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data as EventItem[];
      }
    } catch {
      // Fallback
    }
  }

  return localEvents;
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          folders (*),
          photos (*)
        `)
        .eq("public_slug", slug)
        .single();

      if (!error && data) {
        return data as EventItem;
      }
    } catch {
      // Fallback
    }
  }

  const found = localEvents.find((e) => e.public_slug === slug);
  return found ? JSON.parse(JSON.stringify(found)) : null;
}

export async function getEventById(id: string): Promise<EventItem | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          folders (*),
          photos (*)
        `)
        .eq("id", id)
        .single();

      if (!error && data) {
        return data as EventItem;
      }
    } catch {
      // Fallback
    }
  }

  const found = localEvents.find((e) => e.id === id);
  return found ? JSON.parse(JSON.stringify(found)) : null;
}

export async function createEvent(eventData: Partial<EventItem>): Promise<EventItem> {
  const newId = `evt-${Date.now()}`;
  const now = new Date().toISOString();

  const newEvent: EventItem = {
    id: newId,
    name: eventData.name || "Untitled Event",
    customer_names: eventData.customer_names || "Couple",
    event_type: eventData.event_type || "Wedding",
    event_date: eventData.event_date || new Date().toISOString().split("T")[0],
    description: eventData.description || "",
    cover_image_url:
      eventData.cover_image_url ||
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85",
    public_slug: eventData.public_slug || `event-${Date.now()}`,
    expires_at: eventData.expires_at || null,
    is_published: eventData.is_published ?? true,
    view_count: 0,
    created_at: now,
    updated_at: now,
    folders: [
      {
        id: `fld-${Date.now()}-1`,
        event_id: newId,
        name: "Wedding Highlights",
        description: "Primary event moments",
        sort_order: 0,
        photo_count: 0,
        created_at: now,
      },
    ],
    photos: [],
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("events")
        .insert({
          name: newEvent.name,
          customer_names: newEvent.customer_names,
          event_type: newEvent.event_type,
          event_date: newEvent.event_date,
          description: newEvent.description,
          cover_image_url: newEvent.cover_image_url,
          public_slug: newEvent.public_slug,
          expires_at: newEvent.expires_at,
          is_published: newEvent.is_published,
        })
        .select()
        .single();

      if (!error && data) {
        // Also insert default folder
        await supabase.from("folders").insert({
          event_id: data.id,
          name: "Wedding Highlights",
          description: "Primary event moments",
          sort_order: 0,
        });

        return { ...data, folders: newEvent.folders, photos: [] } as EventItem;
      }
    } catch {
      // Fallback
    }
  }

  localEvents = [newEvent, ...localEvents];
  return newEvent;
}

export async function updateEvent(id: string, updates: Partial<EventItem>): Promise<EventItem | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("events")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return data as EventItem;
      }
    } catch {
      // Fallback
    }
  }

  const idx = localEvents.findIndex((e) => e.id === id);
  if (idx !== -1) {
    localEvents[idx] = {
      ...localEvents[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return localEvents[idx];
  }

  return null;
}

export async function deleteEvent(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (!error) return true;
    } catch {
      // Fallback
    }
  }

  localEvents = localEvents.filter((e) => e.id !== id);
  return true;
}

// -------------------------------------------------------------
// FOLDERS CRUD
// -------------------------------------------------------------
export async function createFolder(eventId: string, name: string, description?: string): Promise<Folder> {
  const newFolder: Folder = {
    id: `fld-${Date.now()}`,
    event_id: eventId,
    name,
    description,
    sort_order: 99,
    photo_count: 0,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("folders")
        .insert({
          event_id: eventId,
          name,
          description,
          sort_order: 99,
        })
        .select()
        .single();

      if (!error && data) {
        return data as Folder;
      }
    } catch {
      // Fallback
    }
  }

  const evt = localEvents.find((e) => e.id === eventId);
  if (evt) {
    if (!evt.folders) evt.folders = [];
    newFolder.sort_order = evt.folders.length;
    evt.folders.push(newFolder);
  }

  return newFolder;
}

export async function updateFolder(folderId: string, name: string, description?: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { error } = await supabase
        .from("folders")
        .update({ name, description, updated_at: new Date().toISOString() })
        .eq("id", folderId);
      if (!error) return true;
    } catch {
      // Fallback
    }
  }

  for (const evt of localEvents) {
    if (evt.folders) {
      const f = evt.folders.find((x) => x.id === folderId);
      if (f) {
        f.name = name;
        if (description !== undefined) f.description = description;
        return true;
      }
    }
  }

  return false;
}

export async function deleteFolder(folderId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { error } = await supabase.from("folders").delete().eq("id", folderId);
      if (!error) return true;
    } catch {
      // Fallback
    }
  }

  for (const evt of localEvents) {
    if (evt.folders) {
      evt.folders = evt.folders.filter((f) => f.id !== folderId);
      if (evt.photos) {
        evt.photos = evt.photos.filter((p) => p.folder_id !== folderId);
      }
      return true;
    }
  }

  return false;
}

// -------------------------------------------------------------
// PHOTOS CRUD
// -------------------------------------------------------------
export async function addPhoto(photoData: Omit<Photo, "id" | "created_at">): Promise<Photo> {
  const newPhoto: Photo = {
    ...photoData,
    id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("photos")
        .insert({
          event_id: photoData.event_id,
          folder_id: photoData.folder_id,
          storage_path: photoData.storage_path,
          public_url: photoData.public_url,
          filename: photoData.filename,
          file_size: photoData.file_size,
          width: photoData.width,
          height: photoData.height,
          sort_order: photoData.sort_order || 0,
        })
        .select()
        .single();

      if (!error && data) {
        return data as Photo;
      }
    } catch {
      // Fallback
    }
  }

  const evt = localEvents.find((e) => e.id === photoData.event_id);
  if (evt) {
    if (!evt.photos) evt.photos = [];
    evt.photos.push(newPhoto);

    // Update folder photo count
    if (evt.folders) {
      const f = evt.folders.find((x) => x.id === photoData.folder_id);
      if (f) f.photo_count = (f.photo_count || 0) + 1;
    }
  }

  return newPhoto;
}

export async function deletePhoto(photoId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { error } = await supabase.from("photos").delete().eq("id", photoId);
      if (!error) return true;
    } catch {
      // Fallback
    }
  }

  for (const evt of localEvents) {
    if (evt.photos) {
      const photo = evt.photos.find((p) => p.id === photoId);
      if (photo) {
        evt.photos = evt.photos.filter((p) => p.id !== photoId);
        if (evt.folders) {
          const f = evt.folders.find((x) => x.id === photo.folder_id);
          if (f && f.photo_count && f.photo_count > 0) {
            f.photo_count -= 1;
          }
        }
        return true;
      }
    }
  }

  return false;
}

export async function movePhoto(photoId: string, newFolderId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { error } = await supabase
        .from("photos")
        .update({ folder_id: newFolderId })
        .eq("id", photoId);
      if (!error) return true;
    } catch {
      // Fallback
    }
  }

  for (const evt of localEvents) {
    if (evt.photos) {
      const photo = evt.photos.find((p) => p.id === photoId);
      if (photo) {
        const oldFolderId = photo.folder_id;
        photo.folder_id = newFolderId;

        // adjust counts
        if (evt.folders) {
          const oldF = evt.folders.find((x) => x.id === oldFolderId);
          if (oldF && oldF.photo_count) oldF.photo_count = Math.max(0, oldF.photo_count - 1);
          const newF = evt.folders.find((x) => x.id === newFolderId);
          if (newF) newF.photo_count = (newF.photo_count || 0) + 1;
        }
        return true;
      }
    }
  }

  return false;
}

// -------------------------------------------------------------
// ANALYTICS & TRACKING
// -------------------------------------------------------------
export async function trackGalleryView(slug: string, folderId?: string): Promise<void> {
  const event = await getEventBySlug(slug);
  if (!event) return;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      await supabase.from("gallery_views").insert({
        event_id: event.id,
        folder_id: folderId || null,
        session_hash: `sess-${Date.now().toString(36)}`,
      });

      // Increment view count on event
      await supabase
        .from("events")
        .update({ view_count: (event.view_count || 0) + 1 })
        .eq("id", event.id);
      return;
    } catch {
      // Fallback
    }
  }

  const evt = localEvents.find((e) => e.public_slug === slug);
  if (evt) {
    evt.view_count = (evt.view_count || 0) + 1;
  }
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const events = await getEvents();
  const now = new Date();

  let totalPhotos = 0;
  let totalFolders = 0;
  let totalViews = 0;
  let activeEvents = 0;
  let expiredEvents = 0;

  const topEvents = events.map((e) => {
    const isExpired = e.expires_at ? new Date(e.expires_at) < now : false;
    if (isExpired) expiredEvents++;
    else activeEvents++;

    const photoCount = e.photos?.length || 0;
    const folderCount = e.folders?.length || 0;
    const views = e.view_count || 0;

    totalPhotos += photoCount;
    totalFolders += folderCount;
    totalViews += views;

    return {
      id: e.id,
      name: e.name,
      slug: e.public_slug,
      views,
      photos: photoCount,
      event_date: e.event_date,
      status: (isExpired ? "Expired" : e.is_published ? "Active" : "Draft") as "Active" | "Expired" | "Draft",
    };
  });

  // Sort by views
  topEvents.sort((a, b) => b.views - a.views);

  return {
    total_events: events.length,
    active_events: activeEvents,
    expired_events: expiredEvents,
    total_folders: totalFolders,
    total_photos: totalPhotos,
    total_views: totalViews,
    views_over_time: [
      { date: "May 1", views: 45 },
      { date: "May 2", views: 92 },
      { date: "May 3", views: 140 },
      { date: "May 4", views: 210 },
      { date: "May 5", views: 348 },
      { date: "May 6", views: 420 },
      { date: "May 7", views: 560 },
    ],
    top_events: topEvents,
  };
}
