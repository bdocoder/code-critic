import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import prisma from "@/db";
import { LockClosedIcon, PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default async function Sidebar() {
  const session = await auth();
  const id = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { profiles: { include: { project: true } } },
  });

  return (
    <aside className="flex flex-col px-4 py-5 space-y-4 border-r">
      <span className="text-sm text-center uppercase">Projects</span>
      <div className="flex flex-col space-y-2">
        {user?.profiles.map(({ isAdmin, project }) => (
          <Link key={project.id} href={`/projects/${project.id}`} passHref>
            <Button className="w-full text-lg" variant="ghost" size="lg">
              {isAdmin && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <LockClosedIcon className="mr-2" />
                    </TooltipTrigger>
                    <TooltipContent>Admin</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {project.title}
            </Button>
          </Link>
        ))}
        <Link href="/projects/create" passHref>
          <Button className="w-full text-lg" variant="ghost" size="lg">
            <PlusIcon className="mr-2" />
            Create
          </Button>
        </Link>
      </div>

      {/* for spacing purposes */}
      <div></div>

      <span className="mt-4 text-sm text-center uppercase">Issues</span>

      <div className="flex flex-col space-y-2">
        {/* TODO: add the count of open issues */}
        <Link href="/issues/assigned" passHref>
          <Button className="w-full text-lg" variant="ghost" size="lg">
            Assigned to me
          </Button>
        </Link>
        <Link href="/issues/reported" passHref>
          <Button className="w-full text-lg" variant="ghost" size="lg">
            Reported by me
          </Button>
        </Link>
      </div>
    </aside>
  );
}
