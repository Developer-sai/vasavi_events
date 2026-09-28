"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandEmblem } from "@/components/common/BrandEmblem";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#12100E] text-[#FAF8F5] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-[#1A1714] border border-[#262320] rounded-2xl p-8 sm:p-10 shadow-2xl">
        <BrandEmblem size="sm" subtitle="PASSWORD RECOVERY" theme="dark" />

        <div className="text-center my-6">
          <h2 className="font-serif text-2xl text-[#FAF8F5]">Reset Password</h2>
          <p className="text-xs text-[#FAF8F5]/60 mt-1 font-sans">
            Enter your admin email and we'll send a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs font-medium text-emerald-300">
              Reset instructions sent to {email}
            </p>
            <p className="text-[11px] text-[#FAF8F5]/60 mt-1">
              Check your inbox and follow the link to set a new password.
            </p>
            <Link
              href="/admin/login"
              className="inline-block mt-4 text-xs text-[#C59350] hover:underline"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            <div>
              <label className="block text-[#FAF8F5]/80 font-medium mb-1.5 uppercase tracking-wider text-[10px]">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6F64]" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-[#262320] rounded-xl py-3 pl-10 pr-4 text-[#FAF8F5] placeholder-[#7A6F64] outline-none focus:border-[#C59350] transition"
                  placeholder="name@vasavievents.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C59350] to-[#D1A870] hover:from-[#B58340] hover:to-[#C59350] text-[#12100E] font-semibold text-xs tracking-wider uppercase transition cursor-pointer"
            >
              Send Password Reset Link
            </button>

            <div className="text-center pt-2">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#FAF8F5]/60 hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
