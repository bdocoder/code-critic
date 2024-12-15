import {
  ClientActionFunctionArgs,
  Form,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import {toast} from "sonner";
import {Button} from "~/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {Input} from "~/components/ui/input";
import {authClient} from "~/lib/auth.client";
import {useEffect} from "react";
import {Separator} from "~/components/ui/separator";
import invariant from "tiny-invariant";
import {MetaFunction} from "@remix-run/node";

export const meta: MetaFunction = () => [{title: "Code Critic | Sign in"}];

export async function clientAction({request}: ClientActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  invariant(typeof email === "string" && typeof password === "string");

  const res = await authClient.signIn.email({
    email,
    password,
  });
  return res;
}

export default function SignIn() {
  const actionData = useActionData<typeof clientAction>();
  const navigate = useNavigate();
  const {state} = useNavigation();
  const pending = state !== "idle";

  useEffect(() => {
    if (actionData?.error?.message) toast.error(actionData.error.message);
    else if (actionData?.data) navigate("/");
  }, [actionData, navigate]);

  return (
    <Card className="m-auto">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <Form className="flex flex-col space-y-4" method="post">
          <Input
            name="email"
            disabled={pending}
            type="email"
            placeholder="Email"
          />

          <Input
            disabled={pending}
            type="password"
            name="password"
            placeholder="Password"
          />

          <Button type="submit" disabled={pending}>
            Continue
          </Button>

          <Separator />

          <Button asChild variant="secondary" disabled={pending}>
            <Link to="/auth/sign-up">Create an account</Link>
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
