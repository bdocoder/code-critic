import ClientForm from "@/components/ClientForm";
import { Heading } from "@radix-ui/themes";

export default function AuthForm({ title, action, children }) {
  return (
    <div className="m-auto">
      <Heading size="5" mb="3">
        {title}
      </Heading>
      <ClientForm
        action={action}
        className="flex flex-col max-w-[240px] space-y-2 mx-auto"
      >
        {children}
      </ClientForm>
    </div>
  );
}
