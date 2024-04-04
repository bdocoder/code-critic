"use client";

import { resetDemoData } from "@/actions/misc";
import ActionButton from "@/components/ActionButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

export default function ResetDemoDataButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <ActionButton
            action={async () => {
              try {
                await resetDemoData();
                toast("Demo data has been reset.", { dismissible: true });
              } catch {
                toast.error("An error occurred!", { dismissible: true });
              }
            }}
            variant="icon"
          >
            <ReloadIcon />
          </ActionButton>
        </TooltipTrigger>
        <TooltipContent side="bottom">Reset demo data</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
