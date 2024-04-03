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
            }).format(issue.createdAt)}
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
      {/* <div className="flex justify-around my-12">
      <div className="flex flex-col">
        <span className="mb-1 text-xs uppercase">Reported by</span>
        <p className="mb-6 text-lg">{issue.reporter.name}</p>
        <span className="mb-1 text-xs uppercase">Reported at</span>
        <p className="text-lg">
          {Intl.DateTimeFormat("en", { dateStyle: "full" }).format(
            issue.dateReported
          )}
        </p>
      </div>

      <div className="flex flex-col">
        <span className="mb-1 text-xs uppercase">Assigned to</span>
        <p className="mb-6 text-lg">
          {issue.assignee?.name || "None so far.."}
        </p>
        {issue.dateResolved && (
          <>
            <span className="mb-1 text-xs uppercase">Resolved at</span>
            <p className="text-lg">
              {Intl.DateTimeFormat("en", { dateStyle: "full" }).format(
                issue.dateResolved
              )}
            </p>
          </>
        )}
      </div>
    </div> */}
    </Card>
  );
}
