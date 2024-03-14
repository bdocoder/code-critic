"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";

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
