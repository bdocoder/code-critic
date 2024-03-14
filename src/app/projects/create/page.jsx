import { createProject } from "@/actions/projects";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateProject() {
  return (
    <Card className="m-auto">
      <CardHeader>
        <CardTitle>Create a project</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientForm action={createProject} className="flex flex-col space-y-2">
          <Input name="title" placeholder="Title" required />
          <Textarea
            name="description"
            placeholder="Description (optional)"
            rows={3}
          />
          <SubmitButton>Create</SubmitButton>
        </ClientForm>
      </CardContent>
    </Card>
  );
}
