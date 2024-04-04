"use server";

import prisma from "@/db";

export async function resetDemoData() {
  // OLD DATA DELETION

  const demoIds = (
    await prisma.user.findMany({
      where: { demoAccount: true },
    })
  ).map(({ id }) => id);
  await prisma.comment.deleteMany({ where: { userId: { in: demoIds } } });
  await prisma.issue.deleteMany({
    where: {
      OR: [{ assigneeId: { in: demoIds } }, { reporterId: { in: demoIds } }],
    },
  });
  await prisma.memberProfile.deleteMany({ where: { userId: { in: demoIds } } });
  await prisma.project.deleteMany({ where: { members: { none: {} } } });
  await prisma.user.deleteMany({ where: { id: { in: demoIds } } });

  // DEMO DATA CREATION

  const hamada = await prisma.user.create({
    data: {
      email: "hamada@gmail.com",
      name: "Hamada",
      password: "hamada",
      demoAccount: true,
    },
  });

  const abdullah = await prisma.user.create({
    data: {
      email: "abdullah@gmail.com",
      name: "Abdullah",
      password: "abdullah",
      demoAccount: true,
    },
  });

  const omar = await prisma.user.create({
    data: {
      email: "omar@gmail.com",
      name: "Omar",
      password: "omar",
      demoAccount: true,
    },
  });

  const thisProject = await prisma.project.create({
    data: {
      title: "This Project",
      description:
        "A sample project resembling this site and some of its issues.",
      members: {
        createMany: {
          data: [
            { userId: hamada.id, isAdmin: true },
            { userId: abdullah.id, role: "Web Developer" },
            { userId: omar.id, role: "UI/UX Designer" },
          ],
        },
      },
    },
  });

  await prisma.issue.create({
    data: {
      title: "Use email & password for authentication",
      description: "GitHub shouldn't be the only way to sign in.",
      projectId: thisProject.id,
      reporterId: hamada.id,
      assigneeId: abdullah.id,
      dateReported: new Date(2024, 3, 4),
    },
  });

  await prisma.issue.create({
    data: {
      title: "Fix word wrap in comment and issue tables",
      projectId: thisProject.id,
      reporterId: omar.id,
      assigneeId: abdullah.id,
      dateReported: new Date(2024, 3, 4),
    },
  });

  await prisma.issue.create({
    data: {
      title: "Implement destructive variants for dropdowns and toasts",
      description:
        "These two components shouldn't have the default look" +
        " when implying a dangerous action or an error.",
      projectId: thisProject.id,
      reporterId: omar.id,
      assigneeId: abdullah.id,
      dateReported: new Date(2024, 3, 4),

      comments: {
        create: {
          userId: hamada.id,
          content: "Consider adding other color variants as well.",
          createdAt: new Date(2024, 3, 4),
        },
      },
    },
  });

  await prisma.issue.create({
    data: {
      title: "Fix the text hierarchy (size, spacing, etc) in the sidebar",
      description:
        "Users should have an easy way to scan the labels and links.",
      projectId: thisProject.id,
      reporterId: omar.id,
      assigneeId: abdullah.id,
      dateReported: new Date(2024, 3, 4),
    },
  });
}
