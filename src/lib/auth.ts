import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  basePath: "/api/auth",
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  credentialsProvider: {
    email: {
      enabled: true,
      hashing: {
        secret: process.env.CREDENTIALS_PASSWORD_SECRET as string,
      },
      tokens: {
        secret: process.env.CREDENTIALS_TOKEN_SECRET as string,
      },
    },
  },
});
