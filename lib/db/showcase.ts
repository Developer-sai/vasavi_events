import { Folder, Photo } from "@/types";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { SHOWCASE_EVENT_ID } from "@/lib/constants";

export { SHOWCASE_EVENT_ID };

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  return Boolean(url && !url.includes("placeholder.supabase.co"));
}

// In-memory fallback
let localFolders: Folder[] = [
  {
    id: "fld-haldi",
    event_id: SHOWCASE_EVENT_ID,
    name: "Haldi & Mehendi Decor",
    description: "Vibrant yellow florals and traditional marigold setups",
    sort_order: 0,
    photo_count: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "fld-birthday",
    event_id: SHOWCASE_EVENT_ID,
    name: "Birthday & Balloon Themes",
    description: "Themed kids birthdays, balloon arches and cake tables",
    sort_order: 1,
    photo_count: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "fld-mandap",
    event_id: SHOWCASE_EVENT_ID,
    name: "Mandap & Sacred Stages",
    description: "Royal wedding mandaps and sacred muhurtham settings",
    sort_order: 2,
    photo_count: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "fld-reception",
    event_id: SHOWCASE_EVENT_ID,
    name: "Reception & Grand Backdrops",
    description: "Fairytale crystal chandeliers and evening reception stages",
    sort_order: 3,
    photo_count: 0,
    created_at: new Date().toISOString(),
  },
];

let localPhotos: Photo[] = [];

/**
 * Fetch all decoration folders / categories with photo counts
 */
export async function getShowcaseFolders(): Promise<Folder[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      
      // Fetch all folders
      const { data: folders, error: folderErr } = await supabase
        .from("folders")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (!folderErr && folders && folders.length > 0) {
        // Fetch photo counts per folder
        const { data: photos } = await supabase
          .from("photos")
          .select("folder_id");

        const counts: Record<string, number> = {};
        if (photos) {
          photos.forEach((p) => {
            counts[p.folder_id] = (counts[p.folder_id] || 0) + 1;
          });
        }

        return folders.map((f) => ({
          ...f,
          photo_count: counts[f.id] || 0,
        })) as Folder[];
      }
    } catch (err) {
      console.error("Error fetching showcase folders from Supabase:", err);
    }
  }

  return localFolders.map((f) => ({
    ...f,
    photo_count: localPhotos.filter((p) => p.folder_id === f.id).length,
  }));
}

/**
 * Fetch all decoration photos or filtered by folder
 */
export async function getShowcasePhotos(folderId?: string): Promise<Photo[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      let query = supabase.from("photos").select("*");

      if (folderId && folderId !== "all") {
        query = query.eq("folder_id", folderId);
      }

      const { data, error } = await query
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data as Photo[];
      }
    } catch (err) {
      console.error("Error fetching showcase photos from Supabase:", err);
    }
  }

  if (folderId && folderId !== "all") {
    return localPhotos.filter((p) => p.folder_id === folderId);
  }
  return localPhotos;
}

/**
 * Create a new decoration folder
 */
export async function createShowcaseFolder(
  name: string,
  description?: string
): Promise<Folder> {
  const newFolderId = `fld-${Date.now()}`;
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();

      // Ensure root showcase event exists
      await supabase.from("events").upsert(
        {
          id: SHOWCASE_EVENT_ID,
          name: "Vasavi Events Showcase",
          customer_names: "Portfolio",
          event_type: "Showcase",
          event_date: "2026-01-01",
          cover_image_url: "",
          public_slug: "showcase",
          is_published: true,
        },
        { onConflict: "id" }
      );

      const { data, error } = await supabase
        .from("folders")
        .insert({
          event_id: SHOWCASE_EVENT_ID,
          name: name.trim(),
          description: description?.trim() || null,
          sort_order: 99,
        })
        .select()
        .single();

      if (!error && data) {
        return { ...data, photo_count: 0 } as Folder;
      }
    } catch (err) {
      console.error("Error creating showcase folder in Supabase:", err);
    }
  }

  const fallbackFolder: Folder = {
    id: newFolderId,
    event_id: SHOWCASE_EVENT_ID,
    name: name.trim(),
    description: description?.trim(),
    sort_order: localFolders.length,
    photo_count: 0,
    created_at: now,
  };
  localFolders.push(fallbackFolder);
  return fallbackFolder;
}

