import prisma from "@/db";
import { getUserId } from "@/utils/server";
import { LockClosedIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button, Text, Tooltip } from "@radix-ui/themes";
import Link from "next/link";

export default async function Sidebar() {
  const id = getUserId();
  const user = await prisma.user.findUnique({
    where: { id },
    include: { profiles: { include: { project: true } } },
  });

  return (
    <aside className="min-w-[240px] bg-gray-3 px-8 py-3 flex flex-col space-y-4">
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
      {/* TODO: add links to browse reported or assigned issues */}
    </aside>
  );
}
