import { logout } from "@/actions/auth";
import ActionButton from "@/components/ActionButton";
import prisma from "@/db";
import { getUserId } from "@/utils/server";
import { Person } from "@mui/icons-material";
import {
  Button,
  Dropdown,
  IconButton,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import Link from "next/link";

export default async function Navbar() {
  const id = getUserId();
  const user = id ? await prisma.user.findUnique({ where: { id } }) : null;

  return (
    <Stack
      alignItems="center"
      direction="row"
      component={Sheet}
      py={1}
      px={2}
      spacing={1.5}
      minHeight={52}
    >
      <Typography level="h4">Code Critic</Typography>
      <div style={{ flexGrow: 1 }}></div>

      {user ? (
        <Dropdown>
          <MenuButton
            slots={{ root: IconButton }}
            slotProps={{ variant: "outlined" }}
          >
            <Person />
          </MenuButton>
          <Menu>
            <MenuItem color="primary" disabled>
              {user.name}
            </MenuItem>
            <ActionButton action={logout} component={MenuItem} color="danger">
              Logout
            </ActionButton>
          </Menu>
        </Dropdown>
      ) : (
        <>
          <Button component={Link} href="/auth/register">
            Create an account
          </Button>
          <Button variant="outlined" component={Link} href="/auth/login">
            Login
          </Button>
        </>
      )}
    </Stack>
  );
}
