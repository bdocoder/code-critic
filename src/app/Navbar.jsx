import {
  Button,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Heading,
} from "@radix-ui/themes";
import LogoutButton from "./LogoutButton";
import { auth } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="flex items-center w-full col-span-2 px-3 py-2 space-x-2 bg-accent-3">
      <Heading size="5">Code Critic</Heading>
      <div style={{ flexGrow: 1 }}></div>

      {session?.user && (
        <DropdownMenuRoot>
          <DropdownMenuTrigger>
            <Button variant="ghost">{session.user.name.charAt(0)}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenuRoot>
      )}
    </header>
  );
}
