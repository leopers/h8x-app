import * as z from "zod"
import { CompleteSession, relatedSession, CompleteAccount, relatedAccount, CompleteProduct, relatedProduct } from "./index"

export const user = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteUser extends z.infer<typeof user> {
  sessions: CompleteSession[]
  accounts: CompleteAccount[]
  products: CompleteProduct[]
}

/**
 * relatedUser contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUser: z.ZodSchema<CompleteUser> = z.lazy(() => user.extend({
  sessions: relatedSession.array(),
  accounts: relatedAccount.array(),
  products: relatedProduct.array(),
}))
