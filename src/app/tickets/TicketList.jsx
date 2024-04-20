import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

/**
 *
 * @param {{tickets: import("@prisma/client").Ticket[], title: string}} props
 */
export default function TicketList({ tickets, title }) {
  return (
    <div className="px-8 py-6">
      <h1 className="mb-6">{title}</h1>
      {tickets.length === 0 && <p className="text-lg">None so far.. </p>}
      <div className="flex flex-col space-y-4 max-w-max">
        {tickets.map(
          ({
            id,
            dateReported,
            description,
            status,
            projectId,
            title: ticketTitle,
          }) => (
            <Link key={id} href={`/projects/${projectId}/${id}`} passHref>
              <Card>
                <CardHeader>
                  <CardTitle>{ticketTitle}</CardTitle>
                </CardHeader>
                {description && <CardContent>{description}</CardContent>}
                <CardFooter>
                  <Badge
                    variant={status === "open" ? "destructive" : "outline"}
                    className="capitalize"
                  >
                    {status}
                  </Badge>
                  {status === "open" && (
                    <span className="ml-1 text-sm">
                      since {dateReported.toDateString()}
                    </span>
                  )}
                </CardFooter>
              </Card>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
