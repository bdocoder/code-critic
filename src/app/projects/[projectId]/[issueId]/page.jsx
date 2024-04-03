import { deleteIssue, reverseIssueStatus } from "@/actions/issues";
import ActionButton from "@/components/ActionButton";
import prisma from "@/db";
import Link from "next/link";
import IssueHeader from "./IssueHeader";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Comments from "./Comments";
import Details from "./Details";

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

      <div className="flex flex-wrap items-start gap-8 mt-6">
        <Comments
          className="flex-grow"
          comments={issue.comments}
          issueId={issueId}
          userId={id}
          projectId={issue.projectId}
        />
        <Details issue={issue} />
      </div>
    </>
  );
}
