import { Button, Dropdown, Input, Menu, MenuButton, MenuItem } from "@mui/joy";
import { demoLogin, login } from "@/actions/auth";
import ClientForm from "@/components/ClientForm";
import SubmitButton from "@/components/SubmitButton";
import ActionButton from "@/components/ActionButton";

export default function LoginPage() {
  return (
    <ClientForm action={login}>
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="password" type="password" placeholder="Password" required />
      <SubmitButton>Login</SubmitButton>
      <Dropdown>
        <MenuButton
          slots={{ root: Button }}
          slotProps={{ root: { variant: "outlined" } }}
        >
          Login with a demo account
        </MenuButton>
        <Menu>
          <ActionButton
            action={async () => {
              "use server";
              return await demoLogin("hamada@gmail.com");
            }}
            component={MenuItem}
          >
            Hamada (a PM)
          </ActionButton>
          <ActionButton
            action={async () => {
              "use server";
              return await demoLogin("omar@gmail.com");
            }}
            component={MenuItem}
          >
            Omar (a developer)
          </ActionButton>
          <ActionButton
            action={async () => {
              "use server";
              return await demoLogin("ali@gmail.com");
            }}
            component={MenuItem}
          >
            Ali (a db admin)
          </ActionButton>
        </Menu>
      </Dropdown>
    </ClientForm>
  );
}
