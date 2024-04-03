import { deleteIssue, reverseIssueStatus } from "@/actions/issues";
import ActionButton from "@/components/ActionButton";
import prisma from "@/db";
import Link from "next/link";
import IssueHeader from "./IssueHeader";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Comments from "./Comments";

export default async function IssueInfo({ params: { projectId, issueId } }) {
  const session = await auth();
  const id = session.user.id;
  const isAdmin =
    id &&
    (
      await prisma.memberProfile.findFirst({
        where: { AND: [{ projectId }, { userId: id }] },
      })
    )?.isAdmin;

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      reporter: true,
      assignee: true,
      comments: { include: { user: true } },
    },
  });
  const isAssignee = issue.assigneeId === id;
  const isReporter = issue.reporterId === id;

  return (
    <>
      {isAdmin || isAssignee || isReporter ? (
        <div className="flex items-center justify-between">
          <div>
            <IssueHeader issue={issue} showDescription />
          </div>
          <div className="flex space-x-2">
            {isAdmin && (
              <Link href={`/projects/${projectId}/${issueId}/assign`} passHref>
                <Button>Assign</Button>
              </Link>
            )}
            {isAssignee && (
              <ActionButton
                action={async () => {
                  "use server";
                  return await reverseIssueStatus(issueId);
                }}
              >
                Mark as {issue.status === "open" ? "closed" : "open"}
              </ActionButton>
            )}
            {(isReporter || isAdmin) && (
              <ActionButton
                variant="destructive"
                action={async () => {
                  "use server";
                  return await deleteIssue({ issueId, projectId });
                }}
              >
                Delete Issue
              </ActionButton>
            )}
          </div>
        </div>
      ) : (
        <IssueHeader issue={issue} />
      )}

      <div className="flex justify-around my-12">
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
      </div>

      <Comments
        comments={issue.comments}
        issueId={issueId}
        userId={id}
        projectId={issue.projectId}
      />
    </>
  );
}
