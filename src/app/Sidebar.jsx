import prisma from "@/db";
import { getUserId } from "@/utils/server";
import { Add, Lock } from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemDecorator,
  ListSubheader,
  Sheet,
  Tooltip,
} from "@mui/joy";
import Link from "next/link";

export default async function Sidebar() {
  const id = getUserId();
  const user = await prisma.user.findUnique({
    where: { id },
    include: { profiles: { include: { project: true } } },
  });

  return (
    <Sheet sx={{ minWidth: 280 }}>
      <List>
        <ListSubheader>Projects</ListSubheader>
        {user.profiles.map(({ isAdmin, project }) => (
          <ListItem key={project.id}>
            <ListItemButton component={Link} href={`/projects/${project.id}`}>
              <ListItemDecorator>
                {isAdmin && (
                  <Tooltip title="Admin" variant="outlined">
                    <Lock />
                  </Tooltip>
                )}
              </ListItemDecorator>

              {project.title}
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem>
          <ListItemButton component={Link} href="/projects/create">
            <ListItemDecorator>
              <Add />
            </ListItemDecorator>
            Create
          </ListItemButton>
        </ListItem>

        {/* TODO: add links to browse reported or assigned issues */}
      </List>
    </Sheet>
  );
}
