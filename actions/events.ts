"use server";

import {
  createEvent,
  updateEvent,
  deleteEvent,
  createFolder,
  updateFolder,
  deleteFolder,
  addPhoto,
  deletePhoto,
  movePhoto,
  trackGalleryView,
} from "@/lib/db/events";
import { EventItem, Folder, Photo } from "@/types";
import { revalidatePath } from "next/cache";

export async function createEventAction(eventData: Partial<EventItem>): Promise<EventItem> {
  const created = await createEvent(eventData);
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath("/");
  return created;
}

export async function updateEventAction(id: string, updates: Partial<EventItem>): Promise<EventItem | null> {
  const updated = await updateEvent(id, updates);
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  if (updated?.public_slug) {
    revalidatePath(`/gallery/${updated.public_slug}`);
  }
  revalidatePath("/");
  return updated;
}

export async function deleteEventAction(id: string): Promise<boolean> {
  const success = await deleteEvent(id);
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath("/");
  return success;
}

export async function createFolderAction(eventId: string, name: string, description?: string): Promise<Folder> {
  const created = await createFolder(eventId, name, description);
  revalidatePath(`/admin/events/${eventId}`);
  return created;
}

export async function updateFolderAction(folderId: string, name: string, description?: string): Promise<boolean> {
  const success = await updateFolder(folderId, name, description);
  return success;
}

export async function deleteFolderAction(folderId: string): Promise<boolean> {
  const success = await deleteFolder(folderId);
  return success;
}

export async function addPhotoAction(photoData: Omit<Photo, "id" | "created_at">): Promise<Photo> {
  const added = await addPhoto(photoData);
  revalidatePath(`/admin/events/${photoData.event_id}`);
  return added;
}

export async function deletePhotoAction(photoId: string): Promise<boolean> {
  const success = await deletePhoto(photoId);
  return success;
}

export async function movePhotoAction(photoId: string, newFolderId: string): Promise<boolean> {
  const success = await movePhoto(photoId, newFolderId);
  return success;
}

export async function trackGalleryViewAction(slug: string, folderId?: string): Promise<void> {
  await trackGalleryView(slug, folderId);
  revalidatePath(`/gallery/${slug}`);
}
