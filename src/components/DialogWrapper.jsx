"use client";

import { createContext, useContext, useState } from "react";
import { Dialog } from "./ui/dialog";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export const DialogWrapperContext = createContext(null);

export default function DialogWrapper({ children, dialog }) {
  const [open, setOpen] = useState(false);

  return (
    <DialogWrapperContext.Provider value={{ setOpen }}>
      {children}
      <Dialog onOpenChange={setOpen} open={open}>
        {dialog}
      </Dialog>
    </DialogWrapperContext.Provider>
  );
}

export function DropdownDialogToggle(props) {
  const { setOpen } = useContext(DialogWrapperContext);

  return <DropdownMenuItem onClick={() => setOpen(true)} {...props} />;
}
