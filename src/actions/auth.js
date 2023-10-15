"use server";

import prisma from "@/db";
import { signJWT } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function proceed(id) {
  const token = await signJWT({ sub: id });
  cookies().set("token", token, { expires: Date.now() + 1000 * 86400 * 30 });
  revalidatePath("/");
  redirect("/");
}

/**
 * @param {FormData} data
 */
export async function login(_, data) {
  const email = data.get("email");
  const password = data.get("password");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "A user with that email doesn't exist" };
  if (user.password !== password) return { error: "The password is wrong" };

  await proceed(user.id);
}
/**
 * @param {FormData} data
 */
export async function register(_, data) {
  const name = data.get("name");
  const email = data.get("email");
  const password = data.get("password");

  const exists = !!(await prisma.user.findUnique({ where: { email } }));
  if (exists) return { error: "A user with that email already exists" };

  const user = await prisma.user.create({ data: { email, name, password } });
  await proceed(user.id);
}

export async function logout() {
  cookies().delete("token");
}

export async function demoLogin(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  await proceed(user.id);
}
