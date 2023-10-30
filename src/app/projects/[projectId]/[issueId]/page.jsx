import { deleteIssue, reverseIssueStatus } from "@/actions/issues";
import ActionButton from "@/components/ActionButton";
import prisma from "@/db";
import { getUserId } from "@/utils/server";
import { Button, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import IssueHeader from "./IssueHeader";

export default async function IssueInfo({ params: { projectId, issueId } }) {
  const id = getUserId();
  const isAdmin =
    id &&
    (
      await prisma.memberProfile.findFirst({
        where: { AND: [{ projectId }, { userId: id }] },
      })
    )?.isAdmin;

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { reporter: true, assignee: true },
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
                color="red"
                reload={false}
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

      <div className="flex justify-around mt-12">
        <div>
          <div className="mb-6">
            <Heading size="1" className="mb-1 uppercase">
              Reported by
            </Heading>
            <Text as="p" size="4">
              {issue.reporter.name}
            </Text>
          </div>
          <div>
            <Heading size="1" className="mt-6 mb-1 uppercase">
              Reported at
            </Heading>
            <Text as="p" size="4">
              {Intl.DateTimeFormat("en", { dateStyle: "full" }).format(
                issue.dateReported
              )}
            </Text>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <Heading size="1" className="mb-1 uppercase">
              Assigned to
            </Heading>
            <Text as="p" size="4">
              {issue.assignee?.name || "None so far.."}
            </Text>
          </div>
          <div>
            {issue.dateResolved && (
              <>
                <Heading size="1" className="mt-6 mb-1 uppercase">
                  Resolved at
                </Heading>
                <Text as="p" size="4">
                  {Intl.DateTimeFormat("en", { dateStyle: "full" }).format(
                    issue.dateResolved
                  )}
                </Text>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
