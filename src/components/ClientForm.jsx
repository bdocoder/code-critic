"use client";

import { experimental_useFormState as useFormState } from "react-dom";
import { CalloutRoot, CalloutText } from "@radix-ui/themes";

/**
 * @param {{action: () => Promise} & React.HTMLProps<HTMLFormElement>} _
 */
export default function ClientForm({ action, children, ...props }) {
  const [state, formAction] = useFormState(action, { error: null });

  return (
    <form action={formAction} {...props}>
      {state?.error && (
        <CalloutRoot color="red">
          <CalloutText>{state.error}</CalloutText>
        </CalloutRoot>
      )}
      {children}
    </form>
  );
}
