"use server";

import {
  createShowcaseFolder,
  updateShowcaseFolder,
  deleteShowcaseFolder,
  addShowcasePhoto,
  deleteShowcasePhoto,
  moveShowcasePhoto,
  getShowcaseFolders,
  getShowcasePhotos,
} from "@/lib/db/showcase";
import { Folder, Photo } from "@/types";
import { revalidatePath } from "next/cache";

export async function createShowcaseFolderAction(
  name: string,
  description?: string
): Promise<Folder> {
  const created = await createShowcaseFolder(name, description);
  revalidatePath("/");
  revalidatePath("/admin");
  return created;
}

export async function updateShowcaseFolderAction(
  folderId: string,
  name: string,
  description?: string
): Promise<boolean> {
  const success = await updateShowcaseFolder(folderId, name, description);
  revalidatePath("/");
  revalidatePath("/admin");
  return success;
}

export async function deleteShowcaseFolderAction(folderId: string): Promise<boolean> {
  const success = await deleteShowcaseFolder(folderId);
  revalidatePath("/");
  revalidatePath("/admin");
  return success;
}

export async function addShowcasePhotoAction(
  photoData: Omit<Photo, "id" | "created_at">
): Promise<Photo> {
  const added = await addShowcasePhoto(photoData);
  revalidatePath("/");
  revalidatePath("/admin");
  return added;
}

export async function deleteShowcasePhotoAction(photoId: string): Promise<boolean> {
  const success = await deleteShowcasePhoto(photoId);
  revalidatePath("/");
  revalidatePath("/admin");
  return success;
}

export async function moveShowcasePhotoAction(
  photoId: string,
  targetFolderId: string
): Promise<boolean> {
  const success = await moveShowcasePhoto(photoId, targetFolderId);
  revalidatePath("/");
  revalidatePath("/admin");
  return success;
}

export async function refreshLiveWebsiteAction(): Promise<boolean> {
  revalidatePath("/");
  revalidatePath("/admin");
  return true;
}

