import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @param {NextRequest} req
 */
export async function POST(req) {
  const id = await req.text();
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return NextResponse.json(!!user);
}
