import type {MemberProfile, Ticket, User} from "@prisma/client";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import {
  ArchiveIcon,
  BanIcon,
  CogIcon,
  LogOutIcon,
  MoreVerticalIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import {toast} from "sonner";
import invariant from "tiny-invariant";
import {z} from "zod";
import {Button} from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {Checkbox} from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {Input} from "~/components/ui/input";
import {Label} from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {Separator} from "~/components/ui/separator";
import {Sheet, SheetContent} from "~/components/ui/sheet";
import {SidebarTrigger} from "~/components/ui/sidebar";
import {Textarea} from "~/components/ui/textarea";
import UserAvatar from "~/components/user-avatar";
import {getUser} from "~/lib/auth.server";
import prisma from "~/lib/prisma.server";
import {cn} from "~/lib/ui/utils";
import {error} from "~/lib/utils.server";

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: data?.project?.title},
    {name: "description", content: data?.project?.description},
  ];
};

export async function loader({
  request,
  params: {projectId},
}: LoaderFunctionArgs) {
  invariant(projectId);
  const user = await getUser(request);
  try {
    const project = await prisma.project.findUnique({
      where: {id: projectId},
      include: {
        members: {include: {user: true}},
        tickets: {
          orderBy: [{status: "desc"}, {reportDate: "desc"}],
        },
      },
    });

    if (!project) error("This project doesn't exist!");
    const profile = project.members.find((member) => member.userId === user.id);
    if (!profile || !profile.isActive)
      error("You aren't a member of this project!");
    return {user, project};
  } catch {
    error("Something went wrong!");
  }
}

