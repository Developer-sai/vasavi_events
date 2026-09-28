"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarHeart,
  PlusCircle,
  BarChart3,
  ExternalLink,
  LogOut,
  Camera,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/events", label: "All Events", icon: CalendarHeart },
    { href: "/admin/events/new", label: "Create Event", icon: PlusCircle },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-[#12100E] border-r border-[#262320] text-[#FAF8F5] flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#262320]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#C59350] to-[#EBD8BD] flex items-center justify-center text-[#12100E] font-serif font-bold text-base shadow-xs">
              V
            </div>
            <div>
              <h1 className="font-serif tracking-widest text-sm uppercase font-bold text-[#FAF8F5]">
                Vasavi Events
              </h1>
              <p className="text-[10px] tracking-wider uppercase text-[#C59350] font-sans font-medium">
                Subbu Studio Admin
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 font-sans">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? "bg-[#C59350] text-[#12100E] font-semibold shadow-xs"
                    : "text-[#FAF8F5]/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#12100E]" : "text-[#C59350]"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile / Quick Links */}
      <div className="p-4 border-t border-[#262320] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#FAF8F5]/60 hover:text-[#FAF8F5] hover:bg-white/5 transition"
        >
          <span className="flex items-center gap-2">
            <Camera className="w-3.5 h-3.5 text-[#C59350]" />
            View Public Site
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="pt-2 flex items-center justify-between px-3.5 py-2 rounded-xl bg-black/30 border border-[#262320]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#C59350]/20 border border-[#C59350]/40 flex items-center justify-center text-[#C59350] font-semibold text-xs">
              S
            </div>
            <div>
              <p className="text-xs font-medium text-[#FAF8F5]">Subbu</p>
              <p className="text-[10px] text-[#FAF8F5]/50 truncate max-w-[100px]">
                admin@vasavi.com
              </p>
            </div>
          </div>
          <Link
            href="/admin/login"
            className="p-1.5 text-[#FAF8F5]/50 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
