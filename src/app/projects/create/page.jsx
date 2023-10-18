import { createProject } from "@/actions/projects";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import {
  Heading,
  TextArea,
  TextFieldInput,
  TextFieldRoot,
} from "@radix-ui/themes";

export default function CreateProject() {
  return (
    <div className="m-auto text-center">
      <Heading size="4" mb="3">
        Create a project
      </Heading>
      <ClientForm action={createProject} className="flex flex-col space-y-2">
        <TextFieldRoot>
          <TextFieldInput name="title" placeholder="Title" required />
        </TextFieldRoot>
        <TextArea
          name="description"
          placeholder="Description (optional)"
          rows={3}
        />
        <SubmitButton size="3">Create</SubmitButton>
      </ClientForm>
    </div>
  );
}
