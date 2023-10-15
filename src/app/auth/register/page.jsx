import { Input } from "@mui/joy";
import { register } from "@/actions/auth";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";

export default function RegisterPage() {
  return (
    <ClientForm action={register}>
      <Input name="name" placeholder="Name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="password" type="password" placeholder="Password" required />
      <SubmitButton>Create an account</SubmitButton>
    </ClientForm>
  );
}
