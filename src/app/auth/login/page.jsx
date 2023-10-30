import { login } from "@/actions/auth";
import SubmitButton from "@/components/SubmitButton";
import {
  Button,
  DropdownMenuContent,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  TextFieldInput,
  TextFieldRoot,
} from "@radix-ui/themes";
import DemoLoginButton from "./DemoLoginButton";
import AuthForm from "../AuthForm";

export default function LoginPage() {
  return (
    <AuthForm title="Login to an existing account" action={login}>
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
      <div className="flex justify-between space-x-2">
        <SubmitButton className="flex-grow">Login</SubmitButton>
        <DropdownMenuRoot>
          <DropdownMenuTrigger>
            <Button variant="soft">Use a demo account</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DemoLoginButton email="hamada@gmail.com">
              Hamada (a PM)
            </DemoLoginButton>
            <DemoLoginButton email="omar@gmail.com">
              Omar (a developer)
            </DemoLoginButton>
            <DemoLoginButton email="ali@gmail.com">
              Ali (a db admin)
            </DemoLoginButton>
            <DemoLoginButton email="essam@gmail.com">
              Essam (an ordinary user)
            </DemoLoginButton>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </div>
    </AuthForm>
  );
}
