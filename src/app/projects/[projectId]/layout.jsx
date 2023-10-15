import prisma from "@/db";
import { Container, Divider, Stack, Typography } from "@mui/joy";

export default async function ProjectLayout({
  params: { projectId },
  children,
}) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  return (
    <Container>
      <Stack px={3} py={2} spacing={3.5} useFlexGap>
        <div>
          <Typography level="h2">{project.title}</Typography>
          {project.description && (
            <Typography level="body-lg" mt={1}>
              {project.description}
            </Typography>
          )}
        </div>
        <Divider />
        {children}
      </Stack>
    </Container>
  );
}
