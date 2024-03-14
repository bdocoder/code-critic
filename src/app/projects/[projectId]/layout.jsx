import prisma from "@/db";

export default async function ProjectLayout({
  params: { projectId },
  children,
}) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  return (
    <div className="container flex flex-col flex-grow px-8 py-6 mx-auto">
      <h1 className="text-xl font-semibold">{project.title}</h1>
      {children}
    </div>
  );
}
