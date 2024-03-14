import { addMember } from "@/actions/projects";
import { auth } from "@/auth";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import prisma from "@/db";

export default async function AddMember({ params: { projectId } }) {
  const session = await auth();
  const id = session.user.id;

  const { isAdmin } = await prisma.memberProfile.findFirst({
    where: {
      AND: [{ projectId: { equals: projectId } }, { userId: { equals: id } }],
    },
  });
  if (!isAdmin)
    return (
      <p className="m-auto text-2xl text-destructive">
        You must be an admin to view this page
      </p>
    );

  return (
    <Card className="m-auto">
      <CardHeader>
        <CardTitle>Add a member</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientForm action={addMember} className="flex flex-col space-y-2">
          <Input name="email" placeholder="Email" required />

          <Input name="role" placeholder="Role" required />

          <input name="projectId" value={projectId} type="hidden" />
          <SubmitButton>Add to project</SubmitButton>
        </ClientForm>
      </CardContent>
    </Card>
  );
}
