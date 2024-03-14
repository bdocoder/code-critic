"use client";

import { logout } from "@/actions/auth";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";

export default function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await logout();
        });
      }}
    >
      Logout
    </DropdownMenuItem>
  );
}
