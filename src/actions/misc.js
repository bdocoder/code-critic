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
  await prisma.ticket.deleteMany({
    where: {
      OR: [{ assigneeId: { in: demoIds } }, { reporterId: { in: demoIds } }],
    },
  });
  await prisma.memberProfile.deleteMany({ where: { userId: { in: demoIds } } });
  await prisma.project.deleteMany({ where: { members: { none: {} } } });
  await prisma.notification.deleteMany({ where: { userId: { in: demoIds } } });
  await prisma.user.deleteMany({ where: { id: { in: demoIds } } });

  // DEMO DATA CREATION

  const [hamada, abdullah, omar] = await Promise.all([
    prisma.user.create({
      data: {
        email: "hamada@gmail.com",
        name: "Hamada",
        password: "hamada",
        demoAccount: true,
      },
    }),

    prisma.user.create({
      data: {
        email: "abdullah@gmail.com",
        name: "Abdullah",
        password: "abdullah",
        demoAccount: true,
      },
    }),

    prisma.user.create({
      data: {
        email: "omar@gmail.com",
        name: "Omar",
        password: "omar",
        demoAccount: true,
      },
    }),
  ]);

  const thisProject = await prisma.project.create({
    data: {
      title: "This Project",
      description:
        "A sample project resembling this site and some of its bugs.",
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

  const [ticket1, ticket2, ticket3] = await Promise.all([
    prisma.ticket.create({
      data: {
        title: "Use email & password for authentication",
        description: "GitHub shouldn't be the only way to sign in.",
        projectId: thisProject.id,
        reporterId: hamada.id,
        assigneeId: abdullah.id,
        dateReported: new Date(2024, 3, 4),
      },
    }),

    prisma.ticket.create({
      data: {
        title: "Fix word wrap in comment and ticket tables",
        projectId: thisProject.id,
        reporterId: omar.id,
        assigneeId: abdullah.id,
        dateReported: new Date(2024, 3, 4),
      },
    }),

    prisma.ticket.create({
      data: {
        title: "Implement destructive variants for dropdowns and toasts",
        description:
          "These two components shouldn't have the default look" +
          " when implying a dangerous action or an error.",
        projectId: thisProject.id,
        reporterId: omar.id,
        assigneeId: abdullah.id,
        dateReported: new Date(2024, 3, 4),
      },
    }),
  ]);

  const comment1 = await prisma.comment.create({
    data: {
      userId: hamada.id,
      content: "Consider adding other color variants as well.",
      createdAt: new Date(2024, 3, 4),
      ticketId: ticket3.id,
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: abdullah.id,
        type: "project_add",
        resourceId: thisProject.id,
        timestamp: new Date(2024, 3, 3),
      },
      {
        userId: omar.id,
        type: "project_add",
        resourceId: thisProject.id,
        timestamp: new Date(2024, 3, 3),
      },
      {
        userId: abdullah.id,
        type: "ticket_assign",
        resourceId: ticket1.id,
        timestamp: new Date(2024, 3, 4),
      },
      {
        userId: abdullah.id,
        type: "ticket_assign",
        resourceId: ticket2.id,
        timestamp: new Date(2024, 3, 4),
      },
      {
        userId: abdullah.id,
        type: "ticket_assign",
        resourceId: ticket3.id,
        timestamp: new Date(2024, 3, 4),
      },
      {
        userId: omar.id,
        type: "ticket_comment",
        resourceId: comment1.id,
        timestamp: new Date(2024, 3, 4),
      },
    ],
  });
}
