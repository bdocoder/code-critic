import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "./LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  BellIcon,
  CaretDownIcon,
  HamburgerMenuIcon,
  LockClosedIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import NotificationsList from "./NotificationsList";
import NavLink from "@/components/NavLink";
import { auth } from "@/auth";
import prisma from "@/db";

export default async function Navbar() {
  const session = await auth();
  const user =
    session?.user &&
    (await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profiles: { include: { project: true } },
        notifications: true,
      },
    }));
  const hasUnreadNotifications = user?.notifications?.some((n) => !n.read);

  return (
    <header className="flex items-center w-full px-3 py-2 space-x-4 border-b">
      <strong className="font-medium">Code Critic</strong>
      <div style={{ flexGrow: 1 }}></div>

      {user && (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="hidden md:flex">
                <CaretDownIcon className="mr-2" />
                Tickets
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              {/* TODO: add the count of open tickets */}
              <NavLink href="/tickets/assigned">Assigned to me</NavLink>
              <NavLink href="/tickets/reported">Reported by me</NavLink>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="hidden md:flex">
                <CaretDownIcon className="mr-2" />
                Projects
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              {user.profiles.map(({ project, isAdmin }) => (
                <NavLink key={project.id} href={`/projects/${project.id}`}>
                  {isAdmin && <LockClosedIcon className="mr-2" />}
                  {project.title}
                </NavLink>
              ))}
              <NavLink href="/projects/create">
                <PlusIcon className="mr-2" />
                Create
              </NavLink>
            </PopoverContent>
          </Popover>
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
              <NotificationsList notifications={user.notifications} />
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user.image} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((word) => word.charAt(0))
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="md:hidden" size="icon" variant="outline">
                <HamburgerMenuIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col w-full">
              <span className="pb-2 text-center opacity-75">Projects</span>
              {user.profiles.map(({ project, isAdmin }) => (
                <NavLink key={project.id} href={`/projects/${project.id}`}>
                  {isAdmin && <LockClosedIcon className="mr-2" />}
                  {project.title}
                </NavLink>
              ))}
              <NavLink href="/projects/create">
                <PlusIcon className="mr-2" />
                Create
              </NavLink>

              <span className="pt-3 pb-2 text-center opacity-75">Tickets</span>
              {/* TODO: add the count of open tickets */}
              <NavLink href="/tickets/assigned">Assigned to me</NavLink>
              <NavLink href="/tickets/reported">Reported by me</NavLink>
            </PopoverContent>
          </Popover>
        </>
      )}
    </header>
  );
}
