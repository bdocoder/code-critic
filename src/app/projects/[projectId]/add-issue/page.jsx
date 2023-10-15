import { createIssue } from "@/actions/issues";
import AuthRequired from "@/components/AuthRequired";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import prisma from "@/db";
import { getUserId } from "@/utils/server";
import { Input, Option, Select, Textarea } from "@mui/joy";

export default async function AddIssue({ params: { projectId } }) {
  const id = getUserId();
  if (!id) return <AuthRequired />;

  const profile = await prisma.memberProfile.findFirst({
    where: { AND: [{ userId: id }, { projectId }] },
    include: {
      project: { include: { members: { include: { user: true } } } },
    },
  });

  return (
    <ClientForm action={createIssue}>
      <Input name="title" placeholder="Title" />
      <Textarea
        name="description"
        placeholder="Description (optional)"
        minRows={3}
      />
      <input name="projectId" value={projectId} type="hidden" />
      {profile.isAdmin && (
        <Select name="assigneeId" placeholder="Assignee" required>
          {profile.project.members.map(({ user, role }) => (
            <Option key={user.id} value={user.id}>
              {user.name} {role && `[${role}]`}
            </Option>
          ))}
        </Select>
      )}
      <SubmitButton>Create</SubmitButton>
    </ClientForm>
  );
}
