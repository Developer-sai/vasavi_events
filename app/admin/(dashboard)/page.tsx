import React from "react";
import { getShowcaseFolders, getShowcasePhotos } from "@/lib/db/showcase";
import { ShowcaseStudioClient } from "@/components/admin/ShowcaseStudioClient";

export const revalidate = 0; // Dynamic rendering for fresh folders & photos

export default async function AdminDashboardPage() {
  const folders = await getShowcaseFolders();
  const photos = await getShowcasePhotos();

  return (
    <div className="flex-1 flex flex-col bg-[#FAF8F5]">
      <ShowcaseStudioClient initialFolders={folders} initialPhotos={photos} />
    </div>
  );
}
