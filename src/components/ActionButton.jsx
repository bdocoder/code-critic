"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";

export default function ActionButton({ action, raw = false, ...props }) {
  const [pending, startTransition] = useTransition();
  const Comp = raw ? "button" : Button;

  return (
    <Comp
      disabled={pending}
      onClick={() => startTransition(action)}
      {...props}
    />
  );
}
