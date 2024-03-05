import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const middleware = auth((req) => {
  if (!req.auth?.user && !req.nextUrl.pathname.startsWith("/auth"))
    return NextResponse.redirect(new URL("/auth", req.nextUrl.origin));
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
