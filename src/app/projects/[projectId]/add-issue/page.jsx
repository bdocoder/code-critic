import { createIssue } from "@/actions/issues";
import { auth } from "@/auth";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/db";

export default async function AddIssue({ params: { projectId } }) {
  const session = await auth();
  const id = session.user.id;

  const profile = await prisma.memberProfile.findFirst({
    where: { AND: [{ userId: id }, { projectId }] },
    include: {
      project: { include: { members: { include: { user: true } } } },
    },
  });

  return (
    <Card className="w-full max-w-sm m-auto">
      <CardHeader>
        <CardTitle>Create an issue</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientForm action={createIssue} className="flex flex-col space-y-2">
          <Input name="title" placeholder="Title" required />

          <Textarea
            name="description"
            placeholder="Description (optional)"
            rows={3}
          />
          <input name="projectId" value={projectId} type="hidden" />
          {profile.isAdmin && (
            <Select name="assigneeId">
              <SelectTrigger>
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                {profile.project.members.map(({ user, role }) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} {role && `[${role}]`}{" "}
                    {user.id === id && "(You)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <SubmitButton>Create</SubmitButton>
        </ClientForm>
      </CardContent>
    </Card>
  );
}
