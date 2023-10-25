import prisma from "@/db";
import { getUserId } from "@/utils/server";
import IssueList from "../IssueList";

export default async function ReportedIssues() {
  const id = getUserId();
  const issues = await prisma.issue.findMany({ where: { reporterId: id } });
  return <IssueList issues={issues} title="Issues reported by me" />;
}
