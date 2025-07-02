import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  basePath: "/api/auth",
});

export const { signIn, signOut, signUp, useSession, getSession, forgetPassword, sendVerificationEmail, resetPassword } =
  authClient;
