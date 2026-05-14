import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Public paths that never need auth checks
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/recovery",
  "/_next",
  "/images",
  "/favicon.ico",
  "/api",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Fast-path: only run Supabase logic when needed
  const hasSbCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-"));

  // Auth redirect pages — if already logged in, go to dashboard
  if (pathname === "/login" || pathname === "/register") {
    if (hasSbCookie) {
      const { user } = await updateSession(request);
      if (user) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Protected: /dashboard, /portal/*
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/portal")) {
    const { supabaseResponse, user } = await updateSession(request);
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  // Protected admin: /admin/*
  if (pathname.startsWith("/admin")) {
    const { supabaseResponse, user, supabase } = await updateSession(request);
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return supabaseResponse;
  }

  // All other paths — refresh session if cookie present
  if (hasSbCookie) {
    const { supabaseResponse } = await updateSession(request);
    return supabaseResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
