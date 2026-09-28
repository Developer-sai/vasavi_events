import React from "react";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/db/events";
import { EventStudioClient } from "./EventStudioClient";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PlusCircle } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEventStudioPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col bg-[#FAF8F5]">
      <AdminHeader
        title={`Studio: ${event.name}`}
        subtitle={`Organize ceremonial folders, upload high-resolution images, and manage share links.`}
      />

      <EventStudioClient initialEvent={event} />
    </div>
  );
}