export default function Project() {
  const {user, project} = useLoaderData<typeof loader>();
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [showClosedTickets, setShowClosedTickets] = useState(false);
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const {state} = useNavigation();
  const thisProfile = useMemo(
    () => project.members.find((member) => member.userId === user.id),
    [project.members, user.id],
  );
  const membersMap = project.members.reduce(
    (acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    },
    {} as Record<string, MemberProfile & {user: User}>,
  );

  invariant(thisProfile);
  const pending = state !== "idle";

  useEffect(() => {
    if (actionData?.error) toast.error(actionData.error);
    if (actionData?.message) toast(actionData.message);
    if (actionData?.redirectTo) navigate(actionData.redirectTo);
    if (actionData?.newTicket) setCurrentTicket(actionData.newTicket);
    if (actionData?.hideTicketSheet) setCurrentTicket(null);
  }, [actionData, navigate]);

  return (
    <>
      <div className="relative">
        <h1 className="text-xl">
          <SidebarTrigger className="mr-1 md:hidden" />
          {project.title}
        </h1>
        {project.description && <h2 className="mb-4">{project.description}</h2>}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="absolute top-0 right-0"
              variant="outline"
              size="icon"
              disabled={pending}
            >
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {(thisProfile.isAdmin && (
              <>
                <DropdownMenuItem onClick={() => setSettingsDialogOpen(true)}>
                  <CogIcon />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMembersDialogOpen(true)}>
                  <UsersIcon />
                  <span>Members</span>
                </DropdownMenuItem>
                {!project.isArchived ? (
                  <DropdownMenuItem onClick={() => setArchiveDialogOpen(true)}>
                    <ArchiveIcon />
                    <span>Archive</span>
                  </DropdownMenuItem>
                ) : (
                  <Form method="post">
                    <DropdownMenuItem asChild>
                      <button
                        className="block w-full"
                        name="intent"
                        value="unarchive-project"
                      >
                        <ArchiveIcon />
                        <span>Unarchive</span>
                      </button>
                    </DropdownMenuItem>
                  </Form>
                )}
              </>
            )) || (
              <DropdownMenuItem onClick={() => setLeaveDialogOpen(true)}>
                <LogOutIcon />
                <span>Leave</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="relative bg-secondary">
        <CardHeader className="relative">
          <CardTitle>Tickets</CardTitle>
          <CardDescription>Manage all tickets here</CardDescription>
          <Form method="post">
            <Button
              className="self-start lg:absolute top-4 right-6"
              name="intent"
              value="new-ticket"
              disabled={pending}
            >
              <PlusIcon />
              <span>New ticket</span>
            </Button>
          </Form>
        </CardHeader>
        <CardContent>
          {project.tickets.length ? (
            <>
              <div className="flex items-center gap-1 mb-4">
                <Checkbox
                  id="show-closed"
                  checked={showClosedTickets}
                  onCheckedChange={() =>
                    setShowClosedTickets(!showClosedTickets)
                  }
                />
                <Label htmlFor="show-closed" className="cursor-pointer">
                  Show closed tickets
                </Label>
              </div>
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
                {project.tickets
                  .filter(
                    (ticket) => showClosedTickets || ticket.status === "open",
                  )
                  .map((ticket) => (
                    <Card
                      key={ticket.id}
                      className="cursor-pointer hover:shadow-lg"
                      onClick={() => setCurrentTicket(ticket)}
                    >
                      <CardHeader>
                        <CardTitle
                          className={cn(
                            !ticket.title && "text-muted-foreground",
                          )}
                        >
                          {ticket.title || "<NO TITLE>"}
                        </CardTitle>
                      </CardHeader>
                      {ticket.description && (
                        <CardContent className="whitespace-break-spaces">
                          {ticket.description}
                        </CardContent>
                      )}
                      <CardFooter className="gap-2">
                        <UserAvatar
                          name={membersMap[ticket.reporterId].user.name}
                          src={membersMap[ticket.reporterId].user.image}
                        />
                        <span
                          className={cn(
                            "py-1 px-3 rounded-full",
                            ticket.status === "open"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary",
                          )}
                        >
                          {ticket.status}
                        </span>
                        {ticket.assigneeId && (
                          <UserAvatar
                            className="ml-auto"
                            src={membersMap[ticket.assigneeId].user.image}
                            name={membersMap[ticket.assigneeId].user.name}
                          />
                        )}
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center gap-2 py-4">
              <BanIcon />
              <span>None so far..</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <Form className="flex flex-col space-y-4" method="post">
            <Input
              name="title"
              placeholder="Title"
              defaultValue={project.title}
              disabled={pending}
            />
            <Textarea
              rows={3}
              name="description"
              placeholder="Description (optional)"
              defaultValue={project.description ?? undefined}
            />
            <Button
              className="self-end"
              name="intent"
              value="save-project-settings"
              disabled={pending}
            >
              Save
            </Button>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={membersDialogOpen} onOpenChange={setMembersDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Members</DialogTitle>
          </DialogHeader>
          <Form
            className="flex flex-col sm:flex-row sm:items-center gap-4"
            method="post"
          >
            <Label className="shrink-0">Add a member</Label>
            <div className="flex space-x-2 sm:flex-grow">
              <Input
                className="flex-grow"
                name="email"
                placeholder="Email"
                type="email"
                disabled={pending}
              />
              <Button name="intent" value="add-member" disabled={pending}>
                <PlusIcon />
                <span className="sr-only sm:not-sr-only">Add</span>
              </Button>
            </div>
          </Form>
          <Separator />
          {project.members
            .toSorted((a, b) => Number(b.isActive) - Number(a.isActive))
            .map((member) => (
              <div key={member.id} className="flex items-center space-x-2">
                <UserAvatar src={member.user.image} name={member.user.name} />
                <span
                  className={cn(
                    "flex-grow font-medium",
                    !member.isActive && "text-muted-foreground/50",
                  )}
                >
                  {member.user.name} {member.user.id === user.id && "(You)"}
                </span>

                {thisProfile.isAdmin && member.userId !== user.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={pending}>
                        <MoreVerticalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Form method="post">
                        <input
                          type="hidden"
                          name="memberId"
                          value={member.id}
                        />
                        <DropdownMenuItem asChild>
                          <button
                            className="block w-full"
                            name="intent"
                            value="remove-member"
                          >
                            <TrashIcon />
                            Remove
                          </button>
                        </DropdownMenuItem>
                      </Form>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
        </DialogContent>
      </Dialog>

      <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to archive this project?
            </DialogTitle>
            <DialogDescription>
              This action can be undone, but other members won&apos;t be able to
              interact with the project while it&apos;s archived!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="ml-auto"
              variant="outline"
              onClick={() => setArchiveDialogOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Form method="post">
              <Button name="intent" value="archive-project" disabled={pending}>
                Archive
              </Button>
            </Form>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to leave?</DialogTitle>
            <DialogDescription>
              This action can only be undone by the admins of this project!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="ml-auto"
              variant="outline"
              onClick={() => setLeaveDialogOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Form method="post">
              <input type="hidden" name="memberId" value={thisProfile.id} />
              <Button name="intent" value="leave-project" disabled={pending}>
                Leave
              </Button>
            </Form>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet
        open={Boolean(currentTicket)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setCurrentTicket(null);
        }}
      >
        <SheetContent>
          {currentTicket && (
            <div className="relative">
              <Form method="post" className="flex flex-col">
                <input type="hidden" name="id" value={currentTicket.id} />
                <Label className="mb-2">Title</Label>
                <Input
                  className="mb-4"
                  name="title"
                  defaultValue={currentTicket.title}
                  disabled={pending}
                />
                <Label className="mb-2">Description</Label>
                <Textarea
                  className="mb-4"
                  name="description"
                  defaultValue={currentTicket.description ?? undefined}
                  rows={3}
                  disabled={pending}
                />
                <Label className="mb-2">Assignee</Label>
                <Select
                  name="assigneeId"
                  defaultValue={currentTicket.assigneeId ?? undefined}
                  disabled={pending}
                >
                  <SelectTrigger className="mb-4">
                    <SelectValue placeholder="Assignee (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {project.members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentTicket.assigneeId === thisProfile.id && (
                  <>
                    <Label className="mb-2">Status</Label>
                    <Select
                      name="status"
                      defaultValue={currentTicket.status}
                      disabled={pending}
                    >
                      <SelectTrigger className="mb-4">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}

                <Button
                  className="self-start"
                  name="intent"
                  value="update-ticket"
                  disabled={pending}
                >
                  Update
                </Button>
              </Form>

              <Form className="absolute right-0 bottom-0" method="post">
                <input type="hidden" name="id" value={currentTicket.id} />
                <Button
                  variant="destructive"
                  name="intent"
                  value="delete-ticket"
                  disabled={pending}
                >
                  Delete
                </Button>
              </Form>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

export async function action({request, params}: ActionFunctionArgs) {
  const {projectId} = params;
  const user = await getUser(request);
  const schema = z.union([
    z.object({
      intent: z.literal("save-project-settings"),
      title: z.string(),
      description: z.string().optional(),
    }),
    z.object({
      intent: z.literal("archive-project"),
    }),
    z.object({
      intent: z.literal("unarchive-project"),
    }),
    z.object({
      intent: z.literal("add-member"),
      email: z.string().email(),
    }),
    z.object({
      intent: z.literal("remove-member"),
      memberId: z.string(),
    }),
    z.object({
      intent: z.literal("leave-project"),
    }),
    z.object({
      intent: z.literal("new-ticket"),
    }),
    z.object({
      intent: z.literal("update-ticket"),
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      assigneeId: z.string().optional(),
      status: z.enum(["open", "closed"]).optional(),
    }),
    z.object({
      intent: z.literal("delete-ticket"),
      id: z.string(),
    }),
  ]);
  const formData = await request.formData();
  let data;
  try {
    data = schema.parse(Object.fromEntries(formData.entries()));
    invariant(projectId);
  } catch {
    return {error: "Illegal data format!"};
  }
  const intent = data.intent;
  try {
    switch (intent) {
      case "save-project-settings":
        await prisma.project.update({
          where: {id: projectId},
          data: {title: data.title, description: data.description},
        });
        return {message: "Settings were successfully saved."};
      case "archive-project":
        await prisma.project.update({
          where: {id: projectId},
          data: {isArchived: true},
        });
        return {redirectTo: "/"};
      case "unarchive-project":
        await prisma.project.update({
          where: {id: projectId},
          data: {isArchived: false},
        });
        break;
      case "leave-project":
        await prisma.memberProfile.updateMany({
          where: {userId: user.id, projectId},
          data: {isActive: false},
        });
        return {redirectTo: "/"};
      case "add-member":
        const _user = await prisma.user.findUnique({
          where: {email: data.email},
          include: {
            profiles: {
              where: {
                projectId,
              },
            },
          },
        });
        if (!_user) return {error: "This user doesn't exist!"};
        if (!_user.profiles.length) {
          await prisma.memberProfile.create({
            data: {
              userId: _user.id,
              projectId,
            },
          });
          break;
        }
        if (_user.profiles[0].isActive)
          return {error: "This user is already a member of the project!"};
        await prisma.memberProfile.update({
          where: {id: _user.profiles[0].id},
          data: {isActive: true},
        });
        break;

      case "remove-member":
        await prisma.memberProfile.update({
          where: {id: data.memberId},
          data: {isActive: false},
        });
        break;
      case "new-ticket":
        try {
          const reporter = await prisma.memberProfile.findFirst({
            where: {projectId, userId: user.id},
          });
          invariant(reporter);
          const newTicket = await prisma.ticket.create({
            data: {
              title: "",
              projectId,
              reporterId: reporter.id,
            },
          });
          return {newTicket};
        } catch {
          return {error: "Something went wrong!"};
        }
      case "update-ticket":
        await prisma.ticket.update({
          where: {
            id: data.id,
          },
          data: {
            title: data.title,
            description: data.description || null,
            assigneeId: data.assigneeId || null,
            status: data.status || "open",
          },
        });
        break;
      case "delete-ticket":
        await prisma.ticket.delete({
          where: {id: data.id},
        });
        return {hideTicketSheet: true};
      default:
        return {error: "Illegal data format!"};
    }
  } catch (e) {
    console.error(e);
    return {error: "Something went wrong!"};
  }

  return null;
}
