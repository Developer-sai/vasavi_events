"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandEmblem } from "@/components/common/BrandEmblem";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { createClient as createBrowserSupabase } from "@/lib/supabase/client";
import { bootstrapAdminUser, setAdminSessionAction } from "@/actions/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@vasavievents.com");
  const [password, setPassword] = useState("admin123");
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showBootstrapAction, setShowBootstrapAction] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setShowBootstrapAction(false);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isLiveSupabase = Boolean(
      supabaseUrl && !supabaseUrl.includes("placeholder.supabase.co")
    );

    if (isLiveSupabase) {
      try {
        const supabase = createBrowserSupabase();

        if (mode === "register") {
          // Attempt server-side admin bootstrap first for immediate confirmation
          const bootRes = await bootstrapAdminUser(email, password);
          if (bootRes.success) {
            setSuccessMsg(bootRes.message);
            // Sign in directly
            const { error: signInErr } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (!signInErr) {
              localStorage.setItem("vasavi_admin_session", "active");
              setTimeout(() => {
                router.push("/admin");
              }, 800);
              return;
            }
          } else {
            // Fallback to standard client signUp
            const { error: signUpErr } = await supabase.auth.signUp({
              email,
              password,
            });
            if (signUpErr) {
              setErrorMsg(signUpErr.message);
              setIsLoading(false);
              return;
            }
            setSuccessMsg("Account registered! Please sign in or check your email.");
            setMode("signin");
            setIsLoading(false);
            return;
          }
        } else {
          // Standard Sign In
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            setErrorMsg(error.message);
            if (
              error.message.toLowerCase().includes("invalid login credentials") ||
              error.message.toLowerCase().includes("email not confirmed")
            ) {
              setShowBootstrapAction(true);
            }
            setIsLoading(false);
            return;
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg("Authentication error");
        }
        setIsLoading(false);
        return;
      }
    }

    // Set authenticated session cookie and storage
    await setAdminSessionAction();
    if (typeof document !== "undefined") {
      document.cookie = "vasavi_admin_session=active; path=/; max-age=604800; SameSite=Lax";
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("vasavi_admin_session", "active");
    }

    setTimeout(() => {
      setIsLoading(false);
      router.push("/admin");
    }, 400);
  };

  const handleInstantBootstrap = async () => {
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("Initializing admin account in Supabase...");

    const res = await bootstrapAdminUser(email, password);
    if (res.success) {
      setSuccessMsg(res.message);
      try {
        const supabase = createBrowserSupabase();
        await supabase.auth.signInWithPassword({ email, password });
      } catch {
        // ignore
      }
      await setAdminSessionAction();
      if (typeof document !== "undefined") {
        document.cookie = "vasavi_admin_session=active; path=/; max-age=604800; SameSite=Lax";
      }
      localStorage.setItem("vasavi_admin_session", "active");
      setTimeout(() => {
        router.push("/admin");
      }, 700);
    } else {
      setErrorMsg(res.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12100E] text-[#FAF8F5] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C59350]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#1A1714] border border-[#262320] rounded-2xl p-8 sm:p-10 shadow-2xl">
        <BrandEmblem size="sm" subtitle="ADMIN PORTAL" theme="dark" />

        <div className="text-center my-6">
          <h2 className="font-serif text-2xl text-[#FAF8F5]">Vasavi Events Studio</h2>
          <p className="text-xs text-[#FAF8F5]/60 mt-1 font-sans">
            {mode === "signin"
              ? "Sign in to manage client galleries, upload event photos, and view analytics."
              : "Register your administrative master credentials for Supabase."}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex rounded-xl bg-black/40 p-1 mb-6 border border-[#262320]">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMsg("");
              setSuccessMsg("");
              setShowBootstrapAction(false);
            }}
            className={`flex-1 py-1.5 text-xs font-sans rounded-lg font-medium transition cursor-pointer ${
              mode === "signin"
                ? "bg-[#C59350] text-[#12100E] shadow-sm"
                : "text-[#FAF8F5]/60 hover:text-[#FAF8F5]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg("");
              setSuccessMsg("");
              setShowBootstrapAction(false);
            }}
            className={`flex-1 py-1.5 text-xs font-sans rounded-lg font-medium transition cursor-pointer ${
              mode === "register"
                ? "bg-[#C59350] text-[#12100E] shadow-sm"
                : "text-[#FAF8F5]/60 hover:text-[#FAF8F5]"
            }`}
          >
            First-Time Setup
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            {showBootstrapAction && (
              <div className="mt-1 pt-2 border-t border-rose-500/20 flex flex-col gap-2">
                <p className="text-[11px] text-rose-200/80">
                  New Supabase database? Click below to automatically create and verify this admin account:
                </p>
                <button
                  type="button"
                  onClick={handleInstantBootstrap}
                  disabled={isLoading}
                  className="w-full py-2 px-3 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-[11px] font-medium transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Admin User in Supabase Now</span>
                </button>
              </div>
            )}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 font-sans text-xs">
          <div>
            <label className="block text-[#FAF8F5]/80 font-medium mb-1.5 uppercase tracking-wider text-[10px]">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6F64]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-[#262320] rounded-xl py-3 pl-10 pr-4 text-[#FAF8F5] placeholder-[#7A6F64] outline-none focus:border-[#C59350] transition"
                placeholder="admin@vasavievents.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[#FAF8F5]/80 font-medium uppercase tracking-wider text-[10px]">
                Password
              </label>
              {mode === "signin" && (
                <Link
                  href="/admin/forgot-password"
                  className="text-[10px] text-[#C59350] hover:underline"
                >
                  Forgot Password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6F64]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-[#262320] rounded-xl py-3 pl-10 pr-4 text-[#FAF8F5] placeholder-[#7A6F64] outline-none focus:border-[#C59350] transition"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C59350] to-[#D1A870] hover:from-[#B58340] hover:to-[#C59350] text-[#12100E] font-semibold text-xs tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>
                  {mode === "signin"
                    ? "Sign In to Dashboard"
                    : "Create Admin Account & Launch"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>


        <div className="mt-6 pt-5 border-t border-[#262320] text-center">
          <div className="inline-flex items-center gap-2 text-[11px] text-[#FAF8F5]/50">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C59350]" />
            Protected by Supabase Authentication & RLS
          </div>
        </div>
      </div>
    </div>
  );
}
