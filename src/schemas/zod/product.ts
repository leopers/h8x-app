import * as z from "zod"
import { CompleteUser, relatedUser } from "./index"

export const product = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  price: z.number().int().nullish(),
  sellerId: z.string(),
  s3UrlImage: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteProduct extends z.infer<typeof product> {
  seller: CompleteUser
}

/**
 * relatedProduct contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProduct: z.ZodSchema<CompleteProduct> = z.lazy(() => product.extend({
  seller: relatedUser,
}))
