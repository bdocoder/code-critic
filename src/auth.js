import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db";
import { getEnvVariable } from "./utils/server";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile) {
        const user = await prisma.user.findUnique({
          where: { githubId: profile.id },
        });
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHub({
      clientId: getEnvVariable("GITHUB_ID"),
      clientSecret: getEnvVariable("GITHUB_SECRET"),

      async profile({ id, email, name, avatar_url }) {
        const user = await prisma.user.findUnique({
          where: { githubId: id, email },
        });
        if (user)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };

        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            githubId: id,
            image: avatar_url,
          },
        });
        console.log(
          `Created a new user with github id ${id} and mongo id ${newUser.id}`
        );
        return {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          image: newUser.image,
        };
      },
    }),
    Credentials({
      authorize(data) {
        const { email } = data;
        return prisma.user.findUnique({ where: { email } });
      },
    }),
  ],
});
