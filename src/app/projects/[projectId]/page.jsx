import prisma from "@/db";
import { getUserId } from "@/utils/server";
import { Add, ArrowRight, Lock, CheckCircle } from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemDecorator,
  Table,
  Tooltip,
  Typography,
} from "@mui/joy";
import Link from "next/link";

export default async function ProjectInfo({ params: { projectId } }) {
  const id = getUserId();
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      issues: { include: { assignee: true, reporter: true } },
      members: { include: { user: true } },
    },
  });

  return (
    <Grid container spacing={2.5}>
      <Grid xs={8}>
        <Typography mb={1.5} level="title-lg">
          Issues
        </Typography>
        {project.issues.length === 0 ? (
          <Typography level="body-lg" startDecorator={<CheckCircle />}>
            None so far..
          </Typography>
        ) : (
          <Table borderAxis="xBetween">
            <tr>
              <th>Title</th>
              <th>Date Reported</th>
              <th>Status</th>
              <th style={{ width: "48px" }}></th>
            </tr>
            {project.issues.map(({ id, title, status, dateReported }) => (
              <tr key={id}>
                <td>{title}</td>
                <td>{dateReported.toDateString()}</td>
                <td>
                  <Typography color={status === "open" ? "warning" : "success"}>
                    {status.charAt(0).toUpperCase() + status.substring(1)}
                  </Typography>
                </td>
                <td>
                  <IconButton
                    variant="outlined"
                    component={Link}
                    href={`/projects/${projectId}/${id}`}
                  >
                    <ArrowRight />
                  </IconButton>
                </td>
              </tr>
            ))}
          </Table>
        )}
        <Button
          variant="outlined"
          startDecorator={<Add />}
          sx={{ marginTop: 1.5 }}
          component={Link}
          href={`/projects/${projectId}/add-issue`}
        >
          Create an issue
        </Button>
      </Grid>
      <Grid xs={4}>
        <Typography mb={1.5} level="title-lg">
          Members
        </Typography>
        <List>
          {project.members.map(({ user, isAdmin, role }) => (
            <ListItem key={user.id}>
              <ListItemDecorator>
                {isAdmin && (
                  <Tooltip title="Admin" variant="outlined">
                    <Lock />
                  </Tooltip>
                )}
              </ListItemDecorator>
              {user.name} {role && `[${role}]`} {user.id === id && "(You)"}
              {/* TODO: add user controls */}
              {/* e.g. give admin permissions or remove from the project */}
            </ListItem>
          ))}
          <ListItem>
            <ListItemButton
              component={Link}
              href={`/projects/${projectId}/add-member`}
            >
              <ListItemDecorator>
                <Add />
              </ListItemDecorator>
              Add a member
            </ListItemButton>
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
}
