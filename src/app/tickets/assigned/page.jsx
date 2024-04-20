import prisma from "@/db";
import TicketList from "../TicketList";
import { auth } from "@/auth";

export default async function AssignedTickets() {
  const session = await auth();
  const id = session.user.id;
  const tickets = await prisma.ticket.findMany({ where: { assigneeId: id } });
  return <TicketList tickets={tickets} title="Tickets assigned to me" />;
}
