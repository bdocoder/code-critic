"use client";

import { demoLogin } from "@/actions/auth";
import { DropdownMenuItem } from "@radix-ui/themes";
import { useTransition } from "react";

export default function DemoLoginButton({ email, children }) {
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      disabled={pending}
      onClick={() => startTransition(() => demoLogin(email))}
    >
      {children}
    </DropdownMenuItem>
  );
}
