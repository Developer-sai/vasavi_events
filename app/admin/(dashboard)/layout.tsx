import React from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("vasavi_admin_session")?.value;

  let hasSupabaseUser = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) hasSupabaseUser = true;
  } catch {
    // ignore
  }

  // Strict Authentication Guard: Protect all admin pages
  if (!hasSupabaseUser && sessionCookie !== "active") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row text-[#1A1714]">
      {/* Sidebar for Desktop */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
