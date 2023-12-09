import prisma from "@/db";
import { getUserId } from "@/utils/server";
import {
  ArrowRightIcon,
  DotsVerticalIcon,
  LockClosedIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import {
  Badge,
  Button,
  Card,
  DropdownMenuContent,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Heading,
  IconButton,
  TableBody,
  TableCell,
  TableColumnHeaderCell,
  TableHeader,
  TableRoot,
  TableRow,
  TableRowHeaderCell,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import Link from "next/link";
import ActionDropdownItem from "@/components/ActionDropdownItem";
import { removeMember, setAdminPermission } from "@/actions/projects";
import DialogWrapper, {
  DropdownDialogToggle,
} from "@/components/DialogWrapper";
import ChangeRoleDialog from "./ChangeRoleDialog";

export default async function ProjectInfo({ params: { projectId } }) {
  const id = getUserId();
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
      <Text as="p" size="3" mb="5">
        {project.description}
      </Text>
      <div className="flex flex-wrap gap-8">
        <div className="flex flex-col flex-grow space-y-4">
          <Heading size="4">Issues</Heading>
          {project.issues.length ? (
            <TableRoot variant="surface">
              <TableHeader>
                <TableRow>
                  <TableColumnHeaderCell>Title</TableColumnHeaderCell>
                  <TableColumnHeaderCell>Status</TableColumnHeaderCell>
                  <TableColumnHeaderCell>Report Date</TableColumnHeaderCell>
                  <TableColumnHeaderCell></TableColumnHeaderCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {project.issues.map(({ id, title, status, dateReported }) => (
                  <TableRow key={id} align="center">
                    <TableRowHeaderCell>{title}</TableRowHeaderCell>
                    <TableCell>
                      <Badge
                        color={status === "open" ? "yellow" : "green"}
                        className="capitalize"
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>{dateReported.toDateString()}</TableCell>
                    <TableCell>
                      <Link href={`/projects/${projectId}/${id}`}>
                        <IconButton variant="ghost">
                          <ArrowRightIcon />
                        </IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableRoot>
          ) : (
            <Text size="4">None so far.. </Text>
          )}
          <Link
            href={`/projects/${projectId}/add-issue`}
            passHref
            className="self-start"
          >
            <Button variant="soft">
              <PlusIcon /> Create an issue
            </Button>
          </Link>
        </div>

        <div className="flex flex-col space-y-4">
          <Heading size="4">Members</Heading>
          <Card>
            {project.members.map(({ user, isAdmin, role }) => (
              <Text
                key={user.id}
                as="p"
                className="flex items-center px-1 py-1.5"
                weight={user.id === id ? "bold" : "regular"}
              >
                {isAdmin && (
                  <Tooltip content="Admin">
                    <LockClosedIcon className="mr-2" />
                  </Tooltip>
                )}
                {user.name} {role && `[${role}]`} {user.id === id && "(You)"}
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
                    <DropdownMenuRoot>
                      <DropdownMenuTrigger>
                        <IconButton className="ml-auto" variant="ghost">
                          <DotsVerticalIcon width={16} height={16} />
                        </IconButton>
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
                        <DropdownDialogToggle>Change role</DropdownDialogToggle>
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
                    </DropdownMenuRoot>
                  </DialogWrapper>
                )}
              </Text>
            ))}
            <Link href={`/projects/${projectId}/add-member`} passHref>
              <Button variant="soft" mt="2" className="w-full">
                <PlusIcon />
                Add a member
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}
