import { deleteIssue, reverseIssueStatus } from "@/actions/issues";
import ActionButton from "@/components/ActionButton";
import prisma from "@/db";
import { getUserId } from "@/utils/server";
import { Block, Warning } from "@mui/icons-material";
import { Button, Card, Grid, Stack, Typography } from "@mui/joy";
import Link from "next/link";

export default async function IssueInfo({ params: { projectId, issueId } }) {
  const id = getUserId();
  const isAdmin =
    id &&
    (
      await prisma.memberProfile.findFirst({
        where: { AND: [{ projectId }, { userId: id }] },
      })
    ).isAdmin;

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: { reporter: true, assignee: true },
  });
  const isAssignee = issue.assigneeId === id;
  const isReporter = issue.reporterId === id;

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Typography textAlign="center" level="title-lg">
            Issue: {issue.title}
          </Typography>

          {(isAdmin || isReporter || isAssignee) && (
            <Stack direction="row" spacing={1}>
              {isAdmin && (
                <Button
                  variant="solid"
                  color="primary"
                  component={Link}
                  href={`/projects/${projectId}/${issueId}/assign`}
                >
                  Assign
                </Button>
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
                  reload={false}
                  action={async () => {
                    "use server";
                    return await deleteIssue({ issueId, projectId });
                  }}
                  color="danger"
                  variant="solid"
                >
                  Delete Issue
                </ActionButton>
              )}
            </Stack>
          )}
        </Stack>
      </Grid>
      <Grid xs={8}>
        <Card>
          <Typography level="body-xs" textTransform="uppercase">
            Description
          </Typography>
          <Typography level="body-lg">{issue.description}</Typography>
        </Card>
      </Grid>
      <Grid xs={4}>
        <Card>
          <Typography level="body-xs" textTransform="uppercase">
            Report Date
          </Typography>
          <Typography level="body-lg">
            {issue.dateReported.toUTCString()}
          </Typography>
        </Card>
      </Grid>
      <Grid xs={3}>
        <Card>
          <Typography level="body-xs" textTransform="uppercase">
            Reported by
          </Typography>
          <Typography level="body-lg">{issue.reporter.name}</Typography>
        </Card>
      </Grid>
      <Grid xs={3}>
        <Card>
          <Typography level="body-xs" textTransform="uppercase">
            Assigned to
          </Typography>
          <Typography level="body-lg">
            {issue.assignee?.name || (
              <Typography startDecorator={<Block />}>None</Typography>
            )}
          </Typography>
        </Card>
      </Grid>
      <Grid xs={3}>
        <Card>
          <Typography level="body-xs" textTransform="uppercase">
            Status
          </Typography>
          <Typography
            level="body-lg"
            color={issue.status === "open" ? "warning" : "success"}
            textTransform="capitalize"
          >
            {issue.status}
          </Typography>
        </Card>
      </Grid>
      <Grid xs={3}>
        <Card>
          <Typography level="body-xs" textTransform="uppercase">
            Resolved At
          </Typography>
          <Typography level="body-lg">
            {issue.dateResolved?.toUTCString() || (
              <Typography startDecorator={<Warning />}>
                Not resolved yet
              </Typography>
            )}
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
}