/**
 * Update folder name / description
 */
export async function updateShowcaseFolder(
  folderId: string,
  name: string,
  description?: string
): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { error } = await supabase
        .from("folders")
        .update({
          name: name.trim(),
          description: description !== undefined ? description.trim() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", folderId);

      if (!error) return true;
    } catch (err) {
      console.error("Error updating showcase folder:", err);
    }
  }

  const idx = localFolders.findIndex((f) => f.id === folderId);
  if (idx !== -1) {
    localFolders[idx].name = name.trim();
    if (description !== undefined) localFolders[idx].description = description.trim();
    return true;
  }
  return false;
}

/**
 * Delete folder and its photos
 */
export async function deleteShowcaseFolder(folderId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();

      // Find photos to clean up from storage
      const { data: photos } = await supabase
        .from("photos")
        .select("storage_path")
        .eq("folder_id", folderId);

      if (photos && photos.length > 0) {
        const paths = photos.map((p) => p.storage_path).filter(Boolean);
        await supabase.storage.from("event-media").remove(paths);
      }

      const { error } = await supabase
        .from("folders")
        .delete()
        .eq("id", folderId);

      if (!error) return true;
    } catch (err) {
      console.error("Error deleting showcase folder:", err);
    }
  }

  localFolders = localFolders.filter((f) => f.id !== folderId);
  localPhotos = localPhotos.filter((p) => p.folder_id !== folderId);
  return true;
}

/**
 * Add a photo to a folder
 */
export async function addShowcasePhoto(
  photoData: Omit<Photo, "id" | "created_at">
): Promise<Photo> {
  const newId = `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase
        .from("photos")
        .insert({
          event_id: SHOWCASE_EVENT_ID,
          folder_id: photoData.folder_id,
          storage_path: photoData.storage_path,
          public_url: photoData.public_url,
          filename: photoData.filename,
          file_size: photoData.file_size || null,
          width: photoData.width || null,
          height: photoData.height || null,
          sort_order: photoData.sort_order || 0,
        })
        .select()
        .single();

      if (!error && data) {
        return data as Photo;
      }
    } catch (err) {
      console.error("Error adding showcase photo to Supabase:", err);
    }
  }

  const fallback: Photo = {
    id: newId,
    event_id: SHOWCASE_EVENT_ID,
    folder_id: photoData.folder_id,
    storage_path: photoData.storage_path,
    public_url: photoData.public_url,
    filename: photoData.filename,
    file_size: photoData.file_size,
    width: photoData.width,
    height: photoData.height,
    sort_order: photoData.sort_order || 0,
    created_at: now,
  };
  localPhotos.unshift(fallback);
  return fallback;
}

/**
 * Delete a single photo
 */
export async function deleteShowcasePhoto(photoId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      
      const { data: p } = await supabase
        .from("photos")
        .select("storage_path")
        .eq("id", photoId)
        .single();

      if (p?.storage_path) {
        await supabase.storage.from("event-media").remove([p.storage_path]);
      }

      const { error } = await supabase.from("photos").delete().eq("id", photoId);
      if (!error) return true;
    } catch (err) {
      console.error("Error deleting showcase photo:", err);
    }
  }

  localPhotos = localPhotos.filter((p) => p.id !== photoId);
  return true;
}

/**
 * Move photo to another folder
 */
export async function moveShowcasePhoto(
  photoId: string,
  targetFolderId: string
): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { error } = await supabase
        .from("photos")
        .update({ folder_id: targetFolderId, updated_at: new Date().toISOString() })
        .eq("id", photoId);

      if (!error) return true;
    } catch (err) {
      console.error("Error moving showcase photo:", err);
    }
  }

  const idx = localPhotos.findIndex((p) => p.id === photoId);
  if (idx !== -1) {
    localPhotos[idx].folder_id = targetFolderId;
    return true;
  }
  return false;
}
