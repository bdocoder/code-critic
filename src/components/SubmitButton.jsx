"use client";

import { Button } from "@radix-ui/themes";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

// /**
//  * @param {import("@radix-ui/themes/dist/esm/components/button.props") & React.HTMLProps<HTMLButtonElement>} props
//  */
/**
 * @param {import("@radix-ui/themes/dist/esm/components/button").ButtonProps} props
 */
export default function SubmitButton(props) {
  const { pending } = useFormStatus();
  return <Button disabled={pending} {...props} />;
}
