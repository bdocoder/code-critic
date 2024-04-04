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
import ResetDemoDataButton from "./ResetDemoDataButton";

export default function AuthPage() {
  return (
    <Card className="m-auto">
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <CardDescription>Verify your identity to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <ClientForm action={loginWithGitHub} className="flex flex-col mb-3">
          <SubmitButton className="self-stretch">
            <GitHubLogoIcon className="mr-2" />
            Continue with GitHub
          </SubmitButton>
        </ClientForm>
        <div className="flex space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex-grow" variant="ghost">
                Use a demo account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DemoLoginButton email="hamada@gmail.com">
                Hamada (Project Manager)
              </DemoLoginButton>
              <DemoLoginButton email="abdullah@gmail.com">
                Abdullah (Web Developer)
              </DemoLoginButton>
              <DemoLoginButton email="omar@gmail.com">
                Omar (UI/UX Designer)
              </DemoLoginButton>
            </DropdownMenuContent>
          </DropdownMenu>
          <ResetDemoDataButton />
        </div>
      </CardContent>
    </Card>
  );
}
