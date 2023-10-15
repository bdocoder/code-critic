"use client";

import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ActionButton({ action, reload = true, ...props }) {
  const { refresh } = useRouter();
  const [pending, startTransition] = useTransition();

  const Element = props.component || Button;
  return (
    <Element
      loading={pending}
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
