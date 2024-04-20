import { assignTicket } from "@/actions/tickets";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import prisma from "@/db";
import TicketHeader from "../TicketHeader";
import { auth } from "@/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function AssignTicket({
  params: { projectId, ticketId },
}) {
  const session = await auth();
  const id = session.user.id;

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

  const members = await prisma.memberProfile.findMany({
    where: { projectId },
    include: { user: true },
  });

  if (!members.find(({ userId }) => userId === id)?.isAdmin)
    return (
      <p className="m-auto text-2xl text-destructive">
        You can only do this action if you are an admin!
      </p>
    );

  return (
    <>
      <TicketHeader ticket={ticket} />
      <div className="mx-auto mt-6 text-center">
        <h1 className="mb-3 text-xl">Assign this ticket to a member</h1>
        <ClientForm action={assignTicket} className="flex flex-col space-y-2">
          <input type="hidden" name="ticketId" value={ticketId} />
          <input type="hidden" name="projectId" value={projectId} />
          <Select name="assigneeId" required>
            <SelectTrigger>
              <SelectValue placeholder="Choose a member" />
            </SelectTrigger>
            <SelectContent>
              {members.map(({ user, role }) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} {role && `[${role}]`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <SubmitButton>Assign</SubmitButton>
        </ClientForm>
      </div>
    </>
  );
}
