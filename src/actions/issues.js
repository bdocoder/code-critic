"use server";

import prisma from "@/db";
import { getUserId } from "@/utils/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * @param {FormData} data
 */
export async function createIssue(_, data) {
  const reporterId = getUserId();

  const title = data.get("title");
  const description = data.get("description") || undefined;
  const projectId = data.get("projectId");
  const assigneeId = data.get("assigneeId") || undefined;

  await prisma.issue.create({
    data: { title, description, projectId, reporterId, assigneeId },
  });
  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}

/**
 * @param {FormData} data
 */
export async function assignIssue(_, data) {
  const issueId = data.get("issueId");
  const projectId = data.get("projectId");
  const assigneeId = data.get("assigneeId");
  await prisma.issue.update({ where: { id: issueId }, data: { assigneeId } });

  revalidatePath(`/projects/${projectId}/${issueId}`);
  redirect(`/projects/${projectId}/${issueId}`);
}

export async function deleteIssue({ issueId, projectId }) {
  await prisma.issue.delete({ where: { id: issueId } });

  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}

export async function reverseIssueStatus(issueId) {
  const issue = await prisma.issue.findUnique({ where: { id: issueId } });
  await prisma.issue.update({
    where: { id: issueId },
    data: { status: issue.status === "open" ? "closed" : "open" },
  });
}
