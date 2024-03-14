import { assignIssue } from "@/actions/issues";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import prisma from "@/db";
import IssueHeader from "../IssueHeader";
import { auth } from "@/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function AssignIssue({ params: { projectId, issueId } }) {
  const session = await auth();
  const id = session.user.id;

  const issue = await prisma.issue.findUnique({ where: { id: issueId } });

  const members = await prisma.memberProfile.findMany({
    where: { projectId },
    include: { user: true },
  });

  if (!members.find(({ userId }) => userId === id)?.isAdmin)
    return (
      <p className="m-auto text-2xl text-destructive">
        You can only do this action if you are an admin!
      </p>
    );

  return (
    <>
      <IssueHeader issue={issue} />
      <div className="mx-auto mt-6 text-center">
        <h1 className="mb-3 text-xl">Assign this issue to a member</h1>
        <ClientForm action={assignIssue} className="flex flex-col space-y-2">
          <input type="hidden" name="issueId" value={issueId} />
          <input type="hidden" name="projectId" value={projectId} />
          <Select name="assigneeId" required>
            <SelectTrigger>
              <SelectValue placeholder="Choose a member" />
            </SelectTrigger>
            <SelectContent>
              {members.map(({ user, role }) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} {role && `[${role}]`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <SubmitButton>Assign</SubmitButton>
        </ClientForm>
      </div>
    </>
  );
}
