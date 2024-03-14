"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function SubmitButton(props) {
  const { pending } = useFormStatus();
  return <Button disabled={pending} {...props} />;
}
