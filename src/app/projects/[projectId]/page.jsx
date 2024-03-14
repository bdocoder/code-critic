import prisma from "@/db";
import {
  ArrowRightIcon,
  DotsVerticalIcon,
  LockClosedIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import ActionDropdownItem from "@/components/ActionDropdownItem";
import { removeMember, setAdminPermission } from "@/actions/projects";
import DialogWrapper, {
  DropdownDialogToggle,
} from "@/components/DialogWrapper";
import ChangeRoleDialog from "./ChangeRoleDialog";
import { auth } from "@/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function ProjectInfo({ params: { projectId } }) {
  const session = await auth();
  const id = session.user.id;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      issues: { include: { assignee: true, reporter: true } },
      members: { include: { user: true } },
    },
  });

  const isCurrentUserAdmin = project.members.find(
    ({ userId }) => userId === id
  )?.isAdmin;

  return (
    <>
      <p className="mb-5 text-lg">{project.description}</p>
      <div className="flex flex-wrap gap-8">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Issues</CardTitle>
          </CardHeader>
          <CardContent>
            {project.issues.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Report Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {project.issues.map(({ id, title, status, dateReported }) => (
                    <TableRow key={id}>
                      <TableCell>{title}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status === "open" ? "destructive" : "outline"
                          }
                          className="capitalize"
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>{dateReported.toDateString()}</TableCell>
                      <TableCell>
                        <Link href={`/projects/${projectId}/${id}`} passHref>
                          <Button size="icon" variant="ghost">
                            <ArrowRightIcon />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-lg">None so far..</p>
            )}
          </CardContent>
          <CardFooter>
            <Link
              href={`/projects/${projectId}/add-issue`}
              passHref
              className="self-start"
            >
              <Button>
                <PlusIcon className="mr-2" />
                Create an issue
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent>
              {project.members.map(({ user, isAdmin, role }) => (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center mb-1",
                    user.id === id && "font-bold",
                    isCurrentUserAdmin && "h-9" // a fix for spacing between members
                  )}
                >
                  {isAdmin && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="hover:cursor-default">
                          <LockClosedIcon className="mr-2" />
                        </TooltipTrigger>
                        <TooltipContent>Admin</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <span className="mr-2">
                    {user.name} {role && `[${role}]`}{" "}
                    {user.id === id && "(You)"}
                  </span>
                  {isCurrentUserAdmin && id !== user.id && (
                    <DialogWrapper
                      dialog={
                        <ChangeRoleDialog
                          projectId={projectId}
                          name={user.name}
                          userId={user.id}
                          oldRole={role}
                        />
                      }
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="ml-auto"
                            size="icon"
                            variant="ghost"
                          >
                            <DotsVerticalIcon width={16} height={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <ActionDropdownItem
                            action={setAdminPermission.bind(null, {
                              userId: user.id,
                              projectId,
                              setTo: !isAdmin,
                            })}
                          >
                            {isAdmin ? "Remove admin permission" : "Make admin"}
                          </ActionDropdownItem>
                          <DropdownDialogToggle>
                            Change role
                          </DropdownDialogToggle>
                          <ActionDropdownItem
                            action={removeMember.bind(null, {
                              userId: user.id,
                              projectId,
                            })}
                            color="red"
                          >
                            Remove
                          </ActionDropdownItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </DialogWrapper>
                  )}
                </div>
              ))}
            </CardContent>
            {isCurrentUserAdmin && (
              <CardFooter>
                <Link href={`/projects/${projectId}/add-member`} passHref>
                  <Button>
                    <PlusIcon className="mr-2" />
                    Add a member
                  </Button>
                </Link>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
