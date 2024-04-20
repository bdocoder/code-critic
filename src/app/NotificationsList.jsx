import ActionButton from "@/components/ActionButton";
import prisma from "@/db";
import { cn } from "@/utils/ui";
import { redirect } from "next/navigation";

/**
 * @param {{notifications: import("@prisma/client").Notification[]}} props
 */
export default async function Notifications({ notifications: _notifications }) {
  const notifications = await Promise.all(
    _notifications.map(async ({ type, resourceId, ...rest }) => {
      let text, url;
      if (type === "project_add") {
        const project = await prisma.project.findUnique({
          where: { id: resourceId },
        });
        text = `You have been added to a project: ${project.title}`;
        url = `/projects/${project.id}`;
      }
      if (type === "ticket_assign") {
        const ticket = await prisma.ticket.findUnique({
          where: { id: resourceId },
          include: { project: true },
        });
        text = `You have been assigned a ticket: ${ticket.title}`;
        url = `/projects/${ticket.project.id}/${ticket.id}`;
      }
      if (type === "ticket_comment") {
        const comment = await prisma.comment.findUnique({
          where: { id: resourceId },
          include: { user: true, ticket: { include: { project: true } } },
        });
        text = `${comment?.user.name} commented on your ticket: ${comment?.ticket?.title}`;
        url = `/projects/${comment?.ticket?.project.id}/${comment?.ticket?.id}`;
      }
      return { text, url, ...rest };
    })
  );

  return notifications?.length ? (
    notifications
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .map((notification) => (
        <ActionButton
          key={notification.id}
          raw
          className={cn(
            "block text-left [&:not(:last-child)]:border-b border-l-2 p-3",
            notification.read ? "border-l-transparent" : "border-l-primary"
          )}
          action={async () => {
            "use server";
            if (!notification.read)
              await prisma.notification.update({
                where: { id: notification.id },
                data: { read: true },
              });
            redirect(notification.url);
          }}
        >
          <span className="break-words line-clamp-3">{notification.text}</span>
          <span className="text-sm text-muted-foreground">
            at{" "}
            {Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
              notification.timestamp
            )}
          </span>
        </ActionButton>
      ))
  ) : (
    <p className="p-3">None so far</p>
  );
}
