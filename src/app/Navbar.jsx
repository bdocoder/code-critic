import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "./LogoutButton";
import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="flex items-center w-full col-span-2 px-3 py-2 space-x-2 border-b">
      <strong className="font-medium">Code Critic</strong>
      <div style={{ flexGrow: 1 }}></div>

      {session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={session.user.image} />
              <AvatarFallback>
                {session.user.name
                  .split(" ")
                  .map((word) => word.charAt(0))
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {/* <Button variant="ghost">{session.user.name.charAt(0)}</Button> */}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
