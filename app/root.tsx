import {
  type ClientActionFunctionArgs,
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import type {LinksFunction, LoaderFunctionArgs} from "@remix-run/node";
import "./tailwind.css";
import {auth, getUser} from "./lib/auth.server";
import prisma from "./lib/prisma.server";
import {Toaster} from "./components/ui/sonner";
import invariant from "tiny-invariant";
import {authClient} from "./lib/auth.client";
import {useEffect, useMemo, useState} from "react";
import {toast} from "sonner";
import {Button} from "./components/ui/button";
import {
  ChevronDown,
  CogIcon,
  EllipsisVerticalIcon,
  HomeIcon,
  LockIcon,
  LogOutIcon,
  PlusIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {Input} from "./components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "./components/ui/sidebar";
import {Textarea} from "./components/ui/textarea";
import {Tooltip, TooltipContent, TooltipTrigger} from "./components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./components/ui/collapsible";
import UserAvatar from "./components/user-avatar";

export const links: LinksFunction = () => [
  {rel: "preconnect", href: "https://fonts.googleapis.com"},
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const navigate = useNavigate();
  const {state} = useNavigation();

  const activeProfiles = useMemo(
    () =>
      loaderData?.profiles
        .filter((profile) => profile.isActive && !profile.project.isArchived)
        .map((profile) => ({
          ...profile,
          assignedTicketCount: profile.project.tickets.reduce((acc, curr) => {
            if (curr.assigneeId === profile.id && curr.status === "open")
              return acc + 1;
            return acc;
          }, 0),
        })),
    [loaderData?.profiles],
  );
  const inactiveProfiles = useMemo(
    () =>
      loaderData?.profiles.filter(
        (profile) => profile.isAdmin && profile.project.isArchived,
      ),
    [loaderData?.profiles],
  );

  const pending = state !== "idle";

  useEffect(() => {
    if (actionData?.error) toast.error(actionData.error);
    if (actionData?.projectId) {
      navigate(`/projects/${actionData.projectId}`);
      setProjectDialogOpen(false);
    }
  }, [actionData, navigate]);

  return (
    <SidebarProvider>
      {loaderData && (
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/">
                        <HomeIcon />
                        Home
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupAction
                title="Create a project"
                onClick={() => setProjectDialogOpen(true)}
              >
                <PlusIcon />
                <span className="sr-only">Create a project</span>
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  {activeProfiles?.map((profile) => (
                    <SidebarMenuItem key={profile.id}>
                      <SidebarMenuButton asChild>
                        <Link to={`/projects/${profile.projectId}`}>
                          {profile.isAdmin ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <LockIcon />
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                Admin
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <div className="w-4"></div>
                          )}
                          {profile.project.title}
                          {!!profile.assignedTicketCount && (
                            <span className="ml-auto text-primary">
                              {profile.assignedTicketCount}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {!!inactiveProfiles?.length && (
              <Collapsible className="group/collapsible">
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                      <span>Archived Projects</span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {inactiveProfiles.map((profile) => (
                          <SidebarMenuItem key={profile.id}>
                            <SidebarMenuButton asChild>
                              <Link to={`/projects/${profile.projectId}`}>
                                {profile.isAdmin ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <LockIcon />
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                      Admin
                                    </TooltipContent>
                                  </Tooltip>
                                ) : (
                                  <div className="w-4"></div>
                                )}
                                {profile.project.title}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            )}
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center">
                <UserAvatar
                  className="mr-2"
                  src={loaderData.user.image}
                  name={loaderData.user.name}
                />
                <span className="font-medium">{loaderData.user.name}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="ml-auto" size="icon" variant="ghost">
                      <EllipsisVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => setSettingsDialogOpen(true)}
                    >
                      <CogIcon />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        authClient
                          .signOut()
                          .then(() => navigate("/auth/sign-in"))
                      }
                    >
                      <LogOutIcon />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      )}

      <main className="flex flex-col p-8 overflow-y-scroll container mx-auto relative">
        <Outlet />
      </main>

      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <Form
            className="flex flex-col space-y-4"
            onSubmit={(e) => {
              const name = (
                e.currentTarget.elements.namedItem("name") as {
                  value: string;
                } | null
              )?.value;
              const email = (
                e.currentTarget.elements.namedItem("email") as {
                  value: string;
                } | null
              )?.value;
              if (
                !name ||
                !email ||
                typeof name !== "string" ||
                typeof email !== "string"
              )
                return toast.error("Wrong data format");
              if (name !== loaderData?.user.name)
                authClient
                  .updateUser({name})
                  .then(
                    ({error}) =>
                      error &&
                      toast.error(
                        error.message ??
                          "An error occurred while updating your name!",
                      ),
                  );
              if (email !== loaderData?.user.email)
                authClient
                  .changeEmail({newEmail: email})
                  .then(
                    ({error}) =>
                      error &&
                      toast.error(
                        error.message ??
                          "An error occurred while updating your email!",
                      ),
                  );
            }}
          >
            <Input
              name="name"
              placeholder="Name"
              defaultValue={loaderData?.user.name}
              disabled={pending}
            />

            <Input
              name="email"
              placeholder="Email"
              defaultValue={loaderData?.user.email}
              disabled={pending}
            />

            <Button className="self-end" disabled={pending}>
              Save
            </Button>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a project</DialogTitle>
            <DialogDescription>
              You can add members after the project is created.
            </DialogDescription>
          </DialogHeader>
          <Form className="flex flex-col space-y-4" method="post">
            <Input
              name="title"
              placeholder="Title"
              disabled={pending}
              required
            />
            <Textarea
              name="description"
              rows={3}
              placeholder="Description (optional)"
              disabled={pending}
            />
            <Button
              className="ml-auto"
              name="intent"
              value="create-project"
              disabled={pending}
            >
              Create
            </Button>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

export async function loader({request}: LoaderFunctionArgs) {
  const session = await auth.api.getSession({headers: request.headers});
  if (!session) return null;
  const profiles = await prisma.memberProfile.findMany({
    where: {userId: session.user.id, isActive: true},
    include: {
      project: {
        include: {
          tickets: true,
        },
      },
    },
  });
  return {user: session.user, profiles};
}

export async function action({request}: ClientActionFunctionArgs) {
  const {id: userId} = await getUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create-project") {
    try {
      const title = formData.get("title");
      const description = formData.get("description") || null;
      invariant(title && typeof title === "string");
      invariant(
        (description && typeof description === "string") ||
          description === null,
      );

      const {id} = await prisma.project.create({
        data: {
          title,
          description,
          members: {create: {userId, isAdmin: true}},
        },
      });
      return {projectId: id};
    } catch {
      return {error: "Something went wrong!"};
    }
  }

  return null;
}
