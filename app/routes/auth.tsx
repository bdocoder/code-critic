import {
  ClientActionFunctionArgs,
  useActionData,
  useNavigate,
} from "@remix-run/react";
import {useEffect} from "react";
import {toast} from "sonner";
import {z} from "zod";
import AuthForm from "~/components/auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "~/components/ui/tabs";
import {authClient} from "~/lib/auth.client";

export async function clientAction({request}: ClientActionFunctionArgs) {
  const formData = await request.formData();
  const schema = z.union([
    z.object({
      intent: z.literal("sign-in"),
      email: z.string().email(),
      password: z.string(),
    }),
    z.object({
      intent: z.literal("sign-up"),
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    }),
  ]);
  let data;
  try {
    data = schema.parse(Object.fromEntries(formData.entries()));
  } catch (e) {
    if (e instanceof z.ZodError) return {error: "Wrong input!"};
    return {error: JSON.stringify(e)};
  }

  const res =
    data.intent === "sign-in"
      ? await authClient.signIn.email(data)
      : await authClient.signUp.email(data);
  return res.error
    ? {error: res.error.message || "Something went wrong!"}
    : {success: true};
}

export default function AuthPage() {
  const actionData = useActionData<typeof clientAction>();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.error) toast.error(actionData?.error);
    else if (actionData?.success) navigate("/");
  }, [actionData, navigate]);

  return (
    <Card className="m-auto">
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <CardDescription>Verify your identity to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sign-in">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="sign-in">Sign in</TabsTrigger>
            <TabsTrigger value="sign-up">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <AuthForm mode="sign-in" />
          </TabsContent>
          <TabsContent value="sign-up">
            <AuthForm mode="sign-up" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
