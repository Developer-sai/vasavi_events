import React from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

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
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1714]">
      {children}
    </div>
  );
}
