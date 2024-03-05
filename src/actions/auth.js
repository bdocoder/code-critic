"use server";

import { signIn, signOut } from "@/auth";

export async function loginWithGitHub() {
  await signIn("github", { redirect: true, redirectTo: "/" });
}

export async function logout() {
  await signOut({ redirect: true, redirectTo: "/auth" });
}

export async function loginWithDemoAccount(email) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("redirect", true);
  formData.append("redirectTo", "/");
  await signIn("credentials", formData);
}
