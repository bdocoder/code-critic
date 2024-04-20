import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

async function isUserValid(id, origin) {
  if (!id) return false;
  const res = await fetch(origin + "/api/is-user-valid", {
    body: id,
    method: "POST",
  });
  return await res.json();
}

/**
 * @param {NextRequest} req
 */
export async function middleware(req) {
  const session = await auth();
  if (
    !req.nextUrl.pathname.startsWith("/auth") &&
    (!session?.user ||
      !(await isUserValid(session?.user?.id, req.nextUrl.origin)))
  ) {
    const response = NextResponse.redirect(
      new URL("/auth", req.nextUrl.origin)
    );
    if (session?.user) {
      response.cookies.delete("authjs.session-token");
    }
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
