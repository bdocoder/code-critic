import prisma from "@/db";
import { getUserId } from "@/utils/server";
import IssueList from "../IssueList";

export default async function AssignedIssues() {
  const id = getUserId();
  const issues = await prisma.issue.findMany({ where: { assigneeId: id } });
  return <IssueList issues={issues} title="Issues assigned to me" />;
}
