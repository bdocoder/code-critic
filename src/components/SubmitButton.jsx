"use client";

import { Button } from "@radix-ui/themes";
import { useFormStatus } from "react-dom";

/**
 * @param {import("@radix-ui/themes/dist/esm/components/button").ButtonProps} props
 */
export default function SubmitButton(props) {
  const { pending } = useFormStatus();
  return <Button disabled={pending} {...props} />;
}
