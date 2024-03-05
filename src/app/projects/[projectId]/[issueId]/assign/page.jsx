import { assignIssue } from "@/actions/issues";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import prisma from "@/db";
import {
  Heading,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  Text,
} from "@radix-ui/themes";
import IssueHeader from "../IssueHeader";
import { auth } from "@/auth";

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
      <Text color="red" size="4" m="auto">
        You can only do this action if you are an admin!
      </Text>
    );

  return (
    <>
      <IssueHeader issue={issue} />
      <div className="mx-auto mt-6 text-center">
        <Heading size="4" mb="3">
          Assign this issue to a member
        </Heading>
        <ClientForm action={assignIssue} className="flex flex-col space-y-2">
          <input type="hidden" name="issueId" value={issueId} />
          <input type="hidden" name="projectId" value={projectId} />
          <SelectRoot name="assigneeId" required>
            <SelectTrigger placeholder="Choose a member" />
            <SelectContent>
              {members.map(({ user, role }) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} {role && `[${role}]`}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          <SubmitButton>Assign</SubmitButton>
        </ClientForm>
      </div>
    </>
  );
}
