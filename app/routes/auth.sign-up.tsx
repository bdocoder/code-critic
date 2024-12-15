import {
  type ClientActionFunctionArgs,
  Form,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import {useEffect} from "react";
import {toast} from "sonner";
import {Button} from "~/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {Input} from "~/components/ui/input";
import {Separator} from "~/components/ui/separator";
import {authClient} from "~/lib/auth.client";
import invariant from "tiny-invariant";
import {MetaFunction} from "@remix-run/node";

export const meta: MetaFunction = () => [{title: "Code Critic | Sign up"}];

export async function clientAction({request}: ClientActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  invariant(
    typeof name === "string" &&
      typeof email === "string" &&
      typeof password === "string",
  );

  const res = await authClient.signUp.email({
    name,
    email,
    password,
  });
  return res;
}

export default function SignUp() {
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
        <CardTitle>Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form className="flex flex-col space-y-4" method="post">
          <Input name="name" placeholder="Name" disabled={pending} required />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            disabled={pending}
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            disabled={pending}
            required
          />
          <Button type="submit" disabled={pending}>
            Continue
          </Button>
          <Separator />
          <Button asChild variant="secondary" disabled={pending}>
            <Link to="/auth/sign-in">Sign in</Link>
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
