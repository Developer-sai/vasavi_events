import React from "react";
import Link from "next/link";
import { PlusCircle, ExternalLink } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

export function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  const ActionIcon = action?.icon || PlusCircle;

  return (
    <header className="bg-white border-b border-[#EBE6DF] px-6 py-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1714] font-medium">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#7A6F64] mt-0.5 font-sans">{subtitle}</p>
          )}
        </div>

        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1714] hover:bg-[#262320] text-[#FAF8F5] text-xs font-sans font-medium transition shadow-xs w-fit"
          >
            <ActionIcon className="w-4 h-4 text-[#C59350]" />
            {action.label}
          </Link>
        )}
      </div>
    </header>
  );
}
