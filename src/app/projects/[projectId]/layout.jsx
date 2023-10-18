import prisma from "@/db";
import { Heading } from "@radix-ui/themes";

export default async function ProjectLayout({
  params: { projectId },
  children,
}) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  return (
    <div className="container flex flex-col flex-grow px-8 py-6 mx-auto">
      <Heading as="h1" size="7">
        {project.title}
      </Heading>
      {children}
    </div>
  );
}
