"use client";

import { DropdownMenuItem } from "@radix-ui/themes";
import { useTransition } from "react";

/**
 * @param {{action: () => Promise<any>} & import("@radix-ui/themes/dist/esm/components/dropdown-menu").DropdownMenuItemProps} props
 */
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
