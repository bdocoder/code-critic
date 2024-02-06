import prisma from "@/db";
import { getUserId } from "@/utils/server";
import {
  Button,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  Heading,
} from "@radix-ui/themes";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const id = getUserId();
  const user = id ? await prisma.user.findUnique({ where: { id } }) : null;

  return (
    <header className="flex items-center w-full col-span-2 px-3 py-2 space-x-2 bg-accent-3">
      <Heading size="5">Code Critic</Heading>
      <div style={{ flexGrow: 1 }}></div>

      {user ? (
        <DropdownMenuRoot>
          <DropdownMenuTrigger>
            <Button variant="ghost">{user.name.charAt(0)}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenuRoot>
      ) : (
        <>
          <Link passHref href="/auth/register">
            <Button>Create an account</Button>
          </Link>
          <Link passHref href="/auth/login">
            <Button variant="outline">Login</Button>
          </Link>
        </>
      )}
    </header>
  );
}
