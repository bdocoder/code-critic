import { addMember } from "@/actions/projects";
import AuthRequired from "@/components/AuthRequired";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import prisma from "@/db";
import { getUserId } from "@/utils/server";
import { Input, Typography } from "@mui/joy";

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
      <Typography m="auto" color="danger" level="title-lg">
        You must be an admin to view this page
      </Typography>
    );

  return (
    <ClientForm action={addMember}>
      <Input name="email" placeholder="Email" required />
      <Input name="role" placeholder="Role" required />
      <input name="projectId" value={projectId} type="hidden" />
      <SubmitButton>Add to project</SubmitButton>
    </ClientForm>
  );
}
