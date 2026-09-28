import { NextRequest, NextResponse } from "next/server";
import { trackGalleryView } from "@/lib/db/events";

export async function POST(req: NextRequest) {
  try {
    const { slug, folderId } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    await trackGalleryView(slug, folderId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
