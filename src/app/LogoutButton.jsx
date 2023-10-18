"use client";

import { logout } from "@/actions/auth";
import { DropdownMenuItem } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LogoutButton() {
  const { refresh } = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      disabled={pending}
      color="red"
      onClick={() => {
        startTransition(async () => {
          await logout();
          refresh();
        });
      }}
    >
      Logout
    </DropdownMenuItem>
  );
}
