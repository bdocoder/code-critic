"use client";

import { DropdownMenuItem } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * @param {{action: () => Promise<any>, reload: boolean} & import("@radix-ui/themes/dist/esm/components/dropdown-menu").DropdownMenuItemProps} props
 */
export default function ActionDropdownItem({
  action,
  reload = true,
  ...props
}) {
  const { refresh } = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await action();
          refresh();
        })
      }
      {...props}
    />
  );
}
