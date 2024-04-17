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

  const issue = await prisma.issue.create({
    data: { title, description, projectId, reporterId, assigneeId },
  });
  if (assigneeId)
    await prisma.notification.create({
      data: {
        type: "issue_assign",
        resourceId: issue.id,
        userId: assigneeId,
      },
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
  await prisma.notification.deleteMany({
    where: {
      type: "issue_assign",
      resourceId: issueId,
    },
  });
  await prisma.notification.create({
    data: {
      type: "issue_assign",
      resourceId: issueId,
      userId: assigneeId,
    },
  });

  revalidatePath(`/projects/${projectId}/${issueId}`);
  redirect(`/projects/${projectId}/${issueId}`);
}

export async function deleteIssue({ issueId, projectId }) {
  const commentIds = (
    await prisma.comment.findMany({ where: { issueId } })
  ).map(({ id }) => id);
  await prisma.notification.deleteMany({
    where: { type: "issue_comment", resourceId: { in: commentIds } },
  });
  await prisma.issue.delete({ where: { id: issueId } });
  await prisma.notification.deleteMany({
    where: { resourceId: issueId },
  });

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
  const comment = await prisma.comment.create({
    data: { content, userId, issueId },
  });
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
  });
  await prisma.notification.create({
    data: {
      type: "issue_comment",
      resourceId: comment.id,
      userId: issue.reporterId,
    },
  });
  revalidatePath(`/projects/${projectId}/${issueId}`);
}

/**
 * @param {FormData} data
 */
export async function deleteComment({ commentId, issueId, projectId }) {
  await prisma.notification.deleteMany({
    where: {
      resourceId: commentId,
    },
  });
  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/projects/${projectId}/${issueId}`);
}
