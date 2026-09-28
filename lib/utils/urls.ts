/**
 * URL Utilities for Vasavi Events
 * Resolves the correct client-facing public domain for galleries, QR codes, and WhatsApp sharing.
 */

export function getClientBaseUrl(): string {
  // 1. If explicit env variable is set (e.g. in Vercel or .env)
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_APP_URL) {
    const envUrl = process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
    // If testing locally in the browser, stay on localhost
    if (
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    ) {
      return window.location.origin;
    }
    return envUrl;
  }

  // 2. Browser runtime resolution
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    const hostname = window.location.hostname;

    // Localhost / Development
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return origin;
    }

    // If on admin domain or subdomain, always route to client production domain
    if (hostname.includes("vasavievents-admin")) {
      return "https://vasavievents.vercel.app";
    }
    if (hostname.startsWith("admin.")) {
      return `${window.location.protocol}//${hostname.replace(/^admin\./, "")}${
        window.location.port ? `:${window.location.port}` : ""
      }`;
    }
    if (hostname.includes("-admin.")) {
      return `${window.location.protocol}//${hostname.replace("-admin.", ".")}${
        window.location.port ? `:${window.location.port}` : ""
      }`;
    }

    return origin;
  }

  // 3. Fallback for SSR
  return "https://vasavievents.vercel.app";
}

export function getPublicGalleryUrl(slug: string): string {
  const base = getClientBaseUrl();
  const cleanSlug = slug.replace(/^\/+/, "");
  return `${base}/gallery/${cleanSlug}`;
}
