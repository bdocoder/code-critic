"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * @param {FormData} data
 */
export async function createIssue(_, data) {
  const session = await auth();
  const reporterId = session.user.id;

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
    data: {
      status: issue.status === "open" ? "closed" : "open",
      dateResolved: issue.status === "open" ? new Date() : null,
    },
  });
  revalidatePath(`/projects/${issue.projectId}`, "layout");
}

/**
 * @param {FormData} data
 */
export async function addComment({ issueId, userId, projectId }, _, data) {
  const content = data.get("comment");
  await prisma.comment.create({
    data: { content, userId, issueId },
  });
  revalidatePath(`/projects/${projectId}/${issueId}`);
}

/**
 * @param {FormData} data
 */
export async function deleteComment({ commentId, issueId, projectId }) {
  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/projects/${projectId}/${issueId}`);
}
