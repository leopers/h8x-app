import { z } from "zod";
import { product } from "@/schemas/zod";

export const createProductSchema = product
  .pick({
    name: true,
    description: true,
    price: true,
  })
  .extend({
    imagesBase64: z.array(z.string()),
  });
