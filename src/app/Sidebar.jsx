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
          <Button
            className="w-full text-lg"
            variant="ghost"
            size="lg"
            asChild
            key={project.id}
          >
            <Link href={`/projects/${project.id}`}>
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
            </Link>
          </Button>
        ))}
        <Button className="w-full text-lg" variant="ghost" size="lg" asChild>
          <Link href="/projects/create">
            <PlusIcon className="mr-2" />
            Create
          </Link>
        </Button>
      </div>

      {/* for spacing purposes */}
      <div></div>

      <span className="mt-4 text-sm text-center uppercase">Tickets</span>

      <div className="flex flex-col space-y-2">
        {/* TODO: add the count of open tickets */}
        <Button className="w-full text-lg" variant="ghost" size="lg" asChild>
          <Link href="/tickets/assigned">Assigned to me</Link>
        </Button>
        <Button className="w-full text-lg" variant="ghost" size="lg" asChild>
          <Link href="/tickets/reported">Reported by me</Link>
        </Button>
      </div>
    </aside>
  );
}
