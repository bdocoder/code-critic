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
  const user1 = await prisma.user.create({
    data: {
      email: "hamada@gmail.com",
      name: "Hamada",
      password: "hamada",
      demoAccount: true,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: "omar@gmail.com",
      name: "Omar",
      password: "omar",
      demoAccount: true,
    },
  });
  const user3 = await prisma.user.create({
    data: {
      email: "ali@gmail.com",
      name: "Ali",
      password: "ali",
      demoAccount: true,
    },
  });
  const user4 = await prisma.user.create({
    data: {
      email: "essam@gmail.com",
      name: "Essam",
      password: "essam",
      demoAccount: true,
    },
  });
  await prisma.project.create({
    data: {
      title: "Awesome Project",
      description:
        "A demo project used for.. you guessed it, explanation purpose.",
      members: {
        createMany: {
          data: [
            { userId: user1.id, isAdmin: true },
            { userId: user2.id, role: "Web Developer" },
            { userId: user3.id, role: "Database Administrator" },
          ],
        },
      },
      issues: {
        createMany: {
          data: [
            {
              title: "Big Issue",
              description:
                "Nothing, just an example of an issue that doesn't exist (or does it?)",
              reporterId: user1.id,
              assigneeId: user2.id,
              dateReported: new Date(2023, 9, 5),
            },
            {
              title: "Another Big Issue",
              description: "Empty for now",
              reporterId: user4.id,
              assigneeId: user3.id,
              dateReported: new Date(2023, 9, 8),
            },
          ],
        },
      },
    },
  });
}
