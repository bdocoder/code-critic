"use client";

import { changeRole } from "@/actions/projects";
import ClientForm from "@/components/ClientForm";
import { DialogWrapperContext } from "@/components/DialogWrapper";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useContext } from "react";

/**
 *
 * @param {{name: string, userId: string, projectId: string, oldRole: string}} props
 */
export default function ChangeRoleDialog({ name, userId, projectId, oldRole }) {
  const { setOpen } = useContext(DialogWrapperContext);

  return (
    <DialogContent>
      <DialogTitle>Change role of {name}</DialogTitle>
      <DialogDescription className="mb-3">
        Old role is {oldRole}
      </DialogDescription>
      <ClientForm
        action={async (_, data) => {
          const result = await changeRole({
            userId,
            projectId,
            oldRole,
            newRole: data.get("newRole"),
          });
          if (result) return result; // in case there is an error
          setOpen(false);
        }}
        className="flex flex-col space-y-3"
      >
        <Input placeholder="New role" name="newRole" required />

        <div className="flex items-center justify-end space-x-2">
          <DialogClose>
            <Button variant="ghost">Close</Button>
          </DialogClose>
          <SubmitButton>Save</SubmitButton>
        </div>
      </ClientForm>
    </DialogContent>
  );
}
