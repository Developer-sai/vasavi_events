export type EventType =
  | "Wedding"
  | "Haldi"
  | "Engagement"
  | "Reception"
  | "Couple Shoot"
  | "Birthday Shoot"
  | "Half Saree Ceremony"
  | "Engagement Teasers"
  | "Other";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  business_name?: string;
  created_at: string;
}

export interface Folder {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  sort_order: number;
  photo_count?: number;
  created_at: string;
}

export interface Photo {
  id: string;
  event_id: string;
  folder_id: string;
  storage_path: string;
  public_url: string;
  filename: string;
  file_size?: number;
  width?: number;
  height?: number;
  sort_order: number;
  created_at: string;
}

export interface EventItem {
  id: string;
  owner_id?: string;
  name: string;
  customer_names: string;
  event_type: EventType | string;
  event_date: string;
  description?: string;
  cover_image_url: string;
  public_slug: string;
  expires_at: string | null; // ISO date string or null = never expires
  is_published: boolean;
  view_count?: number;
  created_at: string;
  updated_at: string;
  folders?: Folder[];
  photos?: Photo[];
}

export interface GalleryView {
  id: string;
  event_id: string;
  session_hash: string;
  folder_id?: string | null;
  referrer?: string | null;
  user_agent?: string | null;
  viewed_at: string;
}

export interface AnalyticsSummary {
  total_events: number;
  active_events: number;
  expired_events: number;
  total_folders: number;
  total_photos: number;
  total_views: number;
  views_over_time: { date: string; views: number }[];
  top_events: {
    id: string;
    name: string;
    slug: string;
    views: number;
    photos: number;
    event_date: string;
    status: "Active" | "Expired" | "Draft";
  }[];
}
