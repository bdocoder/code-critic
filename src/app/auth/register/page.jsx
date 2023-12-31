import { register } from "@/actions/auth";
import ClientForm from "../AuthForm";
import SubmitButton from "@/components/SubmitButton";
import { TextFieldInput, TextFieldRoot } from "@radix-ui/themes";

export default function RegisterPage() {
  return (
    <ClientForm action={register} title="Create a new account">
      <TextFieldRoot>
        <TextFieldInput name="name" placeholder="Name" required />
      </TextFieldRoot>
      <TextFieldRoot>
        <TextFieldInput
          name="email"
          type="email"
          placeholder="Email"
          required
        />
      </TextFieldRoot>
      <TextFieldRoot>
        <TextFieldInput
          name="password"
          type="password"
          placeholder="Password"
          required
        />
      </TextFieldRoot>
      <SubmitButton>Register</SubmitButton>
    </ClientForm>
  );
}
