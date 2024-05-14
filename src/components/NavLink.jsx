import Link from "next/link";
import { Button } from "./ui/button";

export default function NavLink({ children, href, ...props }) {
  return (
    <Button
      className="w-full text-lg"
      variant="ghost"
      size="lg"
      asChild
      {...props}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
