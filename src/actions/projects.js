"use server";

import prisma from "@/db";
import { getUserId } from "@/utils/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * @param {FormData} data
 */
export async function createProject(_, data) {
  const id = getUserId();
  const title = data.get("title");
  const description = data.get("description") || undefined;
  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        members: { create: { userId: id, isAdmin: true } },
      },
    });
    redirect(`/projects/${project.id}`);
  } catch (e) {
    console.error(e);
    return { error: "An error occurred" };
  }
}

/**
 * @param {FormData} data
 */
export async function addMember(_, data) {
  const email = data.get("email");
  const role = data.get("role");
  const projectId = data.get("projectId");

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) return { error: "A user with that email doesn't exist" };

  const profile = await prisma.memberProfile.findFirst({
    where: { AND: [{ projectId }, { userId: user.id }] },
  });
  if (profile) return { error: "This user is already a member" };

  await prisma.memberProfile.create({
    data: { projectId, role, userId: user.id },
  });
  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}
