import {Form, useNavigation} from "@remix-run/react";
import {Input} from "./ui/input";
import {Button} from "./ui/button";

export default function AuthForm({mode}: {mode: "sign-in" | "sign-up"}) {
  const {state} = useNavigation();
  const pending = state === "submitting";
  return (
    <Form method="post">
      <fieldset className="flex flex-col space-y-2" disabled={pending}>
        {mode === "sign-up" && (
          <Input name="name" placeholder="Name" required />
        )}
        <Input name="email" type="email" placeholder="Email" required />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <Button type="submit" name="intent" value={mode}>
          Continue
        </Button>
      </fieldset>
    </Form>
  );
}
