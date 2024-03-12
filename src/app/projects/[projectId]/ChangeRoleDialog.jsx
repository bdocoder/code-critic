"use client";

import { changeRole } from "@/actions/projects";
import ClientForm from "@/components/ClientForm";
import { DialogWrapperContext } from "@/components/DialogWrapper";
import SubmitButton from "@/components/SubmitButton";
import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  TextFieldInput,
  TextFieldRoot,
} from "@radix-ui/themes";
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
      <DialogDescription mb="3">Old role is {oldRole}</DialogDescription>
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
        <TextFieldRoot>
          <TextFieldInput placeholder="New role" name="newRole" required />
        </TextFieldRoot>

        <div className="flex items-center justify-end space-x-2">
          <DialogClose>
            <Button variant="soft">Close</Button>
          </DialogClose>
          <SubmitButton>Save</SubmitButton>
        </div>
      </ClientForm>
    </DialogContent>
  );
}
