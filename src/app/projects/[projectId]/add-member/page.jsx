import { addMember } from "@/actions/projects";
import AuthRequired from "@/components/AuthRequired";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import prisma from "@/db";
import { getUserId } from "@/utils/server";
import { Heading, Text, TextFieldInput, TextFieldRoot } from "@radix-ui/themes";

export default async function AddMember({ params: { projectId } }) {
  const id = getUserId();
  if (!id) return <AuthRequired />;

  const { isAdmin } = await prisma.memberProfile.findFirst({
    where: {
      AND: [{ projectId: { equals: projectId } }, { userId: { equals: id } }],
    },
  });
  if (!isAdmin)
    return (
      <Text m="auto" color="red" size="4">
        You must be an admin to view this page
      </Text>
    );

  return (
    <div className="mx-auto mt-4 text-center">
      <Heading size="4" mb="3">
        Add a member
      </Heading>
      <ClientForm action={addMember} className="flex flex-col space-y-2">
        <TextFieldRoot>
          <TextFieldInput name="email" placeholder="Email" required />
        </TextFieldRoot>
        <TextFieldRoot>
          <TextFieldInput name="role" placeholder="Role" required />
        </TextFieldRoot>
        <input name="projectId" value={projectId} type="hidden" />
        <SubmitButton>Add to project</SubmitButton>
      </ClientForm>
    </div>
  );
}
