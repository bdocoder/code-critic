import prisma from "@/db";
import IssueList from "../IssueList";
import { auth } from "@/auth";

export default async function ReportedIssues() {
  const session = await auth();
  const id = session.user.id;
  const issues = await prisma.issue.findMany({ where: { reporterId: id } });
  return <IssueList issues={issues} title="Issues reported by me" />;
}
