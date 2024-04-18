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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { BellIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import NotificationsList from "./NotificationsList";
import prisma from "@/db";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function Navbar() {
  const session = await auth();

  const notifications =
    session?.user?.id &&
    (await prisma.notification.findMany({
      where: { userId: session.user.id },
    }));

  const hasUnreadNotifications = notifications?.some((n) => !n.read);

  return (
    <header className="flex items-center w-full col-span-2 px-3 py-2 space-x-4 border-b">
      <strong className="font-medium">Code Critic</strong>
      <div style={{ flexGrow: 1 }}></div>

      {session?.user && (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="outline" className="relative">
                {hasUnreadNotifications && (
                  <div className="absolute w-2 h-2 rounded-full -top-1 -right-1 bg-primary" />
                )}
                <BellIcon width={16} height={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 overflow-auto max-h-80">
              <NotificationsList notifications={notifications} />
              {!notifications.length && (
                <Alert>
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  <AlertDescription>
                    If you do not see demo notifications when you expect them,
                    the reason might be that they cannot be generated within a
                    production environment, and i cannot figure out the reason.
                  </AlertDescription>
                </Alert>
              )}
            </PopoverContent>
          </Popover>

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
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </header>
  );
}
