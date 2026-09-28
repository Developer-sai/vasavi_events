"use client";

import React, { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { X, Copy, Check, Share2, MessageCircle, Download } from "lucide-react";
import confetti from "canvas-confetti";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  slug: string;
}

export function ShareModal({ isOpen, onClose, eventTitle, slug }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const galleryUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/gallery/${slug}`
      : `https://vasavi-events.vercel.app/gallery/${slug}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(galleryUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: "#1A1714",
          light: "#FAF8F5",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch(console.error);
    }
  }, [isOpen, galleryUrl]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(galleryUrl);
      setCopied(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#D1A870", "#C59350", "#FAF8F5"],
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `✨ View the complete wedding memories of ${eventTitle} here:\n${galleryUrl}\n\nPowered by Vasavi Events`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${eventTitle} - Gallery`,
          text: `View the wedding memories of ${eventTitle} on Vasavi Events`,
          url: galleryUrl,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopy();
    }
  };

  const downloadQrCode = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${slug}-qr-code.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FAF8F5] border border-[#EBE6DF] shadow-2xl rounded-2xl p-6 text-[#1A1714]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7A6F64] hover:text-[#1A1714] rounded-full hover:bg-black/5 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#C59350] font-semibold">
            Share Gallery Link
          </span>
          <h3 className="font-serif text-2xl font-medium mt-1">{eventTitle}</h3>
          <p className="text-xs text-[#7A6F64] mt-1">
            Anyone with this link can view photos instantly with zero login.
          </p>
        </div>

        {/* QR Code Card */}
        <div className="flex flex-col items-center justify-center p-4 bg-white border border-[#EBE6DF] rounded-xl shadow-xs mb-5">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`${eventTitle} QR code`}
              className="w-44 h-44 rounded-lg"
            />
          ) : (
            <div className="w-44 h-44 flex items-center justify-center bg-[#FAF8F5] text-xs text-[#7A6F64]">
              Generating QR...
            </div>
          )}
          <button
            onClick={downloadQrCode}
            className="flex items-center gap-1.5 text-xs text-[#7A6F64] hover:text-[#C59350] mt-3 font-medium transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download QR Code for Hall Display
          </button>
        </div>

        {/* Link Input & Copy */}
        <div className="flex items-center gap-2 bg-white border border-[#EBE6DF] rounded-xl p-1.5 pl-3 mb-4 shadow-xs">
          <input
            type="text"
            readOnly
            value={galleryUrl}
            className="w-full text-xs text-[#1A1714] bg-transparent outline-none truncate font-mono"
          />
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-[#1A1714] hover:bg-[#262320] text-[#FAF8F5]"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Link
              </>
            )}
          </button>
        </div>

        {/* Quick Social Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-medium text-xs rounded-xl transition"
          >
            <MessageCircle className="w-4 h-4" />
            Share WhatsApp
          </button>

          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-black/5 hover:bg-black/10 text-[#1A1714] font-medium text-xs rounded-xl transition"
          >
            <Share2 className="w-4 h-4" />
            Share Options
          </button>
        </div>
      </div>
    </div>
  );
}
