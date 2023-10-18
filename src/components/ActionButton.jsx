"use client";

import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * @param {{reload: boolean, action: () => Promise<any>} & import("@radix-ui/themes/dist/esm/components/button").ButtonProps} _
 */
export default function ActionButton({ action, reload = true, ...props }) {
  const { refresh } = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await action();
          if (reload) refresh();
        })
      }
      {...props}
    />
  );
}
