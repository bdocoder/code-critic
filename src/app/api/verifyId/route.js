import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @param {NextRequest} req
 */
export async function POST(req) {
  const id = await req.text();
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return new NextResponse("", { status: user ? 200 : 404 });
  } catch {
    return new NextResponse("", { status: 500 });
  }
}
