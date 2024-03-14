"use client";

import { useTransition } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export default function ActionDropdownItem({ action, ...props }) {
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      disabled={pending}
      onClick={() => startTransition(action)}
      {...props}
    />
  );
}
