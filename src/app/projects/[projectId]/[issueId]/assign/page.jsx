import { assignIssue } from "@/actions/issues";
import AuthRequired from "@/components/AuthRequired";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import prisma from "@/db";
import { getUserId } from "@/utils/server";
import { Option, Select, Typography } from "@mui/joy";

export default async function AssignIssue({ params: { projectId, issueId } }) {
  const id = getUserId();
  if (!id) return <AuthRequired />;

  const members = await prisma.memberProfile.findMany({
    where: { projectId },
    include: { user: true },
  });

  if (!members.find(({ userId }) => userId === id)?.isAdmin)
    return (
      <Typography color="danger" level="body-lg" m="auto">
        You can only do this action if you are an admin!
      </Typography>
    );

  return (
    <ClientForm action={assignIssue}>
      <input type="hidden" name="issueId" value={issueId} />
      <input type="hidden" name="projectId" value={projectId} />
      <Select name="assigneeId" placeholder="Choose a member" required>
        {members.map(({ user, role }) => (
          <Option key={user.id} value={user.id}>
            {user.name} {role && `[${role}]`}
          </Option>
        ))}
      </Select>
      <SubmitButton>Assign</SubmitButton>
    </ClientForm>
  );
}
