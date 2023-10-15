import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/auth";

/**
 * @param {NextRequest} req
 */
export async function middleware(req) {
  const headers = new Headers(req.headers);

  const token = req.cookies.get("token")?.value;
  if (token) {
    try {
      const id = await verifyToken(token);
      if (id) {
        const res = await fetch(req.nextUrl.origin + "/api/verifyId", {
          body: id,
          method: "POST",
        });
        if (res.status === 200) headers.set("x-user-id", id);
        else req.cookies.delete("token");
      }
    } catch (e) {
      console.error(e);
      req.cookies.delete("token");
    }
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
