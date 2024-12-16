import {redirect} from "@remix-run/node";

export function error(message?: string): never {
  throw redirect(`/error${message ? "?message=" + encodeURI(message) : ""}`);
}
