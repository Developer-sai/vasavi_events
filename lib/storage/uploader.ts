import { createClient as createBrowserSupabase } from "@/lib/supabase/client";

export interface UploadResult {
  publicUrl: string;
  storagePath: string;
  filename: string;
  fileSize: number;
}

export async function uploadPhotoFile(
  file: File,
  eventId: string,
  folderId: string
): Promise<UploadResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured = Boolean(supabaseUrl && !supabaseUrl.includes("placeholder.supabase.co"));

  const fileExt = file.name.split(".").pop();
  const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
  const storagePath = `events/${eventId}/folders/${folderId}/${cleanFileName}`;

  if (isConfigured) {
    try {
      const supabase = createBrowserSupabase();
      const { data, error } = await supabase.storage
        .from("event-media")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!error && data) {
        const { data: publicData } = supabase.storage
          .from("event-media")
          .getPublicUrl(storagePath);

        return {
          publicUrl: publicData.publicUrl,
          storagePath,
          filename: file.name,
          fileSize: file.size,
        };
      }
    } catch {
      // Fallback
    }
  }

  // Fallback for local demo preview using browser Object URL
  const objectUrl = URL.createObjectURL(file);
  return {
    publicUrl: objectUrl,
    storagePath,
    filename: file.name,
    fileSize: file.size,
  };
}
