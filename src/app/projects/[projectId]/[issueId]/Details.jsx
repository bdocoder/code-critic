import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/ui";

/**
 * @param {{issue: import("@prisma/client").Issue & {assignee: import("@prisma/client").User, reporter: import("@prisma/client").User}}} props
 */
export default function Details({ issue }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "grid grid-cols-[80px_1fr] gap-4 items-center",
            "[&_:nth-child(odd)]:text-xs [&_:nth-child(odd)]:uppercase",
            "[&_:nth-child(odd)]:opacity-75 [&_:nth-child(odd)]:text-left"
          )}
        >
          <span>Reporter</span>
          <span>{issue.reporter.name}</span>
          <span>Assignee</span>
          <span>{issue.assignee?.name || "None"}</span>
          <span>Created At</span>
          <span>
            {Intl.DateTimeFormat("en", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(issue.dateReported)}
          </span>
          {issue.status === "closed" && (
            <>
              <span>Resolved At</span>
              <span>
                {Intl.DateTimeFormat("en", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(issue.dateResolved)}
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
