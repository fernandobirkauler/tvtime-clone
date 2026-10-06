import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token && (req.nextUrl.pathname.startsWith("/watchlist") || req.nextUrl.pathname.startsWith("/stats"))) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/watchlist/:path*", "/stats/:path*"],
};
