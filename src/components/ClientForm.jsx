"use client";

import { experimental_useFormState as useFormState } from "react-dom";
import Alert from "@mui/joy/Alert";
import Card from "@mui/joy/Card";
import Stack from "@mui/joy/Stack";

/**
 * @param {{action: () => Promise, children: React.ReactNode}} _
 */
export default function ClientForm({ action, children }) {
  const [state, formAction] = useFormState(action, { error: null });

  return (
    <Card sx={{ margin: "auto" }}>
      <Stack spacing={2} useFlexGap component="form" action={formAction}>
        {state?.error && <Alert color="danger">{state.error}</Alert>}
        {children}
      </Stack>
    </Card>
  );
}
