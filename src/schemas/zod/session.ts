import * as z from "zod"
import { CompleteUser, relatedUser } from "./index"

export const session = z.object({
  id: z.string(),
  expiresAt: z.date(),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ipAddress: z.string().nullish(),
  userAgent: z.string().nullish(),
  userId: z.string(),
})

export interface CompleteSession extends z.infer<typeof session> {
  user: CompleteUser
}

/**
 * relatedSession contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedSession: z.ZodSchema<CompleteSession> = z.lazy(() => session.extend({
  user: relatedUser,
}))
