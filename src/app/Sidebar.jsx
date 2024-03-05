import { auth } from "@/auth";
import prisma from "@/db";
import { LockClosedIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button, Text, Tooltip } from "@radix-ui/themes";
import Link from "next/link";

export default async function Sidebar() {
  const session = await auth();
  const id = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { profiles: { include: { project: true } } },
  });

  return (
    <aside className="flex flex-col px-8 py-3 space-y-4 bg-accent-2">
      <Text className="uppercase" as="p" size="2" align="center">
        Projects
      </Text>
      {user.profiles.map(({ isAdmin, project }) => (
        <Link key={project.id} href={`/projects/${project.id}`} passHref>
          <Button className="w-full" variant="ghost" size="4">
            {isAdmin && (
              <Tooltip content="Admin">
                <LockClosedIcon />
              </Tooltip>
            )}
            {project.title}
          </Button>
        </Link>
      ))}
      <Link href="/projects/create" passHref>
        <Button className="w-full" variant="ghost" size="4">
          <PlusIcon />
          Create
        </Button>
      </Link>

      {/* for spacing purposes */}
      <div></div>

      <Text className="uppercase" as="p" size="2" align="center">
        Issues
      </Text>

      {/* TODO: add the count of open issues */}
      <Link href="/issues/assigned" passHref>
        <Button className="w-full" variant="ghost" size="4">
          Assigned to me
        </Button>
      </Link>
      <Link href="/issues/reported" passHref>
        <Button className="w-full" variant="ghost" size="4">
          Reported by me
        </Button>
      </Link>
    </aside>
  );
}
