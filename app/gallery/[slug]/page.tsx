import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug, trackGalleryView } from "@/lib/db/events";
import { PublicGalleryClient } from "./PublicGalleryClient";
import { ExpiryNotice } from "@/components/gallery/ExpiryNotice";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "Gallery Not Found | Vasavi Events",
    };
  }

  return {
    title: `${event.name} | Vasavi Events`,
    description: event.description || `View photo memories from ${event.name}.`,
    openGraph: {
      title: `${event.name} — Photography Memories`,
      description: event.description || `Curated gallery of ${event.customer_names}`,
      images: [
        {
          url: event.cover_image_url,
          width: 1200,
          height: 630,
          alt: event.name,
        },
      ],
    },
  };
}

export default async function GalleryPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  // Check Expiry
  if (event.expires_at) {
    const isExpired = new Date(event.expires_at) < new Date();
    if (isExpired) {
      return (
        <ExpiryNotice
          eventName={event.name}
          expiresAt={event.expires_at}
        />
      );
    }
  }

  // Log view for analytics
  await trackGalleryView(slug);

  return <PublicGalleryClient initialEvent={event} />;
}
