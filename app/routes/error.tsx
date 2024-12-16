import type {LoaderFunctionArgs} from "@remix-run/node";
import {Link, useLoaderData} from "@remix-run/react";
import {TriangleAlert} from "lucide-react";
import {Button} from "~/components/ui/button";

export async function loader({request}: LoaderFunctionArgs) {
  const message = new URL(request.url).searchParams.get("message");
  return message;
}

export default function ErrorPage() {
  const message = useLoaderData<typeof loader>();
  return (
    <div className="m-auto text-center">
      <h1 className="text-2xl flex items-center gap-2 mb-2">
        <TriangleAlert />
        <span>{message}</span>
      </h1>
      <Button asChild>
        <Link to="/">Home</Link>
      </Button>
    </div>
  );
}
