import { loginWithGitHub } from "@/actions/auth";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  Button,
  DropdownMenuContent,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Heading,
  Text,
} from "@radix-ui/themes";
import DemoLoginButton from "./DemoLoginButton";

export default function AuthPage() {
  return (
    <ClientForm className="flex flex-col m-auto" action={loginWithGitHub}>
      <Heading align="center" size="5" mb="1">
        Authentication
      </Heading>
      <Text mb="4">Verify your identity to continue</Text>
      <SubmitButton mb="2">
        <GitHubLogoIcon className="mr-2" />
        Continue with GitHub
      </SubmitButton>
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
    </ClientForm>
  );
}
