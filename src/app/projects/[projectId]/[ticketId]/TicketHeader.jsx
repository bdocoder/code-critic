import { Badge } from "@/components/ui/badge";

export default function TicketHeader({ ticket, showDescription = false }) {
  return (
    <>
      <div className="flex items-center mt-4 mb-1 space-x-2">
        <h2 className="text-xl">{ticket.title}</h2>
        <Badge
          variant={ticket.status === "open" ? "destructive" : "outline"}
          className="capitalize"
        >
          {ticket.status}
        </Badge>
      </div>
      {showDescription && ticket.description && <p>{ticket.description}</p>}
    </>
  );
}
