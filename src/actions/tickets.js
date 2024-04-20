"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * @param {FormData} data
 */
export async function createTicket(_, data) {
  const session = await auth();
  const reporterId = session.user.id;

  const title = data.get("title");
  const description = data.get("description") || undefined;
  const projectId = data.get("projectId");
  const assigneeId = data.get("assigneeId") || undefined;

  const ticket = await prisma.ticket.create({
    data: { title, description, projectId, reporterId, assigneeId },
  });
  if (assigneeId)
    await prisma.notification.create({
      data: {
        type: "ticket_assign",
        resourceId: ticket.id,
        userId: assigneeId,
      },
    });
  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}

/**
 * @param {FormData} data
 */
export async function assignTicket(_, data) {
  const ticketId = data.get("ticketId");
  const projectId = data.get("projectId");
  const assigneeId = data.get("assigneeId");
  await prisma.ticket.update({ where: { id: ticketId }, data: { assigneeId } });
  await prisma.notification.deleteMany({
    where: {
      type: "ticket_assign",
      resourceId: ticketId,
    },
  });
  await prisma.notification.create({
    data: {
      type: "ticket_assign",
      resourceId: ticketId,
      userId: assigneeId,
    },
  });

  revalidatePath(`/projects/${projectId}/${ticketId}`);
  redirect(`/projects/${projectId}/${ticketId}`);
}

export async function deleteTicket({ ticketId, projectId }) {
  const commentIds = (
    await prisma.comment.findMany({ where: { ticketId } })
  ).map(({ id }) => id);
  await prisma.notification.deleteMany({
    where: { type: "ticket_comment", resourceId: { in: commentIds } },
  });
  await prisma.comment.deleteMany({ where: { ticketId } });
  await prisma.ticket.delete({ where: { id: ticketId } });
  await prisma.notification.deleteMany({
    where: { resourceId: ticketId },
  });

  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}

export async function reverseTicketStatus(ticketId) {
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: ticket.status === "open" ? "closed" : "open",
      dateResolved: ticket.status === "open" ? new Date() : null,
    },
  });
  revalidatePath(`/projects/${ticket.projectId}`, "layout");
}

/**
 * @param {FormData} data
 */
export async function addComment({ ticketId, userId, projectId }, _, data) {
  const content = data.get("comment");
  const comment = await prisma.comment.create({
    data: { content, userId, ticketId },
  });
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });
  await prisma.notification.create({
    data: {
      type: "ticket_comment",
      resourceId: comment.id,
      userId: ticket.reporterId,
    },
  });
  revalidatePath(`/projects/${projectId}/${ticketId}`);
}

/**
 * @param {FormData} data
 */
export async function deleteComment({ commentId, ticketId, projectId }) {
  await prisma.notification.deleteMany({
    where: {
      resourceId: commentId,
    },
  });
  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/projects/${projectId}/${ticketId}`);
}
