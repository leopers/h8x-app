import { prisma } from "@/lib/prisma";
import { TSession, HttpError } from "@/lib/auth-utils";

export function actionMiddleware<ActionFunction extends (session: TSession, ...args: any[]) => Promise<any>>(
  handler: ActionFunction
): ActionFunction {
  return (async (session: TSession, ...args: any[]): Promise<any> => {
    console.log("session", session);
    if (!session || !session.id) {
      throw new HttpError("User not authenticated", 401);
    }

    const dbSession = await prisma.session.findUnique({
      where: {
        id: session.id,
      },
    });

    if (!dbSession) {
      throw new HttpError("User not authenticated", 401);
    }

    if (dbSession?.expiresAt < new Date()) {
      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });
      throw new HttpError("Session expired", 401);
    }

    const user = await prisma.user.findUnique({
      where: {
        id: dbSession.userId,
      },
    });

    if (!user) {
      throw new HttpError("User not authenticated", 401);
    }

    return await handler(session, ...args);
  }) as ActionFunction;
}
