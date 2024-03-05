import prisma from "@/db";
import IssueList from "../IssueList";
import { auth } from "@/auth";

export default async function AssignedIssues() {
  const session = await auth();
  const id = session.user.id;
  const issues = await prisma.issue.findMany({ where: { assigneeId: id } });
  return <IssueList issues={issues} title="Issues assigned to me" />;
}
