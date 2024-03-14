import { loginWithGitHub } from "@/actions/auth";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import DemoLoginButton from "./DemoLoginButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  return (
    <Card className="m-auto">
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <CardDescription>Verify your identity to continue</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <ClientForm action={loginWithGitHub} className="mb-2.5">
          <SubmitButton>
            <GitHubLogoIcon className="mr-2" />
            Continue with GitHub
          </SubmitButton>
        </ClientForm>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="mx-auto" variant="ghost">
              Use a demo account
            </Button>
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
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
