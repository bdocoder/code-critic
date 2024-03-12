"use client";

import { Button } from "@radix-ui/themes";
import { useTransition } from "react";

/**
 * @param {{action: () => Promise<any>} & import("@radix-ui/themes/dist/esm/components/button").ButtonProps} _
 */
export default function ActionButton({ action, ...props }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      disabled={pending}
      onClick={() => startTransition(action)}
      {...props}
    />
  );
}
