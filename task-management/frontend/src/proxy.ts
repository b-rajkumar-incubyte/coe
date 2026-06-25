import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Optimistic auth check: redirect to /login when the token cookie is absent.
// Real verification happens at the NestJS guard — this is only a UX gate.
export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tasks/:path*"],
};
