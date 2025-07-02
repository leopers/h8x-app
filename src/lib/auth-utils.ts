import { prisma } from "./prisma";
import { Session as BetterAuthSession } from "better-auth";

export type TSession = BetterAuthSession | null;

export async function verifyPassword(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return false;
  }

  const account = await prisma.account.findFirst({
    where: {
      userId: user.id,
      providerId: "credentials",
    },
  });

  if (!account) {
    return false;
  }

  return !!account.password;
}

export class HttpError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
  }
}
