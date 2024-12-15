import type {ComponentProps} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";

export default function UserAvatar({
  src,
  name,
  ...props
}: {
  src?: string | null;
  name: string;
} & ComponentProps<typeof Avatar>) {
  return (
    <Avatar {...props}>
      <AvatarImage src={src ?? undefined} alt={`profile picture of ${name}`} />
      <AvatarFallback>
        {name
          .split(" ")
          .map((n) => n.charAt(0).toUpperCase())
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}
