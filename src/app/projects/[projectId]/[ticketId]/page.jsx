import { deleteTicket, reverseTicketStatus } from "@/actions/tickets";
import ActionButton from "@/components/ActionButton";
import prisma from "@/db";
import Link from "next/link";
import TicketHeader from "./TicketHeader";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Comments from "./Comments";
import Details from "./Details";

export default async function TicketInfo({ params: { projectId, ticketId } }) {
  const session = await auth();
  const id = session.user.id;
  const isAdmin =
    id &&
    (
      await prisma.memberProfile.findFirst({
        where: { AND: [{ projectId }, { userId: id }] },
      })
    )?.isAdmin;

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      reporter: true,
      assignee: true,
      comments: { include: { user: true } },
    },
  });
  const isAssignee = ticket.assigneeId === id;
  const isReporter = ticket.reporterId === id;

  return (
    <>
      {isAdmin || isAssignee || isReporter ? (
        <div className="flex items-center justify-between">
          <div>
            <TicketHeader ticket={ticket} showDescription />
          </div>
          <div className="flex space-x-2">
            {isAdmin && (
              <Link href={`/projects/${projectId}/${ticketId}/assign`} passHref>
                <Button>Assign</Button>
              </Link>
            )}
            {isAssignee && (
              <ActionButton
                action={async () => {
                  "use server";
                  return await reverseTicketStatus(ticketId);
                }}
              >
                Mark as {ticket.status === "open" ? "closed" : "open"}
              </ActionButton>
            )}
            {(isReporter || isAdmin) && (
              <ActionButton
                variant="destructive"
                action={async () => {
                  "use server";
                  return await deleteTicket({ ticketId, projectId });
                }}
              >
                Delete Ticket
              </ActionButton>
            )}
          </div>
        </div>
      ) : (
        <TicketHeader ticket={ticket} />
      )}

      <div className="flex flex-wrap items-start gap-8 mt-6">
        <Comments
          className="flex-grow"
          comments={ticket.comments}
          ticketId={ticketId}
          userId={id}
          projectId={ticket.projectId}
        />
        <Details ticket={ticket} />
      </div>
    </>
  );
}
