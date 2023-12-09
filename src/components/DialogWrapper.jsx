"use client";

import { DialogRoot, DropdownMenuItem } from "@radix-ui/themes";
import { createContext, useContext, useState } from "react";

export const DialogWrapperContext = createContext(null);

export default function DialogWrapper({ children, dialog }) {
  const [open, setOpen] = useState(false);

  return (
    <DialogWrapperContext.Provider value={{ setOpen }}>
      {children}
      <DialogRoot onOpenChange={setOpen} open={open}>
        {dialog}
      </DialogRoot>
    </DialogWrapperContext.Provider>
  );
}

/**
 * @param {import("@radix-ui/themes/dist/esm/components/dropdown-menu").DropdownMenuItemProps} props
 */
export function DropdownDialogToggle(props) {
  const { setOpen } = useContext(DialogWrapperContext);

  return <DropdownMenuItem onClick={() => setOpen(true)} {...props} />;
}
