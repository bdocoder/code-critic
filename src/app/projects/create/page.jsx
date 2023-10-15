import { createProject } from "@/actions/projects";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import { Input, Textarea } from "@mui/joy";

export default function CreateProject() {
  return (
    <ClientForm action={createProject}>
      <Input name="title" placeholder="Title" required />
      <Textarea
        name="description"
        placeholder="Description (optional)"
        minRows={3}
      />
      <SubmitButton>Create</SubmitButton>
    </ClientForm>
  );
}
