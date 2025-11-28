import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  try {
    const isLoggedIn = !!req.auth;
    const isOnLogin = req.nextUrl.pathname.startsWith("/login");
    const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth");

    // Allow API auth routes
    if (isApiAuth) {
      return NextResponse.next();
    }

    if (!isLoggedIn && !isOnLogin) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isLoggedIn && isOnLogin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, allow access to login page
    if (req.nextUrl.pathname.startsWith("/login")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

