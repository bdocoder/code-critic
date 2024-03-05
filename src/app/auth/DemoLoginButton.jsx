"use client";

import { loginWithDemoAccount } from "@/actions/auth";
import { DropdownMenuItem } from "@radix-ui/themes";
import { useTransition } from "react";

export default function DemoLoginButton({ email, children }) {
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await loginWithDemoAccount(email);
        });
      }}
    >
      {children}
    </DropdownMenuItem>
  );
}
