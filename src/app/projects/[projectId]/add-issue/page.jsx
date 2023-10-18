import { createIssue } from "@/actions/issues";
import AuthRequired from "@/components/AuthRequired";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import prisma from "@/db";
import { getUserId } from "@/utils/server";
import {
  Heading,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  TextArea,
  TextFieldInput,
  TextFieldRoot,
} from "@radix-ui/themes";

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
    <div className="mx-auto mt-4 text-center">
      <Heading size="4" mb="3">
        Create an issue
      </Heading>
      <ClientForm action={createIssue} className="flex flex-col space-y-2">
        <TextFieldRoot>
          <TextFieldInput name="title" placeholder="Title" required />
        </TextFieldRoot>

        <TextArea
          name="description"
          placeholder="Description (optional)"
          rows={3}
        />
        <input name="projectId" value={projectId} type="hidden" />
        {profile.isAdmin && (
          <SelectRoot name="assigneeId">
            <SelectTrigger placeholder="Assignee" />
            <SelectContent>
              {profile.project.members.map(({ user, role }) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} {role && `[${role}]`}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        )}
        <SubmitButton>Create</SubmitButton>
      </ClientForm>
    </div>
  );
}
