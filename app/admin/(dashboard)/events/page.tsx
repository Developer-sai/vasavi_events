import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getEvents } from "@/lib/db/events";
import { EventsListClient } from "./EventsListClient";
import { PlusCircle } from "lucide-react";

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <div className="flex-1 flex flex-col bg-[#FAF8F5]">
      <AdminHeader
        title="Event Galleries"
        subtitle="Browse, search, and manage all your client photo delivery links."
        action={{
          label: "New Event",
          href: "/admin/events/new",
          icon: PlusCircle,
        }}
      />

      <EventsListClient initialEvents={events} />
    </div>
  );
}
