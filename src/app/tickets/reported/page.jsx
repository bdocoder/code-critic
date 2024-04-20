import prisma from "@/db";
import TicketList from "../TicketList";
import { auth } from "@/auth";

export default async function ReportedTickets() {
  const session = await auth();
  const id = session.user.id;
  const tickets = await prisma.ticket.findMany({ where: { reporterId: id } });
  return <TicketList tickets={tickets} title="Tickets reported by me" />;
}
