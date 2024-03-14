"use client";

import { useLayoutEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

/**
 * @param {{action: () => Promise} & React.HTMLProps<HTMLFormElement>} _
 */
export default function ClientForm({ action, children, ...props }) {
  const [state, formAction] = useFormState(action, { error: null });

  useLayoutEffect(() => {
    if (state.error) toast.error(state.error, { dismissible: true });
  }, [state]);

  return (
    <form action={formAction} {...props}>
      {children}
    </form>
  );
}
