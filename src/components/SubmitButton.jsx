"use client";

import { Button } from "@mui/joy";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

/**
 * @param {import("@mui/joy").ButtonProps} props
 */
export default function SubmitButton(props) {
  const { pending } = useFormStatus();
  return <Button type="submit" loading={pending} {...props} />;
}
