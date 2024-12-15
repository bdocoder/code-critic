import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import prisma from "./prisma.server";
import {redirect} from "@remix-run/node";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    changeEmail: {
      enabled: true,
    },
  },
});

export async function getUser(request: Request) {
  const session = await auth.api.getSession({headers: request.headers});
  if (!session) throw redirect("/auth/sign-in");
  return session.user;
}
