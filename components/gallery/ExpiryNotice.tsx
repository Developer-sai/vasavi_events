"use client";

import React from "react";
import Link from "next/link";
import { BrandEmblem } from "@/components/common/BrandEmblem";
import { formatDateTime } from "@/lib/utils/format";
import { Clock, Phone, ArrowLeft } from "lucide-react";

interface ExpiryNoticeProps {
  eventName: string;
  expiresAt: string;
}

export function ExpiryNotice({ eventName, expiresAt }: ExpiryNoticeProps) {
  return (
    <div className="min-h-screen bg-[#12100E] text-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-lg w-full bg-[#1A1714] border border-[#262320] rounded-2xl p-8 sm:p-10 shadow-2xl">
        <BrandEmblem size="sm" subtitle="DIGITAL ARCHIVE" theme="dark" />

        <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-[#C59350] my-4">
          <Clock className="w-8 h-8 stroke-1" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#FAF8F5]">
          This Gallery Is No Longer Available
        </h2>

        <p className="text-sm text-[#FAF8F5]/70 mt-2 font-sans">
          The public viewing window for <span className="text-[#C59350] font-medium">{eventName}</span> concluded on{" "}
          <span className="font-mono text-xs">{formatDateTime(expiresAt)}</span>.
        </p>

        <div className="my-6 p-4 rounded-xl bg-black/40 border border-[#262320] text-xs text-[#FAF8F5]/60 text-left">
          <p className="font-medium text-[#FAF8F5]/90 mb-1">Need access to these memories?</p>
          <p>
            Please contact Subbu or Vasavi Events management to request an extension or an archived download drive.
          </p>
          <div className="flex items-center gap-2 mt-3 text-[#C59350] font-medium">
            <Phone className="w-3.5 h-3.5" />
            +91 98480 22338 / Subbu Management
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#262320] hover:bg-[#383430] text-[#FAF8F5] text-xs font-sans font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vasavi Events Home
        </Link>
      </div>
    </div>
  );
}
